import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '../FormField';
import { Radio, RadioGroup, type RadioSize } from './RadioGroup';

const sizes: RadioSize[] = ['sm', 'md', 'lg'];

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
    size: {
      control: 'select',
      options: sizes,
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
  args: {
    defaultValue: 'standard',
    orientation: 'vertical',
    size: 'md',
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} aria-label="Deployment Tier">
      <Radio
        value="starter"
        label="Starter Tier"
        description="Shared compute with 2 vCPUs and 4 GB RAM."
      />
      <Radio
        value="standard"
        label="Standard Production"
        description="Dedicated compute with auto-scaling and daily backups."
      />
      <Radio
        value="enterprise"
        label="Enterprise Multi-Region"
        description="Active-active replication with 99.99% SLA."
      />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup orientation="horizontal" defaultValue="monthly" aria-label="Billing Cycle">
      <Radio value="monthly" label="Monthly Billing" />
      <Radio value="quarterly" label="Quarterly (-10%)" />
      <Radio value="annual" label="Annual (-20%)" />
    </RadioGroup>
  ),
};

const ControlledRadioDemo = () => {
  const [plan, setPlan] = useState('pro');

  return (
    <div className="mhui:max-w-md">
      <FormField
        label="Select Support Plan"
        helperText={`Currently selected plan code: "${plan}"`}
        required
      >
        <RadioGroup value={plan} onValueChange={setPlan}>
          <Radio value="basic" label="Community Support" description="Forum response within 72h." />
          <Radio
            value="pro"
            label="Priority Engineering Support"
            description="Direct Slack channel with 4h response SLA."
          />
          <Radio
            value="dedicated"
            label="Dedicated Solutions Architect"
            description="24/7 incident hotline and quarterly architecture reviews."
          />
        </RadioGroup>
      </FormField>
    </div>
  );
};

export const ControlledWithFormField: Story = {
  render: () => <ControlledRadioDemo />,
};

export const AllStatesAndSizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-10 mhui:p-6">
      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Sizes (sm, md, lg)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-6">
          {sizes.map((size) => (
            <RadioGroup
              key={size}
              size={size}
              orientation="horizontal"
              defaultValue="opt-1"
              aria-label={`Size ${size}`}
            >
              <Radio
                value="opt-1"
                label={`Selected (${size})`}
                description={`Description (${size})`}
              />
              <Radio
                value="opt-2"
                label={`Unselected (${size})`}
                description={`Description (${size})`}
              />
            </RadioGroup>
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Error & Disabled States
        </h2>
        <div className="mhui:grid mhui:grid-cols-1 mhui:gap-6 mhui:md:grid-cols-2">
          <RadioGroup error defaultValue="invalid" aria-label="Error RadioGroup">
            <Radio value="invalid" label="Error selected" description="Needs attention." />
            <Radio value="other" label="Error unselected" />
          </RadioGroup>

          <RadioGroup disabled defaultValue="locked" aria-label="Disabled RadioGroup">
            <Radio value="locked" label="Disabled selected" />
            <Radio value="unlocked" label="Disabled unselected" />
          </RadioGroup>
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
        <RadioGroup defaultValue="eu" aria-label="Light Mode Region">
          <Radio
            value="eu"
            label="European Union (Frankfurt)"
            description="GDPR compliant primary cluster."
          />
          <Radio value="us" label="United States (Virginia)" />
        </RadioGroup>
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <RadioGroup defaultValue="eu" aria-label="Dark Mode Region">
          <Radio
            value="eu"
            label="European Union (Frankfurt)"
            description="GDPR compliant primary cluster."
          />
          <Radio value="us" label="United States (Virginia)" />
        </RadioGroup>
      </div>
    </div>
  ),
};
