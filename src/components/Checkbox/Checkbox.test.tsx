import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles checked state on click and Space key and calls onCheckedChange', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Subscribe to newsletter"
        description="Weekly engineering digest."
        onCheckedChange={handleCheckedChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /Subscribe to newsletter/,
    }) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    checkbox.focus();
    await user.keyboard(' ');
    expect(checkbox.checked).toBe(false);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('sets native indeterminate property and aria-checked="mixed" when indeterminate is true', () => {
    render(<Checkbox label="Select all" indeterminate />);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(<Checkbox label="Locked setting" disabled onCheckedChange={handleCheckedChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Locked setting' }) as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);

    await user.click(checkbox);
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it('forwards ref, sets aria-invalid on error, and links description via aria-describedby', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Checkbox
        ref={ref}
        label="Accept policy"
        description="Required for account creation."
        error
        name="policy"
        value="accepted"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.name).toBe('policy');
    expect(ref.current?.value).toBe('accepted');
    expect(ref.current?.getAttribute('aria-invalid')).toBe('true');

    const desc = screen.getByText('Required for account creation.');
    expect(ref.current?.getAttribute('aria-describedby')).toContain(desc.id);
  });
});
