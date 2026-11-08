import type React from 'react';

import { cn } from '@/lib/utils';

export type TimestampFormat = 'date' | 'time' | 'date_time';

export interface TimestampProps {
  value: string | number | Date;
  format?: TimestampFormat;
  size?: 'sm' | 'md';
  'data-testid'?: string;
}

const DAY = { day: 'numeric', month: 'short', year: 'numeric' } as const;
const CLOCK = { hour: 'numeric', minute: '2-digit' } as const;

const FORMATTER: Record<TimestampFormat, Intl.DateTimeFormat> = {
  date: new Intl.DateTimeFormat(undefined, DAY),
  time: new Intl.DateTimeFormat(undefined, CLOCK),
  date_time: new Intl.DateTimeFormat(undefined, { ...DAY, ...CLOCK }),
};

const SIZE = { sm: 'text-xs', md: 'text-sm' } as const;

export const Timestamp: React.FC<TimestampProps> = props => {
  const { value, format = 'date_time', size = 'md', 'data-testid': testId } = props;
  const date = new Date(value);
  // Intl throws on an invalid date, and bad API data must not take the page down.
  const valid = !Number.isNaN(date.getTime());

  return (
    <time
      dateTime={valid ? date.toISOString() : undefined}
      data-testid={testId}
      className={cn(SIZE[size])}
    >
      {valid ? FORMATTER[format].format(date) : '—'}
    </time>
  );
};
