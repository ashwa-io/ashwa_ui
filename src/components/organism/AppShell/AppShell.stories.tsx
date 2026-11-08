import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { TruckIcon } from 'lucide-react';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { DataTable } from '@/components/molecule/DataTable';
import { SideNav } from '@/components/organism/SideNav';
import { TopNav } from '@/components/organism/TopNav';
import { UIProvider } from '@/providers/UIProvider';

import { AppShell } from './AppShell';

const navigate = fn();

const sideNav = (
  <SideNav
    currentPath="/vehicles"
    groups={[
      { label: 'Assets', items: [{ label: 'Vehicles', href: '/vehicles', icon: TruckIcon }] },
    ]}
  />
);

const TALL = <div className="h-[2000px] px-6 py-4">Tall content</div>;

const meta = {
  title: 'Organism/AppShell',
  component: AppShell,
  args: { topNav: <TopNav title="Fleet" />, sideNav, children: TALL, height: 'fill' },
  decorators: [Story => <div className="h-[500px] w-[900px]">{Story()}</div>],
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OnlyContentScrolls: Story = {
  play: async ({ canvas }) => {
    const main = canvas.getByRole('main');
    await waitFor(() => expect(main.scrollHeight).toBeGreaterThan(main.clientHeight));
    const banner = canvas.getByRole('banner');
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    const before = [banner.getBoundingClientRect().top, nav.getBoundingClientRect().top];
    main.scrollTop = 600;
    await expect(main.scrollTop).toBe(600);
    await expect([banner.getBoundingClientRect().top, nav.getBoundingClientRect().top]).toEqual(
      before
    );
  },
};

// Keyboard users can scroll the page: the pane takes a tab stop.
export const ContentIsKeyboardScrollable: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('main')).toHaveAttribute('tabindex', '0');
  },
};

export const SidebarUnderHeader: Story = {
  play: async ({ canvasElement, canvas }) => {
    const banner = canvas.getByRole('banner').getBoundingClientRect();
    const side = canvasElement.querySelector('[data-slot="sidebar"]')!.getBoundingClientRect();
    await expect(side.top).toBe(banner.bottom);
    await expect(side.bottom).toBe(
      canvasElement.querySelector('[data-testid="shell"]')?.getBoundingClientRect().bottom ??
        side.bottom
    );
  },
  args: { 'data-testid': 'shell' },
};

interface Row {
  id: string;
  name: string;
}
const rows: Row[] = Array.from({ length: 500 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}` }));
const columns: ColumnDef<Row, string>[] = [{ accessorKey: 'name', header: 'Name' }];

// The table's header sticks to the content pane, whose scrollbar is at the page edge.
export const DataTableInside: Story = {
  args: { children: <DataTable columns={columns} data={rows} /> },
  play: async ({ canvas }) => {
    await canvas.findByText('Row 0');
    const main = canvas.getByRole('main');
    main.scrollTop = 800;
    const header = canvas.getByRole('columnheader', { name: 'Name' });
    await waitFor(() =>
      expect(header.getBoundingClientRect().top).toBe(main.getBoundingClientRect().top)
    );
  },
};

export const ScrollbarOnPageEdge: Story = {
  play: async ({ canvas, canvasElement }) => {
    const shell = canvasElement.firstElementChild!.getBoundingClientRect();
    await expect(canvas.getByRole('main').getBoundingClientRect().right).toBe(shell.right);
  },
};

export const Fill: Story = {
  args: { sideNav: undefined, 'data-testid': 'shell' },
  decorators: [Story => <div className="h-[400px]">{Story()}</div>],
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('shell').getBoundingClientRect().height).toBe(400);
  },
};

export const NoSideNav: Story = {
  args: { sideNav: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('main')).toBeInTheDocument();
    await expect(canvas.queryByRole('navigation')).toBeNull();
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};

// A portal's shell nests inside the global one: the page still has a single main landmark.
export const NestedShells: Story = {
  args: {
    sideNav: undefined,
    children: (
      <AppShell height="fill" sideNav={sideNav}>
        {TALL}
      </AppShell>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('main')).toHaveLength(1);
  },
};

export const ScreenHeight: Story = {
  args: { height: 'screen', 'data-testid': 'shell' },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('shell').getBoundingClientRect().height).toBe(
      window.innerHeight
    );
  },
};

// Phones get the sidebar as a drawer from a trigger that scrolling can't take away.
export const PhoneDrawer: Story = {
  globals: { viewport: { value: 'mobile2' } },
  decorators: [
    Story => (
      <UIProvider navigate={navigate}>
        <div className="h-[500px] w-full">{Story()}</div>
      </UIProvider>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const trigger = await canvas.findByRole('button', { name: 'Toggle Sidebar' });
    const main = canvas.getByRole('main');
    await waitFor(() => expect(main.scrollHeight).toBeGreaterThan(main.clientHeight));
    main.scrollTop = 600;
    await expect(trigger.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      canvas.getByRole('banner').getBoundingClientRect().bottom
    );
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('link', { name: 'Vehicles' }));
    await expect(navigate).toHaveBeenCalledWith('/vehicles');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};
