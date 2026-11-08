import type React from 'react';

import { Avatar as AvatarPrimitive, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Size } from '@/lib/types';
import { cn } from '@/lib/utils';

import { initials } from './initials';

export interface AvatarProps {
  /** Gives the initials and the image's alt text. */
  name: string;
  src?: string | null;
  size?: Size;
  shape?: 'circle' | 'rounded';
  'data-testid'?: string;
}

export const Avatar: React.FC<AvatarProps> = props => {
  const { name, src, size = 'md', shape = 'rounded', 'data-testid': testId } = props;
  const rounded = shape === 'rounded';

  return (
    <AvatarPrimitive
      size={size === 'sm' ? 'sm' : 'default'}
      data-testid={testId}
      className={cn(size === 'lg' && 'size-12', rounded && 'rounded-lg after:rounded-lg')}
    >
      {src && <AvatarImage src={src} alt={name} className={cn(rounded && 'rounded-lg')} />}
      <AvatarFallback role="img" aria-label={name} className={cn(rounded && 'rounded-lg')}>
        {initials(name)}
      </AvatarFallback>
    </AvatarPrimitive>
  );
};
