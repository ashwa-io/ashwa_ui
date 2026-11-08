import type React from 'react';

import type { Button as ButtonPrimitive } from '@/components/ui/button';
import type { Size } from '@/lib/types';

import { BUTTON_VARIANT, type ButtonVariant } from './buttonVariant';

type PrimitiveProps = React.ComponentProps<typeof ButtonPrimitive>;

const TEXT_SIZE: Record<Size, PrimitiveProps['size']> = { sm: 'sm', md: 'default', lg: 'lg' };
const ICON_SIZE: Record<Size, PrimitiveProps['size']> = {
  sm: 'icon-sm',
  md: 'icon',
  lg: 'icon-lg',
};

/** Primitive props for an overlay trigger drawn in the public Button look. */
export const buttonLook = (
  variant: ButtonVariant,
  size: Size,
  iconOnly: boolean
): Pick<PrimitiveProps, 'variant' | 'size'> => ({
  variant: BUTTON_VARIANT[variant],
  size: (iconOnly ? ICON_SIZE : TEXT_SIZE)[size],
});
