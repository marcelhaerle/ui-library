import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slash } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders accessible breadcrumb navigation with links and aria-current="page"', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem href="/home">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem current>Laptops</BreadcrumbItem>
      </Breadcrumbs>,
    );

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/home');
    expect(homeLink).not.toHaveAttribute('aria-current');

    const currentItem = screen.getByText('Laptops');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('collapses middle items when maxItems is exceeded and expands on ellipsis click', async () => {
    const user = userEvent.setup();

    render(
      <Breadcrumbs maxItems={3}>
        <BreadcrumbItem href="/home">Home</BreadcrumbItem>
        <BreadcrumbItem href="/org">Organization</BreadcrumbItem>
        <BreadcrumbItem href="/dept">Departments</BreadcrumbItem>
        <BreadcrumbItem href="/eng">Engineering</BreadcrumbItem>
        <BreadcrumbItem current>Frontend</BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Organization' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Departments' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Engineering' })).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();

    const expandButton = screen.getByRole('button', { name: 'Show full breadcrumb path' });
    await user.click(expandButton);

    expect(screen.getByRole('link', { name: 'Organization' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Departments' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Show full breadcrumb path' }),
    ).not.toBeInTheDocument();
  });

  it('supports custom ReactNode and LucideIcon separators', () => {
    const { rerender } = render(
      <Breadcrumbs separator="/">
        <BreadcrumbItem href="/home">Home</BreadcrumbItem>
        <BreadcrumbItem current>Settings</BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(screen.getAllByText('/')).toHaveLength(1);

    rerender(
      <Breadcrumbs separator={Slash}>
        <BreadcrumbItem href="/home">Home</BreadcrumbItem>
        <BreadcrumbItem href="/account">Account</BreadcrumbItem>
        <BreadcrumbItem current>Settings</BreadcrumbItem>
      </Breadcrumbs>,
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });
});
