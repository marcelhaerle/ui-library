import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Tag } from 'lucide-react';
import { Badge, type BadgeSize, type BadgeVariant } from './Badge';

const variants: BadgeVariant[] = [
  'primary',
  'secondary',
  'outline',
  'success',
  'warning',
  'danger',
];

const sizes: BadgeSize[] = ['sm', 'md', 'lg'];

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
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
    removable: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Badge',
    variant: 'primary',
    size: 'md',
    removable: false,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Verified',
    icon: CheckCircle2,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Pending Review',
    icon: AlertTriangle,
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Critical',
    icon: ShieldAlert,
  },
};

const RemovableBadgeDemo = () => {
  const [tags, setTags] = useState(['React 19', 'Next.js', 'Tailwind CSS v4', 'TypeScript']);

  return (
    <div className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-3">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="primary"
          icon={Tag}
          removable
          removeLabel={`Remove ${tag}`}
          onRemove={() => setTags((current) => current.filter((item) => item !== tag))}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export const RemovableInteractive: Story = {
  render: () => <RemovableBadgeDemo />,
};

export const AllVariantsAndSizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-10 mhui:p-6">
      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          All Variants & Sizes (Without Icon)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          {variants.map((variant) => (
            <div key={variant} className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-4">
              <span className="mhui:w-24 mhui:text-sm mhui:font-medium mhui:text-slate-600 mhui:capitalize mhui:dark:text-slate-400">
                {variant}
              </span>
              {sizes.map((size) => (
                <Badge key={`${variant}-${size}`} variant={variant} size={size}>
                  {`${variant} (${size})`}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          All Variants & Sizes (With Icon & Removable)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          {variants.map((variant) => (
            <div
              key={`${variant}-icon`}
              className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-4"
            >
              <span className="mhui:w-24 mhui:text-sm mhui:font-medium mhui:text-slate-600 mhui:capitalize mhui:dark:text-slate-400">
                {variant}
              </span>
              {sizes.map((size) => (
                <Badge
                  key={`${variant}-${size}-icon`}
                  variant={variant}
                  size={size}
                  icon={Info}
                  removable
                  removeLabel={`Remove ${variant} ${size}`}
                >
                  {`${variant} (${size})`}
                </Badge>
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
            <Badge key={`light-${variant}`} variant={variant} icon={Tag} removable>
              {variant}
            </Badge>
          ))}
        </div>
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <div className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-3">
          {variants.map((variant) => (
            <Badge key={`dark-${variant}`} variant={variant} icon={Tag} removable>
              {variant}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  ),
};
