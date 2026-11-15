'use client';

import {
  forwardRef,
  isValidElement,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  type TableHTMLAttributes,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Checkbox } from '../Checkbox';
import { Spinner } from '../Spinner';

export const dataTableVariants = cva('mhui:w-full mhui:border-collapse mhui:text-left', {
  variants: {
    density: {
      compact: 'mhui:text-xs',
      normal: 'mhui:text-sm',
      relaxed: 'mhui:text-base',
    },
  },
  defaultVariants: {
    density: 'normal',
  },
});

export const dataTableCellVariants = cva('mhui:transition-colors mhui:duration-150', {
  variants: {
    density: {
      compact: 'mhui:px-3 mhui:py-2',
      normal: 'mhui:px-4 mhui:py-3',
      relaxed: 'mhui:px-6 mhui:py-4',
    },
    align: {
      left: 'mhui:text-left',
      center: 'mhui:text-center',
      right: 'mhui:text-right',
    },
  },
  defaultVariants: {
    density: 'normal',
    align: 'left',
  },
});

export type DataTableDensity = NonNullable<VariantProps<typeof dataTableVariants>['density']>;
export type DataTableAlign = NonNullable<VariantProps<typeof dataTableCellVariants>['align']>;
export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableSortState {
  key: string;
  direction: DataTableSortDirection;
}

