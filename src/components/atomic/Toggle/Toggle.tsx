import type React from 'react';

import { Toggle as TogglePrimitive } from '@/components/ui/toggle';
import type { IconComponent, Size } from '@/lib/types';

import { PRESSED_CLASS } from './toggleLook';

export interface ToggleProps {
  pressed: boolean;
  onChange: (pressed: boolean) => void;
  children?: React.ReactNode;
  icon?: IconComponent;
  /** Required when there is no visible text. */
  'aria-label'?: string;
  variant?: 'ghost' | 'outline';
  size?: Size;
  disabled?: boolean;
  'data-testid'?: string;
}

const VARIANT = { ghost: 'default', outline: 'outline' } as const;
const SIZE = { sm: 'sm', md: 'default', lg: 'lg' } as const;

export const Toggle: React.FC<ToggleProps> = props => {
  const {
    pressed,
    onChange,
    children,
    icon: Icon,
    'aria-label': ariaLabel,
    variant = 'ghost',
    size = 'md',
    disabled = false,
    'data-testid': testId,
  } = props;

  return (
    <TogglePrimitive
      pressed={pressed}
      onPressedChange={next => onChange(next)}
      variant={VARIANT[variant]}
      size={SIZE[size]}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
      className={PRESSED_CLASS}
    >
      {Icon && <Icon aria-hidden />}
      {children}
    </TogglePrimitive>
  );
};
