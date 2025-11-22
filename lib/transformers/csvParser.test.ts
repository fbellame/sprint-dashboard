/**
 * Tests for CSV Parser
 * Story: 1.6 - CSV Parsing and Validation
 */

import { describe, it, expect } from 'vitest';
import {
  parseCsvFile,
  csvRowSchema,
  validateCsvHeaders,
  formatParsingErrors,
  type ParsingError,
} from './csvParser';

describe('CSV Parser', () => {
  describe('parseCsvFile', () => {
    it('should parse valid CSV with all required fields', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State,Story Points
12345,Test Story,User Story,Active,5`;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'Active',
        'Story Points': 5,
      });
    });

    it('should handle optional fields', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State,Story Points,Assigned To,Area Path
12345,Test Story,User Story,Active,5,John Doe,Project\\Feature`;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data[0]['Assigned To']).toBe('John Doe');
      expect(result.data[0]['Area Path']).toBe('Project\\Feature');
    });

    it('should handle empty optional fields', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State,Story Points
12345,Test Story,User Story,Active,`;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data[0]['Story Points']).toBeNull();
    });

    it('should skip empty lines', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State

12345,Test Story,User Story,Active,5

`;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data).toHaveLength(1);
    });

    it('should handle missing required fields', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State
,Test Story,User Story,Active`;

      const result = await parseCsvFile(csv);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].field).toBe('Work Item ID');
      expect(result.data).toHaveLength(0);
    });

    it('should handle BOM (Byte Order Mark)', async () => {
      const csv =
        '\uFEFFWork Item ID,Title,Work Item Type,State\n12345,Test Story,User Story,Active';

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data).toHaveLength(1);
    });

    it('should handle different delimiters (semicolon)', async () => {
      const csv = `Work Item ID;Title;Work Item Type;State
12345;Test Story;User Story;Active`;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data).toHaveLength(1);
    });

    it('should handle quoted fields with commas', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State
12345,"Test Story, with comma",User Story,Active`;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data[0].Title).toBe('Test Story, with comma');
    });

    it('should handle line breaks in quoted fields', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State
12345,"Test Story
with line break",User Story,Active`;

      const result = await parseCsvFile(csv);

      // PapaParse should handle this, but we validate the result
      expect(result.errors).toHaveLength(0);
    });

    it('should trim whitespace from headers and values', async () => {
      const csv = ` Work Item ID , Title , Work Item Type , State 
 12345 , Test Story , User Story , Active `;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data[0]['Work Item ID']).toBe('12345');
      expect(result.data[0].Title).toBe('Test Story');
    });

    it('should handle CSV with only headers', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State`;

      const result = await parseCsvFile(csv);

      expect(result.data).toHaveLength(0);
      expect(result.meta.totalRows).toBe(0);
    });

    it('should handle empty CSV', async () => {
      const csv = '';

      const result = await parseCsvFile(csv);

      expect(result.data).toHaveLength(0);
      expect(result.meta.totalRows).toBe(0);
    });

    it('should parse multiple rows', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State,Story Points
12345,Story 1,User Story,Active,5
12346,Story 2,User Story,Resolved,8
12347,Bug 1,Bug,New,3`;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data).toHaveLength(3);
      expect(result.meta.validRows).toBe(3);
    });

    it('should handle invalid Story Points (non-numeric)', async () => {
      const csv = `Work Item ID,Title,Work Item Type,State,Story Points
12345,Test Story,User Story,Active,not-a-number`;

      const result = await parseCsvFile(csv);

      expect(result.errors).toHaveLength(0);
      expect(result.data[0]['Story Points']).toBeNull();
    });
  });

  describe('validateCsvHeaders', () => {
    it('should validate correct headers', () => {
      const headers = [
        'Work Item ID',
        'Title',
        'Work Item Type',
        'State',
        'Story Points',
      ];

      const result = validateCsvHeaders(headers);

      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should detect missing required headers', () => {
      const headers = ['Work Item ID', 'Title'];

      const result = validateCsvHeaders(headers);

      expect(result.valid).toBe(false);
      expect(result.missing).toContain('Work Item Type');
      expect(result.missing).toContain('State');
    });

    it('should handle headers with whitespace', () => {
      const headers = [
        ' Work Item ID ',
        ' Title ',
        ' Work Item Type ',
        ' State ',
      ];

      const result = validateCsvHeaders(headers);

      expect(result.valid).toBe(true);
    });
  });

  describe('formatParsingErrors', () => {
    it('should format errors correctly', () => {
      const errors: ParsingError[] = [
        { row: 2, field: 'Work Item ID', error: 'Required', value: '' },
        { row: 3, field: 'Title', error: 'Required', value: '' },
        { row: 3, field: 'State', error: 'Required', value: '' },
      ];

      const formatted = formatParsingErrors(errors);

      expect(formatted.message).toContain('3 errors');
      expect(formatted.summary.totalErrors).toBe(3);
      expect(formatted.summary.errorsByRow[2]).toBe(1);
      expect(formatted.summary.errorsByRow[3]).toBe(2);
      expect(formatted.summary.errorsByField['Work Item ID']).toBe(1);
      expect(formatted.summary.errorsByField['Title']).toBe(1);
      expect(formatted.summary.errorsByField['State']).toBe(1);
    });

    it('should handle empty errors array', () => {
      const formatted = formatParsingErrors([]);

      expect(formatted.message).toBe('No parsing errors');
      expect(formatted.summary.totalErrors).toBe(0);
    });
  });

  describe('csvRowSchema', () => {
    it('should validate required fields', () => {
      const validRow = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'Active',
      };

      const result = csvRowSchema.safeParse(validRow);

      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidRow = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        // Missing 'Work Item Type' and 'State'
      };

      const result = csvRowSchema.safeParse(invalidRow);

      expect(result.success).toBe(false);
    });

    it('should transform Story Points string to number', () => {
      const row = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'Active',
        'Story Points': '5',
      };

      const result = csvRowSchema.parse(row);

      expect(result['Story Points']).toBe(5);
    });

    it('should handle empty Story Points', () => {
      const row = {
        'Work Item ID': '12345',
        Title: 'Test Story',
        'Work Item Type': 'User Story',
        State: 'Active',
        'Story Points': '',
      };

      const result = csvRowSchema.parse(row);

      expect(result['Story Points']).toBeNull();
    });
  });
});
