import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextResponse } from 'next/server';

// Mock the Supabase server module
vi.mock('@/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    })),
  },
}));

describe('GET /api/test-db', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  });

  it('returns 503 when environment variables are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.success).toBe(false);
    expect(data.message).toContain('environment variables not configured');
  });

  it('returns success when connection works', async () => {
    const { supabaseAdmin } = await import('@/lib/supabase/server');
    const mockData = [{ count: 0 }];

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain('successful');
  });

  it('handles database errors gracefully', async () => {
    const { supabaseAdmin } = await import('@/lib/supabase/server');

    vi.mocked(supabaseAdmin.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'relation does not exist' },
      }),
    } as any);

    const response = await GET();
    const data = await response.json();

    // Should still return success for PGRST116 (table doesn't exist yet)
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
