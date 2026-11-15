import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../Button';
import { Alert, type AlertVariant } from './Alert';

const variants: AlertVariant[] = ['info', 'success', 'warning', 'danger'];

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    variant: 'info',
    title: 'Scheduled maintenance window',
    children:
      'Cluster control-plane upgrades will occur on Sunday between 02:00 and 03:00 UTC without workload interruption.',
    dismissible: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    dismissible: {
      control: 'boolean',
    },
    icon: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="mhui:flex mhui:max-w-2xl mhui:flex-col mhui:gap-4">
      <Alert variant="info" title="New region available">
        Deploy workloads in eu-central-2 (Zurich) with low-latency interconnect.
      </Alert>
      <Alert variant="success" title="Certificate renewed">
        TLS certificates for api.example.com have been provisioned and propagated across all edge
        nodes.
      </Alert>
      <Alert variant="warning" title="Memory utilization above 85%">
        Worker pool node-group-a is approaching its configured memory threshold. Consider scaling
        replicas.
      </Alert>
      <Alert variant="danger" title="Primary database connection failed">
        Unable to establish TLS handshake with replica-01. Automatic failover has been initiated.
      </Alert>
    </div>
  ),
};

export const WithActionAndCustomIcon: Story = {
  render: () => (
    <div className="mhui:max-w-2xl">
      <Alert
        variant="danger"
        icon={ShieldAlert}
        title="Revoked API key detected"
        action={
          <Button variant="danger" size="xs">
            Rotate Credentials
          </Button>
        }
      >
        Requests originating from service-account-prod were rejected due to an expired token.
      </Alert>
    </div>
  ),
};

const DismissibleAlertDemo = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button variant="outline" size="sm" onClick={() => setVisible(true)}>
        Restore Alert
      </Button>
    );
  }

  return (
    <div className="mhui:max-w-2xl">
      <Alert
        variant="success"
        title="Deployment completed"
        dismissible
        onDismiss={() => setVisible(false)}
      >
        Revision v2.14.0 is now serving 100% of production traffic.
      </Alert>
    </div>
  );
};

export const Dismissible: Story = {
  render: () => <DismissibleAlertDemo />,
};
