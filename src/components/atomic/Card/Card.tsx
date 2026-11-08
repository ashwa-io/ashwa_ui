import type React from 'react';

import { Card as CardPrimitive } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { CARD_BUTTON, PADDING } from './cardLook';
import type { CardPadding } from './cardLook';

export type { CardPadding };

export interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  /** Makes the whole card one button. Any aria-label must include the card's visible text. */
  onClick?: () => void;
  'aria-label'?: string;
  'data-testid'?: string;
}

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
        className={cn(CARD_BUTTON, PADDING[padding])}
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
