import type React from 'react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { IconComponent } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  /** Shown in a muted tile. */
  icon?: IconComponent;
  /** Any illustration, e.g. a Lottie; wins over icon. */
  media?: React.ReactNode;
  action?: React.ReactNode;
  /** sm fits modals and panels; md fills page-level areas. */
  size?: 'sm' | 'md';
  'data-testid'?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = props => {
  const {
    title = 'No data found',
    description,
    icon: Icon,
    media,
    action,
    size = 'md',
    'data-testid': testId,
  } = props;

  return (
    <Empty data-testid={testId} className={cn(size === 'sm' && 'gap-2 p-4')}>
      <EmptyHeader>
        {media ? (
          <EmptyMedia>{media}</EmptyMedia>
        ) : (
          Icon && (
            <EmptyMedia variant="icon">
              <Icon aria-hidden />
            </EmptyMedia>
          )
        )}
        <EmptyTitle className={cn(size === 'md' && 'text-base')}>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
};
