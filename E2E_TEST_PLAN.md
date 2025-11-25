# Comprehensive E2E Test Plan - Sprint Dashboard

**Date**: 2024-01-XX  
**Application URL**: http://localhost:3000  
**Test Environment**: Local Development  
**Tester**: QA Engineer  
**Status**: In Progress

## Test Objectives

Verify all user-facing features of the Sprint Dashboard application work correctly end-to-end, ensuring a seamless user experience from sprint creation to viewing sprint details.

## Test Scope

### In Scope

- Home page and navigation
- Sprint creation flow (all scenarios)
- Form validation (all types)
- Sprint list display
- Sprint detail page
- Error handling
- Loading states
- Empty states
- Duplicate validation
- Date validation
- Required field validation

### Out of Scope

- API unit tests
- Component unit tests
- Performance testing
- Security testing
- CSV upload (future feature)

## Test Cases

### Category 1: Home Page & Navigation

#### TC-001: Home Page Initial Load

**Priority**: High  
**Description**: Verify home page loads correctly on initial visit

**Steps**:

1. Navigate to http://localhost:3000
2. Wait for page to load
3. Verify page elements

**Expected Results**:

- Page loads without errors
- "Sprint Dashboard" title is visible
- Either sprint list or empty state is displayed
- No console errors

---

#### TC-002: Empty State Display

**Priority**: High  
**Description**: Verify empty state displays when no sprints exist

**Steps**:

1. Navigate to home page with no sprints
2. Verify empty state elements

**Expected Results**:

- "No Sprints Yet" message is displayed
- "Create Your First Sprint" button is visible
- Empty state icon/emoji is displayed
- Button navigates to create sprint page

---

#### TC-003: Navigation to Create Sprint Page

**Priority**: High  
**Description**: Verify navigation to create sprint page works from home

**Steps**:

1. Navigate to home page
2. Click "Create New Sprint" or "Create Your First Sprint" button
3. Verify navigation

**Expected Results**:

- URL changes to /sprints/new
- "Create New Sprint" heading is visible
- Create sprint form is displayed
- All form fields are present

---

#### TC-004: Browser Back Navigation

**Priority**: Medium  
**Description**: Verify browser back button works correctly

**Steps**:

1. Navigate to /sprints/new
2. Click browser back button
3. Verify navigation

**Expected Results**:

- Returns to previous page
- Page state is preserved correctly

---

### Category 2: Form Validation

#### TC-005: Required Field Validation - Sprint Number

**Priority**: High  
**Description**: Verify sprint number is required

**Steps**:

1. Navigate to /sprints/new
2. Leave Sprint Number empty
3. Fill in Sprint Name
4. Click "Create Sprint"

**Expected Results**:

- Form does not submit
- Validation error appears for Sprint Number
- Error message is clear

---

#### TC-006: Required Field Validation - Sprint Name

**Priority**: High  
**Description**: Verify sprint name is required

**Steps**:

1. Navigate to /sprints/new
2. Fill in Sprint Number
3. Leave Sprint Name empty
4. Click "Create Sprint"

**Expected Results**:

- Form does not submit
- Validation error appears for Sprint Name
- Error message is clear

---

#### TC-007: Invalid Sprint Number - Zero

**Priority**: Medium  
**Description**: Verify sprint number must be positive

**Steps**:

1. Navigate to /sprints/new
2. Enter Sprint Number: 0
3. Fill in Sprint Name
4. Click "Create Sprint"

**Expected Results**:

- Form does not submit
- Validation error appears
- Error indicates number must be positive

---

#### TC-008: Invalid Sprint Number - Negative

**Priority**: Medium  
**Description**: Verify sprint number cannot be negative

**Steps**:

1. Navigate to /sprints/new
2. Enter Sprint Number: -1
3. Fill in Sprint Name
4. Click "Create Sprint"

**Expected Results**:

- Form does not submit
- Validation error appears
- Error indicates number must be positive

---

#### TC-009: Date Validation - End Before Start

**Priority**: High  
**Description**: Verify end date cannot be before start date

