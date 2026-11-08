import type React from 'react';

import { FormField } from '@/components/molecule/FormField';
import { Slider as SliderPrimitive } from '@/components/ui/slider';
import type { FieldBaseProps } from '@/lib/types';

export interface SliderProps extends FieldBaseProps {
  value: number;
  onChange: (value: number) => void;
  /** Fires when a drag ends, e.g. to save. */
  onCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

// The primitive draws one thumb per array entry, so a single value still travels as an array.
const single = (value: number | readonly number[]) =>
  typeof value === 'number' ? value : (value[0] ?? 0);

export const Slider: React.FC<SliderProps> = props => {
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
    onCommit,
    min = 0,
    max = 100,
    step = 1,
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
        <SliderPrimitive
          id={control.id}
          aria-labelledby={control.labelId}
          aria-describedby={control['aria-describedby']}
          disabled={control.disabled}
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={next => onChange(single(next))}
          onValueCommitted={next => onCommit?.(single(next))}
        />
      )}
    </FormField>
  );
};
