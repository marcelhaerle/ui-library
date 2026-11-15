import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Toast, ToastProvider, useToast, type ToastPosition, type ToastVariant } from './Toast';

const variants: ToastVariant[] = ['info', 'success', 'warning', 'danger'];
const positions: ToastPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    variant: 'info',
    title: 'Configuration saved',
    description: 'Ingress routing rules have been updated across 4 availability zones.',
    duration: 0,
    dismissible: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    duration: {
      control: 'number',
    },
    dismissible: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack gap="md">
      <Toast
        variant="info"
        duration={0}
        title="Build queued"
        description="Pipeline #842 is waiting for an available runner."
      />
      <Toast
        variant="success"
        duration={0}
        title="Deployment live"
        description="Revision v3.2.0 is now active on production."
      />
      <Toast
        variant="warning"
        duration={0}
        title="Rate limit approaching"
        description="85% of hourly API burst capacity consumed."
      />
      <Toast
        variant="danger"
        duration={0}
        title="Snapshot failed"
        description="Volume vol-0a91b could not be locked for backup."
        action={{ label: 'Retry', onClick: () => {} }}
      />
    </Stack>
  ),
};

const InteractiveToasterTriggers = () => {
  const { toast, clear } = useToast();

  return (
    <Stack direction="horizontal" gap="sm" wrap>
      <Button
        variant="primary"
        size="sm"
        onClick={() =>
          toast({
            variant: 'info',
            title: 'Syncing cluster state',
            description: 'Fetching latest pod health metrics...',
          })
        }
      >
        Trigger Info
      </Button>
      <Button
        variant="success"
        size="sm"
        onClick={() =>
          toast({
            variant: 'success',
            title: 'Backup completed',
            description: 'Encrypted snapshot stored in eu-central-1.',
          })
        }
      >
        Trigger Success
      </Button>
      <Button
        variant="warning"
        size="sm"
        onClick={() =>
          toast({
            variant: 'warning',
            title: 'High latency detected',
            description: 'P99 response time exceeded 250 ms.',
          })
        }
      >
        Trigger Warning
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() =>
          toast({
            variant: 'danger',
            title: 'Connection dropped',
            description: 'Lost heartbeat from worker-node-04.',
            action: {
              label: 'Reconnect',
              onClick: () => {},
            },
          })
        }
      >
        Trigger Danger
      </Button>
      <Button variant="outline" size="sm" onClick={clear}>
        Clear All
      </Button>
    </Stack>
  );
};

const InteractiveToasterDemo = () => {
  const [position, setPosition] = useState<ToastPosition>('bottom-right');

  return (
    <ToastProvider position={position}>
      <Stack gap="md">
        <Stack direction="horizontal" gap="xs" wrap>
          {positions.map((pos) => (
            <Button
              key={pos}
              variant={position === pos ? 'secondary' : 'outline'}
              size="xs"
              onClick={() => setPosition(pos)}
            >
              {pos}
            </Button>
          ))}
        </Stack>
        <InteractiveToasterTriggers />
      </Stack>
    </ToastProvider>
  );
};

export const QueuedToaster: Story = {
  render: () => <InteractiveToasterDemo />,
};
