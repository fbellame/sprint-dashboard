# Database Schema Documentation

This document describes the database schema for the Sprint Dashboard application.

## Overview

The database schema consists of 4 main tables, multiple indexes for performance, and 3 views for aggregated metrics. The schema is designed to support sprint tracking, work item management, and dashboard metrics calculation.

## Tables

### `sprints`

Stores sprint metadata including sprint number, name, dates, and team information.

| Column        | Type                     | Constraints      | Description                     |
| ------------- | ------------------------ | ---------------- | ------------------------------- |
| id            | UUID                     | PRIMARY KEY      | Unique identifier               |
| sprint_number | INTEGER                  | NOT NULL, UNIQUE | Sprint number (e.g., 31)        |
| sprint_name   | VARCHAR(255)             | NOT NULL         | Sprint name (e.g., "Sprint 31") |
| start_date    | DATE                     | NULL             | Sprint start date               |
| end_date      | DATE                     | NULL             | Sprint end date                 |
| team_name     | VARCHAR(255)             | NULL             | Team name (for multi-team)      |
| created_at    | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()    | Record creation timestamp       |
| updated_at    | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()    | Record update timestamp         |

**Unique Constraint**: `(sprint_number, team_name)`

**Indexes**:

- `idx_sprints_number` on `sprint_number`

### `work_items`

Stores work items imported from Azure DevOps CSV exports. This is the core table containing all sprint work item data.

| Column           | Type                     | Constraints           | Description                       |
| ---------------- | ------------------------ | --------------------- | --------------------------------- |
| id               | UUID                     | PRIMARY KEY           | Unique identifier                 |
| sprint_id        | UUID                     | FOREIGN KEY → sprints | Reference to sprint               |
| work_item_id     | VARCHAR(50)              | NOT NULL              | Azure DevOps work item ID         |
| title            | TEXT                     | NOT NULL              | Work item title                   |
| work_item_type   | VARCHAR(50)              | NOT NULL              | Type (Story, Bug, Task, etc.)     |
| state            | VARCHAR(50)              | NOT NULL              | State (New, Active, Closed, etc.) |
| story_points     | INTEGER                  | NULL                  | Story points                      |
| assigned_to      | VARCHAR(255)             | NULL                  | Assigned person                   |
| area_path        | TEXT                     | NULL                  | Area path from ADO                |
| feature_name     | TEXT                     | NULL                  | Extracted feature name            |
| tags             | TEXT[]                   | NULL                  | Array of tags                     |
| created_date     | TIMESTAMP WITH TIME ZONE | NULL                  | Work item creation date           |
| changed_date     | TIMESTAMP WITH TIME ZONE | NULL                  | Last change date                  |
| closed_date      | TIMESTAMP WITH TIME ZONE | NULL                  | Closed date                       |
| iteration_path   | TEXT                     | NULL                  | Iteration path from ADO           |
| is_pi_commitment | BOOLEAN                  | DEFAULT FALSE         | Is PI commitment?                 |
| is_sprint_goal   | BOOLEAN                  | DEFAULT FALSE         | Is sprint goal?                   |
| is_highlight     | BOOLEAN                  | DEFAULT FALSE         | Is highlight?                     |
| status_indicator | VARCHAR(10)              | NULL                  | Status: \*, ✓, \|, ✗              |
| raw_data         | JSONB                    | NULL                  | Full CSV row as JSON              |
| created_at       | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()         | Record creation timestamp         |
| updated_at       | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()         | Record update timestamp           |

**Unique Constraint**: `(sprint_id, work_item_id)`

**Foreign Key**: `sprint_id` → `sprints(id)` ON DELETE CASCADE

**Indexes**:

- `idx_work_items_sprint_id` on `sprint_id`
- `idx_work_items_type` on `work_item_type`
- `idx_work_items_state` on `state`
- `idx_work_items_feature` on `feature_name`
- `idx_work_items_tags` on `tags` (GIN index)
- `idx_work_items_pi_commitment` on `is_pi_commitment` (partial, WHERE TRUE)
- `idx_work_items_sprint_goal` on `is_sprint_goal` (partial, WHERE TRUE)
- `idx_work_items_highlight` on `is_highlight` (partial, WHERE TRUE)

### `sprint_configurations`

Stores user-defined sprint configurations and settings.

| Column        | Type                     | Constraints           | Description                      |
| ------------- | ------------------------ | --------------------- | -------------------------------- |
| id            | UUID                     | PRIMARY KEY           | Unique identifier                |
| sprint_id     | UUID                     | FOREIGN KEY → sprints | Reference to sprint              |
| team_velocity | INTEGER                  | NULL                  | Team velocity (story points)     |
| sprint_goals  | JSONB                    | NULL                  | Custom sprint goals (JSON array) |
| highlights    | JSONB                    | NULL                  | Manual highlights (JSON array)   |
| created_at    | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()         | Record creation timestamp        |
| updated_at    | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()         | Record update timestamp          |

