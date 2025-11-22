/**
 * CSV Parser and Validator
 * 
 * Handles CSV parsing with PapaParse, validation with Zod,
 * and comprehensive error handling for Azure DevOps CSV exports.
 * 
 * Story: 1.6 - CSV Parsing and Validation
 */

import Papa from 'papaparse';
import { z } from 'zod';

// ============================================================================
// CSV Row Schema (Zod Validation)
// ============================================================================

/**
 * Zod schema for validating CSV rows from Azure DevOps exports
 */
export const csvRowSchema = z.object({
  'Work Item ID': z.string().min(1, 'Work Item ID is required'),
  Title: z.string().min(1, 'Title is required'),
  'Work Item Type': z.string().min(1, 'Work Item Type is required'),
  State: z.string().min(1, 'State is required'),
  'Story Points': z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === '') return null;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? null : parsed;
    }),
  'Assigned To': z.string().optional().nullable(),
  'Area Path': z.string().optional().nullable(),
  Tags: z.string().optional().nullable(),
  'Created Date': z.string().optional().nullable(),
  'Changed Date': z.string().optional().nullable(),
  'Closed Date': z.string().optional().nullable(),
  'Iteration Path': z.string().optional().nullable(),
});

export type CsvRow = z.infer<typeof csvRowSchema>;

// ============================================================================
// Parsing Errors
// ============================================================================

export interface ParsingError {
  row: number;
  field?: string;
  error: string;
  value?: unknown;
}

export interface ParsingResult {
  data: CsvRow[];
  errors: ParsingError[];
  meta: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    skippedRows: number;
  };
}

// ============================================================================
// PapaParse Configuration
// ============================================================================

/**
 * Default PapaParse configuration for Azure DevOps CSV files
 */
const defaultPapaConfig: Papa.ParseConfig = {
  header: true, // First row as headers
  skipEmptyLines: true, // Skip empty lines
  transformHeader: (header: string) => header.trim(), // Trim whitespace from headers
  transform: (value: string) => {
    // Trim whitespace from values
    return value?.trim() || '';
  },
  // Handle different line endings (auto-detect)
  newline: undefined,
  // Handle quoted fields containing commas
  quoteChar: '"',
  escapeChar: '"',
  // Delimiter detection (comma, semicolon, tab)
  delimiter: '',
};

// ============================================================================
// CSV Parsing Functions
// ============================================================================

/**
 * Detect CSV delimiter (comma, semicolon, or tab)
 */
function detectDelimiter(content: string): string {
  const firstLine = content.split('\n')[0];
  const delimiters = [',', ';', '\t'];
  let maxCount = 0;
  let detectedDelimiter = ','; // Default to comma

  for (const delimiter of delimiters) {
    const count = (firstLine.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      detectedDelimiter = delimiter;
    }
  }

  return detectedDelimiter;
}

/**
 * Remove BOM (Byte Order Mark) from UTF-8 encoded files
 */
function removeBOM(content: string): string {
  // UTF-8 BOM is \uFEFF
  if (content.charCodeAt(0) === 0xfeff) {
    return content.slice(1);
  }
  return content;
}

/**
 * Parse CSV file content with PapaParse
 */
