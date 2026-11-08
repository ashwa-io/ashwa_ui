import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Timestamp } from './Timestamp';

const VALUE = '2026-11-08T14:30:00Z';

const meta = {
  title: 'Atomic/Timestamp',
  component: Timestamp,
  args: { value: VALUE, 'data-testid': 'time' },
} satisfies Meta<typeof Timestamp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DateAndTime: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('time').textContent).toContain('2026');
    await expect(canvas.getByTestId('time').textContent).toMatch(/\d:\d\d/);
  },
};

export const DateOnly: Story = {
  args: { format: 'date' },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('time').textContent).toContain('2026');
    await expect(canvas.getByTestId('time').textContent).not.toMatch(/\d:\d\d/);
  },
};

export const TimeOnly: Story = {
  args: { format: 'time' },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('time').textContent).toMatch(/\d:\d\d/);
    await expect(canvas.getByTestId('time').textContent).not.toContain('2026');
  },
};

export const MachineReadable: Story = {
  play: async ({ canvas }) => {
    const time = canvas.getByTestId('time');
    await expect(time.tagName).toBe('TIME');
    await expect(time).toHaveAttribute('datetime', '2026-11-08T14:30:00.000Z');
  },
};

export const AcceptsNumbersAndDates: Story = {
  render: () => (
    <div>
      <Timestamp value={Date.UTC(2026, 10, 8)} format="date" data-testid="number" />
      <Timestamp value={new Date(Date.UTC(2026, 10, 8))} format="date" data-testid="date" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('number').textContent).toContain('2026');
    await expect(canvas.getByTestId('date').textContent).toContain('2026');
  },
};

// Bad data from the API must not take the page down.
export const InvalidValueShowsDash: Story = {
  args: { value: 'not a date' },
  play: async ({ canvas }) => {
    const time = canvas.getByTestId('time');
    await expect(time).toHaveTextContent('—');
    await expect(time).not.toHaveAttribute('datetime');
  },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
