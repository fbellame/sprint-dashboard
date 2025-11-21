# Sprint Planning Template: Sprint Dashboard

## Sprint Planning Meeting Guide

### Pre-Planning Checklist
- [ ] Product Owner has prioritized stories
- [ ] Technical dependencies identified
- [ ] Team capacity confirmed
- [ ] Previous sprint retrospective completed (if applicable)
- [ ] Stakeholder feedback reviewed

---

## Sprint [Number]: [Sprint Name]

**Sprint Goal**: [One sentence describing the sprint objective]

**Duration**: [X] weeks  
**Start Date**: [YYYY-MM-DD]  
**End Date**: [YYYY-MM-DD]  
**Sprint Demo Date**: [YYYY-MM-DD]

### Team Capacity

| Team Member | Available Days | Story Points Capacity | Notes |
|-------------|----------------|---------------------|-------|
| Developer 1 | [X] days | [X] points | |
| Developer 2 | [X] days | [X] points | |
| Developer 3 | [X] days | [X] points | |
| **Total** | **[X] days** | **[X] points** | |

**Average Velocity**: [X] story points per sprint  
**Planned Capacity**: [X] story points (80% of total capacity)

---

### Sprint Backlog

| Story ID | Story Title | Story Points | Assignee | Status | Notes |
|----------|-------------|--------------|----------|--------|-------|
| 0.1 | Initialize Next.js Project | 3 | | To Do | |
| 0.2 | Set Up Supabase | 5 | | To Do | |
| | | | | | |

**Total Story Points**: [X]  
**Remaining Points**: [X]

---

### Story Breakdown

#### Story [ID]: [Title]
- **Story Points**: [X]
- **Assignee**: [Name]
- **Status**: [To Do / In Progress / Review / Done]
- **Dependencies**: [List story IDs]
- **Estimated Hours**: [X] hours
- **Actual Hours**: [X] hours
- **Blockers**: [None / List blockers]
- **Notes**: [Any additional notes]

**Tasks**:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

---

### Daily Standup Template

**Date**: [YYYY-MM-DD]

| Team Member | Yesterday | Today | Blockers |
|-------------|-----------|-------|----------|
| Developer 1 | | | |
| Developer 2 | | | |
| Developer 3 | | | |

---

### Sprint Progress Tracking

**Sprint Burndown Chart**

| Day | Planned Points | Completed Points | Remaining Points |
|-----|----------------|------------------|------------------|
| Day 1 | [X] | [X] | [X] |
| Day 2 | [X] | [X] | [X] |
| Day 3 | [X] | [X] | [X] |
| Day 4 | [X] | [X] | [X] |
| Day 5 | [X] | [X] | [X] |
| Day 6 | [X] | [X] | [X] |
| Day 7 | [X] | [X] | [X] |
| Day 8 | [X] | [X] | [X] |
| Day 9 | [X] | [X] | [X] |
| Day 10 | [X] | [X] | [X] |

---

### Definition of Done Checklist

For each story to be considered "Done", it must meet ALL of the following:

- [ ] Code written and follows project standards
- [ ] Code reviewed and approved by at least one other developer
- [ ] Unit tests written and passing (if applicable)
- [ ] Integration tests passing (if applicable)
- [ ] Acceptance criteria met
- [ ] Documentation updated (if applicable)
- [ ] No critical bugs
- [ ] Deployed to staging environment (if applicable)
- [ ] Product Owner acceptance
- [ ] Story moved to "Done" in project management tool

---

### Sprint Review Agenda

**Date**: [YYYY-MM-DD]  
**Duration**: 1 hour

1. **Sprint Summary** (5 min)
   - Stories completed
   - Stories not completed (and why)
   - Story points delivered

2. **Demo** (30 min)
   - Feature demonstrations
   - Screenshots/videos
   - Live walkthrough

3. **Stakeholder Feedback** (15 min)
   - Questions and answers
   - Feedback collection
   - Priority adjustments

4. **Next Sprint Preview** (10 min)
   - Upcoming stories
   - Dependencies
   - Risks

---

### Sprint Retrospective Template

**Date**: [YYYY-MM-DD]  
**Duration**: 1 hour

#### What Went Well
- [Item 1]
- [Item 2]
- [Item 3]

#### What Could Be Improved
- [Item 1]
- [Item 2]
- [Item 3]

#### Action Items
- [ ] Action 1 (Owner: [Name], Due: [Date])
- [ ] Action 2 (Owner: [Name], Due: [Date])
- [ ] Action 3 (Owner: [Name], Due: [Date])

#### Metrics
- **Velocity**: [X] story points
- **Sprint Goal Achievement**: [X]%
- **Stories Completed**: [X] / [X]
- **Bugs Found**: [X]
- **Technical Debt Created**: [X] points

