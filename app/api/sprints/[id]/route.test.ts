import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PUT, DELETE } from './route';
import { NextRequest } from 'next/server';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

const { supabaseAdmin } = await import('@/lib/supabase/server');

describe('GET /api/sprints/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns sprint details', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID
    const mockSprint = {
      id: sprintId,
      sprint_number: 1,
      sprint_name: 'Sprint 1',
      start_date: '2024-01-15',
      end_date: '2024-01-29',
      team_name: 'Team A',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    };

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockSprint, error: null }),
    } as any);

    const params = Promise.resolve({ id: sprintId });
    const response = await GET(new NextRequest('http://localhost'), { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockSprint);
  });

  it('returns 404 for non-existent sprint', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      }),
    } as any);

    const params = Promise.resolve({ id: sprintId });
    const response = await GET(new NextRequest('http://localhost'), { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('NOT_FOUND');
  });

  it('validates UUID format', async () => {
    const params = Promise.resolve({ id: 'invalid-id' });
    const response = await GET(new NextRequest('http://localhost'), { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('VALIDATION_ERROR');
  });
});

describe('PUT /api/sprints/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates sprint', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID
    const updatedSprint = {
      id: sprintId,
      sprint_number: 1,
      sprint_name: 'Updated Sprint 1',
      start_date: '2024-01-15',
      end_date: '2024-01-29',
      team_name: 'Team A',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    };

    // Mock existing sprint check (returns sprint with team_name)
    const mockExistingCheck = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: sprintId, team_name: 'Team A' },
        error: null,
      }),
    };

    // Mock duplicate check (no duplicate - sprint_number not being updated in this test)
    // Since sprint_number is not in the update body, duplicate check won't run
    // But we need to mock it in case the code path changes

    // Mock update
    const mockUpdate = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: updatedSprint,
        error: null,
      }),
    };

    vi.mocked(supabaseAdmin.from)
      .mockReturnValueOnce(mockExistingCheck as any)
      .mockReturnValueOnce(mockUpdate as any);

    const request = new NextRequest(
      `http://localhost/api/sprints/${sprintId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ sprint_name: 'Updated Sprint 1' }),
      }
    );

    const params = Promise.resolve({ id: sprintId });
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.sprint_name).toBe('Updated Sprint 1');
  });

  it('validates input', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID
    const request = new NextRequest(
      `http://localhost/api/sprints/${sprintId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ sprint_name: '' }), // Invalid: empty string
      }
    );

    const params = Promise.resolve({ id: sprintId });
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('VALIDATION_ERROR');
  });
});

describe('DELETE /api/sprints/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes sprint', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID
    // Mock existing sprint check
    const mockExistingCheck = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: sprintId },
        error: null,
      }),
    };

    // Mock delete
    const mockDelete = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };

    vi.mocked(supabaseAdmin.from)
      .mockReturnValueOnce(mockExistingCheck as any)
      .mockReturnValueOnce(mockDelete as any);

    const params = Promise.resolve({ id: sprintId });
    const response = await DELETE(new NextRequest('http://localhost'), {
      params,
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.message).toContain('deleted successfully');
  });

  it('returns 404 for non-existent sprint on delete', async () => {
    const sprintId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID
    const mockCheck = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      }),
    };

    vi.mocked(supabaseAdmin.from).mockReturnValue(mockCheck as any);

    const params = Promise.resolve({ id: sprintId });
    const response = await DELETE(new NextRequest('http://localhost'), {
      params,
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('NOT_FOUND');
  });
});
