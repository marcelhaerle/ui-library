import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody, CardHeader } from '../Card';
import { Heading, Text } from '../Typography';
import {
  TabContent,
  TabList,
  Tabs,
  TabTrigger,
  type TabsOrientation,
  type TabsSize,
  type TabsVariant,
} from './Tabs';

const variants: TabsVariant[] = ['underline', 'solid'];
const sizes: TabsSize[] = ['sm', 'md', 'lg'];
const orientations: TabsOrientation[] = ['horizontal', 'vertical'];

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    defaultValue: 'overview',
    variant: 'underline',
    size: 'md',
    orientation: 'horizontal',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    size: {
      control: 'select',
      options: sizes,
    },
    orientation: {
      control: 'radio',
      options: orientations,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="mhui:max-w-2xl">
      <TabList aria-label="Cluster sections">
        <TabTrigger value="overview">Overview</TabTrigger>
        <TabTrigger value="nodes">Worker Nodes</TabTrigger>
        <TabTrigger value="network">Network Mesh</TabTrigger>
        <TabTrigger value="audit" disabled>
          Audit Trail (Locked)
        </TabTrigger>
      </TabList>
      <TabContent value="overview">
        <Card variant="filled" padding="md">
          <CardHeader>
            <Heading as="h4" size="sm">
              Cluster Overview
            </Heading>
          </CardHeader>
          <CardBody>
            Control plane is healthy across 3 availability zones with 99.99% API uptime over the
            last 30 days.
          </CardBody>
        </Card>
      </TabContent>
      <TabContent value="nodes">
        <Card variant="filled" padding="md">
          <CardHeader>
            <Heading as="h4" size="sm">
              Worker Nodes (18 Active)
            </Heading>
          </CardHeader>
          <CardBody>
            All compute instances are running Linux kernel 6.12 with cgroup v2 isolation enabled.
          </CardBody>
        </Card>
      </TabContent>
      <TabContent value="network">
        <Card variant="filled" padding="md">
          <CardHeader>
            <Heading as="h4" size="sm">
              East-West Service Mesh
            </Heading>
          </CardHeader>
          <CardBody>Mutual TLS certificate rotation occurs automatically every 24 hours.</CardBody>
        </Card>
      </TabContent>
    </Tabs>
  ),
};

export const SolidVariant: Story = {
  render: () => (
    <Tabs defaultValue="metrics" variant="solid" className="mhui:max-w-2xl">
      <TabList aria-label="Telemetry views">
        <TabTrigger value="metrics">Metrics</TabTrigger>
        <TabTrigger value="logs">Live Logs</TabTrigger>
        <TabTrigger value="traces">Distributed Traces</TabTrigger>
      </TabList>
      <TabContent value="metrics">
        <Card variant="subtle" padding="md">
          <Text size="sm">P95 latency is 18 ms across all ingress gateways.</Text>
        </Card>
      </TabContent>
      <TabContent value="logs">
        <Card variant="subtle" padding="md">
          <Text size="sm">Streaming structured JSON logs from 42 active pods.</Text>
        </Card>
      </TabContent>
      <TabContent value="traces">
        <Card variant="subtle" padding="md">
          <Text size="sm">OpenTelemetry spans sampled at 10% in production.</Text>
        </Card>
      </TabContent>
    </Tabs>
  ),
};

export const VerticalOrientation: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" variant="solid" className="mhui:max-w-2xl">
      <TabList aria-label="Settings categories">
        <TabTrigger value="general">General</TabTrigger>
        <TabTrigger value="security">Security</TabTrigger>
        <TabTrigger value="billing">Quotas & Billing</TabTrigger>
      </TabList>
      <TabContent value="general">
        <Card variant="filled" padding="md">
          <Heading as="h4" size="sm">
            General Project Settings
          </Heading>
          <Text size="sm" tone="muted">
            Configure project display name, default region, and retention policies.
          </Text>
        </Card>
      </TabContent>
      <TabContent value="security">
        <Card variant="filled" padding="md">
          <Heading as="h4" size="sm">
            Security & Access Control
          </Heading>
          <Text size="sm" tone="muted">
            Enforce hardware security keys and SSO SAML federation.
          </Text>
        </Card>
      </TabContent>
      <TabContent value="billing">
        <Card variant="filled" padding="md">
          <Heading as="h4" size="sm">
            Resource Quotas
          </Heading>
          <Text size="sm" tone="muted">
            Current allocation: 64 vCPU / 256 GB RAM across all namespaces.
          </Text>
        </Card>
      </TabContent>
    </Tabs>
  ),
};
