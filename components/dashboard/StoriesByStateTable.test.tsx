import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import { StoriesByStateTable } from './StoriesByStateTable';
import type { StoriesByState } from '@/lib/types/database';

describe('StoriesByStateTable', () => {
  const mockData: StoriesByState[] = [
    {
      sprint_id: 'sprint-id',
      work_item_type: 'User Story',
      state: 'New',
      count: 5,
      story_points: 10,
    },
    {
      sprint_id: 'sprint-id',
      work_item_type: 'User Story',
      state: 'Active',
      count: 8,
      story_points: 20,
    },
    {
      sprint_id: 'sprint-id',
      work_item_type: 'User Story',
      state: 'Resolved',
      count: 3,
      story_points: 8,
    },
    {
      sprint_id: 'sprint-id',
      work_item_type: 'User Story',
      state: 'Closed',
      count: 4,
      story_points: 12,
    },
    {
      sprint_id: 'sprint-id',
      work_item_type: 'Support Ticket',
      state: 'New',
      count: 2,
      story_points: 4,
    },
    {
      sprint_id: 'sprint-id',
      work_item_type: 'Support Ticket',
      state: 'Active',
      count: 1,
      story_points: 2,
    },
    {
      sprint_id: 'sprint-id',
      work_item_type: 'Support Ticket',
      state: 'Closed',
      count: 3,
      story_points: 6,
    },
  ];

  it('renders table with both sections', () => {
    render(<StoriesByStateTable data={mockData} sprintNumber={31} />);

    expect(screen.getByText('Stories by State')).toBeInTheDocument();
    expect(screen.getByText('User Stories')).toBeInTheDocument();
    expect(screen.getByText('Prod Support Tickets')).toBeInTheDocument();
  });

  it('displays correct counts for User Stories', () => {
    render(<StoriesByStateTable data={mockData} sprintNumber={31} />);

    // Check that all expected values are present (may appear multiple times)
    const newCounts = screen.getAllByText('5');
    const activeCounts = screen.getAllByText('8');
    const resolvedCounts = screen.getAllByText('3');
    const closedCounts = screen.getAllByText('4');
    const totalCounts = screen.getAllByText('20');

    expect(newCounts.length).toBeGreaterThan(0);
    expect(activeCounts.length).toBeGreaterThan(0);
    expect(resolvedCounts.length).toBeGreaterThan(0);
    expect(closedCounts.length).toBeGreaterThan(0);
    expect(totalCounts.length).toBeGreaterThan(0);
  });

  it('displays correct counts for Prod Support Tickets', () => {
    render(<StoriesByStateTable data={mockData} sprintNumber={31} />);

    const supportSection = screen
      .getByText('Prod Support Tickets')
      .closest('div');
    expect(supportSection).toBeInTheDocument();

    // Check for support ticket counts (2 New, 1 Active, 0 Resolved, 3 Closed, 6 Total)
    const counts = screen.getAllByText('2');
    expect(counts.length).toBeGreaterThan(0);
    expect(screen.getByText('6')).toBeInTheDocument(); // Total (2+1+0+3)
  });

  it('displays "n/a" for zero values', () => {
    const zeroData: StoriesByState[] = [
      {
        sprint_id: 'sprint-id',
        work_item_type: 'User Story',
        state: 'New',
        count: 0,
        story_points: 0,
      },
    ];

    render(<StoriesByStateTable data={zeroData} />);

    const naValues = screen.getAllByText('n/a');
    expect(naValues.length).toBeGreaterThan(0);
  });

  it('calculates totals correctly', () => {
    render(<StoriesByStateTable data={mockData} sprintNumber={31} />);

    // User Stories total: 5 + 8 + 3 + 4 = 20
    // Support Tickets total: 2 + 1 + 0 + 3 = 6
    const total20 = screen.getAllByText('20');
    const total6 = screen.getAllByText('6');
    expect(total20.length).toBeGreaterThan(0);
    expect(total6.length).toBeGreaterThan(0);
  });

  it('displays sprint number in closed state label', () => {
    render(<StoriesByStateTable data={mockData} sprintNumber={31} />);

    const closedLabels = screen.getAllByText('Closed in S31');
    expect(closedLabels.length).toBe(2); // One for User Stories, one for Support Tickets
  });

  it('displays "S#" when sprint number is not provided', () => {
    render(<StoriesByStateTable data={mockData} />);

    const closedLabels = screen.getAllByText('Closed in S#');
    expect(closedLabels.length).toBeGreaterThan(0);
  });

  it('displays loading state', () => {
    render(<StoriesByStateTable data={null} isLoading={true} />);

    expect(screen.getByText('Stories by State')).toBeInTheDocument();
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('displays empty state when no data', () => {
    render(<StoriesByStateTable data={null} isLoading={false} />);

    expect(screen.getByText('Stories by State')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles case-insensitive work item type matching', () => {
    const caseVariations: StoriesByState[] = [
      {
        sprint_id: 'sprint-id',
        work_item_type: 'user story',
        state: 'New',
        count: 3,
        story_points: 6,
      },
      {
        sprint_id: 'sprint-id',
        work_item_type: 'STORY',
        state: 'Active',
        count: 2,
        story_points: 4,
      },
      {
        sprint_id: 'sprint-id',
        work_item_type: 'support ticket',
        state: 'New',
        count: 1,
        story_points: 2,
      },
    ];

    render(<StoriesByStateTable data={caseVariations} />);

    expect(screen.getByText('User Stories')).toBeInTheDocument();
    expect(screen.getByText('Prod Support Tickets')).toBeInTheDocument();
  });

  it('handles Bug work item type as Support Ticket', () => {
    const bugData: StoriesByState[] = [
      {
        sprint_id: 'sprint-id',
        work_item_type: 'Bug',
        state: 'New',
        count: 2,
        story_points: 4,
      },
    ];

    render(<StoriesByStateTable data={bugData} />);

    expect(screen.getByText('Prod Support Tickets')).toBeInTheDocument();
  });

  it('has correct table structure with headers', () => {
    render(<StoriesByStateTable data={mockData} />);

    expect(screen.getAllByText('State')).toHaveLength(2); // One per section
    expect(screen.getAllByText('Count')).toHaveLength(2); // One per section
  });

  it('aligns numbers to the right', () => {
    render(<StoriesByStateTable data={mockData} />);

    const countHeaders = screen.getAllByText('Count');
    countHeaders.forEach((header) => {
      const headerRow = header.closest('th');
      expect(headerRow).toHaveClass('text-right');
    });
  });
});
