import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { expect, fn, waitFor } from 'storybook/test';

import { Button } from '@/components/atomic/Button';

import { DataTable, type DataTableColumnMeta } from './DataTable';

interface Vehicle {
  id: string;
  name: string;
  depot: string;
}

const makeRows = (count: number): Vehicle[] =>
  Array.from({ length: count }, (_, i) => ({ id: `v${i}`, name: `Row ${i}`, depot: 'Hisar' }));

const columns: ColumnDef<Vehicle, string>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'depot', header: 'Depot' },
];

// The page's scrolling area: DataTable must use it rather than scrolling itself. The page owns
// its keyboard access (tabIndex), as AppShell's content pane will.
const Pane: React.FC<{ children: React.ReactNode }> = props => (
  <div data-testid="pane" tabIndex={0} className="h-64 w-[600px] overflow-auto">
    {props.children}
  </div>
);

const meta = {
  title: 'Organism/DataTable',
  component: DataTable<Vehicle, string>,
  args: { columns, data: makeRows(3) },
  decorators: [
    (Story, context) => (context.parameters.pane === false ? Story() : <Pane>{Story()}</Pane>),
  ],
} satisfies Meta<typeof DataTable<Vehicle, string>>;

export default meta;

type Story = StoryObj<typeof meta>;

type Canvas = { getByTestId: (id: string) => HTMLElement };
const pane = (canvas: Canvas) => canvas.getByTestId('pane');

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('table')).toBeInTheDocument();
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(2);
    await expect(await canvas.findByText('Row 2')).toBeVisible();
  },
};

export const HeaderLook: Story = {
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByRole('columnheader', { name: 'Name' }));
    await expect(parseFloat(style.height)).toBe(40);
    await expect(style.fontWeight).toBe('500');
    await expect(style.backgroundColor).toBe(getComputedStyle(document.body).backgroundColor);
  },
};

export const Alignment: Story = {
  play: async ({ canvas }) => {
    const header = canvas.getByRole('columnheader', { name: 'Name' });
    const cell = await canvas.findByRole('cell', { name: 'Row 0' });
    await expect(header.getBoundingClientRect().left).toBe(cell.getBoundingClientRect().left);
    await expect(getComputedStyle(header).paddingLeft).toBe('16px');
    await expect(getComputedStyle(cell).paddingLeft).toBe('16px');
  },
};

export const StickyHeader: Story = {
  args: { data: makeRows(100) },
  play: async ({ canvas }) => {
    await canvas.findByText('Row 0');
    pane(canvas).scrollTop = 400;
    await waitFor(() =>
      expect(canvas.getByRole('columnheader', { name: 'Name' }).getBoundingClientRect().top).toBe(
        pane(canvas).getBoundingClientRect().top
      )
    );
  },
};

const wideColumns: ColumnDef<Vehicle, string>[] = Array.from({ length: 12 }, (_, i) => ({
  id: `c${i}`,
  accessorKey: 'depot',
  header: `Column number ${i}`,
}));

// Wide tables scroll sideways with the page; the header still sticks vertically.
export const WideTableScrollsWithPage: Story = {
  args: { columns: wideColumns, data: makeRows(100) },
  play: async ({ canvas }) => {
    await canvas.findAllByText('Hisar');
    const scroller = pane(canvas);
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    scroller.scrollTop = 300;
    scroller.scrollLeft = 200;
    await waitFor(() =>
      expect(
        canvas.getByRole('columnheader', { name: 'Column number 0' }).getBoundingClientRect().top
      ).toBe(scroller.getBoundingClientRect().top)
    );
  },
};

// The scrollbar belongs to the page: nothing between the table and the pane may scroll.
export const ScrollbarAtPageEnd: Story = {
  args: { data: makeRows(100) },
  play: async ({ canvas }) => {
    await canvas.findByText('Row 0');
    const scroller = pane(canvas);
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    let element = canvas.getByRole('table').parentElement!;
    while (element !== scroller) {
      await expect(getComputedStyle(element).overflowY).toBe('visible');
      element = element.parentElement!;
    }
  },
};

