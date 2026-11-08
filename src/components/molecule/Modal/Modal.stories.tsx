import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { Button } from '@/components/atomic/Button';
import { Text } from '@/components/atomic/Text';
import { TextInput } from '@/components/atomic/TextInput';

import { Modal, type ModalProps } from './Modal';

// Controlled like the app: an Open button sets state, onClose clears it.
const Demo: React.FC<Omit<ModalProps, 'open'>> = props => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal
        {...props}
        open={open}
        onClose={() => {
          setOpen(false);
          props.onClose();
        }}
      />
    </>
  );
};

const LONG_BODY = Array.from({ length: 40 }, (_, i) => (
  <Text key={i} size="sm">
    Vehicle {i + 1}
  </Text>
));

const meta = {
  title: 'Molecule/Modal',
  component: Modal,
  args: {
    open: false,
    onClose: fn(),
    title: 'Edit vehicle',
    description: 'Changes apply to every portal.',
    children: <Text size="sm">Body content</Text>,
  },
  render: args => <Demo {...args} />,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

const openModal = async (
  canvas: { getByRole: typeof screen.getByRole },
  userEvent: {
    click: (element: Element) => Promise<void>;
  }
) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
  return screen.findByRole('dialog', { name: 'Edit vehicle' });
};

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const dialog = await openModal(canvas, userEvent);
    await expect(dialog).toHaveAccessibleDescription('Changes apply to every portal.');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const EscapeCloses: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await openModal(canvas, userEvent);
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

// Closing puts focus back on the button that opened it.
export const ReturnsFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    await openModal(canvas, userEvent);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Open' })).toHaveFocus();
  },
};

// Blocking flows: no close button, Escape and outside clicks do nothing.
export const NotClosable: Story = {
  args: { closable: false },
  play: async ({ args, canvas, userEvent }) => {
    await openModal(canvas, userEvent);
    await expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    await userEvent.keyboard('{Escape}');
    await userEvent.click(document.body);
    await expect(args.onClose).not.toHaveBeenCalled();
    await expect(screen.getByRole('dialog', { name: 'Edit vehicle' })).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  args: { size: 'sm' },
  play: async ({ canvas, userEvent }) => {
    const dialog = await openModal(canvas, userEvent);
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(448);
  },
};

// Fixed height: the body scrolls, header and footer stay in place.
export const FixedHeight: Story = {
  args: { fixedHeight: true, children: LONG_BODY, footer: <Button>Save</Button> },
  play: async ({ canvas, userEvent }) => {
    await openModal(canvas, userEvent);
    const body = document.querySelector('[data-slot="modal-body"]')!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeVisible());
  },
};

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    await openModal(canvas, userEvent);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeVisible());
  },
};

export const Dark: Story = {
  ...WithFooter,
  globals: { theme: 'dark' },
};

// Long content never pushes the dialog off-screen: the body scrolls instead.
export const LongContentFits: Story = {
  args: {
    children: (
      <>
        {LONG_BODY}
        <Button>Load more</Button>
      </>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    const dialog = await openModal(canvas, userEvent);
    await waitFor(() =>
      expect(dialog.getBoundingClientRect().height).toBeLessThanOrEqual(window.innerHeight)
    );
  },
};

// Long text with nothing focusable: the body itself takes a tab stop so keyboards can scroll it.
export const TextOnlyLongBody: Story = {
  args: { children: LONG_BODY },
  play: async ({ canvas, userEvent }) => {
    await openModal(canvas, userEvent);
    const body = document.querySelector('[data-slot="modal-body"]')!;
    await waitFor(() => expect(body).toHaveAttribute('tabindex', '0'));
  },
};

// A picker's search field gets first focus; the scrolling body must not take it.
export const FixedHeightFocusesFirstInput: Story = {
  args: {
    fixedHeight: true,
    children: (
      <>
        <TextInput label="Search devices" value="" onChange={fn()} />
        {LONG_BODY}
      </>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    await openModal(canvas, userEvent);
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Search devices' })).toHaveFocus()
    );
    await expect(document.querySelector('[data-slot="modal-body"]')).not.toHaveAttribute(
      'tabindex'
    );
  },
};

// The body scrolls, so it clips; a field's 3px focus ring must still fit inside it.
export const FocusRingNotClipped: Story = {
  args: { children: <TextInput label="Name" value="" onChange={fn()} /> },
  play: async ({ canvas, userEvent }) => {
    await openModal(canvas, userEvent);
    const body = document.querySelector('[data-slot="modal-body"]')!.getBoundingClientRect();
    const input = screen.getByRole('textbox', { name: 'Name' }).getBoundingClientRect();
    await expect(input.left - body.left).toBeGreaterThanOrEqual(3);
    await expect(body.right - input.right).toBeGreaterThanOrEqual(3);
  },
};

// Lists and tables run edge to edge: no gap on any side.
export const Flush: Story = {
  args: { flush: true, children: <div data-testid="edge">Row</div> },
  play: async ({ canvas, userEvent }) => {
    const dialog = (await openModal(canvas, userEvent)).getBoundingClientRect();
    const edge = screen.getByTestId('edge').getBoundingClientRect();
    await expect(Math.abs(edge.left - dialog.left)).toBeLessThanOrEqual(1);
    await expect(Math.abs(dialog.right - edge.right)).toBeLessThanOrEqual(1);
    await expect(Math.abs(dialog.bottom - edge.bottom)).toBeLessThanOrEqual(1);
  },
};
