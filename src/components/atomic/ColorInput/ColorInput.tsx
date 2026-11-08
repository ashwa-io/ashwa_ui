import { useState } from 'react';
import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import { Input } from '@/components/ui/input';
import type { FieldBaseProps } from '@/lib/types';

import { normalizeHex } from './colorHex';

export interface ColorInputProps extends FieldBaseProps {
  /** 6-digit hex, e.g. '#1a73e8' (orgs.primaryColor). */
  value: string;
  /** Always called with a normalized 6-digit lowercase hex. */
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
  // The text field keeps what the user is typing; only complete hex values reach onChange.
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const handleDraft = (next: string) => {
    setDraft(next);
    const hex = normalizeHex(next);
    if (hex) onChange(hex);
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
        <div className="flex items-center gap-2">
          <input
            type="color"
            aria-label={`${label} picker`}
            value={normalizeHex(value) ?? '#000000'}
            disabled={control.disabled}
            onChange={event => handleDraft(event.target.value)}
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
            value={draft}
            spellCheck={false}
            autoComplete="off"
            onChange={event => handleDraft(event.target.value)}
            onBlur={() => {
              if (!normalizeHex(draft)) setDraft(value);
              onBlur?.();
            }}
          />
        </div>
      )}
    </FormField>
  );
};
