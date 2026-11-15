import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, Copy, Edit, Share2, Trash2 } from 'lucide-react';
import { Button } from '../Button';
import { DropdownMenu } from './DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
  args: {
    align: 'start',
    trigger: <Button variant="primary">Actions</Button>,
    items: [
      {
        id: 'edit',
        label: 'Edit document',
        icon: Edit,
        onSelect: () => {},
      },
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: Copy,
        onSelect: () => {},
      },
      {
        id: 'share',
        label: 'Share link',
        icon: Share2,
        disabled: true,
        onSelect: () => {},
      },
      {
        id: 'archive',
        label: 'Archive project',
        icon: Archive,
        onSelect: () => {},
      },
      {
        id: 'delete',
        label: 'Delete permanently',
        icon: Trash2,
        danger: true,
        onSelect: () => {},
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: (args) => (
    <div className="mhui:min-h-60 mhui:p-4">
      <DropdownMenu {...args} />
    </div>
  ),
};

export const Alignments: Story = {
  render: (args) => (
    <div className="mhui:flex mhui:min-h-60 mhui:items-start mhui:justify-between mhui:gap-8 mhui:p-8">
      <DropdownMenu
        {...args}
        align="start"
        trigger={<Button variant="outline">Align Start</Button>}
      />
      <DropdownMenu
        {...args}
        align="center"
        trigger={<Button variant="outline">Align Center</Button>}
      />
      <DropdownMenu {...args} align="end" trigger={<Button variant="outline">Align End</Button>} />
    </div>
  ),
};
