import type React from 'react';

import { LoaderCircleIcon } from 'lucide-react';

import { Button as ButtonPrimitive } from '@/components/ui/button';
import type { IconComponent, Size } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLink } from '@/providers/useLink';

import { BUTTON_VARIANT, type ButtonVariant } from './buttonVariant';

export type { ButtonVariant } from './buttonVariant';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: Size;
  fullWidth?: boolean;
  /** Disables the button, sets aria-busy and swaps the icon for a spinner. */
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  /** Renders a link in the button look. Disabled or loading removes the href. */
  href?: string;
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
    href,
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
  const link = useLink(disabled || loading ? undefined : href);
  const isLink = href !== undefined;
  // Disabled or a blocked href. :disabled styles never match an <a>, so the look is set here.
  const deadLink = isLink && !loading && link.href === undefined;

  return (
    <ButtonPrimitive
      ref={ref}
      id={id}
      type={isLink ? undefined : type}
      nativeButton={!isLink}
      // Base UI marks non-native buttons role="button"; a link must be announced as one.
      role={isLink ? 'link' : undefined}
      render={isLink ? <a href={link.href} target={link.target} rel={link.rel} /> : undefined}
      variant={BUTTON_VARIANT[variant]}
      size={SIZE[size]}
      className={cn(
        VARIANT_CLASS[variant],
        fullWidth && 'w-full',
        deadLink && 'pointer-events-none opacity-50'
      )}
      disabled={disabled || loading || deadLink}
      // While loading, stay focusable (aria-disabled) so keyboard users keep their place.
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      onClick={event => {
        onClick?.(event);
        link.onClick(event);
      }}
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
