# Sprint 0: Team Lead - Coordination & Review Guide

**Role**: Team Lead  
**Sprint**: Sprint 0 - Infrastructure & Foundation  
**Duration**: 2 weeks (Jan 15 - Jan 29, 2024)

---

## Team Member Identification

| Identifier      | Role                 | Name   | GitHub Username | Email   | Notes                           |
| --------------- | -------------------- | ------ | --------------- | ------- | ------------------------------- |
| **dev1_front**  | Frontend Developer 1 | [Name] | [@username]     | [email] | Critical path - Story 0.1       |
| **dev2_front**  | Frontend Developer 2 | [Name] | [@username]     | [email] | Vercel deployment - Story 0.6   |
| **dev_backend** | Backend Developer    | [Name] | [@username]     | [email] | Supabase setup - Story 0.2, 0.3 |
| **team_lead**   | Team Lead            | [Name] | [@username]     | [email] | Coordination & reviews          |

**Usage**: Throughout this document, developers are referenced by their identifier (e.g., `dev1_front`, `dev2_front`, `dev_backend`).

---

## Responsibilities

As Team Lead, your primary responsibilities for Sprint 0 are:

1. **Pre-Sprint Setup**: Ensure all team members have required accounts and tools
2. **Coordination**: Ensure team members are unblocked and working efficiently
3. **Code Reviews**: Review all pull requests and provide feedback
4. **Quality Assurance**: Verify infrastructure setup meets requirements
5. **Documentation**: Ensure technical decisions are documented
6. **Progress Tracking**: Monitor sprint progress and identify risks
7. **Communication**: Facilitate communication between team members

---

## Pre-Sprint Setup Checklist

**Complete this checklist BEFORE Sprint 0 begins (ideally 1-2 days before start date)**

This ensures all developers have the necessary accounts, tools, and access to begin work immediately.

### All Team Members (dev1_front, dev2_front, dev_backend)

#### GitHub Account & Repository Access

- [ ] **GitHub Account**: Each developer has a GitHub account
  - [ ] Username: **\*\***\_\_\_\_**\*\***
  - [ ] Email verified: ☐
  - [ ] 2FA enabled: ☐ (recommended)
- [ ] **Repository Access**: All developers have access to the repository
  - [ ] Repository URL: **\*\***\_\_\_\_**\*\***
  - [ ] Access level: Write (not just Read)
  - [ ] Can clone repository: ☐
  - [ ] Can create branches: ☐
  - [ ] Can create pull requests: ☐
- [ ] **SSH Keys or Personal Access Token**: Each developer can authenticate
  - [ ] SSH key configured OR Personal Access Token created
  - [ ] Test: `git clone [repo-url]` works
- [ ] **Team Verification**: Test repository access
  - [ ] Each developer clones the repo successfully
  - [ ] Each developer can push to a test branch

#### Development Environment

- [ ] **Node.js Installed**: Version 18.x or 20.x
  - [ ] Check: `node --version` (should be v18.x or v20.x)
  - [ ] dev1_front: ☐
  - [ ] dev2_front: ☐
  - [ ] dev_backend: ☐
- [ ] **npm or yarn Installed**
  - [ ] Check: `npm --version` or `yarn --version`
  - [ ] dev1_front: ☐
  - [ ] dev2_front: ☐
  - [ ] dev_backend: ☐
- [ ] **Git Installed and Configured**
  - [ ] Check: `git --version`
  - [ ] Git user.name configured: ☐
  - [ ] Git user.email configured: ☐
  - [ ] All developers: ☐

#### Code Editor

- [ ] **VS Code Installed** (recommended)
  - [ ] dev1_front: ☐
  - [ ] dev2_front: ☐
  - [ ] dev_backend: ☐
- [ ] **VS Code Extensions** (recommended):
  - [ ] ESLint extension
  - [ ] Prettier extension
  - [ ] Tailwind CSS IntelliSense
  - [ ] TypeScript extension

### Backend Developer Specific (dev_backend)

#### Supabase Account & Access

- [ ] **Supabase Account**: dev_backend has Supabase account
  - [ ] Account created: ☐
  - [ ] Email: **\*\***\_\_\_\_**\*\***
  - [ ] Can access Supabase dashboard: ☐
