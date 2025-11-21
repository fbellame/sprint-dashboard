/**
 * Database TypeScript Types
 * 
 * These types correspond to the database schema defined in:
 * supabase/migrations/20240115000000_initial_schema.sql
 * 
 * Story: 0.3 - Create Database Schema
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Sprint entity
 */
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

/**
 * Work Item entity
 */
export interface WorkItem {
  id: string;
  sprint_id: string;
  work_item_id: string;
  title: string;
  work_item_type: string;
  state: string;
  story_points: number | null;
  assigned_to: string | null;
  area_path: string | null;
  feature_name: string | null;
  tags: string[];
  created_date: string | null;
  changed_date: string | null;
  closed_date: string | null;
  iteration_path: string | null;
  is_pi_commitment: boolean;
  is_sprint_goal: boolean;
  is_highlight: boolean;
  status_indicator: string | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Sprint Configuration entity
 */
export interface SprintConfiguration {
  id: string;
  sprint_id: string;
  team_velocity: number | null;
  sprint_goals: SprintGoal[] | null;
  highlights: Highlight[] | null;
  created_at: string;
  updated_at: string;
}

/**
 * CSV Upload entity
 */
export interface CsvUpload {
  id: string;
  sprint_id: string;
  file_name: string;
  file_size: number | null;
  upload_date: string;
  row_count: number | null;
  status: string;
  error_message: string | null;
}

// ============================================================================
// View Types
// ============================================================================

/**
 * Team Backlog Metrics view
 */
export interface TeamBacklogMetrics {
  sprint_id: string;
  planned_count: number;
  planned_story_points: number;
  removed_count: number;
  removed_story_points: number;
  added_count: number;
  added_story_points: number;
}

/**
 * Stories by State view
 */
export interface StoriesByState {
  sprint_id: string;
  work_item_type: string;
  state: string;
  count: number;
  story_points: number;
}

/**
 * Top Features view
 */
export interface TopFeature {
  sprint_id: string;
  feature_name: string;
  story_count: number;
  story_points: number;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Sprint Goal (stored in sprint_configurations.sprint_goals)
 */
export interface SprintGoal {
  id?: string;
  title: string;
  description?: string;
  status_indicator: '*' | '✓' | '|' | '✗';
}

/**
 * Highlight (stored in sprint_configurations.highlights)
 */
export interface Highlight {
  id?: string;
  text: string;
  markdown?: boolean;
}

// ============================================================================
// Status Indicator Types
// ============================================================================

/**
 * Status indicator values
 */
export type StatusIndicator = '*' | '✓' | '|' | '✗';

/**
 * Status indicator meanings
 */
export const STATUS_INDICATORS = {
  '*': 'Team Focus',
  '✓': 'Done',
  '|': 'Ongoing',
  '✗': 'Not Done',
} as const;

// ============================================================================
// Work Item Type Constants
// ============================================================================

export const WORK_ITEM_TYPES = {
  USER_STORY: 'User Story',
  BUG: 'Bug',
  TASK: 'Task',
  SUPPORT_TICKET: 'Support Ticket',
  FEATURE: 'Feature',
} as const;

// ============================================================================
// State Constants
// ============================================================================

export const WORK_ITEM_STATES = {
  NEW: 'New',
  ACTIVE: 'Active',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REMOVED: 'Removed',
  DELETED: 'Deleted',
} as const;

// ============================================================================
// Insert/Update Types (for API operations)
// ============================================================================

/**
 * Insert Sprint input
 */
export type InsertSprint = Omit<
  Sprint,
  'id' | 'created_at' | 'updated_at'
>;

/**
 * Update Sprint input
 */
export type UpdateSprint = Partial<Omit<Sprint, 'id' | 'created_at'>>;

/**
 * Insert Work Item input
 */
export type InsertWorkItem = Omit<
  WorkItem,
  'id' | 'created_at' | 'updated_at'
>;

/**
 * Update Work Item input
 */
export type UpdateWorkItem = Partial<
  Omit<WorkItem, 'id' | 'sprint_id' | 'created_at'>
>;

/**
 * Insert Sprint Configuration input
 */
export type InsertSprintConfiguration = Omit<
  SprintConfiguration,
  'id' | 'created_at' | 'updated_at'
>;

/**
 * Update Sprint Configuration input
 */
export type UpdateSprintConfiguration = Partial<
  Omit<SprintConfiguration, 'id' | 'sprint_id' | 'created_at'>
>;

