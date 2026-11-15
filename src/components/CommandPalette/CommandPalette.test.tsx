import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, type CommandPaletteGroup } from './CommandPalette';

describe('CommandPalette', () => {
  it('filters grouped commands by search query and shows emptyState when no match is found', async () => {
    const user = userEvent.setup();
    const groups: CommandPaletteGroup[] = [
      {
        id: 'nav',
        heading: 'Pages',
        items: [
          { id: 'dashboard', label: 'Dashboard', onSelect: () => {} },
          { id: 'billing', label: 'Billing & Invoices', onSelect: () => {} },
        ],
      },
    ];

    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={groups}
        emptyState="Nothing matched your query."
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    const searchInput = screen.getByRole('combobox');

    await user.type(searchInput, 'invoice');
    expect(screen.queryByRole('option', { name: /Dashboard/i })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Billing & Invoices/i })).toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, 'nonexistent');
    expect(screen.getByText('Nothing matched your query.')).toBeInTheDocument();
  });

  it('supports arrow-key navigation skipping disabled items, Enter selection, and Escape dismissal', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSelectDeploy = vi.fn();

    const groups: CommandPaletteGroup[] = [
      {
        id: 'ops',
        heading: 'Operations',
        items: [
          { id: 'logs', label: 'View Logs', onSelect: () => {} },
          { id: 'locked', label: 'Locked Action', disabled: true, onSelect: () => {} },
          { id: 'deploy', label: 'Trigger Deployment', onSelect: onSelectDeploy },
        ],
      },
    ];

    render(<CommandPalette open onOpenChange={onOpenChange} groups={groups} />);

    const searchInput = screen.getByRole('combobox');
    const logsOption = screen.getByRole('option', { name: /View Logs/i });
    const deployOption = screen.getByRole('option', { name: /Trigger Deployment/i });

    expect(logsOption).toHaveAttribute('aria-selected', 'true');

    // ArrowDown skips disabled "Locked Action" and highlights "Trigger Deployment"
    await user.type(searchInput, '{ArrowDown}');
    expect(deployOption).toHaveAttribute('aria-selected', 'true');

    // Enter executes the active command and closes the palette
    await user.type(searchInput, '{Enter}');
    expect(onSelectDeploy).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    // Escape also closes the palette
    onOpenChange.mockClear();
    await user.type(searchInput, '{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('toggles open state on global Ctrl+K shortcut', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<CommandPalette open={false} onOpenChange={onOpenChange} groups={[]} />);

    await user.keyboard('{Control>}k{/Control}');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
