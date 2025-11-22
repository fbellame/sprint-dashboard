/**
 * Status Indicator Component
 *
 * Displays status indicators matching PRD requirements:
 * - * (Green asterisk) - Team Focus
 * - ✓ (Green checkmark) - Done
 * - | (Orange vertical bar) - Ongoing
 * - ✗ (Red X) - Not Done
 *
 * @example
 * ```tsx
 * <StatusIndicator status="done" />
 * <StatusIndicator status="team-focus" size="lg" />
 * ```
 */

export type StatusType = 'team-focus' | 'done' | 'ongoing' | 'not-done';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

const statusConfig = {
  'team-focus': {
    symbol: '*',
    color: 'text-status-done', // Green
    label: 'Team Focus',
  },
  done: {
    symbol: '✓',
    color: 'text-status-done', // Green
    label: 'Done',
  },
  ongoing: {
    symbol: '|',
    color: 'text-status-ongoing', // Orange
    label: 'Ongoing',
  },
  'not-done': {
    symbol: '✗',
    color: 'text-status-notDone', // Red
    label: 'Not Done',
  },
};

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function StatusIndicator({
  status,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const defaultAriaLabel = ariaLabel || config.label;

  return (
    <span
      className={`${config.color} ${sizeStyles[size]} font-semibold ${className}`}
      role="img"
      aria-label={defaultAriaLabel}
      title={config.label}
    >
      {config.symbol}
    </span>
  );
}

/**
 * Status Indicator Legend Component
 *
 * Displays a legend explaining all status indicators.
 * Should be placed at the bottom of the dashboard per PRD requirements.
 *
 * @example
 * ```tsx
 * <StatusIndicatorLegend />
 * ```
 */
export function StatusIndicatorLegend() {
  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Legend</h3>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <StatusIndicator status="team-focus" />
          <span>Team Focus</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIndicator status="done" />
          <span>Done</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIndicator status="ongoing" />
          <span>Ongoing</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIndicator status="not-done" />
          <span>Not Done</span>
        </div>
      </div>
    </div>
  );
}

