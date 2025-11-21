# Testing Guide

This document outlines the testing philosophy, guidelines, and best practices for the Sprint Dashboard project.

## Testing Philosophy

We follow a **pragmatic testing approach** that balances test coverage with development velocity:

- **Focus on critical paths**: Test user-facing functionality and business logic
- **Test behavior, not implementation**: Write tests that verify what the code does, not how it does it
- **Keep tests maintainable**: Tests should be easy to read, understand, and update
- **Fast feedback**: Tests should run quickly to provide immediate feedback

## Testing Framework

### Vitest

We use [Vitest](https://vitest.dev/) as our testing framework because:

- Fast execution (powered by Vite)
- Built-in TypeScript support
- Compatible with Jest API (easy migration)
- Great developer experience with watch mode and UI

### React Testing Library

We use [React Testing Library](https://testing-library.com/react) for component testing because:

- Encourages testing user behavior, not implementation details
- Accessible queries (getByRole, getByLabelText, etc.)
- Simple and intuitive API

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Watch Mode

When you run `npm test` without `--run`, Vitest enters watch mode:

- Automatically re-runs tests when files change
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit

## Test Structure

### Component Tests

Component tests should be placed next to the component file:

```
components/
  common/
    Button.tsx
    Button.test.tsx
```

Example component test:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### API Route Tests

API route tests should be placed next to the route file:

```
app/
  api/
    sprints/
      route.ts
      route.test.ts
```

Example API route test:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

describe('GET /api/sprints', () => {
  it('returns list of sprints', async () => {
    // Mock Supabase
    // Test the route
  });
});
```

## Test Utilities

### renderWithProviders

Use `renderWithProviders` when testing components that use React Query:

```typescript
import { renderWithProviders, screen } from '@/lib/test-utils';

it('renders with React Query', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Mocks

Common mocks are available in `lib/test-utils/mocks.ts`:

```typescript
import { mockSupabaseClient, mockRouter } from '@/lib/test-utils/mocks';
```

### Fixtures

Test data fixtures are available in `lib/test-utils/fixtures.ts`:

```typescript
import { mockSprint, mockWorkItem } from '@/lib/test-utils/fixtures';
```

## Testing Guidelines

### Component Testing

1. **Test user interactions**: Click buttons, fill forms, navigate
2. **Test accessibility**: Use accessible queries (getByRole, getByLabelText)
3. **Test edge cases**: Empty states, error states, loading states
4. **Avoid testing implementation**: Don't test internal state or methods

### API Route Testing

1. **Mock external dependencies**: Mock Supabase, external APIs
2. **Test error handling**: Test 400, 500 errors
3. **Test validation**: Test invalid input handling
4. **Test success cases**: Test happy paths

### Best Practices

1. **Keep tests simple**: One assertion per test when possible
2. **Use descriptive test names**: `it('should display error message when API fails')`
3. **Arrange-Act-Assert pattern**: Structure tests clearly
4. **Clean up**: Reset mocks between tests
5. **Test in isolation**: Don't depend on other tests

## Coverage Goals

We aim for:

- **80%+ coverage** on critical paths (business logic, API routes)
- **60%+ coverage** overall
- **Focus on quality over quantity**: Better to have fewer, better tests

## Common Patterns

### Testing Components with React Query

```typescript
import { renderWithProviders, screen } from '@/lib/test-utils';
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data } = useQuery({ queryKey: ['test'], queryFn: () => fetchData() });
  return <div>{data?.name}</div>;
}

it('renders data from query', () => {
  renderWithProviders(<MyComponent />);
  // Test will use test QueryClient from renderWithProviders
});
```

### Testing API Routes

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/supabase/server', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

describe('GET /api/sprints', () => {
  it('returns sprints', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveLength(0);
  });
});
```

### Testing Forms

```typescript
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

it('submits form with user input', async () => {
  const user = userEvent.setup();
  render(<MyForm />);

  await user.type(screen.getByLabelText('Name'), 'John');
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## Debugging Tests

### Using Vitest UI

```bash
npm run test:ui
```

Opens a browser UI where you can:

- See test results
- Debug failing tests
- View coverage reports

### Debugging in VS Code

1. Set breakpoints in test files
2. Run "Debug Test" from the test file
3. Use VS Code debugger

## Continuous Integration

Tests run automatically:

- **Pre-push hook**: Runs tests before pushing (via Husky)
- **CI/CD**: Tests run on every PR and merge

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: 2024-01-15  
**Story**: 0.8 - Testing Framework Setup
