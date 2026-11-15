import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Stack } from '../Stack';
import { Switch } from '../Switch';
import { Drawer, DrawerBody, DrawerFooter, type DrawerSide, type DrawerSize } from './Drawer';

const sides: DrawerSide[] = ['right', 'left', 'top', 'bottom'];
const sizes: DrawerSize[] = ['sm', 'md', 'lg', 'xl'];

const meta: Meta<typeof Drawer> = {
  title: 'Feedback/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: {
    side: 'right',
    size: 'md',
    closeOnOverlayClick: true,
    closeOnEscape: true,
    showCloseButton: true,
  },
  argTypes: {
    side: {
      control: 'select',
      options: sides,
    },
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
type Story = StoryObj<typeof Drawer>;

const DefaultDrawerDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Filter Drawer
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        size="md"
        title="Node Pool Configuration"
        description="Adjust autoscaling bounds and network security settings for worker-pool-eu."
      >
        <DrawerBody>
          <Stack gap="md">
            <FormField label="Minimum Replicas">
              <Input type="number" defaultValue="3" />
            </FormField>
            <FormField label="Maximum Replicas">
              <Input type="number" defaultValue="24" />
            </FormField>
            <Switch
              defaultChecked
              label="Auto-repair unhealthy nodes"
              description="Replace unresponsive instances automatically after 3 failed health probes."
            />
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Apply Changes
          </Button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultDrawerDemo />,
};

const PlacementVariantsDemo = () => {
  const [activeSide, setActiveSide] = useState<DrawerSide | null>(null);

  return (
    <Stack direction="horizontal" gap="sm" wrap>
      {sides.map((side) => (
        <Button key={side} variant="outline" size="sm" onClick={() => setActiveSide(side)}>
          Open {side.toUpperCase()}
        </Button>
      ))}
      <Drawer
        open={activeSide !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveSide(null);
        }}
        side={activeSide ?? 'right'}
        size="md"
        title={`Drawer Side: ${(activeSide ?? 'right').toUpperCase()}`}
        description="Edge-anchored slide-over surface with inward-facing primary accent border."
      >
        <DrawerBody>
          Supports left, right, top, and bottom placements with full keyboard focus trapping, Escape
          dismissal, and body scroll locking.
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary" size="sm" onClick={() => setActiveSide(null)}>
            Close
          </Button>
        </DrawerFooter>
      </Drawer>
    </Stack>
  );
};

export const Sides: Story = {
  render: () => <PlacementVariantsDemo />,
};

const SizeVariantsDemo = () => {
  const [activeSize, setActiveSize] = useState<DrawerSize | null>(null);

  return (
    <Stack direction="horizontal" gap="sm" wrap>
      {sizes.map((size) => (
        <Button key={size} variant="secondary" size="sm" onClick={() => setActiveSize(size)}>
          Size {size.toUpperCase()}
        </Button>
      ))}
      <Drawer
        open={activeSize !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveSize(null);
        }}
        side="right"
        size={activeSize ?? 'md'}
        title={`Drawer Size: ${(activeSize ?? 'md').toUpperCase()}`}
        description="Demonstrating responsive drawer width presets."
      >
        <DrawerBody>
          Choose from sm, md, lg, and xl presets depending on the density of filters or inspection
          details inside the sheet.
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary" size="sm" onClick={() => setActiveSize(null)}>
            Close
          </Button>
        </DrawerFooter>
      </Drawer>
    </Stack>
  );
};

export const Sizes: Story = {
  render: () => <SizeVariantsDemo />,
};
