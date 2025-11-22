# Local Supabase Setup with Docker

This guide shows you how to run Supabase locally using Docker and the Supabase CLI. This is perfect for development and testing without needing a remote Supabase project.

## Prerequisites

### 1. Install Docker Desktop

**Download and Install**:

- **macOS**: Download from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
- **Windows**: Download from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow [Docker Engine installation guide](https://docs.docker.com/engine/install/)

**Verify Installation**:

```bash
docker --version
docker-compose --version
```

**Start Docker Desktop**:

- Make sure Docker Desktop is running before proceeding
- You should see the Docker icon in your system tray/menu bar

### 2. Install Supabase CLI

**Option 1: Via npm (Recommended)**

```bash
npm install -g supabase
```

**Option 2: Via Homebrew (macOS)**

```bash
brew install supabase/tap/supabase
```

**Option 3: Via Scoop (Windows)**

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Verify Installation**:

```bash
supabase --version
```

## Step 1: Initialize Local Supabase

Navigate to your project directory and initialize Supabase:

```bash
cd sprint-dashboard

# Initialize Supabase in the project
supabase init
```

This creates a `supabase/` directory with configuration files.

## Step 2: Start Local Supabase

Start the local Supabase stack (this will download Docker images on first run):

```bash
supabase start
```

**First Run**: This may take 5-10 minutes as it downloads Docker images.

**Expected Output**:

```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note**: Save the `anon key` and `service_role key` - you'll need them for `.env.local`

## Step 3: Check Status

Verify everything is running:

```bash
supabase status
```

This shows all running services and their URLs.

## Step 4: Apply Database Migrations

Apply the existing database schema:

```bash
# Apply all migrations
supabase db reset
```

This will:

- Reset the local database
- Apply all migrations from `supabase/migrations/`
- Create all tables, indexes, and constraints

**Verify Tables Created**:

```bash
# Connect to local database
supabase db diff
```

Or use the Studio UI (see Step 5).

## Step 5: Access Supabase Studio (Optional)

Open Supabase Studio in your browser:

```bash
# Studio URL is shown in supabase status
# Or open directly:
open http://localhost:54323
```

**Studio Features**:

- Browse database tables
- Run SQL queries
- View table data
- Test API endpoints
- Manage authentication

## Step 6: Configure Environment Variables

Create or update `.env.local` with local Supabase credentials:

```bash
# Get the credentials from supabase status
supabase status
```

**Create `.env.local`**:

```env
# Local Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**:

- Replace the keys with the actual values from `supabase status`
- The `anon key` is the public key (safe for client-side)
- The `service_role key` is the admin key (server-side only)

## Step 7: Test the Connection

1. **Start the Next.js development server**:

   ```bash
   npm run dev
   ```

2. **Test the database connection**:
   - Visit: http://localhost:3000/api/test-db
   - You should see a success message

3. **Test API endpoints**:
   - Try creating a sprint: http://localhost:3000/sprints/new
   - Try viewing sprints: http://localhost:3000

## Step 8: Verify Everything Works

### Test Database Connection

```bash
# Test via API
curl http://localhost:3000/api/test-db
```

### Test Creating a Sprint

1. Navigate to: http://localhost:3000/sprints/new
2. Fill in the form
3. Submit
4. Should redirect to sprint detail page

### View Data in Studio

1. Open: http://localhost:54323
2. Go to "Table Editor"
3. You should see your `sprints` table
4. View the data you just created

## Local Development Workflow

### Daily Development

```bash
# Start Supabase (if not already running)
supabase start

# Start Next.js dev server
npm run dev
```

### Creating New Migrations

```bash
# Create a new migration
supabase migration new add_new_feature

# Edit the migration file in supabase/migrations/

# Apply migration locally
supabase db reset

# Or apply just the new migration
supabase migration up
```

### Testing Migrations Locally

```bash
# Reset database and apply all migrations
supabase db reset

# This is safe - it only affects your local database
```

### Stopping Local Supabase

```bash
# Stop Supabase (keeps data)
supabase stop

# Stop and remove all data
supabase stop --no-backup
```

## Troubleshooting

### Docker Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**:

1. Start Docker Desktop
2. Wait for Docker to fully start
3. Try `supabase start` again

### Port Already in Use

**Error**: `Port 54321 is already in use`

**Solution**:

```bash
# Check what's using the port
lsof -i :54321

# Stop the conflicting service
# Or stop Supabase if it's already running
supabase stop
```

### Database Connection Errors

**Error**: `relation does not exist`

**Solution**:

```bash
# Make sure migrations are applied
supabase db reset
```

### Environment Variables Not Loading

**Error**: `Missing Supabase environment variables`

**Solution**:

1. Check `.env.local` exists and has correct values
2. Restart Next.js dev server after changing `.env.local`
3. Verify keys from `supabase status` match `.env.local`

### Reset Everything

If something goes wrong, you can reset:

```bash
# Stop Supabase
supabase stop

# Remove all data
supabase stop --no-backup

# Start fresh
supabase start

# Apply migrations
supabase db reset
```

## Local vs Remote Supabase

### When to Use Local

✅ **Use Local Supabase for**:

- Development and testing
- Testing migrations before pushing to production
- Learning and experimentation
- Offline development
- No API rate limits
- Fast iteration

### When to Use Remote

✅ **Use Remote Supabase for**:

- Production deployment
- Shared team database
- CI/CD pipelines
- Production data

### Switching Between Local and Remote

**Use Local**:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
```

**Use Remote**:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<remote-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<remote-service-role-key>
```

**Note**: Just update `.env.local` and restart the dev server.

## Useful Commands

```bash
# Start Supabase
supabase start

# Stop Supabase
supabase stop

# Check status
supabase status

# View logs
supabase logs

# Reset database (apply all migrations)
supabase db reset

# Create new migration
supabase migration new migration_name

# Apply pending migrations
supabase migration up

# Rollback last migration
supabase migration down

# Generate TypeScript types from database
supabase gen types typescript --local > lib/types/database.ts
```

## Next Steps

After local Supabase is running:

1. ✅ Test all API endpoints
2. ✅ Run E2E tests (they should pass now!)
3. ✅ Develop new features locally
4. ✅ Test migrations before pushing to production

## Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
- [Docker Desktop Documentation](https://docs.docker.com/desktop/)

---

**Last Updated**: 2024-01-15  
**Status**: ✅ Ready for Local Development
