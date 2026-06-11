import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { useState } from 'react';
import { FileUploader, FileRow, type UploadFile } from './FileUploader';

const meta = {
  title: 'Components/FileUploader',
  component: FileUploader,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lets people add files by clicking to browse or dragging and dropping, and shows each file as it uploads.',
      },
    },
  },
  argTypes: {
    icon: { control: 'inline-radio', options: ['image', 'cloud-upload', 'file'] },
    multiple: { control: 'boolean' },
  },
  args: {
    label: 'Attachment',
    buttonLabel: 'Upload file',
    message: 'SVG, PNG, JPG or PDF (max. 5MB)',
    icon: 'image',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty dropzone — click or drop to add files. */
export const Empty: Story = {};

/** Dropzone with a couple of files mid-upload and complete. */
export const WithFiles: Story = {
  args: {
    files: [
      { id: '1', name: 'Tech design requirements.pdf', size: '200 KB', progress: 0.4 },
      { id: '2', name: 'Brand guidelines.pdf', size: '1.2 MB', progress: 1 },
    ],
  },
};

/** A standalone FileRow (the Figma `isEmpty=false` part) — uploading vs complete. */
export const Rows: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FileRow file={{ id: 'a', name: 'Tech design requirements.pdf', size: '200 KB', progress: 0.4 }} onRemove={() => {}} />
      <FileRow file={{ id: 'b', name: 'Final report.pdf', size: '820 KB', progress: 1 }} onRemove={() => {}} />
    </div>
  ),
};

/** Mirrors the Figma `isSelected=true` variant — forest-tinted border and background. */
export const RowSelected: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FileRow file={{ id: 'a', name: 'Selected file.pdf', size: '200 KB', progress: 0.6 }} onRemove={() => {}} isSelected />
      <FileRow file={{ id: 'b', name: 'Normal file.pdf', size: '820 KB', progress: 1 }} onRemove={() => {}} />
    </div>
  ),
};

/** Mirrors the Figma `isCompleted=true` variant — explicit completed state regardless of progress value. */
export const RowCompleted: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FileRow file={{ id: 'a', name: 'Force-completed.pdf', size: '200 KB', progress: 0.5 }} onRemove={() => {}} isCompleted />
      <FileRow file={{ id: 'b', name: 'Progress-derived complete.pdf', size: '820 KB', progress: 1 }} onRemove={() => {}} />
    </div>
  ),
};

/** Fully interactive: selecting files lists them; remove deletes a row. */
export const Interactive: Story = {
  render: (args) => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    return (
      <FileUploader
        {...args}
        multiple
        files={files}
        onFilesAdded={(added) =>
          setFiles((prev) => [
            ...prev,
            ...added.map((f, i) => ({
              id: `${Date.now()}-${i}`,
              name: f.name,
              size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
              progress: 1,
            })),
          ])
        }
        onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      />
    );
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Attachment', { selector: 'input' }) as HTMLInputElement;
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    await waitFor(() => expect(canvas.getByText('hello.txt')).toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Remove hello.txt' }));
    await waitFor(() => expect(canvas.queryByText('hello.txt')).not.toBeInTheDocument());
  },
};

/**
 * CSS proof: a completed file row's percent text resolves to forest.500
 * (#2e7061 = rgb(46, 112, 97)). If tokens.css failed to load this falls back.
 */
export const CssCheck: Story = {
  args: {
    files: [{ id: '1', name: 'done.pdf', size: '10 KB', progress: 1 }],
  },
  play: async ({ canvas }) => {
    const percent = canvas.getByText('100%');
    await expect(getComputedStyle(percent).color).toBe('rgb(46, 112, 97)');
  },
};
