import type React from 'react';

import type { ButtonVariant } from '@/components/atomic/Button';
import { buttonLook } from '@/components/atomic/Button/buttonLook';
import { Button as ButtonPrimitive } from '@/components/ui/button';
import { Popover as PopoverRoot, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { IconComponent, OverlayAlign, OverlaySide, Size } from '@/lib/types';

export type PopoverWidth = 'sm' | 'md' | 'lg';

export interface PopoverProps {
  /** Trigger text (the trigger's aria-label when iconOnly); also names the popup. */
  label: string;
  icon?: IconComponent;
  iconOnly?: boolean;
  /** Trigger look. */
  variant?: ButtonVariant;
  size?: Size;
  children: React.ReactNode;
  /** Pass with onOpenChange to control it; otherwise it manages itself. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: OverlaySide;
  align?: OverlayAlign;
  width?: PopoverWidth;
  disabled?: boolean;
  'data-testid'?: string;
}

const WIDTH: Record<PopoverWidth, string> = {
  sm: 'w-56',
  md: 'w-72',
  lg: 'w-96',
};

export const Popover: React.FC<PopoverProps> = props => {
  const {
    label,
    icon: Icon,
    iconOnly = false,
    variant = 'outline',
    size = 'md',
    children,
    open,
    onOpenChange,
    side = 'bottom',
    align = 'start',
    width = 'md',
    disabled = false,
    'data-testid': testId,
  } = props;
  const look = buttonLook(variant, size, iconOnly);

  return (
    <PopoverRoot open={open} onOpenChange={next => onOpenChange?.(next)}>
      <PopoverTrigger
        disabled={disabled}
        aria-label={iconOnly ? label : undefined}
        data-testid={testId}
        render={<ButtonPrimitive variant={look.variant} size={look.size} />}
      >
        {Icon && <Icon data-icon={iconOnly ? undefined : 'inline-start'} aria-hidden />}
        {!iconOnly && label}
      </PopoverTrigger>
      <PopoverContent side={side} align={align} aria-label={label} className={WIDTH[width]}>
        {children}
      </PopoverContent>
    </PopoverRoot>
  );
};
