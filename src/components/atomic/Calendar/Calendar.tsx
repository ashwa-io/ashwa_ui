import type React from 'react';

import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';

import { labelDayButton, parseDateString, toDateString } from './dateString';
import { STABLE_PARTS } from './stableParts';

export interface CalendarProps {
  /** 'YYYY-MM-DD'. */
  value: string | null;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  'data-testid'?: string;
}

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
