import { useEffect, useRef } from 'react';
import type React from 'react';

import { format } from 'date-fns';

import { Calendar as CalendarPrimitive, CalendarDayButton } from '@/components/ui/calendar';

import { parseDateString, toDateString } from './dateString';

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

// shortcut: shadcn's day button never attaches its ref, so arrow keys can't move focus. Remove this
// and the components prop below once the registry's calendar passes ref to its Button.
const FocusableDayButton = (
  props: React.ComponentProps<typeof CalendarDayButton>
): React.JSX.Element => {
  const { focused } = props.modifiers;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focused) ref.current?.focus();
  }, [focused]);

  // eslint-disable-next-line no-restricted-syntax -- internal adapter: forwards the day picker's handlers.
  return <CalendarDayButton {...props} {...{ ref }} />;
};

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
      components={{ DayButton: FocusableDayButton }}
      data-testid={testId}
      className="**:data-[selected-single=true]:bg-brand-tint **:data-[selected-single=true]:text-brand-tint-foreground"
    />
  );
};
