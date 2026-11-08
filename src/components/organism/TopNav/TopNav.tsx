import type React from 'react';

import { useLink } from '@/providers/useLink';

export interface TopNavProps {
  logo?: React.ReactNode;
  /** Makes the logo a link, named by logoLabel. */
  logoHref?: string;
  logoLabel?: string;
  title?: string;
  /** Right-hand side, e.g. a user menu. */
  endContent?: React.ReactNode;
  'data-testid'?: string;
}

export const TopNav: React.FC<TopNavProps> = props => {
  const {
    logo,
    logoHref,
    logoLabel = 'Go to home',
    title,
    endContent,
    'data-testid': testId,
  } = props;
  const link = useLink(logoHref);

  return (
    <header
      data-testid={testId}
      className="bg-background flex h-10 shrink-0 items-center justify-between gap-4 border-b px-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        {logoHref ? (
          <a
            href={link.href}
            target={link.target}
            rel={link.rel}
            aria-label={logoLabel}
            onClick={link.onClick}
            className="focus-visible:outline-ring shrink-0 rounded-md focus-visible:outline-1"
          >
            {logo}
          </a>
        ) : (
          logo
        )}
        {title && (
          <>
            {logo && <span aria-hidden className="bg-border h-5 w-px shrink-0" />}
            {/* An h1 for screen readers; a 40px bar has no room for the page-heading size. */}
            <h1 className="min-w-0 truncate text-sm font-semibold">{title}</h1>
          </>
        )}
      </div>
      {endContent && <div className="flex shrink-0 items-center gap-3">{endContent}</div>}
    </header>
  );
};
