import type React from 'react';

import { LoaderCircleIcon } from 'lucide-react';

import { BUTTON_VARIANT, type ButtonVariant } from '@/components/atomic/Button/buttonVariant';
import { Button as ButtonPrimitive } from '@/components/ui/button';
import type { IconComponent, Size } from '@/lib/types';
import { cn } from '@/lib/utils';

export type IconButtonVariant = Exclude<ButtonVariant, 'link'>;

export interface IconButtonProps {
  icon: IconComponent;
  /** Required: an icon-only button has no other accessible name. */
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: Size;
  /** Disables the button, sets aria-busy and swaps the icon for a spinner. */
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
}

type PrimitiveProps = React.ComponentProps<typeof ButtonPrimitive>;

const SIZE: Record<Size, PrimitiveProps['size']> = {
  sm: 'icon-sm',
  md: 'icon',
  lg: 'icon-lg',
};

export const IconButton: React.FC<IconButtonProps> = props => {
  const {
    icon,
    'aria-label': ariaLabel,
    variant = 'ghost',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    ref,
    id,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId,
  } = props;
  const Icon = loading ? LoaderCircleIcon : icon;

  return (
    <ButtonPrimitive
      ref={ref}
      id={id}
      type={type}
      variant={BUTTON_VARIANT[variant]}
      size={SIZE[size]}
      disabled={disabled || loading}
      // While loading, stay focusable (aria-disabled) so keyboard users keep their place.
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      onClick={onClick}
    >
      <Icon aria-hidden className={cn(loading && 'animate-spin')} />
    </ButtonPrimitive>
  );
};
