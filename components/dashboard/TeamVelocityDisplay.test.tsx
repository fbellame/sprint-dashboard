import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import { TeamVelocityDisplay } from './TeamVelocityDisplay';

describe('TeamVelocityDisplay', () => {
  it('renders velocity display with value', () => {
    render(<TeamVelocityDisplay velocity={42} />);

    expect(screen.getByText('Team Velocity')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('story points')).toBeInTheDocument();
  });

  it('displays "n/a" when velocity is null', () => {
    render(<TeamVelocityDisplay velocity={null} />);

    expect(screen.getByText('Team Velocity')).toBeInTheDocument();
    expect(screen.getByText('n/a')).toBeInTheDocument();
    expect(
      screen.getByText('Velocity not configured for this sprint')
    ).toBeInTheDocument();
    expect(screen.queryByText('story points')).not.toBeInTheDocument();
  });

  it('displays "n/a" when velocity is undefined', () => {
    render(<TeamVelocityDisplay velocity={undefined} />);

    expect(screen.getByText('Team Velocity')).toBeInTheDocument();
    expect(screen.getByText('n/a')).toBeInTheDocument();
    expect(
      screen.getByText('Velocity not configured for this sprint')
    ).toBeInTheDocument();
  });

  it('displays zero velocity', () => {
    render(<TeamVelocityDisplay velocity={0} />);

    expect(screen.getByText('Team Velocity')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('story points')).toBeInTheDocument();
  });

  it('displays large velocity values', () => {
    render(<TeamVelocityDisplay velocity={150} />);

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('story points')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<TeamVelocityDisplay velocity={null} isLoading={true} />);

    expect(screen.queryByText('Team Velocity')).not.toBeInTheDocument();
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('has prominent display styling', () => {
    render(<TeamVelocityDisplay velocity={42} />);

    const valueElement = screen.getByText('42');
    expect(valueElement).toHaveClass('text-4xl', 'font-bold');
  });

  it('shows correct label', () => {
    render(<TeamVelocityDisplay velocity={42} />);

    const label = screen.getByText('Team Velocity');
    expect(label).toHaveClass('text-sm', 'font-medium', 'uppercase');
  });

  it('hides helper text when velocity is available', () => {
    render(<TeamVelocityDisplay velocity={42} />);

    expect(
      screen.queryByText('Velocity not configured for this sprint')
    ).not.toBeInTheDocument();
  });

  it('shows helper text when velocity is null', () => {
    render(<TeamVelocityDisplay velocity={null} />);

    expect(
      screen.getByText('Velocity not configured for this sprint')
    ).toBeInTheDocument();
  });
});
