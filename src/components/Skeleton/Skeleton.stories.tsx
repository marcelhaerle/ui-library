import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
    animated: {
      control: 'boolean',
    },
  },
  args: {
    width: '100%',
    height: 20,
    animated: true,
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: 240,
    height: 20,
    animated: true,
  },
};

export const StaticUnanimated: Story = {
  args: {
    width: 240,
    height: 20,
    animated: false,
  },
};

export const ContentPlaceholder: Story = {
  render: () => (
    <div className="mhui:flex mhui:max-w-md mhui:flex-col mhui:gap-4 mhui:p-6">
      <div className="mhui:flex mhui:items-center mhui:gap-4">
        <Skeleton width={48} height={48} />
        <div className="mhui:flex mhui:flex-1 mhui:flex-col mhui:gap-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton width="100%" height={120} />
      <div className="mhui:flex mhui:flex-col mhui:gap-2">
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} />
        <Skeleton width="75%" height={14} />
      </div>
    </div>
  ),
};

export const LightAndDarkShowcase: Story = {
  render: () => (
    <div className="mhui:grid mhui:grid-cols-1 mhui:gap-8 mhui:lg:grid-cols-2">
      <div className="mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-white mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-900">Light Mode</h3>
        <div className="mhui:flex mhui:items-center mhui:gap-4">
          <Skeleton width={48} height={48} />
          <div className="mhui:flex mhui:flex-1 mhui:flex-col mhui:gap-2">
            <Skeleton width="70%" height={16} />
            <Skeleton width="45%" height={12} />
          </div>
        </div>
        <Skeleton width="100%" height={80} />
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <div className="mhui:flex mhui:items-center mhui:gap-4">
          <Skeleton width={48} height={48} />
          <div className="mhui:flex mhui:flex-1 mhui:flex-col mhui:gap-2">
            <Skeleton width="70%" height={16} />
            <Skeleton width="45%" height={12} />
          </div>
        </div>
        <Skeleton width="100%" height={80} />
      </div>
    </div>
  ),
};
