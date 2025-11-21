-- Sprint Dashboard - Initial Database Schema
-- Migration: 20240115000000_initial_schema.sql
-- Description: Creates all core tables, indexes, and views for Sprint Dashboard
-- Story: 0.3 - Create Database Schema

-- ============================================================================
-- TABLES
-- ============================================================================

-- Sprints table: Store sprint metadata
CREATE TABLE IF NOT EXISTS sprints (
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

COMMENT ON TABLE sprints IS 'Stores sprint metadata including sprint number, name, dates, and team';
COMMENT ON COLUMN sprints.sprint_number IS 'Sprint number (e.g., 31)';
COMMENT ON COLUMN sprints.sprint_name IS 'Sprint name (e.g., "Sprint 31")';
COMMENT ON COLUMN sprints.team_name IS 'Name of the team (optional, for multi-team support)';

-- Work items table: Store parsed CSV work items
CREATE TABLE IF NOT EXISTS work_items (
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

COMMENT ON TABLE work_items IS 'Stores work items imported from Azure DevOps CSV exports';
COMMENT ON COLUMN work_items.work_item_id IS 'Azure DevOps work item ID';
COMMENT ON COLUMN work_items.feature_name IS 'Extracted feature name from area_path';
COMMENT ON COLUMN work_items.tags IS 'Array of tags from CSV';
COMMENT ON COLUMN work_items.status_indicator IS 'Status indicator: * (Team Focus), ✓ (Done), | (Ongoing), ✗ (Not Done)';
COMMENT ON COLUMN work_items.raw_data IS 'Full CSV row stored as JSONB for flexibility';

-- Sprint configurations: User-defined settings per sprint
CREATE TABLE IF NOT EXISTS sprint_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  team_velocity INTEGER,
  sprint_goals JSONB, -- Array of custom sprint goals
  highlights JSONB, -- Manual highlights
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sprint_id)
);

COMMENT ON TABLE sprint_configurations IS 'Stores user-defined sprint configurations and settings';
COMMENT ON COLUMN sprint_configurations.team_velocity IS 'Team velocity (story points per sprint)';
COMMENT ON COLUMN sprint_configurations.sprint_goals IS 'Custom sprint goals as JSON array';
COMMENT ON COLUMN sprint_configurations.highlights IS 'Manual sprint highlights as JSON array';

-- CSV uploads: Track uploaded files (optional, for audit)
CREATE TABLE IF NOT EXISTS csv_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  row_count INTEGER,
  status VARCHAR(50) DEFAULT 'processed', -- processed, failed
  error_message TEXT
);

COMMENT ON TABLE csv_uploads IS 'Tracks CSV file uploads for audit and debugging purposes';
COMMENT ON COLUMN csv_uploads.status IS 'Upload status: processed, failed';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_work_items_sprint_id ON work_items(sprint_id);
CREATE INDEX IF NOT EXISTS idx_work_items_type ON work_items(work_item_type);
CREATE INDEX IF NOT EXISTS idx_work_items_state ON work_items(state);
CREATE INDEX IF NOT EXISTS idx_work_items_feature ON work_items(feature_name);
CREATE INDEX IF NOT EXISTS idx_work_items_tags ON work_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_sprints_number ON sprints(sprint_number);

-- Additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_work_items_pi_commitment ON work_items(is_pi_commitment) WHERE is_pi_commitment = TRUE;
CREATE INDEX IF NOT EXISTS idx_work_items_sprint_goal ON work_items(is_sprint_goal) WHERE is_sprint_goal = TRUE;
CREATE INDEX IF NOT EXISTS idx_work_items_highlight ON work_items(is_highlight) WHERE is_highlight = TRUE;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Team Backlog Metrics
-- Calculates planned, removed, and added work items for a sprint
CREATE OR REPLACE VIEW team_backlog_metrics AS
SELECT
  sprint_id,
  COUNT(*) FILTER (
    WHERE created_date < (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)
  ) AS planned_count,
  COALESCE(
    SUM(story_points) FILTER (
      WHERE created_date < (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)
    ),
    0
  ) AS planned_story_points,
  COUNT(*) FILTER (
    WHERE state IN ('Removed', 'Deleted')
  ) AS removed_count,
  COALESCE(
    SUM(story_points) FILTER (
      WHERE state IN ('Removed', 'Deleted')
    ),
    0
  ) AS removed_story_points,
  COUNT(*) FILTER (
    WHERE created_date >= (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)
  ) AS added_count,
  COALESCE(
    SUM(story_points) FILTER (
      WHERE created_date >= (SELECT start_date FROM sprints WHERE id = work_items.sprint_id)
    ),
    0
  ) AS added_story_points
FROM work_items
GROUP BY sprint_id;

COMMENT ON VIEW team_backlog_metrics IS 'Aggregated metrics for team backlog: planned, removed, and added items';

-- View: Stories by State
-- Breakdown of stories by type and state
CREATE OR REPLACE VIEW stories_by_state AS
SELECT
  sprint_id,
  work_item_type,
  state,
  COUNT(*) AS count,
  COALESCE(SUM(story_points), 0) AS story_points
FROM work_items
WHERE work_item_type IN ('User Story', 'Bug', 'Support Ticket')
GROUP BY sprint_id, work_item_type, state;

COMMENT ON VIEW stories_by_state IS 'Count and story points breakdown by work item type and state';

-- View: Top Features
-- Top features by story points for a sprint
CREATE OR REPLACE VIEW top_features AS
SELECT
  sprint_id,
  feature_name,
  COUNT(*) AS story_count,
  COALESCE(SUM(story_points), 0) AS story_points
FROM work_items
WHERE feature_name IS NOT NULL
GROUP BY sprint_id, feature_name
ORDER BY story_points DESC;

COMMENT ON VIEW top_features IS 'Top features by story points, ordered by impact';

-- ============================================================================
-- FUNCTIONS (Optional - for updated_at timestamps)
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_sprints_updated_at
  BEFORE UPDATE ON sprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_items_updated_at
  BEFORE UPDATE ON work_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sprint_configurations_updated_at
  BEFORE UPDATE ON sprint_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

