/**
 * Tests for CSV to Work Item Transformer
 * Story: 1.7 - CSV Data Transformation
 */

import { describe, it, expect } from 'vitest';
import {
  extractFeatureName,
  parseTags,
  parseDate,
  determineStatusIndicator,
  isPICommitment,
  isSprintGoal,
  isHighlight,
  transformCsvRowToWorkItem,
  transformCsvRowsToWorkItems,
} from './csvToWorkItem';
import type { CsvRow } from './csvParser';

describe('CSV to Work Item Transformer', () => {
  describe('extractFeatureName', () => {
    it('should extract feature name from Area Path with backslashes', () => {
      expect(extractFeatureName('Project\\Feature\\SubFeature')).toBe(
        'Feature'
      );
      expect(extractFeatureName('MyProject\\MyFeature')).toBe('MyFeature');
    });

    it('should extract feature name from Area Path with forward slashes', () => {
      expect(extractFeatureName('Project/Feature/SubFeature')).toBe('Feature');
      expect(extractFeatureName('MyProject/MyFeature')).toBe('MyFeature');
    });

    it('should handle mixed separators', () => {
      expect(extractFeatureName('Project\\Feature/SubFeature')).toBe('Feature');
    });

    it('should return null for single segment', () => {
      expect(extractFeatureName('Feature')).toBeNull();
      expect(extractFeatureName('JustOnePart')).toBeNull();
    });

    it('should return null for empty or null values', () => {
      expect(extractFeatureName(null)).toBeNull();
      expect(extractFeatureName(undefined)).toBeNull();
      expect(extractFeatureName('')).toBeNull();
      expect(extractFeatureName('   ')).toBeNull();
    });

    it('should handle paths with empty segments', () => {
      expect(extractFeatureName('Project\\\\Feature')).toBe('Feature');
      expect(extractFeatureName('Project\\Feature\\')).toBe('Feature');
    });

    it('should handle three or more segments', () => {
      expect(extractFeatureName('Project\\Feature\\SubFeature\\Detail')).toBe(
        'Feature'
      );
    });
  });

  describe('parseTags', () => {
    it('should parse comma-separated tags', () => {
      expect(parseTags('tag1,tag2,tag3')).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should trim whitespace from tags', () => {
      expect(parseTags(' tag1 , tag2 , tag3 ')).toEqual([
        'tag1',
        'tag2',
        'tag3',
      ]);
    });

    it('should filter out empty tags', () => {
      expect(parseTags('tag1,,tag2, ,tag3')).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should return empty array for null/undefined/empty', () => {
      expect(parseTags(null)).toEqual([]);
      expect(parseTags(undefined)).toEqual([]);
      expect(parseTags('')).toEqual([]);
      expect(parseTags('   ')).toEqual([]);
    });

    it('should preserve special characters in tags', () => {
      expect(parseTags('tag-1,tag_2,tag.3')).toEqual([
        'tag-1',
        'tag_2',
        'tag.3',
      ]);
    });

    it('should handle single tag', () => {
      expect(parseTags('single-tag')).toEqual(['single-tag']);
    });
  });

  describe('parseDate', () => {
    it('should parse ISO 8601 dates', () => {
      const result = parseDate('2024-01-15T10:00:00Z');
      expect(result).toBeTruthy();
      expect(result).toMatch(/2024-01-15/);
    });

    it('should parse date-only strings', () => {
      const result = parseDate('2024-01-15');
      expect(result).toBeTruthy();
      expect(result).toMatch(/2024-01-15/);
    });

    it('should parse US format dates', () => {
      const result = parseDate('01/15/2024');
      expect(result).toBeTruthy();
    });

    it('should return null for invalid dates', () => {
      expect(parseDate('invalid-date')).toBeNull();
      expect(parseDate('2024-13-45')).toBeNull();
    });

    it('should return null for null/undefined/empty', () => {
      expect(parseDate(null)).toBeNull();
      expect(parseDate(undefined)).toBeNull();
      expect(parseDate('')).toBeNull();
      expect(parseDate('   ')).toBeNull();
    });

    it('should trim whitespace', () => {
      const result = parseDate('  2024-01-15  ');
      expect(result).toBeTruthy();
    });
  });

  describe('determineStatusIndicator', () => {
    it('should return * for Team Focus tag', () => {
      expect(determineStatusIndicator('Active', ['Team Focus'])).toBe('*');
      expect(
        determineStatusIndicator('New', ['Some Tag', 'Team Focus Tag'])
      ).toBe('*');
    });

    it('should return ✓ for Closed state', () => {
      expect(determineStatusIndicator('Closed', [])).toBe('✓');
      expect(determineStatusIndicator('Done', [])).toBe('✓');
      expect(determineStatusIndicator('Completed', [])).toBe('✓');
    });

    it('should return | for Active state', () => {
      expect(determineStatusIndicator('Active', [])).toBe('|');
      expect(determineStatusIndicator('Resolved', [])).toBe('|');
      expect(determineStatusIndicator('In Progress', [])).toBe('|');
    });

    it('should return ✗ for other states', () => {
      expect(determineStatusIndicator('New', [])).toBe('✗');
      expect(determineStatusIndicator('Removed', [])).toBe('✗');
      expect(determineStatusIndicator('Unknown', [])).toBe('✗');
    });

    it('should prioritize Team Focus over state', () => {
      expect(determineStatusIndicator('Closed', ['Team Focus'])).toBe('*');
      expect(determineStatusIndicator('Active', ['Team Focus'])).toBe('*');
    });

    it('should be case-insensitive for states', () => {
      expect(determineStatusIndicator('CLOSED', [])).toBe('✓');
      expect(determineStatusIndicator('active', [])).toBe('|');
      expect(determineStatusIndicator('In Progress', [])).toBe('|');
    });

    it('should be case-insensitive for Team Focus tag', () => {
      expect(determineStatusIndicator('Active', ['TEAM FOCUS'])).toBe('*');
      expect(determineStatusIndicator('Active', ['team focus'])).toBe('*');
      expect(determineStatusIndicator('Active', ['Team Focus Tag'])).toBe('*');
    });
  });

  describe('isPICommitment', () => {
    it('should return true for PI Commitment tag', () => {
      expect(isPICommitment(['PI Commitment'])).toBe(true);
      expect(isPICommitment(['Some Tag', 'PI Commitment'])).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isPICommitment(['pi commitment'])).toBe(true);
      expect(isPICommitment(['PI COMMITMENT'])).toBe(true);
      expect(isPICommitment(['Pi Commitment'])).toBe(true);
    });

    it('should match partial strings', () => {
      expect(isPICommitment(['PI Commitment - Q1'])).toBe(true);
      expect(isPICommitment(['My PI Commitment'])).toBe(true);
    });

    it('should return false when not found', () => {
      expect(isPICommitment([])).toBe(false);
      expect(isPICommitment(['Other Tag'])).toBe(false);
      expect(isPICommitment(['PI', 'Commitment'])).toBe(false);
    });
  });

  describe('isSprintGoal', () => {
    it('should return true for Sprint Goal tag', () => {
      expect(isSprintGoal(['Sprint Goal'])).toBe(true);
      expect(isSprintGoal(['Some Tag', 'Sprint Goal'])).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isSprintGoal(['sprint goal'])).toBe(true);
      expect(isSprintGoal(['SPRINT GOAL'])).toBe(true);
    });

    it('should match partial strings', () => {
      expect(isSprintGoal(['Sprint Goal - Feature X'])).toBe(true);
    });

    it('should return false when not found', () => {
      expect(isSprintGoal([])).toBe(false);
      expect(isSprintGoal(['Other Tag'])).toBe(false);
    });
  });

  describe('isHighlight', () => {
    it('should return true for Highlight tag', () => {
      expect(isHighlight(['Highlight'])).toBe(true);
      expect(isHighlight(['Some Tag', 'Highlight'])).toBe(true);
    });

    it('should return true for Key Achievement tag', () => {
      expect(isHighlight(['Key Achievement'])).toBe(true);
      expect(isHighlight(['Some Tag', 'Key Achievement'])).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isHighlight(['highlight'])).toBe(true);
      expect(isHighlight(['KEY ACHIEVEMENT'])).toBe(true);
    });

    it('should match partial strings', () => {
      expect(isHighlight(['Highlight - Feature X'])).toBe(true);
      expect(isHighlight(['Key Achievement - Q1'])).toBe(true);
    });

    it('should return false when not found', () => {
      expect(isHighlight([])).toBe(false);
      expect(isHighlight(['Other Tag'])).toBe(false);
    });
  });

  describe('transformCsvRowToWorkItem', () => {
    const mockSprintId = '123e4567-e89b-12d3-a456-426614174000';

    it('should transform complete CSV row to work item', () => {
      const csvRow: CsvRow = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'Active',
        'Story Points': 5,
        'Assigned To': 'John Doe',
        'Area Path': 'Project\\Feature\\SubFeature',
        Tags: 'Tag1, Tag2, PI Commitment',
        'Created Date': '2024-01-15',
        'Changed Date': '2024-01-16',
        'Closed Date': null,
        'Iteration Path': 'Sprint 31',
      };

      const workItem = transformCsvRowToWorkItem(csvRow, mockSprintId);

      expect(workItem.sprint_id).toBe(mockSprintId);
      expect(workItem.work_item_id).toBe('12345');
      expect(workItem.title).toBe('Test Story');
      expect(workItem.work_item_type).toBe('User Story');
      expect(workItem.state).toBe('Active');
      expect(workItem.story_points).toBe(5);
      expect(workItem.assigned_to).toBe('John Doe');
      expect(workItem.area_path).toBe('Project\\Feature\\SubFeature');
      expect(workItem.feature_name).toBe('Feature');
      expect(workItem.tags).toEqual(['Tag1', 'Tag2', 'PI Commitment']);
      expect(workItem.is_pi_commitment).toBe(true);
      expect(workItem.is_sprint_goal).toBe(false);
      expect(workItem.is_highlight).toBe(false);
      expect(workItem.status_indicator).toBe('|'); // Active state
      expect(workItem.raw_data).toBeTruthy();
    });

    it('should handle minimal CSV row', () => {
      const csvRow: CsvRow = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'New',
        'Story Points': null,
        'Assigned To': null,
        'Area Path': null,
        Tags: null,
        'Created Date': null,
        'Changed Date': null,
        'Closed Date': null,
        'Iteration Path': null,
      };

      const workItem = transformCsvRowToWorkItem(csvRow, mockSprintId);

      expect(workItem.work_item_id).toBe('12345');
      expect(workItem.story_points).toBeNull();
      expect(workItem.assigned_to).toBeNull();
      expect(workItem.area_path).toBeNull();
      expect(workItem.feature_name).toBeNull();
      expect(workItem.tags).toEqual([]);
      expect(workItem.status_indicator).toBe('✗'); // New state
    });

    it('should identify sprint goal', () => {
      const csvRow: CsvRow = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'Active',
        'Story Points': 5,
        'Assigned To': null,
        'Area Path': null,
        Tags: 'Sprint Goal',
        'Created Date': null,
        'Changed Date': null,
        'Closed Date': null,
        'Iteration Path': null,
      };

      const workItem = transformCsvRowToWorkItem(csvRow, mockSprintId);

      expect(workItem.is_sprint_goal).toBe(true);
      expect(workItem.is_pi_commitment).toBe(false);
      expect(workItem.is_highlight).toBe(false);
    });

    it('should identify highlight', () => {
      const csvRow: CsvRow = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'Closed',
        'Story Points': 5,
        'Assigned To': null,
        'Area Path': null,
        Tags: 'Highlight',
        'Created Date': null,
        'Changed Date': null,
        'Closed Date': null,
        'Iteration Path': null,
      };

      const workItem = transformCsvRowToWorkItem(csvRow, mockSprintId);

      expect(workItem.is_highlight).toBe(true);
      expect(workItem.status_indicator).toBe('✓'); // Closed state
    });

    it('should store raw CSV data', () => {
      const csvRow: CsvRow = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'Active',
        'Story Points': 5,
        'Assigned To': null,
        'Area Path': null,
        Tags: null,
        'Created Date': null,
        'Changed Date': null,
        'Closed Date': null,
        'Iteration Path': null,
      };

      const workItem = transformCsvRowToWorkItem(csvRow, mockSprintId);

      expect(workItem.raw_data).toBeTruthy();
      expect(workItem.raw_data?.['Work Item ID']).toBe('12345');
      expect(workItem.raw_data?.Title).toBe('Test Story');
    });
  });

  describe('transformCsvRowsToWorkItems', () => {
    it('should transform multiple CSV rows', () => {
      const csvRows: CsvRow[] = [
        {
          'Work Item ID': '12345',
          Title: 'Story 1',
          'Work Item Type': 'User Story',
          State: 'Active',
          'Story Points': 5,
          'Assigned To': null,
          'Area Path': null,
          Tags: null,
          'Created Date': null,
          'Changed Date': null,
          'Closed Date': null,
          'Iteration Path': null,
        },
        {
          'Work Item ID': '12346',
          Title: 'Story 2',
          'Work Item Type': 'User Story',
          State: 'Closed',
          'Story Points': 8,
          'Assigned To': null,
          'Area Path': null,
          Tags: null,
          'Created Date': null,
          'Changed Date': null,
          'Closed Date': null,
          'Iteration Path': null,
        },
      ];

      const mockSprintId = '123e4567-e89b-12d3-a456-426614174000';
      const workItems = transformCsvRowsToWorkItems(csvRows, mockSprintId);

      expect(workItems).toHaveLength(2);
      expect(workItems[0].work_item_id).toBe('12345');
      expect(workItems[1].work_item_id).toBe('12346');
    });

    it('should handle empty array', () => {
      const workItems = transformCsvRowsToWorkItems([], 'sprint-id');
      expect(workItems).toHaveLength(0);
    });
  });
});
