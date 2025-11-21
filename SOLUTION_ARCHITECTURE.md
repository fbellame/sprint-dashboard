# Solution Architecture Document: Sprint Dashboard

## 1. Executive Summary

This document outlines the technical architecture for the Sprint Dashboard application, designed to automate sprint reporting from Azure DevOps CSV exports. The solution leverages **Vercel** for hosting and **Supabase** for data persistence, providing a scalable, serverless architecture optimized for performance and cost-effectiveness.

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js Frontend (React/TypeScript)          │   │
│  │  - CSV Upload & Validation                           │   │
│  │  - Dashboard UI Components                           │   │
│  │  - PDF/HTML Export                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Vercel Edge Network                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js Application (Serverless)             │   │
│  │  - Static Pages (SSG/ISR)                            │   │
│  │  - API Routes (Serverless Functions)                 │   │
│  │  - Edge Functions (CSV Processing)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
│  Supabase    │ │  Supabase   │ │  Supabase  │
│  PostgreSQL  │ │   Storage   │ │    Auth    │
│  Database    │ │  (Optional) │ │ (Optional) │
└──────────────┘ └─────────────┘ └────────────┘
```

### 2.2 Architecture Patterns

- **Serverless Architecture**: Leverages Vercel's serverless functions for API endpoints
- **Static Site Generation (SSG)**: Pre-rendered dashboard pages for optimal performance
- **Incremental Static Regeneration (ISR)**: Update dashboards without full rebuilds
- **Edge Computing**: CSV processing at the edge for low latency
- **Database-as-a-Service**: Supabase PostgreSQL for managed database operations

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with SSR/SSG | 14.x (App Router) |
| **TypeScript** | Type-safe development | 5.x |
| **React** | UI library | 18.x |
| **Tailwind CSS** | Utility-first CSS framework | 3.x |
| **PapaParse** | CSV parsing library | Latest |
| **react-pdf / jsPDF** | PDF generation | Latest |
| **Zustand / React Query** | State management & data fetching | Latest |
| **React Hook Form** | Form handling | Latest |
| **Zod** | Schema validation | Latest |

### 3.2 Backend / API

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js API Routes** | Serverless API endpoints | 14.x |
| **Vercel Edge Functions** | Edge computing for CSV processing | Latest |
| **Supabase JS Client** | Database client | Latest |
| **PostgreSQL** | Database (via Supabase) | 15.x |

### 3.3 Infrastructure

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting, CDN, Serverless Functions, Edge Network |
| **Supabase** | PostgreSQL Database, Storage (optional), Auth (future) |
| **Vercel Analytics** | Performance monitoring (optional) |

### 3.4 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |
| **Vitest / Jest** | Testing framework |
| **Playwright** | E2E testing (optional) |

---

## 4. Database Schema Design

### 4.1 Supabase Database Schema

#### 4.1.1 Core Tables

```sql
-- Sprints table: Store sprint metadata
CREATE TABLE sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_number INTEGER NOT NULL,
  sprint_name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  team_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sprint_number, team_name)
);

-- Work items table: Store parsed CSV work items
CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  work_item_id VARCHAR(50) NOT NULL, -- ADO Work Item ID
  title TEXT NOT NULL,
  work_item_type VARCHAR(50) NOT NULL, -- Story, Bug, Task, etc.
  state VARCHAR(50) NOT NULL, -- New, Active, Resolved, Closed
  story_points INTEGER,
  assigned_to VARCHAR(255),
  area_path TEXT,
  feature_name TEXT, -- Extracted from area_path
  tags TEXT[], -- Array of tags
  created_date TIMESTAMP WITH TIME ZONE,
  changed_date TIMESTAMP WITH TIME ZONE,
  closed_date TIMESTAMP WITH TIME ZONE,
  iteration_path TEXT,
  is_pi_commitment BOOLEAN DEFAULT FALSE,
  is_sprint_goal BOOLEAN DEFAULT FALSE,
  is_highlight BOOLEAN DEFAULT FALSE,
  status_indicator VARCHAR(10), -- '*', '✓', '|', '✗'
  raw_data JSONB, -- Store full CSV row for flexibility
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sprint_id, work_item_id)
);

