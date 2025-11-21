# Sprint Dashboard

An automated visualization tool that generates sprint overview documents from Azure DevOps CSV exports.

## Project Status

**Current Sprint**: Sprint 0 - Infrastructure & Foundation  
**Start Date**: 2024-01-15  
**End Date**: 2024-01-29

## Quick Start

### Prerequisites

- **Node.js**: Version 18.x or 20.x
  - Check version: `node --version`
  - Download: [nodejs.org](https://nodejs.org/)
- **npm**: Comes with Node.js
  - Check version: `npm --version`
- **Git**: Version control
  - Check version: `git --version`
  - Download: [git-scm.com](https://git-scm.com/downloads)
- **VS Code** (recommended): Code editor
  - Download: [code.visualstudio.com](https://code.visualstudio.com/)
  - Install recommended extensions (see below)

### Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd sprint-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This will also set up Husky Git hooks automatically.

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

   See [Supabase Setup Guide](./docs/SUPABASE_SETUP.md) for detailed instructions.

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### VS Code Setup

1. **Install recommended extensions** (VS Code will prompt you, or install manually):
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)
   - Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

2. **Settings are configured automatically** via `.vscode/settings.json`:
   - Format on save
   - ESLint auto-fix on save
   - TypeScript workspace version

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

### Git Workflow

1. **Create a feature branch** from `main`

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following the project's coding standards
   - Code will be automatically formatted on save (VS Code)

3. **Before committing**
   - Run linting: `npm run lint`
   - Check formatting: `npm run format:check`
   - Run tests: `npm test`

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   - Pre-commit hook will automatically run linting and format checking
   - If checks fail, fix the issues and commit again

5. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

   - Pre-push hook will automatically run tests
   - If tests fail, fix the issues and push again

6. **Create a pull request**
   - Open a PR on GitHub
   - Get code review approval
   - Address any review comments

7. **Merge to `main`**
   - After approval, merge the PR
   - Delete the feature branch

### Code Style Guidelines

- **Formatting**: Prettier handles automatic formatting
- **Linting**: ESLint enforces code quality
- **TypeScript**: Use strict typing, avoid `any`
- **Commit Messages**: Use conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting
  - `refactor:` for code refactoring
  - `test:` for tests
  - `chore:` for maintenance tasks

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests (when testing framework is set up)

## Sprint 0 Stories

| Story | Title                      | Assignee    | Status     |
| ----- | -------------------------- | ----------- | ---------- |
| 0.1   | Initialize Next.js Project | dev1_front  | ✅ Done    |
| 0.2   | Set Up Supabase            | dev_backend | ✅ Done    |
| 0.3   | Create Database Schema     | dev_backend | ✅ Done    |
| 0.4   | State Management Setup     | dev1_front  | ✅ Done    |
| 0.5   | Dev Tools & Git Hooks      | dev2_front  | 🟡 Ready   |
| 0.6   | Vercel Deployment          | dev2_front  | 🔴 Blocked |
| 0.7   | Design System              | dev1_front  | 🟡 Ready   |
| 0.8   | Testing Framework          | dev2_front  | 🟡 Ready   |

## State Management

This project uses a combination of **React Query** (for server state) and **Zustand** (for client state).

### React Query (Server State)

React Query is configured in `lib/providers/QueryProvider.tsx` and wraps the entire application. Use it for:

- Fetching data from API routes
- Caching and automatic refetching
- Loading and error states

**Example Usage:**

```tsx
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const { data, isLoading, error } = useQuery({
  queryKey: ['sprints'],
  queryFn: () => apiClient.get('/api/sprints'),
});
```

### Zustand (Client State)

Zustand stores are located in `stores/`. Use them for:

- UI state (selected items, filters, modals)
- Client-side preferences
- Temporary state that doesn't need server sync

**Example Usage:**

```tsx
import { useSprintStore } from '@/stores';

const { selectedSprintId, setSelectedSprintId } = useSprintStore();
```

### Error Handling

Use `lib/utils/errors.ts` for consistent error formatting:

```tsx
import { formatError } from '@/lib/utils/errors';

const formattedError = formatError(error);
console.log(formattedError.userMessage);
```

### Loading States

Use `lib/utils/loading.ts` for consistent loading state management:

```tsx
import { createLoadingState } from '@/lib/utils/loading';

const loadingState = createLoadingState(isLoading, isFetching, isError, error);
```

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

## Development Tools

### Git Hooks (Husky)

The project uses Husky to run automated checks:

- **Pre-commit hook**: Runs `npm run lint` and `npm run format:check`
  - Prevents committing code with linting errors or formatting issues
  - Fix issues before committing

- **Pre-push hook**: Runs `npm test`
  - Prevents pushing code with failing tests
  - Ensures all tests pass before pushing

### Code Quality Tools

- **ESLint**: Code linting with Next.js and TypeScript rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Type checking with strict mode
- **Husky**: Git hooks for automated checks

### Troubleshooting

#### Pre-commit hook fails

If the pre-commit hook fails:

1. Fix linting errors: Run ESLint via VS Code extension or `npx eslint .`
2. Fix formatting: `npm run format`
3. Try committing again

#### `next lint` command issue

If `npm run lint` shows an error about a "lint" directory, this is a known compatibility issue between Next.js 16 and ESLint 9. The ESLint configuration is still valid and will work:

- ESLint extension in VS Code will still lint your code
- Pre-commit hooks will still run (formatting check will work)
- You can run ESLint directly: `npx eslint . --ext .js,.jsx,.ts,.tsx`

This will be resolved in a future Next.js update or when we migrate to ESLint flat config format.

#### Pre-push hook fails

If the pre-push hook fails:

1. Run tests locally: `npm test`
2. Fix failing tests
3. Try pushing again

#### VS Code not formatting on save

1. Ensure Prettier extension is installed
2. Check `.vscode/settings.json` exists
3. Reload VS Code window: `Cmd+Shift+P` → "Reload Window"

#### Git hooks not running

1. Ensure Husky is installed: `npm install`
2. Check `.husky` directory exists
3. Verify hooks are executable: `ls -la .husky/`

## Contributing

1. Follow the coding standards defined in the project
2. Write tests for new features
3. Update documentation as needed
4. Get code review approval before merging
5. Ensure all Git hooks pass before pushing

## License

[To be determined]

---

**Last Updated**: 2024-01-15
