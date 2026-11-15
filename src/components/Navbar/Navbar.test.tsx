import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMobileMenu,
  NavbarToggle,
} from './Navbar';

describe('Navbar', () => {
  it('renders accessible navigation landmark, active link state, and prevents clicks on disabled items', async () => {
    const user = userEvent.setup();
    const onDisabledClick = vi.fn();

    render(
      <Navbar>
        <NavbarBrand>Acme UI</NavbarBrand>
        <NavbarContent>
          <NavbarItem href="/dashboard" active>
            Dashboard
          </NavbarItem>
          <NavbarItem href="/reports">Reports</NavbarItem>
          <NavbarItem href="/admin" disabled onClick={onDisabledClick}>
            Admin
          </NavbarItem>
        </NavbarContent>
      </Navbar>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();

    const activeLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    const reportsLink = screen.getByRole('link', { name: 'Reports' });
    expect(reportsLink).not.toHaveAttribute('aria-current');

    const disabledLink = screen.getByRole('link', { name: 'Admin' });
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true');

    await user.click(disabledLink);
    expect(onDisabledClick).not.toHaveBeenCalled();
  });

  it('toggles mobile navigation menu via NavbarToggle and closes on Escape', async () => {
    const user = userEvent.setup();
    const onMobileMenuOpenChange = vi.fn();

    render(
      <Navbar onMobileMenuOpenChange={onMobileMenuOpenChange}>
        <NavbarBrand>Acme UI</NavbarBrand>
        <NavbarToggle />
        <NavbarMobileMenu>
          <NavbarItem href="/mobile-settings">Mobile Settings</NavbarItem>
        </NavbarMobileMenu>
      </Navbar>,
    );

    const toggleButton = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('region', { name: 'Mobile navigation' })).not.toBeInTheDocument();

    await user.click(toggleButton);

    expect(onMobileMenuOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('region', { name: 'Mobile navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mobile Settings' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(onMobileMenuOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('region', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
});
