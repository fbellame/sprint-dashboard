/**
 * Test data fixtures
 */

import type { Sprint, WorkItem } from '@/lib/types/database';

export const mockSprint: Sprint = {
  id: 'test-sprint-id',
  sprint_number: 1,
  sprint_name: 'Sprint 1',
  start_date: '2024-01-15',
  end_date: '2024-01-29',
  team_name: 'Platform Team',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};

export const mockWorkItem: WorkItem = {
  id: 'test-work-item-id',
  sprint_id: 'test-sprint-id',
  work_item_id: '12345',
  title: 'Test Work Item',
  work_item_type: 'User Story',
  state: 'Active',
  story_points: 5,
  assigned_to: 'Test User',
  area_path: 'Project\\Feature',
  feature_name: 'Feature',
  tags: ['tag1', 'tag2'],
  created_date: '2024-01-15T00:00:00Z',
  changed_date: '2024-01-15T00:00:00Z',
  closed_date: null,
  iteration_path: 'Sprint 1',
  is_pi_commitment: false,
  is_sprint_goal: false,
  is_highlight: false,
  status_indicator: null,
  raw_data: null,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};
