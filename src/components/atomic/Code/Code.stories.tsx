import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Code } from './Code';

const meta = {
  title: 'Atomic/Code',
  component: Code,
  args: { children: '861234567890123' },
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InlineInText: Story = {
  render: args => (
    <p className="text-[20px]">
      IMEI <Code {...args} /> is online
    </p>
  ),
  play: async ({ canvas }) => {
    const code = canvas.getByText('861234567890123');
    await expect(code.tagName).toBe('CODE');
    await expect(getComputedStyle(code).fontSize).toBe('17px');
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
