# Product Requirements Document: Sprint Dashboard

## 1. Product Overview

### 1.1 Purpose

The Sprint Dashboard is a visualization tool designed to provide product managers, scrum masters, and team leads with a comprehensive overview of sprint progress, commitments, and metrics. The dashboard automatically generates sprint overview documents from Azure DevOps (ADO) CSV exports, eliminating manual reporting and ensuring data accuracy.

### 1.2 Problem Statement

Currently, sprint reporting requires manual data collection, aggregation, and formatting, which is:

- Time-consuming and error-prone
- Inconsistent across sprints
- Difficult to maintain historical records
- Not easily shareable or accessible

### 1.3 Solution

An automated dashboard that:

- Imports sprint data from ADO CSV exports
- Generates visually consistent sprint overview documents
- Displays key metrics, commitments, and progress indicators
- Provides a clean, professional presentation suitable for stakeholders

---

## 2. Goals and Objectives

### 2.1 Primary Goals

1. **Automate Sprint Reporting**: Eliminate manual data entry and formatting
2. **Improve Visibility**: Provide clear, at-a-glance sprint status
3. **Ensure Consistency**: Standardize sprint reporting format across all sprints
4. **Save Time**: Reduce sprint reporting time from hours to minutes

### 2.2 Success Metrics

- Time saved per sprint: Target 80% reduction in reporting time
- User adoption: 100% of sprint reviews use the dashboard
- Data accuracy: Zero manual data entry errors
- Stakeholder satisfaction: Positive feedback on clarity and usefulness

---

## 3. User Personas

### 3.1 Primary User: Product Manager

- **Needs**: Quick overview of sprint progress, commitments, and blockers
- **Goals**: Communicate sprint status to stakeholders effectively
- **Pain Points**: Manual data collection, inconsistent formatting

### 3.2 Secondary User: Scrum Master

- **Needs**: Track team velocity, story completion, and sprint health
- **Goals**: Identify risks and blockers early
- **Pain Points**: Time spent on reporting instead of team facilitation

### 3.3 Tertiary User: Team Lead / Engineering Manager

- **Needs**: Understand team capacity and feature delivery progress
- **Goals**: Make data-driven decisions about resource allocation
- **Pain Points**: Lack of visibility into sprint metrics

---

## 4. Features and Requirements

### 4.1 Core Features

#### 4.1.1 Data Import

- **CSV Import from Azure DevOps**
  - Support for ADO CSV export format
  - Automatic parsing of work items (stories, bugs, tasks)
  - Field mapping: Title, State, Story Points, Assigned To, Tags, Area Path, etc.
  - Validation and error handling for malformed data
  - Support for multiple CSV files (stories, bugs, features)

#### 4.1.2 Sprint Overview Header

- **Sprint Title**: Display sprint name/number (e.g., "Sprint 31 Overview")
- **Visual Design**:
  - White content area with green vertical accent strip on left
  - Calendar/checklist icon in top right corner
  - Professional, clean layout

#### 4.1.3 PI Commitment Section

- **Display Format**: List of objectives with status indicators
- **Status Indicators**:
  - Green asterisk (\*): Team Focus
  - Green checkmark (✓): Done
  - Orange vertical bar (|): Ongoing
  - Red X (✗): Not Done
- **Data Source**: Work items tagged with "PI Commitment" or similar
- **Requirements**:
  - Display up to 5-10 commitment objectives
  - Show objective title/description
  - Indicate current status

#### 4.1.4 Sprint Goal Section

- **Display Format**: List of sprint objectives with status indicators
- **Status Indicators**: Same as PI Commitment (✓, ✗, |, \*)
- **Data Source**: Work items or custom sprint goals configuration
- **Requirements**:
  - Display 3-7 sprint goals
  - Show goal description
  - Real-time status based on work item completion

#### 4.1.5 Sprint Highlights Section

- **Display Format**: Bullet-point list of key achievements
- **Content**:
  - Major features deployed
  - Performance improvements
  - Key milestones reached
  - Infrastructure updates
- **Data Source**:
  - Work items marked as "Highlight" or "Key Achievement"
  - Manual entry option for narrative highlights
- **Requirements**:
  - Display 3-10 highlight items
  - Support markdown formatting for links/emphasis

#### 4.1.6 Team Backlog Table

- **Location**: Bottom left section
- **Metrics Displayed**:
  - Stories/Bugs Planned: Story Points and Story Count
  - Stories Removed mid-sprint: Story Points and Story Count
  - Stories/Bugs added mid-sprint: Story Points and Story Count
  - Total: Sum of all above (Story Points and Story Count)
