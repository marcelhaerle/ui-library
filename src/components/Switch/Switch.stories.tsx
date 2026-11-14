import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '../FormField';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    size: 'md',
    label: 'Enable automatic failback',
    labelPosition: 'right',
    disabled: false,
    error: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const CheckedByDefault: Story = {
  args: {
    defaultChecked: true,
    label: 'Real-time security alerts',
  },
};

export const WithDescription: Story = {
  args: {
    defaultChecked: true,
    label: 'Strict TLS verification',
    description: 'Reject upstream connections that do not present a valid certificate chain.',
  },
};

export const LabelLeft: Story = {
  args: {
    defaultChecked: true,
    labelPosition: 'left',
    label: 'Maintenance mode',
    description: 'Temporarily route incoming traffic to the static status page.',
    wrapperClassName: 'mhui:w-96',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-4">
      <Switch size="sm" defaultChecked label="Small switch (sm)" />
      <Switch size="md" defaultChecked label="Medium switch (md)" />
      <Switch size="lg" defaultChecked label="Large switch (lg)" />
    </div>
  ),
};

export const ErrorAndDisabledStates: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-4">
      <Switch error label="Error state (unchecked)" />
      <Switch error defaultChecked label="Error state (checked)" />
      <Switch disabled label="Disabled (unchecked)" />
      <Switch disabled defaultChecked label="Disabled (checked)" />
    </div>
  ),
};

const ControlledSwitchDemo = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="mhui:flex mhui:max-w-md mhui:flex-col mhui:gap-3">
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        label="High-availability replication"
        description={`Replication status: ${enabled ? 'Active' : 'Standby'}`}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledSwitchDemo />,
};

export const InsideFormField: Story = {
  render: () => (
    <div className="mhui:max-w-md">
      <FormField
        label="Telemetry"
        helperText="Anonymous performance metrics help us optimize cluster scheduling."
      >
        <Switch label="Share cluster telemetry" defaultChecked />
      </FormField>
    </div>
  ),
};
