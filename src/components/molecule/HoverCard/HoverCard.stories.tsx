import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import { Button } from '@/components/atomic/Button';

import { HoverCard } from './HoverCard';

const DETAIL = 'Last seen five minutes ago';

const meta = {
  title: 'Molecule/HoverCard',
  component: HoverCard,
  args: { content: DETAIL, children: <Button variant="secondary">KA01AB1234</Button> },
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OpensOnHover: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'KA01AB1234' });
    await userEvent.hover(trigger);
    await expect(await screen.findByText(DETAIL, {}, { timeout: 3000 })).toBeVisible();
    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByText(DETAIL)).toBeNull(), { timeout: 3000 });
  },
};

export const OpensOnFocus: Story = {
  play: async ({ userEvent }) => {
    await userEvent.tab();
    await expect(await screen.findByText(DETAIL, {}, { timeout: 3000 })).toBeVisible();
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByText(DETAIL)).toBeNull(), { timeout: 3000 });
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole('button', { name: 'KA01AB1234' }));
    await expect(await screen.findByText(DETAIL, {}, { timeout: 3000 })).toBeVisible();
  },
};