- **Data Source**:
  - Planned work items at sprint start
  - Work items removed during sprint (state change tracking)
  - Work items added during sprint (created after sprint start)
- **Requirements**:
  - Calculate totals automatically
  - Handle "n/a" for zero values
  - Display in tabular format

#### 4.1.7 Stories Table

- **Location**: Middle right section
- **Sections**:
  - **User Stories**:
    - New: Count of stories in "New" state
    - Active: Count of stories in "Active" state
    - Resolved: Count of stories in "Resolved" state
    - Closed in S[#]: Count of stories closed in current sprint
    - Total: Sum of all user stories
  - **Prod Support Tickets**:
    - Same breakdown as User Stories
    - Separate tracking for support tickets
- **Data Source**:
  - Work items filtered by type (User Story vs. Support Ticket)
  - State transitions tracked by sprint
- **Requirements**:
  - Automatic categorization by work item type
  - State-based counting
  - Sprint-specific closed count

#### 4.1.8 Top Features Impacted Table

- **Location**: Bottom right section
- **Metrics Displayed**:
  - Feature name
  - Committed Story Points in S[#]
  - Committed Story Count in S[#]
- **Data Source**:
  - Work items grouped by feature/area path
  - Aggregation of story points and counts per feature
- **Requirements**:
  - Display top 3-5 features by story points
  - Sortable by story points or count
  - Show feature name clearly

#### 4.1.9 Team Velocity Display

- **Location**: Below Team Backlog table
- **Display**: Single metric showing "Team Velocity: [number]"
- **Data Source**:
  - Historical velocity calculation
  - Or manually configured value
- **Requirements**:
  - Prominent display
  - Update based on completed story points

### 4.2 Visual Design Requirements

#### 4.2.1 Layout

- **Page Layout**: Single-page overview format
- **Color Scheme**:
  - Primary background: White
  - Accent color: Green (vertical strip, icons)
  - Status colors:
    - Green: Done/Team Focus
    - Orange: Ongoing
    - Red: Not Done
- **Typography**:
  - Clear, readable fonts
  - Hierarchical heading structure
  - Consistent spacing

#### 4.2.2 Status Indicators

- **Legend**: Display at bottom of page explaining symbols
  - Green asterisk: Team Focus
  - Green checkmark: Done
  - Orange vertical bar: Ongoing
  - Red X: Not Done
- **Consistency**: Use same indicators across all sections

#### 4.2.3 Tables

- **Formatting**:
  - Clean borders
  - Alternating row colors (optional)
  - Clear column headers
  - Right-aligned numbers
  - Left-aligned text

### 4.3 Data Processing Requirements

#### 4.3.1 CSV Parsing

- **Required Fields**:
  - Work Item ID
  - Title
  - Work Item Type (Story, Bug, Task, etc.)
  - State (New, Active, Resolved, Closed, etc.)
  - Story Points
  - Assigned To
  - Area Path / Feature
  - Tags
  - Created Date
  - Changed Date
  - Closed Date
  - Sprint/Iteration

#### 4.3.2 Calculations

- **Story Points Aggregation**: Sum story points by category
- **State Transitions**: Track when items moved between states
- **Sprint Scope**: Identify items added/removed during sprint
- **Feature Grouping**: Aggregate by Area Path or Feature tag
- **Velocity Calculation**: Average completed story points over last N sprints

#### 4.3.3 Data Validation

- **Required**: Validate CSV structure matches expected format
- **Error Handling**:
  - Display clear error messages for missing fields
  - Handle missing/null values gracefully
  - Warn about data inconsistencies

---

## 5. Technical Requirements

### 5.1 Technology Stack (Recommended)

- **Frontend**: React, Vue, or similar modern framework
- **CSV Processing**: PapaParse or similar CSV library
- **Data Visualization**: Chart.js, D3.js, or native HTML/CSS tables
- **Export**: PDF generation (jsPDF, Puppeteer) or HTML export
- **Storage**: Local storage or file-based storage for CSV data

### 5.2 Performance Requirements

- **Load Time**: Dashboard should render within 2 seconds
- **CSV Processing**: Handle files up to 10MB (thousands of work items)
- **Responsiveness**: Support desktop and tablet views

### 5.3 Browser Compatibility

- **Minimum**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Responsive**: Desktop-first, tablet-friendly

---

## 6. User Workflows

### 6.1 Primary Workflow: Generate Sprint Overview

1. User exports CSV from Azure DevOps
2. User uploads CSV file(s) to dashboard
3. System validates and parses CSV
4. User selects sprint number/name
5. System generates sprint overview
6. User reviews and verifies data
7. User exports as PDF/HTML or shares link

### 6.2 Secondary Workflow: Update Sprint Status

1. User uploads updated CSV mid-sprint
2. System recalculates metrics
3. Dashboard updates automatically
4. User reviews changes

### 6.3 Configuration Workflow: Customize Display

1. User configures sprint goals (manual entry or CSV mapping)
2. User tags work items for highlights
3. User sets team velocity
4. Settings saved for future sprints

---

## 7. Out of Scope (v1.0)

The following features are explicitly out of scope for the initial release:

- Direct ADO API integration (CSV import only)
- Real-time updates (manual CSV upload required)
- Multi-team dashboards
- Historical trend analysis
- Custom branding/theming
- User authentication
- Collaborative editing
- Mobile app

---

## 8. Future Enhancements (Post-v1.0)

### 8.1 Phase 2 Features

- **Direct ADO Integration**: Connect directly to Azure DevOps API
- **Historical Trends**: Track velocity and metrics over time
- **Multi-Sprint View**: Compare multiple sprints side-by-side
- **Automated Scheduling**: Generate reports on sprint end date

### 8.2 Phase 3 Features

- **Multi-Team Support**: Aggregate data from multiple teams
- **Custom Templates**: User-defined dashboard layouts
- **Export Formats**: PowerPoint, Word, Excel exports
- **Notifications**: Email/Slack integration for sprint updates

---

## 9. Acceptance Criteria

### 9.1 MVP Acceptance Criteria

- [ ] User can upload ADO CSV export
- [ ] System parses CSV and extracts work items
- [ ] Dashboard displays all required sections:
  - [ ] PI Commitment section with status indicators
  - [ ] Sprint Goal section with status indicators
  - [ ] Sprint Highlights section
  - [ ] Team Backlog table with accurate metrics
  - [ ] Stories table with state breakdowns
  - [ ] Top Features Impacted table
  - [ ] Team Velocity display
- [ ] Status indicators match design (✓, ✗, |, \*)
- [ ] Visual design matches reference image
- [ ] Calculations are accurate (story points, counts, totals)
- [ ] User can export dashboard as PDF or HTML
- [ ] Legend displays at bottom of page

### 9.2 Data Accuracy Criteria

- [ ] Story point totals match CSV data
- [ ] Story counts match CSV data
- [ ] State transitions tracked correctly
- [ ] Feature grouping accurate
- [ ] Sprint scope (added/removed items) calculated correctly

---

## 10. Dependencies and Assumptions

### 10.1 Dependencies

- Azure DevOps CSV export format remains consistent
- CSV contains required fields (see 4.3.1)
- User has access to ADO exports

### 10.2 Assumptions

- Users understand ADO work item structure
- Sprint boundaries are clearly defined in CSV
- Story points are consistently assigned
- Feature/Area Path is used for feature grouping

---

## 11. Risks and Mitigations

### 11.1 Data Quality Risks

- **Risk**: Inconsistent CSV formats or missing fields
- **Mitigation**: Robust validation, clear error messages, field mapping configuration

### 11.2 User Adoption Risks

- **Risk**: Users prefer manual reporting
- **Mitigation**: Clear documentation, training, demonstrate time savings

### 11.3 Technical Risks

- **Risk**: Large CSV files cause performance issues
- **Mitigation**: Implement pagination, optimize parsing, handle large datasets

---

## 12. Success Definition

The Sprint Dashboard v1.0 will be considered successful if:

1. Product managers can generate sprint overviews in under 5 minutes
2. Dashboard accurately reflects sprint data from ADO exports
3. Visual design matches reference image quality
4. Zero critical bugs in calculations or data display
5. Positive feedback from at least 3 pilot users

---

## 13. Appendix

### 13.1 Sample CSV Structure

Expected ADO CSV export should include columns such as:

- Work Item ID
- Title
- Work Item Type
- State
- Story Points
- Assigned To
- Area Path
- Tags
- Created Date
- Changed Date
- Closed Date
- Iteration Path

### 13.2 Reference Design

See provided image: "Sprint 31 Overview" document showing:

- Layout structure
- Color scheme
- Status indicators
- Table formats
- Visual hierarchy

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Author**: Product Management Team  
**Status**: Draft
