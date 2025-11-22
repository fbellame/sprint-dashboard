'use client';

import { useCallback, useState, useRef } from 'react';
import { Button } from './Button';

interface CSVUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

interface FileWithStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  progress?: number;
}

/**
 * CSV Uploader Component
 *
 * A drag-and-drop file uploader component for CSV files.
 * Supports multiple file selection, validation, and upload progress.
 *
 * @example
 * ```tsx
 * <CSVUploader
 *   onUpload={async (files) => {
 *     // Handle file upload
 *   }}
 * />
 * ```
 */
export function CSVUploader({
  onUpload,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  disabled = false,
  className = '',
}: CSVUploaderProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    const isValidType =
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.toLowerCase().endsWith('.csv');

    if (!isValidType) {
      return 'Invalid file type. Only CSV files are allowed.';
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / 1024 / 1024).toFixed(0);
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      return `File size (${fileSizeMB}MB) exceeds maximum allowed size of ${maxSizeMB}MB.`;
    }

    // Check if file is empty
    if (file.size === 0) {
      return 'File is empty.';
    }

    return null;
  };

  // Handle file selection
  const handleFiles = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      setUploadError(null);

      const newFiles: FileWithStatus[] = [];
      const errors: string[] = [];

      // Check max files limit
      if (files.length + selectedFiles.length > maxFiles) {
        setUploadError(
          `Maximum ${maxFiles} files allowed. You selected ${selectedFiles.length} files, but only ${maxFiles - files.length} slots are available.`
        );
        return;
      }

      // Process each file
      Array.from(selectedFiles).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          newFiles.push({
            file,
            status: 'pending',
          });
        }
      });

      if (errors.length > 0) {
        setUploadError(errors.join('\n'));
      }

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [files.length, maxFileSize, maxFiles]
  );

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    handleFiles(e.dataTransfer.files);
  };

  // Handle upload
  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setUploadError(null);

    // Update all pending files to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.status === 'pending' ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );

    try {
      const filesToUpload = pendingFiles.map((f) => f.file);
      await onUpload(filesToUpload);

      // Mark as success
      setFiles((prev) =>
        prev.map((f) =>
          pendingFiles.includes(f)
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Upload failed. Please try again.';

      // Mark as error
      setFiles((prev) =>
        prev.map((f) =>
          pendingFiles.includes(f)
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );

      setUploadError(errorMessage);
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all files
  const clearAll = () => {
    setFiles([]);
    setUploadError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const pendingFiles = files.filter((f) => f.status === 'pending');
  const hasFiles = files.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragging
              ? 'border-primary bg-primary-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="CSV file upload drop zone"
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-describedby="csv-upload-instructions"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv,application/vnd.ms-excel"
          multiple
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
          aria-label="Select CSV files"
        />

        <div className="space-y-2">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-lg font-medium text-gray-700">
            {isDragging
              ? 'Drop CSV files here'
              : 'Drag and drop CSV files here'}
          </p>
          <p className="text-sm text-gray-500">
            or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="text-primary hover:text-primary-600 underline font-medium"
            >
              browse files
            </button>
          </p>
          <p
            id="csv-upload-instructions"
            className="text-xs text-gray-400 mt-2"
            role="note"
          >
            Maximum {maxFiles} files, {formatFileSize(maxFileSize)} per file.
            Press Enter or Space to browse files.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <p className="text-sm text-red-800 whitespace-pre-line">
            {uploadError}
          </p>
        </div>
      )}

      {/* File List */}
      {hasFiles && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Selected Files ({files.length})
            </h3>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2" role="list" aria-label="Selected files">
            {files.map((fileWithStatus, index) => (
              <div
                key={`${fileWithStatus.file.name}-${index}`}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md"
                role="listitem"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileWithStatus.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileWithStatus.file.size)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Indicator */}
                  {fileWithStatus.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-xs text-gray-600">
                        {fileWithStatus.progress || 0}%
                      </span>
                    </div>
                  )}
                  {fileWithStatus.status === 'success' && (
                    <span
                      className="text-green-600 text-sm"
                      aria-label="Upload successful"
                    >
                      ✓
                    </span>
                  )}
                  {fileWithStatus.status === 'error' && (
                    <span
                      className="text-red-600 text-sm"
                      title={fileWithStatus.error}
                      aria-label={`Upload failed: ${fileWithStatus.error}`}
                    >
                      ✗
                    </span>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={fileWithStatus.status === 'uploading'}
                    className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                    aria-label={`Remove ${fileWithStatus.file.name}`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          {pendingFiles.length > 0 && (
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={handleUpload}
                disabled={disabled || pendingFiles.length === 0}
                className="w-full sm:w-auto"
              >
                Upload {pendingFiles.length} file
                {pendingFiles.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
