export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export const PADDING: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/** A card that is one button. */
export const CARD_BUTTON =
  'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:outline-ring flex w-full flex-col gap-4 overflow-hidden rounded-xl border text-left text-sm shadow-sm transition-colors focus-visible:ring-3 focus-visible:outline-1';
