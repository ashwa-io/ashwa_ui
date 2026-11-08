import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import { Switch as SwitchPrimitive } from '@/components/ui/switch';
import type { FieldBaseProps } from '@/lib/types';

export interface SwitchProps extends FieldBaseProps {
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur?: () => void;
  name?: string;
  readOnly?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Switch: React.FC<SwitchProps> = props => {
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
        <SwitchPrimitive
          ref={ref}
          id={control.id}
          aria-describedby={control['aria-describedby']}
          aria-invalid={control['aria-invalid']}
          aria-required={control['aria-required']}
          disabled={control.disabled}
          checked={value}
          onCheckedChange={checked => onChange(checked)}
          onBlur={onBlur}
          name={name}
          readOnly={readOnly}
        />
      )}
    </FormField>
  );
};
