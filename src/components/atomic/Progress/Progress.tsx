import type React from 'react';

import {
  Progress as ProgressPrimitive,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  /** Accessible name; always required, even when hidden. */
  label: string;
  hideLabel?: boolean;
  /** 0-100. Omit or null while the amount is unknown (indeterminate). */
  value?: number | null;
  'data-testid'?: string;
}

export const Progress: React.FC<ProgressProps> = props => {
  const { label, hideLabel = false, value = null, 'data-testid': testId } = props;
  const clamped = value === null ? null : Math.min(100, Math.max(0, value));

  return (
    <ProgressPrimitive
      value={clamped}
      data-testid={testId}
      // The primitive owns the indicator, and gives an unknown amount no width of its own.
      className="[&_[data-slot=progress-indicator][data-indeterminate]]:w-full [&_[data-slot=progress-indicator][data-indeterminate]]:animate-pulse"
    >
      <ProgressLabel className={cn(hideLabel && 'sr-only')}>{label}</ProgressLabel>
      {!hideLabel && clamped !== null && <ProgressValue />}
    </ProgressPrimitive>
  );
};
