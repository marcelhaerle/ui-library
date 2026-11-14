import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Search } from 'lucide-react';
import { Input } from './Input';

describe('Input', () => {
  it('accepts user typing and triggers onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input aria-label="Search" onChange={handleChange} />);

    const input = screen.getByRole('textbox', { name: 'Search' }) as HTMLInputElement;
    await user.type(input, 'hello');

    expect(input.value).toBe('hello');
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it('shows clear button when clearable and non-empty (uncontrolled) and clears value on click', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(<Input aria-label="Query" clearable onClear={handleClear} />);

    const input = screen.getByRole('textbox', { name: 'Query' }) as HTMLInputElement;
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull();

    await user.type(input, 'test');
    const clearButton = screen.getByRole('button', { name: 'Clear input' });

    await user.click(clearButton);
    expect(input.value).toBe('');
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull();
  });

  it('supports controlled clearable input', async () => {
    const user = userEvent.setup();
    const ControlledExample = () => {
      const [val, setVal] = useState('initial');
      return (
        <Input
          aria-label="Controlled"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          clearable
          onClear={() => setVal('')}
        />
      );
    };

    render(<ControlledExample />);

    const input = screen.getByRole('textbox', { name: 'Controlled' }) as HTMLInputElement;
    expect(input.value).toBe('initial');

    await user.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(input.value).toBe('');
  });

  it('sets aria-invalid when state is error and forwards ref and native attributes', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Input
        ref={ref}
        aria-label="Email"
        state="error"
        leadingIcon={Search}
        name="email"
        className="custom-input mhui:h-14"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.name).toBe('email');
    expect(ref.current?.getAttribute('aria-invalid')).toBe('true');
    expect(ref.current?.classList.contains('mhui:h-14')).toBe(true);
    expect(ref.current?.classList.contains('mhui:h-10')).toBe(false);
    expect(ref.current?.classList.contains('custom-input')).toBe(true);
  });
});
