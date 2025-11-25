# Sprint 0: Backend Developer - Task Breakdown

**Developer Identifier**: **dev_backend**  
**Developer**: [Your Name]  
**Role**: Backend Developer  
**Sprint**: Sprint 0 - Infrastructure & Foundation  
**Duration**: 2 weeks (Jan 15 - Jan 29, 2024)

---

## Assigned Stories (13 points)

| Story ID | Title                  | Points | Status | Priority |
| -------- | ---------------------- | ------ | ------ | -------- |
| 0.2      | Set Up Supabase        | 5      | To Do  | P0       |
| 0.3      | Create Database Schema | 8      | To Do  | P0       |

---

## Prerequisites & Setup (Complete BEFORE Sprint 0 Starts)

**⚠️ IMPORTANT**: Complete these setup steps before Sprint 0 begins to avoid blockers.

### Required Accounts

#### Supabase Account

- [ ] **Create Supabase Account** (if you don't have one)
  - [ ] Go to https://supabase.com
  - [ ] Sign up with GitHub, Google, or email
  - [ ] Verify email address
  - [ ] Account created: ☐
  - [ ] Can access Supabase dashboard: ☐

### Required Tools Installation

#### Supabase CLI Installation

- [ ] **Install Supabase CLI** (Required for local development and migrations)

  **Option 1: Install via npm (Recommended)**

  ```bash
  npm install -g supabase
  ```

  **Option 2: Install via Homebrew (Mac)**

  ```bash
  brew install supabase/tap/supabase
  ```

  **Option 3: Install via Scoop (Windows)**

  ```bash
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

  **Option 4: Install via Package Managers**
  - See: https://supabase.com/docs/guides/cli/getting-started

- [ ] **Verify Installation**

  ```bash
  supabase --version
  ```

  - [ ] Version displayed: ☐
  - [ ] Version: **\*\***\_\_\_\_**\*\***

#### Docker Installation (Required for Local Supabase)

- [ ] **Install Docker Desktop**
  - [ ] Download from: https://www.docker.com/products/docker-desktop
  - [ ] Install Docker Desktop
  - [ ] Start Docker Desktop application
  - [ ] Docker is running: ☐
- [ ] **Verify Docker Installation**

  ```bash
  docker --version
  docker-compose --version
  ```

  - [ ] Docker version displayed: ☐
  - [ ] Docker Compose version displayed: ☐

#### Supabase CLI Authentication

- [ ] **Login to Supabase CLI**

  ```bash
  supabase login
  ```

  - [ ] Follow browser prompt to authenticate
  - [ ] Successfully logged in: ☐
  - [ ] Can access your projects: ☐

### Local Supabase Setup & Verification

#### Initialize Local Supabase (Optional but Recommended)

- [ ] **Test Local Supabase** (After Story 0.1 is complete and project is initialized)

  ```bash
  # Navigate to project directory
  cd sprint-dashboard

  # Initialize Supabase in project
  supabase init

  # Start local Supabase (requires Docker)
  supabase start
  ```

- [ ] **Verify Local Supabase is Running**
  - [ ] Local API URL: http://localhost:54321
  - [ ] Local Dashboard: http://localhost:54323
  - [ ] Local Database: localhost:54322
  - [ ] All services accessible: ☐

- [ ] **Test Local Database Connection**

  ```bash
  # Get local database connection string
  supabase status

  # Test connection (optional)
  psql postgresql://postgres:postgres@localhost:54322/postgres
  ```

#### Local Development Workflow

- [ ] **Understand Local vs Remote Development**
  - [ ] **Local Supabase**: For development, testing migrations locally
  - [ ] **Remote Supabase**: For production, shared team database
  - [ ] You'll use BOTH during development

- [ ] **Local Migration Workflow** (For Story 0.3)

  ```bash
  # Create a new migration
  supabase migration new migration_name

  # Apply migrations locally
  supabase db reset

  # Push local migrations to remote
  supabase db push
  ```

### Verification Checklist

Before starting Story 0.2, verify:

- [ ] Supabase account created and accessible
- [ ] Supabase CLI installed: `supabase --version` works
- [ ] Docker installed and running: `docker --version` works
- [ ] Supabase CLI logged in: `supabase login` successful
- [ ] Can access Supabase dashboard: https://app.supabase.com
- [ ] Local Supabase can start: `supabase start` works (optional but recommended)

### Troubleshooting

#### Supabase CLI Issues

- **Problem**: `supabase: command not found`
  - **Solution**: Ensure npm global bin is in PATH
  - **Solution**: Try `npm install -g supabase` again
  - **Solution**: Restart terminal after installation

- **Problem**: `supabase login` fails
  - **Solution**: Use `supabase login --browser` for browser-based auth
  - **Solution**: Check network/firewall settings
  - **Solution**: Ensure you have a Supabase account

#### Docker Issues

- **Problem**: `supabase start` fails with Docker error
  - **Solution**: Ensure Docker Desktop is running
  - **Solution**: Check Docker has enough resources (4GB RAM minimum)
  - **Solution**: Restart Docker Desktop

- **Problem**: Port conflicts
  - **Solution**: Stop other services using ports 54321, 54322, 54323
  - **Solution**: Use `supabase stop` to stop local Supabase

### Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
- [Docker Desktop Documentation](https://docs.docker.com/desktop/)

---

## Story 0.2: Set Up Supabase Project and Database Connection (5 points)

**Priority**: P0  
**Estimated Time**: 1 day  
**Dependencies**: Story 0.1 (must be complete - need Next.js project)

### Acceptance Criteria

- [ ] Supabase project created
- [ ] Environment variables configured (`.env.local` and Vercel)
- [ ] Supabase client library installed (`@supabase/supabase-js`)
- [ ] Client-side Supabase client configured (`lib/supabase.ts`)
- [ ] Server-side Supabase admin client configured
- [ ] Connection tested with a simple query
- [ ] Environment variables documented in `.env.example`

### Detailed Tasks

#### Task 1: Create Supabase Project (1 hour)

- [ ] Sign up/Sign in to Supabase (or use team account)
- [ ] Create new project:
  - [ ] Project name: "Sprint Dashboard"
  - [ ] Database password: Generate strong password (save securely)
  - [ ] Region: Choose closest to team (e.g., US East)
  - [ ] Pricing plan: Free tier for development
- [ ] Wait for project provisioning (2-3 minutes)
- [ ] Note down:
  - [ ] Project URL: `https://xxx.supabase.co`
  - [ ] Project ID
  - [ ] Database password (save in password manager)

#### Task 2: Install Supabase Client Library (30 min)

- [ ] Wait for Story 0.1 to be complete (Next.js project ready)
- [ ] Install Supabase JS client: `npm install @supabase/supabase-js`
- [ ] Verify package in `package.json`
- [ ] Check for TypeScript types (should be included)

#### Task 3: Configure Environment Variables (1 hour)

- [ ] Get Supabase credentials from project settings:
  - [ ] Project URL: `https://xxx.supabase.co`
  - [ ] Anon/Public key: `eyJhbGc...` (from API settings)
  - [ ] Service Role key: `eyJhbGc...` (from API settings - KEEP SECRET)
- [ ] Create `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  ```
- [ ] Create `.env.example`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Add `.env.example` to repository

#### Task 4: Create Client-Side Supabase Client (1 hour)

- [ ] Create `lib/supabase/client.ts`:

  ```typescript
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```

- [ ] Add error handling for missing env vars
- [ ] Export client for use in components

#### Task 5: Create Server-Side Supabase Admin Client (1 hour)

- [ ] Create `lib/supabase/server.ts`:

  ```typescript
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Server-side client with service role (bypasses RLS)
  export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  ```

- [ ] Add error handling
- [ ] Document that this should only be used in API routes

#### Task 6: Create Supabase Index File (30 min)

- [ ] Create `lib/supabase/index.ts`:
  ```typescript
  export { supabase } from './client';
  export { supabaseAdmin } from './server';
  ```
- [ ] This allows importing from `@/lib/supabase`

#### Task 7: Test Connection (1 hour)

- [ ] Create test API route: `app/api/test-db/route.ts`:

  ```typescript
  import { supabaseAdmin } from '@/lib/supabase/server';
  import { NextResponse } from 'next/server';

  export async function GET() {
    try {
      // Test query
      const { data, error } = await supabaseAdmin
        .from('_test')
        .select('*')
        .limit(1);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        data,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Connection failed', details: error },
        { status: 500 }
      );
    }
  }
  ```

- [ ] Test in browser: `http://localhost:3000/api/test-db`
- [ ] Verify connection works (may fail until schema is created - that's OK)
- [ ] Remove test route after verification

#### Task 8: Document Setup (30 min)

- [ ] Update README.md with Supabase setup instructions:
  - [ ] How to create Supabase project
  - [ ] How to get credentials
  - [ ] How to configure environment variables
  - [ ] How to test connection
- [ ] Document in `docs/SUPABASE_SETUP.md`:
  - [ ] Project creation steps
  - [ ] Credential management
  - [ ] Client vs Admin client usage
  - [ ] Security best practices

### Definition of Done

- [ ] All tasks completed
- [ ] Code reviewed by Team Lead
- [ ] Supabase project created
- [ ] Client and admin clients configured
- [ ] Connection tested successfully
- [ ] Environment variables documented
- [ ] Credentials shared with Frontend Dev 2 (for Story 0.6)

### Blockers

- Must wait for Story 0.1 to be complete (need Next.js project)

### Notes

- Start this as soon as Story 0.1 is complete
- Share Supabase credentials with dev2_front for Story 0.6
- Keep service role key SECRET - never commit to repository
- Test connection thoroughly before moving to Story 0.3

---

## Story 0.3: Create Database Schema and Migrations (8 points)

**Priority**: P0  
**Estimated Time**: 2-3 days  
**Dependencies**: Story 0.2 (must be complete)

### Acceptance Criteria

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

### Detailed Tasks

#### Task 1: Review Schema Design (1 hour)

- [ ] Review `SOLUTION_ARCHITECTURE.md` section 4.1 (Database Schema)
- [ ] Review `USER_STORIES.md` Story 0.3 (Implementation Details)
- [ ] Understand all table structures and relationships
- [ ] Identify any questions or clarifications needed
- [ ] Document any deviations from design

#### Task 2: Create Migration File (1 hour)

- [ ] **Verify Supabase CLI is installed** (should be done in Prerequisites)
  ```bash
  supabase --version
  ```
- [ ] **Initialize Supabase in project** (if not already done):

  ```bash
  supabase init
  ```

  - [ ] Creates `supabase/` directory
  - [ ] Creates `supabase/config.toml`
  - [ ] Creates `supabase/migrations/` directory

- [ ] **Link to Remote Project** (optional, for pushing migrations):

  ```bash
  supabase link --project-ref your-project-ref
  ```

  - [ ] Get project ref from Supabase dashboard URL
  - [ ] Or use: `supabase projects list` to see your projects

- [ ] **Create Migration File**:

  ```bash
  supabase migration new initial_schema
  ```

  - [ ] Creates file: `supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql`
  - [ ] Or create manually with timestamp format

- [ ] **Alternative: Use Supabase SQL Editor** (web interface)
  - [ ] Go to Supabase dashboard → SQL Editor
  - [ ] Create migration manually
  - [ ] Save SQL to migration file in repository
  - [ ] **Note**: CLI approach is recommended for version control

- [ ] **Document Migration Approach**: Choose one method and document
  - [ ] CLI-based migrations (recommended)
  - [ ] Web-based SQL Editor
  - [ ] Hybrid approach

#### Task 3: Create Sprints Table (1 hour)

- [ ] Write SQL for `sprints` table:
  ```sql
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
  ```
- [ ] Add comments explaining each field
- [ ] Test table creation in Supabase SQL Editor
- [ ] Verify table structure

#### Task 4: Create Work Items Table (2 hours)

- [ ] Write SQL for `work_items` table:
  ```sql
  CREATE TABLE work_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
    work_item_id VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    work_item_type VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    story_points INTEGER,
    assigned_to VARCHAR(255),
    area_path TEXT,
    feature_name TEXT,
    tags TEXT[],
    created_date TIMESTAMP WITH TIME ZONE,
    changed_date TIMESTAMP WITH TIME ZONE,
    closed_date TIMESTAMP WITH TIME ZONE,
    iteration_path TEXT,
    is_pi_commitment BOOLEAN DEFAULT FALSE,
    is_sprint_goal BOOLEAN DEFAULT FALSE,
    is_highlight BOOLEAN DEFAULT FALSE,
    status_indicator VARCHAR(10),
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sprint_id, work_item_id)
  );
  ```
- [ ] Add foreign key constraint to sprints
- [ ] Add comments explaining each field
- [ ] Test table creation
- [ ] Verify foreign key works (test insert/delete)

#### Task 5: Create Sprint Configurations Table (1 hour)

- [ ] Write SQL for `sprint_configurations` table:
  ```sql
  CREATE TABLE sprint_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
    team_velocity INTEGER,
    sprint_goals JSONB,
    highlights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sprint_id)
  );
  ```
- [ ] Add foreign key constraint
- [ ] Add comments
- [ ] Test table creation

#### Task 6: Create CSV Uploads Table (1 hour)

- [ ] Write SQL for `csv_uploads` table:
  ```sql
  CREATE TABLE csv_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    row_count INTEGER,
    status VARCHAR(50) DEFAULT 'processed',
    error_message TEXT
  );
  ```
- [ ] Add foreign key constraint
- [ ] Add comments
- [ ] Test table creation

#### Task 7: Create Indexes (1.5 hours)

- [ ] Create indexes for performance:
  ```sql
  CREATE INDEX idx_work_items_sprint_id ON work_items(sprint_id);
  CREATE INDEX idx_work_items_type ON work_items(work_item_type);
  CREATE INDEX idx_work_items_state ON work_items(state);
  CREATE INDEX idx_work_items_feature ON work_items(feature_name);
  CREATE INDEX idx_work_items_tags ON work_items USING GIN(tags);
  CREATE INDEX idx_sprints_number ON sprints(sprint_number);
  ```
- [ ] Test index creation
- [ ] Verify indexes are used in query plans (EXPLAIN)

#### Task 8: Create Database Views (2 hours)

- [ ] Create `team_backlog_metrics` view:
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
- [ ] Create `stories_by_state` view:
  ```sql
  CREATE VIEW stories_by_state AS
  SELECT
    sprint_id,
    work_item_type,
    state,
    COUNT(*) AS count,
    COALESCE(SUM(story_points), 0) AS story_points
  FROM work_items
  WHERE work_item_type IN ('User Story', 'Bug', 'Support Ticket')
  GROUP BY sprint_id, work_item_type, state;
  ```
- [ ] Create `top_features` view:
  ```sql
  CREATE VIEW top_features AS
  SELECT
    sprint_id,
    feature_name,
    COUNT(*) AS story_count,
    COALESCE(SUM(story_points), 0) AS story_points
  FROM work_items
  WHERE feature_name IS NOT NULL
  GROUP BY sprint_id, feature_name
  ORDER BY story_points DESC;
  ```
- [ ] Test each view with sample queries
- [ ] Verify views return correct data

#### Task 9: Test Schema with Sample Data (1.5 hours)

**Option A: Test Locally (Recommended)**

- [ ] **Start Local Supabase** (if not already running):
  ```bash
  supabase start
  ```
- [ ] **Apply Migrations Locally**:

  ```bash
  supabase db reset
  ```

  - [ ] This applies all migrations in `supabase/migrations/`
  - [ ] Verifies migration syntax is correct

- [ ] **Connect to Local Database**:

  ```bash
  # Get connection string
  supabase status

  # Or use psql
  psql postgresql://postgres:postgres@localhost:54322/postgres
  ```

- [ ] **Insert Sample Data** (in local database):
  ```sql
  INSERT INTO sprints (sprint_number, sprint_name, start_date, end_date, team_name)
  VALUES (1, 'Sprint 1', '2024-01-15', '2024-01-29', 'Platform Team');
  ```
- [ ] Insert sample work items
- [ ] Test foreign key constraints
- [ ] Test views with sample data
- [ ] Verify all relationships work correctly
- [ ] Test CASCADE delete (delete sprint, verify work items deleted)

**Option B: Test in Remote Database (Supabase Dashboard)**

- [ ] Use Supabase SQL Editor to run migrations
- [ ] Insert sample data via SQL Editor
- [ ] Test queries and views
- [ ] **Note**: Prefer local testing to avoid affecting shared database

**After Local Testing**:

- [ ] **Push Migrations to Remote** (when ready):

  ```bash
  supabase db push
  ```

  - [ ] This applies local migrations to remote Supabase project
  - [ ] Verify in Supabase dashboard that tables/views are created

#### Task 10: Document Schema (1 hour)

- [ ] Create `docs/DATABASE_SCHEMA.md`:
  - [ ] Table descriptions
  - [ ] Field descriptions
  - [ ] Relationships diagram
  - [ ] Index descriptions
  - [ ] View descriptions
  - [ ] Sample queries
- [ ] Add comments to SQL migration file
- [ ] Update README.md with database setup instructions

#### Task 11: Create TypeScript Types (1 hour)

- [ ] Create `lib/types/database.ts`:

  ```typescript
  export interface Sprint {
    id: string;
    sprint_number: number;
    sprint_name: string;
    start_date: string | null;
    end_date: string | null;
    team_name: string | null;
    created_at: string;
    updated_at: string;
  }

  export interface WorkItem {
    id: string;
    sprint_id: string;
    work_item_id: string;
    title: string;
    work_item_type: string;
    state: string;
    story_points: number | null;
    // ... other fields
  }
  ```

- [ ] Export all types
- [ ] Document types usage

### Definition of Done

- [ ] All tasks completed
- [ ] Code reviewed by Team Lead
- [ ] All tables created
- [ ] All indexes created
- [ ] All views created
- [ ] Schema tested with sample data
- [ ] Migration script tested (rollback and reapply)
- [ ] TypeScript types created
- [ ] Documentation complete

### Blockers

- Must wait for Story 0.2 to be complete

### Notes

- This is the most complex story in Sprint 0
- Take time to test thoroughly
- Document edge cases and assumptions
- Coordinate with dev1_front if TypeScript types are needed

---

## Weekly Timeline

### Week 1 (Jan 15-19)

- **Day 1-2**: Wait for Story 0.1 to complete
- **Day 3-5**: Complete Story 0.2 (Supabase Setup)

### Week 2 (Jan 22-26)

- **Day 1-5**: Complete Story 0.3 (Database Schema)

---

## Daily Checklist

- [ ] Update daily standup notes
- [ ] Commit code at least once per day
- [ ] Create PR when story is complete
- [ ] Request code review from Team Lead
- [ ] Update story status in project management tool
- [ ] Share Supabase credentials with dev2_front (after Story 0.2)

---

## Communication

- **Daily Standup**: [Time] - Share progress and blockers
- **Slack/Teams**: Use for quick questions
- **PR Reviews**: Tag Team Lead for reviews
- **Blockers**: Escalate immediately to Team Lead
- **Story 0.2**: Share credentials with dev2_front for Story 0.6
- **Story 0.3**: Coordinate with dev1_front if TypeScript types needed

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SOLUTION_ARCHITECTURE.md](../../docs/SOLUTION_ARCHITECTURE.md) - Section 4.1 (Database Schema)
- [USER_STORIES.md](../USER_STORIES.md) - Story 0.3 (Implementation Details)

---

## Security Notes

- **NEVER** commit service role key to repository
- Use environment variables for all credentials
- Service role key should only be used in server-side code (API routes)
- Anon key can be used in client-side code (it's public)
- Document security best practices in setup docs

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Status**: Ready for Sprint Execution