- [ ] **Supabase Project**: Project created (or will be created in Story 0.2)
  - [ ] Project name: Sprint Dashboard
  - [ ] Region selected: **\*\***\_\_\_\_**\*\***
  - [ ] Project URL: **\*\***\_\_\_\_**\*\***
  - [ ] Project ID: **\*\***\_\_\_\_**\*\***
- [ ] **Supabase CLI Installed**: Required for local development
  - [ ] Installation method: `npm install -g supabase` OR `brew install supabase/tap/supabase`
  - [ ] Verify: `supabase --version` works
  - [ ] Version: **\*\***\_\_\_\_**\*\***
- [ ] **Supabase CLI Login**: Authenticated with Supabase
  - [ ] Run: `supabase login`
  - [ ] Successfully authenticated: ☐
  - [ ] Can access projects: ☐
- [ ] **Local Supabase Setup**: Can run Supabase locally
  - [ ] Docker installed (required for local Supabase): ☐
  - [ ] Docker running: ☐
  - [ ] Test: `supabase start` works
  - [ ] Local Supabase dashboard accessible: ☐
  - [ ] Can create local migrations: ☐
- [ ] **Supabase CLI Verification Steps**:

  ```bash
  # 1. Check installation
  supabase --version

  # 2. Login
  supabase login

  # 3. Initialize project (if needed)
  supabase init

  # 4. Start local Supabase (requires Docker)
  supabase start

  # 5. Verify local dashboard
  # Should be accessible at http://localhost:54323
  ```

  - [ ] All commands work: ☐

### Frontend Developer 2 Specific (dev2_front - Vercel Deployment)

#### Vercel Account & Access

- [ ] **Vercel Account**: dev2_front has Vercel account
  - [ ] Account created: ☐
  - [ ] Email: **\*\***\_\_\_\_**\*\***
  - [ ] Can access Vercel dashboard: ☐
- [ ] **Vercel CLI Installed** (optional but recommended)
  - [ ] Installation: `npm install -g vercel`
  - [ ] Verify: `vercel --version` works
  - [ ] Version: **\*\***\_\_\_\_**\*\***
- [ ] **Vercel CLI Login**: Authenticated with Vercel
  - [ ] Run: `vercel login`
  - [ ] Successfully authenticated: ☐
- [ ] **Team/Organization Access**: If using team account
  - [ ] Added to Vercel team: ☐
  - [ ] Has deployment permissions: ☐
- [ ] **GitHub Integration**: Vercel connected to GitHub
  - [ ] GitHub account connected to Vercel: ☐
  - [ ] Repository access granted: ☐

### Team Lead Specific

#### Administrative Access

- [ ] **GitHub Repository Admin**: Team Lead has admin access
  - [ ] Can manage repository settings: ☐
  - [ ] Can manage team members: ☐
  - [ ] Can configure branch protection: ☐
- [ ] **Vercel Team Admin** (if using team account)
  - [ ] Can manage team members: ☐
  - [ ] Can manage projects: ☐
  - [ ] Can configure environment variables: ☐
- [ ] **Supabase Project Owner** (if using shared project)
  - [ ] Can manage project settings: ☐
  - [ ] Can manage team members: ☐
  - [ ] Can view billing: ☐

### Shared Credentials & Secrets Management

#### Environment Variables Template

- [ ] **`.env.example` Created**: Template for environment variables
  - [ ] Includes all required variables
  - [ ] Includes comments explaining each variable
  - [ ] No actual secrets included
- [ ] **Secrets Storage**: Secure method for sharing secrets
  - [ ] Password manager (1Password, LastPass, etc.): ☐
  - [ ] Encrypted document: ☐
  - [ ] Secure team chat: ☐
  - [ ] **DO NOT** use email or unencrypted channels

#### Credentials to Share (After Story 0.2)

- [ ] **Supabase Credentials** (dev_backend → dev2_front):
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
  - [ ] Shared securely: ☐
  - [ ] dev_backend has shared: ☐
  - [ ] dev2_front has received: ☐

### Verification Meeting (Before Sprint Start)

**Schedule**: [Date/Time] - 30 minutes before Sprint 0 begins

**Agenda**:

1. **GitHub Access** (5 min)
   - [ ] Each developer demonstrates: `git clone [repo]`
   - [ ] dev1_front: ☐
   - [ ] dev2_front: ☐
   - [ ] dev_backend: ☐
   - [ ] Each developer creates a test branch and pushes

