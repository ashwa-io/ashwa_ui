import { endOfMonth, startOfMonth, subDays, subMonths } from 'date-fns';

import { parseDateString, toDateString } from '@/components/atomic/Calendar/dateString';

/** Both ends are 'YYYY-MM-DD' calendar days, inclusive. */
export interface DateRangeValue {
  from: string | null;
  to: string | null;
}

export interface DateRangePreset {
  label: string;
  /** Called on every render, so it follows the clock. */
  range: () => { from: string; to: string };
}

const localToday = () => toDateString(new Date());

/**
 * The default presets, counted from `today` ('YYYY-MM-DD'). Pass a provider when the app's day
 * is not the browser's, e.g. an IST today for users abroad.
 */
export const dateRangePresets = (today: () => string = localToday): DateRangePreset[] => {
  const preset = (label: string, range: (day: Date) => [Date, Date]): DateRangePreset => ({
    label,
    range: () => {
      const [from, to] = range(parseDateString(today()) ?? new Date());
      return { from: toDateString(from), to: toDateString(to) };
    },
  });

  return [
    preset('Today', day => [day, day]),
    preset('Yesterday', day => [subDays(day, 1), subDays(day, 1)]),
    // Counts today, so 7 days are shown.
    preset('Last 7 days', day => [subDays(day, 6), day]),
    preset('Last 30 days', day => [subDays(day, 29), day]),
    preset('This month', day => [startOfMonth(day), day]),
    preset('Last month', day => [startOfMonth(subMonths(day, 1)), endOfMonth(subMonths(day, 1))]),
  ];
};

export const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = dateRangePresets();
