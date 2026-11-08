import { useId } from 'react';
import type React from 'react';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import type { FieldBaseProps } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Wiring FormField hands to its control; pass each prop by name. */
export interface FormFieldControlProps {
  id: string;
  /** For controls a label's `for` can't name, e.g. sliders and radio groups. */
  labelId: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
  disabled?: boolean;
}

export interface FormFieldProps extends FieldBaseProps {
  children: (control: FormFieldControlProps) => React.ReactNode;
  /** horizontal puts the label beside the control (checkbox, switch). */
  orientation?: 'vertical' | 'horizontal';
}

export const FormField: React.FC<FormFieldProps> = props => {
  const {
    children,
    label,
    hideLabel = false,
    description,
    error,
    required = false,
    disabled = false,
    orientation = 'vertical',
    id: idProp,
    'data-testid': testId,
  } = props;
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const control = children({
    id,
    labelId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    'aria-required': required ? true : undefined,
    disabled,
  });

  const labelNode = (
    <FieldLabel id={labelId} htmlFor={id} className={cn(hideLabel && 'sr-only')}>
      {label}
      {required && (
        <span aria-hidden className="text-destructive">
          *
        </span>
      )}
    </FieldLabel>
  );
  const helpNodes = (
    <>
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </>
  );

  return (
    <Field
      orientation={orientation}
      data-invalid={error ? true : undefined}
      data-disabled={disabled || undefined}
      data-testid={testId}
    >
      {orientation === 'horizontal' ? (
        <>
          {control}
          <FieldContent>
            {labelNode}
            {helpNodes}
          </FieldContent>
        </>
      ) : (
        <>
          {labelNode}
          {control}
          {helpNodes}
        </>
      )}
    </Field>
  );
};