2. **Development Environment** (5 min)
   - [ ] Each developer runs: `node --version`, `npm --version`, `git --version`
   - [ ] dev1_front: ☐
   - [ ] dev2_front: ☐
   - [ ] dev_backend: ☐
   - [ ] All versions are compatible

3. **Supabase Setup** (dev_backend only) (10 min)
   - [ ] dev_backend demonstrates: `supabase --version`
   - [ ] dev_backend demonstrates: `supabase login`
   - [ ] dev_backend demonstrates: `supabase start` (if Docker available)
   - [ ] dev_backend shows Supabase dashboard access

4. **Vercel Setup** (dev2_front only) (5 min)
   - [ ] dev2_front demonstrates: `vercel --version` (if installed)
   - [ ] dev2_front shows Vercel dashboard access

5. **Q&A** (5 min)
   - [ ] Any blockers or issues?
   - [ ] All questions answered?

**Outcome**: All developers are ready to start Sprint 0 immediately

### Troubleshooting Common Issues

#### GitHub Access Issues

- **Problem**: Cannot clone repository
  - **Solution**: Verify repository access, check SSH keys or PAT
- **Problem**: Cannot push to repository
  - **Solution**: Verify write permissions, check branch protection rules

#### Supabase CLI Issues

- **Problem**: `supabase: command not found`
  - **Solution**: Install via npm: `npm install -g supabase` or use package manager
- **Problem**: `supabase start` fails
  - **Solution**: Ensure Docker is installed and running
  - **Solution**: Check Docker Desktop is running (if on Mac/Windows)
- **Problem**: Cannot login to Supabase CLI
  - **Solution**: Use `supabase login --browser` for browser-based auth
  - **Solution**: Check network/firewall settings

#### Vercel CLI Issues

- **Problem**: `vercel: command not found`
  - **Solution**: Install via npm: `npm install -g vercel`
- **Problem**: Cannot login to Vercel
  - **Solution**: Use `vercel login` and follow browser prompt

#### Docker Issues (for Local Supabase)

- **Problem**: Docker not installed
  - **Solution**: Install Docker Desktop from https://www.docker.com/products/docker-desktop
- **Problem**: Docker not running
  - **Solution**: Start Docker Desktop application
- **Problem**: Insufficient Docker resources
  - **Solution**: Allocate more memory/CPU to Docker in settings

### Documentation to Share

- [ ] **Setup Instructions**: Share with all developers
  - [ ] Link to this document
  - [ ] Link to README.md (once created)
  - [ ] Link to SOLUTION_ARCHITECTURE.md
- [ ] **Account Creation Guides**: If needed
  - [ ] GitHub account creation guide
  - [ ] Supabase account creation guide
  - [ ] Vercel account creation guide

---

## Daily Activities

### Daily Standup (15 minutes)

**Time**: [9:00 AM]  
**Format**: Round-robin, each team member shares:

- What did I complete yesterday?
- What will I work on today?
- Any blockers or dependencies?

**Your Role**:

- [ ] Facilitate the meeting
- [ ] Take notes on blockers
- [ ] Follow up on blockers after standup
- [ ] Update sprint progress tracking

### Code Reviews

**Priority Order**:

1. **Story 0.1** (Critical Path) - Review immediately
2. **Story 0.2** (Blocks Story 0.6) - Review within 4 hours
3. **Story 0.3** (Complex) - Review thoroughly, may need pair programming
4. **Other stories** - Review within 24 hours

**Review Checklist**:

- [ ] Code follows project standards
- [ ] TypeScript types are correct
- [ ] Error handling is appropriate
- [ ] Documentation is updated
- [ ] Tests are included (if applicable)
- [ ] No security issues (especially with credentials)
- [ ] Performance considerations addressed

### Progress Tracking

**Daily Updates**:

- [ ] Update sprint burndown chart
- [ ] Track story completion status
- [ ] Identify risks and blockers
- [ ] Update risk register if needed

**Weekly Review**:

- [ ] Review sprint progress at end of Week 1
- [ ] Identify any stories at risk
- [ ] Adjust plan if needed
- [ ] Communicate status to stakeholders

---

## Story-Specific Review Points

### Story 0.1: Initialize Next.js Project (dev1_front)

**Critical Review Points**:

