import { z } from 'zod';

/**
 * Zod schemas for Sprint API validation
 */

/**
 * Create Sprint input schema
 */
export const createSprintSchema = z.object({
  sprint_number: z.number().int().positive(),
  sprint_name: z.string().min(1).max(255),
  start_date: z.string().date().nullable().optional(),
  end_date: z.string().date().nullable().optional(),
  team_name: z.string().max(255).nullable().optional(),
});

/**
 * Update Sprint input schema
 */
export const updateSprintSchema = z.object({
  sprint_number: z.number().int().positive().optional(),
  sprint_name: z.string().min(1).max(255).optional(),
  start_date: z.string().date().nullable().optional(),
  end_date: z.string().date().nullable().optional(),
  team_name: z.string().max(255).nullable().optional(),
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
export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
export type SprintIdParams = z.infer<typeof sprintIdSchema>;
