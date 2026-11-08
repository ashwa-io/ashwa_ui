import type React from 'react';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export interface AppShellProps {
  topNav?: React.ReactNode;
  sideNav?: React.ReactNode;
  children: React.ReactNode;
  /** screen fills the window; fill fills its parent, for a nested portal layout. */
  height?: 'screen' | 'fill';
  'data-testid'?: string;
}

// The only vertical scroller, at the page's edge: tables stick and virtualise against it.
// block: shadcn's inset is a flex column, which would squeeze tall children instead of scrolling.
const CONTENT =
  'focus-visible:outline-ring block min-h-0 flex-1 overflow-y-auto focus-visible:outline-1 focus-visible:-outline-offset-1';

export const AppShell: React.FC<AppShellProps> = props => {
  const { topNav, sideNav, children, height = 'screen', 'data-testid': testId } = props;

  return (
    <div
      data-testid={testId}
      className={cn('flex min-h-0 flex-col', height === 'screen' ? 'h-svh' : 'h-full')}
    >
      {topNav}
      {sideNav ? (
        <SidebarProvider className="relative min-h-0 flex-1">
          {sideNav}
          <SidebarInset tabIndex={0} className={CONTENT}>
            <div className="border-b p-2 md:hidden">
              <SidebarTrigger />
            </div>
            {children}
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <main tabIndex={0} className={CONTENT}>
          {children}
        </main>
      )}
    </div>
  );
};
