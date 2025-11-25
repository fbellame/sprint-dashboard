# Backend Issue #001: Duplicate Sprint Number Validation

**Issue Type**: Bug  
**Severity**: Medium  
**Priority**: Medium  
**Status**: ✅ Resolved  
**Assigned To**: Backend Team  
**Created By**: QA Team  
**Date**: 2024-01-XX  
**Resolved Date**: 2024-01-XX  
**Fixed By**: Backend Developer

## Description

During E2E testing, duplicate sprint number validation appears to be inconsistent or may not be working as expected. Two sprints with the same sprint number (1) were successfully created, which suggests the validation logic may need clarification or fixing.

## Steps to Reproduce

1. Navigate to `/sprints/new`
2. Create a sprint with:
   - Sprint Number: `1`
   - Sprint Name: `E2E Test Sprint 1`
   - Team Name: `QA Team`
   - Start Date: `2024-12-01`
   - End Date: `2024-12-14`
3. Submit the form successfully
4. Navigate to `/sprints/new` again
5. Create another sprint with:
   - Sprint Number: `1` (same as previous)
   - Sprint Name: `Duplicate Test`
   - Team Name: (leave empty)
   - Start Date: (leave empty)
   - End Date: (leave empty)
6. Submit the form

## Expected Behavior

**Option A (Global Uniqueness):**

- The second sprint creation should fail with a 409 Conflict error
- Error message: "A sprint with this number already exists for this team." or "A sprint with this number already exists."
- Form should display validation error on the sprint_number field

**Option B (Team-Based Uniqueness):**

- If duplicate validation is intentionally based on `sprint_number + team_name` combination:
  - Sprint #1 with Team "QA Team" should be allowed
  - Sprint #1 with no team (null) should be allowed
  - Sprint #1 with Team "QA Team" (duplicate) should be rejected
- This behavior should be clearly documented

## Actual Behavior

- Both sprints were created successfully
- API returned `201 Created` for both requests
- No validation error was displayed
- Both sprints appear in the sprint list with sprint number 1

## Environment

- **API Endpoint**: `POST /api/sprints`
- **Response Code**: `201 Created` (for both requests)
- **Database**: Supabase (configured and working)
- **Test Data**:
  - Sprint 1: `sprint_number=1, team_name="QA Team"`
  - Sprint 2: `sprint_number=1, team_name=null`

## Technical Details

### API Request (First Sprint)

```json
POST /api/sprints
{
  "sprint_number": 1,
  "sprint_name": "E2E Test Sprint 1",
  "start_date": "2024-12-01",
  "end_date": "2024-12-14",
  "team_name": "QA Team"
}
```

**Response**: `201 Created` ✅

### API Request (Second Sprint - Duplicate)

```json
POST /api/sprints
{
  "sprint_number": 1,
  "sprint_name": "Duplicate Test",
  "start_date": null,
  "end_date": null,
  "team_name": null
}
```

**Response**: `201 Created` ✅ (Expected: `409 Conflict`)

## Investigation Needed

1. **Check Database Schema**:
   - What is the unique constraint on the `sprints` table?
   - Is there a unique index on `sprint_number` alone?
   - Is there a unique index on `(sprint_number, team_name)`?
   - Is there a unique index on `(sprint_number, team_name)` where team_name can be null?

2. **Check API Validation Logic**:
   - Review `/app/api/sprints/route.ts`
   - What duplicate check is performed before insert?
   - Is the check based on `sprint_number` only or `sprint_number + team_name`?

3. **Check Business Rules**:
   - What is the intended behavior per product requirements?
   - Should sprint numbers be globally unique?
   - Should sprint numbers be unique per team?

## Suggested Fix

### If Global Uniqueness is Required:

```typescript
// In route.ts, before insert:
const existingSprint = await supabase
  .from('sprints')
  .select('id')
  .eq('sprint_number', sprint_number)
  .single();

if (existingSprint.data) {
  return NextResponse.json(
    { error: 'A sprint with this number already exists.' },
    { status: 409 }
  );
}
```

### If Team-Based Uniqueness is Required:

```typescript
// In route.ts, before insert:
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
    { error: 'A sprint with this number already exists for this team.' },
    { status: 409 }
  );
}
```

## Related Files

- `/app/api/sprints/route.ts` - Sprint creation endpoint
- `/lib/api/schemas/sprint.ts` - Sprint validation schema
- Database migration files - Check unique constraints

## Acceptance Criteria

- [ ] Duplicate validation logic is clearly defined and documented
- [ ] Validation works consistently (either global or team-based)
- [ ] Appropriate error response (409 Conflict) is returned for duplicates
- [ ] Error message is clear and user-friendly
- [ ] Database constraints match API validation logic
- [ ] Unit tests cover duplicate validation scenarios

## Resolution

### Root Cause

The duplicate validation logic was using `.single()` which throws an error when no row is found, rather than returning null. This caused the validation check `if (existing)` to fail silently because the error was not being caught properly.

### Fix Applied

1. **Changed `.single()` to `.maybeSingle()`**: This method returns `null` when no row is found instead of throwing an error, making the duplicate check work correctly.

2. **Improved error handling**: Added proper error handling for database query errors while ignoring "not found" errors (code 'PGRST116').

3. **Enhanced error messages**: Made error messages more descriptive, including the sprint number and team name in the error message.

4. **Fixed both POST and PUT endpoints**: Applied the same fix to both sprint creation and update endpoints.

### Code Changes

- **File**: `app/api/sprints/route.ts`
  - Changed duplicate check to use `.maybeSingle()` instead of `.single()`
  - Improved error handling and error messages
  - Unified validation logic for both team-based and null team_name cases

- **File**: `app/api/sprints/[id]/route.ts`
  - Applied same fix to PUT endpoint
  - Improved duplicate check logic to handle team_name updates correctly

- **File**: `app/api/sprints/route.test.ts`
  - Updated tests to use `.maybeSingle()` in mocks
  - Added additional test cases for duplicate validation scenarios

### Validation Behavior

The validation now correctly enforces **team-based uniqueness** as defined by the database constraint `UNIQUE(sprint_number, team_name)`:

- ✅ Sprint #1 with Team "QA Team" is allowed
- ✅ Sprint #1 with no team (null) is allowed (different from Team "QA Team")
- ❌ Sprint #1 with Team "QA Team" (duplicate) is rejected with 409 Conflict
- ❌ Sprint #1 with no team (null) when one already exists with null is rejected

### Testing

- ✅ All existing unit tests pass
- ✅ Added new test cases for duplicate validation scenarios
- ✅ Type checking passes
- ✅ Linting passes

## Notes

- This issue was discovered during E2E testing after database setup
- The frontend error handling for 409 responses was already implemented correctly
- The fix maintains the team-based uniqueness behavior as defined by the database schema
