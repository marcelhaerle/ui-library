import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, RefreshCw, Settings } from 'lucide-react';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Tooltip, type TooltipPlacement } from './Tooltip';

const placements: TooltipPlacement[] = ['top', 'bottom', 'left', 'right'];

const meta: Meta<typeof Tooltip> = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Synchronize cluster configuration',
    placement: 'top',
    delayMs: 200,
    disabled: false,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: placements,
    },
    delayMs: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args) => (
    <div className="mhui:flex mhui:min-h-36 mhui:items-center mhui:justify-center">
      <Tooltip {...args}>
        <Button variant="primary">Hover or Focus Me</Button>
      </Tooltip>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="mhui:flex mhui:min-h-44 mhui:items-center mhui:justify-center">
      <Stack direction="horizontal" gap="lg" align="center">
        <Tooltip content="Top tooltip hint" placement="top" delayMs={0}>
          <Button variant="outline" size="sm">
            Top
          </Button>
        </Tooltip>
        <Tooltip content="Bottom tooltip hint" placement="bottom" delayMs={0}>
          <Button variant="outline" size="sm">
            Bottom
          </Button>
        </Tooltip>
        <Tooltip content="Left tooltip hint" placement="left" delayMs={0}>
          <Button variant="outline" size="sm">
            Left
          </Button>
        </Tooltip>
        <Tooltip content="Right tooltip hint" placement="right" delayMs={0}>
          <Button variant="outline" size="sm">
            Right
          </Button>
        </Tooltip>
      </Stack>
    </div>
  ),
};

export const IconButtonToolbar: Story = {
  render: () => (
    <div className="mhui:flex mhui:min-h-36 mhui:items-center mhui:justify-center">
      <Stack direction="horizontal" gap="sm">
        <Tooltip content="Copy cluster endpoint" placement="top">
          <Button variant="outline" size="sm" icon={Copy} iconOnly aria-label="Copy endpoint" />
        </Tooltip>
        <Tooltip content="Refresh telemetry" placement="top">
          <Button variant="outline" size="sm" icon={RefreshCw} iconOnly aria-label="Refresh" />
        </Tooltip>
        <Tooltip content="Open cluster settings" placement="top">
          <Button variant="outline" size="sm" icon={Settings} iconOnly aria-label="Settings" />
        </Tooltip>
      </Stack>
    </div>
  ),
};