export interface DataTableColumn<T = Record<string, unknown>> {
  /** Unique column identifier (also used to read property from row when `render` is omitted) */
  key: string;
  /** Column header label or custom node */
  header: ReactNode;
  /** Enables interactive sorting on this column */
  sortable?: boolean;
  /** Horizontal cell alignment (default: `'left'`) */
  align?: DataTableAlign;
  /** Custom cell renderer for a given row */
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T = Record<string, unknown>>
  extends
    Omit<TableHTMLAttributes<HTMLTableElement>, 'children'>,
    VariantProps<typeof dataTableVariants> {
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Dataset rows */
  data: T[];
  /** Extracts a unique string key for each row */
  rowKey: (row: T) => string;
  /** Current active sort column and direction */
  sortBy?: DataTableSortState;
  /** Callback fired when a sortable column header is clicked */
  onSortChange?: (sort: DataTableSortState) => void;
  /** Enables row selection checkboxes */
  selectable?: boolean;
  /** Set of currently selected row keys */
  selectedKeys?: Set<string>;
  /** Callback fired when row selection changes */
  onSelectionChange?: (keys: Set<string>) => void;
  /** Row spacing density (default: `'normal'`) */
  density?: DataTableDensity;
  /** Displays a loading state over the table body */
  loading?: boolean;
  /** Custom content displayed when `data` is empty and not loading */
  emptyState?: ReactNode;
}

const getDefaultCellValue = <T,>(row: T, key: string): ReactNode => {
  if (typeof row === 'object' && row !== null && key in (row as Record<string, unknown>)) {
    const val = (row as Record<string, unknown>)[key];
    if (
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean' ||
      isValidElement(val)
    ) {
      return String(val);
    }
  }
  return null;
};

const DataTableInner = <T,>(
  {
    className,
    columns,
    data,
    rowKey,
    sortBy,
    onSortChange,
    selectable = false,
    selectedKeys,
    onSelectionChange,
    density = 'normal',
    loading = false,
    emptyState = 'No records found.',
    ...props
  }: DataTableProps<T>,
  ref: ForwardedRef<HTMLTableElement>,
) => {
  const resolvedDensity: DataTableDensity = density ?? 'normal';
  const totalColumns = columns.length + (selectable ? 1 : 0);

  const allRowKeys = data.map((row) => rowKey(row));
  const selectedCount = allRowKeys.filter((key) => selectedKeys?.has(key)).length;
  const allSelected = data.length > 0 && selectedCount === data.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const handleSelectAllChange = () => {
    if (!onSelectionChange) return;
    const nextKeys = new Set(selectedKeys);
    if (allSelected) {
      allRowKeys.forEach((key) => nextKeys.delete(key));
    } else {
      allRowKeys.forEach((key) => nextKeys.add(key));
    }
    onSelectionChange(nextKeys);
  };

  const handleSelectRowChange = (key: string) => {
    if (!onSelectionChange) return;
    const nextKeys = new Set(selectedKeys);
    if (nextKeys.has(key)) {
      nextKeys.delete(key);
    } else {
      nextKeys.add(key);
    }
    onSelectionChange(nextKeys);
  };

  const handleSortClick = (columnKey: string) => {
    if (!onSortChange) return;
    const isCurrentSort = sortBy?.key === columnKey;
    const nextDirection: DataTableSortDirection =
      isCurrentSort && sortBy?.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ key: columnKey, direction: nextDirection });
  };

  return (
    <div className="mhui:w-full mhui:overflow-x-auto mhui:rounded-none">
      <table
        ref={ref}
        aria-busy={loading || undefined}
        className={cn(dataTableVariants({ density: resolvedDensity }), className)}
        {...props}
      >
        <thead className="mhui:bg-slate-100 mhui:text-slate-900 mhui:dark:bg-slate-900 mhui:dark:text-slate-100">
          <tr>
            {selectable && (
              <th
                scope="col"
                className={cn(
                  dataTableCellVariants({ density: resolvedDensity, align: 'left' }),
                  'mhui:w-12',
                )}
              >
                <Checkbox
                  size="sm"
                  aria-label="Select all rows"
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={loading || data.length === 0}
                  onChange={handleSelectAllChange}
                />
              </th>
            )}

            {columns.map((column) => {
              const isSorted = sortBy?.key === column.key;
              const ariaSort = column.sortable
                ? isSorted
                  ? sortBy?.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
                : undefined;

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={cn(
                    dataTableCellVariants({
                      density: resolvedDensity,
                      align: column.align ?? 'left',
                    }),
                    'mhui:font-semibold mhui:select-none',
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSortClick(column.key)}
                      className={cn(
                        'mhui:inline-flex mhui:items-center mhui:gap-1.5 mhui:font-semibold',
                        'mhui:cursor-pointer mhui:rounded-none mhui:transition-colors mhui:duration-150',
                        'mhui:hover:text-blue-900 mhui:dark:hover:text-blue-300',
                        'mhui:focus-visible:ring-2 mhui:focus-visible:ring-blue-900 mhui:focus-visible:ring-offset-2 mhui:focus-visible:outline-none',
                        'mhui:dark:focus-visible:ring-blue-400 mhui:dark:focus-visible:ring-offset-slate-900',
                        isSorted && 'mhui:text-blue-900 mhui:dark:text-blue-300',
                      )}
                    >
                      <span>{column.header}</span>
                      {isSorted ? (
                        sortBy?.direction === 'asc' ? (
                          <ArrowUp
                            className="mhui:h-3.5 mhui:w-3.5 mhui:shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowDown
                            className="mhui:h-3.5 mhui:w-3.5 mhui:shrink-0"
                            aria-hidden="true"
                          />
                        )
                      ) : (
                        <ArrowUpDown
                          className="mhui:h-3.5 mhui:w-3.5 mhui:shrink-0 mhui:opacity-50"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="mhui:bg-white mhui:text-slate-700 mhui:dark:bg-slate-950 mhui:dark:text-slate-300">
          {loading ? (
            <tr>
              <td
                colSpan={totalColumns}
                className={cn(
                  dataTableCellVariants({ density: resolvedDensity, align: 'center' }),
                  'mhui:py-12',
                )}
              >
                <div className="mhui:flex mhui:flex-col mhui:items-center mhui:justify-center mhui:gap-2">
                  <Spinner size="md" label="Loading table data" />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={totalColumns}
                className={cn(
                  dataTableCellVariants({ density: resolvedDensity, align: 'center' }),
                  'mhui:py-12 mhui:text-slate-500 mhui:dark:text-slate-400',
                )}
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const key = rowKey(row);
              const isSelected = Boolean(selectedKeys?.has(key));

              return (
                <tr
                  key={key}
                  data-selected={selectable ? isSelected : undefined}
                  className={cn(
                    'mhui:transition-colors mhui:duration-150',
                    isSelected
                      ? 'mhui:bg-blue-50/80 mhui:hover:bg-blue-100/70 mhui:dark:bg-blue-950/50 mhui:dark:hover:bg-blue-950/70'
                      : rowIndex % 2 === 1
                        ? 'mhui:bg-slate-50/60 mhui:hover:bg-slate-100/80 mhui:dark:bg-slate-900/40 mhui:dark:hover:bg-slate-900/80'
                        : 'mhui:bg-white mhui:hover:bg-slate-100/80 mhui:dark:bg-slate-950 mhui:dark:hover:bg-slate-900/80',
                  )}
                >
                  {selectable && (
                    <td
                      className={cn(
                        dataTableCellVariants({ density: resolvedDensity, align: 'left' }),
                        'mhui:w-12',
                      )}
                    >
                      <Checkbox
                        size="sm"
                        aria-label={`Select row ${key}`}
                        checked={isSelected}
                        onChange={() => handleSelectRowChange(key)}
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        dataTableCellVariants({
                          density: resolvedDensity,
                          align: column.align ?? 'left',
                        }),
                      )}
                    >
                      {column.render ? column.render(row) : getDefaultCellValue(row, column.key)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export const DataTable = forwardRef(DataTableInner) as (<T = Record<string, unknown>>(
  props: DataTableProps<T> & RefAttributes<HTMLTableElement>,
) => ReactElement | null) & { displayName?: string };

DataTable.displayName = 'DataTable';

export const Table = DataTable;
export type TableProps<T = Record<string, unknown>> = DataTableProps<T>;
export type TableColumn<T = Record<string, unknown>> = DataTableColumn<T>;
