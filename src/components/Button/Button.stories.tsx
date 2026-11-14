import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowRight,
  Check,
  Download,
  Mail,
  Plus,
  Settings,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

const variants: ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'text',
  'success',
  'warning',
  'danger',
];

const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    size: {
      control: 'select',
      options: sizes,
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    iconOnly: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    iconPosition: 'left',
    iconOnly: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
    icon: Check,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Button',
    icon: AlertTriangle,
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
    icon: Trash2,
  },
};

export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    children: 'Send Email',
    icon: Mail,
    iconPosition: 'left',
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'primary',
    children: 'Continue',
    icon: ArrowRight,
    iconPosition: 'right',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    icon: Settings,
    iconOnly: true,
    'aria-label': 'Settings',
  },
};

export const AllVariantsAndSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          All Variants & Sizes (Without Icon)
        </h2>
        <div className="flex flex-col gap-6">
          {variants.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-4">
              <span className="w-24 text-sm font-medium text-slate-600 capitalize">{variant}</span>
              {sizes.map((size) => (
                <Button key={`${variant}-${size}`} variant={variant} size={size}>
                  {`${variant} (${size})`}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">All Variants & Sizes (With Icon)</h2>
        <div className="flex flex-col gap-6">
          {variants.map((variant) => (
            <div key={`${variant}-icon`} className="flex flex-wrap items-center gap-4">
              <span className="w-24 text-sm font-medium text-slate-600 capitalize">{variant}</span>
              {sizes.map((size) => (
                <Button
                  key={`${variant}-${size}-icon`}
                  variant={variant}
                  size={size}
                  icon={Download}
                >
                  {`${variant} (${size})`}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">All Variants & Sizes (Icon Only)</h2>
        <div className="flex flex-col gap-6">
          {variants.map((variant) => (
            <div key={`${variant}-icon-only`} className="flex flex-wrap items-center gap-4">
              <span className="w-24 text-sm font-medium text-slate-600 capitalize">{variant}</span>
              {sizes.map((size) => (
                <Button
                  key={`${variant}-${size}-icon-only`}
                  variant={variant}
                  size={size}
                  icon={Plus}
                  iconOnly
                  aria-label={`${variant} ${size} add button`}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
