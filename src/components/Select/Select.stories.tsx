import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '../FormField';
import { Select, type SelectOption, type SelectSize, type SelectState } from './Select';

const frameworkOptions: SelectOption[] = [
  { value: 'nextjs', label: 'Next.js (App Router)', group: 'Fullstack Frameworks' },
  { value: 'remix', label: 'Remix / React Router v7', group: 'Fullstack Frameworks' },
  { value: 'vite', label: 'Vite + React 19', group: 'Frontend Tooling' },
  { value: 'astro', label: 'Astro Islands', group: 'Frontend Tooling' },
  {
    value: 'legacy',
    label: 'Create React App (Deprecated)',
    disabled: true,
    group: 'Frontend Tooling',
  },
];

const regionOptions: SelectOption[] = [
  { value: 'eu-central-1', label: 'Europe (Frankfurt) — eu-central-1' },
  { value: 'eu-west-1', label: 'Europe (Ireland) — eu-west-1' },
  { value: 'us-east-1', label: 'US East (N. Virginia) — us-east-1' },
  { value: 'us-west-2', label: 'US West (Oregon) — us-west-2' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo) — ap-northeast-1' },
];

const sizes: SelectSize[] = ['sm', 'md', 'lg'];
const states: SelectState[] = ['default', 'error', 'success'];

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
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
    searchable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    options: regionOptions,
    placeholder: 'Select deployment region...',
    size: 'md',
    state: 'default',
    searchable: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <div className="mhui:max-w-sm mhui:pb-56">
      <Select {...args} />
    </div>
  ),
};

export const SearchableWithGroups: Story = {
  render: () => {
    const SearchableDemo = () => {
      const [selected, setSelected] = useState('nextjs');
      return (
        <div className="mhui:max-w-sm mhui:pb-64">
          <FormField
            label="Target React Runtime"
            helperText="Filter options or navigate with Up/Down arrow keys."
            required
          >
            <Select
              options={frameworkOptions}
              value={selected}
              onValueChange={setSelected}
              searchable
              searchPlaceholder="Filter frameworks..."
            />
          </FormField>
        </div>
      );
    };
    return <SearchableDemo />;
  },
};

export const AllStatesAndSizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:max-w-xl mhui:flex-col mhui:gap-10 mhui:p-6 mhui:pb-56">
      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Sizes (sm, md, lg)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          {sizes.map((size) => (
            <Select key={size} size={size} options={regionOptions} defaultValue="eu-central-1" />
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Validation States (default, error, success, disabled)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          <Select state="default" options={regionOptions} placeholder="Default state..." />
          <Select state="error" options={regionOptions} placeholder="Error state..." />
          <Select state="success" options={regionOptions} defaultValue="eu-central-1" />
          <Select disabled options={regionOptions} defaultValue="us-east-1" />
        </div>
      </section>
    </div>
  ),
};

export const LightAndDarkShowcase: Story = {
  render: () => (
    <div className="mhui:grid mhui:grid-cols-1 mhui:gap-8 mhui:pb-56 mhui:lg:grid-cols-2">
      <div className="mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-white mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-900">Light Mode</h3>
        <Select options={frameworkOptions} defaultValue="nextjs" searchable />
        <Select options={regionOptions} state="error" placeholder="Required region..." />
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <Select options={frameworkOptions} defaultValue="nextjs" searchable />
        <Select options={regionOptions} state="error" placeholder="Required region..." />
      </div>
    </div>
  ),
};
