/**
 * Tests for Work Items Storage
 * Story: 1.8 - Work Items Storage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bulkStoreWorkItems, deleteWorkItemsBySprint, getWorkItemsCount } from './workItemsStorage';

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({
        onConflict: vi.fn(() => ({})),
      })),
      select: vi.fn(() => ({})),
      eq: vi.fn(() => ({})),
      in: vi.fn(() => ({})),
      delete: vi.fn(() => ({})),
      insert: vi.fn(() => ({})),
      update: vi.fn(() => ({})),
      single: vi.fn(() => ({})),
    })),
  },
}));

describe('Work Items Storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('bulkStoreWorkItems', () => {
    it('should return empty result for empty array', async () => {
      const result = await bulkStoreWorkItems([]);

      expect(result.inserted).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    // Note: Full integration tests would require mocking Supabase responses
    // These are placeholder tests - actual implementation testing would
    // require a test database or more sophisticated mocking
  });

  describe('deleteWorkItemsBySprint', () => {
    it('should be defined', () => {
      expect(deleteWorkItemsBySprint).toBeDefined();
    });
  });

  describe('getWorkItemsCount', () => {
    it('should be defined', () => {
      expect(getWorkItemsCount).toBeDefined();
    });
  });
});

