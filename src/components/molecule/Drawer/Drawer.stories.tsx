import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { Button } from '@/components/atomic/Button';

import { Drawer } from './Drawer';

const TALL = <div className="h-[1500px]">Tall content</div>;

const body = () => document.querySelector<HTMLElement>('[data-slot="drawer-body"]')!;
const panel = () => document.querySelector<HTMLElement>('[data-slot="sheet-content"]')!;

const meta = {
  title: 'Molecule/Drawer',
  component: Drawer,
  args: { open: true, onClose: fn(), title: 'Vehicle details', children: 'Body' },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: 'Registration and device', footer: <Button>Save</Button> },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Vehicle details' });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog).toHaveAttribute('data-side', 'right');
    await expect(screen.getByRole('button', { name: 'Save' })).toBeVisible();
  },
};

export const LeftSide: Story = {
  args: { side: 'left' },
  play: async () => {
    await expect(await screen.findByRole('dialog')).toHaveAttribute('data-side', 'left');
  },
};

export const ClosesOnEscape: Story = {
  play: async ({ args, userEvent }) => {
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
};

const WithOpener: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Vehicle details">
        Body
      </Drawer>
    </>
  );
};

export const ReturnsFocus: Story = {
  render: () => <WithOpener />,
  play: async ({ canvas, userEvent }) => {
    const opener = canvas.getByRole('button', { name: 'Open' });
    await userEvent.click(opener);
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

export const BodyScrollsToEdge: Story = {
  args: { children: TALL },
  play: async () => {
    await screen.findByRole('dialog');
    await waitFor(() => expect(body().scrollHeight).toBeGreaterThan(body().clientHeight));
    await waitFor(() =>
      expect(body().getBoundingClientRect().right).toBe(panel().getBoundingClientRect().right)
    );
    await waitFor(() => expect(body()).toHaveAttribute('tabindex', '0'));
  },
};

export const PhoneFits: Story = {
  args: { children: TALL },
  globals: { viewport: { value: 'mobile2' } },
  play: async () => {
    await screen.findByRole('dialog');
    await waitFor(() => {
      const rect = panel().getBoundingClientRect();
      expect(rect.left).toBeGreaterThanOrEqual(0);
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    });
  },
};

export const Flush: Story = {
  args: { flush: true },
  play: async () => {
    await screen.findByRole('dialog');
    await expect(getComputedStyle(body()).paddingLeft).toBe('0px');
    await expect(getComputedStyle(body()).maskImage).toBe('none');
  },
};

export const ScrollFade: Story = {
  args: { children: TALL },
  play: async () => {
    await screen.findByRole('dialog');
    await waitFor(() => expect(body()).toHaveAttribute('tabindex', '0'));
    await expect(getComputedStyle(body()).maskImage).not.toBe('none');
  },
};

export const Dark: Story = {
  args: { description: 'Registration and device', footer: <Button>Save</Button> },
  globals: { theme: 'dark' },
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog).toBeVisible());
  },
};

const LateContent: React.FC = () => {
  const [tall, setTall] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTall(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Drawer open onClose={() => undefined} title="Vehicle details">
      {tall ? TALL : null}
    </Drawer>
  );
};

// Bodies often fill in after opening: keyboard scrolling must still work.
export const LateContentGetsTabStop: Story = {
  render: () => <LateContent />,
  play: async () => {
    await screen.findByRole('dialog');
    await waitFor(() => expect(body()).toHaveAttribute('tabindex', '0'), { timeout: 3000 });
  },
};

export const FooterIsInline: Story = {
  args: {
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
  },
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog).toBeVisible());
    const cancel = screen.getByRole('button', { name: 'Cancel' }).getBoundingClientRect();
    const save = screen.getByRole('button', { name: 'Save' }).getBoundingClientRect();
    await expect(cancel.top).toBe(save.top);
    await expect(save.left).toBeGreaterThan(cancel.left);
  },
};

// The scroller clips: a first control's focus ring needs room inside it.
export const FirstControlRingHasRoom: Story = {
  play: async () => {
    await screen.findByRole('dialog');
    await expect(getComputedStyle(body()).paddingTop).toBe('4px');
  },
};
