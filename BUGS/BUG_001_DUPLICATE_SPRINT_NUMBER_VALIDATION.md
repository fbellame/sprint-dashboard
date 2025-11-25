# Bug #001: Duplicate Sprint Number Validation Not Working

**Bug Type**: Functional Bug  
**Severity**: Medium  
**Priority**: Medium  
**Status**: Open  
**Assigned To**: Backend Team  
**Reported By**: QA Team  
**Date Reported**: 2024-01-XX  
**Environment**: Local Development (http://localhost:3000)

## Summary

Duplicate sprint number validation is not preventing users from creating multiple sprints with the same sprint number. Two sprints with sprint number 1 were successfully created during E2E testing, which should not be allowed.

## Description

When attempting to create a sprint with a sprint number that already exists, the system should reject the request and display an appropriate error message. However, the current implementation allows duplicate sprint numbers to be created.

## Steps to Reproduce

1. Navigate to `/sprints/new`
2. Create a sprint with the following data:
   - Sprint Number: `1`
   - Sprint Name: `First Sprint`
   - Team Name: `Team A` (optional)
   - Start Date: `2024-12-01` (optional)
   - End Date: `2024-12-14` (optional)
3. Click "Create Sprint"
4. Verify sprint is created successfully (should work)
5. Navigate to `/sprints/new` again
6. Create another sprint with the same sprint number:
   - Sprint Number: `1` (same as previous)
   - Sprint Name: `Duplicate Sprint`
   - Team Name: Leave empty or use different team
7. Click "Create Sprint"

## Expected Behavior

**Option A - Global Uniqueness (Recommended):**

- Form submission should fail
- API should return `409 Conflict` status code
- Error message should be displayed: "A sprint with this number already exists."
- Error should be associated with the Sprint Number field
- Sprint should NOT be created

**Option B - Team-Based Uniqueness:**

- If business rules allow same sprint number for different teams:
  - Sprint #1 with Team A should be allowed
  - Sprint #1 with Team B should be allowed
  - Sprint #1 with Team A (duplicate) should be rejected
- This behavior should be clearly documented

## Actual Behavior

- Both sprints are created successfully
- API returns `201 Created` for both requests
- No validation error is displayed
- Both sprints appear in the sprint list with sprint number 1
- No indication that duplicates exist

## Test Data

### Sprint 1 (Created Successfully)

```json
{
  "sprint_number": 1,
  "sprint_name": "E2E Test Sprint 1",
  "team_name": "QA Team",
  "start_date": "2024-12-01",
  "end_date": "2024-12-14"
}
```

**Result**: ✅ Created (ID: `c6908815-54f8-472d-a658-2c6f6f04f583`)

### Sprint 2 (Created Successfully - Should Have Failed)

```json
{
  "sprint_number": 1,
  "sprint_name": "Duplicate Test",
  "team_name": null,
  "start_date": null,
  "end_date": null
}
```

**Result**: ✅ Created (ID: `47bc1350-5655-4cff-9a00-0ee10dae76c1`)

## Environment Details

- **Application URL**: http://localhost:3000
- **API Endpoint**: `POST /api/sprints`
- **Database**: Supabase
- **Browser**: Chrome (via automated testing)
- **Date**: 2024-01-XX

## Technical Investigation Needed

### 1. Check Database Schema

- [ ] Review unique constraints on `sprints` table
- [ ] Check if there's a unique index on `sprint_number`
- [ ] Check if there's a unique index on `(sprint_number, team_name)`
- [ ] Verify database migration files

### 2. Check API Validation Logic

- [ ] Review `/app/api/sprints/route.ts`
- [ ] Check if duplicate validation is performed before insert
- [ ] Verify the validation query logic
- [ ] Check error handling for duplicates

### 3. Check Business Rules

- [ ] Review product requirements document
- [ ] Clarify: Should sprint numbers be globally unique?
- [ ] Clarify: Should sprint numbers be unique per team?
- [ ] Document the intended behavior

## Suggested Fix

### If Global Uniqueness is Required:

**Backend Fix** (`/app/api/sprints/route.ts`):

```typescript
// Before inserting, check for existing sprint with same number
const existingSprint = await supabase
  .from('sprints')
  .select('id, sprint_number')
  .eq('sprint_number', sprint_number)
  .single();

if (existingSprint.data) {
  return NextResponse.json(
    {
      error: 'A sprint with this number already exists.',
      field: 'sprint_number',
    },
    { status: 409 }
  );
}
```

**Database Fix** (Migration):

```sql
-- Add unique constraint on sprint_number
ALTER TABLE sprints
ADD CONSTRAINT unique_sprint_number
UNIQUE (sprint_number);
```

### If Team-Based Uniqueness is Required:

**Backend Fix**:

```typescript
// Check for existing sprint with same number AND team
const query = supabase
  .from('sprints')
  .select('id')
  .eq('sprint_number', sprint_number);

if (team_name) {
  query.eq('team_name', team_name);
} else {
  query.is('team_name', null);
}

const existingSprint = await query.single();

if (existingSprint.data) {
  return NextResponse.json(
    {
      error: 'A sprint with this number already exists for this team.',
      field: 'sprint_number',
    },
    { status: 409 }
  );
}
```

**Database Fix**:

```sql
-- Add unique constraint on (sprint_number, team_name)
ALTER TABLE sprints
ADD CONSTRAINT unique_sprint_number_per_team
UNIQUE (sprint_number, team_name);
```

## Frontend Impact

The frontend error handling for 409 responses appears to be implemented correctly in `CreateSprintForm.tsx`:

```typescript
if (error.statusCode === 409) {
  setError('sprint_number', {
    type: 'manual',
    message: 'A sprint with this number already exists for this team.',
  });
}
```

**Action Required**: Verify error message matches backend response.

## Related Files

- `/app/api/sprints/route.ts` - Sprint creation endpoint
- `/components/sprints/CreateSprintForm.tsx` - Form component (error handling)
- `/lib/api/schemas/sprint.ts` - Validation schema
- `/supabase/migrations/` - Database migration files

## Acceptance Criteria

- [ ] Duplicate sprint number validation is implemented correctly
- [ ] Validation logic matches business requirements (global or team-based)
- [ ] API returns appropriate error code (409 Conflict) for duplicates
- [ ] Error message is clear and user-friendly
- [ ] Error is displayed on the correct form field
- [ ] Database constraints match API validation logic
- [ ] Unit tests cover duplicate validation scenarios
- [ ] E2E tests verify duplicate prevention works
- [ ] Behavior is documented in code and/or requirements

## Additional Notes

- This bug was discovered during comprehensive E2E testing
- The frontend appears to handle 409 errors correctly, so the issue is likely in the backend validation
- Need to clarify business rules before implementing fix
- Consider adding database-level constraints for data integrity

## Screenshots/Evidence

**Sprint List Showing Duplicates:**

- Sprint #1: "E2E Test Sprint 1" (Team: QA Team)
- Sprint #1: "Duplicate Test" (Team: Not set)

Both sprints are visible in the sprint list at http://localhost:3000

## Priority Justification

**Medium Priority** because:

- ✅ Does not cause data loss
- ✅ Does not break core functionality
- ⚠️ Can cause user confusion
- ⚠️ May lead to data integrity issues
- ⚠️ Should be fixed before production release

## Related Issues

- None currently

## Labels

`bug`, `backend`, `validation`, `database`, `sprint-creation`, `medium-priority`
