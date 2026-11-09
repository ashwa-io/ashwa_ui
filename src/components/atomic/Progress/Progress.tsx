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
    <ProgressPrimitive value={clamped} data-testid={testId} className="progress-indeterminate">
      <ProgressLabel className={cn(hideLabel && 'sr-only')}>{label}</ProgressLabel>
      {!hideLabel && clamped !== null && <ProgressValue />}
    </ProgressPrimitive>
  );
};
