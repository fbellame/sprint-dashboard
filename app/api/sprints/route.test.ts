import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}));

const { supabaseAdmin } = await import('@/lib/supabase/server');

describe('GET /api/sprints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list of sprints', async () => {
    const mockSprints = [
      {
        id: '1',
        sprint_number: 1,
        sprint_name: 'Sprint 1',
        start_date: '2024-01-15',
        end_date: '2024-01-29',
        team_name: 'Team A',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
    ];

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockSprints, error: null }),
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockSprints);
  });

  it('handles database errors', async () => {
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error', code: 'DB_ERROR' },
      }),
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('DATABASE_ERROR');
  });
});

describe('POST /api/sprints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new sprint', async () => {
    const newSprint = {
      sprint_number: 1,
      sprint_name: 'Sprint 1',
      start_date: '2024-01-15',
      end_date: '2024-01-29',
      team_name: 'Team A',
    };

    const createdSprint = {
      id: 'sprint-id',
      ...newSprint,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    };

    // Mock duplicate check (no existing sprint)
    const mockDuplicateCheck = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    };

    // Mock insert
    const mockInsert = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: createdSprint, error: null }),
    };

    vi.mocked(supabaseAdmin.from)
      .mockReturnValueOnce(mockDuplicateCheck as any)
      .mockReturnValueOnce(mockInsert as any);

    const request = new NextRequest('http://localhost/api/sprints', {
      method: 'POST',
      body: JSON.stringify(newSprint),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data?.sprint_name).toBe('Sprint 1');
  });

  it('validates input', async () => {
    const invalidSprint = {
      sprint_number: -1, // Invalid: must be positive
      sprint_name: '', // Invalid: must be non-empty
    };

    const request = new NextRequest('http://localhost/api/sprints', {
      method: 'POST',
      body: JSON.stringify(invalidSprint),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('VALIDATION_ERROR');
  });

  it('handles duplicate sprint numbers', async () => {
    const newSprint = {
      sprint_number: 1,
      sprint_name: 'Sprint 1',
      team_name: 'Team A',
    };

    // Mock duplicate check (existing sprint found)
    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 'existing-id' },
        error: null,
      }),
    } as any);

    const request = new NextRequest('http://localhost/api/sprints', {
      method: 'POST',
      body: JSON.stringify(newSprint),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.success).toBe(false);
    expect(data.error?.code).toBe('DUPLICATE_ENTRY');
  });
});
