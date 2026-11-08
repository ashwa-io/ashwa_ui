import type React from 'react';

import { Badge as BadgePrimitive } from '@/components/ui/badge';
import type { IconComponent, Tone } from '@/lib/types';

export interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  /** Leading icon, decorative (aria-hidden). */
  icon?: IconComponent;
  id?: string;
  'data-testid'?: string;
}

type PrimitiveProps = React.ComponentProps<typeof BadgePrimitive>;

const PRIMITIVE_VARIANT: Record<Tone, PrimitiveProps['variant']> = {
  neutral: 'secondary',
  brand: 'secondary',
  success: 'secondary',
  warning: 'secondary',
  danger: 'destructive',
  info: 'secondary',
};

// Tinted fills; text colours are the 4.5:1 status tokens, so contrast is fixed in the tokens.
const TONE_CLASS: Partial<Record<Tone, string>> = {
  brand: 'bg-brand-tint text-brand-tint-foreground',
  success: 'bg-success/10 text-success dark:bg-success/20',
  warning: 'bg-warning/10 text-warning dark:bg-warning/20',
  info: 'bg-info/10 text-info dark:bg-info/20',
};

export const Badge: React.FC<BadgeProps> = props => {
  const { children, tone = 'neutral', icon: Icon, id, 'data-testid': testId } = props;

  return (
    <BadgePrimitive
      id={id}
      data-testid={testId}
      variant={PRIMITIVE_VARIANT[tone]}
      className={TONE_CLASS[tone]}
    >
      {Icon && <Icon data-icon="inline-start" aria-hidden />}
      {children}
    </BadgePrimitive>
  );
};
