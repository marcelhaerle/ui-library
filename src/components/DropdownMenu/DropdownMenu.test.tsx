import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
  it('opens on click, selects an item, and closes while restoring focus', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <DropdownMenu
        trigger={<Button>Actions</Button>}
        items={[
          { id: 'edit', label: 'Edit', onSelect: onEdit },
          { id: 'delete', label: 'Delete', danger: true, onSelect: onDelete },
        ]}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    const editItem = screen.getByRole('menuitem', { name: 'Edit' });
    expect(editItem).toHaveFocus();

    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('supports arrow-key navigation skipping disabled items and closes on Escape', async () => {
    const user = userEvent.setup();
    const onDuplicate = vi.fn();

    render(
      <DropdownMenu
        trigger={<Button>Options</Button>}
        items={[
          { id: 'edit', label: 'Edit', onSelect: () => {} },
          { id: 'share', label: 'Share', disabled: true, onSelect: () => {} },
          { id: 'duplicate', label: 'Duplicate', onSelect: onDuplicate },
          { id: 'archive', label: 'Archive', onSelect: () => {} },
        ]}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Options' });
    await user.click(trigger);

    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    // ArrowDown skips disabled "Share" and moves to "Duplicate"
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();

    // End moves to "Archive"
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();

    // ArrowDown wraps around to "Edit"
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    // Escape closes the menu and restores focus to trigger
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('supports typeahead navigation and closes on outside click', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button type="button">Outside</button>
        <DropdownMenu
          trigger={<Button>Menu</Button>}
          items={[
            { id: 'alpha', label: 'Alpha', onSelect: () => {} },
            { id: 'beta', label: 'Beta', onSelect: () => {} },
            { id: 'charlie', label: 'Charlie', onSelect: () => {} },
          ]}
        />
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('menuitem', { name: 'Alpha' })).toHaveFocus();

    await user.keyboard('c');
    expect(screen.getByRole('menuitem', { name: 'Charlie' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
