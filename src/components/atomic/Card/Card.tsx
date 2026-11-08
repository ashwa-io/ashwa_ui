import type React from 'react';

import { Card as CardPrimitive } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  /** Makes the whole card one button. Any aria-label must include the card's visible text. */
  onClick?: () => void;
  'aria-label'?: string;
  'data-testid'?: string;
}

const PADDING: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = props => {
  const {
    children,
    padding = 'md',
    onClick,
    'aria-label': ariaLabel,
    'data-testid': testId,
  } = props;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        data-testid={testId}
        className={cn(
          'bg-card text-card-foreground ring-foreground/10 hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:outline-ring flex w-full flex-col gap-4 overflow-hidden rounded-xl text-left text-sm ring-1 transition-colors focus-visible:ring-3 focus-visible:outline-1',
          PADDING[padding]
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <CardPrimitive
      aria-label={ariaLabel}
      data-testid={testId}
      // overflow-clip, not hidden: hidden would make the card the scroll container for sticky content.
      className={cn('overflow-clip [--surface:var(--card)]', PADDING[padding])}
    >
      {children}
    </CardPrimitive>
  );
};
