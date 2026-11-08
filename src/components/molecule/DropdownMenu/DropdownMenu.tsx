import type React from 'react';

import { ChevronDownIcon } from 'lucide-react';

import type { ButtonVariant } from '@/components/atomic/Button';
import { buttonLook } from '@/components/atomic/Button/buttonLook';
import { Button as ButtonPrimitive } from '@/components/ui/button';
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IconComponent, OverlayAlign, Size } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface MenuItem {
  label: string;
  onSelect: () => void;
  icon?: IconComponent;
  /** Second line under the label. */
  description?: string;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownMenuProps {
  /** Trigger text (the trigger's aria-label when iconOnly). */
  label: string;
  items: MenuItem[];
  icon?: IconComponent;
  iconOnly?: boolean;
  /** Trigger look. */
  variant?: ButtonVariant;
  size?: Size;
  align?: OverlayAlign;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  'data-testid'?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = props => {
  const {
    label,
    items,
    icon: Icon,
    iconOnly = false,
    variant = 'outline',
    size = 'md',
    align = 'end',
    disabled = false,
    onOpenChange,
    'data-testid': testId,
  } = props;
  const look = buttonLook(variant, size, iconOnly);

  return (
    <DropdownMenuRoot onOpenChange={open => onOpenChange?.(open)}>
      <DropdownMenuTrigger
        disabled={disabled}
        aria-label={iconOnly ? label : undefined}
        data-testid={testId}
        render={<ButtonPrimitive variant={look.variant} size={look.size} />}
      >
        {Icon && <Icon data-icon={iconOnly ? undefined : 'inline-start'} aria-hidden />}
        {!iconOnly && label}
        {!iconOnly && <ChevronDownIcon data-icon="inline-end" aria-hidden />}
      </DropdownMenuTrigger>
      {/* Wider than the trigger so two-line items with descriptions fit. */}
      <DropdownMenuContent align={align} className="w-auto max-w-80 min-w-48">
        {items.map(item => {
          const ItemIcon = item.icon;
          return (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onSelect}
              disabled={item.disabled}
              variant={item.destructive ? 'destructive' : 'default'}
            >
              {ItemIcon && <ItemIcon aria-hidden />}
              <span className="flex flex-col">
                <span>{item.label}</span>
                {item.description && (
                  // Muted grey fails contrast on the red highlight, so destructive items stay red.
                  <span className={cn('text-xs', !item.destructive && 'text-muted-foreground')}>
                    {item.description}
                  </span>
                )}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
