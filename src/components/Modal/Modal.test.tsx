import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal';

describe('Modal', () => {
  it('renders dialog with aria-modal, wires title/description, and locks body scroll when open', () => {
    const { unmount } = render(
      <Modal open title="Delete environment" description="This action cannot be undone.">
        <ModalBody>Confirm deletion of staging cluster.</ModalBody>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Delete environment' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-describedby')).toBe(
      screen.getByText('This action cannot be undone.').id,
    );
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape key press and overlay backdrop click when enabled', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Modal open onOpenChange={handleOpenChange} title="Session timeout">
        <ModalBody>Your session is about to expire.</ModalBody>
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(handleOpenChange).toHaveBeenCalledWith(false);

    handleOpenChange.mockClear();
    await user.click(screen.getByTestId('modal-overlay'));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('traps Tab and Shift+Tab focus within the modal dialog and forwards refs', async () => {
    const user = userEvent.setup();
    const modalRef = createRef<HTMLDivElement>();
    const headerRef = createRef<HTMLDivElement>();
    const bodyRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();

    render(
      <Modal ref={modalRef} open showCloseButton={false} aria-label="Focus trap test">
        <ModalHeader ref={headerRef}>Header</ModalHeader>
        <ModalBody ref={bodyRef}>
          <button type="button">First Action</button>
        </ModalBody>
        <ModalFooter ref={footerRef}>
          <button type="button">Last Action</button>
        </ModalFooter>
      </Modal>,
    );

    const firstButton = screen.getByRole('button', { name: 'First Action' });
    const lastButton = screen.getByRole('button', { name: 'Last Action' });

    expect(modalRef.current).toBeInstanceOf(HTMLDivElement);
    expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(bodyRef.current).toBeInstanceOf(HTMLDivElement);
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement);

    expect(document.activeElement).toBe(firstButton);

    await user.tab();
    expect(document.activeElement).toBe(lastButton);

    await user.tab();
    expect(document.activeElement).toBe(firstButton);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(lastButton);
  });
});
