import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Code,
  Heading,
  Text,
  type HeadingSize,
  type HeadingTag,
  type TextSize,
  type TypographyTone,
  type TypographyWeight,
} from './Typography';

const headingTags: HeadingTag[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const headingSizes: HeadingSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const textSizes: TextSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const weights: TypographyWeight[] = ['normal', 'medium', 'semibold', 'bold'];
const tones: TypographyTone[] = ['default', 'muted', 'primary', 'success', 'warning', 'danger'];

const meta: Meta<typeof Heading> = {
  title: 'Primitives/Typography',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: headingTags,
    },
    size: {
      control: 'select',
      options: headingSizes,
    },
    weight: {
      control: 'select',
      options: weights,
    },
    tone: {
      control: 'select',
      options: tones,
    },
    align: {
      control: 'radio',
      options: ['left', 'center', 'right'],
    },
    truncate: {
      control: 'boolean',
    },
  },
  args: {
    as: 'h2',
    children: 'Architectural Typography System',
    weight: 'bold',
    tone: 'default',
    align: 'left',
    truncate: false,
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const DefaultHeading: Story = {
  args: {
    as: 'h1',
    children: 'Primary Section Heading',
  },
};

export const HeadingScale: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-6 mhui:p-6">
      <div className="mhui:flex mhui:flex-col mhui:gap-4">
        <Text size="sm" weight="semibold" tone="muted">
          Semantic Levels (h1 – h6 with automatic size mapping)
        </Text>
        {headingTags.map((tag) => (
          <div key={tag} className="mhui:flex mhui:items-baseline mhui:gap-4">
            <Code size="xs" tone="muted" className="mhui:w-12 mhui:text-center">
              {tag}
            </Code>
            <Heading as={tag}>{`Heading rendered as <${tag}>`}</Heading>
          </div>
        ))}
      </div>

      <div className="mhui:flex mhui:flex-col mhui:gap-4">
        <Text size="sm" weight="semibold" tone="muted">
          Explicit Size Scale (xs – 3xl)
        </Text>
        {headingSizes.map((size) => (
          <div key={size} className="mhui:flex mhui:items-baseline mhui:gap-4">
            <Code size="xs" tone="muted" className="mhui:w-12 mhui:text-center">
              {size}
            </Code>
            <Heading size={size}>{`Heading size="${size}"`}</Heading>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const TextVariantsAndSizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-10 mhui:p-6">
      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <Heading as="h3" size="lg">
          Text Sizes
        </Heading>
        {textSizes.map((size) => (
          <div key={size} className="mhui:flex mhui:items-baseline mhui:gap-4">
            <Code size="xs" tone="muted" className="mhui:w-12 mhui:text-center">
              {size}
            </Code>
            <Text size={size}>The quick brown fox jumps over the lazy dog ({size}).</Text>
          </div>
        ))}
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <Heading as="h3" size="lg">
          Text Weights
        </Heading>
        <div className="mhui:flex mhui:flex-wrap mhui:gap-6">
          {weights.map((weight) => (
            <Text key={weight} weight={weight}>
              {`Weight: ${weight}`}
            </Text>
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <Heading as="h3" size="lg">
          Semantic Tones
        </Heading>
        <div className="mhui:flex mhui:flex-col mhui:gap-2">
          {tones.map((tone) => (
            <Text key={tone} tone={tone} weight="medium">
              {`Tone "${tone}" — Designed for clear legibility in both Light and Dark mode.`}
            </Text>
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-2">
        <Heading as="h3" size="lg">
          Truncation
        </Heading>
        <div className="mhui:w-72 mhui:bg-slate-100 mhui:p-3 mhui:dark:bg-slate-900">
          <Text truncate>
            This long paragraph is constrained to a fixed-width container and truncates cleanly with
            an ellipsis.
          </Text>
        </div>
      </section>
    </div>
  ),
};

export const CodeShowcase: Story = {
  render: () => (
    <div className="mhui:flex mhui:flex-col mhui:gap-8 mhui:p-6">
      <section className="mhui:flex mhui:flex-col mhui:gap-3">
        <Heading as="h3" size="lg">
          Inline Code Tones
        </Heading>
        <div className="mhui:flex mhui:flex-wrap mhui:items-center mhui:gap-3">
          {tones.map((tone) => (
            <Code key={tone} tone={tone}>
              {`tone="${tone}"`}
            </Code>
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-3">
        <Heading as="h3" size="lg">
          Block Code
        </Heading>
        <Code block>{`import { Heading, Text, Code } from '@marcelhaerle/ui-library';

export const Example = () => (
  <Heading as="h1" tone="primary">
    Hello World
  </Heading>
);`}</Code>
      </section>
    </div>
  ),
};

export const LightAndDarkShowcase: Story = {
  render: () => (
    <div className="lg:mhui:grid-cols-2 mhui:grid mhui:grid-cols-1 mhui:gap-8">
      <div className="mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-white mhui:p-6">
        <Heading as="h3" size="xl" tone="primary">
          Light Mode Typography
        </Heading>
        <Text tone="muted">
          Clean typographic hierarchy using spacing and Corporate Identity tones.
        </Text>
        <div className="mhui:flex mhui:flex-wrap mhui:gap-2">
          {tones.map((tone) => (
            <Code key={`light-${tone}`} tone={tone}>
              {tone}
            </Code>
          ))}
        </div>
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <Heading as="h3" size="xl" tone="primary">
          Dark Mode Typography
        </Heading>
        <Text tone="muted">
          Clean typographic hierarchy using spacing and Corporate Identity tones.
        </Text>
        <div className="mhui:flex mhui:flex-wrap mhui:gap-2">
          {tones.map((tone) => (
            <Code key={`dark-${tone}`} tone={tone}>
              {tone}
            </Code>
          ))}
        </div>
      </div>
    </div>
  ),
};
