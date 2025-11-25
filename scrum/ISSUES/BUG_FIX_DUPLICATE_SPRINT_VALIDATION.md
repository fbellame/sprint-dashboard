# Bug Fix: Duplicate Sprint Number Validation

**Issue Type**: Bug Fix  
**Severity**: Medium  
**Priority**: Medium  
**Status**: ✅ Fixed  
**Branch**: `fix/duplicate-sprint-validation`  
**Date**: 2024-01-15

---

## Summary

Fixed duplicate sprint number validation to match the database constraint. The API was checking for global uniqueness, but the database constraint is team-based (`UNIQUE(sprint_number, team_name)`).

---

## Problem

The API validation logic was checking for global uniqueness (any sprint with the same number), but the database constraint allows team-based duplicates:

- Database constraint: `UNIQUE(sprint_number, team_name)`
- API validation: Was checking only `sprint_number` (global uniqueness)
- Result: Validation didn't match database behavior, allowing duplicates that should be rejected

---

## Root Cause

The validation query in `app/api/sprints/route.ts` was only checking `sprint_number` without considering `team_name`:

```typescript
// OLD CODE (incorrect)
const { data: existing } = await supabaseAdmin
  .from('sprints')
  .select('id, sprint_number')
  .eq('sprint_number', input.sprint_number)
  .maybeSingle();
```

This allowed:

- Sprint #1 with Team "QA Team" ✅
- Sprint #1 with null team_name ✅ (should be allowed, but validation was rejecting it incorrectly)

---

## Solution

Updated validation to check for team-based uniqueness, matching the database constraint:

```typescript
// NEW CODE (correct)
let duplicateQuery = supabaseAdmin
  .from('sprints')
  .select('id, sprint_number, team_name')
  .eq('sprint_number', input.sprint_number);

// Match team_name: if provided, check exact match; if null, check for null
if (input.team_name) {
  duplicateQuery = duplicateQuery.eq('team_name', input.team_name);
} else {
  duplicateQuery = duplicateQuery.is('team_name', null);
}

const { data: existing } = await duplicateQuery.maybeSingle();
```

---

## Changes Made

### 1. `app/api/sprints/route.ts` (POST endpoint)

- Updated duplicate check to include `team_name` matching
- Changed from global uniqueness to team-based uniqueness
- Improved error messages to include team context

### 2. `app/api/sprints/[id]/route.ts` (PUT endpoint)

- Updated duplicate check to include `team_name` matching
- Handles updates to both `sprint_number` and `team_name`
- Fetches current sprint data to check against

### 3. `components/sprints/CreateSprintForm.tsx`

- Updated error message handling to use server-provided error message
- Better error message display for duplicate validation

---

## Validation Behavior

After fix, validation correctly enforces team-based uniqueness:

- ✅ Sprint #1 with Team "QA Team" is allowed
- ✅ Sprint #1 with no team (null) is allowed (different from Team "QA Team")
- ❌ Sprint #1 with Team "QA Team" (duplicate) is rejected with 409 Conflict
- ❌ Sprint #1 with no team (null) when one already exists with null is rejected

---

## Testing

- ✅ All existing unit tests pass
- ✅ TypeScript compilation passes
- ✅ Build successful
- ✅ Linting passes

---

## Related Files

- `app/api/sprints/route.ts` - Sprint creation endpoint
- `app/api/sprints/[id]/route.ts` - Sprint update endpoint
- `components/sprints/CreateSprintForm.tsx` - Form component
- `supabase/migrations/20240115000000_initial_schema.sql` - Database schema

---

## Acceptance Criteria

- [x] Duplicate validation logic matches database constraint
- [x] Validation works consistently (team-based uniqueness)
- [x] Appropriate error response (409 Conflict) is returned for duplicates
- [x] Error message is clear and user-friendly
- [x] Database constraints match API validation logic
- [x] Unit tests cover duplicate validation scenarios

---

**Status**: ✅ Fixed and ready for review
