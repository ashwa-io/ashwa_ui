import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { FileDropzone } from './FileDropzone';

const bill = () => new File(['bill'], 'garage-bill.jpg', { type: 'image/jpeg' });
const invoice = () => new File(['invoice'], 'tyre-invoice.pdf', { type: 'application/pdf' });

// A real browser only hands files to a real event built with a real DataTransfer, so these are dispatched by hand.
const carrying = (...files: File[]): DataTransfer => {
  const transfer = new DataTransfer();
  files.forEach(file => transfer.items.add(file));
  return transfer;
};
const dropOn = (target: Element, ...files: File[]) =>
  target.dispatchEvent(
    new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: carrying(...files) })
  );
const pasteOnPage = (...files: File[]) =>
  document.dispatchEvent(
    new ClipboardEvent('paste', { bubbles: true, clipboardData: carrying(...files) })
  );

const meta = {
  title: 'Molecule/FileDropzone',
  component: FileDropzone,
  args: {
    onFiles: fn(),
    hint: 'JPG, PNG, WebP or PDF',
    'aria-label': 'Bill photos or PDF',
    'data-testid': 'dropzone',
  },
} satisfies Meta<typeof FileDropzone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(canvas.getByTestId('dropzone-input'), bill());
    await waitFor(() => expect(args.onFiles).toHaveBeenCalledTimes(1));
    expect(args.onFiles).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'garage-bill.jpg' }),
    ]);
  },
};

export const Dark: Story = { globals: { theme: 'dark' } };

export const Multiple: Story = {
  args: { multiple: true, camera: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Choose files' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Take photo' })).toBeVisible();
    dropOn(canvas.getByTestId('dropzone'), bill(), invoice());
    await waitFor(() => expect(args.onFiles).toHaveBeenCalledTimes(1));
    expect(args.onFiles).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'garage-bill.jpg' }),
      expect.objectContaining({ name: 'tyre-invoice.pdf' }),
    ]);
  },
};

// Without `multiple`, a drop of two keeps the first: the caller asked for one file.
export const SingleKeepsFirst: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    dropOn(canvas.getByTestId('dropzone'), bill(), invoice());
    await waitFor(() => expect(args.onFiles).toHaveBeenCalledTimes(1));
    expect(args.onFiles).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'garage-bill.jpg' }),
    ]);
  },
};

export const Paste: Story = {
  args: { paste: true, multiple: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Drop files here, or paste a screenshot')).toBeVisible();
    pasteOnPage(bill());
    await waitFor(() => expect(args.onFiles).toHaveBeenCalledTimes(1));
    // Pasted text has no files and is left for whatever field has focus.
    pasteOnPage();
    expect(args.onFiles).toHaveBeenCalledTimes(1);
  },
};

export const Disabled: Story = {
  args: { disabled: true, multiple: true },
  // A switched-off dropzone is dimmed like any disabled control, so its contrast is not judged.
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Choose files' })).toBeDisabled();
    dropOn(canvas.getByTestId('dropzone'), bill());
    expect(args.onFiles).not.toHaveBeenCalled();
  },
};
