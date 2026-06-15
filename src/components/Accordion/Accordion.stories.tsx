import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { useState } from 'react';
import { Accordion } from './Accordion';
import { Toggle } from '../Toggle';
import { TextArea } from '../TextArea';
import { Button } from '../Button';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A titled, collapsible section. The header shows the title (with an optional leading icon) and a chevron that toggles expanded/collapsed; the content slot is revealed when expanded, and a divider closes off the end.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    defaultExpanded: { control: 'boolean' },
    hideSeparator: { control: 'boolean' },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    icon: { control: false },
    isExpanded: { control: false },
    onToggle: { control: false },
  },
  args: { title: 'Advanced Settings', defaultExpanded: false, hideSeparator: false, children: null },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleBody = (
  <p style={{ margin: 0 }}>
    These options affect how and when the article is published. Expand to fine-tune scheduling and
    distribution before you hit Create.
  </p>
);

/** Collapsed by default — click the header (or press Enter/Space) to reveal the content. */
export const Default: Story = {
  render: (args) => <Accordion {...args}>{sampleBody}</Accordion>,
};

/** Open on first render via `defaultExpanded`. */
export const Expanded: Story = {
  args: { defaultExpanded: true },
  render: (args) => <Accordion {...args}>{sampleBody}</Accordion>,
};

/** A leading icon sits before the title. */
export const WithIcon: Story = {
  args: { title: 'Schedule', icon: 'arrow-down', defaultExpanded: true },
  render: (args) => <Accordion {...args}>{sampleBody}</Accordion>,
};

/** The end divider can be removed when the accordion is the last item in a group. */
export const WithoutSeparator: Story = {
  args: { defaultExpanded: true, hideSeparator: true },
  render: (args) => <Accordion {...args}>{sampleBody}</Accordion>,
};

/** Controlled: drive `isExpanded` from your own state and react to `onToggle`. */
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button appearance="neutral" onClick={() => setOpen((v) => !v)}>
          {open ? 'Collapse' : 'Expand'} from outside
        </Button>
        <Accordion {...args} isExpanded={open} onToggle={setOpen}>
          {sampleBody}
        </Accordion>
      </div>
    );
  },
};

/**
 * The source pattern: an "Advanced Settings" disclosure whose content slot holds
 * a couple of settings cards (toggles + a breaking-news message field).
 */
export const AdvancedSettingsExample: Story = {
  args: { title: 'Advanced Settings', defaultExpanded: true },
  render: (args) => {
    const [breaking, setBreaking] = useState(true);
    return (
      <Accordion {...args}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              border: '1px solid var(--neutral-100)',
              padding: 16,
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--neutral-800)' }}>Set Expiry Timer</span>
            <Toggle defaultChecked aria-label="Set expiry timer" />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              border: '1px solid var(--neutral-100)',
              padding: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--neutral-800)' }}>Is Breaking News?</span>
              <Toggle
                isChecked={breaking}
                onChange={(e) => setBreaking(e.currentTarget.checked)}
                aria-label="Is breaking news"
              />
            </div>
            {breaking && (
              <TextArea label="App push alert message" placeholder="Enter message" rows={3} />
            )}
          </div>
        </div>
      </Accordion>
    );
  },
};

export const CssCheck: Story = {
  parameters: { docs: { disable: true } },
  args: { title: 'Advanced Settings', defaultExpanded: true },
  render: (args) => <Accordion {...args}>{sampleBody}</Accordion>,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Advanced Settings' });

    // Starts expanded: region visible, chevron points up.
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const region = canvas.getByRole('region', { name: 'Advanced Settings' });
    await expect(region).toBeVisible();

    // The trailing divider is 1px and neutral.200 (#d4d4d4).
    const separator = canvas.getByRole('separator');
    const sepStyle = getComputedStyle(separator);
    await expect(sepStyle.height).toBe('1px');
    await expect(sepStyle.backgroundColor).toBe('rgb(212, 212, 212)');

    // Collapsing hides the region and flips aria-expanded.
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('region')).not.toBeInTheDocument();
  },
};
