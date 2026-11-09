import type React from 'react';

import { PRESSED_CLASS } from '@/components/atomic/Toggle/toggleLook';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { IconComponent } from '@/lib/types';

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: IconComponent;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** Accessible name of the group. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SegmentedOption[];
  size?: 'sm' | 'md';
  variant?: 'outline' | 'ghost';
  disabled?: boolean;
  'data-testid'?: string;
}

const SIZE = { sm: 'sm', md: 'default' } as const;
const VARIANT = { ghost: 'default', outline: 'outline' } as const;

export const SegmentedControl: React.FC<SegmentedControlProps> = props => {
  const {
    label,
    value,
    onChange,
    options,
    size = 'md',
    variant = 'outline',
    disabled = false,
    'data-testid': testId,
  } = props;

  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={next => {
        // Empty when the current option is clicked: one option always stays selected.
        const [picked] = next as string[];
        if (picked !== undefined) onChange(picked);
      }}
      variant={VARIANT[variant]}
      size={SIZE[size]}
      spacing={0}
      disabled={disabled}
      data-testid={testId}
    >
      {options.map(option => {
        const Icon = option.icon;

        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={PRESSED_CLASS}
          >
            {Icon && <Icon aria-hidden />}
            {option.label}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};
