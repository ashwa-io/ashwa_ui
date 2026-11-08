import { createContext, useContext } from 'react';
import type React from 'react';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export interface AppShellProps {
  topNav?: React.ReactNode;
  sideNav?: React.ReactNode;
  children: React.ReactNode;
  /** screen fills the window; fill fills its parent, for a nested portal layout. */
  height?: 'screen' | 'fill';
  'data-testid'?: string;
}

// A portal's shell nests inside the global one, and a page gets a single main landmark.
const NestedShell = createContext(false);

// The only vertical scroller, at the page's edge: tables stick and virtualise against it.
const CONTENT =
  'bg-background focus-visible:outline-ring relative min-h-0 flex-1 overflow-y-auto focus-visible:outline-1 focus-visible:-outline-offset-1';

export const AppShell: React.FC<AppShellProps> = props => {
  const { topNav, sideNav, children, height = 'screen', 'data-testid': testId } = props;
  const nested = useContext(NestedShell);
  const Content = nested ? 'div' : 'main';
  const content = (
    <Content tabIndex={0} className={CONTENT}>
      {children}
    </Content>
  );

  return (
    <NestedShell value={true}>
      <div
        data-testid={testId}
        className={cn('flex min-h-0 flex-col', height === 'screen' ? 'h-svh' : 'h-full')}
      >
        {topNav}
        {sideNav ? (
          <SidebarProvider className="relative min-h-0 flex-1">
            {sideNav}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* Outside the scroller, so phones can always reach navigation. */}
              <div className="border-b p-2 md:hidden">
                <SidebarTrigger />
              </div>
              {content}
            </div>
          </SidebarProvider>
        ) : (
          content
        )}
      </div>
    </NestedShell>
  );
};
