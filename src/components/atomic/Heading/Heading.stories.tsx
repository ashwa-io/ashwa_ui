import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

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

export const Truncate: Story = {
  args: { truncate: true, children: 'A very long heading that cannot fit in the box' },
  decorators: [Story => <div className="w-40">{Story()}</div>],
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole('heading')).textOverflow).toBe('ellipsis');
  },
};
