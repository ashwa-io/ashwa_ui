import type React from 'react';

import { cn } from '@/lib/utils';

export interface MetadataListProps {
  children: React.ReactNode;
  /** Columns from sm up; always one column on phones. */
  columns?: 1 | 2 | 3;
  'data-testid'?: string;
}

const COLUMNS: Record<NonNullable<MetadataListProps['columns']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
};

export const MetadataList: React.FC<MetadataListProps> = props => {
  const { children, columns = 1, 'data-testid': testId } = props;

  return (
    <dl data-testid={testId} className={cn('grid gap-4', COLUMNS[columns])}>
      {children}
    </dl>
  );
};

export interface MetadataListItemProps {
  label: string;
  /** Empty values show an em dash; 0 is a value. */
  children?: React.ReactNode;
  'data-testid'?: string;
}

export const MetadataListItem: React.FC<MetadataListItemProps> = props => {
  const { label, children, 'data-testid': testId } = props;
  const empty = children === undefined || children === null || children === '';

  return (
    <div data-testid={testId} className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-sm break-words">{empty ? '—' : children}</dd>
    </div>
  );
};
