# User Stories: Sprint Dashboard

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Author**: Product Owner  
**Status**: Ready for Sprint Planning

---

## Overview

This document contains all user stories for the Sprint Dashboard application, organized by sprint. Stories are written from the perspective of the primary users (Product Manager, Scrum Master, Team Lead) and include acceptance criteria, story points, and dependencies.

---

## Sprint 0: Infrastructure & Foundation

**Goal**: Establish the foundational infrastructure, development environment, and database schema to support the Sprint Dashboard application.

**Duration**: 1-2 weeks  
**Focus**: Technical setup, no user-facing features

---

### Story 0.1: Initialize Next.js Project with TypeScript
**As a** developer  
**I want** a Next.js project initialized with TypeScript and Tailwind CSS  
**So that** I have a solid foundation for building the Sprint Dashboard application

**Acceptance Criteria**:
- [ ] Next.js 14.x project created with App Router
- [ ] TypeScript 5.x configured with strict mode
- [ ] Tailwind CSS 3.x installed and configured
- [ ] ESLint and Prettier configured
- [ ] Project structure follows Next.js App Router conventions
- [ ] Basic layout component created
- [ ] Development server runs without errors

**Story Points**: 3  
**Dependencies**: None  
**Technical Notes**: Use `npx create-next-app@latest` with TypeScript and Tailwind flags

**Implementation Details**:
- Command: `npx create-next-app@latest sprint-dashboard --typescript --tailwind --app --no-src-dir`
- Project structure:
  ```
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
  lib/
  public/
  ```
- TypeScript config: Enable `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- Tailwind config: Custom colors for green (#22c55e), orange (#f97316), red (#ef4444)
- ESLint: Use Next.js recommended config, add custom rules
- Prettier: Configure with 2-space indentation, single quotes, trailing commas

**Testing**:
- Verify dev server starts: `npm run dev`
- Verify build succeeds: `npm run build`
- Verify linting passes: `npm run lint`

---

### Story 0.2: Set Up Supabase Project and Database Connection
**As a** developer  
**I want** a Supabase project created and connected to the Next.js application  
**So that** I can store and retrieve sprint data

**Acceptance Criteria**:
- [ ] Supabase project created
- [ ] Environment variables configured (`.env.local` and Vercel)
- [ ] Supabase client library installed (`@supabase/supabase-js`)
- [ ] Client-side Supabase client configured (`lib/supabase.ts`)
- [ ] Server-side Supabase admin client configured
- [ ] Connection tested with a simple query
- [ ] Environment variables documented in `.env.example`

**Story Points**: 5  
**Dependencies**: Story 0.1  
**Technical Notes**: Use Supabase free tier for development

---

### Story 0.3: Create Database Schema and Migrations
**As a** developer  
**I want** the database schema created with all required tables and views  
**So that** sprint data can be stored and queried efficiently

**Acceptance Criteria**:
- [ ] `sprints` table created with all required fields
- [ ] `work_items` table created with all required fields and foreign keys
- [ ] `sprint_configurations` table created
- [ ] `csv_uploads` table created (optional, for audit)
- [ ] All indexes created for performance
- [ ] Database views created:
  - [ ] `team_backlog_metrics` view
  - [ ] `stories_by_state` view
  - [ ] `top_features` view
- [ ] Migration scripts created and tested
- [ ] Schema documented in code comments

**Story Points**: 8  
**Dependencies**: Story 0.2  
**Technical Notes**: Use Supabase CLI for migrations or SQL editor

**Implementation Details**:
- Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql`
- Tables to create:
  - `sprints`: id (UUID), sprint_number (INT), sprint_name (VARCHAR), start_date (DATE), end_date (DATE), team_name (VARCHAR), timestamps
  - `work_items`: id (UUID), sprint_id (FK), work_item_id (VARCHAR), title (TEXT), work_item_type (VARCHAR), state (VARCHAR), story_points (INT), assigned_to (VARCHAR), area_path (TEXT), feature_name (TEXT), tags (TEXT[]), dates, flags, raw_data (JSONB)
  - `sprint_configurations`: id (UUID), sprint_id (FK), team_velocity (INT), sprint_goals (JSONB), highlights (JSONB)
  - `csv_uploads`: id (UUID), sprint_id (FK), file_name (VARCHAR), file_size (INT), upload_date (TIMESTAMP), row_count (INT), status (VARCHAR), error_message (TEXT)
- Indexes:
  - `idx_work_items_sprint_id`, `idx_work_items_type`, `idx_work_items_state`, `idx_work_items_feature`, `idx_work_items_tags` (GIN), `idx_sprints_number`
- Views: Use FILTER clauses for aggregations, handle NULL values
- Constraints: Foreign keys with CASCADE delete, unique constraints
- Test migrations: Rollback and reapply to verify

**Edge Cases**:
- Handle NULL story_points in aggregations (use COALESCE or FILTER)
- Handle empty tags arrays
- Handle missing feature names in top_features view
- Handle sprint date edge cases (items created exactly on start_date)

---

### Story 0.4: Set Up State Management and Data Fetching
**As a** developer  
**I want** state management and data fetching libraries configured  
**So that** I can efficiently manage application state and API calls

**Acceptance Criteria**:
- [ ] Zustand installed and configured for client state
- [ ] React Query (`@tanstack/react-query`) installed and configured
- [ ] React Query provider added to root layout
- [ ] Basic store structure created (e.g., `stores/sprintStore.ts`)
- [ ] API client utilities created (`lib/api.ts`)
- [ ] Error handling utilities created
- [ ] Loading states handled consistently

**Story Points**: 5  
**Dependencies**: Story 0.1  
**Technical Notes**: Set up React Query with proper error boundaries

---

### Story 0.5: Configure Development Tools and Git Hooks
**As a** developer  
**I want** development tools and Git hooks configured  
**So that** code quality is maintained and development workflow is smooth

**Acceptance Criteria**:
- [ ] ESLint configured with Next.js rules
- [ ] Prettier configured with consistent formatting rules
- [ ] Husky installed and configured
- [ ] Pre-commit hook runs linting and formatting
- [ ] Pre-push hook runs tests (if applicable)
- [ ] VS Code settings configured (`.vscode/settings.json`)
- [ ] Git ignore file configured (`.gitignore`)
- [ ] README.md with setup instructions

