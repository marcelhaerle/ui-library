import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FolderKanban, LayoutDashboard } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarToggle,
} from './Sidebar';

describe('Sidebar', () => {
  it('renders accessible sidebar navigation, groups, active state, and disabled items', async () => {
    const user = userEvent.setup();
    const onDisabledClick = vi.fn();

    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup label="Main Menu">
            <SidebarItem href="/dashboard" active icon={LayoutDashboard}>
              Dashboard
            </SidebarItem>
            <SidebarItem href="/projects" icon={FolderKanban} badge="8">
              Projects
            </SidebarItem>
            <SidebarItem href="/billing" disabled onClick={onDisabledClick}>
              Billing
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>,
    );

    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Sidebar navigation' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Main Menu' })).toBeInTheDocument();

    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(dashboardLink).toHaveAttribute('aria-current', 'page');

    expect(screen.getByText('8')).toBeInTheDocument();

    const billingLink = screen.getByRole('link', { name: 'Billing' });
    expect(billingLink).toHaveAttribute('aria-disabled', 'true');

    await user.click(billingLink);
    expect(onDisabledClick).not.toHaveBeenCalled();
  });

  it('toggles collapsed state via SidebarToggle and fires onCollapsedChange', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();

    render(
      <Sidebar onCollapsedChange={onCollapsedChange}>
        <SidebarHeader>
          <span>MHUI Workspace</span>
          <SidebarToggle />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Workspace">
            <SidebarItem href="/projects" icon={FolderKanban} badge="12">
              Projects
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>,
    );

    const aside = screen.getByRole('complementary');
    expect(aside).not.toHaveAttribute('data-collapsed');
    expect(screen.getByText('MHUI Workspace')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    const collapseBtn = screen.getByRole('button', { name: 'Collapse sidebar' });
    await user.click(collapseBtn);

    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(aside).toHaveAttribute('data-collapsed', 'true');
    expect(screen.queryByText('MHUI Workspace')).not.toBeInTheDocument();
    expect(screen.queryByText('12')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();

    const expandBtn = screen.getByRole('button', { name: 'Expand sidebar' });
    await user.click(expandBtn);

    expect(onCollapsedChange).toHaveBeenCalledWith(false);
    expect(aside).not.toHaveAttribute('data-collapsed');
    expect(screen.getByText('MHUI Workspace')).toBeInTheDocument();
  });
});
