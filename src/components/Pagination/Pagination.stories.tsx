import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination, type PaginationProps } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    siblingCount: {
      control: 'number',
    },
    showFirstLast: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    page: 1,
    totalPages: 10,
    siblingCount: 1,
    showFirstLast: true,
    size: 'md',
    onPageChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const InteractivePagination = (args: PaginationProps) => {
  const [page, setPage] = useState(args.page ?? 1);
  return <Pagination {...args} page={page} onPageChange={setPage} />;
};

export const Default: Story = {
  render: (args) => <InteractivePagination {...args} />,
};

export const LargeDataset: Story = {
  args: {
    page: 12,
    totalPages: 50,
    siblingCount: 2,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div className="mhui:flex mhui:flex-col mhui:gap-4">
      <InteractivePagination {...args} size="sm" totalPages={8} page={3} />
      <InteractivePagination {...args} size="md" totalPages={8} page={3} />
      <InteractivePagination {...args} size="lg" totalPages={8} page={3} />
    </div>
  ),
};
