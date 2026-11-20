import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Drawer } from '@/components/molecule/Drawer';

import { UploadPill } from './UploadPill';
import type { UploadPillItem } from './UploadPill';

const uploading: UploadPillItem[] = [
  { id: 'done', name: 'service-estimate.jpg', state: 'done' },
  { id: 'moving', name: 'garage-bill-november.jpg', state: 'uploading', progress: 60 },
  { id: 'waiting', name: 'IMG_4471.jpg', state: 'processing' },
];

const meta = {
  title: 'Molecule/UploadPill',
  component: UploadPill,
  args: { items: uploading, onCancel: fn(), onRetry: fn(), onRemove: fn() },
  // The pill is fixed to the window; give the story a window worth of room.
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => (
      <div className="h-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UploadPill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Uploading: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // One done of three: it is on the second, and the two that count are at 100 and 60.
    const pill = canvas.getByRole('button', { name: /Uploading 2 of 3/ });
    await expect(pill).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('53%')).toBeVisible();

    await userEvent.click(pill);
    await expect(pill).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Uploading 60%')).toBeVisible();
    await expect(canvas.getByText('Preparing…')).toBeVisible();

    // The X stops a file that is still moving and clears one that has arrived.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove garage-bill-november.jpg' }));
    await waitFor(() => expect(args.onCancel).toHaveBeenCalledWith('moving'));
    await userEvent.click(canvas.getByRole('button', { name: 'Remove service-estimate.jpg' }));
    await waitFor(() => expect(args.onRemove).toHaveBeenCalledWith('done'));
  },
};

export const Dark: Story = { globals: { theme: 'dark' } };

// A failure opens the pill by itself: the user must not have to look for it.
export const Failed: Story = {
  args: {
    items: [
      { id: 'done', name: 'service-estimate.jpg', state: 'done' },
      { id: 'failed', name: 'tyre-invoice.pdf', state: 'error' },
    ],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /1 file failed/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    await expect(canvas.getByText('Upload failed')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Retry tyre-invoice.pdf' }));
    await waitFor(() => expect(args.onRetry).toHaveBeenCalledWith('failed'));
  },
};

// Files are attached from forms in drawers: the pill must stay readable and usable over one,
// and using it must not close the form.
const onDrawerClose = fn();

export const OverDrawer: Story = {
  render: args => (
    <>
      <Drawer open onClose={onDrawerClose} title="Log service" size="lg">
        Bill photos
      </Drawer>
      <UploadPill {...args} />
    </>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const pill = canvas.getByRole('button', { name: /Uploading 2 of 3/ });
    // What the window shows at the pill's centre is the pill, not the drawer's dimming layer.
    const box = pill.getBoundingClientRect();
    const onTop = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
    await expect(pill.contains(onTop)).toBe(true);
    await userEvent.click(pill);
    await expect(pill).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove garage-bill-november.jpg' }));
    await waitFor(() => expect(args.onCancel).toHaveBeenCalledWith('moving'));
    await expect(onDrawerClose).not.toHaveBeenCalled();
  },
};

export const AllAttached: Story = {
  args: {
    items: [
      { id: 'a', name: 'service-estimate.jpg', state: 'done' },
      { id: 'b', name: 'garage-bill-november.jpg', state: 'done' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /2 files attached/ })).toBeVisible();
  },
};

export const Empty: Story = {
  args: { items: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole('button')).toBeNull();
  },
};
