import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './DataTable';

interface UserRow {
  id: string;
  name: string;
  role: string;
}

const COLUMNS: DataTableColumn<UserRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: false, render: (row) => `Role: ${row.role}` },
];

const ROWS: UserRow[] = [
  { id: 'u1', name: 'Alice', role: 'Admin' },
  { id: 'u2', name: 'Bob', role: 'Editor' },
];

describe('DataTable', () => {
  it('renders rows and handles column sorting with aria-sort', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    const { rerender } = render(
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        rowKey={(row) => row.id}
        onSortChange={onSortChange}
      />,
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Role: Admin')).toBeInTheDocument();

    const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });

    rerender(
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        rowKey={(row) => row.id}
        sortBy={{ key: 'name', direction: 'asc' }}
        onSortChange={onSortChange}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'desc' });
  });

  it('supports individual row selection and select-all toggle', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    const { rerender } = render(
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        rowKey={(row) => row.id}
        selectable
        selectedKeys={new Set(['u1'])}
        onSelectionChange={onSelectionChange}
      />,
    );

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: 'Select all rows',
    }) as HTMLInputElement;
    expect(selectAllCheckbox.indeterminate).toBe(true);

    // Clicking select-all when partially selected selects all rows
    await user.click(selectAllCheckbox);
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['u1', 'u2']));

    rerender(
      <DataTable
        columns={COLUMNS}
        data={ROWS}
        rowKey={(row) => row.id}
        selectable
        selectedKeys={new Set(['u1', 'u2'])}
        onSelectionChange={onSelectionChange}
      />,
    );

    expect(selectAllCheckbox.checked).toBe(true);

    // Deselect a single row
    await user.click(screen.getByRole('checkbox', { name: 'Select row u1' }));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['u2']));
  });

  it('renders loading and empty states appropriately', () => {
    const { rerender } = render(
      <DataTable columns={COLUMNS} data={[]} rowKey={(row) => row.id} loading />,
    );

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status', { name: 'Loading table data' })).toBeInTheDocument();

    rerender(
      <DataTable
        columns={COLUMNS}
        data={[]}
        rowKey={(row) => row.id}
        emptyState="No users available."
      />,
    );

    expect(screen.getByText('No users available.')).toBeInTheDocument();
  });
});
