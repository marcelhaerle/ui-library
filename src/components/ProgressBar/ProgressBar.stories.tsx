import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Data Display/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    max: {
      control: 'number',
    },
    showValueLabel: {
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Deployment progress',
    value: 65,
    max: 100,
    variant: 'primary',
    size: 'md',
    showValueLabel: true,
    indeterminate: false,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-4">
      <ProgressBar label="Primary" value={40} variant="primary" showValueLabel />
      <ProgressBar label="Success" value={100} variant="success" showValueLabel />
      <ProgressBar label="Warning" value={75} variant="warning" showValueLabel />
      <ProgressBar label="Danger" value={90} variant="danger" showValueLabel />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    label: 'Synchronizing records...',
    indeterminate: true,
    showValueLabel: false,
  },
};
