import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { MetadataList, MetadataListItem } from './MetadataList';

const meta = {
  title: 'Molecule/MetadataList',
  component: MetadataList,
  args: {
    children: [
      <MetadataListItem key="m" label="Model">
        Tata Ace
      </MetadataListItem>,
      <MetadataListItem key="y" label="Year">
        2021
      </MetadataListItem>,
    ],
  },
} satisfies Meta<typeof MetadataList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Model').tagName).toBe('DT');
    await expect(canvas.getByText('Tata Ace').tagName).toBe('DD');
  },
};

export const Columns: Story = {
  args: { columns: 2 },
  play: async ({ canvas }) => {
    const model = canvas.getByText('Model').getBoundingClientRect();
    const year = canvas.getByText('Year').getBoundingClientRect();
    await expect(model.top).toBe(year.top);
    await expect(year.left).toBeGreaterThan(model.left);
  },
};

export const EmptyValue: Story = {
  args: {
    children: [
      <MetadataListItem key="c" label="Color" />,
      <MetadataListItem key="p" label="Phone">
        {''}
      </MetadataListItem>,
      <MetadataListItem key="z" label="Seats">
        {0}
      </MetadataListItem>,
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('—')).toHaveLength(2);
    // Zero is a value, not an empty field.
    await expect(canvas.getByText('0').tagName).toBe('DD');
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
