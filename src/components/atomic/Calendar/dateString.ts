import { format, isValid, parse } from 'date-fns';

const FORMAT = 'yyyy-MM-dd';

/** Reads 'YYYY-MM-DD' as a local calendar day, so no timezone can move it to another date. */
export const parseDateString = (value: string | null | undefined): Date | undefined => {
  if (!value) return undefined;
  const date = parse(value, FORMAT, new Date());
  return isValid(date) ? date : undefined;
};

export const toDateString = (date: Date): string => format(date, FORMAT);