export const Virtualised: Story = {
  args: { data: makeRows(2000) },
  play: async ({ canvas }) => {
    await canvas.findByText('Row 0');
    await expect(canvas.getByRole('table')).toHaveAttribute('aria-rowcount', '2001');
    await expect(canvas.getAllByRole('row').length).toBeLessThan(100);
    const scroller = pane(canvas);
    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() => {
      scroller.scrollTop = scroller.scrollHeight;
      expect(canvas.getByText('Row 1999')).toBeInTheDocument();
    });
  },
};

export const NoScrollParent: Story = {
  args: { data: makeRows(40) },
  parameters: { pane: false },
  play: async ({ canvas }) => {
    await canvas.findByText('Row 39');
    await expect(canvas.getAllByRole('row')).toHaveLength(41);
  },
};

const onRow = fn();

export const RowClick: Story = {
  args: { onRowClick: onRow },
  play: async ({ canvas, userEvent }) => {
    onRow.mockClear();
    await userEvent.click(await canvas.findByRole('cell', { name: 'Row 1' }));
    await expect(onRow).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'v1' }));
    onRow.mockClear();
    const row = canvas.getByRole('cell', { name: 'Row 2' }).closest('tr')!;
    await expect(row).toHaveAttribute('tabindex', '0');
    row.focus();
    await userEvent.keyboard('{Enter}');
    await expect(onRow).toHaveBeenCalledOnce();
  },
};

const onCellButton = fn();
const onRowOfButton = fn();

const buttonColumns: ColumnDef<Vehicle, string>[] = [
  ...columns,
  {
    id: 'actions',
    header: 'Actions',
    cell: () => <Button onClick={onCellButton}>Edit</Button>,
  },
];

// A control inside a row does its own job and never also opens the row.
export const IgnoresClicksOnControls: Story = {
  args: { columns: buttonColumns, onRowClick: onRowOfButton, data: makeRows(1) },
  play: async ({ canvas, userEvent }) => {
    onCellButton.mockClear();
    onRowOfButton.mockClear();
    await userEvent.click(await canvas.findByRole('button', { name: 'Edit' }));
    await expect(onCellButton).toHaveBeenCalledOnce();
    await expect(onRowOfButton).not.toHaveBeenCalled();
    canvas.getByRole('button', { name: 'Edit' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onRowOfButton).not.toHaveBeenCalled();
  },
};

export const Archived: Story = {
  args: { isRowArchived: (row: Vehicle) => row.id === 'v1' },
  play: async ({ canvas }) => {
    const row = (await canvas.findByRole('cell', { name: 'Row 1' })).closest('tr')!;
    await expect(row).toHaveAttribute('data-archived', 'true');
  },
};

const fixedMeta: DataTableColumnMeta = { width: 64 };

export const FixedWidthColumn: Story = {
  args: {
    columns: [{ id: 'fit', header: 'Fit', cell: () => 'x', meta: fixedMeta }, ...columns],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('columnheader', { name: 'Fit' }).getBoundingClientRect().width
    ).toBe(64);
  },
};

export const LongContent: Story = {
  args: {
    data: [
      {
        id: 'v0',
        name: 'A very long vehicle description that goes on and on and on and on and on and on',
        depot: 'Hisar',
      },
    ],
  },
  decorators: [Story => <div className="w-96">{Story()}</div>],
  play: async ({ canvas }) => {
    await canvas.findByText(/A very long vehicle/);
    await expect(canvas.getByRole('table').getBoundingClientRect().width).toBeLessThanOrEqual(384);
  },
};

export const Empty: Story = {
  args: { data: [] },
  play: async ({ canvas }) => {
    const cell = await canvas.findByRole('cell', { name: 'No results.' });
    await expect(cell).toHaveAttribute('colspan', '2');
  },
};

export const CustomEmptyText: Story = {
  args: { data: [], emptyText: 'No vehicles yet' },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('No vehicles yet')).toBeVisible();
  },
};

export const Footer: Story = {
  args: { footer: <div>Load more</div> },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Load more')).toBeVisible();
  },
};

export const Dark: Story = {
  args: { isRowArchived: (row: Vehicle) => row.id === 'v1', onRowClick: fn() },
  globals: { theme: 'dark' },
  play: async ({ canvas }) => {
    await canvas.findByText('Row 0');
  },
};