export async function parseCsvFile(
  fileContent: string | File
): Promise<ParsingResult> {
  // Handle BOM removal for string content
  let content = typeof fileContent === 'string' ? removeBOM(fileContent) : fileContent;

  // Detect delimiter if content is a string
  const delimiter =
    typeof content === 'string' ? detectDelimiter(content) : ',';

  // Configure PapaParse
  const config: Papa.ParseConfig = {
    ...defaultPapaConfig,
    delimiter,
  };

  // Parse CSV
  return new Promise((resolve) => {
    const errors: ParsingError[] = [];
    const validRows: CsvRow[] = [];

    Papa.parse<Record<string, string>>(content, {
      ...config,
      complete: (results) => {
        // results.data contains all parsed rows (header row is excluded when header: true)
        const totalRows = results.data.length;
        let rowIndex = 1; // Start at 1 (header is row 0, first data row is 1)

        // Process each row
        results.data.forEach((row) => {
          rowIndex++;

          // Handle PapaParse errors for this row
          const rowErrors = results.errors.filter(
            (err) => err.row === rowIndex - 1
          );
          if (rowErrors.length > 0) {
            rowErrors.forEach((error) => {
              errors.push({
                row: rowIndex,
                error: error.message || 'Parsing error',
                value: row,
              });
            });
            return;
          }

          // Skip empty rows (shouldn't happen with skipEmptyLines, but check anyway)
          if (!row || Object.keys(row).length === 0) {
            return;
          }

          // Validate row with Zod schema
          const validation = csvRowSchema.safeParse(row);

          if (!validation.success) {
            // Collect validation errors
            validation.error.issues.forEach((issue) => {
              errors.push({
                row: rowIndex,
                field: issue.path.join('.'),
                error: issue.message,
                value: row[issue.path[0] as string],
              });
            });
            return;
          }

          // Valid row
          validRows.push(validation.data);
        });

        const invalidRows = errors.length;
        const skippedRows = Math.max(0, totalRows - validRows.length - invalidRows);

        resolve({
          data: validRows,
          errors,
          meta: {
            totalRows,
            validRows: validRows.length,
            invalidRows,
            skippedRows,
          },
        });
      },
      error: (error) => {
        errors.push({
          row: 0,
          error: error.message || 'CSV parsing failed',
        });

        resolve({
          data: [],
          errors,
          meta: {
            totalRows: 0,
            validRows: 0,
            invalidRows: errors.length,
            skippedRows: 0,
          },
        });
      },
    });
  });
}

/**
 * Parse CSV file from File object
 */
export async function parseCsvFileFromFile(file: File): Promise<ParsingResult> {
  const content = await file.text();
  return parseCsvFile(content);
}

/**
 * Validate CSV headers match expected format
 */
export function validateCsvHeaders(headers: string[]): {
  valid: boolean;
  missing: string[];
  extra: string[];
} {
  const requiredHeaders = [
    'Work Item ID',
    'Title',
    'Work Item Type',
    'State',
  ];

  const normalizedHeaders = headers.map((h) => h.trim());
  const normalizedRequired = requiredHeaders.map((h) => h.trim());

  const missing = normalizedRequired.filter(
    (h) => !normalizedHeaders.includes(h)
  );
  const extra: string[] = []; // Optional headers are allowed

  return {
    valid: missing.length === 0,
    missing,
    extra,
  };
}

/**
 * Get CSV headers from file content
 */
export async function getCsvHeaders(
  fileContent: string | File
): Promise<string[]> {
  let content = typeof fileContent === 'string' ? removeBOM(fileContent) : fileContent;
  const delimiter = typeof content === 'string' ? detectDelimiter(content) : ',';

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(content, {
      ...defaultPapaConfig,
      delimiter,
      preview: 1, // Only parse first row (headers)
      complete: (results) => {
        if (results.meta.fields) {
          resolve(results.meta.fields);
        } else {
          reject(new Error('Could not extract headers from CSV'));
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV headers: ${error.message}`));
      },
    });
  });
}

// ============================================================================
// Error Formatting
// ============================================================================

/**
 * Format parsing errors for API response
 */
export function formatParsingErrors(errors: ParsingError[]): {
  message: string;
  details: ParsingError[];
  summary: {
    totalErrors: number;
    errorsByRow: Record<number, number>;
    errorsByField: Record<string, number>;
  };
} {
  const errorsByRow: Record<number, number> = {};
  const errorsByField: Record<string, number> = {};

  errors.forEach((error) => {
    // Count errors by row
    errorsByRow[error.row] = (errorsByRow[error.row] || 0) + 1;

    // Count errors by field
    if (error.field) {
      errorsByField[error.field] = (errorsByField[error.field] || 0) + 1;
    }
  });

  const totalErrors = errors.length;
  const message =
    totalErrors === 0
      ? 'No parsing errors'
      : `Found ${totalErrors} error${totalErrors > 1 ? 's' : ''} in CSV file`;

  return {
    message,
    details: errors,
    summary: {
      totalErrors,
      errorsByRow,
      errorsByField,
    },
  };
}

