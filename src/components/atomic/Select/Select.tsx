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
          value={value}
          onValueChange={next => {
            if (next !== null) onChange(next);
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
            onBlur={onBlur}
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
