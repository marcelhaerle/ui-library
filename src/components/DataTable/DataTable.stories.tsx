import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
  type DataTableSortState,
} from './DataTable';

interface ServiceRecord {
  id: string;
  name: string;
  region: string;
  status: 'Active' | 'Degraded' | 'Offline';
  latencyMs: number;
}

const SAMPLE_DATA: ServiceRecord[] = [
  {
    id: 'svc-1',
    name: 'Identity Gateway',
    region: 'eu-central-1',
    status: 'Active',
    latencyMs: 18,
  },
  { id: 'svc-2', name: 'Billing Engine', region: 'us-east-1', status: 'Active', latencyMs: 42 },
  {
    id: 'svc-3',
    name: 'Telemetry Collector',
    region: 'eu-west-1',
    status: 'Degraded',
    latencyMs: 129,
  },
  {
    id: 'svc-4',
    name: 'Search Indexer',
    region: 'ap-northeast-1',
    status: 'Offline',
    latencyMs: 310,
  },
];

const COLUMNS: DataTableColumn<ServiceRecord>[] = [
  {
    key: 'name',
    header: 'Service Name',
    sortable: true,
    render: (row) => <span className="mhui:font-medium">{row.name}</span>,
  },
  {
    key: 'region',
    header: 'Region',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge
        size="sm"
        variant={
          row.status === 'Active' ? 'success' : row.status === 'Degraded' ? 'warning' : 'danger'
        }
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'latencyMs',
    header: 'Latency (ms)',
    sortable: true,
    align: 'right',
    render: (row) => `${row.latencyMs} ms`,
  },
];

const meta: Meta<typeof DataTable<ServiceRecord>> = {
  title: 'Data Display/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'normal', 'relaxed'],
    },
    selectable: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
  args: {
    columns: COLUMNS,
    data: SAMPLE_DATA,
    rowKey: (row) => row.id,
    density: 'normal',
    selectable: true,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof DataTable<ServiceRecord>>;

const InteractiveDataTable = (args: DataTableProps<ServiceRecord>) => {
  const [sortBy, setSortBy] = useState<DataTableSortState>({ key: 'name', direction: 'asc' });
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['svc-1']));

  const sortedData = useMemo(() => {
    const copy = [...args.data];
    copy.sort((a, b) => {
      const aVal = a[sortBy.key as keyof ServiceRecord];
      const bVal = b[sortBy.key as keyof ServiceRecord];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortBy.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortBy.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return copy;
  }, [args.data, sortBy]);

  return (
    <DataTable
      {...args}
      data={sortedData}
      sortBy={sortBy}
      onSortChange={setSortBy}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveDataTable {...args} />,
};

export const LoadingState: Story = {
  args: {
    loading: true,
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    emptyState: 'No matching services found for the current filter.',
  },
};
