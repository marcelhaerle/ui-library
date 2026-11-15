import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChart3,
  FolderKanban,
  LayoutDashboard,
  ShieldCheck,
  Sliders,
  Users,
} from 'lucide-react';
import { Avatar } from '../Avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarToggle,
} from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    collapsed: {
      control: 'boolean',
    },
  },
  args: {
    width: 'md',
    defaultCollapsed: false,
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: (args) => (
    <div className="mhui:flex mhui:h-[520px] mhui:w-full mhui:bg-slate-50 mhui:dark:bg-slate-950">
      <Sidebar {...args}>
        <SidebarHeader>
          <span className="mhui:truncate mhui:font-bold">MHUI Workspace</span>
          <SidebarToggle />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Overview">
            <SidebarItem href="#dashboard" active icon={LayoutDashboard}>
              Dashboard
            </SidebarItem>
            <SidebarItem href="#projects" icon={FolderKanban} badge="12">
              Projects
            </SidebarItem>
            <SidebarItem href="#analytics" icon={BarChart3}>
              Analytics
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Administration">
            <SidebarItem href="#team" icon={Users} badge="4">
              Team Members
            </SidebarItem>
            <SidebarItem href="#security" icon={ShieldCheck}>
              Security & Audit
            </SidebarItem>
            <SidebarItem href="#settings" icon={Sliders} disabled>
              System Settings
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Avatar size="sm" initials="MH" status="online" />
        </SidebarFooter>
      </Sidebar>
      <main className="mhui:flex-1 mhui:p-6">
        <p className="mhui:text-sm mhui:text-slate-600 mhui:dark:text-slate-400">
          Main application workspace area
        </p>
      </main>
    </div>
  ),
};

export const CollapsedRail: Story = {
  args: {
    defaultCollapsed: true,
  },
  render: Default.render,
};
