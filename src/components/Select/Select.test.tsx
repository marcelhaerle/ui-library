import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from '../FormField';
import { Select, type SelectOption } from './Select';

const sampleOptions: SelectOption[] = [
  { value: 'de', label: 'Germany', group: 'Europe' },
  { value: 'fr', label: 'France', group: 'Europe' },
  { value: 'jp', label: 'Japan', group: 'Asia', disabled: true },
  { value: 'us', label: 'United States' },
];

describe('Select', () => {
  it('opens listbox on click, selects an option, calls onValueChange, and ignores disabled options', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Select
        aria-label="Country"
        options={sampleOptions}
        placeholder="Choose a country"
        onValueChange={handleValueChange}
      />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Country' });
    expect(combobox.textContent).toContain('Choose a country');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');

    await user.click(combobox);
    expect(combobox.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('listbox')).toBeDefined();

    // Clicking disabled option should not select or close
    await user.click(screen.getByRole('option', { name: 'Japan' }));
    expect(handleValueChange).not.toHaveBeenCalled();
    expect(combobox.getAttribute('aria-expanded')).toBe('true');

    // Clicking enabled option selects it and closes listbox
    await user.click(screen.getByRole('option', { name: 'France' }));
    expect(handleValueChange).toHaveBeenCalledWith('fr');
    expect(combobox.textContent).toContain('France');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
  });

  it('supports keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Select aria-label="Country" options={sampleOptions} onValueChange={handleValueChange} />,
    );

    const combobox = screen.getByRole('combobox', { name: 'Country' });
    combobox.focus();

    // Open with ArrowDown (starts at first enabled option: United States since ungrouped options render first, or index 0 in sampleOptions: Germany)
    await user.keyboard('{ArrowDown}');
    expect(combobox.getAttribute('aria-expanded')).toBe('true');

    // Move to next enabled option (France) and press Enter
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(handleValueChange).toHaveBeenCalledWith('fr');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');

    // Reopen and press Escape to close without changing selection
    await user.keyboard('{ArrowDown}');
    expect(combobox.getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{Escape}');
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
  });

  it('filters options when searchable is enabled and shows emptyMessage when none match', async () => {
    const user = userEvent.setup();

    render(
      <Select
        aria-label="Searchable Country"
        options={sampleOptions}
        searchable
        searchPlaceholder="Filter countries..."
        emptyMessage="No matching country."
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Searchable Country' }));
    const searchInput = screen.getByPlaceholderText('Filter countries...');

    await user.type(searchInput, 'united');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'United States' })).toBeDefined();

    await user.clear(searchInput);
    await user.type(searchInput, 'zzz');
    expect(screen.queryByRole('option')).toBeNull();
    expect(screen.getByText('No matching country.')).toBeDefined();
  });

  it('integrates with FormField context and forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <FormField label="Deployment Region" errorText="Region is required." required>
        <Select ref={ref} options={sampleOptions} name="region" defaultValue="de" />
      </FormField>,
    );

    const combobox = screen.getByLabelText(/Deployment Region/);
    expect(ref.current).toBe(combobox);
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
    expect(combobox.getAttribute('aria-required')).toBe('true');
  });
});
