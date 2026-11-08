import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button } from '@/components/atomic/Button';
import { UIProvider } from '@/providers/UIProvider';

import { TopNav } from './TopNav';

const navigate = fn();

const Logo: React.FC = () => <span className="bg-brand block size-8 rounded-md" />;

const meta = {
  title: 'Organism/TopNav',
  component: TopNav,
  args: { title: 'Fleet', logo: <Logo /> },
  decorators: [Story => <UIProvider navigate={navigate}>{Story()}</UIProvider>],
  beforeEach: () => {
    navigate.mockClear();
  },
} satisfies Meta<typeof TopNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('banner').getBoundingClientRect().height).toBe(56);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Fleet' })).toBeVisible();
  },
};

export const LogoLink: Story = {
  args: { logoHref: '/platform' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('link', { name: 'Go to home' }));
    await expect(navigate).toHaveBeenCalledWith('/platform');
  },
};

export const EndContent: Story = {
  args: { endContent: <Button size="sm">Account</Button> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Account' })).toBeVisible();
  },
};

// A long title truncates; the right-hand controls stay on screen.
export const LongTitle: Story = {
  args: {
    title: 'A very long organisation name that cannot possibly fit in this narrow header',
    endContent: <Button size="sm">Account</Button>,
  },
  decorators: [Story => <div className="w-80">{Story()}</div>],
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner').getBoundingClientRect();
    const end = canvas.getByRole('button', { name: 'Account' }).getBoundingClientRect();
    await expect(end.right).toBeLessThanOrEqual(header.right);
  },
};

export const Dark: Story = {
  args: { logoHref: '/platform', endContent: <Button size="sm">Account</Button> },
  globals: { theme: 'dark' },
};
