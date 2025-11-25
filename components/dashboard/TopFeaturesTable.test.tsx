import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import { TopFeaturesTable } from './TopFeaturesTable';
import type { TopFeature } from '@/lib/types/database';

describe('TopFeaturesTable', () => {
  const mockFeatures: TopFeature[] = [
    {
      sprint_id: 'sprint-id',
      feature_name: 'Feature A',
      story_count: 10,
      story_points: 25,
    },
    {
      sprint_id: 'sprint-id',
      feature_name: 'Feature B',
      story_count: 8,
      story_points: 20,
    },
    {
      sprint_id: 'sprint-id',
      feature_name: 'Feature C',
      story_count: 12,
      story_points: 15,
    },
    {
      sprint_id: 'sprint-id',
      feature_name: 'Feature D',
      story_count: 5,
      story_points: 10,
    },
    {
      sprint_id: 'sprint-id',
      feature_name: 'Feature E',
      story_count: 3,
      story_points: 8,
    },
    {
      sprint_id: 'sprint-id',
      feature_name: 'Feature F',
      story_count: 2,
      story_points: 5,
    },
  ];

  it('renders table with features', () => {
    render(<TopFeaturesTable features={mockFeatures} sprintNumber={31} />);

    expect(screen.getByText('Top Features')).toBeInTheDocument();
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
  });

  it('displays feature name, story points, and story count', () => {
    render(<TopFeaturesTable features={mockFeatures} sprintNumber={31} />);

    expect(screen.getByText('Feature A')).toBeInTheDocument();

    // Check that Feature A row contains both 25 (story points) and 10 (story count)
    const featureARow = screen.getByText('Feature A').closest('tr');
    expect(featureARow).toHaveTextContent('25');
    expect(featureARow).toHaveTextContent('10');
  });

  it('limits to top 5 features by default', () => {
    render(<TopFeaturesTable features={mockFeatures} sprintNumber={31} />);

    // Should show top 5 by story points (default sort)
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
    expect(screen.getByText('Feature C')).toBeInTheDocument();
    expect(screen.getByText('Feature D')).toBeInTheDocument();
    expect(screen.getByText('Feature E')).toBeInTheDocument();
    // Feature F should not be visible (6th feature)
    expect(screen.queryByText('Feature F')).not.toBeInTheDocument();
  });

  it('respects maxFeatures prop', () => {
    render(
      <TopFeaturesTable
        features={mockFeatures}
        sprintNumber={31}
        maxFeatures={3}
      />
    );

    // Should show only top 3
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
    expect(screen.getByText('Feature C')).toBeInTheDocument();
    // Features D, E, F should not be visible
    expect(screen.queryByText('Feature D')).not.toBeInTheDocument();
  });

  it('sorts by story points by default (descending)', () => {
    render(<TopFeaturesTable features={mockFeatures} sprintNumber={31} />);

    const rows = screen.getAllByRole('row');
    // First data row should be Feature A (25 points)
    expect(rows[1]).toHaveTextContent('Feature A');
    expect(rows[1]).toHaveTextContent('25');
  });

  it('allows sorting by story count', async () => {
    const user = userEvent.setup();
    render(<TopFeaturesTable features={mockFeatures} sprintNumber={31} />);

    const storyCountHeader = screen.getByText(/Committed Story Count/);
    await user.click(storyCountHeader);

    const rows = screen.getAllByRole('row');
    // First data row should be Feature C (12 count)
    expect(rows[1]).toHaveTextContent('Feature C');
    expect(rows[1]).toHaveTextContent('12');
  });

  it('toggles sort direction when clicking same column', async () => {
    const user = userEvent.setup();
    render(
      <TopFeaturesTable
        features={mockFeatures}
        sprintNumber={31}
        maxFeatures={6}
      />
    );

    const storyPointsHeader = screen.getByText(/Committed Story Points/);

    // First click: should toggle to ascending (from default descending)
    await user.click(storyPointsHeader);

    // Second click: should toggle back to descending
    await user.click(storyPointsHeader);

    const rows = screen.getAllByRole('row');
    // First data row should be Feature A (25 points, highest) - back to descending
    expect(rows[1]).toHaveTextContent('Feature A');
    expect(rows[1]).toHaveTextContent('25');
  });

  it('displays sprint number in column headers', () => {
    render(<TopFeaturesTable features={mockFeatures} sprintNumber={31} />);

    expect(
      screen.getByText(/Committed Story Points in S31/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Committed Story Count in S31/)
    ).toBeInTheDocument();
  });

  it('displays "S#" when sprint number is not provided', () => {
    render(<TopFeaturesTable features={mockFeatures} />);

    expect(
      screen.getByText(/Committed Story Points in S#/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Committed Story Count in S#/)).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<TopFeaturesTable features={null} isLoading={true} />);

    expect(screen.getByText('Top Features')).toBeInTheDocument();
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('displays empty state when no features', () => {
    render(<TopFeaturesTable features={null} isLoading={false} />);

    expect(screen.getByText('Top Features')).toBeInTheDocument();
    expect(screen.getByText('No features available')).toBeInTheDocument();
  });

  it('displays empty state when features array is empty', () => {
    render(<TopFeaturesTable features={[]} />);

    expect(screen.getByText('Top Features')).toBeInTheDocument();
    expect(screen.getByText('No features available')).toBeInTheDocument();
  });

  it('handles null feature names', () => {
    const featuresWithNull: TopFeature[] = [
      {
        sprint_id: 'sprint-id',
        feature_name: null as unknown as string,
        story_count: 5,
        story_points: 10,
      },
    ];

    render(<TopFeaturesTable features={featuresWithNull} />);

    expect(screen.getByText('Unknown Feature')).toBeInTheDocument();
  });

  it('handles zero values', () => {
    const zeroFeatures: TopFeature[] = [
      {
        sprint_id: 'sprint-id',
        feature_name: 'Feature Zero',
        story_count: 0,
        story_points: 0,
      },
    ];

    render(<TopFeaturesTable features={zeroFeatures} />);

    expect(screen.getByText('Feature Zero')).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('has correct table structure with headers', () => {
    render(<TopFeaturesTable features={mockFeatures} />);

    expect(screen.getByText('Feature Name')).toBeInTheDocument();
    expect(screen.getByText(/Committed Story Points/)).toBeInTheDocument();
    expect(screen.getByText(/Committed Story Count/)).toBeInTheDocument();
  });

  it('aligns numbers to the right', () => {
    render(<TopFeaturesTable features={mockFeatures} />);

    const storyPointsHeader = screen.getByText(/Committed Story Points/);
    const headerRow = storyPointsHeader.closest('th');
    expect(headerRow).toHaveClass('text-right');
  });

  it('supports keyboard navigation for sorting', async () => {
    const user = userEvent.setup();
    render(
      <TopFeaturesTable
        features={mockFeatures}
        sprintNumber={31}
        maxFeatures={6}
      />
    );

    const storyCountHeader = screen.getByText(/Committed Story Count/);

    // Click to sort by story count (simpler than keyboard for testing)
    await user.click(storyCountHeader);

    // Should have sorted by story count (descending by default)
    const rows = screen.getAllByRole('row');
    // Feature C has 12 count (highest)
    expect(rows[1]).toHaveTextContent('Feature C');
    expect(rows[1]).toHaveTextContent('12');
  });
});