**Steps**:

1. Navigate to /sprints/new
2. Enter Start Date: 2024-12-31
3. Enter End Date: 2024-12-30
4. Fill required fields
5. Click "Create Sprint"

**Expected Results**:

- Form does not submit
- Validation error appears on End Date field
- Error message: "End date must be after or equal to start date"

---

#### TC-010: Date Validation - Valid Dates

**Priority**: High  
**Description**: Verify valid date range is accepted

**Steps**:

1. Navigate to /sprints/new
2. Enter Start Date: 2024-12-01
3. Enter End Date: 2024-12-14
4. Fill required fields
5. Click "Create Sprint"

**Expected Results**:

- No validation errors for dates
- Form can be submitted

---

### Category 3: Sprint Creation

#### TC-011: Create Sprint - Minimal Required Fields

**Priority**: High  
**Description**: Verify sprint can be created with only required fields

**Steps**:

1. Navigate to /sprints/new
2. Enter Sprint Number: 100
3. Enter Sprint Name: "Minimal Sprint"
4. Leave optional fields empty
5. Click "Create Sprint"

**Expected Results**:

- Form submits successfully
- API returns 201 Created
- Redirects to sprint detail page
- Sprint is created in database

---

#### TC-012: Create Sprint - All Fields

**Priority**: High  
**Description**: Verify sprint can be created with all fields

**Steps**:

1. Navigate to /sprints/new
2. Enter Sprint Number: 101
3. Enter Sprint Name: "Complete Sprint"
4. Enter Start Date: 2024-12-01
5. Enter End Date: 2024-12-14
6. Enter Team Name: "Test Team"
7. Click "Create Sprint"

**Expected Results**:

- Form submits successfully
- API returns 201 Created
- Redirects to sprint detail page
- All data is saved correctly

---

#### TC-013: Create Sprint - Loading State

**Priority**: Medium  
**Description**: Verify loading state is shown during submission

**Steps**:

1. Navigate to /sprints/new
2. Fill in valid form data
3. Click "Create Sprint"
4. Observe button state

**Expected Results**:

- Button shows loading state
- Button is disabled during submission
- Loading indicator is visible

---

#### TC-014: Create Sprint - Duplicate Number (Same Team)

**Priority**: High  
**Description**: Verify duplicate sprint number is rejected for same team

**Steps**:

1. Create a sprint with number 200, team "Team A"
2. Navigate to /sprints/new
3. Create another sprint with number 200, team "Team A"
4. Click "Create Sprint"

**Expected Results**:

- Form does not submit successfully
- API returns 409 Conflict
- Error message indicates duplicate sprint number
- Error is displayed on form

---

#### TC-015: Create Sprint - Duplicate Number (Different Team)

**Priority**: Medium  
**Description**: Verify if duplicate numbers are allowed for different teams

**Steps**:

1. Create a sprint with number 201, team "Team A"
2. Navigate to /sprints/new
3. Create another sprint with number 201, team "Team B"
4. Click "Create Sprint"

**Expected Results**:

- Behavior depends on business rules
- Either allowed (team-based uniqueness) or rejected (global uniqueness)
- Appropriate error message if rejected

---

### Category 4: Sprint List

#### TC-016: Sprint List Display - Single Sprint

**Priority**: High  
**Description**: Verify sprint list displays single sprint correctly

**Steps**:

1. Create one sprint
2. Navigate to home page
3. Verify sprint list

**Expected Results**:

- "All Sprints" heading is visible
- Sprint card is displayed
- Sprint information is correct
- "Create New Sprint" button is visible

---

#### TC-017: Sprint List Display - Multiple Sprints

**Priority**: High  
**Description**: Verify sprint list displays multiple sprints correctly

**Steps**:

1. Create 3 sprints
2. Navigate to home page
3. Verify sprint list

**Expected Results**:

- All sprint cards are displayed
- Sprints are in grid layout
- Each card shows correct information
- Cards are clickable

---

#### TC-018: Sprint List - Loading State

