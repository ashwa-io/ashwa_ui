import type React from 'react';

import { Spinner as SpinnerPrimitive } from '@/components/ui/spinner';
import type { Size } from '@/lib/types';

export interface SpinnerProps {
  size?: Size;
  /** Accessible name announced by screen readers. */
  label?: string;
  id?: string;
  'data-testid'?: string;
}

const SIZE: Record<Size, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-8',
};

export const Spinner: React.FC<SpinnerProps> = props => {
  const { size = 'md', label = 'Loading', id, 'data-testid': testId } = props;

  return (
    <SpinnerPrimitive id={id} data-testid={testId} aria-label={label} className={SIZE[size]} />
  );
};
