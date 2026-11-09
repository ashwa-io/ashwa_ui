import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { SelectableCard } from './SelectableCard';
import type { SelectableCardProps } from './SelectableCard';

const Controlled: React.FC<SelectableCardProps> = props => {
  const [selected, setSelected] = useState(props.selected);

  return (
    <SelectableCard
      {...props}
      selected={selected}
      onChange={next => {
        setSelected(next);
        props.onChange(next);
      }}
    />
  );
};

const secondary = () => {
  const probe = document.createElement('div');
  probe.className = 'bg-secondary';
  document.body.append(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
};

const meta = {
  title: 'Atomic/SelectableCard',
  component: SelectableCard,
  args: { label: 'Tracking', selected: false, onChange: fn(), children: 'Tracking' },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof SelectableCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Tracking' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  },
};

export const Selected: Story = {
  args: { selected: true },
  play: async ({ canvas }) => {
    const card = canvas.getByRole('button', { name: 'Tracking' });
    await expect(card).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(getComputedStyle(card).backgroundColor).toBe(secondary()));
  },
};

export const SelectedKeepsColourOnHover: Story = {
  args: { selected: true },
  play: async ({ canvas, userEvent }) => {
    const card = canvas.getByRole('button', { name: 'Tracking' });
    await userEvent.hover(card);
    await waitFor(() => expect(getComputedStyle(card).backgroundColor).toBe(secondary()));
  },
};

export const Toggles: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const card = canvas.getByRole('button', { name: 'Tracking' });
    await userEvent.click(card);
    await expect(args.onChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(card);
    await expect(args.onChange).toHaveBeenLastCalledWith(false);
  },
};

export const KeyboardToggles: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Tracking' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Tracking' })).toBeDisabled();
  },
};

export const Dark: Story = {
  args: { selected: true },
  globals: { theme: 'dark' },
};
