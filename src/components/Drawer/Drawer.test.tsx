import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from './Drawer';

describe('Drawer', () => {
  it('renders dialog with aria-modal, side attribute, title/description, and locks body scroll', () => {
    const { unmount } = render(
      <Drawer open side="left" title="Navigation Menu" description="Select a workspace section.">
        <DrawerBody>Menu items</DrawerBody>
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Navigation Menu' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('data-side')).toBe('left');
    expect(dialog.getAttribute('aria-describedby')).toBe(
      screen.getByText('Select a workspace section.').id,
    );
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape key press and overlay backdrop click when enabled', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Drawer open onOpenChange={handleOpenChange} title="Filters">
        <DrawerBody>Filter options</DrawerBody>
      </Drawer>,
    );

    await user.keyboard('{Escape}');
    expect(handleOpenChange).toHaveBeenCalledWith(false);

    handleOpenChange.mockClear();
    await user.click(screen.getByTestId('drawer-overlay'));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('traps Tab and Shift+Tab focus within the drawer and forwards refs', async () => {
    const user = userEvent.setup();
    const drawerRef = createRef<HTMLDivElement>();
    const headerRef = createRef<HTMLDivElement>();
    const bodyRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();

    render(
      <Drawer ref={drawerRef} open showCloseButton={false} aria-label="Inspector Drawer">
        <DrawerHeader ref={headerRef}>Header</DrawerHeader>
        <DrawerBody ref={bodyRef}>
          <button type="button">Reset</button>
        </DrawerBody>
        <DrawerFooter ref={footerRef}>
          <button type="button">Apply</button>
        </DrawerFooter>
      </Drawer>,
    );

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const applyButton = screen.getByRole('button', { name: 'Apply' });

    expect(drawerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(bodyRef.current).toBeInstanceOf(HTMLDivElement);
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement);

    expect(document.activeElement).toBe(resetButton);

    await user.tab();
    expect(document.activeElement).toBe(applyButton);

    await user.tab();
    expect(document.activeElement).toBe(resetButton);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(applyButton);
  });
});
