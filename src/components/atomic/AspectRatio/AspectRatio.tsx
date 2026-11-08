import type React from 'react';

import { AspectRatio as AspectRatioPrimitive } from '@/components/ui/aspect-ratio';

export interface AspectRatioProps {
  /** Width divided by height. */
  ratio?: number;
  children: React.ReactNode;
}

export const AspectRatio: React.FC<AspectRatioProps> = props => {
  const { ratio = 16 / 9, children } = props;

  return <AspectRatioPrimitive ratio={ratio}>{children}</AspectRatioPrimitive>;
};
