import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import { Checkbox as CheckboxPrimitive } from '@/components/ui/checkbox';
import type { FieldBaseProps } from '@/lib/types';

export interface CheckboxProps extends FieldBaseProps {
  value: boolean;
  /** Some of a list is picked: shows a dash. Clicking still calls onChange. */
  indeterminate?: boolean;
  onChange: (value: boolean) => void;
  onBlur?: () => void;
  name?: string;
  readOnly?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Checkbox: React.FC<CheckboxProps> = props => {
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
    indeterminate = false,
    onChange,
    onBlur,
    name,
    readOnly = false,
    ref,
  } = props;

  return (
    <FormField
      orientation="horizontal"
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
        <CheckboxPrimitive
          ref={ref}
          id={control.id}
          aria-describedby={control['aria-describedby']}
          aria-invalid={control['aria-invalid']}
          aria-required={control['aria-required']}
          disabled={control.disabled}
          checked={value}
          indeterminate={indeterminate}
          onCheckedChange={checked => onChange(checked)}
          onBlur={onBlur}
          name={name}
          readOnly={readOnly}
          // The tick takes the box's colour, so a fading box would start the tick black.
          className="checkbox-partial transition-none"
        />
      )}
    </FormField>
  );
};
