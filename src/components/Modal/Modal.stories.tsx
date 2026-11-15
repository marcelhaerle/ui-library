import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Stack } from '../Stack';
import { Modal, ModalBody, ModalFooter, type ModalSize } from './Modal';

const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    size: 'md',
    closeOnOverlayClick: true,
    closeOnEscape: true,
    showCloseButton: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
    closeOnOverlayClick: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    showCloseButton: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const DefaultModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Confirm cluster failover"
        description="Traffic will be drained from eu-central-1a and routed to standby replicas in eu-central-1b."
      >
        <ModalBody>
          Active WebSocket sessions will reconnect automatically within 3 seconds. Database write
          locks will pause briefly during primary promotion.
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Initiate Failover
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultModalDemo />,
};

const FormModalDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Create API Token
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        size="md"
        title="Generate service token"
        description="Tokens grant programmatic access to cluster deployment endpoints."
      >
        <ModalBody>
          <Stack gap="md">
            <FormField label="Token Name" required>
              <Input placeholder="ci-deploy-production" />
            </FormField>
            <FormField label="Expiration (days)" helperText="Maximum 365 days.">
              <Input type="number" defaultValue="90" />
            </FormField>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="success" size="sm" onClick={() => setOpen(false)}>
            Create Token
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export const WithFormControls: Story = {
  render: () => <FormModalDemo />,
};

const SizeVariantsDemo = () => {
  const [activeSize, setActiveSize] = useState<ModalSize | null>(null);

  return (
    <Stack direction="horizontal" gap="sm" wrap>
      {sizes.map((size) => (
        <Button key={size} variant="outline" size="sm" onClick={() => setActiveSize(size)}>
          Open {size.toUpperCase()}
        </Button>
      ))}
      <Modal
        open={activeSize !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveSize(null);
        }}
        size={activeSize ?? 'md'}
        title={`Modal Size: ${(activeSize ?? 'md').toUpperCase()}`}
        description="Demonstrating responsive width presets and sharp corporate surface geometry."
      >
        <ModalBody>
          Press Escape or click the backdrop overlay to dismiss this dialog and return focus to the
          trigger button.
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" size="sm" onClick={() => setActiveSize(null)}>
            Done
          </Button>
        </ModalFooter>
      </Modal>
    </Stack>
  );
};

export const Sizes: Story = {
  render: () => <SizeVariantsDemo />,
};
