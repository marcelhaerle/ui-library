import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../Input';
import { FormField } from './FormField';

describe('FormField', () => {
  it('automatically wires id, aria-describedby, required, and aria-invalid to child Input', () => {
    render(
      <FormField
        label="Email Address"
        helperText="Use your company domain."
        errorText="Email is required."
        required
      >
        <Input type="email" />
      </FormField>,
    );

    const input = screen.getByLabelText(/Email Address/) as HTMLInputElement;
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const describedBy = input.getAttribute('aria-describedby') ?? '';
    const helper = screen.getByText('Use your company domain.');
    const error = screen.getByRole('alert');

    expect(error.textContent).toBe('Email is required.');
    expect(describedBy).toContain(helper.id);
    expect(describedBy).toContain(error.id);
  });

  it('propagates disabled state to Label and child Input', () => {
    render(
      <FormField label="Account ID" disabled>
        <Input defaultValue="acc_12345" />
      </FormField>,
    );

    const input = screen.getByLabelText('Account ID') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('wires accessibility attributes when wrapping a native HTML input element', () => {
    render(
      <FormField label="Native Field" errorText="Invalid value">
        <input type="text" />
      </FormField>,
    );

    const input = screen.getByLabelText('Native Field') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
  });
});
