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
    <div className="mhui:flex mhui:flex-col mhui:gap-12 mhui:p-6">
      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          All Variants & Sizes (Without Icon)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-6">
          {variants.map((variant) => (
            <div key={variant} className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-4">
              <span className="mhui:w-24 mhui:text-sm mhui:font-medium mhui:text-slate-600 mhui:capitalize mhui:dark:text-slate-400">
                {variant}
              </span>
              {sizes.map((size) => (
                <Button key={`${variant}-${size}`} variant={variant} size={size}>
                  {`${variant} (${size})`}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          All Variants & Sizes (With Icon)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-6">
          {variants.map((variant) => (
            <div
              key={`${variant}-icon`}
              className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-4"
            >
              <span className="mhui:w-24 mhui:text-sm mhui:font-medium mhui:text-slate-600 mhui:capitalize mhui:dark:text-slate-400">
                {variant}
              </span>
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

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          All Variants & Sizes (Icon Only)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-6">
          {variants.map((variant) => (
            <div
              key={`${variant}-icon-only`}
              className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-4"
            >
              <span className="mhui:w-24 mhui:text-sm mhui:font-medium mhui:text-slate-600 mhui:capitalize mhui:dark:text-slate-400">
                {variant}
              </span>
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

export const LightAndDarkShowcase: Story = {
  render: () => (
    <div className="lg:mhui:grid-cols-2 mhui:grid mhui:grid-cols-1 mhui:gap-8">
      <div className="mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-white mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-900">Light Mode</h3>
        <div className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-3">
          {variants.map((variant) => (
            <Button key={`light-${variant}`} variant={variant} icon={Download}>
              {variant}
            </Button>
          ))}
        </div>
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <div className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-3">
          {variants.map((variant) => (
            <Button key={`dark-${variant}`} variant={variant} icon={Download}>
              {variant}
            </Button>
          ))}
        </div>
      </div>
    </div>
  ),
};
