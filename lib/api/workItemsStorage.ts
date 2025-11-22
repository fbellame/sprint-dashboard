/**
 * Work Items Storage Utilities
 * 
 * Handles bulk storage operations for work items including:
 * - Bulk insert/update with conflict resolution
 * - Batch processing for large datasets
 * - Transaction support
 * 
 * Story: 1.8 - Work Items Storage
 */

import { supabaseAdmin } from '@/lib/supabase/server';
import type { InsertWorkItem } from '@/lib/types/database';

// ============================================================================
// Storage Results
// ============================================================================

export interface StorageResult {
  inserted: number;
  updated: number;
  failed: number;
  errors: Array<{
    work_item_id: string;
    error: string;
  }>;
}

// ============================================================================
// Bulk Storage Functions
// ============================================================================

/**
 * Batch size for bulk operations
 * Supabase has limits on batch size, so we process in chunks
 */
const BATCH_SIZE = 100;

/**
 * Store work items in batches with conflict resolution
 * 
 * Uses PostgreSQL UPSERT (ON CONFLICT) to handle duplicates.
 * Duplicates are identified by (sprint_id, work_item_id) unique constraint.
 * 
 * @param workItems - Array of work items to store
 * @returns Storage result with counts and errors
 */
export async function bulkStoreWorkItems(
  workItems: InsertWorkItem[]
): Promise<StorageResult> {
  if (workItems.length === 0) {
    return {
      inserted: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };
  }

  const result: StorageResult = {
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  // Process in batches to avoid overwhelming the database
  for (let i = 0; i < workItems.length; i += BATCH_SIZE) {
    const batch = workItems.slice(i, i + BATCH_SIZE);

    try {
      // Use UPSERT (INSERT ... ON CONFLICT DO UPDATE)
      // This handles duplicates by updating existing records
      const { error } = await supabaseAdmin
        .from('work_items')
        .upsert(batch, {
          onConflict: 'sprint_id,work_item_id',
          ignoreDuplicates: false,
        });

      if (error) {
        // If batch fails, try individual inserts to identify which ones failed
        const batchResult = await storeWorkItemsIndividually(batch);
        result.inserted += batchResult.inserted;
        result.updated += batchResult.updated;
        result.failed += batchResult.failed;
        result.errors.push(...batchResult.errors);
      } else {
        // Batch succeeded - upsert handles both inserts and updates
        // To distinguish, we check existence before upsert (for this batch)
        // This is a trade-off: more queries but better reporting
        const batchResult = await storeWorkItemsWithTracking(batch);
        result.inserted += batchResult.inserted;
        result.updated += batchResult.updated;
        result.failed += batchResult.failed;
        result.errors.push(...batchResult.errors);
      }
    } catch (error) {
      // If batch operation fails, try individual inserts
      const batchResult = await storeWorkItemsIndividually(batch);
      result.inserted += batchResult.inserted;
      result.updated += batchResult.updated;
      result.failed += batchResult.failed;
      result.errors.push(...batchResult.errors);
    }
  }

  return result;
}

/**
 * Store work items with tracking of inserts vs updates
 * 
 * Checks existence before upserting to track inserted vs updated counts.
 * 
 * @param workItems - Array of work items to store
 * @returns Storage result with counts and errors
 */
async function storeWorkItemsWithTracking(
  workItems: InsertWorkItem[]
): Promise<StorageResult> {
  const result: StorageResult = {
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  // Get existing work item IDs for this batch (before upsert)
  const workItemIds = workItems.map((wi) => wi.work_item_id);
  const sprintId = workItems[0]?.sprint_id;

  if (!sprintId) {
    // All items should have same sprint_id, but handle edge case
    result.failed = workItems.length;
    workItems.forEach((wi) => {
      result.errors.push({
        work_item_id: wi.work_item_id,
        error: 'Missing sprint_id',
      });
    });
    return result;
  }

  // Check which items already exist (before upsert)
  const { data: existing, error: checkError } = await supabaseAdmin
    .from('work_items')
    .select('work_item_id')
    .eq('sprint_id', sprintId)
    .in('work_item_id', workItemIds);

  if (checkError) {
    // If check fails, fall back to individual operations
    return await storeWorkItemsIndividually(workItems);
  }

  const existingIds = new Set(
    existing?.map((item) => item.work_item_id) || []
  );

  // Perform upsert
  const { error } = await supabaseAdmin
    .from('work_items')
    .upsert(workItems, {
      onConflict: 'sprint_id,work_item_id',
      ignoreDuplicates: false,
    });

  if (error) {
    // If upsert fails, fall back to individual operations
    return await storeWorkItemsIndividually(workItems);
  }

  // Count based on existence check (before upsert)
  workItems.forEach((wi) => {
    if (existingIds.has(wi.work_item_id)) {
      result.updated++;
    } else {
      result.inserted++;
    }
  });

  return result;
}

/**
 * Store work items individually (fallback for error handling)
 * 
 * Used when batch operations fail to identify which items failed.
 * 
 * @param workItems - Array of work items to store
 * @returns Storage result with counts and errors
 */
async function storeWorkItemsIndividually(
  workItems: InsertWorkItem[]
): Promise<StorageResult> {
  const result: StorageResult = {
    inserted: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  for (const workItem of workItems) {
    try {
      // Check if work item already exists
      const { data: existing } = await supabaseAdmin
        .from('work_items')
        .select('id')
        .eq('sprint_id', workItem.sprint_id)
        .eq('work_item_id', workItem.work_item_id)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabaseAdmin
          .from('work_items')
          .update(workItem)
          .eq('sprint_id', workItem.sprint_id)
          .eq('work_item_id', workItem.work_item_id);

        if (error) {
          result.failed++;
          result.errors.push({
            work_item_id: workItem.work_item_id,
            error: error.message,
          });
        } else {
          result.updated++;
        }
      } else {
        // Insert new
        const { error } = await supabaseAdmin
          .from('work_items')
          .insert(workItem);

        if (error) {
          result.failed++;
          result.errors.push({
            work_item_id: workItem.work_item_id,
            error: error.message,
          });
        } else {
          result.inserted++;
        }
      }
    } catch (error) {
      result.failed++;
      result.errors.push({
        work_item_id: workItem.work_item_id,
        error:
          error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return result;
}

/**
 * Delete all work items for a sprint
 * 
 * Used when re-uploading CSV to replace existing data.
 * 
 * @param sprintId - Sprint ID
 * @returns Number of deleted items
 */
export async function deleteWorkItemsBySprint(
  sprintId: string
): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('work_items')
    .delete()
    .eq('sprint_id', sprintId)
    .select('id');

  if (error) {
    throw new Error(`Failed to delete work items: ${error.message}`);
  }

  return data?.length || 0;
}

/**
 * Get count of work items for a sprint
 * 
 * @param sprintId - Sprint ID
 * @returns Count of work items
 */
export async function getWorkItemsCount(sprintId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('work_items')
    .select('*', { count: 'exact', head: true })
    .eq('sprint_id', sprintId);

  if (error) {
    throw new Error(`Failed to count work items: ${error.message}`);
  }

  return count || 0;
}

