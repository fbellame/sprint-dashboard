/**
 * Supabase Database Helpers
 *
 * Utility functions for common database operations using Supabase.
 * These helpers provide type-safe wrappers around Supabase queries.
 */

import { supabaseAdmin } from '@/lib/supabase/server';
import {
  Sprint,
  WorkItem,
  SprintConfiguration,
  InsertSprint,
  InsertWorkItem,
  UpdateSprint,
  UpdateWorkItem,
} from '@/lib/types/database';
import { NotFoundError } from './utils';

// ============================================================================
// Sprint Helpers
// ============================================================================

/**
 * Get sprint by ID
 */
export async function getSprintById(id: string): Promise<Sprint> {
  const { data, error } = await supabaseAdmin
    .from('sprints')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new NotFoundError('Sprint', id);
  }

  return data as Sprint;
}

/**
 * Get sprint by sprint number
 */
export async function getSprintByNumber(
  sprintNumber: number,
  teamName?: string
): Promise<Sprint | null> {
  let query = supabaseAdmin
    .from('sprints')
    .select('*')
    .eq('sprint_number', sprintNumber);

  if (teamName) {
    query = query.eq('team_name', teamName);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  return data as Sprint;
}

/**
 * Get all sprints
 */
export async function getAllSprints(): Promise<Sprint[]> {
  const { data, error } = await supabaseAdmin
    .from('sprints')
    .select('*')
    .order('sprint_number', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch sprints: ${error.message}`);
  }

  return (data || []) as Sprint[];
}

/**
 * Create sprint
 */
export async function createSprint(sprint: InsertSprint): Promise<Sprint> {
  const { data, error } = await supabaseAdmin
    .from('sprints')
    .insert(sprint)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create sprint: ${error.message}`);
  }

  return data as Sprint;
}

/**
 * Update sprint
 */
export async function updateSprint(
  id: string,
  updates: UpdateSprint
): Promise<Sprint> {
  const { data, error } = await supabaseAdmin
    .from('sprints')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw new NotFoundError('Sprint', id);
  }

  return data as Sprint;
}

/**
 * Delete sprint (cascades to work_items, configurations, etc.)
 */
export async function deleteSprint(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('sprints').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete sprint: ${error.message}`);
  }
}

// ============================================================================
// Work Item Helpers
// ============================================================================

/**
 * Get work items for a sprint
 */
export async function getWorkItemsBySprint(
  sprintId: string
): Promise<WorkItem[]> {
  const { data, error } = await supabaseAdmin
    .from('work_items')
    .select('*')
    .eq('sprint_id', sprintId)
    .order('created_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch work items: ${error.message}`);
  }

  return (data || []) as WorkItem[];
}

/**
 * Get work item by ID
 */
export async function getWorkItemById(id: string): Promise<WorkItem> {
  const { data, error } = await supabaseAdmin
    .from('work_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new NotFoundError('Work Item', id);
  }

  return data as WorkItem;
}

/**
 * Create work item
 */
export async function createWorkItem(
  workItem: InsertWorkItem
): Promise<WorkItem> {
  const { data, error } = await supabaseAdmin
    .from('work_items')
    .insert(workItem)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create work item: ${error.message}`);
  }

  return data as WorkItem;
}

/**
 * Bulk create work items
 */
export async function bulkCreateWorkItems(
  workItems: InsertWorkItem[]
): Promise<WorkItem[]> {
  const { data, error } = await supabaseAdmin
    .from('work_items')
    .insert(workItems)
    .select();

  if (error) {
    throw new Error(`Failed to create work items: ${error.message}`);
  }

  return (data || []) as WorkItem[];
}

/**
 * Update work item
 */
export async function updateWorkItem(
  id: string,
  updates: UpdateWorkItem
): Promise<WorkItem> {
  const { data, error } = await supabaseAdmin
    .from('work_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw new NotFoundError('Work Item', id);
  }

  return data as WorkItem;
}

/**
 * Delete work item
 */
export async function deleteWorkItem(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('work_items')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete work item: ${error.message}`);
  }
}

// ============================================================================
// View Helpers
// ============================================================================

/**
 * Get team backlog metrics for a sprint
 */
export async function getTeamBacklogMetrics(sprintId: string) {
  const { data, error } = await supabaseAdmin
    .from('team_backlog_metrics')
    .select('*')
    .eq('sprint_id', sprintId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch backlog metrics: ${error.message}`);
  }

  return data;
}

/**
 * Get stories by state for a sprint
 */
export async function getStoriesByState(sprintId: string) {
  const { data, error } = await supabaseAdmin
    .from('stories_by_state')
    .select('*')
    .eq('sprint_id', sprintId);

  if (error) {
    throw new Error(`Failed to fetch stories by state: ${error.message}`);
  }

  return data || [];
}

/**
 * Get top features for a sprint
 */
export async function getTopFeatures(
  sprintId: string,
  limit = 5
): Promise<
  Array<{ feature_name: string; story_count: number; story_points: number }>
> {
  const { data, error } = await supabaseAdmin
    .from('top_features')
    .select('*')
    .eq('sprint_id', sprintId)
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch top features: ${error.message}`);
  }

  return (data || []) as Array<{
    feature_name: string;
    story_count: number;
    story_points: number;
  }>;
}

// ============================================================================
// Sprint Configuration Helpers
// ============================================================================

/**
 * Get sprint configuration
 */
export async function getSprintConfiguration(
  sprintId: string
): Promise<SprintConfiguration | null> {
  const { data, error } = await supabaseAdmin
    .from('sprint_configurations')
    .select('*')
    .eq('sprint_id', sprintId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as SprintConfiguration;
}
