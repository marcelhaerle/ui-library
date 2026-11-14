import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from '../FormField';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('accepts multi-line typing and updates the character counter when showCount is enabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea aria-label="Bio" showCount maxLength={20} onChange={handleChange} />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' }) as HTMLTextAreaElement;
    expect(screen.getByText('0 / 20')).toBeDefined();

    await user.type(textarea, 'Hello world');
    expect(textarea.value).toBe('Hello world');
    expect(screen.getByText('11 / 20')).toBeDefined();
    expect(handleChange).toHaveBeenCalled();
  });

  it('dynamically adjusts height when autoResize is true', async () => {
    const user = userEvent.setup();

    render(<Textarea aria-label="Auto resize" autoResize />);

    const textarea = screen.getByRole('textbox', { name: 'Auto resize' }) as HTMLTextAreaElement;
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 144,
    });

    await user.type(textarea, 'Line 1\nLine 2');
    expect(textarea.style.height).toBe('144px');
    expect(textarea.classList.contains('mhui:resize-none')).toBe(true);
  });

  it('integrates with FormField context for id, aria-invalid, and aria-describedby', () => {
    render(
      <FormField
        label="Description"
        helperText="Markdown is supported."
        errorText="Description cannot be empty."
        required
      >
        <Textarea showCount maxLength={200} />
      </FormField>,
    );

    const textarea = screen.getByLabelText(/Description/) as HTMLTextAreaElement;
    expect(textarea.required).toBe(true);
    expect(textarea.getAttribute('aria-invalid')).toBe('true');

    const describedBy = textarea.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(screen.getByText('Markdown is supported.').id);
    expect(describedBy).toContain(screen.getByRole('alert').id);
    expect(describedBy).toContain(screen.getByText('0 / 200').id);
  });

  it('forwards ref, native attributes, and merges mhui-prefixed classes', () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(
      <Textarea
        ref={ref}
        aria-label="Notes"
        name="notes"
        rows={5}
        size="sm"
        className="custom-textarea mhui:min-h-40"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.name).toBe('notes');
    expect(ref.current?.rows).toBe(5);
    expect(ref.current?.classList.contains('mhui:min-h-40')).toBe(true);
    expect(ref.current?.classList.contains('mhui:min-h-20')).toBe(false);
    expect(ref.current?.classList.contains('custom-textarea')).toBe(true);
  });
});
