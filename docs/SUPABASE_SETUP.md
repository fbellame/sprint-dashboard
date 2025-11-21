# Supabase Setup Guide

This document provides step-by-step instructions for setting up Supabase for the Sprint Dashboard project.

## Prerequisites

- Supabase account (sign up at https://supabase.com)
- Supabase CLI installed (optional, for local development)
- Docker Desktop (optional, for local Supabase)

## Step 1: Create Supabase Project

1. **Sign in to Supabase**
   - Go to https://app.supabase.com
   - Sign in with GitHub, Google, or email

2. **Create New Project**
   - Click "New Project"
   - Fill in project details:
     - **Name**: Sprint Dashboard
     - **Database Password**: Generate a strong password (save it securely!)
     - **Region**: Choose closest to your team (e.g., US East)
     - **Pricing Plan**: Free tier for development
   - Click "Create new project"
   - Wait for project provisioning (2-3 minutes)

3. **Note Your Project Details**
   - Project URL: `https://xxx.supabase.co`
   - Project ID: Found in project settings
   - Database password: Save in password manager

## Step 2: Get API Credentials

1. **Navigate to API Settings**
   - Go to Project Settings → API
   - Or visit: `https://app.supabase.com/project/[project-id]/settings/api`

2. **Copy Credentials**
   - **Project URL**: `https://xxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (Public, safe for client-side)
   - **service_role key**: `eyJhbGc...` (SECRET - server-side only!)

3. **Security Notes**
   - The `anon` key is safe to expose in client-side code
   - The `service_role` key bypasses Row Level Security - NEVER expose it
   - Only use `service_role` key in API routes and server-side code

## Step 3: Configure Environment Variables

1. **Create `.env.local` File**
   ```bash
   cp .env.example .env.local
   ```

2. **Add Your Credentials**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

3. **Verify `.env.local` is in `.gitignore`**
   - Check that `.env.local` is listed in `.gitignore`
   - Never commit `.env.local` to the repository

## Step 4: Test Connection

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Connection**
   - Visit: http://localhost:3000/api/test-db
   - You should see a success message
   - If you see "relation does not exist", that's OK - the schema will be created in Story 0.3

3. **Remove Test Route** (after verification)
   - Delete `app/api/test-db/route.ts` once connection is verified

## Step 5: Supabase Client Usage

### Client-Side Usage

```typescript
import { supabase } from '@/lib/supabase';

// In React components
const { data, error } = await supabase
  .from('sprints')
  .select('*');
```

### Server-Side Usage (API Routes)

```typescript
import { supabaseAdmin } from '@/lib/supabase/server';

// In API routes
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('sprints')
    .select('*');
  
  return NextResponse.json(data);
}
```

## Local Development (Optional)

### Install Supabase CLI

```bash
# Via npm
npm install -g supabase

# Via Homebrew (Mac)
brew install supabase/tap/supabase
```

### Initialize Local Supabase

```bash
# Initialize Supabase in project
supabase init

# Start local Supabase (requires Docker)
supabase start

# Get local connection details
supabase status
```

### Local Development Workflow

1. **Create Migrations Locally**
   ```bash
   supabase migration new migration_name
   ```

2. **Test Migrations Locally**
   ```bash
   supabase db reset  # Applies all migrations
   ```

3. **Push to Remote**
   ```bash
   supabase db push
   ```

## Troubleshooting

### Connection Errors

- **Error**: "Missing Supabase environment variables"
  - **Solution**: Check that `.env.local` exists and has all required variables
  - **Solution**: Restart the development server after adding env variables

### Authentication Errors

- **Error**: "Invalid API key"
  - **Solution**: Verify you copied the correct keys from Supabase dashboard
  - **Solution**: Check for extra spaces or newlines in `.env.local`

### Table Not Found Errors

- **Error**: "relation does not exist"
  - **Solution**: This is expected before Story 0.3 (database schema creation)
  - **Solution**: After Story 0.3, verify migrations were applied

## Security Best Practices

1. **Never commit secrets**
   - `.env.local` should be in `.gitignore`
   - Use `.env.example` for template

2. **Use correct client for context**
   - Client-side: Use `supabase` (respects RLS)
   - Server-side: Use `supabaseAdmin` (bypasses RLS)

3. **Protect service role key**
   - Only use in API routes
   - Never expose to client-side code
   - Rotate if exposed

4. **Share credentials securely**
   - Use password manager (1Password, LastPass)
   - Use encrypted document
   - Never use email or unencrypted channels

## Next Steps

After completing this setup:

1. ✅ Story 0.2: Set Up Supabase (this guide)
2. ⏭️ Story 0.3: Create Database Schema
3. ⏭️ Story 0.6: Vercel Deployment (configure env vars in Vercel)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Guide](https://supabase.com/docs/guides/cli)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Last Updated**: 2024-01-15  
**Story**: 0.2 - Set Up Supabase

