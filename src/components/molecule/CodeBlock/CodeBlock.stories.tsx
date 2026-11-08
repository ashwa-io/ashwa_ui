import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { CodeBlock } from './CodeBlock';

const CODE = 'AT+RESET\nAT+GPS=1';
const LONG = `AT+DATA=${'x'.repeat(600)}`;

const writeText = fn(async (text: string) => {
  await Promise.resolve(text);
});

// Shadows the browser's clipboard on the instance; deleting it restores the original.
const stubClipboard = (value: unknown) => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value });
  return () => {
    delete (navigator as { clipboard?: unknown }).clipboard;
  };
};

const meta = {
  title: 'Molecule/CodeBlock',
  component: CodeBlock,
  args: { code: CODE },
  decorators: [Story => <div className="w-80">{Story()}</div>],
  beforeEach: () => {
    writeText.mockClear();
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('pre')).toHaveTextContent('AT+RESET');
    await expect(canvas.getByRole('button', { name: 'Copy code' })).toBeVisible();
  },
};

export const Copies: Story = {
  beforeEach: () => stubClipboard({ writeText }),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Copy code' }));
    await expect(writeText).toHaveBeenCalledWith(CODE);
    await expect(await canvas.findByRole('button', { name: 'Copied' })).toBeVisible();
  },
};

// navigator.clipboard is undefined on plain http: nothing throws, and it doesn't claim success.
export const CopyWithoutClipboard: Story = {
  beforeEach: () => stubClipboard(undefined),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Copy code' }));
    await expect(canvas.getByRole('button', { name: 'Copy code' })).toBeVisible();
  },
};

export const Wrapped: Story = {
  args: { code: LONG, wrap: true },
  play: async ({ canvasElement }) => {
    const pre = canvasElement.querySelector('pre')!;
    await expect(pre.scrollWidth).toBeLessThanOrEqual(pre.clientWidth);
  },
};

// Line numbers stay out of what a person selects and copies.
export const LineNumbers: Story = {
  args: { lineNumbers: true },
  play: async ({ canvasElement }) => {
    const numbers = canvasElement.querySelectorAll('[data-line-number]');
    await expect(numbers).toHaveLength(2);
    await expect(getComputedStyle(numbers[0]!).userSelect).toBe('none');
    await expect(numbers[0]).toHaveAttribute('aria-hidden', 'true');
  },
};

export const LongLineScrollsInside: Story = {
  args: { code: LONG },
  play: async ({ canvasElement }) => {
    const pre = canvasElement.querySelector('pre')!;
    await expect(pre.scrollWidth).toBeGreaterThan(pre.clientWidth);
    await waitFor(() => expect(pre).toHaveAttribute('tabindex', '0'));
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Dark: Story = {
  args: { lineNumbers: true },
  globals: { theme: 'dark' },
};
