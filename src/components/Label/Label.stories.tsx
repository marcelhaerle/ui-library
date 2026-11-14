import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, type LabelSize } from './Label';

const sizes: LabelSize[] = ['sm', 'md', 'lg'];

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Email Address',
    size: 'md',
    required: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Email Address',
  },
};

export const Required: Story = {
  args: {
    children: 'Email Address',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Field Label',
    disabled: true,
  },
};

export const AllSizesAndStates: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-6 mhui:p-6">
      {sizes.map((size) => (
        <div key={size} className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-8">
          <Label size={size}>{`Standard (${size})`}</Label>
          <Label size={size} required>{`Required (${size})`}</Label>
          <Label size={size} disabled>{`Disabled (${size})`}</Label>
        </div>
      ))}
    </div>
  ),
};
