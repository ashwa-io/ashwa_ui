import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FieldBaseProps } from '@/lib/types';

// Base UI close reasons that mean focus left the field (not a pick or Escape back to the trigger).
const LEFT_FIELD_REASONS = new Set(['outside-press', 'focus-out']);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends FieldBaseProps {
  options: SelectOption[];
  /** null = nothing picked; the placeholder shows. */
  value: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Select: React.FC<SelectProps> = props => {
  const {
    label,
    hideLabel,
    description,
    error,
    required,
    disabled,
    id,
    'data-testid': testId,
    options,
    value,
    onChange,
    onBlur,
    name,
    placeholder,
    ref,
  } = props;

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
        // items lets the trigger show an option's label instead of its value.
        <SelectRoot
          items={options}
          // Base UI prints a value it has no item for; the placeholder is what the user should see.
          value={options.some(option => option.value === value) ? value : null}
          onValueChange={next => {
            if (next !== null) onChange(next);
          }}
          // Focus that leaves from the open list is the field's blur (react-hook-form onBlur).
          onOpenChange={(open, details) => {
            if (!open && LEFT_FIELD_REASONS.has(details.reason)) onBlur?.();
          }}
          name={name}
          disabled={control.disabled}
        >
          <SelectTrigger
            ref={ref}
            id={control.id}
            aria-describedby={control['aria-describedby']}
            aria-invalid={control['aria-invalid']}
            aria-required={control['aria-required']}
            // Opening the list moves focus into it; that is not a blur of the field.
            onBlur={event => {
              if (!event.relatedTarget?.closest('[data-slot="select-content"]')) onBlur?.();
            }}
            className="w-full"
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      )}
    </FormField>
  );
};
