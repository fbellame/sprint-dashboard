import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import { TeamBacklogTable } from './TeamBacklogTable';
import type { TeamBacklogMetrics } from '@/lib/types/database';

describe('TeamBacklogTable', () => {
  const mockMetrics: TeamBacklogMetrics = {
    sprint_id: 'sprint-id',
    planned_count: 20,
    planned_story_points: 45,
    removed_count: 2,
    removed_story_points: 5,
    added_count: 3,
    added_story_points: 8,
  };

  it('renders table with all metrics', () => {
    render(<TeamBacklogTable metrics={mockMetrics} />);

    expect(screen.getByText('Team Backlog')).toBeInTheDocument();
    expect(screen.getByText('Stories/Bugs Planned')).toBeInTheDocument();
    expect(screen.getByText('Stories Removed mid-sprint')).toBeInTheDocument();
    expect(
      screen.getByText('Stories/Bugs added mid-sprint')
    ).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('displays correct values for planned items', () => {
    render(<TeamBacklogTable metrics={mockMetrics} />);

    const rows = screen.getAllByRole('row');
    const plannedRow = rows.find((row) =>
      row.textContent?.includes('Stories/Bugs Planned')
    );

    expect(plannedRow).toBeInTheDocument();
    expect(plannedRow).toHaveTextContent('45');
    expect(plannedRow).toHaveTextContent('20');
  });

  it('displays "n/a" for zero values', () => {
    const zeroMetrics: TeamBacklogMetrics = {
      sprint_id: 'sprint-id',
      planned_count: 0,
      planned_story_points: 0,
      removed_count: 0,
      removed_story_points: 0,
      added_count: 0,
      added_story_points: 0,
    };

    render(<TeamBacklogTable metrics={zeroMetrics} />);

    const naValues = screen.getAllByText('n/a');
    expect(naValues.length).toBeGreaterThan(0);
  });

  it('calculates and displays total correctly', () => {
    render(<TeamBacklogTable metrics={mockMetrics} />);

    // Total should be: 45 + 5 + 8 = 58 points, 20 + 2 + 3 = 25 count
    expect(screen.getByText('58')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<TeamBacklogTable metrics={null} isLoading={true} />);

    expect(screen.getByText('Team Backlog')).toBeInTheDocument();
    // Check for loading skeleton
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('displays empty state when no metrics', () => {
    render(<TeamBacklogTable metrics={null} isLoading={false} />);

    expect(screen.getByText('Team Backlog')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('has correct table structure with headers', () => {
    render(<TeamBacklogTable metrics={mockMetrics} />);

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Story Points')).toBeInTheDocument();
    expect(screen.getByText('Story Count')).toBeInTheDocument();
  });

  it('aligns numbers to the right', () => {
    render(<TeamBacklogTable metrics={mockMetrics} />);

    const storyPointsHeader = screen.getByText('Story Points');
    const headerRow = storyPointsHeader.closest('th');
    expect(headerRow).toHaveClass('text-right');
  });
});
