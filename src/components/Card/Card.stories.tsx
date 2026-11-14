import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, CheckCircle2, Server } from 'lucide-react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Heading, Text } from '../Typography';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  type CardElement,
  type CardPadding,
  type CardVariant,
} from './Card';

const variants: CardVariant[] = ['elevated', 'filled', 'subtle'];
const paddings: CardPadding[] = ['none', 'sm', 'md', 'lg'];
const elements: CardElement[] = ['div', 'article', 'section'];

const meta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    variant: 'elevated',
    padding: 'md',
    interactive: false,
    as: 'div',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    padding: {
      control: 'select',
      options: paddings,
    },
    interactive: {
      control: 'boolean',
    },
    as: {
      control: 'select',
      options: elements,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="mhui:max-w-md">
      <CardHeader>
        <div className="mhui:flex mhui:items-center mhui:justify-between mhui:gap-3">
          <Heading as="h3" size="md">
            Production Cluster
          </Heading>
          <Badge variant="success" size="sm" icon={CheckCircle2}>
            Healthy
          </Badge>
        </div>
        <Text size="sm" tone="muted">
          eu-central-1 • 12 active nodes
        </Text>
      </CardHeader>
      <CardBody>
        All primary workloads are operating within nominal latency thresholds. Automated snapshots
        are scheduled every 6 hours.
      </CardBody>
      <CardFooter>
        <Button variant="outline" size="sm">
          View Logs
        </Button>
        <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
          Manage
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="mhui:grid mhui:max-w-4xl mhui:grid-cols-1 mhui:gap-6 mhui:md:grid-cols-3">
      <Card variant="elevated">
        <CardHeader>
          <Heading as="h3" size="sm">
            Elevated Surface
          </Heading>
          <Text size="xs" tone="muted">
            Default shadow elevation
          </Text>
        </CardHeader>
        <CardBody>
          Uses background contrast and subtle drop shadow to lift key content above the canvas.
        </CardBody>
      </Card>

      <Card variant="filled">
        <CardHeader>
          <Heading as="h3" size="sm">
            Filled Surface
          </Heading>
          <Text size="xs" tone="muted">
            Solid surface contrast
          </Text>
        </CardHeader>
        <CardBody>
          Separates secondary modules and grouped metrics without borders or drop shadows.
        </CardBody>
      </Card>

      <Card variant="subtle">
        <CardHeader>
          <Heading as="h3" size="sm">
            Subtle Surface
          </Heading>
          <Text size="xs" tone="muted">
            Low-contrast container
          </Text>
        </CardHeader>
        <CardBody>
          Provides gentle spatial grouping for background sections and supplementary notes.
        </CardBody>
      </Card>
    </div>
  ),
};

export const PaddingScales: Story = {
  render: () => (
    <div className="mhui:flex mhui:max-w-xl mhui:flex-col mhui:gap-6">
      {(['sm', 'md', 'lg'] as const).map((pad) => (
        <Card key={pad} variant="filled" padding={pad}>
          <CardHeader>
            <Heading as="h4" size="sm">
              Padding: {pad}
            </Heading>
          </CardHeader>
          <CardBody>
            Internal spacing adapts proportionally across header, body, and footer sections.
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const InteractiveCards: Story = {
  render: () => (
    <div className="mhui:grid mhui:max-w-3xl mhui:grid-cols-1 mhui:gap-6 mhui:md:grid-cols-2">
      <Card as="article" variant="elevated" interactive>
        <CardHeader>
          <div className="mhui:flex mhui:items-center mhui:gap-2.5">
            <Server className="mhui:h-5 mhui:w-5 mhui:text-blue-900 mhui:dark:text-blue-400" />
            <Heading as="h3" size="sm">
              Edge Gateway (Frankfurt)
            </Heading>
          </div>
        </CardHeader>
        <CardBody>
          Click or focus via keyboard to inspect real-time throughput and TLS termination metrics.
        </CardBody>
        <CardFooter align="between">
          <Text size="xs" tone="muted">
            99.99% uptime
          </Text>
          <Text size="xs" weight="semibold" tone="primary">
            Inspect →
          </Text>
        </CardFooter>
      </Card>

      <Card as="article" variant="filled" interactive>
        <CardHeader>
          <div className="mhui:flex mhui:items-center mhui:gap-2.5">
            <Server className="mhui:h-5 mhui:w-5 mhui:text-emerald-800 mhui:dark:text-emerald-400" />
            <Heading as="h3" size="sm">
              Replica Set (Dublin)
            </Heading>
          </div>
        </CardHeader>
        <CardBody>
          Click or focus via keyboard to review read-replica lag and automatic failover settings.
        </CardBody>
        <CardFooter align="between">
          <Text size="xs" tone="muted">
            14 ms replication lag
          </Text>
          <Text size="xs" weight="semibold" tone="success">
            Synchronized →
          </Text>
        </CardFooter>
      </Card>
    </div>
  ),
};
