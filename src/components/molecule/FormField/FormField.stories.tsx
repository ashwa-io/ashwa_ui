import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { FormField, type FormFieldControlProps } from './FormField';

// Stories use a plain input; the public inputs pass the same props by name.
const renderInput = (control: FormFieldControlProps) => (
  <input {...control} className="border-input h-8 rounded-lg border px-2.5 text-sm" />
);

const meta = {
  title: 'Molecule/FormField',
  component: FormField,
  args: { label: 'Name', children: renderInput },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

const describedByIdsExist = (element: HTMLElement) =>
  (element.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
    .every(id => document.getElementById(id) !== null);

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toBeVisible();
  },
};

export const WithDescription: Story = {
  args: { description: 'Shown on invoices' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveAccessibleDescription(
      'Shown on invoices'
    );
  },
};

export const WithError: Story = {
  args: { error: 'Name is required' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Name is required');
    await expect(input).toHaveAccessibleDescription('Name is required');
  },
};

const ErrorToggleDemo: React.FC = () => {
  const [error, setError] = useState<string | undefined>();
  return (
    <div className="flex flex-col gap-3">
      <FormField label="Name" description="Shown on invoices" error={error}>
        {renderInput}
      </FormField>
      <button type="button" onClick={() => setError(error ? undefined : 'Name is required')}>
        Toggle error
      </button>
    </div>
  );
};

// A react-hook-form error appears and clears: aria follows and never points at a missing id.
export const ErrorToggles: Story = {
  render: () => <ErrorToggleDemo />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    const toggle = canvas.getByRole('button', { name: 'Toggle error' });
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(describedByIdsExist(input)).toBe(true);
    await userEvent.click(toggle);
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(describedByIdsExist(input)).toBe(true);
    await userEvent.click(toggle);
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(canvas.queryByRole('alert')).toBeNull();
    await expect(describedByIdsExist(input)).toBe(true);
  },
};

export const HiddenLabel: Story = {
  args: { hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Name')).toHaveClass('sr-only');
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  },
};

export const Required: Story = {
  args: { required: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    await expect(canvas.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toBeDisabled();
  },
};