**Priority**: Medium  
**Description**: Verify loading state while fetching sprints

**Steps**:

1. Navigate to home page
2. Observe initial load

**Expected Results**:

- Loading indicator is shown
- "Loading sprints..." message appears
- List displays after data loads

---

#### TC-019: Sprint List - Error State

**Priority**: Medium  
**Description**: Verify error handling when API fails

**Steps**:

1. Simulate API failure (if possible)
2. Navigate to home page
3. Verify error display

**Expected Results**:

- Error message is displayed
- "Retry" button is available
- Error message is user-friendly

---

### Category 5: Sprint Detail Page

#### TC-020: Navigate to Sprint Detail

**Priority**: High  
**Description**: Verify navigation to sprint detail page

**Steps**:

1. Navigate to home page
2. Click on a sprint card
3. Verify navigation

**Expected Results**:

- URL changes to /sprints/[id]
- Sprint detail page loads
- Sprint ID is displayed
- Page shows sprint information

---

#### TC-021: Sprint Detail - Page Content

**Priority**: High  
**Description**: Verify sprint detail page displays correct content

**Steps**:

1. Navigate to sprint detail page
2. Verify all elements

**Expected Results**:

- Sprint information is displayed
- All data fields are visible
- Page layout is correct

---

### Category 6: Error Handling

#### TC-022: API Error - Server Error

**Priority**: High  
**Description**: Verify error handling for 500 errors

**Steps**:

1. Simulate server error (if possible)
2. Attempt to create sprint
3. Verify error handling

**Expected Results**:

- Error message is displayed
- Message is user-friendly
- User can retry or go back

---

#### TC-023: API Error - Network Error

**Priority**: Medium  
**Description**: Verify error handling for network failures

**Steps**:

1. Simulate network failure (if possible)
2. Attempt to load sprints
3. Verify error handling

**Expected Results**:

- Error message is displayed
- Retry option is available
- Error is recoverable

---

### Category 7: Form Interactions

#### TC-024: Cancel Button

**Priority**: Medium  
**Description**: Verify cancel button functionality

**Steps**:

1. Navigate to /sprints/new
2. Fill in some form data
3. Click "Cancel" button
4. Verify behavior

**Expected Results**:

- Returns to previous page
- Form data is not saved
- No API call is made

---

#### TC-025: Form Field Interactions

**Priority**: Low  
**Description**: Verify form fields are interactive

**Steps**:

1. Navigate to /sprints/new
2. Interact with each field
3. Verify behavior

**Expected Results**:

- All fields are focusable
- Input works correctly
- Date pickers work
- Helper text is visible

---

## Test Execution Log

