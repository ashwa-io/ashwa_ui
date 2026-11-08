import type React from 'react';

import { Separator } from '@/components/ui/separator';

export interface DividerProps {
  /** A vertical divider stretches to its flex row's height. */
  orientation?: 'horizontal' | 'vertical';
  id?: string;
  'data-testid'?: string;
}

export const Divider: React.FC<DividerProps> = props => {
  const { orientation = 'horizontal', id, 'data-testid': testId } = props;

  return <Separator orientation={orientation} id={id} data-testid={testId} />;
};