-- Sprint configurations: User-defined settings per sprint
CREATE TABLE sprint_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  team_velocity INTEGER,
  sprint_goals JSONB, -- Array of custom sprint goals
  highlights JSONB, -- Manual highlights
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sprint_id)
);

-- CSV uploads: Track uploaded files (optional, for audit)
CREATE TABLE csv_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  row_count INTEGER,
  status VARCHAR(50) DEFAULT 'processed', -- processed, failed
  error_message TEXT
);

-- Indexes for performance
CREATE INDEX idx_work_items_sprint_id ON work_items(sprint_id);
CREATE INDEX idx_work_items_type ON work_items(work_item_type);
CREATE INDEX idx_work_items_state ON work_items(state);
CREATE INDEX idx_work_items_feature ON work_items(feature_name);
CREATE INDEX idx_work_items_tags ON work_items USING GIN(tags);
CREATE INDEX idx_sprints_number ON sprints(sprint_number);
```

#### 4.1.2 Views for Aggregated Metrics

```sql
-- View: Team Backlog Metrics
CREATE VIEW team_backlog_metrics AS
SELECT 
  sprint_id,
  COUNT(*) FILTER (WHERE created_date < (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)) AS planned_count,
  SUM(story_points) FILTER (WHERE created_date < (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)) AS planned_story_points,
  COUNT(*) FILTER (WHERE state = 'Removed' OR state = 'Deleted') AS removed_count,
  SUM(story_points) FILTER (WHERE state = 'Removed' OR state = 'Deleted') AS removed_story_points,
  COUNT(*) FILTER (WHERE created_date >= (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)) AS added_count,
  SUM(story_points) FILTER (WHERE created_date >= (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)) AS added_story_points
FROM work_items
GROUP BY sprint_id;

-- View: Stories by State
CREATE VIEW stories_by_state AS
SELECT 
  sprint_id,
  work_item_type,
  state,
  COUNT(*) AS count,
  SUM(story_points) AS story_points
FROM work_items
WHERE work_item_type IN ('User Story', 'Bug', 'Support Ticket')
GROUP BY sprint_id, work_item_type, state;

-- View: Top Features
CREATE VIEW top_features AS
SELECT 
  sprint_id,
  feature_name,
  COUNT(*) AS story_count,
  SUM(story_points) AS story_points
FROM work_items
WHERE feature_name IS NOT NULL
GROUP BY sprint_id, feature_name
ORDER BY story_points DESC;
```

#### 4.1.3 Row Level Security (RLS)

For v1.0, RLS can be disabled (public access). For future versions:

```sql
-- Enable RLS (future enhancement)
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_configurations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all sprints (v1.0)
CREATE POLICY "Public read access" ON sprints FOR SELECT USING (true);
CREATE POLICY "Public read access" ON work_items FOR SELECT USING (true);
```

---

## 5. API Design

### 5.1 API Endpoints

#### 5.1.1 Sprint Management

```
POST   /api/sprints                    Create new sprint
GET    /api/sprints                    List all sprints
GET    /api/sprints/:id                Get sprint details
PUT    /api/sprints/:id                Update sprint
DELETE /api/sprints/:id                Delete sprint
GET    /api/sprints/:id/dashboard      Get dashboard data (aggregated)
```

#### 5.1.2 CSV Upload & Processing

```
POST   /api/sprints/:id/upload       Upload CSV file
POST   /api/sprints/:id/process        Process uploaded CSV
GET    /api/sprints/:id/upload/status  Get upload status
```

#### 5.1.3 Work Items

```
GET    /api/sprints/:id/work-items      Get all work items for sprint
GET    /api/sprints/:id/work-items/:wi  Get specific work item
PUT    /api/sprints/:id/work-items/:wi  Update work item (status, tags)
```

#### 5.1.4 Dashboard Data

```
GET    /api/sprints/:id/metrics         Get aggregated metrics
GET    /api/sprints/:id/pi-commitments  Get PI commitments
GET    /api/sprints/:id/sprint-goals    Get sprint goals
GET    /api/sprints/:id/highlights      Get sprint highlights
GET    /api/sprints/:id/velocity        Get team velocity
```

#### 5.1.5 Export

```
GET    /api/sprints/:id/export/pdf      Export dashboard as PDF
GET    /api/sprints/:id/export/html     Export dashboard as HTML
```

### 5.2 API Request/Response Examples

#### Create Sprint
```typescript
POST /api/sprints
Request:
{
  "sprint_number": 31,
  "sprint_name": "Sprint 31",
  "start_date": "2024-01-15",
  "end_date": "2024-01-29",
  "team_name": "Platform Team"
}

