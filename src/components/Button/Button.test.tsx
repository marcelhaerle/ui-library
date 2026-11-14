import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Plus } from 'lucide-react';
import { Button } from './Button';

describe('Button', () => {
  it('invokes onClick when clicked by the user', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Submit</Button>);

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button.hasAttribute('disabled')).toBe(true);

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('triggers onClick on keyboard Enter and Space activation', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Confirm</Button>);

    const button = screen.getByRole('button', { name: 'Confirm' });
    button.focus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('forwards ref and native button attributes', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <Button ref={ref} type="submit" name="action" value="save">
        Save
      </Button>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.type).toBe('submit');
    expect(ref.current?.name).toBe('action');
    expect(ref.current?.value).toBe('save');
  });

  it('omits children text when iconOnly is true while preserving accessible label', () => {
    render(
      <Button icon={Plus} iconOnly aria-label="Add item">
        Hidden Label
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Add item' });
    expect(button.textContent).toBe('');
    expect(button.querySelector('svg')).not.toBeNull();
  });

  it('merges conflicting mhui-prefixed light and dark classes while preserving external host classes', () => {
    render(
      <Button
        className="custom-host-class px-2 mhui:px-10 mhui:dark:bg-blue-700"
        variant="primary"
        size="md"
      >
        Custom
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button.classList.contains('mhui:px-10')).toBe(true);
    expect(button.classList.contains('mhui:px-4')).toBe(false);
    expect(button.classList.contains('mhui:dark:bg-blue-700')).toBe(true);
    expect(button.classList.contains('mhui:dark:bg-blue-800')).toBe(false);
    expect(button.classList.contains('custom-host-class')).toBe(true);
    expect(button.classList.contains('px-2')).toBe(true);
  });
});
