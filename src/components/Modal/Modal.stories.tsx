import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { Button } from '../Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dialog that interrupts the page to focus the user on a single task or decision before they continue.',
      },
      story: { height: '420px' },
    },
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['default', 'danger'] },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large', 'x-large', 'full-screen'],
    },
    shouldScrollInViewport: { control: 'boolean' },
  },
  args: { appearance: 'default', size: 'medium', isOpen: false, children: null },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const lorem =
  'Once a modal dialog is open, focus is trapped inside it and the background is ' +
  'inert. Use modals sparingly — for content that requires a decision before the ' +
  'user can continue.';

/** The canonical pattern: a trigger toggles a controlled Modal. */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button appearance="primary" onClick={() => setOpen(true)}>Open modal</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
          <ModalHeader title="Modal dialog" />
          <ModalBody>
            <p>{lorem}</p>
          </ModalBody>
          <ModalFooter>
            <Button appearance="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button appearance="primary" onClick={() => setOpen(false)}>Confirm</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Open modal' })).toHaveFocus();
  },
};

/** Destructive confirmation — danger header icon + danger Confirm button. */
export const Danger: Story = {
  args: { appearance: 'danger', size: 'small' },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button appearance="danger" onClick={() => setOpen(true)}>Delete project</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
          <ModalHeader title="Delete project?" />
          <ModalBody>
            <p>This permanently deletes the project and all of its data. This can't be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button appearance="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button appearance="danger" onClick={() => setOpen(false)}>Delete</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/** Long body that scrolls inside the dialog while the header and footer stay pinned. */
export const ScrollingBody: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
          <ModalHeader title="Terms of service" />
          <ModalBody>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} style={{ marginBlock: 12 }}>
                {i + 1}. {lorem}
              </p>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button appearance="text" onClick={() => setOpen(false)}>Decline</Button>
            <Button appearance="primary" onClick={() => setOpen(false)}>Accept</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/** Blanket click closes the modal and returns focus to the trigger. */
export const BlanketClickCloses: Story = {
  parameters: { docs: { disable: true } },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
        <ModalHeader title="Click outside to close" />
        <ModalBody>
          <p>{lorem}</p>
        </ModalBody>
        <ModalFooter>
          <Button appearance="primary" onClick={() => setOpen(false)}>Done</Button>
        </ModalFooter>
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    const overlay = dialog.parentElement as HTMLElement;
    await userEvent.click(overlay);
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

/** Blanket is hidden — the dialog appears without a dimmed backdrop. (Figma: isBlanketHidden) */
export const BlanketHidden: Story = {
  args: { isBlanketHidden: true },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button appearance="primary" onClick={() => setOpen(true)}>Open (no blanket)</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
          <ModalHeader title="No backdrop" />
          <ModalBody>
            <p>This modal renders without the dimmed overlay behind it.</p>
          </ModalBody>
          <ModalFooter>
            <Button appearance="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button appearance="primary" onClick={() => setOpen(false)}>OK</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/** Close button is explicitly hidden via hasCloseButton=false. (Figma: hasCloseButton) */
export const NoCloseButton: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button appearance="primary" onClick={() => setOpen(true)}>Open modal</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
          <ModalHeader title="No close button" hasCloseButton={false} />
          <ModalBody>
            <p>The header close button is hidden. The user must use a footer action to dismiss.</p>
          </ModalBody>
          <ModalFooter>
            <Button appearance="primary" onClick={() => setOpen(false)}>Got it</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

export const CssCheck: Story = {
  parameters: { docs: { disable: true } },
  args: { appearance: 'danger' },
  render: (args) => (
    <Modal {...args} isOpen aria-label="Danger modal">
      <ModalHeader title="Heads up" />
      <ModalBody>
        <p>Danger appearance.</p>
      </ModalBody>
    </Modal>
  ),
  play: async () => {
    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    const icon = dialog.querySelector('h2')?.previousElementSibling as HTMLElement;
    await expect(getComputedStyle(icon).color).toBe('rgb(254, 61, 46)');
  },
};
