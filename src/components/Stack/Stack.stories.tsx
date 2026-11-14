import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card, CardBody } from '../Card';
import { Heading, Text } from '../Typography';
import {
  Stack,
  type StackAlign,
  type StackDirection,
  type StackGap,
  type StackJustify,
} from './Stack';

const directions: StackDirection[] = ['vertical', 'horizontal'];
const gaps: StackGap[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const aligns: StackAlign[] = ['start', 'center', 'end', 'stretch', 'baseline'];
const justifies: StackJustify[] = ['start', 'center', 'end', 'between', 'around'];

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
  argTypes: {
    direction: {
      control: 'radio',
      options: directions,
    },
    gap: {
      control: 'select',
      options: gaps,
    },
    align: {
      control: 'select',
      options: aligns,
    },
    justify: {
      control: 'select',
      options: justifies,
    },
    wrap: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args} className="mhui:max-w-lg">
      <Card variant="filled" padding="sm">
        <CardBody>First stacked item</CardBody>
      </Card>
      <Card variant="filled" padding="sm">
        <CardBody>Second stacked item</CardBody>
      </Card>
      <Card variant="filled" padding="sm">
        <CardBody>Third stacked item</CardBody>
      </Card>
    </Stack>
  ),
};

export const HorizontalToolbar: Story = {
  render: () => (
    <Card variant="elevated" padding="md" className="mhui:max-w-2xl">
      <Stack direction="horizontal" align="center" justify="between" gap="md">
        <Stack direction="vertical" gap="xs">
          <Heading as="h3" size="sm">
            Deployment Pipeline
          </Heading>
          <Text size="xs" tone="muted">
            Last triggered 4 minutes ago
          </Text>
        </Stack>
        <Stack direction="horizontal" align="center" gap="sm">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Promote Build
          </Button>
        </Stack>
      </Stack>
    </Card>
  ),
};

export const WrappingTags: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap className="mhui:max-w-sm">
      <Badge variant="primary">kubernetes</Badge>
      <Badge variant="secondary">eu-central-1</Badge>
      <Badge variant="outline">terraform</Badge>
      <Badge variant="success">zero-downtime</Badge>
      <Badge variant="outline">observability</Badge>
      <Badge variant="primary">envoy-proxy</Badge>
      <Badge variant="secondary">postgres-17</Badge>
    </Stack>
  ),
};
