import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, type CheckboxSize } from './Checkbox';

const sizes: CheckboxSize[] = ['sm', 'md', 'lg'];

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
    indeterminate: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Accept terms and conditions',
    description: 'You agree to our Terms of Service and Privacy Policy.',
    size: 'md',
    indeterminate: false,
    error: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Enable security alerts',
    description: 'Receive immediate email notifications when a new device signs in.',
    defaultChecked: true,
  },
};

const IndeterminateDemo = () => {
  const [items, setItems] = useState([true, false, true]);
  const allChecked = items.every(Boolean);
  const isIndeterminate = items.some(Boolean) && !allChecked;

  return (
    <div className="mhui:flex mhui:flex-col mhui:gap-3">
      <Checkbox
        label="Select all permissions"
        checked={allChecked}
        indeterminate={isIndeterminate}
        onCheckedChange={(next) => setItems([next, next, next])}
      />
      <div className="mhui:ml-6 mhui:flex mhui:flex-col mhui:gap-2">
        {['Read repositories', 'Write packages', 'Delete deployments'].map((perm, idx) => (
          <Checkbox
            key={perm}
            size="sm"
            label={perm}
            checked={items[idx]}
            onCheckedChange={(next) =>
              setItems((prev) => prev.map((val, i) => (i === idx ? next : val)))
            }
          />
        ))}
      </div>
    </div>
  );
};

export const IndeterminateInteractive: Story = {
  render: () => <IndeterminateDemo />,
};

export const AllStatesAndSizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-10 mhui:p-6">
      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Sizes (sm, md, lg)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          {sizes.map((size) => (
            <Checkbox
              key={size}
              size={size}
              defaultChecked
              label={`Checkbox (${size})`}
              description={`Supporting description for ${size} checkbox.`}
            />
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          States (unchecked, checked, indeterminate, error, disabled)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          <Checkbox label="Unchecked option" />
          <Checkbox label="Checked option" defaultChecked />
          <Checkbox label="Indeterminate option" indeterminate />
          <Checkbox
            label="Error state option"
            description="You must accept the compliance policy."
            error
            required
          />
          <Checkbox label="Disabled unchecked" disabled />
          <Checkbox label="Disabled checked" defaultChecked disabled />
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
        <Checkbox
          label="Checked option"
          description="Standard checked state in Light mode."
          defaultChecked
        />
        <Checkbox label="Indeterminate option" indeterminate />
        <Checkbox label="Error option" error />
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <Checkbox
          label="Checked option"
          description="Standard checked state in Dark mode."
          defaultChecked
        />
        <Checkbox label="Indeterminate option" indeterminate />
        <Checkbox label="Error option" error />
      </div>
    </div>
  ),
};