- [ ] Next.js 14 App Router is used
- [ ] TypeScript strict mode is enabled
- [ ] Tailwind CSS is properly configured
- [ ] ESLint and Prettier are working
- [ ] Project structure follows conventions
- [ ] Development server runs without errors
- [ ] Build succeeds

**Action Items**:

- [ ] Verify project can be cloned and run by other team members
- [ ] Test: `npm install && npm run dev` works
- [ ] Approve PR immediately (blocks all other work)

### Story 0.2: Set Up Supabase (dev_backend)

**Critical Review Points**:

- [ ] Supabase project is created
- [ ] Environment variables are properly configured
- [ ] Client and admin clients are correctly set up
- [ ] Service role key is NOT committed to repository
- [ ] Connection test works
- [ ] Credentials are shared with Frontend Dev 2 (for Story 0.6)

**Action Items**:

- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Verify `.env.example` is created
- [ ] Test connection yourself
- [ ] Ensure credentials are shared securely

### Story 0.3: Create Database Schema (dev_backend)

**Critical Review Points**:

- [ ] All tables match design in SOLUTION_ARCHITECTURE.md
- [ ] Foreign keys are correct
- [ ] Indexes are created for performance
- [ ] Views are correct and tested
- [ ] Migration script is tested (rollback/reapply)
- [ ] Sample data tests pass
- [ ] TypeScript types are created

**Action Items**:

- [ ] Review SQL carefully (complex story)
- [ ] Test views with sample queries
- [ ] Verify CASCADE deletes work
- [ ] Consider pair programming if complex issues arise

### Story 0.4: State Management Setup (dev1_front)

**Critical Review Points**:

- [ ] React Query is properly configured
- [ ] Zustand store structure is appropriate
- [ ] API client utilities are well-designed
- [ ] Error handling is comprehensive
- [ ] Documentation is clear

**Action Items**:

- [ ] Test React Query provider works
- [ ] Verify store structure is extensible
- [ ] Review error handling patterns

### Story 0.5: Dev Tools & Git Hooks (dev2_front)

**Critical Review Points**:

- [ ] Pre-commit hook runs linting and formatting
- [ ] Pre-push hook runs tests
- [ ] VS Code settings are configured
- [ ] README.md is comprehensive
- [ ] All team members can use the tools

**Action Items**:

- [ ] Test Git hooks yourself
- [ ] Verify VS Code settings work
- [ ] Review README for completeness

### Story 0.6: Vercel Deployment (dev2_front)

**Critical Review Points**:

- [ ] Vercel project is created and linked
- [ ] Environment variables are configured in Vercel
- [ ] Automatic deployments work
- [ ] Preview deployments work for PRs
- [ ] Application is accessible

**Action Items**:

- [ ] Test deployment yourself
- [ ] Verify environment variables are set
- [ ] Test preview deployment with a PR
- [ ] Verify production deployment

### Story 0.7: Design System (dev1_front)

**Critical Review Points**:

- [ ] Colors match PRD requirements
- [ ] Components are accessible
- [ ] Components are reusable
- [ ] Status indicator component works correctly
- [ ] Design system is documented

**Action Items**:

- [ ] Review components visually
- [ ] Test accessibility (keyboard navigation, screen reader)
- [ ] Verify components match PRD design

### Story 0.8: Testing Framework (dev2_front)

**Critical Review Points**:

- [ ] Vitest is properly configured
- [ ] Test utilities are well-designed
- [ ] Sample tests are written
- [ ] Test coverage is configured
- [ ] Documentation is clear

**Action Items**:

- [ ] Run tests yourself
- [ ] Verify test utilities work
- [ ] Review test examples

---

## Risk Management

### High-Risk Items

| Risk                  | Impact                    | Mitigation                                     | Owner     |
| --------------------- | ------------------------- | ---------------------------------------------- | --------- |
| Story 0.1 delayed     | High - blocks all work    | dev1_front starts immediately, monitor closely | Team Lead |
| Story 0.3 complexity  | Medium - may take longer  | Pair programming if needed, review early       | Team Lead |
| Supabase setup issues | Medium - blocks Story 0.3 | dev_backend has experience, provide support    | Team Lead |
| Credential security   | High - security risk      | Review carefully, ensure not committed         | Team Lead |

### Blocker Resolution Process

