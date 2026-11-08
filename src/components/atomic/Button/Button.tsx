import type React from 'react';

import { LoaderCircleIcon } from 'lucide-react';

import { Button as ButtonPrimitive } from '@/components/ui/button';
import type { IconComponent, Size } from '@/lib/types';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: Size;
  fullWidth?: boolean;
  /** Disables the button, sets aria-busy and swaps the icon for a spinner. */
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  /** Leading icon, decorative (aria-hidden). */
  icon?: IconComponent;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
}

type PrimitiveProps = React.ComponentProps<typeof ButtonPrimitive>;

const VARIANT: Record<ButtonVariant, PrimitiveProps['variant']> = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  destructive: 'destructive',
  link: 'link',
};

// Brand-coloured text must use --brand-text (≥4.5:1); the primitive's text-primary is the
// fill colour, guaranteed only 3:1 against the background.
const VARIANT_CLASS: Partial<Record<ButtonVariant, string>> = {
  link: 'text-brand-text',
};

const SIZE: Record<Size, PrimitiveProps['size']> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
};

export const Button: React.FC<ButtonProps> = props => {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    type = 'button',
    icon,
    onClick,
    children,
    ref,
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId,
  } = props;
  const LeadingIcon = loading ? LoaderCircleIcon : icon;

  return (
    <ButtonPrimitive
      ref={ref}
      id={id}
      type={type}
      variant={VARIANT[variant]}
      size={SIZE[size]}
      className={cn(VARIANT_CLASS[variant], fullWidth && 'w-full')}
      disabled={disabled || loading}
      // While loading, stay focusable (aria-disabled) so keyboard users keep their place.
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      onClick={onClick}
    >
      {LeadingIcon && (
        <LeadingIcon
          data-icon="inline-start"
          aria-hidden
          className={cn(loading && 'animate-spin')}
        />
      )}
      {children}
    </ButtonPrimitive>
  );
};
