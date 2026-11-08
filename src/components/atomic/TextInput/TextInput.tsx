import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import { Input } from '@/components/ui/input';
import { InputGroupInput } from '@/components/ui/input-group';
import type { FieldBaseProps, IconComponent } from '@/lib/types';
import { cn } from '@/lib/utils';

import { InputAddons } from './InputAddons';
import type { InputAddonProps } from './InputAddons';

export type TextInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';

export interface TextInputProps extends FieldBaseProps, InputAddonProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  type?: TextInputType;
  /** Leading icon, decorative (aria-hidden). */
  icon?: IconComponent;
  /** e.g. an IconButton to clear or copy. */
  endAction?: React.ReactNode;
  readOnly?: boolean;
  /** e.g. 'username', 'current-password' on login forms. */
  autoComplete?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export const TextInput: React.FC<TextInputProps> = props => {
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
    type = 'text',
    icon: Icon,
    startText,
    endText,
    endAction,
    readOnly = false,
    autoComplete,
    ref,
  } = props;
  // By key, not value: a clear button that appears while typing must not remount the input.
  const grouped = 'startText' in props || 'endText' in props || 'endAction' in props;
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
        const input = (
          <Control
            ref={ref}
            id={control.id}
            aria-describedby={control['aria-describedby']}
            aria-invalid={control['aria-invalid']}
            aria-required={control['aria-required']}
            disabled={control.disabled}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            readOnly={readOnly}
            autoComplete={autoComplete}
            onChange={event => onChange(event.target.value)}
            onBlur={onBlur}
            className={cn(!grouped && Icon && 'pl-8')}
          />
        );

        return grouped ? (
          <InputAddons icon={Icon} startText={startText} endText={endText} endAction={endAction}>
            {input}
          </InputAddons>
        ) : (
          <div className="relative">
            {Icon && (
              <Icon
                aria-hidden
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
              />
            )}
            {input}
          </div>
        );
      }}
    </FormField>
  );
};
