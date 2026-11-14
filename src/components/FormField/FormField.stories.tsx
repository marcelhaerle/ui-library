import type { Meta, StoryObj } from '@storybook/react-vite';
import { Lock, Mail, User } from 'lucide-react';
import { Input } from '../Input';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    errorText: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Work Email',
    helperText: 'We will only use this for account notifications.',
    required: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: (args) => (
    <div className="mhui:max-w-md">
      <FormField {...args}>
        <Input type="email" placeholder="name@company.com" leadingIcon={Mail} />
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Password',
    helperText: 'Must contain at least 12 characters.',
    errorText: 'Password is too short (minimum is 12 characters).',
    required: true,
  },
  render: (args) => (
    <div className="mhui:max-w-md">
      <FormField {...args}>
        <Input type="password" defaultValue="short" leadingIcon={Lock} />
      </FormField>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Organization Slug',
    helperText: 'Contact an administrator to change your organization slug.',
    disabled: true,
  },
  render: (args) => (
    <div className="mhui:max-w-md">
      <FormField {...args}>
        <Input defaultValue="acme-corp" leadingIcon={User} />
      </FormField>
    </div>
  ),
};

export const LightAndDarkShowcase: Story = {
  render: () => (
    <div className="mhui:grid mhui:grid-cols-1 mhui:gap-8 mhui:lg:grid-cols-2">
      <div className="mhui:flex mhui:flex-col mhui:gap-6 mhui:bg-white mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-900">Light Mode</h3>
        <FormField label="Email Address" helperText="Enter your corporate email." required>
          <Input placeholder="name@company.com" leadingIcon={Mail} />
        </FormField>
        <FormField label="Password" errorText="Invalid credentials provided." required>
          <Input type="password" defaultValue="wrong-pass" leadingIcon={Lock} />
        </FormField>
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-6 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <FormField label="Email Address" helperText="Enter your corporate email." required>
          <Input placeholder="name@company.com" leadingIcon={Mail} />
        </FormField>
        <FormField label="Password" errorText="Invalid credentials provided." required>
          <Input type="password" defaultValue="wrong-pass" leadingIcon={Lock} />
        </FormField>
      </div>
    </div>
  ),
};
