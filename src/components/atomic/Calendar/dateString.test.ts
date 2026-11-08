import { describe, expect, it } from 'vitest';

import { parseDateString, toDateString } from './dateString';

describe('dateString', () => {
  it('round-trips a calendar day', () => {
    expect(toDateString(parseDateString('2026-03-31')!)).toBe('2026-03-31');
  });

  it('reads the string as a local day, so no timezone can shift it', () => {
    const date = parseDateString('2026-01-01')!;
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 0, 1]);
  });

  it.each(['2026-02-30', '2026-13-01', 'nope', '', null, undefined])('%j is not a date', value => {
    expect(parseDateString(value)).toBeUndefined();
  });
});
