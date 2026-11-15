import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slash } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    maxItems: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbItem href="#workspace">Workspace</BreadcrumbItem>
      <BreadcrumbItem href="#projects">Projects</BreadcrumbItem>
      <BreadcrumbItem current>Architecture Spec</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const CustomSeparator: Story = {
  render: (args) => (
    <div className="mhui:flex mhui:flex-col mhui:gap-4">
      <Breadcrumbs {...args} separator={Slash}>
        <BreadcrumbItem href="#home">Home</BreadcrumbItem>
        <BreadcrumbItem href="#docs">Documentation</BreadcrumbItem>
        <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
      </Breadcrumbs>
      <Breadcrumbs {...args} separator="/">
        <BreadcrumbItem href="#root">System</BreadcrumbItem>
        <BreadcrumbItem href="#clusters">Clusters</BreadcrumbItem>
        <BreadcrumbItem current>eu-central-1</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  ),
};

export const CollapsedWithMaxItems: Story = {
  args: {
    maxItems: 3,
  },
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbItem href="#organization">Organization</BreadcrumbItem>
      <BreadcrumbItem href="#departments">Departments</BreadcrumbItem>
      <BreadcrumbItem href="#engineering">Engineering</BreadcrumbItem>
      <BreadcrumbItem href="#platform">Platform</BreadcrumbItem>
      <BreadcrumbItem current>UI Library</BreadcrumbItem>
    </Breadcrumbs>
  ),
};
