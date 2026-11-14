import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from '../FormField';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles checked state with role="switch" and invokes onCheckedChange', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(<Switch label="Enable notifications" onCheckedChange={handleCheckedChange} />);

    const switchEl = screen.getByRole('switch', {
      name: 'Enable notifications',
    }) as HTMLInputElement;
    expect(switchEl.checked).toBe(false);
    expect(switchEl.getAttribute('aria-checked')).toBe('false');

    await user.click(switchEl);
    expect(switchEl.checked).toBe(true);
    expect(switchEl.getAttribute('aria-checked')).toBe('true');
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    await user.click(switchEl);
    expect(switchEl.checked).toBe(false);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('renders label on the left or right according to labelPosition', () => {
    const { rerender } = render(<Switch label="Left label" labelPosition="left" />);
    const switchEl = screen.getByRole('switch', { name: 'Left label' });
    const labelContainer = switchEl.closest('label');

    expect(labelContainer?.firstElementChild?.textContent).toContain('Left label');

    rerender(<Switch label="Right label" labelPosition="right" />);
    expect(labelContainer?.lastElementChild?.textContent).toContain('Right label');
  });

  it('prevents toggling when disabled', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(<Switch label="Locked setting" disabled onCheckedChange={handleCheckedChange} />);

    const switchEl = screen.getByRole('switch', { name: 'Locked setting' }) as HTMLInputElement;
    expect(switchEl.disabled).toBe(true);

    await user.click(switchEl);
    expect(switchEl.checked).toBe(false);
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it('integrates with FormField context and forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <FormField errorText="Must be enabled to proceed." required>
        <Switch ref={ref} label="Audit logging" description="Writes immutable logs" />
      </FormField>,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.getAttribute('data-invalid')).toBe('true');
    expect(ref.current?.required).toBe(true);
    expect(ref.current?.getAttribute('aria-describedby')).toContain(
      screen.getByText('Writes immutable logs').id,
    );
    expect(ref.current?.getAttribute('aria-describedby')).toContain(screen.getByRole('alert').id);
  });
});
