import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import { Input } from '@/components/ui/input';
import type { FieldBaseProps } from '@/lib/types';

import { normalizeHex } from './colorHex';

export interface ColorInputProps extends FieldBaseProps {
  /** 6-digit hex, e.g. '#1a73e8' (orgs.primaryColor), or the text being typed. */
  value: string;
  /**
   * A valid 6-digit hex arrives normalized ('#1a73e8'); anything else arrives as typed, so the
   * form's validation can flag it (e.g. `validate: v => /^#[0-9a-f]{6}$/.test(v) || '…'`).
   */
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export const ColorInput: React.FC<ColorInputProps> = props => {
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
    ref,
  } = props;
  const handleText = (next: string) => onChange(normalizeHex(next) ?? next);

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
        <div className="flex items-center gap-2">
          <input
            type="color"
            aria-label={`${label} picker`}
            // A colour input cannot be empty; white reads as unset, black read as a choice.
            value={normalizeHex(value) ?? '#ffffff'}
            disabled={control.disabled}
            onChange={event => handleText(event.target.value)}
            className="border-input h-8 w-10 shrink-0 cursor-pointer rounded-lg border bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Input
            ref={ref}
            id={control.id}
            aria-describedby={control['aria-describedby']}
            aria-invalid={control['aria-invalid']}
            aria-required={control['aria-required']}
            disabled={control.disabled}
            name={name}
            value={value}
            spellCheck={false}
            autoComplete="off"
            onChange={event => handleText(event.target.value)}
            onBlur={onBlur}
          />
        </div>
      )}
    </FormField>
  );
};
