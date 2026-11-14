import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner, type SpinnerSize, type SpinnerVariant } from './Spinner';

const sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const variants: SpinnerVariant[] = ['primary', 'secondary', 'current'];

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
    variant: {
      control: 'select',
      options: variants,
    },
    label: {
      control: 'text',
    },
  },
  args: {
    size: 'md',
    variant: 'primary',
    label: 'Loading...',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
  },
};

export const CurrentColor: Story = {
  render: () => (
    <div className="mhui:inline-flex mhui:items-center mhui:gap-2 mhui:bg-blue-900 mhui:px-4 mhui:py-2 mhui:text-sm mhui:font-medium mhui:text-white">
      <Spinner variant="current" size="sm" label="Saving changes..." />
      <span>Saving changes...</span>
    </div>
  ),
};

export const AllVariantsAndSizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-8 mhui:p-6">
      {variants.map((variant) => (
        <div key={variant} className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-6">
          <span className="mhui:w-28 mhui:text-sm mhui:font-medium mhui:text-slate-600 mhui:capitalize mhui:dark:text-slate-400">
            {variant}
          </span>
          {sizes.map((size) => (
            <div
              key={`${variant}-${size}`}
              className="mhui:flex mhui:flex-col mhui:items-center mhui:gap-2"
            >
              <Spinner variant={variant} size={size} label={`Loading ${variant} ${size}`} />
              <span className="mhui:text-xs mhui:text-slate-500 mhui:dark:text-slate-400">
                {size}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const LightAndDarkShowcase: Story = {
  render: () => (
    <div className="mhui:grid mhui:grid-cols-1 mhui:gap-8 mhui:lg:grid-cols-2">
      <div className="mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-white mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-900">Light Mode</h3>
        <div className="mhui:flex mhui:items-center mhui:gap-6 mhui:text-slate-900">
          {variants.map((variant) => (
            <Spinner key={`light-${variant}`} variant={variant} size="lg" />
          ))}
        </div>
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <div className="mhui:flex mhui:items-center mhui:gap-6 mhui:text-slate-100">
          {variants.map((variant) => (
            <Spinner key={`dark-${variant}`} variant={variant} size="lg" />
          ))}
        </div>
      </div>
    </div>
  ),
};
