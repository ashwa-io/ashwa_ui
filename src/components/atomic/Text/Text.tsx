import type React from 'react';

import type { Tone } from '@/lib/types';
import { cn } from '@/lib/utils';

import { OverflowTooltip } from './OverflowTooltip';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextTone = Tone | 'muted';
export type TextWeight = 'normal' | 'medium' | 'semibold';

export interface TextProps {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div';
  /** Leave unset to inherit the parent's size (the page default is md). */
  size?: TextSize;
  /** Leave unset to inherit the parent's colour. */
  tone?: TextTone;
  /** Leave unset to inherit the parent's weight. */
  weight?: TextWeight;
  /**
   * One line with an ellipsis; the parent must constrain the width. When the text is cut off,
   * hovering it shows the full text in a tooltip.
   */
  truncate?: boolean;
  id?: string;
  'data-testid'?: string;
}

const SIZE: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

// Text colours that reach 4.5:1 on background and card (tokens test); never the 3:1 brand fill.
const TONE: Record<TextTone, string> = {
  neutral: 'text-foreground',
  muted: 'text-muted-foreground',
  brand: 'text-brand-text',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
  info: 'text-info',
};

const WEIGHT: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
};

export const Text: React.FC<TextProps> = props => {
  const {
    children,
    as: Element = 'p',
    size,
    tone,
    weight,
    truncate = false,
    id,
    'data-testid': testId,
  } = props;

  const className = cn(
    size && SIZE[size],
    tone && TONE[tone],
    weight && WEIGHT[weight],
    truncate && 'block truncate'
  );

  return truncate ? (
    <OverflowTooltip id={id} element={<Element data-testid={testId} className={className} />}>
      {children}
    </OverflowTooltip>
  ) : (
    <Element id={id} data-testid={testId} className={className}>
      {children}
    </Element>
  );
};