**Story Points**: 3  
**Dependencies**: Story 0.1  
**Technical Notes**: Use Husky for Git hooks, configure Prettier to work with ESLint

---

### Story 0.6: Set Up Vercel Deployment and CI/CD
**As a** developer  
**I want** Vercel deployment configured with CI/CD pipeline  
**So that** the application can be deployed automatically

**Acceptance Criteria**:
- [ ] Vercel project created and linked to repository
- [ ] `vercel.json` configuration file created
- [ ] Environment variables configured in Vercel dashboard
- [ ] GitHub Actions workflow created (if using GitHub)
- [ ] Automatic deployment on push to main branch
- [ ] Preview deployments for pull requests
- [ ] Deployment documentation created

**Story Points**: 5  
**Dependencies**: Story 0.1, Story 0.2  
**Technical Notes**: Configure Vercel for Next.js, set up environment variables

---

### Story 0.7: Create Design System and Base Components
**As a** developer  
**I want** a design system with base components and color palette  
**So that** UI components can be built consistently

**Acceptance Criteria**:
- [ ] Tailwind color palette configured matching PRD:
  - [ ] Primary green (#22c55e)
  - [ ] Status colors (green, orange #f97316, red #ef4444)
  - [ ] Background white (#ffffff)
- [ ] Typography system configured
- [ ] Base button component created
- [ ] Base input component created
- [ ] Base table component created
- [ ] Status indicator component created (✓, ✗, |, *)
- [ ] Design tokens documented

**Story Points**: 5  
**Dependencies**: Story 0.1  
**Technical Notes**: Create reusable components in `components/common/`

---

### Story 0.8: Set Up Testing Framework
**As a** developer  
**I want** a testing framework configured  
**So that** I can write and run tests for the application

**Acceptance Criteria**:
- [ ] Vitest or Jest installed and configured
- [ ] React Testing Library installed
- [ ] Test utilities created (`lib/test-utils.tsx`)
- [ ] Sample component test written
- [ ] Sample API route test written
- [ ] Test scripts added to `package.json`
- [ ] Test coverage configuration (optional)

**Story Points**: 5  
**Dependencies**: Story 0.1  
**Technical Notes**: Use Vitest for faster tests, React Testing Library for component tests

---

**Sprint 0 Total Story Points**: 39

---

## Sprint 1: Sprint Management & CSV Upload

**Goal**: Enable users to create sprints and upload CSV files from Azure DevOps.

**Duration**: 2 weeks  
**Focus**: Core data ingestion functionality

---

### Story 1.1: Create Sprint Management API Endpoints
**As a** developer  
**I want** API endpoints for sprint CRUD operations  
**So that** sprints can be created, read, updated, and deleted

**Acceptance Criteria**:
- [ ] `POST /api/sprints` - Create new sprint
- [ ] `GET /api/sprints` - List all sprints
- [ ] `GET /api/sprints/:id` - Get sprint details
- [ ] `PUT /api/sprints/:id` - Update sprint
- [ ] `DELETE /api/sprints/:id` - Delete sprint
- [ ] All endpoints validate input using Zod schemas
- [ ] Error handling returns appropriate HTTP status codes
- [ ] API responses follow consistent format
- [ ] Unit tests for all endpoints

**Story Points**: 8  
**Dependencies**: Story 0.2, Story 0.3  
**Technical Notes**: Use Next.js API routes, validate with Zod

---

### Story 1.2: Build Sprint Creation Form
**As a** product manager  
**I want** to create a new sprint with basic information  
**So that** I can start tracking sprint data

**Acceptance Criteria**:
- [ ] Form page at `/sprints/new`
- [ ] Form fields:
  - [ ] Sprint number (required, integer)
  - [ ] Sprint name (required, text)
  - [ ] Start date (date picker)
  - [ ] End date (date picker)
  - [ ] Team name (optional, text)
- [ ] Form validation (client and server-side)
- [ ] Success message and redirect to sprint detail page
- [ ] Error handling for duplicate sprint numbers
- [ ] Responsive design

**Story Points**: 5  
**Dependencies**: Story 1.1, Story 0.7  
**Technical Notes**: Use React Hook Form, Zod validation

---

### Story 1.3: Build Sprint List Page
**As a** product manager  
**I want** to see a list of all sprints  
**So that** I can navigate to existing sprints

**Acceptance Criteria**:
- [ ] Home page (`/`) displays list of sprints
- [ ] Sprint cards show:
  - [ ] Sprint number and name
  - [ ] Start and end dates
  - [ ] Team name
  - [ ] Created date
- [ ] Clicking sprint card navigates to sprint detail page
- [ ] Sprints sorted by sprint number (descending)
- [ ] Empty state when no sprints exist
- [ ] Loading state while fetching sprints
- [ ] Responsive grid layout

**Story Points**: 5  
**Dependencies**: Story 1.1, Story 0.4  
**Technical Notes**: Use React Query for data fetching

---

### Story 1.4: Implement CSV Upload Component
**As a** product manager  
**I want** to upload CSV files from Azure DevOps  
**So that** I can import sprint work items

**Acceptance Criteria**:
- [ ] CSV uploader component with drag-and-drop
- [ ] File type validation (CSV only)
- [ ] File size validation (max 10MB)
- [ ] Upload progress indicator
- [ ] Error messages for invalid files
- [ ] Support for multiple file selection
- [ ] Visual feedback during upload
- [ ] Accessible (keyboard navigation, screen reader support)

**Story Points**: 5  
**Dependencies**: Story 0.7  
**Technical Notes**: Use HTML5 file input with drag-and-drop, PapaParse for parsing

---

### Story 1.5: Create CSV Upload API Endpoint
**As a** developer  
**I want** an API endpoint to handle CSV file uploads  
**So that** CSV files can be processed and stored

**Acceptance Criteria**:
- [ ] `POST /api/sprints/:id/upload` endpoint
- [ ] Accepts multipart/form-data with CSV file
- [ ] Validates file type and size
- [ ] Stores file metadata in `csv_uploads` table
- [ ] Returns upload ID and status
- [ ] Error handling for invalid files
- [ ] Rate limiting (if applicable)

**Story Points**: 5  
**Dependencies**: Story 0.3, Story 1.1  
**Technical Notes**: Use Next.js API route with FormData parsing

---

### Story 1.6: Implement CSV Parsing and Validation
**As a** developer  
**I want** CSV files to be parsed and validated  
**So that** work item data can be extracted correctly

**Acceptance Criteria**:
- [ ] PapaParse library integrated
- [ ] CSV parsing handles:
  - [ ] Headers detection
  - [ ] Empty rows
  - [ ] Special characters
  - [ ] Different line endings
- [ ] Required fields validation:
  - [ ] Work Item ID
  - [ ] Title
  - [ ] Work Item Type
  - [ ] State
- [ ] Optional fields handled gracefully (null/empty)
- [ ] Error messages for missing required fields
- [ ] Parsing errors logged and reported

**Story Points**: 8  
**Dependencies**: Story 1.5  
**Technical Notes**: Use PapaParse with proper error handling, validate with Zod

**Implementation Details**:
- Install: `npm install papaparse @types/papaparse`
- Create Zod schema for CSV row validation:
  ```typescript
  const CSVRowSchema = z.object({
    'Work Item ID': z.string().min(1),
    'Title': z.string().min(1),
    'Work Item Type': z.string().min(1),
    'State': z.string().min(1),
    'Story Points': z.string().optional().transform(val => val ? parseInt(val) : null),
    'Assigned To': z.string().optional(),
    'Area Path': z.string().optional(),
    'Tags': z.string().optional(),
    'Created Date': z.string().optional(),
    'Changed Date': z.string().optional(),
    'Closed Date': z.string().optional(),
    'Iteration Path': z.string().optional(),
  });
  ```
- PapaParse configuration:
  - `header: true` (first row as headers)
  - `skipEmptyLines: true`
  - `transformHeader: (header) => header.trim()`
  - Handle encoding issues (UTF-8 with BOM)
- Error handling:
  - Collect parsing errors per row
  - Validate required fields after parsing
  - Return structured error report: `{ row: number, field: string, error: string }[]`
- Performance: Stream parsing for large files (>5MB), chunk processing

**Edge Cases**:
- CSV with BOM (Byte Order Mark)
- CSV with different delimiters (comma, semicolon, tab)
- CSV with quoted fields containing commas
- CSV with line breaks in fields
- CSV with missing columns
- CSV with extra columns (ignore)
- Empty CSV file
- CSV with only headers

---

### Story 1.7: Implement CSV Data Transformation
**As a** developer  
**I want** parsed CSV data to be transformed into work items  
**So that** data matches the database schema

**Acceptance Criteria**:
- [ ] Transform CSV rows to work item objects
- [ ] Extract feature name from Area Path
- [ ] Parse tags from comma-separated string to array
- [ ] Parse dates (Created Date, Changed Date, Closed Date)
- [ ] Convert Story Points to integer (handle empty/null)
- [ ] Determine status indicators based on state and tags
- [ ] Identify PI commitments (tag contains "PI Commitment")
- [ ] Identify sprint goals (tag contains "Sprint Goal")
- [ ] Identify highlights (tag contains "Highlight" or "Key Achievement")
- [ ] Store raw CSV data in JSONB field

**Story Points**: 8  
**Dependencies**: Story 1.6  
**Technical Notes**: Create transformation utility functions, use Zod for validation

**Implementation Details**:
- Create `lib/transformers/csvToWorkItem.ts`:
  ```typescript
  function extractFeatureName(areaPath: string | null): string | null {
    if (!areaPath) return null;
    const parts = areaPath.split('\\');
    return parts.length >= 2 ? parts[1] : null;
  }
  
  function parseTags(tags: string | null): string[] {
    if (!tags) return [];
    return tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
  }
  
  function parseDate(dateString: string | null): Date | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }
  
  function determineStatusIndicator(state: string, tags: string[]): string {
    if (tags.some(t => t.toLowerCase().includes('team focus'))) return '*';
    if (['Closed', 'Done', 'Completed'].includes(state)) return '✓';
    if (['Active', 'Resolved', 'In Progress'].includes(state)) return '|';
    return '✗';
  }
  ```
- Date parsing: Handle multiple formats (ISO 8601, US format, etc.)
- Tag matching: Case-insensitive, partial matches
- Status logic: Priority order (Team Focus > Done > Ongoing > Not Done)
- Feature extraction: Handle paths like "Project\\Feature\\SubFeature" → "Feature"
- Store raw data: `raw_data: JSONB` for debugging and future flexibility

**Edge Cases**:
- Area Path with single backslash or forward slashes
- Tags with extra spaces or special characters
- Invalid date formats (log warning, set to null)
- Story Points as string "0" vs empty string
- Multiple tags matching criteria (use first match)
- State values with different casing

---

### Story 1.8: Implement Work Items Storage
**As a** developer  
**I want** transformed work items to be stored in the database  
**So that** they can be retrieved for dashboard display

**Acceptance Criteria**:
- [ ] `POST /api/sprints/:id/process` endpoint
- [ ] Bulk insert/update work items
- [ ] Handle duplicate work items (update existing)
- [ ] Transaction support for data integrity
- [ ] Update CSV upload status
- [ ] Return processing results (count, errors)
- [ ] Error handling for database failures
- [ ] Performance optimization for large files (batch inserts)

**Story Points**: 8  
**Dependencies**: Story 1.7, Story 0.3  
**Technical Notes**: Use Supabase batch operations, handle conflicts

---

### Story 1.9: Build CSV Upload Page
**As a** product manager  
**I want** a dedicated page to upload CSV files for a sprint  
**So that** I can import work items easily

**Acceptance Criteria**:
- [ ] Upload page at `/sprints/[id]/upload`
- [ ] CSV uploader component integrated
- [ ] Display sprint information (sprint number, name)
- [ ] Show upload progress
- [ ] Display processing results (success/error counts)
- [ ] Redirect to dashboard after successful upload
- [ ] Error messages displayed clearly
- [ ] Support for re-uploading (replace existing data)

**Story Points**: 5  
**Dependencies**: Story 1.4, Story 1.8  
**Technical Notes**: Use React Query mutations for upload

---

**Sprint 1 Total Story Points**: 57

---

## Sprint 2: Dashboard Components & Data Display

**Goal**: Build all dashboard UI components to display sprint data visually.

**Duration**: 2 weeks  
**Focus**: Frontend components and visual design

---

### Story 2.1: Build Sprint Header Component
**As a** product manager  
**I want** to see the sprint title and visual header  
**So that** I can identify which sprint I'm viewing

**Acceptance Criteria**:
- [ ] Sprint header component displays:
  - [ ] Sprint name/number (e.g., "Sprint 31 Overview")
  - [ ] Green vertical accent strip on left
  - [ ] Calendar/checklist icon in top right
  - [ ] Sprint dates (start - end)
- [ ] White content area background
- [ ] Professional, clean layout
- [ ] Responsive design
- [ ] Matches PRD visual design

**Story Points**: 3  
**Dependencies**: Story 0.7, Story 1.1  
**Technical Notes**: Use Tailwind CSS, add icon library (Lucide React or similar)

---

### Story 2.2: Build Status Indicator Component
**As a** developer  
**I want** a reusable status indicator component  
**So that** status symbols are consistent across the dashboard

**Acceptance Criteria**:
- [ ] Status indicator component supports:
  - [ ] Green asterisk (*) - Team Focus
  - [ ] Green checkmark (✓) - Done
  - [ ] Orange vertical bar (|) - Ongoing
  - [ ] Red X (✗) - Not Done
- [ ] Color-coded according to PRD
- [ ] Accessible (ARIA labels)
- [ ] Consistent sizing
- [ ] Reusable across all sections

**Story Points**: 3  
**Dependencies**: Story 0.7  
**Technical Notes**: Create component in `components/common/StatusIndicator.tsx`

---

### Story 2.3: Build PI Commitments Component
**As a** product manager  
**I want** to see PI commitments with their status  
**So that** I can track progress on program-level objectives

**Acceptance Criteria**:
- [ ] PI Commitments component displays list of objectives
- [ ] Each objective shows:
  - [ ] Title/description
  - [ ] Status indicator (✓, ✗, |, *)
- [ ] Displays up to 5-10 commitments
- [ ] Filters work items tagged with "PI Commitment"
- [ ] Empty state when no commitments exist
- [ ] Responsive layout
- [ ] Matches PRD design

**Story Points**: 5  
**Dependencies**: Story 2.2, Story 1.8  
**Technical Notes**: Query work items with `is_pi_commitment = true`

---

### Story 2.4: Build Sprint Goals Component
**As a** product manager  
**I want** to see sprint goals with their status  
**So that** I can track progress on sprint objectives

**Acceptance Criteria**:
- [ ] Sprint Goals component displays list of goals
- [ ] Each goal shows:
  - [ ] Goal description
  - [ ] Status indicator (✓, ✗, |, *)
- [ ] Displays 3-7 sprint goals
- [ ] Supports work items tagged with "Sprint Goal"
- [ ] Supports manual entry in sprint configuration
- [ ] Real-time status based on work item completion
- [ ] Empty state when no goals exist
- [ ] Responsive layout

**Story Points**: 5  
**Dependencies**: Story 2.2, Story 1.8  
**Technical Notes**: Query work items and sprint configuration

---

### Story 2.5: Build Sprint Highlights Component
**As a** product manager  
**I want** to see sprint highlights  
**So that** I can communicate key achievements to stakeholders

**Acceptance Criteria**:
- [ ] Sprint Highlights component displays bullet-point list
- [ ] Each highlight shows:
  - [ ] Achievement description
  - [ ] Support for markdown formatting (links, emphasis)
- [ ] Displays 3-10 highlight items
- [ ] Supports work items tagged with "Highlight" or "Key Achievement"
- [ ] Supports manual entry in sprint configuration
- [ ] Markdown rendering (links, bold, italic)
- [ ] Empty state when no highlights exist
- [ ] Responsive layout

**Story Points**: 5  
**Dependencies**: Story 1.8  
**Technical Notes**: Use markdown parser (react-markdown), query work items and config

---

### Story 2.6: Build Team Backlog Table Component
**As a** scrum master  
**I want** to see team backlog metrics  
**So that** I can track sprint scope changes

**Acceptance Criteria**:
- [ ] Team Backlog table displays:
  - [ ] Stories/Bugs Planned: Story Points and Story Count
  - [ ] Stories Removed mid-sprint: Story Points and Story Count
  - [ ] Stories/Bugs added mid-sprint: Story Points and Story Count
  - [ ] Total: Sum of all above
- [ ] Displays "n/a" for zero values
- [ ] Numbers right-aligned, text left-aligned
- [ ] Clean table borders
- [ ] Responsive design
- [ ] Location: Bottom left section of dashboard

**Story Points**: 5  
**Dependencies**: Story 0.7, Story 1.8  
**Technical Notes**: Use database view `team_backlog_metrics`, create API endpoint

---

### Story 2.7: Build Stories Table Component
**As a** scrum master  
**I want** to see stories broken down by state  
**So that** I can track sprint progress

**Acceptance Criteria**:
- [ ] Stories table displays two sections:
  - [ ] User Stories:
    - [ ] New: Count
    - [ ] Active: Count
    - [ ] Resolved: Count
    - [ ] Closed in S[#]: Count
    - [ ] Total: Sum
  - [ ] Prod Support Tickets:
    - [ ] Same breakdown as User Stories
- [ ] Automatic categorization by work item type
- [ ] State-based counting
- [ ] Sprint-specific closed count
- [ ] Clean table formatting
- [ ] Location: Middle right section of dashboard
- [ ] Responsive design

**Story Points**: 8  
**Dependencies**: Story 0.7, Story 1.8  
**Technical Notes**: Use database view `stories_by_state`, filter by work item type

---

### Story 2.8: Build Top Features Table Component
**As a** team lead  
**I want** to see top features impacted by the sprint  
**So that** I can understand feature delivery progress

**Acceptance Criteria**:
- [ ] Top Features table displays:
  - [ ] Feature name
  - [ ] Committed Story Points in S[#]
  - [ ] Committed Story Count in S[#]
- [ ] Displays top 3-5 features by story points
- [ ] Sortable by story points or count
- [ ] Feature name clearly displayed
- [ ] Clean table formatting
- [ ] Location: Bottom right section of dashboard
- [ ] Responsive design

**Story Points**: 5  
**Dependencies**: Story 0.7, Story 1.8  
**Technical Notes**: Use database view `top_features`, limit to top 5

---

### Story 2.9: Build Team Velocity Display Component
**As a** scrum master  
**I want** to see team velocity  
**So that** I can track team capacity

**Acceptance Criteria**:
- [ ] Velocity display shows "Team Velocity: [number]"
- [ ] Prominent display
- [ ] Location: Below Team Backlog table
- [ ] Updates based on sprint configuration or calculation
- [ ] Responsive design

**Story Points**: 3  
**Dependencies**: Story 0.7  
**Technical Notes**: Query sprint configuration for velocity

---

### Story 2.10: Build Status Legend Component
**As a** product manager  
**I want** to see a legend explaining status symbols  
**So that** I can understand what each symbol means

**Acceptance Criteria**:
- [ ] Legend component displays at bottom of page
- [ ] Explains all status indicators:
  - [ ] Green asterisk: Team Focus
  - [ ] Green checkmark: Done
  - [ ] Orange vertical bar: Ongoing
  - [ ] Red X: Not Done
- [ ] Visual examples of each symbol
- [ ] Clean, readable layout
- [ ] Responsive design

**Story Points**: 3  
**Dependencies**: Story 2.2  
**Technical Notes**: Create component in `components/common/Legend.tsx`

---

### Story 2.11: Build Dashboard Layout and Integration
**As a** product manager  
**I want** all dashboard components integrated into a single page  
**So that** I can see a complete sprint overview

**Acceptance Criteria**:
- [ ] Dashboard page at `/sprints/[id]`
- [ ] All components integrated:
  - [ ] Sprint Header
  - [ ] PI Commitments
  - [ ] Sprint Goals
  - [ ] Sprint Highlights
  - [ ] Team Backlog Table
  - [ ] Stories Table
  - [ ] Top Features Table
  - [ ] Team Velocity Display
  - [ ] Legend
- [ ] Layout matches PRD design:
  - [ ] Single-page overview format
  - [ ] Proper spacing and alignment
  - [ ] Responsive grid layout
- [ ] Loading states for all data
- [ ] Error handling and display
- [ ] Empty states handled gracefully

**Story Points**: 8  
**Dependencies**: All Sprint 2 stories  
**Technical Notes**: Create dashboard page, use React Query for data fetching

---

**Sprint 2 Total Story Points**: 53

---

## Sprint 3: Metrics & Calculations

**Goal**: Implement all calculations, aggregations, and metrics APIs.

**Duration**: 2 weeks  
**Focus**: Backend calculations and data aggregation

---

### Story 3.1: Create Dashboard Metrics API Endpoint
**As a** developer  
**I want** a single API endpoint that returns all dashboard metrics  
**So that** the dashboard can load all data efficiently

**Acceptance Criteria**:
- [ ] `GET /api/sprints/:id/dashboard` endpoint
- [ ] Returns aggregated dashboard data:
  - [ ] Sprint information
  - [ ] PI commitments
  - [ ] Sprint goals
  - [ ] Highlights
  - [ ] Team backlog metrics
  - [ ] Stories by state
  - [ ] Top features
  - [ ] Team velocity
- [ ] Uses database views for performance
- [ ] Response time < 500ms (p95)
- [ ] Error handling
- [ ] Caching strategy (React Query)

**Story Points**: 8  
**Dependencies**: Story 0.3, Story 1.8  
**Technical Notes**: Aggregate data from multiple sources, optimize queries

---

### Story 3.2: Implement Team Backlog Calculations
**As a** developer  
**I want** accurate team backlog metrics calculated  
**So that** sprint scope changes are tracked correctly

**Acceptance Criteria**:
- [ ] Planned items: Created before sprint start date
- [ ] Removed items: State = "Removed" or "Deleted"
- [ ] Added items: Created after sprint start date
- [ ] Total: Sum of planned - removed + added
- [ ] Story points aggregated correctly
- [ ] Story counts aggregated correctly
- [ ] Handles null/empty story points
- [ ] Database view `team_backlog_metrics` works correctly
- [ ] Unit tests for calculations

**Story Points**: 5  
**Dependencies**: Story 0.3, Story 1.8  
**Technical Notes**: Use SQL FILTER clauses, test edge cases

**Implementation Details**:
- SQL View Implementation:
  ```sql
  CREATE VIEW team_backlog_metrics AS
  SELECT 
    sprint_id,
    COUNT(*) FILTER (WHERE created_date < (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)) AS planned_count,
    COALESCE(SUM(story_points) FILTER (WHERE created_date < (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)), 0) AS planned_story_points,
    COUNT(*) FILTER (WHERE state IN ('Removed', 'Deleted')) AS removed_count,
    COALESCE(SUM(story_points) FILTER (WHERE state IN ('Removed', 'Deleted')), 0) AS removed_story_points,
    COUNT(*) FILTER (WHERE created_date >= (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)) AS added_count,
    COALESCE(SUM(story_points) FILTER (WHERE created_date >= (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)), 0) AS added_story_points
  FROM work_items
  GROUP BY sprint_id;
  ```
- Calculation Logic:
  - Planned: `created_date < sprint.start_date`
  - Removed: `state IN ('Removed', 'Deleted')` (regardless of created_date)
  - Added: `created_date >= sprint.start_date` AND `state NOT IN ('Removed', 'Deleted')`
  - Total: `planned_count - removed_count + added_count`
- Handle NULL story_points: Use COALESCE to convert NULL to 0
- Edge case: Item created on exact start_date → counts as "added"
- Edge case: Item removed but was planned → counts in both planned and removed

**Testing Scenarios**:
- Sprint with no work items
- Sprint with only planned items
- Sprint with items added mid-sprint
- Sprint with items removed
- Sprint with items that are both planned and removed
- Items with NULL story_points
- Items created exactly on start_date

---

### Story 3.3: Implement Stories by State Calculations
**As a** developer  
**I want** accurate story counts by state calculated  
**So that** sprint progress is tracked correctly

**Acceptance Criteria**:
- [ ] Counts stories by work item type (User Story, Support Ticket)
- [ ] Counts by state (New, Active, Resolved, Closed)
- [ ] Closed in sprint: Items closed during sprint period
- [ ] Total: Sum of all states
- [ ] Handles multiple work item types correctly
- [ ] Database view `stories_by_state` works correctly
- [ ] Unit tests for calculations

**Story Points**: 5  
**Dependencies**: Story 0.3, Story 1.8  
**Technical Notes**: Filter by work item type and state, use GROUP BY

---

### Story 3.4: Implement Top Features Aggregation
**As a** developer  
**I want** top features calculated by story points  
**So that** feature impact is displayed correctly

**Acceptance Criteria**:
- [ ] Groups work items by feature name
- [ ] Aggregates story points per feature
- [ ] Aggregates story count per feature
- [ ] Sorts by story points (descending)
- [ ] Limits to top 5 features
- [ ] Handles null feature names (excludes them)
- [ ] Database view `top_features` works correctly
- [ ] Unit tests for aggregation

**Story Points**: 5  
**Dependencies**: Story 0.3, Story 1.8  
**Technical Notes**: Use GROUP BY and ORDER BY, handle NULL values

---

### Story 3.5: Implement Status Indicator Logic
**As a** developer  
**I want** status indicators determined automatically  
**So that** PI commitments and sprint goals show correct status

**Acceptance Criteria**:
- [ ] Status indicator logic:
  - [ ] `*` (Team Focus): Tag contains "Team Focus"
  - [ ] `✓` (Done): State = "Closed" or "Done"
  - [ ] `|` (Ongoing): State = "Active" or "Resolved"
  - [ ] `✗` (Not Done): State = "New" or "Removed"
- [ ] Applied during CSV transformation
- [ ] Stored in `status_indicator` field
- [ ] Updates when work item state changes
- [ ] Unit tests for status logic

**Story Points**: 5  
**Dependencies**: Story 1.7  
**Technical Notes**: Create utility function, test all combinations

---

### Story 3.6: Implement Feature Name Extraction
**As a** developer  
**I want** feature names extracted from Area Path  
**So that** features can be grouped correctly

**Acceptance Criteria**:
- [ ] Parse Area Path format: "Project\\Feature\\SubFeature"
- [ ] Extract feature name (second level)
- [ ] Handle different path formats
- [ ] Handle missing Area Path (null feature name)
- [ ] Store in `feature_name` field
- [ ] Unit tests for extraction logic

**Story Points**: 3  
**Dependencies**: Story 1.7  
**Technical Notes**: Use string parsing, handle edge cases

---

### Story 3.7: Create Individual Metrics API Endpoints
**As a** developer  
**I want** separate API endpoints for each metric type  
**So that** components can fetch specific data if needed

**Acceptance Criteria**:
- [ ] `GET /api/sprints/:id/metrics` - Team backlog metrics
- [ ] `GET /api/sprints/:id/pi-commitments` - PI commitments list
- [ ] `GET /api/sprints/:id/sprint-goals` - Sprint goals list
- [ ] `GET /api/sprints/:id/highlights` - Highlights list
- [ ] `GET /api/sprints/:id/velocity` - Team velocity
- [ ] All endpoints return consistent JSON format
- [ ] Error handling
- [ ] Unit tests

**Story Points**: 5  
**Dependencies**: Story 3.1  
**Technical Notes**: Create separate endpoints for flexibility

---

### Story 3.8: Implement Sprint Configuration Management
**As a** product manager  
**I want** to configure sprint settings (velocity, goals, highlights)  
**So that** I can customize sprint data

**Acceptance Criteria**:
- [ ] `GET /api/sprints/:id/config` - Get sprint configuration
- [ ] `PUT /api/sprints/:id/config` - Update sprint configuration
- [ ] Configuration includes:
  - [ ] Team velocity (integer)
  - [ ] Custom sprint goals (JSONB array)
  - [ ] Manual highlights (JSONB array)
- [ ] Validation for configuration data
- [ ] Default values when configuration doesn't exist
- [ ] Edit page at `/sprints/[id]/edit`
- [ ] Form to update configuration

**Story Points**: 8  
**Dependencies**: Story 0.3, Story 1.1  
**Technical Notes**: Use Zod for validation, handle JSONB fields

---

### Story 3.9: Implement Data Validation and Error Handling
**As a** developer  
**I want** comprehensive data validation and error handling  
**So that** the application handles edge cases gracefully

**Acceptance Criteria**:
- [ ] Validate all API inputs with Zod schemas
- [ ] Handle missing/null values in calculations
- [ ] Handle empty datasets gracefully
- [ ] Error messages are user-friendly
- [ ] Log errors for debugging
- [ ] Return appropriate HTTP status codes
- [ ] Frontend displays errors clearly
- [ ] Unit tests for error cases

**Story Points**: 5  
**Dependencies**: All Sprint 3 stories  
**Technical Notes**: Use Zod schemas, create error handling utilities

---

**Sprint 3 Total Story Points**: 49

---

## Sprint 4: Export & Polish

**Goal**: Implement export functionality and polish the application for production.

**Duration**: 2 weeks  
**Focus**: Export features, testing, and final polish

---

### Story 4.1: Implement PDF Export Functionality
**As a** product manager  
**I want** to export the dashboard as a PDF  
**So that** I can share sprint overviews with stakeholders

**Acceptance Criteria**:
- [ ] Export button on dashboard page
- [ ] `GET /api/sprints/:id/export/pdf` endpoint
- [ ] PDF generation using jsPDF or similar
- [ ] PDF includes all dashboard sections:
  - [ ] Sprint header
  - [ ] PI commitments
  - [ ] Sprint goals
  - [ ] Highlights
  - [ ] All tables
  - [ ] Legend
- [ ] PDF formatting matches dashboard design
- [ ] File downloads with proper name (e.g., "Sprint-31-Overview.pdf")
- [ ] Handles large content (page breaks)
- [ ] Loading state during export

**Story Points**: 8  
**Dependencies**: Story 2.11  
**Technical Notes**: Use jsPDF or react-pdf, consider server-side generation

**Implementation Details**:
- Option 1: Client-side with jsPDF
  - Install: `npm install jspdf jspdf-autotable`
  - Generate PDF in browser, trigger download
  - Pros: No server load, fast
  - Cons: Limited styling, may not match design exactly
- Option 2: Server-side with Puppeteer (Recommended)
  - Install: `npm install puppeteer`
  - Render dashboard HTML, convert to PDF
  - Pros: Exact design match, better formatting
  - Cons: Requires server resources, slower
- Implementation approach:
  ```typescript
  // API Route: app/api/sprints/[id]/export/pdf/route.ts
  export async function GET(request: Request, { params }: { params: { id: string } }) {
    const dashboardData = await getDashboardData(params.id);
    const html = await renderDashboardToHTML(dashboardData);
    const pdf = await generatePDF(html);
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Sprint-${sprintNumber}-Overview.pdf"`,
      },
    });
  }
  ```
- PDF Formatting:
  - Page size: A4 (210mm x 297mm)
  - Margins: 20mm all sides
  - Font: Arial or similar
  - Colors: Match dashboard (green accent, status colors)
  - Tables: Use autoTable plugin for proper formatting
  - Page breaks: Automatic for long content
- File naming: `Sprint-{sprintNumber}-Overview-{YYYY-MM-DD}.pdf`

**Edge Cases**:
- Very long lists (PI commitments, highlights) - paginate
- Wide tables - scale or split across pages
- Missing data - show "N/A" or empty state
- Special characters in sprint name - sanitize filename

---

### Story 4.2: Implement HTML Export Functionality
**As a** product manager  
**I want** to export the dashboard as HTML  
**So that** I can share sprint overviews via email or web

**Acceptance Criteria**:
- [ ] Export button on dashboard page
- [ ] `GET /api/sprints/:id/export/html` endpoint
- [ ] HTML export includes all dashboard sections
- [ ] Self-contained HTML (inline CSS)
- [ ] Print-friendly styling
- [ ] File downloads with proper name (e.g., "Sprint-31-Overview.html")
- [ ] Maintains visual design
- [ ] Responsive in exported HTML

**Story Points**: 5  
**Dependencies**: Story 2.11  
**Technical Notes**: Generate HTML server-side, include Tailwind CSS

---

### Story 4.3: Add Loading States and Error Boundaries
**As a** product manager  
**I want** clear loading and error states  
**So that** I understand what's happening in the application

**Acceptance Criteria**:
- [ ] Loading skeletons for all data sections
- [ ] Error boundaries for component errors
- [ ] Error messages are user-friendly
- [ ] Retry functionality for failed requests
- [ ] Network error handling
- [ ] 404 page for invalid sprint IDs
- [ ] Consistent loading/error UI patterns

**Story Points**: 5  
**Dependencies**: Story 2.11  
**Technical Notes**: Use React Error Boundaries, React Query error handling

---

### Story 4.4: Implement Responsive Design
**As a** product manager  
**I want** the dashboard to work on tablets and desktops  
**So that** I can view it on different devices

**Acceptance Criteria**:
- [ ] Dashboard responsive on:
  - [ ] Desktop (1920px+)
  - [ ] Laptop (1024px+)
  - [ ] Tablet (768px+)
- [ ] Tables scroll horizontally on small screens
- [ ] Components stack appropriately
- [ ] Text remains readable
- [ ] Touch-friendly buttons/links
- [ ] Tested on multiple browsers

**Story Points**: 5  
**Dependencies**: Story 2.11  
**Technical Notes**: Use Tailwind responsive classes, test on real devices

---

### Story 4.5: Add Data Refresh and Update Functionality
**As a** product manager  
**I want** to refresh sprint data with updated CSV  
**So that** I can update the dashboard mid-sprint

**Acceptance Criteria**:
- [ ] Re-upload CSV replaces existing work items
- [ ] Dashboard updates automatically after upload
- [ ] Metrics recalculate correctly
- [ ] Clear indication when data is updated
- [ ] Option to view upload history
- [ ] Confirmation before replacing data

**Story Points**: 5  
**Dependencies**: Story 1.9, Story 3.1  
**Technical Notes**: Use upsert logic, refresh React Query cache

---

### Story 4.6: Implement Performance Optimizations
**As a** developer  
**I want** the application to be performant  
**So that** users have a fast experience

**Acceptance Criteria**:
- [ ] Dashboard loads in < 2 seconds
- [ ] CSV processing completes in < 10 seconds for 10MB file
- [ ] API response times < 500ms (p95)
- [ ] Code splitting for heavy components
- [ ] Lazy loading for CSV parser
- [ ] Database queries optimized (indexes used)
- [ ] React Query caching configured
- [ ] Image optimization (if applicable)

**Story Points**: 5  
**Dependencies**: All previous stories  
**Technical Notes**: Profile performance, optimize bottlenecks

---

### Story 4.7: Add Comprehensive Error Handling
**As a** product manager  
**I want** clear error messages when something goes wrong  
**So that** I can understand and fix issues

**Acceptance Criteria**:
- [ ] CSV parsing errors displayed clearly
- [ ] Validation errors show specific field issues
- [ ] Database errors handled gracefully
- [ ] Network errors with retry option
- [ ] File upload errors explained
- [ ] 404/500 error pages
- [ ] Error logging for debugging
- [ ] User-friendly error messages (no technical jargon)

**Story Points**: 5  
**Dependencies**: All previous stories  
**Technical Notes**: Create error handling utilities, consistent error format

---

### Story 4.8: Write Integration Tests
**As a** developer  
**I want** integration tests for critical workflows  
**So that** I can ensure the application works end-to-end

**Acceptance Criteria**:
- [ ] Test: Create sprint → Upload CSV → View dashboard
- [ ] Test: CSV parsing and data transformation
- [ ] Test: Dashboard metrics calculations
- [ ] Test: Export functionality (PDF/HTML)
- [ ] Test: Error handling scenarios
- [ ] Test: Data refresh workflow
- [ ] Tests run in CI/CD pipeline
- [ ] Test coverage > 70%

**Story Points**: 8  
**Dependencies**: Story 0.8, All previous stories  
**Technical Notes**: Use Playwright or similar for E2E tests

---

### Story 4.9: Documentation and User Guide
**As a** product manager  
**I want** documentation on how to use the application  
**So that** I can use it effectively

**Acceptance Criteria**:
- [ ] README with setup instructions
- [ ] User guide for:
  - [ ] Creating sprints
  - [ ] Uploading CSV files
  - [ ] Understanding dashboard metrics
  - [ ] Exporting dashboards
- [ ] API documentation (if applicable)
- [ ] Troubleshooting guide
- [ ] CSV format requirements documented
- [ ] Screenshots/examples

**Story Points**: 5  
**Dependencies**: All previous stories  
**Technical Notes**: Create markdown documentation, add to repository

---

### Story 4.10: Final UI/UX Polish
**As a** product manager  
**I want** a polished, professional-looking dashboard  
**So that** it's suitable for stakeholder presentations

**Acceptance Criteria**:
- [ ] Visual design matches PRD reference image
- [ ] Consistent spacing and alignment
- [ ] Professional color scheme
- [ ] Typography hierarchy clear
- [ ] Icons and symbols consistent
- [ ] Smooth transitions/animations (optional)
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Cross-browser testing completed

**Story Points**: 5  
**Dependencies**: Story 2.11  
**Technical Notes**: Review against PRD, accessibility audit

---

**Sprint 4 Total Story Points**: 56

---

## Summary

### Total Story Points by Sprint

| Sprint | Story Points | Focus | Duration | Team Size |
|--------|--------------|-------|----------|-----------|
| Sprint 0 | 39 | Infrastructure | 2 weeks | 2 devs |
| Sprint 1 | 57 | Sprint Management & CSV Upload | 2 weeks | 2 devs |
| Sprint 2 | 53 | Dashboard Components | 2 weeks | 2 devs |
| Sprint 3 | 49 | Metrics & Calculations | 2 weeks | 2 devs |
| Sprint 4 | 56 | Export & Polish | 2 weeks | 2 devs |
| **Total** | **254** | **MVP Complete** | **10 weeks** | **2 devs** |

### Story Point Distribution

| Story Size | Count | Total Points | Percentage |
|------------|-------|--------------|------------|
| 3 points | 12 | 36 | 14% |
| 5 points | 20 | 100 | 39% |
| 8 points | 12 | 96 | 38% |
| 13+ points | 0 | 0 | 0% |
| **Total** | **44** | **254** | **100%** |

**Note**: All stories are sized appropriately (≤8 points). No stories require breakdown.

### Sprint Dependencies

```
Sprint 0 (Infrastructure)
  ↓
Sprint 1 (Sprint Management & CSV Upload)
  ↓
Sprint 2 (Dashboard Components) ──┐
  ↓                               │
Sprint 3 (Metrics & Calculations) │
  ↓                               │
Sprint 4 (Export & Polish) ←──────┘
```

### MVP Completion Criteria

The MVP is complete when all stories in Sprints 0-4 are done and:
- [ ] User can create sprints
- [ ] User can upload ADO CSV exports
- [ ] Dashboard displays all required sections with accurate data
- [ ] User can export dashboard as PDF or HTML
- [ ] Application is deployed and accessible
- [ ] Documentation is complete
- [ ] Critical bugs are fixed

---

## Future Sprints (Post-MVP)

### Sprint 5: Enhancements
- Direct Azure DevOps API integration
- Historical velocity tracking
- Sprint comparison view
- Enhanced error recovery

### Sprint 6: User Experience
- User authentication (Supabase Auth)
- Multi-team support
- Customizable dashboard layouts
- Advanced filtering and search

### Sprint 7: Analytics
- Historical trend charts
- Velocity forecasting
- Sprint health metrics
- Custom reports

---

## Quick Reference Guide

### Story Point Estimation Rationale

**3 Points** (12 stories):
- Simple, well-defined tasks
- Minimal dependencies
- Clear acceptance criteria
- Examples: Component creation, basic setup, simple UI

**5 Points** (20 stories):
- Moderate complexity
- Some dependencies
- Multiple acceptance criteria
- Examples: Forms, API endpoints, data processing

**8 Points** (12 stories):
- Complex functionality
- Multiple dependencies
- Extensive acceptance criteria
- Examples: CSV parsing, calculations, export functionality

### Critical Path Stories

These stories must be completed in order and on time:

1. **Story 0.1-0.3**: Infrastructure foundation (blocks all other work)
2. **Story 1.1-1.9**: CSV upload functionality (blocks dashboard)
3. **Story 2.11**: Dashboard integration (blocks metrics)
4. **Story 3.1**: Dashboard API (blocks export)
5. **Story 4.1-4.2**: Export functionality (MVP completion)

### High-Risk Stories

| Story ID | Risk Level | Risk Description | Mitigation |
|----------|------------|------------------|------------|
| 1.6 | High | CSV format variations | Flexible parsing, extensive validation |
| 1.7 | Medium | Data transformation complexity | Unit tests, incremental development |
| 3.2-3.4 | High | Calculation accuracy | Peer review, comprehensive testing |
| 4.1 | Medium | PDF export formatting | Early prototyping, design review |

### Parallel Work Opportunities

**Sprint 0**:
- Developer 1: Stories 0.1, 0.2, 0.3, 0.6 (Infrastructure)
- Developer 2: Stories 0.4, 0.5, 0.7, 0.8 (Frontend foundation)

**Sprint 1**:
- Developer 1: Stories 1.1, 1.2, 1.3 (Sprint CRUD)
- Developer 2: Stories 1.4, 1.5 (CSV upload)
- Then: Stories 1.6, 1.7, 1.8, 1.9 (Sequential processing)

**Sprint 2**:
- Developer 1: Stories 2.1, 2.2, 2.3, 2.4, 2.5 (Header & lists)
- Developer 2: Stories 2.6, 2.7, 2.8, 2.9, 2.10 (Tables)
- Then: Story 2.11 (Integration - both developers)

### Definition of Ready

A story is ready for sprint planning when:
- [ ] User story format complete (As a... I want... So that...)
- [ ] Acceptance criteria defined and testable
- [ ] Dependencies identified
- [ ] Technical approach documented
- [ ] Edge cases considered
- [ ] Story points estimated
- [ ] Product Owner approval

### Definition of Done

A story is done when:
- [ ] All acceptance criteria met
- [ ] Code written and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing (if applicable)
- [ ] Documentation updated
- [ ] No critical bugs
- [ ] Deployed to staging (if applicable)
- [ ] Product Owner acceptance

---

**Document Status**: Ready for Sprint Planning  
**Document Version**: 1.1 (Enhanced with technical details)  
**Last Updated**: 2024-01-15

**Next Steps**: 
1. Review stories with development team
2. Validate story point estimates
3. Identify parallel work opportunities
4. Create sprint backlog for Sprint 0
5. Begin Sprint 0 implementation

