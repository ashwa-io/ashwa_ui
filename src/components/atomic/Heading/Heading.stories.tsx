import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';

import { Heading, type HeadingLevel } from './Heading';

const LEVELS: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

const meta = {
  title: 'Atomic/Heading',
  component: Heading,
  args: { children: 'Vehicles', level: 2 },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {LEVELS.map(level => (
        <Heading key={level} level={level}>
          Heading {level}
        </Heading>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 4 })).toHaveTextContent('Heading 4');
  },
};

export const LevelsDark: Story = {
  ...Levels,
  globals: { theme: 'dark' },
};

const LONG = 'A very long heading that cannot fit in the box';
const TIP = { selector: '[data-slot="tooltip-content"]' };

// Gives a tooltip that would open a moment to do so, so its absence means something.
const settle = () => new Promise(resolve => setTimeout(resolve, 150));

// A cut-off heading shows its full text in a tooltip on hover.
export const Truncate: Story = {
  args: { truncate: true, children: LONG },
  decorators: [Story => <div className="w-40">{Story()}</div>],
  play: async ({ canvas, userEvent }) => {
    const heading = canvas.getByRole('heading', { name: LONG });
    await expect(getComputedStyle(heading).textOverflow).toBe('ellipsis');
    await userEvent.hover(heading);
    // The popup fades in; wait until it is visible rather than checking mid-animation.
    const tip = await screen.findByText(LONG, TIP);
    await waitFor(() => expect(tip).toBeVisible());
  },
};

// A heading that fits has nothing to reveal, so hovering it shows no tooltip.
export const TruncateFits: Story = {
  args: { truncate: true, children: 'Vehicles' },
  decorators: [Story => <div className="w-40">{Story()}</div>],
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole('heading', { name: 'Vehicles' }));
    await settle();
    await expect(screen.queryByText('Vehicles', TIP)).not.toBeInTheDocument();
  },
};

// Without truncate the heading wraps, and no tooltip machinery is rendered at all.
export const NoTruncateNoTooltip: Story = {
  args: { children: LONG },
  decorators: [Story => <div className="w-40">{Story()}</div>],
  play: async ({ canvas, userEvent }) => {
    const heading = canvas.getByRole('heading', { name: LONG });
    await expect(heading).not.toHaveAttribute('data-base-ui-tooltip-trigger');
    await userEvent.hover(heading);
    await settle();
    await expect(screen.queryByText(LONG, TIP)).not.toBeInTheDocument();
  },
};
