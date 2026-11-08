import type React from 'react';

import { Skeleton as SkeletonPrimitive } from '@/components/ui/skeleton';

export type SkeletonShape = 'text' | 'circle' | 'block';

export interface SkeletonProps {
  /** Fills the wrapper's width; the app sizes it with a plain div. */
  shape?: SkeletonShape;
  'data-testid'?: string;
}

const SHAPE: Record<SkeletonShape, string> = {
  text: 'h-4 w-full',
  circle: 'aspect-square w-full rounded-full',
  block: 'size-full',
};

export const Skeleton: React.FC<SkeletonProps> = props => {
  const { shape = 'text', 'data-testid': testId } = props;

  return <SkeletonPrimitive aria-hidden data-testid={testId} className={SHAPE[shape]} />;
};
