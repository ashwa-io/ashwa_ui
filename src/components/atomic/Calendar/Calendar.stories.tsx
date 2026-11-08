import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Calendar } from './Calendar';
import type { CalendarProps } from './Calendar';

const Controlled: React.FC<CalendarProps> = props => {
  const [value, setValue] = useState(props.value);

  return (
    <Calendar
      {...props}
      value={value}
      onChange={next => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
};

const tint = () => {
  const probe = document.createElement('div');
  probe.className = 'bg-brand-tint';
  document.body.append(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
};

const day = (n: number) => new RegExp(`^${n} November 2026`);

const meta = {
  title: 'Atomic/Calendar',
  component: Calendar,
  args: { value: '2026-11-08', onChange: fn() },
  render: args => <Controlled {...args} />,
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('grid')).toBeVisible();
    await expect(canvas.getByRole('button', { name: day(8) })).toBeVisible();
  },
};

export const Selects: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: day(15) }));
    await expect(args.onChange).toHaveBeenCalledWith('2026-11-15');
  },
};

// Clicking the selected day must not clear it.
export const ReselectingKeepsValue: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: day(8) }));
    await expect(canvasElement.querySelector('[data-selected-single="true"]')).not.toBeNull();
  },
};

export const SelectedIsTinted: Story = {
  play: async ({ canvasElement }) => {
    const selected = canvasElement.querySelector('[data-selected-single="true"]')!;
    await waitFor(() => expect(getComputedStyle(selected).backgroundColor).toBe(tint()));
  },
};

export const RespectsMinMax: Story = {
  args: { min: '2026-11-05', max: '2026-11-20' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: day(4) })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: day(21) })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: day(5) })).toBeEnabled();
  },
};

export const InvalidValueIsEmpty: Story = {
  args: { value: 'nope' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('grid')).toBeVisible();
    await expect(canvasElement.querySelector('[data-selected-single="true"]')).toBeNull();
  },
};

export const KeyboardMoves: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: day(8) }));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('button', { name: day(9) })).toHaveFocus());
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
