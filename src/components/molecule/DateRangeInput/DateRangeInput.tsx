import { useId, useState } from 'react';
import type React from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import {
  labelDayButton,
  parseDateString,
  toDateString,
} from '@/components/atomic/Calendar/dateString';
import { STABLE_PARTS } from '@/components/atomic/Calendar/stableParts';
import { PRESSED_CLASS } from '@/components/atomic/Toggle/toggleLook';
import { FormField } from '@/components/molecule/FormField';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { FieldBaseProps, OverlayAlign } from '@/lib/types';
import { cn } from '@/lib/utils';

import { DEFAULT_DATE_RANGE_PRESETS } from './dateRangePresets';
import type { DateRangePreset, DateRangeValue } from './dateRangePresets';

export interface DateRangeInputProps extends FieldBaseProps {
  /** Both ends 'YYYY-MM-DD', inclusive. A picked range always has both; one day has from = to. */
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  onBlur?: () => void;
  /** Shortcuts beside the calendar; pass [] for none. */
  presets?: DateRangePreset[];
  min?: string;
  max?: string;
  placeholder?: string;
  size?: 'sm' | 'md';
  /** false: no Clear action, for a range that must stay set once picked. */
  clearable?: boolean;
  align?: OverlayAlign;
  numberOfMonths?: 1 | 2;
}

interface Draft {
  from?: Date;
  to?: Date;
}

const SIZE = { sm: 'sm', md: 'default' } as const;

const show = (date: Date) => format(date, 'd MMM yyyy');

export const DateRangeInput: React.FC<DateRangeInputProps> = props => {
  const {
    label,
    hideLabel,
    description,
    error,
    required,
    disabled,
    id,
    'data-testid': testId,
    value,
    onChange,
    onBlur,
    presets = DEFAULT_DATE_RANGE_PRESETS,
    min,
    max,
    placeholder = 'Pick a date range',
    size = 'md',
    clearable = true,
    align = 'start',
    numberOfMonths = 2,
  } = props;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>();
  const valueId = useId();
  const from = parseDateString(value.from);
  // A lone or backwards end reads as one day rather than as nothing.
  const end = parseDateString(value.to);
  const to = from && end && end >= from ? end : from;
  const before = parseDateString(min);
  const after = parseDateString(max);

  const commit = (next: DateRangeValue) => {
    onChange(next);
    setOpen(false);
    onBlur?.();
  };

  const draftFrom = draft?.from && toDateString(draft.from);
  const draftTo = draft?.from && toDateString(draft.to ?? draft.from);
  const ranges = presets.map(preset => ({ label: preset.label, range: preset.range() }));
  const active = ranges.find(({ range }) => range.from === draftFrom && range.to === draftTo);

  return (
    <FormField
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      id={id}
      data-testid={testId}
    >
      {control => (
        <Popover
          open={open}
          onOpenChange={next => {
            // Every opening starts from the value: an unapplied selection is dropped on close.
            if (next) setDraft({ from, to });
            setOpen(next);
            if (!next) onBlur?.();
          }}
        >
          <PopoverTrigger
            render={
              <Button
                id={control.id}
                // The field's name and its value together, as a screen reader should say them.
                aria-labelledby={`${control.labelId} ${valueId}`}
                aria-describedby={control['aria-describedby']}
                aria-invalid={control['aria-invalid']}
                disabled={control.disabled}
                variant="outline"
                size={SIZE[size]}
                className="w-full justify-start font-normal"
              />
            }
          >
            <CalendarIcon aria-hidden data-icon="inline-start" />
            <span id={valueId} className={cn('truncate', !from && 'text-muted-foreground')}>
              {from && to ? `${show(from)} – ${show(to)}` : placeholder}
              {/* The label's asterisk is hidden from screen readers, and buttons can't be aria-required. */}
              {required && <span className="sr-only">, required</span>}
            </span>
          </PopoverTrigger>
          <PopoverContent
            aria-label={label}
            align={align}
            className="max-h-(--available-height) w-auto max-w-(--available-width) gap-0 overflow-y-auto p-0 sm:flex-row"
          >
            {ranges.length > 0 && (
              <div
                role="group"
                aria-label="Presets"
                className="flex flex-wrap gap-1 border-b p-2 sm:w-36 sm:flex-col sm:flex-nowrap sm:border-r sm:border-b-0"
              >
                {ranges.map(({ label: name, range }) => (
                  <Button
                    key={name}
                    variant="ghost"
                    size="sm"
                    aria-pressed={name === active?.label}
                    disabled={(!!min && range.from < min) || (!!max && range.to > max)}
                    className={cn('justify-start font-normal', PRESSED_CLASS)}
                    onClick={() => commit(range)}
                  >
                    {name}
                  </Button>
                ))}
                {draftFrom && !active && (
                  // Not a button: it only says the dates match no preset.
                  <span
                    aria-current="true"
                    className="bg-secondary text-secondary-foreground flex h-7 items-center rounded-md px-2.5 text-[0.8rem]"
                  >
                    Custom
                  </span>
                )}
              </div>
            )}
            <div className="flex flex-col">
              <Calendar
                mode="range"
                numberOfMonths={numberOfMonths}
                selected={draft?.from ? { from: draft.from, to: draft.to } : undefined}
                onSelect={setDraft}
                defaultMonth={from}
                disabled={[...(before ? [{ before }] : []), ...(after ? [{ after }] : [])]}
                labels={{ labelDayButton }}
                components={STABLE_PARTS}
              />
              <div className="flex items-center justify-between gap-3 border-t px-3 py-2">
                <p className="text-muted-foreground max-w-64 text-xs">
                  Select a start and end date. For one day, select a date and apply.
                </p>
                <div className="flex gap-1">
                  {clearable && !required && from && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => commit({ from: null, to: null })}
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={!draftFrom}
                    onClick={() => draftFrom && draftTo && commit({ from: draftFrom, to: draftTo })}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </FormField>
  );
};
