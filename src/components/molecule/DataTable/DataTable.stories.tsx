import { useMemo, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { expect, fireEvent, fn, screen, waitFor } from 'storybook/test';

import { Button } from '@/components/atomic/Button';
import { Card } from '@/components/atomic/Card';
import { Checkbox } from '@/components/atomic/Checkbox';
import { Modal } from '@/components/molecule/Modal';

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
  title: 'Molecule/DataTable',
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

// Column closures often depend on data that loads later (a role name map); the rows don't change.
const STABLE_ROWS = makeRows(1);

const ColumnsChangeDemo: React.FC = () => {
  const [role, setRole] = useState('-');
  const lateColumns = useMemo<ColumnDef<Vehicle, string>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { id: 'role', header: 'Role', cell: () => role },
    ],
    [role]
  );
  return (
    <>
      <Button onClick={() => setRole('Manager')}>Load roles</Button>
      <DataTable columns={lateColumns} data={STABLE_ROWS} />
    </>
  );
};

export const ColumnsChangeUpdatesCells: Story = {
  render: () => <ColumnsChangeDemo />,
  play: async ({ canvas, userEvent }) => {
    await canvas.findByRole('cell', { name: '-' });
    await userEvent.click(canvas.getByRole('button', { name: 'Load roles' }));
    await expect(await canvas.findByRole('cell', { name: 'Manager' })).toBeInTheDocument();
  },
};

const LONG_TEXT = 'A very long value that would widen its column under automatic table layout';

// Widths must not depend on which rows happen to be mounted.
export const ColumnWidthsStayStable: Story = {
  args: {
    data: makeRows(2000).map((row, index) => ({
      ...row,
      name: index > 1000 ? LONG_TEXT : row.name,
    })),
  },
  play: async ({ canvas }) => {
    await canvas.findByText('Row 0');
    const header = () => canvas.getByRole('columnheader', { name: 'Name' }).getBoundingClientRect();
    const before = header().width;
    const scroller = pane(canvas);
    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() => {
      scroller.scrollTop = scroller.scrollHeight;
      expect(canvas.getAllByText(LONG_TEXT).length).toBeGreaterThan(0);
    });
    await expect(header().width).toBe(before);
  },
};

const onSelectRow = fn();

// Dragging to copy a plate number must not open the row.
export const IgnoresTextSelection: Story = {
  args: { onRowClick: onSelectRow, data: makeRows(1) },
  play: async ({ canvas }) => {
    onSelectRow.mockClear();
    const cell = await canvas.findByRole('cell', { name: 'Row 0' });
    window.getSelection()!.selectAllChildren(cell);
    await fireEvent.click(cell);
    window.getSelection()!.removeAllRanges();
    await expect(onSelectRow).not.toHaveBeenCalled();
  },
};

// A focused row scrolled upward must clear the 40px sticky header.
export const FocusClearsStickyHeader: Story = {
  args: { onRowClick: fn(), data: makeRows(3) },
  play: async ({ canvas }) => {
    const row = (await canvas.findByRole('cell', { name: 'Row 0' })).closest('tr')!;
    await expect(getComputedStyle(row).scrollMarginTop).toBe('40px');
  },
};

const onDisabledRow = fn();

const disabledColumns: ColumnDef<Vehicle, string>[] = [
  {
    id: 'pick',
    header: 'Pick',
    cell: () => <Checkbox label="Pick" value={false} onChange={fn()} />,
  },
  {
    id: 'edit',
    header: 'Edit',
    cell: () => (
      <Button disabled data-testid="disabled">
        Edit
      </Button>
    ),
  },
];

// A disabled button ignores the pointer, so the click lands on its cell; a label is a control too.
export const IgnoresDisabledControlsAndLabels: Story = {
  args: { columns: disabledColumns, onRowClick: onDisabledRow, data: makeRows(1) },
  play: async ({ canvas, userEvent }) => {
    onDisabledRow.mockClear();
    const button = await canvas.findByTestId('disabled');
    const box = button.getBoundingClientRect();
    await fireEvent.click(button.closest('td')!, {
      clientX: box.left + box.width / 2,
      clientY: box.top + box.height / 2,
    });
    await expect(onDisabledRow).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByText('Pick', { selector: 'label' }));
    await expect(onDisabledRow).not.toHaveBeenCalled();
  },
};

// On a dialog or card, the sticky header must match that surface, not the page behind it.
export const HeaderMatchesModalSurface: Story = {
  globals: { theme: 'dark' },
  parameters: { pane: false },
  render: args => (
    <Modal open onClose={fn()} title="Vehicles" flush>
      <DataTable columns={args.columns} data={args.data} />
    </Modal>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Vehicles' });
    const header = await screen.findByRole('columnheader', { name: 'Name' });
    await waitFor(() =>
      expect(getComputedStyle(header).backgroundColor).toBe(
        getComputedStyle(dialog).backgroundColor
      )
    );
  },
};

export const StickyInsideCard: Story = {
  args: { data: makeRows(100) },
  globals: { theme: 'dark' },
  render: args => (
    <Card padding="none" data-testid="card">
      <DataTable columns={args.columns} data={args.data} />
    </Card>
  ),
  play: async ({ canvas }) => {
    await canvas.findByText('Row 0');
    const header = canvas.getByRole('columnheader', { name: 'Name' });
    await expect(getComputedStyle(header).backgroundColor).toBe(
      getComputedStyle(canvas.getByTestId('card')).backgroundColor
    );
    pane(canvas).scrollTop = 400;
    await waitFor(() =>
      expect(header.getBoundingClientRect().top).toBe(pane(canvas).getBoundingClientRect().top)
    );
  },
};
