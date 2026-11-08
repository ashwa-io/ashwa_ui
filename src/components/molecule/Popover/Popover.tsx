import type React from 'react';

import type { ButtonVariant } from '@/components/atomic/Button';
import { buttonLook } from '@/components/atomic/Button/buttonLook';
import { Button as ButtonPrimitive } from '@/components/ui/button';
import { Popover as PopoverRoot, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { IconComponent, OverlayAlign, OverlaySide, Size } from '@/lib/types';
import { cn } from '@/lib/utils';

export type PopoverWidth = 'sm' | 'md' | 'lg';

export interface PopoverProps {
  /** Trigger text (the trigger's aria-label when iconOnly or triggerContent); also names the popup. */
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
  /** Replaces the trigger's icon and text, e.g. an avatar; variant and size then don't apply. */
  triggerContent?: React.ReactNode;
  /** No padding, for a scrolling list whose scrollbar must reach the popup's edge. */
  flush?: boolean;
  'data-testid'?: string;
}

const WIDTH: Record<PopoverWidth, string> = {
  sm: 'w-56',
  md: 'w-72',
  lg: 'w-96',
};

const CUSTOM_TRIGGER =
  'focus-visible:outline-ring hover:bg-muted flex min-w-0 items-center rounded-md text-left focus-visible:outline-1';

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
    triggerContent,
    flush = false,
    'data-testid': testId,
  } = props;
  const look = buttonLook(variant, size, iconOnly);

  return (
    <PopoverRoot open={open} onOpenChange={next => onOpenChange?.(next)}>
      {triggerContent ? (
        <PopoverTrigger
          disabled={disabled}
          aria-label={label}
          data-testid={testId}
          className={CUSTOM_TRIGGER}
        >
          {triggerContent}
        </PopoverTrigger>
      ) : (
        <PopoverTrigger
          disabled={disabled}
          aria-label={iconOnly ? label : undefined}
          data-testid={testId}
          render={<ButtonPrimitive variant={look.variant} size={look.size} />}
        >
          {Icon && <Icon data-icon={iconOnly ? undefined : 'inline-start'} aria-hidden />}
          {!iconOnly && label}
        </PopoverTrigger>
      )}
      <PopoverContent
        side={side}
        align={align}
        aria-label={label}
        className={cn(WIDTH[width], flush && 'gap-0 p-0')}
      >
        {children}
      </PopoverContent>
    </PopoverRoot>
  );
};
