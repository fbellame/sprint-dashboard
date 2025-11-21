import { NextResponse } from 'next/server';

/**
 * Test API route to verify Supabase connection
 * GET /api/test-db
 * 
 * This route tests the database connection using the admin client.
 * Remove this route after verifying the connection works.
 */
export async function GET() {
  // Check if environment variables are available
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      {
        success: false,
        message: 'Supabase environment variables not configured',
        hint: 'This is expected during build or if .env.local is not set up',
      },
      { status: 503 }
    );
  }

  try {
    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('@/lib/supabase/server');

    // Test query - try to query a system table that should always exist
    const { data, error } = await supabaseAdmin
      .from('sprints')
      .select('count')
      .limit(1);

    // If table doesn't exist yet (before Story 0.3), that's OK
    // We just want to verify the connection works
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "relation does not exist" - expected before schema is created
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          hint: 'This is expected if the database schema has not been created yet (Story 0.3)',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: data || 'Connection works (schema may not be created yet)',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

