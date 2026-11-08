import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { UIProvider } from '@/providers/UIProvider';

import { Breadcrumb } from './Breadcrumb';

const navigate = fn();

const meta = {
  title: 'Molecule/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [{ label: 'Home', href: '/' }, { label: 'Fleet', href: '/fleet' }, { label: 'Truck 7' }],
  },
  decorators: [Story => <UIProvider navigate={navigate}>{Story()}</UIProvider>],
  beforeEach: () => {
    navigate.mockClear();
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Fleet' })).toHaveAttribute('href', '/fleet');
  },
};

// The current page is never a live link, even when the data gives it an href.
export const LastIsCurrent: Story = {
  args: {
    items: [
      { label: 'Fleet', href: '/fleet' },
      { label: 'Truck 7', href: '/fleet/7' },
    ],
  },
  play: async ({ canvas }) => {
    const current = canvas.getByText('Truck 7');
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(current).not.toHaveAttribute('href');
  },
};

export const NavigatesThroughProvider: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('link', { name: 'Fleet' }));
    await expect(navigate).toHaveBeenCalledWith('/fleet');
  },
};

export const UnsafeHrefIsNotALink: Story = {
  args: { items: [{ label: 'Bad', href: 'javascript:alert(1)' }, { label: 'Here' }] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Bad')).toBeVisible();
    await expect(canvas.queryByRole('link', { name: 'Bad' })).toBeNull();
  },
};

export const LongTrailWraps: Story = {
  args: {
    items: [
      { label: 'Municipal corporation', href: '/a' },
      { label: 'Solid waste department', href: '/b' },
      { label: 'Northern depot vehicles', href: '/c' },
      { label: 'Truck number seven' },
    ],
  },
  decorators: [Story => <div className="w-48">{Story()}</div>],
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth);
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
