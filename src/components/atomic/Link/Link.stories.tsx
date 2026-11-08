import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn } from 'storybook/test';

import { UIProvider } from '@/providers/UIProvider';

import { Link } from './Link';

const navigate = fn();

const meta = {
  title: 'Atomic/Link',
  component: Link,
  args: { href: '/vehicles', children: 'Vehicles' },
  decorators: [
    (Story, context) =>
      context.parameters.provider === false ? (
        Story()
      ) : (
        <UIProvider navigate={navigate}>{Story()}</UIProvider>
      ),
  ],
  beforeEach: () => {
    navigate.mockClear();
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: 'Vehicles' });
    await expect(link).toHaveAttribute('href', '/vehicles');
    await userEvent.click(link);
    await expect(navigate).toHaveBeenCalledWith('/vehicles');
  },
};

// Stops the browser actually following the link once React has handled the click.
const blockNativeNavigation = () =>
  document.addEventListener('click', event => event.preventDefault(), { once: true });

// Ctrl/Cmd/Shift-click and middle-click belong to the browser: new tab or window.
export const ModifiedClickIsNative: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Vehicles' });
    for (const init of [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
    ]) {
      blockNativeNavigation();
      await fireEvent.click(link, init);
    }
    await expect(navigate).not.toHaveBeenCalled();
  },
};

export const External: Story = {
  args: { href: 'https://ashwa.io/help', children: 'Help' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Help' });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    blockNativeNavigation();
    await fireEvent.click(link);
    await expect(navigate).not.toHaveBeenCalled();
  },
};

const prefixed = (href: string) => `/app${href}`;

// The anchor shows the resolved URL; the router still gets the app's own path.
export const UsesHref: Story = {
  parameters: { provider: false },
  decorators: [
    Story => (
      <UIProvider navigate={navigate} useHref={prefixed}>
        {Story()}
      </UIProvider>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: 'Vehicles' });
    await expect(link).toHaveAttribute('href', '/app/vehicles');
    await userEvent.click(link);
    await expect(navigate).toHaveBeenLastCalledWith('/vehicles');
  },
};

export const CallsOnClick: Story = {
  args: { onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('link', { name: 'Vehicles' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const WithoutProvider: Story = {
  parameters: { provider: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Vehicles' })).toHaveAttribute(
      'href',
      '/vehicles'
    );
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};

// Links can carry server data: a script URL must not become a live link.
export const UnsafeHrefIsBlocked: Story = {
  args: { href: 'javascript:alert(1)', children: 'Unsafe' },
  play: async ({ canvasElement, userEvent }) => {
    const link = canvasElement.querySelector('a')!;
    await expect(link).not.toHaveAttribute('href');
    await userEvent.click(link);
    await expect(navigate).not.toHaveBeenCalled();
  },
};
