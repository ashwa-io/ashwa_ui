import { memo, useLayoutEffect, useRef, useState } from 'react';
import type React from 'react';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface DataTableColumnMeta {
  /** Fixed width in px, for single-control columns (avatar, actions). */
  width?: number;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Makes rows clickable and keyboard-focusable. Clicks on controls inside a row are ignored. */
  onRowClick?: (row: TData) => void;
  /** Archived or inactive rows are hatched with dimmed text. */
  isRowArchived?: (row: TData) => boolean;
  /** Rendered under the table, e.g. a load-more sentinel. */
  footer?: React.ReactNode;
  /**
   * How far below the top of the scrolling area the header sticks: the height of whatever the
   * page pins above the table. A number is pixels; a string is any CSS length, e.g. a variable.
   */
  stickyHeaderOffset?: number | string;
  emptyText?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

// Roomy enough for 40px avatars; the virtualizer measures the real height after mount.
const ROW_HEIGHT_ESTIMATE_PX = 72;
const OVERSCAN_ROWS = 8;
const BODY_CELL = 'border-b px-4 py-3 break-words whitespace-normal';
// Fixed layout keeps widths independent of which rows are mounted; Astryx's floor for flexible columns.
const FLEXIBLE_COLUMN_MIN_WIDTH = 60;
const ARCHIVED_ROW =
  'text-muted-foreground bg-[repeating-linear-gradient(135deg,transparent_0_6px,color-mix(in_oklch,var(--color-border)_60%,transparent)_6px_7px)]';
const CONTROLS =
  'a,button,input,select,textarea,label,[role="menuitem"],[role="option"],[role="checkbox"],[role="switch"]';

const columnWidth = (column: { columnDef: { meta?: unknown } }): number | undefined =>
  (column.columnDef.meta as DataTableColumnMeta | undefined)?.width;

// The page's scrolling pane drives the virtualizer; the table itself never scrolls.
const findScrollParent = (node: HTMLElement | null): HTMLElement | null => {
  for (let element = node?.parentElement ?? null; element; element = element.parentElement) {
    const { overflowY } = getComputedStyle(element);
    if (overflowY === 'auto' || overflowY === 'scroll') return element;
  }
  return null;
};

// Where the body starts inside the pane's content, so virtual offsets line up.
const offsetWithin = (element: HTMLElement, scrollParent: HTMLElement): number =>
  element.getBoundingClientRect().top -
  scrollParent.getBoundingClientRect().top +
  scrollParent.scrollTop;

// Portalled content (menus, dialogs) bubbles through React but isn't inside the row in the DOM.
const isRowOwnClick = (event: React.MouseEvent<HTMLTableRowElement>): boolean => {
  const target = event.target as Element;
  if (!event.currentTarget.contains(target) || target.closest(CONTROLS)) return false;
  // Dragging to select text ends in a click; copying a value must not open the row.
  if (window.getSelection()?.isCollapsed === false) return false;
  // Disabled controls ignore the pointer, so their clicks land on the cell behind them.
  return !Array.from(
    event.currentTarget.querySelectorAll('button:disabled,[aria-disabled="true"]')
  ).some(control => {
    const box = control.getBoundingClientRect();
    return (
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom
    );
  });
};

interface DataTableRowProps<TData, TValue> {
  row: Row<TData>;
  columns: ColumnDef<TData, TValue>[];
  index: number;
  isArchived: boolean;
  onRowClick?: (row: TData) => void;
  measureRef: (node: HTMLTableRowElement | null) => void;
}

const DataTableRowInner = <TData, TValue>(props: DataTableRowProps<TData, TValue>) => {
  const { row, index, isArchived, onRowClick, measureRef } = props;

  return (
    <TableRow
      ref={measureRef}
      data-index={index}
      aria-rowindex={index + 2}
      data-archived={isArchived || undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onClick={
        onRowClick
          ? event => {
              if (isRowOwnClick(event)) onRowClick(row.original);
            }
          : undefined
      }
      onKeyDown={
        onRowClick
          ? event => {
              if (event.key === 'Enter' && event.target === event.currentTarget) {
                onRowClick(row.original);
              }
            }
          : undefined
      }
      className={cn(
        // scroll-mt: Shift+Tab must not leave the focused row under the sticky header.
        onRowClick &&
          'focus-visible:outline-ring cursor-pointer scroll-mt-[calc(var(--data-table-sticky-top)+2.5rem)] focus-visible:outline-1',
        isArchived && ARCHIVED_ROW
      )}
    >
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id} className={BODY_CELL} style={{ width: columnWidth(cell.column) }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

// TanStack rebuilds every Row when `data` changes; a row only re-renders when its record or columns
// changed (column closures often depend on data that loads later).
const DataTableRow = memo(
  DataTableRowInner,
  (prev, next) =>
    prev.row.original === next.row.original &&
    prev.columns === next.columns &&
    prev.index === next.index &&
    prev.isArchived === next.isArchived &&
    prev.onRowClick === next.onRowClick
) as typeof DataTableRowInner;

export const DataTable = <TData, TValue>(props: DataTableProps<TData, TValue>) => {
  const {
    columns,
    data,
    onRowClick,
    isRowArchived,
    footer,
    stickyHeaderOffset = 0,
    emptyText = 'No results.',
    'aria-label': ariaLabel,
    'data-testid': testId,
  } = props;
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  // undefined until the first layout pass; null when nothing scrolls (then every row renders).
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>();
  const [scrollMargin, setScrollMargin] = useState(0);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  const rows = table.getRowModel().rows;

  useLayoutEffect(() => {
    setScrollParent(findScrollParent(bodyRef.current));
  }, []);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body || !scrollParent) return undefined;
    const measure = () => setScrollMargin(offsetWithin(body, scrollParent));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scrollParent);
    return () => observer.disconnect();
  }, [scrollParent, data.length]);

  const isVirtual = scrollParent instanceof HTMLElement;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollParent ?? null,
    estimateSize: () => ROW_HEIGHT_ESTIMATE_PX,
    overscan: OVERSCAN_ROWS,
    scrollMargin,
    enabled: isVirtual,
  });
  const virtualRows = virtualizer.getVirtualItems();
  const visibleIndexes = isVirtual
    ? virtualRows.map(item => item.index)
    : scrollParent === null
      ? rows.map((_row, index) => index)
      : [];
  const first = virtualRows[0];
  const last = virtualRows[virtualRows.length - 1];
  // Spacer rows keep the table's own column layout; absolutely positioned rows would not.
  const paddingTop = isVirtual && first ? first.start - scrollMargin : 0;
  const paddingBottom = isVirtual && last ? virtualizer.getTotalSize() - last.end : 0;
  const leafColumns = table.getVisibleLeafColumns();
  const columnCount = leafColumns.length;
  const minWidth = leafColumns.reduce(
    (total, column) => total + (columnWidth(column) ?? FLEXIBLE_COLUMN_MIN_WIDTH),
    0
  );

  const spacer = (height: number) =>
    height > 0 ? (
      <tr aria-hidden>
        <td colSpan={columnCount} style={{ height, padding: 0, border: 0 }} />
      </tr>
    ) : null;

  // px-2 plus the 16px cell padding lines the first column up with a page's px-6 chrome.
  return (
    <div
      className="px-2"
      style={
        {
          '--data-table-sticky-top':
            typeof stickyHeaderOffset === 'number' ? `${stickyHeaderOffset}px` : stickyHeaderOffset,
        } as React.CSSProperties
      }
      data-testid={testId}
    >
      {/* Not shadcn's Table: its overflow wrapper would scroll here instead of the page and
          break the sticky header. Borders sit on cells because collapsed ones vanish when sticky. */}
      <table
        aria-label={ariaLabel}
        aria-rowcount={rows.length + 1}
        className="w-full table-fixed border-separate border-spacing-0 text-sm"
        style={{ minWidth }}
      >
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} aria-rowindex={1} className="hover:bg-transparent">
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className="bg-surface sticky top-(--data-table-sticky-top) z-10 truncate border-b px-4 py-2"
                  style={{ width: columnWidth(header.column) }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody ref={bodyRef}>
          {rows.length > 0 ? (
            <>
              {spacer(paddingTop)}
              {visibleIndexes.map(index => (
                <DataTableRow
                  key={rows[index].id}
                  row={rows[index]}
                  columns={columns}
                  index={index}
                  isArchived={isRowArchived?.(rows[index].original) ?? false}
                  onRowClick={onRowClick}
                  measureRef={virtualizer.measureElement}
                />
              ))}
              {spacer(paddingBottom)}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={columnCount} className={BODY_CELL}>
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </table>
      {footer}
    </div>
  );
};
