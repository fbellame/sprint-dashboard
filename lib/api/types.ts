/**
 * API Types
 * 
 * Type definitions for API requests and responses.
 * These types should match the API route response structures.
 */

// ============================================================================
// Common Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================================================
// Sprint Types
// ============================================================================

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

export interface CreateSprintRequest {
  sprint_number: number;
  sprint_name: string;
  start_date?: string;
  end_date?: string;
  team_name?: string;
}

export interface UpdateSprintRequest {
  sprint_name?: string;
  start_date?: string;
  end_date?: string;
  team_name?: string;
}

// ============================================================================
// Work Item Types
// ============================================================================

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

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardMetrics {
  sprint: Sprint;
  pi_commitments: PICommitment[];
  sprint_goals: SprintGoal[];
  highlights: string[];
  team_backlog: TeamBacklogMetrics;
  stories: StoriesMetrics;
  top_features: FeatureMetrics[];
  velocity: number | null;
}

export interface PICommitment {
  title: string;
  status: 'team-focus' | 'done' | 'ongoing' | 'not-done';
  status_indicator: '*' | '✓' | '|' | '✗';
}

export interface SprintGoal {
  title: string;
  status: 'team-focus' | 'done' | 'ongoing' | 'not-done';
  status_indicator: '*' | '✓' | '|' | '✗';
}

export interface TeamBacklogMetrics {
  planned: { count: number; points: number };
  removed: { count: number; points: number };
  added: { count: number; points: number };
  total: { count: number; points: number };
}

export interface StoriesMetrics {
  user_stories: {
    new: number;
    active: number;
    resolved: number;
    closed: number;
    total: number;
  };
  support_tickets: {
    new: number;
    active: number;
    resolved: number;
    closed: number;
    total: number;
  };
}

export interface FeatureMetrics {
  name: string;
  story_count: number;
  story_points: number;
}

