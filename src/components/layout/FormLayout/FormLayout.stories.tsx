import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { TextInput } from '@/components/atomic/TextInput';

import { FormLayout } from './FormLayout';

const fields = [
  <TextInput key="first" label="First name" value="" onChange={fn()} />,
  <TextInput key="last" label="Last name" value="" onChange={fn()} />,
];

const meta = {
  title: 'Layout/FormLayout',
  component: FormLayout,
  args: { children: fields, 'data-testid': 'form-layout' },
} satisfies Meta<typeof FormLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByTestId('form-layout')).flexDirection).toBe('column');
  },
};

// Side by side from sm up, one equal column per field.
export const Horizontal: Story = {
  args: { direction: 'horizontal' },
  play: async ({ canvas }) => {
    const first = canvas.getByRole('textbox', { name: 'First name' }).getBoundingClientRect();
    const last = canvas.getByRole('textbox', { name: 'Last name' }).getBoundingClientRect();
    await expect(first.top).toBe(last.top);
    await expect(Math.abs(first.width - last.width)).toBeLessThanOrEqual(1);
  },
};
