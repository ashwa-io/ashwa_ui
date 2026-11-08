import type React from 'react';

import type { Button as ButtonPrimitive } from '@/components/ui/button';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

type PrimitiveVariant = React.ComponentProps<typeof ButtonPrimitive>['variant'];

// Shared by Button and IconButton so both map the public names the same way.
export const BUTTON_VARIANT: Record<ButtonVariant, PrimitiveVariant> = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  destructive: 'destructive',
  link: 'link',
};
