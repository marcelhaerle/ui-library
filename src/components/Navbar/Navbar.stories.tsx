import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart3, FolderKanban, LayoutDashboard, Settings } from 'lucide-react';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMobileMenu,
  NavbarToggle,
} from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['surface', 'primary', 'elevated'],
    },
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    sticky: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'surface',
    maxWidth: 'xl',
    sticky: false,
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  render: (args) => (
    <Navbar {...args}>
      <NavbarBrand>MHUI Platform</NavbarBrand>
      <NavbarContent align="start">
        <NavbarItem href="#dashboard" active icon={LayoutDashboard}>
          Dashboard
        </NavbarItem>
        <NavbarItem href="#projects" icon={FolderKanban}>
          Projects
        </NavbarItem>
        <NavbarItem href="#analytics" icon={BarChart3}>
          Analytics
        </NavbarItem>
        <NavbarItem href="#settings" icon={Settings} disabled>
          Settings
        </NavbarItem>
      </NavbarContent>
      <NavbarContent align="end">
        <NavbarItem>
          <Button size="sm" variant="outline">
            Documentation
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Avatar size="sm" initials="MH" status="online" />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  ),
};

export const PrimaryVariant: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => (
    <Navbar {...args}>
      <NavbarBrand>Enterprise Console</NavbarBrand>
      <NavbarContent align="center">
        <NavbarItem href="#overview" active>
          Overview
        </NavbarItem>
        <NavbarItem href="#deployments">Deployments</NavbarItem>
        <NavbarItem href="#security">Security</NavbarItem>
      </NavbarContent>
      <NavbarContent align="end">
        <NavbarItem>
          <Avatar size="sm" initials="MH" status="online" />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  ),
};

export const WithMobileMenu: Story = {
  args: {
    defaultMobileMenuOpen: true,
  },
  render: (args) => (
    <Navbar {...args}>
      <NavbarBrand>MHUI Platform</NavbarBrand>
      <NavbarContent align="end">
        <NavbarToggle />
      </NavbarContent>
      <NavbarMobileMenu>
        <NavbarItem href="#dashboard" active icon={LayoutDashboard}>
          Dashboard
        </NavbarItem>
        <NavbarItem href="#projects" icon={FolderKanban}>
          Projects
        </NavbarItem>
        <NavbarItem href="#analytics" icon={BarChart3}>
          Analytics
        </NavbarItem>
      </NavbarMobileMenu>
    </Navbar>
  ),
};
