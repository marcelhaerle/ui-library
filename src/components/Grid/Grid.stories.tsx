import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody, CardHeader } from '../Card';
import { Heading, Text } from '../Typography';
import { Grid, type GridColumns, type GridGap } from './Grid';

const columnOptions: GridColumns[] = [1, 2, 3, 4, 6, 12];
const gapOptions: GridGap[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: {
    columns: 3,
    gap: 'md',
    align: 'stretch',
  },
  argTypes: {
    columns: {
      control: 'select',
      options: columnOptions,
    },
    gap: {
      control: 'select',
      options: gapOptions,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      {['Requests / sec', 'P99 Latency', 'Error Rate', 'Active Nodes', 'CPU Load', 'Memory'].map(
        (metric, index) => (
          <Card key={metric} variant="filled" padding="sm">
            <CardHeader>
              <Text size="xs" tone="muted">
                {metric}
              </Text>
              <Heading as="h4" size="md">
                {(index + 1) * 142}
              </Heading>
            </CardHeader>
          </Card>
        ),
      )}
    </Grid>
  ),
};

export const TwoColumnCards: Story = {
  render: () => (
    <Grid columns={2} gap="lg">
      <Card variant="elevated">
        <CardHeader>
          <Heading as="h3" size="sm">
            Primary Ingress
          </Heading>
        </CardHeader>
        <CardBody>Handles external HTTPS traffic and mutual TLS client verification.</CardBody>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <Heading as="h3" size="sm">
            Internal Mesh
          </Heading>
        </CardHeader>
        <CardBody>Routes east-west service communication across availability zones.</CardBody>
      </Card>
    </Grid>
  ),
};

export const TwelveColumnSystem: Story = {
  render: () => (
    <Grid columns={12} gap="sm">
      {Array.from({ length: 12 }, (_, idx) => (
        <div
          key={idx}
          className="mhui:flex mhui:h-12 mhui:items-center mhui:justify-center mhui:bg-blue-900 mhui:text-xs mhui:font-semibold mhui:text-white mhui:dark:bg-blue-800"
        >
          {idx + 1}
        </div>
      ))}
    </Grid>
  ),
};
