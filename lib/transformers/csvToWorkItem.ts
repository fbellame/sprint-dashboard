/**
 * CSV to Work Item Transformer
 * 
 * Transforms parsed CSV rows into work item objects that match the database schema.
 * Handles feature extraction, tag parsing, date parsing, status indicators, and flags.
 * 
 * Story: 1.7 - CSV Data Transformation
 */

import type { CsvRow } from './csvParser';
import type { InsertWorkItem } from '@/lib/types/database';
import { StatusIndicator } from '@/lib/types/database';

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Extract feature name from Area Path
 * 
 * Handles formats like:
 * - "Project\\Feature\\SubFeature" → "Feature"
 * - "Project/Feature/SubFeature" → "Feature"
 * - "Feature" → null (single segment, no project prefix)
 * 
 * @param areaPath - Area path from CSV (e.g., "Project\\Feature\\SubFeature")
 * @returns Feature name or null
 */
export function extractFeatureName(areaPath: string | null | undefined): string | null {
  if (!areaPath || areaPath.trim() === '') {
    return null;
  }

  // Handle both backslash and forward slash separators
  const normalized = areaPath.replace(/\//g, '\\');
  const parts = normalized.split('\\').filter((part) => part.trim() !== '');

  // Need at least 2 parts (Project\Feature) to extract feature name
  // If only 1 part, it's likely just the feature name itself, return null
  if (parts.length >= 2) {
    return parts[1]; // Second part is typically the feature name
  }

  return null;
}

/**
 * Parse tags from comma-separated string to array
 * 
 * Handles:
 * - Empty/null strings → []
 * - Extra spaces → trimmed
 * - Special characters → preserved
 * - Empty tags after trimming → filtered out
 * 
 * @param tags - Comma-separated tags string
 * @returns Array of tag strings
 */
export function parseTags(tags: string | null | undefined): string[] {
  if (!tags || tags.trim() === '') {
    return [];
  }

  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/**
 * Parse date string to ISO date string or null
 * 
 * Handles multiple date formats:
 * - ISO 8601: "2024-01-15T10:00:00Z"
 * - US format: "01/15/2024"
 * - Date only: "2024-01-15"
 * 
 * Invalid dates return null (no error thrown)
 * 
 * @param dateString - Date string from CSV
 * @returns ISO date string or null
 */
export function parseDate(dateString: string | null | undefined): string | null {
  if (!dateString || dateString.trim() === '') {
    return null;
  }

  const date = new Date(dateString.trim());

  // Check if date is valid
  if (isNaN(date.getTime())) {
    // Log warning but don't throw error
    console.warn(`Invalid date format: ${dateString}`);
    return null;
  }

  // Return ISO string
  return date.toISOString();
}

/**
 * Determine status indicator based on state and tags
 * 
 * Priority order:
 * 1. Team Focus (*) - if tag contains "Team Focus"
 * 2. Done (✓) - if state is Closed, Done, or Completed
 * 3. Ongoing (|) - if state is Active, Resolved, or In Progress
 * 4. Not Done (✗) - default for other states
 * 
 * @param state - Work item state
 * @param tags - Array of tags
 * @returns Status indicator character
 */
export function determineStatusIndicator(
  state: string,
  tags: string[]
): StatusIndicator {
  // Check for Team Focus tag (case-insensitive, partial match)
  const hasTeamFocus = tags.some((tag) =>
    tag.toLowerCase().includes('team focus')
  );
  if (hasTeamFocus) {
    return '*';
  }

  // Check for Done states (case-insensitive)
  const doneStates = ['closed', 'done', 'completed'];
  if (doneStates.includes(state.toLowerCase())) {
    return '✓';
  }

  // Check for Ongoing states (case-insensitive)
  const ongoingStates = ['active', 'resolved', 'in progress'];
  if (ongoingStates.includes(state.toLowerCase())) {
    return '|';
  }

  // Default: Not Done
  return '✗';
}

/**
 * Check if work item is a PI commitment
 * 
 * Checks if any tag contains "PI Commitment" (case-insensitive, partial match)
 * 
 * @param tags - Array of tags
 * @returns true if PI commitment
 */
export function isPICommitment(tags: string[]): boolean {
  return tags.some((tag) =>
    tag.toLowerCase().includes('pi commitment')
  );
}

/**
 * Check if work item is a sprint goal
 * 
 * Checks if any tag contains "Sprint Goal" (case-insensitive, partial match)
 * 
 * @param tags - Array of tags
 * @returns true if sprint goal
 */
export function isSprintGoal(tags: string[]): boolean {
  return tags.some((tag) =>
    tag.toLowerCase().includes('sprint goal')
  );
}

/**
 * Check if work item is a highlight
 * 
 * Checks if any tag contains "Highlight" or "Key Achievement" (case-insensitive, partial match)
 * 
 * @param tags - Array of tags
 * @returns true if highlight
 */
export function isHighlight(tags: string[]): boolean {
  return tags.some(
    (tag) =>
      tag.toLowerCase().includes('highlight') ||
      tag.toLowerCase().includes('key achievement')
  );
}

// ============================================================================
// Main Transformation Function
// ============================================================================

/**
 * Transform CSV row to work item insert object
 * 
 * Converts a validated CSV row into a work item object ready for database insertion.
 * Handles all transformations: feature extraction, tag parsing, date parsing, etc.
 * 
 * @param csvRow - Validated CSV row from parser
 * @param sprintId - Sprint ID to associate work item with
 * @returns Work item insert object
 */
export function transformCsvRowToWorkItem(
  csvRow: CsvRow,
  sprintId: string
): InsertWorkItem {
  // Parse tags first (needed for multiple checks)
  const tags = parseTags(csvRow.Tags);

  // Extract feature name from Area Path
  const featureName = extractFeatureName(csvRow['Area Path']);

  // Parse dates
  const createdDate = parseDate(csvRow['Created Date']);
  const changedDate = parseDate(csvRow['Changed Date']);
  const closedDate = parseDate(csvRow['Closed Date']);

  // Determine status indicator
  const statusIndicator = determineStatusIndicator(csvRow.State, tags);

  // Check flags
  const isPICommitmentFlag = isPICommitment(tags);
  const isSprintGoalFlag = isSprintGoal(tags);
  const isHighlightFlag = isHighlight(tags);

  // Store raw CSV data as JSONB
  const rawData: Record<string, unknown> = {
    'Work Item ID': csvRow['Work Item ID'],
    Title: csvRow.Title,
    'Work Item Type': csvRow['Work Item Type'],
    State: csvRow.State,
    'Story Points': csvRow['Story Points'],
    'Assigned To': csvRow['Assigned To'],
    'Area Path': csvRow['Area Path'],
    Tags: csvRow.Tags,
    'Created Date': csvRow['Created Date'],
    'Changed Date': csvRow['Changed Date'],
    'Closed Date': csvRow['Closed Date'],
    'Iteration Path': csvRow['Iteration Path'],
  };

  // Build work item object
  return {
    sprint_id: sprintId,
    work_item_id: csvRow['Work Item ID'],
    title: csvRow.Title,
    work_item_type: csvRow['Work Item Type'],
    state: csvRow.State,
    story_points: csvRow['Story Points'], // Already converted to number | null by Zod
    assigned_to: csvRow['Assigned To'] || null,
    area_path: csvRow['Area Path'] || null,
    feature_name: featureName,
    tags,
    created_date: createdDate,
    changed_date: changedDate,
    closed_date: closedDate,
    iteration_path: csvRow['Iteration Path'] || null,
    is_pi_commitment: isPICommitmentFlag,
    is_sprint_goal: isSprintGoalFlag,
    is_highlight: isHighlightFlag,
    status_indicator: statusIndicator,
    raw_data: rawData,
  };
}

/**
 * Transform multiple CSV rows to work items
 * 
 * Batch transformation for efficiency.
 * 
 * @param csvRows - Array of validated CSV rows
 * @param sprintId - Sprint ID to associate work items with
 * @returns Array of work item insert objects
 */
export function transformCsvRowsToWorkItems(
  csvRows: CsvRow[],
  sprintId: string
): InsertWorkItem[] {
  return csvRows.map((row) => transformCsvRowToWorkItem(row, sprintId));
}

