import type React from 'react';

import { cn } from '@/lib/utils';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  children: React.ReactNode;
  /** Renders h1–h6; the visual size follows the level. */
  level: HeadingLevel;
  /** One line with an ellipsis; the parent must constrain the width. */
  truncate?: boolean;
  id?: string;
  'data-testid'?: string;
}

const ELEMENT = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const satisfies Record<HeadingLevel, string>;

const SIZE: Record<HeadingLevel, string> = {
  1: 'text-2xl tracking-tight',
  2: 'text-xl tracking-tight',
  3: 'text-lg',
  4: 'text-base',
  5: 'text-sm',
  6: 'text-xs',
};

export const Heading: React.FC<HeadingProps> = props => {
  const { children, level, truncate = false, id, 'data-testid': testId } = props;
  const Element = ELEMENT[level];

  return (
    <Element
      id={id}
      data-testid={testId}
      className={cn(
        'font-heading text-foreground font-semibold',
        SIZE[level],
        truncate && 'truncate'
      )}
    >
      {children}
    </Element>
  );
};
