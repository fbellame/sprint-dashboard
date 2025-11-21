# Next Steps: API Utilities & Migration Helper

**Developer**: dev_backend  
**Date**: 2024-01-15  
**Purpose**: Prepare foundational utilities for Sprint 1 API development

---

## Overview

After completing Stories 0.2 and 0.3, I've created foundational utilities and helpers that will be needed for Sprint 1 API development. These are not part of Sprint 0 stories but will significantly accelerate Sprint 1 work.

---

## What Was Created

### 1. Migration Helper Script ✅

**File**: `scripts/apply-migration.sh`

A helper script to apply the database migration to Supabase using either:
- **CLI method**: Uses Supabase CLI to push migrations
- **Dashboard method**: Provides instructions for using Supabase SQL Editor

**Usage**:
```bash
# Using CLI (default)
./scripts/apply-migration.sh cli

# Get instructions for Dashboard method
./scripts/apply-migration.sh dashboard
```

**Features**:
- Checks for Supabase CLI installation
- Validates migration file exists
- Provides clear error messages
- Guides through both application methods

### 2. API Utility Functions ✅

**File**: `lib/api/utils.ts`

Common utilities for API routes including:

**Error Handling**:
- `ApiError` - Base error class for API errors
- `ValidationError` - For request validation errors
- `NotFoundError` - For resource not found errors
- `errorResponse()` - Standardized error response formatter
- `withErrorHandling()` - Wrapper for automatic error handling

**Response Helpers**:
- `successResponse()` - Standardized success response
- `errorResponse()` - Standardized error response
- `paginatedResponse()` - Paginated response formatter

**Validation**:
- `parseBody()` - Parse and validate request body with Zod
- `getQueryParam()` - Get single query parameter
- `getQueryParams()` - Get all query parameters
- `parsePagination()` - Parse pagination parameters

**ID Validation**:
- `isValidUUID()` - Validate UUID format
- `parseUUID()` - Validate and parse UUID from request

**Benefits**:
- Consistent error handling across all API routes
- Type-safe request parsing
- Standardized response formats
- Reduced boilerplate code

### 3. Supabase Database Helpers ✅

**File**: `lib/api/supabase-helpers.ts`

Type-safe database operation helpers:

**Sprint Operations**:
- `getSprintById()` - Get sprint by ID
- `getSprintByNumber()` - Get sprint by sprint number
- `getAllSprints()` - Get all sprints
- `createSprint()` - Create new sprint
- `updateSprint()` - Update sprint
- `deleteSprint()` - Delete sprint (cascades)

**Work Item Operations**:
- `getWorkItemsBySprint()` - Get all work items for a sprint
- `getWorkItemById()` - Get work item by ID
- `createWorkItem()` - Create work item
- `bulkCreateWorkItems()` - Bulk create work items (for CSV import)
- `updateWorkItem()` - Update work item
- `deleteWorkItem()` - Delete work item

**View Operations**:
- `getTeamBacklogMetrics()` - Get team backlog metrics
- `getStoriesByState()` - Get stories breakdown by state
- `getTopFeatures()` - Get top features by story points

**Sprint Configuration**:
- `getSprintConfiguration()` - Get sprint configuration

**Benefits**:
- Type-safe database operations
- Consistent error handling
- Reusable across all API routes
- Reduces code duplication

---

## Dependencies Added

- ✅ `zod` - Installed for request validation

---

## Verification

- ✅ TypeScript compilation passes (`npm run type-check`)
- ✅ No linting errors
- ✅ All utilities are properly typed
- ✅ Error handling is comprehensive

---

## Usage Examples

### Example 1: API Route with Error Handling

```typescript
import { withErrorHandling, successResponse, parseUUID } from '@/lib/api/utils';
import { getSprintById } from '@/lib/api/supabase-helpers';

export const GET = withErrorHandling(async (request: Request) => {
  const url = new URL(request.url);
  const id = parseUUID(url.pathname.split('/').pop() || '');
  
  const sprint = await getSprintById(id);
  return successResponse(sprint);
});
```

### Example 2: API Route with Validation

```typescript
import { parseBody, successResponse } from '@/lib/api/utils';
import { createSprint } from '@/lib/api/supabase-helpers';
import { z } from 'zod';

const createSprintSchema = z.object({
  sprint_number: z.number(),
  sprint_name: z.string(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  team_name: z.string().optional(),
});

export const POST = withErrorHandling(async (request: Request) => {
  const data = await parseBody(request, createSprintSchema);
  const sprint = await createSprint(data);
  return successResponse(sprint, 201);
});
```

### Example 3: Using Database Views

```typescript
import { getTeamBacklogMetrics, getTopFeatures } from '@/lib/api/supabase-helpers';

// Get metrics for dashboard
const metrics = await getTeamBacklogMetrics(sprintId);
const topFeatures = await getTopFeatures(sprintId, 5);
```

---

## Next Steps for Sprint 1

With these utilities in place, Sprint 1 API development will be much faster:

1. **Sprint Management APIs** (Story 1.1-1.3)
   - Use `lib/api/supabase-helpers.ts` for database operations
   - Use `lib/api/utils.ts` for error handling and validation

2. **CSV Upload APIs** (Story 1.4-1.6)
   - Use `bulkCreateWorkItems()` for importing CSV data
   - Use `parseBody()` for file upload validation

3. **Dashboard APIs** (Story 3.1-3.9)
   - Use view helpers (`getTeamBacklogMetrics()`, etc.)
   - Use `paginatedResponse()` for large datasets

---

## Files Created

- `scripts/apply-migration.sh` - Migration helper script
- `lib/api/utils.ts` - API utility functions
- `lib/api/supabase-helpers.ts` - Database operation helpers

---

## Benefits

1. **Faster Development**: Pre-built utilities reduce boilerplate
2. **Consistency**: Standardized error handling and responses
3. **Type Safety**: Full TypeScript support throughout
4. **Maintainability**: Centralized utilities are easier to update
5. **Testing**: Utilities can be tested independently

---

## Notes

- These utilities are ready to use but not required for Sprint 0
- They will significantly accelerate Sprint 1 development
- All utilities follow the same patterns and conventions
- Error handling is comprehensive and user-friendly

---

**Status**: ✅ Complete  
**Ready for**: Sprint 1 API Development

