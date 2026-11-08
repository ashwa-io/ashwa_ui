import { useId, useState } from 'react';
import type React from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/atomic/Calendar';
import { parseDateString } from '@/components/atomic/Calendar/dateString';
import { FormField } from '@/components/molecule/FormField';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { FieldBaseProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface DateInputProps extends FieldBaseProps {
  /** 'YYYY-MM-DD'. */
  value: string | null;
  onChange: (value: string | null) => void;
  onBlur?: () => void;
  min?: string;
  max?: string;
  placeholder?: string;
  size?: 'sm' | 'md';
}

const SIZE = { sm: 'sm', md: 'default' } as const;

export const DateInput: React.FC<DateInputProps> = props => {
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
    min,
    max,
    placeholder = 'Pick a date',
    size = 'md',
  } = props;
  const [open, setOpen] = useState(false);
  const valueId = useId();
  const selected = parseDateString(value);

  const pick = (next: string | null) => {
    onChange(next);
    setOpen(false);
    onBlur?.();
  };

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
            <span id={valueId} className={cn(!selected && 'text-muted-foreground')}>
              {selected ? format(selected, 'd MMM yyyy') : placeholder}
            </span>
          </PopoverTrigger>
          <PopoverContent aria-label={label} align="start" className="w-auto gap-0 p-0">
            <Calendar value={value} onChange={pick} min={min} max={max} />
            {!required && selected && (
              <div className="border-t p-1">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => pick(null)}>
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      )}
    </FormField>
  );
};
