# Sprint 0: Team Member Information

**Sprint**: Sprint 0 - Infrastructure & Foundation  
**Last Updated**: 2024-01-15

---

## Team Roster

| Identifier      | Role                 | Name   | GitHub Username | Email   | Status    | Notes                           |
| --------------- | -------------------- | ------ | --------------- | ------- | --------- | ------------------------------- |
| **team_lead**   | Team Lead            | [Name] | [@username]     | [email] | ✅ Active | Coordination & reviews          |
| **dev1_front**  | Frontend Developer 1 | [Name] | [@username]     | [email] | ✅ Active | Critical path - Story 0.1       |
| **dev2_front**  | Frontend Developer 2 | [Name] | [@username]     | [email] | ✅ Active | Vercel deployment - Story 0.6   |
| **dev_backend** | Backend Developer    | [Name] | [@username]     | [email] | ✅ Active | Supabase setup - Story 0.2, 0.3 |

---

## Account Access Status

### GitHub

| Developer   | Account Created | Repository Access | SSH/PAT Configured | Verified |
| ----------- | --------------- | ----------------- | ------------------ | -------- |
| dev1_front  | ☐               | ☐                 | ☐                  | ☐        |
| dev2_front  | ☐               | ☐                 | ☐                  | ☐        |
| dev_backend | ☐               | ☐                 | ☐                  | ☐        |
| team_lead   | ☐               | ☐                 | ☐                  | ☐        |

### Supabase (dev_backend)

| Item                   | Status | Notes              |
| ---------------------- | ------ | ------------------ |
| Account Created        | ☐      | -                  |
| Project Created        | ☐      | -                  |
| CLI Installed          | ☐      | Version: **\_**    |
| CLI Logged In          | ☐      | -                  |
| Docker Installed       | ☐      | For local Supabase |
| Local Supabase Working | ☐      | -                  |

### Vercel (dev2_front)

| Item               | Status | Notes                 |
| ------------------ | ------ | --------------------- |
| Account Created    | ☐      | -                     |
| CLI Installed      | ☐      | Version: **\_**       |
| CLI Logged In      | ☐      | -                     |
| GitHub Integration | ☐      | -                     |
| Team Access        | ☐      | If using team account |

---

## Development Environment Status

### Node.js & npm

| Developer   | Node Version | npm Version | Verified |
| ----------- | ------------ | ----------- | -------- |
| dev1_front  | **\_**       | **\_**      | ☐        |
| dev2_front  | **\_**       | **\_**      | ☐        |
| dev_backend | **\_**       | **\_**      | ☐        |

### Git Configuration

| Developer   | Git Installed | user.name | user.email | Verified |
| ----------- | ------------- | --------- | ---------- | -------- |
| dev1_front  | ☐             | **\_**    | **\_**     | ☐        |
| dev2_front  | ☐             | **\_**    | **\_**     | ☐        |
| dev_backend | ☐             | **\_**    | **\_**     | ☐        |

### Code Editor

| Developer   | VS Code Installed | Extensions Installed | Verified |
| ----------- | ----------------- | -------------------- | -------- |
| dev1_front  | ☐                 | ☐                    | ☐        |
| dev2_front  | ☐                 | ☐                    | ☐        |
| dev_backend | ☐                 | ☐                    | ☐        |

**Recommended Extensions**:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

---

## Story Assignments

### dev1_front (13 points)

- **Story 0.1**: Initialize Next.js Project (3 points) - **CRITICAL PATH**
- **Story 0.4**: State Management Setup (5 points)
- **Story 0.7**: Design System (5 points)

### dev2_front (13 points)

- **Story 0.5**: Dev Tools & Git Hooks (3 points)
- **Story 0.6**: Vercel Deployment (5 points)
- **Story 0.8**: Testing Framework (5 points)

### dev_backend (13 points)

- **Story 0.2**: Set Up Supabase (5 points)
- **Story 0.3**: Create Database Schema (8 points)

---

## Communication Channels

### Daily Standup

- **Time**: [9:00 AM]
- **Duration**: 15 minutes
- **Format**: Round-robin
- **Location**: [Zoom/Slack/Teams link]

### Code Reviews

- **Platform**: GitHub Pull Requests
- **Response Time**:
  - Critical (Story 0.1): Immediate
  - High Priority (Story 0.2): Within 4 hours
  - Normal: Within 24 hours

### Emergency Contact

- **Slack/Teams**: [Channel name]
- **Email**: [Team email]
- **Escalation**: [Product Owner contact]

---

## Credentials & Secrets

### Supabase Credentials (After Story 0.2)

**Shared From**: dev_backend  
**Shared To**: dev2_front (for Story 0.6)

| Variable                      | Status | Shared Date | Method |
| ----------------------------- | ------ | ----------- | ------ |
| NEXT_PUBLIC_SUPABASE_URL      | ☐      | -           | -      |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ☐      | -           | -      |
| SUPABASE_SERVICE_ROLE_KEY     | ☐      | -           | -      |

**Security Notes**:

- ✅ Use secure method (password manager, encrypted doc)
- ❌ DO NOT use email or unencrypted channels
- ✅ Verify `.env.local` is in `.gitignore`

---

## Verification Checklist

### Pre-Sprint Verification Meeting

**Date**: [TBD]  
**Status**: ☐ Scheduled | ☐ Completed

**Agenda**:

- [ ] GitHub access verification
- [ ] Development environment check
- [ ] Supabase setup (dev_backend)
- [ ] Vercel setup (dev2_front)
- [ ] Q&A session

**Outcome**: All developers ready to start Sprint 0

---

## Notes

### 2024-01-15

- Team roster created
- Pre-sprint setup checklist needs completion
- Verification meeting to be scheduled

---

**Last Updated**: 2024-01-15  
**Next Review**: Daily during standup
