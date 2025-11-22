'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { apiClient, ClientApiError } from '@/lib/api/client';
import type { Sprint } from '@/lib/api/types';
import type { CsvUpload } from '@/lib/types/database';
import { CSVUploader } from '@/components/common/CSVUploader';
import { Button } from '@/components/common/Button';
import { formatError } from '@/lib/utils/errors';
import { createLoadingState } from '@/lib/utils/loading';
import Link from 'next/link';

interface ProcessingResult {
  parsing_result: {
    total_rows: number;
    valid_rows: number;
    invalid_rows: number;
    skipped_rows: number;
    errors: string | null;
  };
  transformation_result: {
    work_items_count: number;
  };
  storage_result: {
    inserted: number;
    updated: number;
    failed: number;
    total_stored: number;
    errors: Array<{ work_item_id: string; error: string }> | null;
  };
}

/**
 * CSV Upload Page
 *
 * Allows users to upload CSV files for a sprint.
 * Handles file upload, processing, and displays results.
 */
export default function CSVUploadPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sprintId = params.id as string;

  const [uploadResults, setUploadResults] = useState<ProcessingResult | null>(
    null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch sprint information
  const {
    data: sprint,
    isLoading: isLoadingSprint,
    isError: isSprintError,
    error: sprintError,
  } = useQuery<Sprint>({
    queryKey: ['sprint', sprintId],
    queryFn: () => apiClient.get<Sprint>(`/api/sprints/${sprintId}`),
    enabled: !!sprintId,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<CsvUpload> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/sprints/${sprintId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ClientApiError(
          response.status,
          error.error?.message || 'Upload failed',
          error.error?.code || 'UPLOAD_ERROR',
          error
        );
      }

      const result = await response.json();
      return result.data;
    },
  });

  // Process mutation
  const processMutation = useMutation({
    mutationFn: async ({
      fileContent,
      uploadId,
    }: {
      fileContent: string;
      uploadId: string;
    }): Promise<ProcessingResult> => {
      const response = await fetch(
        `/api/sprints/${sprintId}/upload/process`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file_content: fileContent,
            upload_id: uploadId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new ClientApiError(
          response.status,
          error.error?.message || 'Processing failed',
          error.error?.code || 'PROCESSING_ERROR',
          error
        );
      }

      const result = await response.json();
      return result.data;
    },
  });

  // Handle file upload
  const handleUpload = async (files: File[]) => {
    setUploadError(null);
    setUploadResults(null);

    try {
      // Upload each file and process it
      for (const file of files) {
        // Step 1: Upload file
        const uploadResult = await uploadMutation.mutateAsync(file);

        // Step 2: Read file content
        const fileContent = await file.text();

        // Step 3: Process file
        const processingResult = await processMutation.mutateAsync({
          fileContent,
          uploadId: uploadResult.id,
        });

        setUploadResults(processingResult);
      }

      // Invalidate sprint queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });

      // Redirect to dashboard after a short delay to show results
      setTimeout(() => {
        router.push(`/sprints/${sprintId}`);
      }, 2000);
    } catch (error) {
      const formattedError = formatError(error);
      setUploadError(formattedError.userMessage);
    }
  };

  const loadingState = createLoadingState(
    isLoadingSprint,
    false,
    isSprintError,
    sprintError
  );

  // Loading state
  if (loadingState.isInitialLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Loading sprint information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState.isError) {
    const formattedError = formatError(sprintError);
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Sprint
            </h3>
            <p className="text-sm text-red-600 mb-4">
              {formattedError.userMessage}
            </p>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Sprint List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isUploading =
    uploadMutation.isPending || processMutation.isPending;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Upload CSV Files
              </h1>
              {sprint && (
                <p className="text-lg text-gray-600">
                  {sprint.sprint_name} (Sprint #{sprint.sprint_number})
                </p>
              )}
            </div>
            <Link href={`/sprints/${sprintId}`}>
              <Button variant="outline" size="sm">
                Back to Sprint
              </Button>
            </Link>
          </div>
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-md mb-6"
            role="alert"
          >
            <p className="text-sm text-red-800">{uploadError}</p>
          </div>
        )}

        {/* Upload Results */}
        {uploadResults && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              ✅ Upload Successful!
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Total Rows:</span>{' '}
                <span className="text-gray-900">
                  {uploadResults.parsing_result.total_rows}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Valid Rows:</span>{' '}
                <span className="text-green-700">
                  {uploadResults.parsing_result.valid_rows}
                </span>
              </div>
              {uploadResults.parsing_result.invalid_rows > 0 && (
                <div>
                  <span className="font-medium text-gray-700">
                    Invalid Rows:
                  </span>{' '}
                  <span className="text-red-700">
                    {uploadResults.parsing_result.invalid_rows}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">
                  Work Items Stored:
                </span>{' '}
                <span className="text-gray-900">
                  {uploadResults.storage_result.total_stored} (
                  {uploadResults.storage_result.inserted} inserted,{' '}
                  {uploadResults.storage_result.updated} updated)
                </span>
              </div>
              {uploadResults.storage_result.failed > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Failed:</span>{' '}
                  <span className="text-red-700">
                    {uploadResults.storage_result.failed}
                  </span>
                </div>
              )}
              {uploadResults.parsing_result.errors && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    {uploadResults.parsing_result.errors}
                  </p>
                </div>
              )}
            </div>
            <p className="text-sm text-green-700 mt-4">
              Redirecting to sprint dashboard...
            </p>
          </div>
        )}

        {/* CSV Uploader */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Select CSV Files
            </h2>
            <p className="text-sm text-gray-600">
              Upload CSV files exported from Azure DevOps. Files will be
              processed and work items will be imported into this sprint.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>Note:</strong> Re-uploading will update existing work
              items with the same Work Item ID.
            </p>
          </div>

          <CSVUploader
            onUpload={handleUpload}
            maxFileSize={10 * 1024 * 1024} // 10MB
            maxFiles={10}
            disabled={isUploading}
          />
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Export your work items from Azure DevOps as CSV</li>
            <li>Ensure required fields are present: Work Item ID, Title, Work Item Type, State</li>
            <li>Maximum file size: 10MB per file</li>
            <li>You can upload multiple files at once</li>
            <li>Re-uploading will update existing work items</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

