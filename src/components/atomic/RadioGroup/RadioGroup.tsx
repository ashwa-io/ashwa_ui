import { useId } from 'react';
import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import { RadioGroup as RadioGroupPrimitive, RadioGroupItem } from '@/components/ui/radio-group';
import type { FieldBaseProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends FieldBaseProps {
  value: string | null;
  onChange: (value: string) => void;
  options: RadioOption[];
  orientation?: 'vertical' | 'horizontal';
}

const RadioRow: React.FC<{ option: RadioOption }> = props => {
  const { option } = props;
  const descriptionId = useId();

  return (
    <label
      className={cn(
        'flex items-start gap-2 text-sm',
        option.disabled ? 'text-muted-foreground' : 'cursor-pointer'
      )}
    >
      <RadioGroupItem
        value={option.value}
        disabled={option.disabled}
        aria-describedby={option.description ? descriptionId : undefined}
        className="mt-0.5"
      />
      <span className="grid gap-0.5">
        {option.label}
        {option.description && (
          <span id={descriptionId} className="text-muted-foreground text-xs">
            {option.description}
          </span>
        )}
      </span>
    </label>
  );
};

export const RadioGroup: React.FC<RadioGroupProps> = props => {
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
    options,
    orientation = 'vertical',
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
        <RadioGroupPrimitive
          id={control.id}
          aria-labelledby={control.labelId}
          aria-describedby={control['aria-describedby']}
          aria-invalid={control['aria-invalid']}
          aria-required={control['aria-required']}
          disabled={control.disabled}
          value={value}
          onValueChange={next => onChange(next as string)}
          className={cn(orientation === 'horizontal' && 'flex flex-wrap gap-x-4')}
        >
          {options.map(option => (
            <RadioRow key={option.value} option={option} />
          ))}
        </RadioGroupPrimitive>
      )}
    </FormField>
  );
};
