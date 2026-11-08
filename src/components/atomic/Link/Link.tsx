import type React from 'react';

import { useLink } from '@/providers/useLink';

export interface LinkProps {
  /** Internal paths use the app's router (UIProvider); absolute URLs open in a new tab. */
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const Link: React.FC<LinkProps> = props => {
  const { href, children, onClick, id, 'aria-label': ariaLabel, 'data-testid': testId } = props;
  const link = useLink(href);

  return (
    <a
      id={id}
      href={link.href}
      target={link.target}
      rel={link.rel}
      aria-label={ariaLabel}
      data-testid={testId}
      onClick={event => {
        onClick?.();
        link.onClick(event);
      }}
      className="text-brand-text focus-visible:outline-ring rounded-sm underline-offset-4 hover:underline focus-visible:outline-1"
    >
      {children}
    </a>
  );
};
