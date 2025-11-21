# Sprint 0: Frontend Developer 2 - Task Breakdown

**Developer Identifier**: **dev2_front**  
**Developer**: [Your Name]  
**Role**: Frontend Developer  
**Sprint**: Sprint 0 - Infrastructure & Foundation  
**Duration**: 2 weeks (Jan 15 - Jan 29, 2024)

---

## Assigned Stories (13 points)

| Story ID | Title                 | Points | Status | Priority |
| -------- | --------------------- | ------ | ------ | -------- |
| 0.5      | Dev Tools & Git Hooks | 3      | To Do  | P1       |
| 0.6      | Vercel Deployment     | 5      | To Do  | P1       |
| 0.8      | Testing Framework     | 5      | To Do  | P1       |

---

## Prerequisites & Setup (Complete BEFORE Sprint 0 Starts)

**⚠️ IMPORTANT**: Complete these setup steps before Sprint 0 begins, especially for Story 0.6.

### Required Accounts

#### Vercel Account

- [ ] **Create Vercel Account** (if you don't have one)
  - [ ] Go to https://vercel.com
  - [ ] Sign up with GitHub (recommended) or email
  - [ ] Verify email address
  - [ ] Account created: ☐
  - [ ] Can access Vercel dashboard: ☐

- [ ] **GitHub Integration** (Required for deployments)
  - [ ] Connect GitHub account to Vercel
  - [ ] Grant Vercel access to repository
  - [ ] Verify repository appears in Vercel dashboard

- [ ] **Team/Organization Access** (If using team account)
  - [ ] Added to Vercel team: ☐
  - [ ] Has deployment permissions: ☐
  - [ ] Can create projects: ☐

### Required Tools Installation

#### Vercel CLI Installation (Optional but Recommended)

- [ ] **Install Vercel CLI**
  ```bash
  npm install -g vercel
  ```
- [ ] **Verify Installation**

  ```bash
  vercel --version
  ```

  - [ ] Version displayed: ☐
  - [ ] Version: ******\_\_\_\_******

- [ ] **Login to Vercel CLI**
  ```bash
  vercel login
  ```

  - [ ] Follow browser prompt to authenticate
  - [ ] Successfully logged in: ☐
  - [ ] Can access your projects: ☐

### Verification Checklist

Before starting Story 0.6, verify:

- [ ] Vercel account created and accessible
- [ ] GitHub account connected to Vercel
- [ ] Repository access granted in Vercel
- [ ] Vercel CLI installed (optional): `vercel --version` works
- [ ] Vercel CLI logged in (optional): `vercel login` successful
- [ ] Can access Vercel dashboard: https://vercel.com/dashboard

### Troubleshooting

#### Vercel Account Issues

- **Problem**: Cannot create Vercel account
  - **Solution**: Try signing up with GitHub instead of email
  - **Solution**: Check email for verification link

- **Problem**: Cannot connect GitHub repository
  - **Solution**: Ensure GitHub account is connected to Vercel
  - **Solution**: Grant repository access in Vercel settings
  - **Solution**: Check repository is not private (or upgrade Vercel plan)

#### Vercel CLI Issues

- **Problem**: `vercel: command not found`
  - **Solution**: Ensure npm global bin is in PATH
  - **Solution**: Try `npm install -g vercel` again
  - **Solution**: Restart terminal after installation

- **Problem**: `vercel login` fails
  - **Solution**: Use browser-based login: `vercel login --browser`
  - **Solution**: Check network/firewall settings

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Integration Guide](https://vercel.com/docs/concepts/git)

---

## Story 0.5: Configure Development Tools and Git Hooks (3 points)

**Priority**: P1  
**Estimated Time**: 4-8 hours  
**Dependencies**: Story 0.1 (must be complete)

### Acceptance Criteria

- [ ] ESLint configured with Next.js rules
- [ ] Prettier configured with consistent formatting rules
- [ ] Husky installed and configured
- [ ] Pre-commit hook runs linting and formatting
- [ ] Pre-push hook runs tests (if applicable)
- [ ] VS Code settings configured (`.vscode/settings.json`)
- [ ] Git ignore file configured (`.gitignore`)
- [ ] README.md with setup instructions

### Detailed Tasks

#### Task 1: Verify ESLint Configuration (30 min)

- [ ] Check `.eslintrc.json` exists (created in Story 0.1)
- [ ] Verify Next.js ESLint config is included
- [ ] Add any custom rules needed
- [ ] Test: `npm run lint` works correctly
- [ ] Fix any linting errors in existing code

#### Task 2: Verify Prettier Configuration (30 min)

- [ ] Check `.prettierrc` exists (created in Story 0.1)
- [ ] Verify Prettier config matches team standards
- [ ] Test: `npm run format` works correctly
- [ ] Test: `npm run format:check` works correctly

#### Task 3: Install and Configure Husky (1.5 hours)

- [ ] Install Husky: `npm install -D husky`
- [ ] Initialize Husky: `npx husky init`
- [ ] Create pre-commit hook: `.husky/pre-commit`:

  ```bash
  #!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"

  npm run lint
  npm run format:check
  ```

- [ ] Make hook executable: `chmod +x .husky/pre-commit`
- [ ] Test pre-commit hook (make a commit)
- [ ] Create pre-push hook: `.husky/pre-push`:

  ```bash
  #!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"

  npm test
  ```

- [ ] Make hook executable: `chmod +x .husky/pre-push`
- [ ] Test pre-push hook (will fail until tests are set up - that's OK)

#### Task 4: Configure VS Code Settings (1 hour)

- [ ] Create `.vscode/settings.json`:
  ```json
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "typescript.tsdk": "node_modules/typescript/lib",
    "typescript.enablePromptUseWorkspaceTsdk": true
  }
  ```
- [ ] Create `.vscode/extensions.json` (recommended extensions):
  ```json
  {
    "recommendations": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss"
    ]
  }
  ```
- [ ] Test: Save a file - should auto-format

#### Task 5: Configure .gitignore (30 min)

- [ ] Verify `.gitignore` exists (created by Next.js)
- [ ] Add additional entries if needed:

  ```
  # Environment variables
  .env.local
  .env*.local

  # Testing
  coverage/
  .nyc_output/

  # IDE
  .vscode/
  .idea/
  *.swp
  *.swo

  # OS
  .DS_Store
  Thumbs.db
  ```

- [ ] Test: Verify sensitive files are ignored

#### Task 6: Update README.md (1 hour)

- [ ] Add setup instructions:
  - [ ] Prerequisites (Node.js version, npm)
  - [ ] Installation steps
  - [ ] Environment variables setup
  - [ ] Running the development server
  - [ ] Running tests
  - [ ] Building for production
- [ ] Add development workflow:
  - [ ] Git workflow
  - [ ] Code style guidelines
  - [ ] Commit message conventions
- [ ] Add troubleshooting section
- [ ] Add links to documentation

#### Task 7: Create .editorconfig (Optional, 30 min)

- [ ] Create `.editorconfig`:

  ```ini
  root = true

  [*]
  indent_style = space
  indent_size = 2
  end_of_line = lf
  charset = utf-8
  trim_trailing_whitespace = true
  insert_final_newline = true
  ```

- [ ] Test: Verify editor respects settings

### Definition of Done

- [ ] All tasks completed
- [ ] Code reviewed by Team Lead
- [ ] Pre-commit hook working (tested with a commit)
- [ ] VS Code settings working
- [ ] README.md updated
- [ ] All team members can use the development tools

### Blockers

- Must wait for Story 0.1 to be complete

### Notes

- Can start this as soon as Story 0.1 is complete
- This enables better developer experience for the team
- Test hooks with actual commits to ensure they work

---

## Story 0.8: Set Up Testing Framework (5 points)

**Priority**: P1  
**Estimated Time**: 1-2 days  
**Dependencies**: Story 0.1 (must be complete)

### Acceptance Criteria

- [ ] Vitest or Jest installed and configured
- [ ] React Testing Library installed
- [ ] Test utilities created (`lib/test-utils.tsx`)
- [ ] Sample component test written
- [ ] Sample API route test written
- [ ] Test scripts added to `package.json`
- [ ] Test coverage configuration (optional)

### Detailed Tasks

#### Task 1: Install Testing Dependencies (30 min)

- [ ] Install Vitest: `npm install -D vitest @vitest/ui`
- [ ] Install React Testing Library: `npm install -D @testing-library/react @testing-library/jest-dom`
- [ ] Install jsdom: `npm install -D jsdom`
- [ ] Install testing utilities: `npm install -D @testing-library/user-event`
- [ ] Verify packages in `package.json`

#### Task 2: Configure Vitest (1.5 hours)

- [ ] Create `vitest.config.ts`:

  ```typescript
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./lib/test-utils.tsx'],
      globals: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  });
  ```

- [ ] Install Vite React plugin: `npm install -D @vitejs/plugin-react`
- [ ] Update `package.json` scripts:
  ```json
  {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
  ```
- [ ] Test: `npm test` should run (may have no tests yet)

#### Task 3: Create Test Utilities (1 hour)

- [ ] Create `lib/test-utils.tsx`:

  ```typescript
  import { render } from '@testing-library/react'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { ReactElement } from 'react'

  function createTestQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  }

  export function renderWithProviders(ui: ReactElement) {
    const testQueryClient = createTestQueryClient()
    return render(
      <QueryClientProvider client={testQueryClient}>
        {ui}
      </QueryClientProvider>
    )
  }

  export * from '@testing-library/react'
  ```

- [ ] Create `lib/test-utils/mocks.ts` for common mocks
- [ ] Create `lib/test-utils/fixtures.ts` for test data

#### Task 4: Write Sample Component Test (1.5 hours)

- [ ] Create a simple test component: `components/common/Button.test.tsx`
- [ ] Write test for Button component:

  ```typescript
  import { describe, it, expect } from 'vitest'
  import { render, screen } from '@/lib/test-utils'
  import { Button } from './Button'

  describe('Button', () => {
    it('renders button text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })
  })
  ```

- [ ] Run test: `npm test` - should pass
- [ ] Add more test cases (variants, sizes, etc.)

#### Task 5: Write Sample API Route Test (1.5 hours)

- [ ] Create test for API route: `app/api/sprints/route.test.ts`
- [ ] Mock Supabase client
- [ ] Write test for GET endpoint
- [ ] Write test for POST endpoint
- [ ] Test error handling
- [ ] Run tests: `npm test` - should pass

#### Task 6: Configure Test Coverage (1 hour)

- [ ] Install coverage tool: `npm install -D @vitest/coverage-v8`
- [ ] Update `vitest.config.ts` with coverage config:
  ```typescript
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'lib/test-utils/',
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
  }
  ```
- [ ] Test: `npm run test:coverage` - should generate coverage report
- [ ] Add coverage threshold (optional):
  ```typescript
  coverage: {
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  }
  ```

#### Task 7: Create Test Documentation (1 hour)

- [ ] Update README.md with testing section:
  - [ ] How to run tests
  - [ ] How to write tests
  - [ ] Testing conventions
  - [ ] Coverage reports
- [ ] Create `docs/TESTING.md`:
  - [ ] Testing philosophy
  - [ ] Component testing guidelines
  - [ ] API route testing guidelines
  - [ ] Mocking strategies
  - [ ] Best practices

### Definition of Done

- [ ] All tasks completed
- [ ] Code reviewed by Team Lead
- [ ] Sample tests written and passing
- [ ] Test coverage configured
- [ ] Documentation updated
- [ ] Pre-push hook runs tests (from Story 0.5)

### Blockers

- Must wait for Story 0.1 to be complete
- Pre-push hook from Story 0.5 will use these tests

### Notes

- Can start this as soon as Story 0.1 is complete
- Use Vitest for faster test execution
- Focus on setting up the framework - detailed tests come in later sprints

---

## Story 0.6: Set Up Vercel Deployment and CI/CD (5 points)

**Priority**: P1  
**Estimated Time**: 1-2 days  
**Dependencies**: Story 0.1, Story 0.2 (must be complete)

### Acceptance Criteria

- [ ] Vercel project created and linked to repository
- [ ] `vercel.json` configuration file created
- [ ] Environment variables configured in Vercel dashboard
- [ ] GitHub Actions workflow created (if using GitHub)
- [ ] Automatic deployment on push to main branch
- [ ] Preview deployments for pull requests
- [ ] Deployment documentation created

### Detailed Tasks

#### Task 1: Create Vercel Project (1 hour)

- [ ] Sign in to Vercel (or use team account)
- [ ] Create new project from GitHub repository
- [ ] Link repository to Vercel project
- [ ] Verify project settings:
  - [ ] Framework: Next.js
  - [ ] Root directory: `.` (or project root)
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `.next`

#### Task 2: Configure vercel.json (1 hour)

- [ ] Create `vercel.json`:
  ```json
  {
    "buildCommand": "npm run build",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "nextjs",
    "regions": ["iad1"],
    "functions": {
      "app/api/**/*.ts": {
        "maxDuration": 30
      }
    }
  }
  ```
- [ ] Test configuration locally: `vercel dev`
- [ ] Verify build works: `vercel build`

#### Task 3: Configure Environment Variables (1 hour)

- [ ] Get Supabase credentials from Backend Dev (Story 0.2)
- [ ] Add environment variables in Vercel dashboard:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- [ ] Add to production, preview, and development environments
- [ ] Verify variables are set correctly

#### Task 4: Set Up GitHub Actions (2 hours)

- [ ] Create `.github/workflows/deploy.yml`:

  ```yaml
  name: Deploy
  on:
    push:
      branches: [main]
    pull_request:
      branches: [main]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: vercel/action@v1
          with:
            vercel-token: ${{ secrets.VERCEL_TOKEN }}
            vercel-org-id: ${{ secrets.ORG_ID }}
            vercel-project-id: ${{ secrets.PROJECT_ID }}
  ```

- [ ] Add Vercel secrets to GitHub:
  - [ ] `VERCEL_TOKEN`
  - [ ] `ORG_ID`
  - [ ] `PROJECT_ID`
- [ ] Test workflow: Create a PR and verify preview deployment
- [ ] Test workflow: Merge to main and verify production deployment

#### Task 5: Configure Deployment Settings (1 hour)

- [ ] Set up automatic deployments:
  - [ ] Production: Deploy on push to `main`
  - [ ] Preview: Deploy on PR creation
- [ ] Configure branch protection (if applicable)
- [ ] Set up deployment notifications (Slack/email)
- [ ] Configure custom domain (if needed)

#### Task 6: Test Deployment (1 hour)

- [ ] Make a test commit and push to `main`
- [ ] Verify deployment triggers
- [ ] Verify build succeeds
- [ ] Verify application is accessible
- [ ] Test preview deployment with a PR
- [ ] Verify environment variables are available

#### Task 7: Create Deployment Documentation (1 hour)

- [ ] Update README.md with deployment section:
  - [ ] How to deploy manually
  - [ ] How preview deployments work
  - [ ] How to rollback
  - [ ] Environment variables setup
- [ ] Create `docs/DEPLOYMENT.md`:
  - [ ] Deployment process
  - [ ] Vercel configuration
  - [ ] CI/CD pipeline
  - [ ] Troubleshooting
  - [ ] Rollback procedures

### Definition of Done

- [ ] All tasks completed
- [ ] Code reviewed by Team Lead
- [ ] Vercel project created and linked
- [ ] Environment variables configured
- [ ] Automatic deployments working
- [ ] Preview deployments working
- [ ] Documentation updated
- [ ] Application accessible at Vercel URL

### Blockers

- Must wait for Story 0.1 to be complete
- Must wait for Story 0.2 to get Supabase credentials

### Notes

- This is the last story to complete
- Coordinate with dev_backend to get Supabase credentials
- Test thoroughly before marking as done
- Document the deployment process for the team

---

## Weekly Timeline

### Week 1 (Jan 15-19)

- **Day 1-2**: Wait for Story 0.1 to complete
- **Day 3-5**: Complete Story 0.5 (Dev Tools & Git Hooks), Start Story 0.8 (Testing Framework)

### Week 2 (Jan 22-26)

- **Day 1**: Complete Story 0.8 (Testing Framework)
- **Day 2-5**: Complete Story 0.6 (Vercel Deployment) - wait for Story 0.2 for Supabase credentials

---

## Daily Checklist

- [ ] Update daily standup notes
- [ ] Commit code at least once per day
- [ ] Create PR when story is complete
- [ ] Request code review from Team Lead
- [ ] Update story status in project management tool

---

## Communication

- **Daily Standup**: [Time] - Share progress and blockers
- **Slack/Teams**: Use for quick questions
- **PR Reviews**: Tag Team Lead for reviews
- **Blockers**: Escalate immediately to Team Lead
- **Story 0.6**: Coordinate with dev_backend for Supabase credentials

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Husky Documentation](https://typicode.github.io/husky/)
- [SOLUTION_ARCHITECTURE.md](./SOLUTION_ARCHITECTURE.md) - Deployment details

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Status**: Ready for Sprint Execution
