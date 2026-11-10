import { format, isValid, parse } from 'date-fns';

const FORMAT = 'yyyy-MM-dd';

/** Reads 'YYYY-MM-DD' as a local calendar day, so no timezone can move it to another date. */
export const parseDateString = (value: string | null | undefined): Date | undefined => {
  if (!value) return undefined;
  const date = parse(value, FORMAT, new Date());
  return isValid(date) ? date : undefined;
};

export const toDateString = (date: Date): string => format(date, FORMAT);

// The visible number has to be a word in the name; the default says "November 8th".
export const labelDayButton = (date: Date, modifiers: { today?: boolean; selected?: boolean }) =>
  [format(date, 'd MMMM yyyy'), modifiers.today && 'today', modifiers.selected && 'selected']
    .filter(Boolean)
    .join(', ');
