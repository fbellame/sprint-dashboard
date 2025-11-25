'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import type { CreateSprintInput } from '@/lib/api/schemas/sprint';
import { apiClient, ClientApiError } from '@/lib/api/client';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { formatError } from '@/lib/utils/errors';

/**
 * Create Sprint Form Component
 *
 * Form for creating a new sprint with validation and error handling.
 * Redirects to sprint detail page on success.
 */
export function CreateSprintForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form schema that accepts empty strings and transforms them to null
  const formSchema = z
    .object({
      sprint_number: z.coerce.number().int().positive(),
      sprint_name: z.string().min(1).max(255),
      start_date: z
        .string()
        .optional()
        .transform((val) => (val && val.trim() !== '' ? val : null)),
      end_date: z
        .string()
        .optional()
        .transform((val) => (val && val.trim() !== '' ? val : null)),
      team_name: z
        .string()
        .optional()
        .transform((val) => (val && val.trim() !== '' ? val : null)),
    })
    .refine(
      (data) => {
        // If both dates are provided, end_date should be after start_date
        if (data.start_date && data.end_date) {
          return new Date(data.end_date) >= new Date(data.start_date);
        }
        return true;
      },
      {
        message: 'End date must be after or equal to start date',
        path: ['end_date'],
      }
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sprint_number: undefined,
      sprint_name: '',
      start_date: '',
      end_date: '',
      team_name: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Data is already transformed by the schema (empty strings -> null)
      // Validate dates if provided
      const payload: CreateSprintInput = {
        sprint_number: data.sprint_number,
        sprint_name: data.sprint_name,
        start_date: data.start_date,
        end_date: data.end_date,
        team_name: data.team_name,
      };

      const sprint = await apiClient.post<{ id: string }>(
        '/api/sprints',
        payload
      );

      // Redirect to sprint detail page
      router.push(`/sprints/${sprint.id}`);
    } catch (error) {
      if (error instanceof ClientApiError) {
        // Handle duplicate sprint number (409 Conflict)
        if (error.statusCode === 409) {
          const errorMessage =
            error.message ||
            'A sprint with this number already exists for this team.';
          setError('sprint_number', {
            type: 'manual',
            message: errorMessage,
          });
          setSubmitError(errorMessage);
        } else if (error.statusCode === 400) {
          // Validation error from server
          const formattedError = formatError(error);
          setSubmitError(formattedError.userMessage);
        } else {
          // Other errors
          const formattedError = formatError(error);
          setSubmitError(formattedError.userMessage);
        }
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sprint Number */}
      <Input
        {...register('sprint_number', {
          valueAsNumber: true,
        })}
        type="number"
        label="Sprint Number"
        placeholder="e.g., 31"
        required
        error={errors.sprint_number?.message}
        helperText="A unique number to identify this sprint"
      />

      {/* Sprint Name */}
      <Input
        {...register('sprint_name')}
        type="text"
        label="Sprint Name"
        placeholder="e.g., Sprint 31"
        required
        error={errors.sprint_name?.message}
        helperText="A descriptive name for this sprint"
      />

      {/* Start Date */}
      <Input
        {...register('start_date')}
        type="date"
        label="Start Date"
        error={errors.start_date?.message}
        helperText="The date when this sprint begins"
      />

      {/* End Date */}
      <Input
        {...register('end_date')}
        type="date"
        label="End Date"
        error={errors.end_date?.message}
        helperText="The date when this sprint ends"
      />

      {/* Team Name */}
      <Input
        {...register('team_name')}
        type="text"
        label="Team Name"
        placeholder="e.g., Platform Team"
        error={errors.team_name?.message}
        helperText="Optional: The team working on this sprint"
      />

      {/* Submit Error */}
      {submitError && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="flex-1 sm:flex-initial"
        >
          Create Sprint
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1 sm:flex-initial"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
