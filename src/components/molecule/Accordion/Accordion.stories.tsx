import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, waitFor } from 'storybook/test';

import { Accordion } from './Accordion';
import type { AccordionItem } from './Accordion';

const items: AccordionItem[] = [
  { value: 'device', title: 'Device', content: 'IMEI and firmware' },
  { value: 'driver', title: 'Driver', content: 'Name and licence' },
  { value: 'locked', title: 'Billing', content: 'Plan and invoices', disabled: true },
];

const meta = {
  title: 'Molecule/Accordion',
  component: Accordion,
  args: { items },
  decorators: [Story => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Device' }));
    await expect(await canvas.findByText('IMEI and firmware')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Driver' }));
    await expect(await canvas.findByText('Name and licence')).toBeVisible();
    await waitFor(() => expect(canvas.queryByText('IMEI and firmware')).toBeNull());
  },
};

export const Multiple: Story = {
  args: { multiple: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Device' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Driver' }));
    await expect(await canvas.findByText('IMEI and firmware')).toBeVisible();
    await expect(await canvas.findByText('Name and licence')).toBeVisible();
  },
};

export const DefaultOpen: Story = {
  args: { defaultValue: ['driver'] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Name and licence')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Driver' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  },
};

export const DisabledItem: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Billing' });
    await expect(trigger).toBeDisabled();
    await fireEvent.click(trigger);
    await expect(canvas.queryByText('Plan and invoices')).toBeNull();
  },
};

export const KeyboardToggles: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Device' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(await canvas.findByText('IMEI and firmware')).toBeVisible();
  },
};

export const Dark: Story = {
  args: { defaultValue: ['device'] },
  globals: { theme: 'dark' },
};
