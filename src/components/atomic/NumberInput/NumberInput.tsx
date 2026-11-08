import type React from 'react';

import { InputAddons } from '@/components/atomic/TextInput/InputAddons';
import type { InputAddonProps } from '@/components/atomic/TextInput/InputAddons';
import { FormField } from '@/components/molecule/FormField';
import { Input } from '@/components/ui/input';
import { InputGroupInput } from '@/components/ui/input-group';
import type { FieldBaseProps } from '@/lib/types';

export interface NumberInputProps extends FieldBaseProps, InputAddonProps {
  value: number | null;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | 'any';
  ref?: React.Ref<HTMLInputElement>;
}

export const NumberInput: React.FC<NumberInputProps> = props => {
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
    name,
    placeholder,
    min,
    max,
    step = 'any',
    startText,
    endText,
    ref,
  } = props;
  const grouped = Boolean(startText || endText);
  const Control = grouped ? InputGroupInput : Input;

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
      {control => {
        // Native type="number": the platform gives steppers and keyboard, and React leaves
        // half-typed values such as "1." or "-" alone.
        const input = (
          <Control
            ref={ref}
            id={control.id}
            aria-describedby={control['aria-describedby']}
            aria-invalid={control['aria-invalid']}
            aria-required={control['aria-required']}
            disabled={control.disabled}
            type="number"
            name={name}
            value={value ?? ''}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            onChange={event => {
              const next = event.target.valueAsNumber;
              onChange(Number.isNaN(next) ? null : next);
            }}
            onBlur={onBlur}
          />
        );

        return grouped ? (
          <InputAddons startText={startText} endText={endText}>
            {input}
          </InputAddons>
        ) : (
          input
        );
      }}
    </FormField>
  );
};
