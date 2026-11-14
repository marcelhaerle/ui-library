import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionValue,
  type AccordionVariant,
} from './Accordion';

const variants: AccordionVariant[] = ['subtle', 'filled', 'elevated'];

const meta: Meta<typeof Accordion> = {
  title: 'Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    type: 'single',
    defaultValue: 'item-1',
    collapsible: true,
    disabled: false,
    variant: 'subtle',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
    },
    variant: {
      control: 'select',
      options: variants,
    },
    collapsible: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} className="mhui:max-w-xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>How is zero-downtime deployment handled?</AccordionTrigger>
        <AccordionContent>
          New container instances are provisioned and health-checked in parallel before the ingress
          load balancer drains active connections from the previous revision.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What encryption standards protect data at rest?</AccordionTrigger>
        <AccordionContent>
          Persistent volumes and automated database snapshots are encrypted using AES-256-GCM with
          envelope keys rotated every 30 days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I restrict API access by CIDR block?</AccordionTrigger>
        <AccordionContent>
          Yes. Configure inbound IP allowlists per environment under the Network Policies section of
          your project settings.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const MultipleExpansion: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['security', 'compliance']} className="mhui:max-w-xl">
      <AccordionItem value="security">
        <AccordionTrigger>Mutual TLS Authentication</AccordionTrigger>
        <AccordionContent>
          All service-to-service communication inside the mesh enforces strict mTLS with short-lived
          SPIFFE identities.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="compliance">
        <AccordionTrigger>Audit Log Retention</AccordionTrigger>
        <AccordionContent>
          Administrative actions and RBAC policy changes are streamed to immutable cold storage for
          365 days by default.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="backups">
        <AccordionTrigger>Point-in-Time Recovery</AccordionTrigger>
        <AccordionContent>
          Write-ahead logs are archived continuously, enabling restoration to any second within the
          configured 14-day retention window.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const SurfaceVariants: Story = {
  render: () => (
    <div className="mhui:flex mhui:max-w-xl mhui:flex-col mhui:gap-6">
      {variants.map((variant) => (
        <Accordion key={variant} variant={variant} defaultValue="v-1">
          <AccordionItem value="v-1">
            <AccordionTrigger>Surface variant: {variant}</AccordionTrigger>
            <AccordionContent>
              Uses spacing and surface elevation instead of borders to delineate collapsible
              sections.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="v-2">
            <AccordionTrigger>Secondary section ({variant})</AccordionTrigger>
            <AccordionContent>Additional details for the {variant} surface style.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  ),
};

const ControlledAccordionDemo = () => {
  const [active, setActive] = useState<AccordionValue>('step-1');

  return (
    <div className="mhui:flex mhui:max-w-xl mhui:flex-col mhui:gap-3">
      <div className="mhui:text-xs mhui:font-medium mhui:text-slate-600 mhui:dark:text-slate-400">
        Active section: <span className="mhui:font-mono">{String(active || 'none')}</span>
      </div>
      <Accordion type="single" value={active} onValueChange={setActive}>
        <AccordionItem value="step-1">
          <AccordionTrigger>1. Provision Cluster</AccordionTrigger>
          <AccordionContent>
            Select target region and worker node instance profile.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="step-2">
          <AccordionTrigger>2. Configure Ingress</AccordionTrigger>
          <AccordionContent>
            Bind custom domain names and provision TLS certificates.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="step-3" disabled>
          <AccordionTrigger>3. Enable Federation (Locked)</AccordionTrigger>
          <AccordionContent>Requires multi-region enterprise license.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const ControlledAndDisabled: Story = {
  render: () => <ControlledAccordionDemo />,
};
