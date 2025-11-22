import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

const { supabaseAdmin } = await import('@/lib/supabase/server');

describe('POST /api/sprints/:id/upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads CSV file successfully', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000';
    const file = new File(['Work Item ID,Title\n1,Test Story'], 'test.csv', {
      type: 'text/csv',
    });

    const formData = new FormData();
    formData.append('file', file);

    const uploadRecord = {
      id: 'upload-id',
      sprint_id: sprintId,
      file_name: 'test.csv',
      file_size: file.size,
      upload_date: '2024-01-15T00:00:00Z',
      row_count: 1,
      status: 'uploaded',
      error_message: null,
    };

    // Mock sprint check
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: sprintId },
        error: null,
      }),
    } as any);

    // Mock upload insert
    vi.mocked(supabaseAdmin.from).mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: uploadRecord,
        error: null,
      }),
    } as any);

    const request = new NextRequest(
      'http://localhost/api/sprints/' + sprintId + '/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const params = Promise.resolve({ id: sprintId });
    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data?.file_name).toBe('test.csv');
    expect(data.data?.status).toBe('uploaded');
  });

  it('returns 404 for non-existent sprint', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000';
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', file);

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      }),
    } as any);

    const request = new NextRequest(
      'http://localhost/api/sprints/' + sprintId + '/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const params = Promise.resolve({ id: sprintId });
    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('NOT_FOUND');
  });

  it('rejects non-CSV files', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000';
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file);

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: sprintId },
        error: null,
      }),
    } as any);

    const request = new NextRequest(
      'http://localhost/api/sprints/' + sprintId + '/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const params = Promise.resolve({ id: sprintId });
    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('INVALID_FILE_TYPE');
  });

  it('rejects files larger than 10MB', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000';
    // Create a file larger than 10MB
    const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
    const file = new File([largeContent], 'large.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', file);

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: sprintId },
        error: null,
      }),
    } as any);

    const request = new NextRequest(
      'http://localhost/api/sprints/' + sprintId + '/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const params = Promise.resolve({ id: sprintId });
    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('FILE_TOO_LARGE');
  });

  it('rejects requests without file', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000';
    const formData = new FormData();

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: sprintId },
        error: null,
      }),
    } as any);

    const request = new NextRequest(
      'http://localhost/api/sprints/' + sprintId + '/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const params = Promise.resolve({ id: sprintId });
    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('MISSING_FILE');
  });

  it('validates UUID format', async () => {
    const invalidId = 'invalid-id';
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', file);

    const request = new NextRequest(
      'http://localhost/api/sprints/' + invalidId + '/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const params = Promise.resolve({ id: invalidId });
    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('VALIDATION_ERROR');
  });
});
