import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, Globe, Lock, Mail, Search, AlertCircle } from 'lucide-react';
import { Input, type InputSize, type InputState } from './Input';

const sizes: InputSize[] = ['sm', 'md', 'lg'];
const states: InputState[] = ['default', 'error', 'success'];

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
    state: {
      control: 'select',
      options: states,
    },
    clearable: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Enter text...',
    size: 'md',
    state: 'default',
    clearable: false,
    fullWidth: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your name...',
  },
};

export const WithLeadingAndTrailingIcons: Story = {
  args: {
    placeholder: 'https://example.com',
    leadingIcon: Globe,
    trailingIcon: CheckCircle2,
    state: 'success',
  },
};

const ClearableInputDemo = () => {
  const [query, setQuery] = useState('React 19 component library');

  return (
    <div className="mhui:max-w-md">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery('')}
        leadingIcon={Search}
        clearable
        placeholder="Search documentation..."
      />
    </div>
  );
};

export const ClearableInteractive: Story = {
  render: () => <ClearableInputDemo />,
};

export const AllStatesAndSizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:max-w-2xl mhui:flex-col mhui:gap-10 mhui:p-6">
      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Sizes (sm, md, lg)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          {sizes.map((size) => (
            <Input
              key={size}
              size={size}
              leadingIcon={Mail}
              placeholder={`Input size="${size}"`}
              defaultValue={`Sample value (${size})`}
              clearable
            />
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Validation States (default, error, success)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          <Input
            state="default"
            leadingIcon={Mail}
            placeholder="Default state"
            defaultValue="user@example.com"
          />
          <Input
            state="error"
            leadingIcon={Lock}
            trailingIcon={AlertCircle}
            placeholder="Error state"
            defaultValue="invalid-token"
          />
          <Input
            state="success"
            leadingIcon={Globe}
            trailingIcon={CheckCircle2}
            placeholder="Success state"
            defaultValue="https://verified-domain.com"
          />
          <Input
            disabled
            leadingIcon={Mail}
            placeholder="Disabled state"
            defaultValue="readonly@example.com"
          />
        </div>
      </section>
    </div>
  ),
};

export const LightAndDarkShowcase: Story = {
  render: () => (
    <div className="mhui:grid mhui:grid-cols-1 mhui:gap-8 mhui:lg:grid-cols-2">
      <div className="mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-white mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-900">Light Mode</h3>
        <Input leadingIcon={Search} defaultValue="Search query" clearable />
        <Input state="error" leadingIcon={Lock} defaultValue="Invalid input" />
        <Input state="success" leadingIcon={CheckCircle2} defaultValue="Verified input" />
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <Input leadingIcon={Search} defaultValue="Search query" clearable />
        <Input state="error" leadingIcon={Lock} defaultValue="Invalid input" />
        <Input state="success" leadingIcon={CheckCircle2} defaultValue="Verified input" />
      </div>
    </div>
  ),
};
