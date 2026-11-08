import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import { Textarea } from '@/components/ui/textarea';
import type { FieldBaseProps } from '@/lib/types';

export interface TextAreaProps extends FieldBaseProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  readOnly?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const TextArea: React.FC<TextAreaProps> = props => {
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
    rows = 3,
    maxLength,
    readOnly = false,
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
        <Textarea
          ref={ref}
          id={control.id}
          aria-describedby={control['aria-describedby']}
          aria-invalid={control['aria-invalid']}
          aria-required={control['aria-required']}
          disabled={control.disabled}
          name={name}
          value={value}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          readOnly={readOnly}
          onChange={event => onChange(event.target.value)}
          onBlur={onBlur}
        />
      )}
    </FormField>
  );
};
