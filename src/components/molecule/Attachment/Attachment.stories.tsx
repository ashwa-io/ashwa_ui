import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Attachment, AttachmentGroup } from './Attachment';
import type { AttachmentState } from './Attachment';

const STATES: AttachmentState[] = ['idle', 'uploading', 'processing', 'error', 'done'];

// A 1x1 grey PNG, so no story depends on the network.
const IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const meta = {
  title: 'Molecule/Attachment',
  component: Attachment,
  args: { name: 'a.pdf', description: '2.4 MB' },
} satisfies Meta<typeof Attachment>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Done: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('a.pdf')).toBeVisible();
    await expect(canvas.getByText('2.4 MB')).toBeVisible();
    await expect(canvas.queryByRole('progressbar')).toBeNull();
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      {STATES.map(state => (
        <Attachment
          key={state}
          name={`${state}.pdf`}
          description={state === 'error' ? 'Upload failed' : '2.4 MB'}
          state={state}
          progress={40}
        />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Upload failed')).toBeVisible();
  },
};

// Same states in dark mode, so the a11y check covers the error tint on dark surfaces.
export const AllStatesDark: Story = {
  ...AllStates,
  globals: { theme: 'dark' },
};

export const UploadingShowsProgress: Story = {
  args: { state: 'uploading', progress: 40 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Uploading a.pdf' })).toHaveAttribute(
      'aria-valuenow',
      '40'
    );
  },
};

export const UnknownProgress: Story = {
  args: { state: 'uploading' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  },
};

export const RemoveAndRetry: Story = {
  args: { state: 'error', onRemove: fn(), onRetry: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Retry a.pdf' }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove a.pdf' }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

export const RetryOnlyOnError: Story = {
  args: { onRetry: fn() },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Retry a.pdf' })).toBeNull();
  },
};

export const Opens: Story = {
  args: { onOpen: fn(), onRemove: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open a.pdf' }));
    await expect(args.onOpen).toHaveBeenCalledOnce();
    // Remove sits above the open area, so it never opens the file.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove a.pdf' }));
    await expect(args.onOpen).toHaveBeenCalledOnce();
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

export const ImageThumbnail: Story = {
  args: { imageSrc: IMAGE },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('img')).toHaveAttribute('src', IMAGE);
  },
};

export const Vertical: Story = {
  args: { imageSrc: IMAGE, orientation: 'vertical', onRemove: fn() },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Attachment name="xs.pdf" size="xs" />
      <Attachment name="sm.pdf" size="sm" />
      <Attachment name="md.pdf" size="md" />
    </div>
  ),
};

export const LongNameKeepsActions: Story = {
  args: {
    name: 'a-very-long-file-name-that-cannot-possibly-fit-inside-this-small-tile.pdf',
    onRemove: fn(),
    'data-testid': 'tile',
  },
  decorators: [Story => <div className="w-60">{Story()}</div>],
  play: async ({ canvas }) => {
    const tile = canvas.getByTestId('tile').getBoundingClientRect();
    const remove = canvas.getByRole('button', { name: /^Remove/ }).getBoundingClientRect();
    await expect(remove.right).toBeLessThanOrEqual(tile.right);
    await expect(remove.top).toBeLessThan(tile.top + tile.height / 2);
  },
};

// Nothing inside is focusable, so the strip needs its own tab stop for keyboard scrolling.
export const GroupScrolls: Story = {
  render: () => (
    <div className="w-64">
      <AttachmentGroup data-testid="group">
        {Array.from({ length: 6 }, (_, index) => (
          <Attachment key={index} name={`file-${index}.pdf`} />
        ))}
      </AttachmentGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByTestId('group');
    // Without scroll timelines the primitive's fade would sit over the last tile for good.
    await expect(group.className).toContain(
      'not-supports-[animation-timeline:scroll()]:scroll-fade-none'
    );
    await waitFor(() => expect(group.scrollWidth).toBeGreaterThan(group.clientWidth));
    await waitFor(() => expect(group).toHaveAttribute('tabindex', '0'));
  },
};

// Upload trays stack tiles: each fills the row whatever the length of its name.
export const FullWidth: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Attachment name="a.pdf" fullWidth data-testid="short" />
      <Attachment name="a-much-longer-file-name.pdf" fullWidth data-testid="long" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('short').getBoundingClientRect().width).toBe(320);
    await expect(canvas.getByTestId('long').getBoundingClientRect().width).toBe(320);
  },
};
