import { Fragment } from 'react';
import type React from 'react';

import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import type { IconComponent } from '@/lib/types';
import { useLink } from '@/providers/useLink';

import { activeHref } from './activeHref';

export interface SideNavItem {
  label: string;
  href: string;
  icon?: IconComponent;
  /** At the end of the row, e.g. a chevron on an item that opens its own nav. */
  endIcon?: IconComponent;
  onClick?: () => void;
}

export interface SideNavGroup {
  label?: string;
  items: SideNavItem[];
}

export interface SideNavProps {
  groups: SideNavGroup[];
  /** The router's current pathname. */
  currentPath: string;
  /** Above the groups, e.g. a switcher. */
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Collapses to icons, with a rail and a trigger. */
  collapsible?: boolean;
  'aria-label'?: string;
  'data-testid'?: string;
}

const NavLink: React.FC<{
  item: SideNavItem;
  active: boolean;
  showTooltip: boolean;
}> = props => {
  const { item, active, showTooltip } = props;
  const link = useLink(item.href);
  const { setOpenMobile } = useSidebar();
  const Icon = item.icon;
  const EndIcon = item.endIcon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        tooltip={showTooltip ? item.label : undefined}
        render={
          <a
            href={link.href}
            target={link.target}
            rel={link.rel}
            aria-current={active ? 'page' : undefined}
            onClick={event => {
              item.onClick?.();
              link.onClick(event);
              // AppShell outlives the route, so the phone drawer won't close by itself.
              setOpenMobile(false);
            }}
          />
        }
      >
        {Icon && <Icon aria-hidden />}
        <span className="truncate">{item.label}</span>
        {EndIcon && <EndIcon aria-hidden className="text-muted-foreground ml-auto" />}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const CollapseToggle: React.FC = () => {
  const { state, toggleSidebar } = useSidebar();
  const expanded = state === 'expanded';
  const Icon = expanded ? ChevronsLeftIcon : ChevronsRightIcon;
  const label = expanded ? 'Collapse' : 'Expand';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={label} onClick={toggleSidebar}>
          <Icon aria-hidden />
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

/** Render inside AppShell, which provides the sidebar's context and layout. */
export const SideNav: React.FC<SideNavProps> = props => {
  const {
    groups,
    currentPath,
    header,
    footer,
    collapsible = false,
    'aria-label': ariaLabel = 'Main',
    'data-testid': testId,
  } = props;
  const { isMobile } = useSidebar();
  // 'none' has no phone drawer; offcanvas on desktop lets Ctrl+B hide the only nav.
  const mode = collapsible ? 'icon' : isMobile ? 'offcanvas' : 'none';
  const current = activeHref(
    groups.flatMap(group => group.items.map(item => item.href)),
    currentPath
  );

  return (
    // absolute h-full: sits under whatever header AppShell has, instead of filling the viewport.
    <Sidebar
      collapsible={mode}
      data-testid={testId}
      className={mode === 'none' ? 'h-full shrink-0 border-r' : 'absolute h-full'}
    >
      {header && <SidebarHeader>{header}</SidebarHeader>}
      <SidebarContent className="group-data-[collapsible=icon]:overflow-auto">
        <nav aria-label={ariaLabel}>
          {groups.map((group, index) => (
            <Fragment key={group.label ?? index}>
              {index > 0 && <SidebarSeparator className="mx-0" />}
              <SidebarGroup className="p-1">
                {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
                <SidebarMenu className="gap-0">
                  {group.items.map(item => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={item.href === current}
                      showTooltip={collapsible}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </Fragment>
          ))}
        </nav>
      </SidebarContent>
      {(footer || collapsible) && (
        <SidebarFooter>
          {footer}
          {collapsible && <CollapseToggle />}
        </SidebarFooter>
      )}
      {collapsible && <SidebarRail />}
    </Sidebar>
  );
};
