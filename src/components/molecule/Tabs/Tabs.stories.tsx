import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, waitFor } from 'storybook/test';

import { HStack } from '@/components/layout/Stack';

import { Tabs, type TabItem, type TabsProps } from './Tabs';

const ITEMS: TabItem[] = [
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'houses', label: 'Houses' },
  { value: 'devices', label: 'Devices' },
];

const Controlled: React.FC<TabsProps> = props => {
  const [value, setValue] = useState(props.value);
  return (
    <Tabs
      {...props}
      value={value}
      onChange={next => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
};

const meta = {
  title: 'Molecule/Tabs',
  component: Tabs,
  args: { items: ITEMS, value: 'vehicles', onChange: fn(), 'aria-label': 'Vehicle groups' },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole('tablist', { name: 'Vehicle groups' })).toBeInTheDocument();
    await expect(canvas.getByRole('tab', { name: 'Vehicles' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await userEvent.click(canvas.getByRole('tab', { name: 'Houses' }));
    await expect(args.onChange).toHaveBeenCalledWith('houses');
    await expect(canvas.getByRole('tab', { name: 'Houses' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole('tab', { name: 'Vehicles' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Houses' })).toHaveFocus());
  },
};

export const WithCount: Story = {
  args: {
    items: [
      { value: 'vehicles', label: 'Vehicles', count: 12 },
      { value: 'houses', label: 'Houses', count: 3 },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: /Vehicles/ })).toHaveTextContent('12');
  },
};

export const Disabled: Story = {
  args: {
    items: [
      { value: 'vehicles', label: 'Vehicles' },
      { value: 'houses', label: 'Houses', disabled: true },
    ],
  },
  play: async ({ args, canvas }) => {
    await fireEvent.click(canvas.getByRole('tab', { name: 'Houses' }));
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex flex-col gap-3">
      <Tabs {...args} size="sm" data-testid="sm" aria-label="Small" />
      <Tabs {...args} size="md" data-testid="md" aria-label="Medium" />
    </div>
  ),
  play: async ({ canvas }) => {
    const height = (name: string) =>
      canvas.getByRole('tablist', { name }).getBoundingClientRect().height;
    await expect(height('Small')).toBeLessThan(height('Medium'));
  },
};

// Many tabs scroll inside their row and never widen the page.
export const Overflow: Story = {
  args: {
    items: Array.from({ length: 20 }, (_, i) => ({ value: `t${i}`, label: `Group ${i}` })),
    value: 't0',
  },
  decorators: [Story => <div className="w-80">{Story()}</div>],
  play: async ({ canvas }) => {
    const list = canvas.getByRole('tablist');
    await expect(list.getBoundingClientRect().width).toBeLessThanOrEqual(320);
    await expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const Dark: Story = {
  args: { items: [{ value: 'vehicles', label: 'Vehicles', count: 12 }, ...ITEMS.slice(1)] },
  globals: { theme: 'dark' },
};

const MANY: TabItem[] = Array.from({ length: 20 }, (_, i) => ({
  value: `t${i}`,
  label: `Group ${i}`,
}));

// Classic scrollbars (Windows default) would eat the fixed-height row; the test browser hides them.
export const NoScrollbarInRow: Story = {
  args: { items: MANY, value: 't0' },
  decorators: [Story => <div className="w-80">{Story()}</div>],
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByRole('tablist'));
    await expect(style.scrollbarWidth).toBe('none');
    await expect(style.overflowY).toBe('hidden');
  },
};

export const InsideFlexRow: Story = {
  args: { items: MANY, value: 't0', 'data-testid': 'tabs' },
  decorators: [
    Story => (
      <div className="w-80">
        <HStack>{Story()}</HStack>
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('tabs').getBoundingClientRect().width).toBeLessThanOrEqual(320);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

// Arrowing back must bring the whole focused tab into view.
export const ArrowLeftKeepsTabVisible: Story = {
  args: { items: MANY, value: 't0' },
  decorators: [Story => <div className="ml-12 w-80">{Story()}</div>],
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole('tab', { name: 'Group 0' }).focus();
    await userEvent.keyboard('{End}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    const list = canvas.getByRole('tablist').getBoundingClientRect();
    await waitFor(() => {
      const tab = document.activeElement!.getBoundingClientRect();
      expect(tab.left).toBeGreaterThanOrEqual(list.left - 1);
      expect(tab.right).toBeLessThanOrEqual(list.right + 1);
    });
  },
};
