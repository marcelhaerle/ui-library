import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const SAMPLE_AVATAR_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">' +
      '<rect width="128" height="128" fill="#1e3a8a"/>' +
      '<circle cx="64" cy="48" r="22" fill="#e2e8f0"/>' +
      '<path d="M24 116c6-24 24-36 40-36s34 12 40 36" fill="#e2e8f0"/>' +
      '</svg>',
  );

const meta: Meta<typeof Avatar> = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy', 'away'],
    },
  },
  args: {
    alt: 'Marcel Haerle',
    initials: 'MH',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    src: SAMPLE_AVATAR_SVG,
    alt: 'Marcel Haerle',
    status: 'online',
  },
};

export const SizesAndStatuses: Story = {
  render: () => (
    <div className="mhui:flex mhui:items-center mhui:gap-4">
      <Avatar size="xs" initials="XS" status="online" />
      <Avatar size="sm" initials="SM" status="away" />
      <Avatar size="md" initials="MD" status="busy" />
      <Avatar size="lg" initials="LG" status="offline" />
      <Avatar size="xl" src={SAMPLE_AVATAR_SVG} alt="Marcel Haerle" status="online" />
    </div>
  ),
};
