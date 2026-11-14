import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from '../FormField';
import { Radio, RadioGroup } from './RadioGroup';

describe('RadioGroup & Radio', () => {
  it('enforces mutually exclusive selection and invokes onValueChange', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <RadioGroup aria-label="Environment" defaultValue="staging" onValueChange={handleValueChange}>
        <Radio value="dev" label="Development" />
        <Radio value="staging" label="Staging" />
        <Radio value="prod" label="Production" />
      </RadioGroup>,
    );

    const devRadio = screen.getByRole('radio', { name: 'Development' }) as HTMLInputElement;
    const stagingRadio = screen.getByRole('radio', { name: 'Staging' }) as HTMLInputElement;
    const prodRadio = screen.getByRole('radio', { name: 'Production' }) as HTMLInputElement;

    expect(stagingRadio.checked).toBe(true);
    expect(devRadio.checked).toBe(false);

    await user.click(prodRadio);
    expect(prodRadio.checked).toBe(true);
    expect(stagingRadio.checked).toBe(false);
    expect(handleValueChange).toHaveBeenCalledWith('prod');
  });

  it('supports keyboard arrow navigation between radio options in a group', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <RadioGroup aria-label="Tier" defaultValue="a" onValueChange={handleValueChange}>
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>,
    );

    const radioA = screen.getByRole('radio', { name: 'Option A' }) as HTMLInputElement;
    radioA.focus();

    await user.keyboard('{ArrowDown}');
    expect(handleValueChange).toHaveBeenCalledWith('b');
  });

  it('prevents selection when RadioGroup or individual Radio is disabled', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <RadioGroup aria-label="Plans" defaultValue="free" onValueChange={handleValueChange}>
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" disabled />
      </RadioGroup>,
    );

    const proRadio = screen.getByRole('radio', { name: 'Pro' }) as HTMLInputElement;
    expect(proRadio.disabled).toBe(true);

    await user.click(proRadio);
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('integrates with FormField context and forwards refs to both RadioGroup and Radio', () => {
    const groupRef = createRef<HTMLDivElement>();
    const radioRef = createRef<HTMLInputElement>();

    render(
      <FormField label="Protocol" errorText="Select a valid protocol." required>
        <RadioGroup ref={groupRef} name="protocol">
          <Radio ref={radioRef} value="https" label="HTTPS" description="Encrypted TLS" />
        </RadioGroup>
      </FormField>,
    );

    expect(groupRef.current).toBeInstanceOf(HTMLDivElement);
    expect(groupRef.current?.getAttribute('aria-invalid')).toBe('true');
    expect(radioRef.current).toBeInstanceOf(HTMLInputElement);
    expect(radioRef.current?.name).toBe('protocol');
    expect(radioRef.current?.getAttribute('aria-describedby')).toContain(
      screen.getByText('Encrypted TLS').id,
    );
  });
});
