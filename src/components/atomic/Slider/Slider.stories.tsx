import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Slider } from './Slider';
import type { SliderProps } from './Slider';

const Controlled: React.FC<SliderProps> = props => {
  const [value, setValue] = useState(props.value);

  return (
    <Slider
      {...props}
      value={value}
      onChange={next => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
};

const meta = {
  title: 'Atomic/Slider',
  component: Slider,
  args: { label: 'Playback position', value: 40, onChange: fn() },
  render: args => <Controlled {...args} />,
  decorators: [Story => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider', { name: 'Playback position' });
    await expect(slider).toHaveAttribute('aria-valuenow', '40');
    await expect(canvas.getAllByRole('slider')).toHaveLength(1);
  },
};

export const HiddenLabelKeepsName: Story = {
  args: { hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('slider', { name: 'Playback position' })).toBeInTheDocument();
  },
};

export const Keyboard: Story = {
  args: { onCommit: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('slider')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith(41));
    await waitFor(() => expect(args.onCommit).toHaveBeenCalledWith(41));
  },
};

export const Bounds: Story = {
  args: { min: 10, max: 20, step: 5, value: 15 },
  play: async ({ args, canvas, userEvent }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toHaveAttribute('min', '10');
    await expect(slider).toHaveAttribute('max', '20');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith(20));
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  // Disabled controls are exempt from contrast (WCAG 1.4.3); axe can't tie this label to the input.
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('slider')).toBeDisabled();
  },
};

export const WithError: Story = {
  args: { error: 'Pick a position' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Pick a position')).toBeVisible();
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
