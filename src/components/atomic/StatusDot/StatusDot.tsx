import type React from 'react';

import type { Tone } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface StatusDotProps {
  tone?: Tone;
  /** Accessible name. */
  label: string;
  'data-testid'?: string;
}

const TONE: Record<Tone, string> = {
  neutral: 'bg-muted-foreground',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  info: 'bg-info',
};

export const StatusDot: React.FC<StatusDotProps> = props => {
  const { tone = 'neutral', label, 'data-testid': testId } = props;

  return (
    <span
      role="img"
      aria-label={label}
      data-testid={testId}
      className={cn('inline-block size-2 shrink-0 rounded-full', TONE[tone])}
    />
  );
};