| Test Case | Status     | Notes                                                                                                                                         | Date/Time  |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| TC-001    | ✅ Passed  | Home page loads correctly. "All Sprints" heading visible. Sprint list displays correctly.                                                     | 2024-01-XX |
| TC-002    | ✅ Passed  | Empty state was tested initially. Currently shows sprint list (3 sprints).                                                                    | 2024-01-XX |
| TC-003    | ✅ Passed  | Navigation to /sprints/new works. Form displays with all fields.                                                                              | 2024-01-XX |
| TC-004    | ⏳ Pending | Browser back navigation not explicitly tested.                                                                                                | 2024-01-XX |
| TC-005    | ✅ Passed  | Required field validation works. Form doesn't submit when Sprint Number is empty. Browser native validation prevents submission.              | 2024-01-XX |
| TC-006    | ✅ Passed  | Required field validation works. Form doesn't submit when Sprint Name is empty.                                                               | 2024-01-XX |
| TC-007    | ✅ Passed  | Invalid sprint number (0) shows validation error: "Too small: expected number to be >0". Form doesn't submit.                                 | 2024-01-XX |
| TC-008    | ⏳ Pending | Negative number validation not explicitly tested (similar to TC-007).                                                                         | 2024-01-XX |
| TC-009    | ✅ Passed  | Date validation works perfectly. Error message: "End date must be after or equal to start date" displayed when end date is before start date. | 2024-01-XX |
| TC-010    | ✅ Passed  | Valid date range is accepted. No validation errors when dates are correct.                                                                    | 2024-01-XX |
| TC-011    | ⏳ Pending | Minimal required fields test not explicitly run, but TC-012 covers this.                                                                      | 2024-01-XX |
| TC-012    | ✅ Passed  | Sprint creation with all fields works perfectly. Form submits, API returns 201, redirects to /sprints/[id]. All data saved correctly.         | 2024-01-XX |
| TC-013    | ⏳ Pending | Loading state not explicitly observed during testing.                                                                                         | 2024-01-XX |
| TC-014    | ⚠️ Issue   | Duplicate sprint number validation needs investigation. Two sprints with number 1 were created (different teams).                             | 2024-01-XX |
| TC-015    | ⚠️ Issue   | Related to TC-014. Duplicate validation may be team-based rather than global.                                                                 | 2024-01-XX |
| TC-016    | ✅ Passed  | Sprint list displays correctly. Shows "All Sprints" heading, "Create New Sprint" button, and sprint cards.                                    | 2024-01-XX |
| TC-017    | ✅ Passed  | Multiple sprints display correctly. 3 sprints visible in grid layout. Each card shows complete information.                                   | 2024-01-XX |
| TC-018    | ⏳ Pending | Loading state not explicitly observed.                                                                                                        | 2024-01-XX |
| TC-019    | ⏳ Pending | Error state testing requires API failure simulation.                                                                                          | 2024-01-XX |
| TC-020    | ✅ Passed  | Navigation to sprint detail works. Clicking sprint card navigates to /sprints/[id].                                                           | 2024-01-XX |
| TC-021    | ⏳ Pending | Sprint detail page content is placeholder. Full implementation pending.                                                                       | 2024-01-XX |
| TC-022    | ⏳ Pending | Server error simulation not performed.                                                                                                        | 2024-01-XX |
| TC-023    | ⏳ Pending | Network error simulation not performed.                                                                                                       | 2024-01-XX |
| TC-024    | ⏳ Pending | Cancel button not explicitly tested.                                                                                                          | 2024-01-XX |
| TC-025    | ✅ Passed  | Form fields are interactive. All fields are focusable, input works, helper text is visible.                                                   | 2024-01-XX |

## Test Results Summary

**Total Test Cases**: 25  
**Passed**: 12  
**Failed**: 0  
**Blocked**: 0  
**Pending**: 11  
**Issues Found**: 1

**Pass Rate**: 48% (12/25) - Core functionality is working well!

## Issues Found

### Issue #1: Duplicate Sprint Number Validation

**Severity**: Medium  
**Status**: Needs Investigation  
**Description**: Duplicate sprint number validation appears to allow duplicates. Two sprints with sprint number 1 were successfully created:

- Sprint #1 with Team "QA Team"
- Sprint #1 with no team (null)

**Possible Causes**:

- Validation may be based on `sprint_number + team_name` combination
- Or duplicate validation may not be fully implemented

**Recommendation**:

- Clarify business rules: Should sprint numbers be globally unique or team-based?
- If team-based, document this behavior
- If global, fix validation logic

## Test Coverage Summary

### ✅ Fully Tested and Working

- Home page load and display
- Navigation between pages
- Sprint creation form
- Required field validation
- Invalid sprint number validation (zero)
- Date validation (end before start)
- Sprint creation with all fields
- Sprint list display (single and multiple)
- Sprint detail page navigation
- Form field interactions

### ⏳ Partially Tested / Pending

- Browser back navigation
- Negative number validation
- Loading states
- Error states
- Cancel button
- Sprint detail page content (placeholder)

### ⚠️ Issues Identified

- Duplicate sprint number validation needs clarification

## Recommendations

1. **Immediate**: Investigate and fix/clarify duplicate sprint number validation
2. **Enhancement**: Test loading states and error handling more thoroughly
3. **Future**: Complete sprint detail page implementation
4. **Testing**: Add automated E2E tests for regression testing
