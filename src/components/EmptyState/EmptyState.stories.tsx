import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderOpen, Plus, SearchX } from 'lucide-react';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Data Display/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    icon: FolderOpen,
    title: 'No projects created yet',
    description:
      'Get started by creating a new project workspace or importing an existing repository.',
    action: (
      <Button variant="primary" icon={Plus}>
        Create Project
      </Button>
    ),
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const NoSearchResults: Story = {
  args: {
    icon: SearchX,
    title: 'No matching results',
    description: 'Try adjusting your search query or clearing active filters to see more items.',
    action: <Button variant="outline">Clear Filters</Button>,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="mhui:flex mhui:flex-col mhui:gap-6">
      <EmptyState {...args} size="sm" />
      <EmptyState {...args} size="md" />
      <EmptyState {...args} size="lg" />
    </div>
  ),
};
