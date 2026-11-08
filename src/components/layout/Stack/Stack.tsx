import type React from 'react';

import { cn } from '@/lib/utils';

export type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between';

export interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  /** Tailwind spacing step (1 = 4px). */
  gap?: StackGap;
  /** Cross axis. */
  align?: StackAlign;
  /** Main axis. */
  justify?: StackJustify;
  wrap?: boolean;
  id?: string;
  'data-testid'?: string;
}

export type HStackProps = Omit<StackProps, 'direction'>;
export type VStackProps = Omit<StackProps, 'direction'>;

const GAP: Record<StackGap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
};

const ALIGN: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export const Stack: React.FC<StackProps> = props => {
  const {
    children,
    direction = 'column',
    gap = 0,
    align,
    justify,
    wrap = false,
    id,
    'data-testid': testId,
  } = props;

  return (
    <div
      id={id}
      data-testid={testId}
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        GAP[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        wrap && 'flex-wrap'
      )}
    >
      {children}
    </div>
  );
};

export const HStack: React.FC<HStackProps> = props => {
  const { children, gap, align, justify, wrap, id, 'data-testid': testId } = props;

  return (
    <Stack
      direction="row"
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      id={id}
      data-testid={testId}
    >
      {children}
    </Stack>
  );
};

export const VStack: React.FC<VStackProps> = props => {
  const { children, gap, align, justify, wrap, id, 'data-testid': testId } = props;

  return (
    <Stack
      direction="column"
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      id={id}
      data-testid={testId}
    >
      {children}
    </Stack>
  );
};