---

### Risk Register

| Risk ID | Risk Description | Probability | Impact | Mitigation | Owner | Status |
|---------|------------------|-------------|--------|------------|-------|--------|
| R1 | [Description] | High/Med/Low | High/Med/Low | [Strategy] | [Name] | Open/Mitigated/Closed |

---

### Dependencies & Blockers

| Dependency ID | Description | Blocking Story | Owner | Status | Resolution Date |
|---------------|-------------|----------------|-------|--------|-----------------|
| D1 | [Description] | [Story ID] | [Name] | Open/Resolved | [Date] |

---

### Technical Decisions Log

| Decision ID | Date | Decision | Rationale | Impacted Stories |
|-------------|------|----------|-----------|------------------|
| TD1 | [Date] | [Decision] | [Rationale] | [Story IDs] |

---

## Sprint 0 Planning Example

### Sprint 0: Infrastructure & Foundation

**Sprint Goal**: Establish foundational infrastructure, development environment, and database schema.

**Duration**: 2 weeks  
**Start Date**: 2024-01-15  
**End Date**: 2024-01-29

### Team Capacity

| Team Member | Available Days | Story Points Capacity |
|-------------|----------------|---------------------|
| Full Stack Dev 1 | 10 days | 20 points |
| Full Stack Dev 2 | 10 days | 20 points |
| **Total** | **20 days** | **40 points** |

**Planned Capacity**: 39 story points (matches sprint backlog)

### Sprint Backlog

| Story ID | Story Title | Story Points | Priority | Dependencies |
|----------|-------------|--------------|----------|--------------|
| 0.1 | Initialize Next.js Project | 3 | P0 | None |
| 0.2 | Set Up Supabase | 5 | P0 | 0.1 |
| 0.3 | Create Database Schema | 8 | P0 | 0.2 |
| 0.4 | State Management Setup | 5 | P1 | 0.1 |
| 0.5 | Dev Tools & Git Hooks | 3 | P1 | 0.1 |
| 0.6 | Vercel Deployment | 5 | P1 | 0.1, 0.2 |
| 0.7 | Design System | 5 | P1 | 0.1 |
| 0.8 | Testing Framework | 5 | P2 | 0.1 |

**Total Story Points**: 39

### Story Assignment

- **Developer 1**: Stories 0.1, 0.2, 0.3, 0.6 (21 points)
- **Developer 2**: Stories 0.4, 0.5, 0.7, 0.8 (18 points)

### Parallel Work Streams

**Stream 1 (Infrastructure)**:
- Story 0.1 → Story 0.2 → Story 0.3 → Story 0.6

**Stream 2 (Frontend Foundation)**:
- Story 0.1 → Story 0.4 → Story 0.5 → Story 0.7 → Story 0.8

---

## Story Point Estimation Guide

### Fibonacci Scale
- **1 point**: Trivial task (< 2 hours)
- **2 points**: Simple task (2-4 hours)
- **3 points**: Small task (4-8 hours)
- **5 points**: Medium task (1-2 days)
- **8 points**: Large task (2-3 days)
- **13 points**: Very large task (3-5 days) - should be broken down
- **21 points**: Epic (5+ days) - must be broken down

### Estimation Factors
- **Complexity**: How complex is the implementation?
- **Uncertainty**: How well do we understand the requirements?
- **Risk**: What are the technical risks?
- **Dependencies**: Are there external dependencies?
- **Testing**: How much testing is required?

---

## Velocity Tracking

### Sprint Velocity History

| Sprint | Planned Points | Completed Points | Velocity | Notes |
|--------|----------------|------------------|----------|-------|
| Sprint 0 | 39 | [X] | [X] | Infrastructure |
| Sprint 1 | 57 | [X] | [X] | CSV Upload |
| Sprint 2 | 53 | [X] | [X] | Dashboard Components |
| Sprint 3 | 49 | [X] | [X] | Metrics |
| Sprint 4 | 56 | [X] | [X] | Export & Polish |

**Average Velocity**: [X] story points per sprint

---

## Sprint Planning Best Practices

1. **Start with Sprint Goal**: Define what the sprint should achieve
2. **Review Dependencies**: Ensure all dependencies are resolved
3. **Estimate Realistically**: Use historical velocity, not ideal capacity
4. **Plan for Buffer**: Reserve 20% capacity for unexpected work
5. **Break Down Large Stories**: Stories > 8 points should be split
6. **Identify Risks Early**: Document and plan mitigation
7. **Assign Stories**: Ensure clear ownership
8. **Set Definition of Done**: Agree on completion criteria
9. **Plan Daily Standups**: Schedule and format
10. **Schedule Review & Retro**: Book meetings in advance

---

**Template Version**: 1.0  
**Last Updated**: 2024-01-15

