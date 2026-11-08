import type React from 'react';

import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';

import {
  Alert as AlertPrimitive,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import type { IconComponent } from '@/lib/types';
import { cn } from '@/lib/utils';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  'data-testid'?: string;
}

const ICON: Record<AlertTone, IconComponent> = {
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  danger: CircleXIcon,
};

const TONE_CLASS: Record<AlertTone, string> = {
  info: 'bg-info/10 text-info dark:bg-info/20',
  success: 'bg-success/10 text-success dark:bg-success/20',
  warning: 'bg-warning/10 text-warning dark:bg-warning/20',
  danger: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
};

export const Alert: React.FC<AlertProps> = props => {
  const { tone = 'info', title, description, action, 'data-testid': testId } = props;
  const Icon = ICON[tone];

  return (
    <AlertPrimitive
      // Only errors interrupt; announcing every banner on page load would drown the page.
      role={tone === 'danger' ? 'alert' : 'status'}
      data-testid={testId}
      className={cn('border-current/20 has-data-[slot=alert-action]:pr-2.5', TONE_CLASS[tone])}
    >
      <Icon aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      {description && (
        <AlertDescription className="text-foreground">{description}</AlertDescription>
      )}
      {/* Below the text: the primitive's corner spot lets a wide button cover the words. */}
      {action && <AlertAction className="static col-start-2 mt-1.5">{action}</AlertAction>}
    </AlertPrimitive>
  );
};
