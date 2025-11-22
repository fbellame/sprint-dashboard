import { z } from 'zod';

/**
 * Zod schemas for CSV Upload API validation
 */

/**
 * File upload validation
 */
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'File cannot be empty')
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'File size must be less than 10MB'
    )
    .refine(
      (file) => file.type === 'text/csv' || file.name.endsWith('.csv'),
      'File must be a CSV file'
    ),
});

/**
 * Sprint ID parameter schema
 */
export const sprintIdSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Type exports
 */
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type SprintIdParams = z.infer<typeof sprintIdSchema>;
