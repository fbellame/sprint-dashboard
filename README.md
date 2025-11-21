# Sprint Dashboard

An automated visualization tool that generates sprint overview documents from Azure DevOps CSV exports.

## Project Status

**Current Sprint**: Sprint 0 - Infrastructure & Foundation  
**Start Date**: 2024-01-15  
**End Date**: 2024-01-29

## Quick Start

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Git
- VS Code (recommended)

### Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd sprint-dashboard
   ```

2. **Install dependencies** (after Story 0.1 is complete)

   ```bash
   npm install
   ```

3. **Set up environment variables** (after Story 0.2 is complete)

   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

   See [Supabase Setup Guide](./docs/SUPABASE_SETUP.md) for detailed instructions.

4. **Run development server** (after Story 0.1 is complete)

   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
sprint-dashboard/
├── app/                    # Next.js App Router pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── public/                # Static assets
├── docs/                  # Project documentation
└── [other files]
```

## Technology Stack

- **Framework**: Next.js 14.x (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **State Management**: React Query + Zustand
- **Testing**: Vitest

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Create a pull request
5. Get code review approval
6. Merge to `main`

## Sprint 0 Stories

| Story | Title                      | Assignee    | Status         |
| ----- | -------------------------- | ----------- | -------------- |
| 0.1   | Initialize Next.js Project | dev1_front  | ✅ Done        |
| 0.2   | Set Up Supabase            | dev_backend | ✅ Done        |
| 0.3   | Create Database Schema     | dev_backend | ✅ Done        |
| 0.4   | State Management Setup     | dev1_front  | 🟡 Ready       |
| 0.5   | Dev Tools & Git Hooks      | dev2_front  | 🟡 Ready       |
| 0.6   | Vercel Deployment          | dev2_front  | 🔴 Blocked     |
| 0.7   | Design System              | dev1_front  | 🟡 Ready       |
| 0.8   | Testing Framework          | dev2_front  | 🟡 Ready       |

## Documentation

- [PRD](./PRD.md) - Product Requirements Document
- [Solution Architecture](./SOLUTION_ARCHITECTURE.md) - Technical architecture
- [User Stories](./USER_STORIES.md) - All user stories
- [Sprint 0 Planning](./SPRINT_0_PLANNING.md) - Sprint 0 overview
- [Sprint 0 Index](./SPRINT_0_INDEX.md) - All Sprint 0 documents
- [Supabase Setup Guide](./docs/SUPABASE_SETUP.md) - Supabase configuration guide
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Database schema documentation

## Team

- **Team Lead**: [Name]
- **Frontend Developer 1**: [Name] (dev1_front)
- **Frontend Developer 2**: [Name] (dev2_front)
- **Backend Developer**: [Name] (dev_backend)

## Contributing

1. Follow the coding standards defined in the project
2. Write tests for new features
3. Update documentation as needed
4. Get code review approval before merging

## License

[To be determined]

---

**Last Updated**: 2024-01-15
