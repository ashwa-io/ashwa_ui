import type React from 'react';

import { CARD_BUTTON, PADDING } from '@/components/atomic/Card/cardLook';
import type { CardPadding } from '@/components/atomic/Card/cardLook';
import { cn } from '@/lib/utils';

export interface SelectableCardProps {
  /** Accessible name; must include the card's visible text. */
  label: string;
  selected: boolean;
  onChange: (selected: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
  padding?: CardPadding;
  'data-testid'?: string;
}

export const SelectableCard: React.FC<SelectableCardProps> = props => {
  const {
    label,
    selected,
    onChange,
    children,
    disabled = false,
    padding = 'md',
    'data-testid': testId,
  } = props;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      disabled={disabled}
      data-testid={testId}
      onClick={() => onChange(!selected)}
      className={cn(
        CARD_BUTTON,
        PADDING[padding],
        // The darker border carries the state: secondary alone is too close to the card.
        selected &&
          'bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground border-foreground/60',
        'disabled:pointer-events-none disabled:opacity-50'
      )}
    >
      {children}
    </button>
  );
};
