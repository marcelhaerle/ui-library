import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '../FormField';
import { Textarea, type TextareaSize, type TextareaState } from './Textarea';

const sizes: TextareaSize[] = ['sm', 'md', 'lg'];
const states: TextareaState[] = ['default', 'error', 'success'];

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
    state: {
      control: 'select',
      options: states,
    },
    autoResize: {
      control: 'boolean',
    },
    showCount: {
      control: 'boolean',
    },
    maxLength: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Write your message...',
    size: 'md',
    state: 'default',
    autoResize: false,
    showCount: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Describe the architectural decision...',
  },
};

export const WithCharacterCount: Story = {
  args: {
    placeholder: 'Provide a concise summary (up to 160 characters)...',
    defaultValue: 'Modular React 19 UI library with zero-runtime dark mode.',
    showCount: true,
    maxLength: 160,
  },
};

export const AutoResize: Story = {
  args: {
    placeholder: 'Type multiple lines to see the textarea expand automatically...',
    defaultValue: 'Line 1\nLine 2\nLine 3 — keep typing to expand automatically.',
    autoResize: true,
    showCount: true,
  },
};

export const WithFormField: Story = {
  render: () => (
    <div className="mhui:max-w-lg">
      <FormField
        label="Incident Postmortem Summary"
        helperText="Include root cause and remediation steps."
        required
      >
        <Textarea placeholder="Summarize the incident..." showCount maxLength={500} autoResize />
      </FormField>
    </div>
  ),
};

export const AllStatesAndSizes: Story = {
  render: () => (
    <div className="mhui:flex mhui:max-w-2xl mhui:flex-col mhui:gap-10 mhui:p-6">
      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Sizes (sm, md, lg)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          {sizes.map((size) => (
            <Textarea
              key={size}
              size={size}
              placeholder={`Textarea size="${size}"`}
              defaultValue={`Sample multi-line text (${size})`}
            />
          ))}
        </div>
      </section>

      <section className="mhui:flex mhui:flex-col mhui:gap-4">
        <h2 className="mhui:text-lg mhui:font-semibold mhui:text-slate-900 mhui:dark:text-slate-100">
          Validation States (default, error, success)
        </h2>
        <div className="mhui:flex mhui:flex-col mhui:gap-4">
          <Textarea state="default" defaultValue="Default state content" />
          <Textarea state="error" defaultValue="Error state content" showCount maxLength={100} />
          <Textarea state="success" defaultValue="Success state content" />
          <Textarea disabled defaultValue="Disabled state content" />
        </div>
      </section>
    </div>
  ),
};

export const LightAndDarkShowcase: Story = {
  render: () => (
    <div className="mhui:grid mhui:grid-cols-1 mhui:gap-8 mhui:lg:grid-cols-2">
      <div className="mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-white mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-900">Light Mode</h3>
        <Textarea
          defaultValue="Standard multi-line note in Light mode."
          showCount
          maxLength={120}
        />
        <Textarea state="error" defaultValue="Validation error in Light mode." />
      </div>

      <div className="dark mhui:flex mhui:flex-col mhui:gap-4 mhui:bg-slate-950 mhui:p-6">
        <h3 className="mhui:text-base mhui:font-semibold mhui:text-slate-100">Dark Mode</h3>
        <Textarea defaultValue="Standard multi-line note in Dark mode." showCount maxLength={120} />
        <Textarea state="error" defaultValue="Validation error in Dark mode." />
      </div>
    </div>
  ),
};