1. **Identify Blocker**: Team member reports in standup or Slack
2. **Assess Impact**: Determine if it blocks other work
3. **Resolve or Escalate**:
   - If technical: Pair programming or research
   - If dependency: Coordinate with other team member
   - If external: Escalate to Product Owner
4. **Document**: Update risk register
5. **Follow Up**: Ensure blocker is resolved

---

## Technical Decisions Log

Document all significant technical decisions:

| Decision ID | Date       | Decision                  | Rationale                    | Impacted Stories | Decision Maker |
| ----------- | ---------- | ------------------------- | ---------------------------- | ---------------- | -------------- |
| TD1         | 2024-01-15 | Use Next.js 14 App Router | Modern, recommended          | 0.1              | Team           |
| TD2         | 2024-01-15 | Use Supabase for database | Managed PostgreSQL           | 0.2, 0.3         | Team           |
| TD3         | 2024-01-15 | Use Vercel for hosting    | Seamless Next.js integration | 0.6              | Team           |

**Process**:

- [ ] Document decision when made
- [ ] Share with team
- [ ] Update this log
- [ ] Reference in code comments if needed

---

## Sprint Review Preparation

**Date**: 2024-01-29  
**Duration**: 1 hour

### Preparation Checklist

- [ ] Review all completed stories
- [ ] Prepare demo script
- [ ] Test all functionality
- [ ] Prepare metrics:
  - [ ] Stories completed
  - [ ] Story points delivered
  - [ ] Velocity
  - [ ] Blockers resolved
- [ ] Identify lessons learned
- [ ] Prepare next sprint preview

### Demo Script

1. **Next.js Project** (2 min)
   - Show project structure
   - Run dev server
   - Show build working

2. **Supabase Connection** (2 min)
   - Show Supabase project
   - Test connection
   - Show environment variables setup

3. **Database Schema** (5 min)
   - Show tables in Supabase
   - Show views
   - Test sample queries

4. **State Management** (3 min)
   - Show React Query setup
   - Show Zustand store
   - Demo API client

5. **Design System** (5 min)
   - Show components
   - Show color palette
   - Show status indicators

6. **Development Tools** (3 min)
   - Show Git hooks working
   - Show VS Code settings
   - Show linting/formatting

7. **Testing Framework** (3 min)
   - Run tests
   - Show test utilities
   - Show coverage

8. **Vercel Deployment** (5 min)
   - Show live deployment
   - Show preview deployments
   - Show CI/CD pipeline

---

## Sprint Retrospective Preparation

**Date**: 2024-01-29  
**Duration**: 1 hour

### Preparation

- [ ] Collect feedback from team members
- [ ] Review metrics
- [ ] Identify what went well
- [ ] Identify improvements
- [ ] Prepare action items

### Retrospective Format

1. **What Went Well** (15 min)
   - Each team member shares 2-3 items
   - Document all items

2. **What Could Be Improved** (15 min)
   - Each team member shares 2-3 items
   - Focus on process, not people
   - Document all items

3. **Action Items** (15 min)
   - Identify actionable improvements
   - Assign owners
   - Set due dates

4. **Metrics Review** (15 min)
   - Velocity
   - Sprint goal achievement
   - Stories completed
   - Blockers resolved

---

## Communication Plan

### Daily

- **Standup**: 15 minutes at [9:00 AM]
- **Slack/Teams**: Available for questions
- **PR Reviews**: Within 24 hours (4 hours for critical)

### Weekly

- **Progress Review**: End of Week 1
- **Stakeholder Update**: If needed

### Sprint

- **Sprint Review**: 2024-01-29
- **Retrospective**: 2024-01-29

---

## Success Criteria

Sprint 0 is successful when:

- [ ] All 8 stories completed
- [ ] All code reviewed and approved
- [ ] Infrastructure is production-ready
- [ ] Team can proceed to Sprint 1
- [ ] Documentation is complete
- [ ] No critical blockers remain

---

## Resources

- [PRD.md](../../docs/PRD.md) - Product requirements
- [SOLUTION_ARCHITECTURE.md](../../docs/SOLUTION_ARCHITECTURE.md) - Technical architecture
- [USER_STORIES.md](../USER_STORIES.md) - Story details
- [SPRINT_0_PLANNING.md](./SPRINT_0_PLANNING.md) - Sprint planning overview

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Status**: Ready for Sprint Execution
