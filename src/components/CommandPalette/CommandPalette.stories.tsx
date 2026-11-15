import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, FolderKanban, LayoutDashboard, Plus, Settings, Users } from 'lucide-react';
import { Button } from '../Button';
import {
  CommandPalette,
  type CommandPaletteGroup,
  type CommandPaletteProps,
} from './CommandPalette';

const SAMPLE_GROUPS: CommandPaletteGroup[] = [
  {
    id: 'navigation',
    heading: 'Navigation',
    items: [
      {
        id: 'go-dashboard',
        label: 'Go to Dashboard',
        description: 'Overview of system metrics and health',
        icon: LayoutDashboard,
        shortcut: 'G D',
        onSelect: () => {},
      },
      {
        id: 'go-projects',
        label: 'Go to Projects',
        description: 'Browse and manage active workspaces',
        icon: FolderKanban,
        shortcut: 'G P',
        onSelect: () => {},
      },
      {
        id: 'go-team',
        label: 'Team Directory',
        icon: Users,
        shortcut: 'G T',
        onSelect: () => {},
      },
    ],
  },
  {
    id: 'actions',
    heading: 'Quick Actions',
    items: [
      {
        id: 'new-project',
        label: 'Create New Project',
        icon: Plus,
        shortcut: '⌘N',
        onSelect: () => {},
      },
      {
        id: 'export-docs',
        label: 'Export Architecture Report',
        icon: FileText,
        onSelect: () => {},
      },
      {
        id: 'admin-settings',
        label: 'Restricted Settings',
        icon: Settings,
        disabled: true,
        onSelect: () => {},
      },
    ],
  },
];

const meta: Meta<typeof CommandPalette> = {
  title: 'Navigation/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: {
    open: true,
    placeholder: 'Search pages or commands...',
    groups: SAMPLE_GROUPS,
    onOpenChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const InteractiveCommandPalette = (args: CommandPaletteProps) => {
  const [open, setOpen] = useState(args.open ?? true);

  return (
    <div className="mhui:p-4">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Command Palette (⌘K)
      </Button>
      <CommandPalette {...args} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveCommandPalette {...args} />,
};
