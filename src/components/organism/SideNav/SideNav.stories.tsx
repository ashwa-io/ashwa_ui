import type { Meta, StoryObj } from '@storybook/react-vite';
import { MapPinIcon, RouteIcon, TruckIcon } from 'lucide-react';
import { expect, fn, waitFor } from 'storybook/test';

import { SidebarProvider } from '@/components/ui/sidebar';
import { UIProvider } from '@/providers/UIProvider';

import { SideNav, type SideNavGroup } from './SideNav';

const GROUPS: SideNavGroup[] = [
  {
    label: 'Setup',
    items: [
      { label: 'Routes', href: '/admin/route', icon: RouteIcon },
      { label: 'Global points', href: '/admin/points', icon: MapPinIcon },
    ],
  },
  { label: 'Assets', items: [{ label: 'Vehicles', href: '/admin/vehicles', icon: TruckIcon }] },
];

const navigate = fn();

const meta = {
  title: 'Organism/SideNav',
  component: SideNav,
  args: { groups: GROUPS, currentPath: '/admin/route/5' },
  decorators: [
    Story => (
      <UIProvider navigate={navigate}>
        <SidebarProvider className="relative h-96 min-h-0">{Story()}</SidebarProvider>
      </UIProvider>
    ),
  ],
  beforeEach: () => {
    navigate.mockClear();
  },
} satisfies Meta<typeof SideNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    await expect(canvas.getByText('Setup')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Vehicles' })).toHaveAttribute(
      'href',
      '/admin/vehicles'
    );
  },
};

const tint = () => {
  const probe = document.createElement('div');
  probe.className = 'bg-brand-tint';
  document.body.append(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
};

// Exactly one item is active, in the brand tint.
export const Active: Story = {
  play: async ({ canvas }) => {
    const routes = canvas.getByRole('link', { name: 'Routes' });
    await expect(routes).toHaveAttribute('aria-current', 'page');
    await expect(
      canvas.getAllByRole('link').filter(l => l.hasAttribute('aria-current'))
    ).toHaveLength(1);
    await waitFor(() => expect(getComputedStyle(routes).backgroundColor).toBe(tint()));
  },
};

export const NavigatesThroughProvider: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('link', { name: 'Vehicles' }));
    await expect(navigate).toHaveBeenCalledWith('/admin/vehicles');
  },
};

export const HeaderAndFooter: Story = {
  args: { header: <div>Switcher</div>, footer: <div>Account</div> },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Switcher')).toBeVisible();
    await expect(canvas.getByText('Account')).toBeVisible();
  },
};

// Collapsed to icons: labels are out of sight, but every link keeps its name.
export const CollapsedKeepsNames: Story = {
  args: { collapsible: true },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvasElement.querySelector('[data-slot="sidebar-trigger"]')!);
    const container = canvasElement.querySelector('[data-slot="sidebar-container"]')!;
    await waitFor(() => expect(container.getBoundingClientRect().width).toBe(48));
    await expect(canvas.getByRole('link', { name: 'Routes' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Vehicles' })).toBeInTheDocument();
    // A long list must stay reachable while collapsed.
    await expect(
      getComputedStyle(canvasElement.querySelector('[data-slot="sidebar-content"]')!).overflowY
    ).toBe('auto');
  },
};

// With no collapse control there is no way back, so the shortcut must not hide the nav.
export const ShortcutCannotHideFixedNav: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.keyboard('{Control>}b{/Control}');
    await new Promise(resolve => setTimeout(resolve, 300));
    await expect(
      canvas.getByRole('link', { name: 'Routes' }).getBoundingClientRect().left
    ).toBeGreaterThanOrEqual(0);
  },
};

export const Dark: Story = {
  args: { collapsible: true, footer: <div>Account</div> },
  globals: { theme: 'dark' },
};
