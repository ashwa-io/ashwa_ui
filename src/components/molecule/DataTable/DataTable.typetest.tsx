import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from './DataTable';

const columns: ColumnDef<{ a: string }, string>[] = [{ accessorKey: 'a', header: 'A' }];

// Compile-time contract, checked by `yarn typecheck`, never rendered or published.
export const DataTableTypeTest: React.FC = () => (
  <div>
    {/* @ts-expect-error className is not part of the public API */}
    <DataTable columns={columns} data={[]} className="x" />
    {/* @ts-expect-error style is not part of the public API */}
    <DataTable columns={columns} data={[]} style={{}} />
    {/* @ts-expect-error data is required */}
    <DataTable columns={columns} />
    <DataTable columns={columns} data={[{ a: 'b' }]} onRowClick={row => row.a} emptyText="c" />
  </div>
);