**Unique Constraint**: `(sprint_id)`

**Foreign Key**: `sprint_id` → `sprints(id)` ON DELETE CASCADE

### `csv_uploads`

Tracks CSV file uploads for audit and debugging purposes.

| Column        | Type                     | Constraints           | Description              |
| ------------- | ------------------------ | --------------------- | ------------------------ |
| id            | UUID                     | PRIMARY KEY           | Unique identifier        |
| sprint_id     | UUID                     | FOREIGN KEY → sprints | Reference to sprint      |
| file_name     | VARCHAR(255)             | NOT NULL              | Uploaded file name       |
| file_size     | INTEGER                  | NULL                  | File size in bytes       |
| upload_date   | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()         | Upload timestamp         |
| row_count     | INTEGER                  | NULL                  | Number of rows processed |
| status        | VARCHAR(50)              | DEFAULT 'processed'   | Upload status            |
| error_message | TEXT                     | NULL                  | Error message if failed  |

**Foreign Key**: `sprint_id` → `sprints(id)` ON DELETE CASCADE

## Views

### `team_backlog_metrics`

Aggregated metrics for team backlog: planned, removed, and added items.

**Columns**:

- `sprint_id`: UUID
- `planned_count`: Number of items planned at sprint start
- `planned_story_points`: Total story points planned
- `removed_count`: Number of items removed during sprint
- `removed_story_points`: Total story points removed
- `added_count`: Number of items added during sprint
- `added_story_points`: Total story points added

**Usage**:

```sql
SELECT * FROM team_backlog_metrics WHERE sprint_id = '...';
```

### `stories_by_state`

Count and story points breakdown by work item type and state.

**Columns**:

- `sprint_id`: UUID
- `work_item_type`: VARCHAR(50)
- `state`: VARCHAR(50)
- `count`: Number of items
- `story_points`: Total story points

**Usage**:

```sql
SELECT * FROM stories_by_state
WHERE sprint_id = '...'
ORDER BY work_item_type, state;
```

### `top_features`

Top features by story points, ordered by impact.

**Columns**:

- `sprint_id`: UUID
- `feature_name`: TEXT
- `story_count`: Number of stories
- `story_points`: Total story points

**Usage**:

```sql
SELECT * FROM top_features
WHERE sprint_id = '...'
ORDER BY story_points DESC
LIMIT 5;
```

## Relationships

```
sprints (1) ──→ (many) work_items
sprints (1) ──→ (1) sprint_configurations
sprints (1) ──→ (many) csv_uploads
```

## Triggers

### Automatic `updated_at` Updates

All tables with `updated_at` columns have triggers that automatically update the timestamp on row updates:

- `update_sprints_updated_at`
- `update_work_items_updated_at`
- `update_sprint_configurations_updated_at`

## Sample Queries

### Get Sprint with Work Items

```sql
SELECT
  s.*,
  COUNT(wi.id) as work_item_count,
  SUM(wi.story_points) as total_story_points
FROM sprints s
LEFT JOIN work_items wi ON s.id = wi.sprint_id
WHERE s.sprint_number = 31
GROUP BY s.id;
```

### Get PI Commitments

```sql
SELECT
  title,
  status_indicator,
  state
FROM work_items
WHERE sprint_id = '...'
  AND is_pi_commitment = TRUE
ORDER BY status_indicator;
```

### Get Team Backlog Metrics

```sql
SELECT * FROM team_backlog_metrics
WHERE sprint_id = '...';
```

### Get Top 5 Features

```sql
SELECT * FROM top_features
WHERE sprint_id = '...'
ORDER BY story_points DESC
LIMIT 5;
```

## Migration

The schema is created via migration file:

- `supabase/migrations/20240115000000_initial_schema.sql`

To apply the migration:

```bash
# Using Supabase CLI (local)
supabase db reset

# Using Supabase CLI (remote)
supabase db push

# Or via Supabase Dashboard SQL Editor
# Copy and paste the SQL from the migration file
```

## TypeScript Types

TypeScript types are defined in:

- `lib/types/database.ts`

These types correspond to the database schema and should be kept in sync.

## Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for timezone-aware storage
- Foreign keys use `ON DELETE CASCADE` to maintain referential integrity
- The `raw_data` JSONB column stores the full CSV row for flexibility
- Status indicators: `*` (Team Focus), `✓` (Done), `|` (Ongoing), `✗` (Not Done)
- GIN index on `tags` array for efficient tag searches

---

**Last Updated**: 2024-01-15  
**Story**: 0.3 - Create Database Schema