Response:
{
  "id": "uuid",
  "sprint_number": 31,
  "sprint_name": "Sprint 31",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Upload CSV
```typescript
POST /api/sprints/:id/upload
Request: FormData with CSV file

Response:
{
  "upload_id": "uuid",
  "status": "processing",
  "row_count": 150
}
```

#### Get Dashboard Data
```typescript
GET /api/sprints/:id/dashboard

Response:
{
  "sprint": { ... },
  "pi_commitments": [
    { "title": "...", "status": "✓" }
  ],
  "sprint_goals": [ ... ],
  "highlights": [ ... ],
  "team_backlog": {
    "planned": { "count": 20, "points": 45 },
    "removed": { "count": 2, "points": 5 },
    "added": { "count": 3, "points": 8 },
    "total": { "count": 21, "points": 48 }
  },
  "stories": {
    "user_stories": {
      "new": 2,
      "active": 5,
      "resolved": 8,
      "closed": 6,
      "total": 21
    },
    "support_tickets": { ... }
  },
  "top_features": [
    { "name": "Feature A", "points": 15, "count": 5 }
  ],
  "velocity": 42
}
```

---

## 6. Frontend Architecture

### 6.1 Next.js App Router Structure

```
app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page (sprint list)
├── sprints/
│   ├── [id]/
│   │   ├── page.tsx          # Sprint dashboard view
│   │   ├── upload/
│   │   │   └── page.tsx      # CSV upload page
│   │   └── edit/
│   │       └── page.tsx      # Edit sprint config
│   └── new/
│       └── page.tsx          # Create new sprint
├── api/                      # API routes (see section 5)
└── components/
    ├── dashboard/
    │   ├── SprintHeader.tsx
    │   ├── PICommitments.tsx
    │   ├── SprintGoals.tsx
    │   ├── SprintHighlights.tsx
    │   ├── TeamBacklogTable.tsx
    │   ├── StoriesTable.tsx
    │   ├── TopFeaturesTable.tsx
    │   └── VelocityDisplay.tsx
    ├── common/
    │   ├── StatusIndicator.tsx
    │   ├── CSVUploader.tsx
    │   ├── ExportButton.tsx
    │   └── Legend.tsx
    └── layout/
        ├── Header.tsx
        └── Footer.tsx
```

### 6.2 Component Architecture

#### 6.2.1 Dashboard Components

- **SprintHeader**: Displays sprint title, dates, green accent strip
- **PICommitments**: List of PI commitments with status indicators
- **SprintGoals**: List of sprint goals with status indicators
- **SprintHighlights**: Bullet list of highlights (supports markdown)
- **TeamBacklogTable**: Metrics table (planned/removed/added/total)
- **StoriesTable**: State breakdown for User Stories and Support Tickets
- **TopFeaturesTable**: Top 3-5 features by story points
- **VelocityDisplay**: Single metric display
- **Legend**: Status indicator legend at bottom

#### 6.2.2 Shared Components

- **StatusIndicator**: Reusable status icon component (✓, ✗, |, *)
- **CSVUploader**: Drag-and-drop CSV upload with validation
- **ExportButton**: PDF/HTML export functionality
- **DataTable**: Reusable table component with formatting

### 6.3 State Management

- **Server State**: React Query for API data fetching and caching
- **Client State**: Zustand for UI state (upload progress, filters)
- **Form State**: React Hook Form for form handling

### 6.4 Styling Approach

- **Tailwind CSS**: Utility-first styling
- **Design System**: Custom color palette matching PRD requirements
  - Primary: Green (#22c55e)
  - Status: Green (#22c55e), Orange (#f97316), Red (#ef4444)
  - Background: White (#ffffff)
- **Responsive**: Mobile-first, desktop-optimized

---

## 7. CSV Processing Pipeline

### 7.1 Processing Flow

```
1. User uploads CSV file
   ↓
2. Client-side validation (file type, size)
   ↓
3. Upload to Vercel Edge Function
   ↓
4. Parse CSV (PapaParse)
   ↓
5. Validate required fields
   ↓
6. Transform data:
   - Extract feature name from Area Path
   - Parse tags array
   - Determine status indicators
   - Identify PI commitments, sprint goals, highlights
   ↓
7. Store in Supabase:
   - Insert/update work items
   - Update sprint metrics
   ↓
8. Return processing results
   ↓
9. Refresh dashboard
```

### 7.2 CSV Field Mapping

```typescript
interface CSVRow {
  'Work Item ID': string;
  'Title': string;
  'Work Item Type': string;
  'State': string;
  'Story Points': string; // May be empty
  'Assigned To': string;
  'Area Path': string;
  'Tags': string; // Comma-separated
  'Created Date': string;
  'Changed Date': string;
  'Closed Date': string;
  'Iteration Path': string;
}
```

### 7.3 Data Transformation Logic

- **Feature Extraction**: Parse Area Path (e.g., "Project\\Feature\\SubFeature" → "Feature")
- **Status Indicator**: Determine based on state and tags
  - `*` (Team Focus): Tagged with "Team Focus"
  - `✓` (Done): State = "Closed" or "Done"
  - `|` (Ongoing): State = "Active" or "Resolved"
  - `✗` (Not Done): State = "New" or "Removed"
- **PI Commitment**: Tag contains "PI Commitment"
- **Sprint Goal**: Tag contains "Sprint Goal"
- **Highlight**: Tag contains "Highlight" or "Key Achievement"

---

## 8. Deployment Strategy

### 8.1 Vercel Deployment

#### 8.1.1 Project Setup

```bash
# Initialize Next.js project
npx create-next-app@latest sprint-dashboard --typescript --tailwind --app

# Install dependencies
npm install @supabase/supabase-js papaparse jspdf react-pdf zod zustand @tanstack/react-query
```

#### 8.1.2 Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"], // US East for Supabase
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### 8.1.3 Environment Variables

```bash
# Vercel Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx (server-side only)
```

### 8.2 Supabase Setup

#### 8.2.1 Database Initialization

1. Create Supabase project
2. Run migration scripts (from section 4.1)
3. Configure connection pooling (if needed)
4. Set up backups

#### 8.2.2 Supabase Client Configuration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 8.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml (if using GitHub)
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 9. Security Considerations

### 9.1 Data Security

- **Input Validation**: Validate all CSV inputs using Zod schemas
- **SQL Injection Prevention**: Use Supabase parameterized queries
- **File Size Limits**: Max 10MB CSV files
- **Rate Limiting**: Implement rate limiting on API routes (Vercel Pro)

### 9.2 API Security

- **CORS**: Configure CORS for production domain only
- **Environment Variables**: Never expose service role key to client
- **Error Handling**: Don't expose sensitive error details to client

### 9.3 Future Enhancements

- **Authentication**: Supabase Auth for multi-user support
- **Authorization**: RLS policies for data access control
- **Audit Logging**: Track all data modifications

---

## 10. Performance Optimization

### 10.1 Frontend Optimization

- **Static Generation**: Pre-render sprint list pages
- **ISR**: Revalidate dashboard pages every 60 seconds
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports for heavy components
- **Lazy Loading**: Load CSV parser only when needed

### 10.2 Backend Optimization

- **Database Indexing**: Indexes on frequently queried columns
- **Query Optimization**: Use database views for aggregations
- **Caching**: Cache dashboard data in React Query
- **Edge Functions**: Process CSV at edge for low latency
- **Connection Pooling**: Use Supabase connection pooling

### 10.3 CSV Processing Optimization

- **Streaming Parsing**: Parse large CSVs in chunks
- **Background Processing**: Process CSV asynchronously
- **Progress Updates**: WebSocket or polling for upload status

---

## 11. Monitoring & Observability

### 11.1 Application Monitoring

- **Vercel Analytics**: Track page views and performance
- **Error Tracking**: Sentry or Vercel Error Tracking
- **Logging**: Structured logging in API routes

### 11.2 Database Monitoring

- **Supabase Dashboard**: Monitor query performance
- **Database Metrics**: Track connection count, query time
- **Alerts**: Set up alerts for high error rates

---

## 12. Scalability Considerations

### 12.1 Current Architecture (v1.0)

- **Single Team**: Designed for one team's sprint data
- **Manual Upload**: CSV upload per sprint
- **No Real-time**: Static dashboard updates

### 12.2 Future Scalability

- **Multi-team Support**: Add team_id to all tables
- **Direct ADO Integration**: Background jobs for data sync
- **Real-time Updates**: Supabase Realtime subscriptions
- **Caching Layer**: Redis for frequently accessed data
- **CDN**: Vercel Edge Network for global distribution

---

## 13. Development Workflow

### 13.1 Local Development

```bash
# Setup
npm install
cp .env.example .env.local
# Add Supabase credentials

# Run dev server
npm run dev

# Run database migrations
npm run db:migrate

# Run tests
npm test
```

### 13.2 Database Migrations

Use Supabase CLI for migrations:

```bash
# Initialize
supabase init

# Create migration
supabase migration new create_sprints_table

# Apply migration
supabase db push
```

---

## 14. Testing Strategy

### 14.1 Unit Tests

- **Components**: Test React components with React Testing Library
- **Utilities**: Test CSV parsing, data transformation
- **API Routes**: Test API endpoints with mocked Supabase client

### 14.2 Integration Tests

- **Database**: Test database queries and views
- **CSV Processing**: Test end-to-end CSV upload and processing
- **API Integration**: Test API routes with test database

### 14.3 E2E Tests (Optional)

- **User Workflows**: Test complete sprint creation and dashboard generation
- **Export Functionality**: Test PDF/HTML export

---

## 15. Cost Estimation

### 15.1 Vercel Costs

- **Hobby Plan**: Free for development
- **Pro Plan**: $20/month (recommended for production)
  - Unlimited bandwidth
  - 100GB bandwidth
  - Serverless function execution

### 15.2 Supabase Costs

- **Free Tier**: Suitable for MVP
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth
- **Pro Plan**: $25/month (if needed)
  - 8GB database
  - 100GB file storage
  - 250GB bandwidth

### 15.3 Estimated Monthly Cost (MVP)

- **Development**: $0 (Free tiers)
- **Production (Small Team)**: $45/month (Vercel Pro + Supabase Pro)

---

## 16. Risk Mitigation

### 16.1 Technical Risks

| Risk | Mitigation |
|------|------------|
| CSV format changes | Flexible parsing, field mapping configuration |
| Large file processing | Streaming parser, background jobs |
| Database performance | Indexing, query optimization, connection pooling |
| Vercel function timeouts | Optimize processing, use Edge Functions |

### 16.2 Operational Risks

| Risk | Mitigation |
|------|------------|
| Data loss | Supabase automatic backups |
| Service downtime | Vercel/Supabase SLA, monitoring alerts |
| Cost overruns | Set up billing alerts, monitor usage |

---

## 17. Implementation Phases

### 17.1 Phase 1: MVP (v1.0)

1. **Week 1-2**: Project setup, database schema, basic UI
2. **Week 3-4**: CSV upload and parsing
3. **Week 5-6**: Dashboard components and calculations
4. **Week 7**: Export functionality (PDF/HTML)
5. **Week 8**: Testing, bug fixes, deployment

### 17.2 Phase 2: Enhancements

- Direct ADO API integration
- Historical trends
- Multi-sprint comparison
- User authentication

---

## 18. Success Metrics

### 18.1 Technical Metrics

- **Page Load Time**: < 2 seconds
- **CSV Processing**: < 10 seconds for 10MB file
- **API Response Time**: < 500ms (p95)
- **Uptime**: > 99.9%

### 18.2 Business Metrics

- **Time Saved**: 80% reduction in reporting time
- **User Adoption**: 100% of sprint reviews use dashboard
- **Data Accuracy**: Zero calculation errors

---

## 19. Appendix

### 19.1 Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "papaparse": "^5.4.1",
    "jspdf": "^2.5.1",
    "zod": "^3.22.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

### 19.2 Reference Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [PapaParse Documentation](https://www.papaparse.com/)

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Author**: Solution Architecture Team  
**Status**: Approved for Implementation

