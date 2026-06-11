import figma from '@figma/code-connect';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

figma.connect(
  Modal,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=35-2877',
  {
    props: {
      appearance: figma.enum('appearance', {
        default: 'default',
        danger: 'danger',
      }),
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
        'x-large': 'x-large',
        'full-screen': 'full-screen',
      }),
    },
    example: ({ appearance, size }) => (
      <Modal isOpen appearance={appearance} size={size} onClose={() => {}}>
        <ModalHeader title="Confirm action" />
        <ModalBody>
          <p>Are you sure you want to proceed? This action cannot be undone.</p>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => {}}>Cancel</button>
          <button onClick={() => {}}>Confirm</button>
        </ModalFooter>
      </Modal>
    ),
  },
);
