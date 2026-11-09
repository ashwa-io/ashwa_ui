import type React from 'react';

import { format } from 'date-fns';

import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';

import { parseDateString, toDateString } from './dateString';
import { STABLE_PARTS } from './stableParts';

export interface CalendarProps {
  /** 'YYYY-MM-DD'. */
  value: string | null;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  'data-testid'?: string;
}

// The visible number has to be a word in the name; the default says "November 8th".
const labelDayButton = (date: Date, modifiers: { today?: boolean; selected?: boolean }) =>
  [format(date, 'd MMMM yyyy'), modifiers.today && 'today', modifiers.selected && 'selected']
    .filter(Boolean)
    .join(', ');

export const Calendar: React.FC<CalendarProps> = props => {
  const { value, onChange, min, max, 'data-testid': testId } = props;
  const selected = parseDateString(value);
  const before = parseDateString(min);
  const after = parseDateString(max);

  return (
    <CalendarPrimitive
      mode="single"
      // required: clicking the selected day keeps it instead of clearing it.
      required
      selected={selected}
      defaultMonth={selected}
      onSelect={date => onChange(toDateString(date))}
      disabled={[...(before ? [{ before }] : []), ...(after ? [{ after }] : [])]}
      labels={{ labelDayButton }}
      components={STABLE_PARTS}
      data-testid={testId}
    />
  );
};
