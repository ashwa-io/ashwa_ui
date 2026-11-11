import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, screen, waitFor } from 'storybook/test';

import { Badge } from '@/components/atomic/Badge';

import { List, ListItem } from './List';

const meta = {
  title: 'Molecule/List',
  component: List,
  args: {
    'aria-label': 'Vehicles',
    children: [
      <ListItem key="a" label="Truck 12" description="Hisar depot" />,
      <ListItem key="b" label="Truck 14" />,
    ],
  },
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('list', { name: 'Vehicles' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

const onRow = fn();

export const Clickable: Story = {
  args: { children: <ListItem label="Truck 12" description="Hisar depot" onClick={onRow} /> },
  play: async ({ canvas, userEvent }) => {
    onRow.mockClear();
    await userEvent.click(canvas.getByRole('button', { name: /Truck 12/ }));
    await expect(onRow).toHaveBeenCalledOnce();
  },
};

export const Selected: Story = {
  args: {
    children: <ListItem label="Truck 12" description="Hisar depot" onClick={fn()} selected />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Truck 12/ })).toHaveAttribute(
      'aria-current',
      'true'
    );
  },
};

export const SelectedDark: Story = {
  ...Selected,
  globals: { theme: 'dark' },
};

const onDisabled = fn();

export const Disabled: Story = {
  args: { children: <ListItem label="Truck 12" onClick={onDisabled} disabled /> },
  play: async ({ canvas }) => {
    onDisabled.mockClear();
    await fireEvent.click(canvas.getByRole('button', { name: 'Truck 12' }));
    await expect(onDisabled).not.toHaveBeenCalled();
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <ListItem
        label="Truck 12"
        startContent={<span data-testid="start">S</span>}
        endContent={<Badge tone="success">Active</Badge>}
      />
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('start')).toBeVisible();
    await expect(canvas.getByText('Active')).toBeVisible();
  },
};

const LONG_LABEL = 'A very long vehicle name that cannot possibly fit in this narrow list';

// Long text truncates instead of pushing end content out of the row, with the full text on hover.
export const LongLabel: Story = {
  args: {
    children: <ListItem label={LONG_LABEL} endContent={<Badge>End</Badge>} />,
  },
  decorators: [Story => <div className="w-48">{Story()}</div>],
  play: async ({ canvas, userEvent }) => {
    const row = canvas.getByRole('listitem').getBoundingClientRect();
    await expect(canvas.getByText('End').getBoundingClientRect().right).toBeLessThanOrEqual(
      row.right
    );
    await userEvent.hover(canvas.getByText(LONG_LABEL));
    const tip = await screen.findByText(LONG_LABEL, { selector: '[data-slot="tooltip-content"]' });
    await waitFor(() => expect(tip).toBeVisible());
  },
};

export const Compact: Story = {
  args: { density: 'compact' },
};

export const Sizes: Story = {
  args: {
    children: [
      <ListItem key="s" label="Small" size="sm" data-testid="sm" />,
      <ListItem key="m" label="Medium" size="md" data-testid="md" />,
    ],
  },
  play: async ({ canvas }) => {
    const height = (id: string) => canvas.getByTestId(id).getBoundingClientRect().height;
    await expect(height('sm')).toBeLessThan(height('md'));
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};

const onFocusRow = fn();

export const ClickableFocusIndicator: Story = {
  args: { children: <ListItem label="Truck 12" onClick={onFocusRow} /> },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    const style = getComputedStyle(canvas.getByRole('button'));
    await expect(style.outlineStyle).toBe('solid');
    await expect(style.outlineWidth).toBe('1px');
  },
};
