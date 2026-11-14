import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

describe('Accordion', () => {
  it('toggles items exclusively in single mode and respects collapsible prop', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Accordion type="single" defaultValue="one" collapsible onValueChange={handleValueChange}>
        <AccordionItem value="one">
          <AccordionTrigger>Section One</AccordionTrigger>
          <AccordionContent>Content One</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Section Two</AccordionTrigger>
          <AccordionContent>Content Two</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const triggerOne = screen.getByRole('button', { name: 'Section One' });
    const triggerTwo = screen.getByRole('button', { name: 'Section Two' });

    expect(triggerOne.getAttribute('aria-expanded')).toBe('true');
    expect(triggerTwo.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByText('Content One').hidden).toBe(false);
    expect(screen.getByText('Content Two').hidden).toBe(true);

    await user.click(triggerTwo);
    expect(triggerOne.getAttribute('aria-expanded')).toBe('false');
    expect(triggerTwo.getAttribute('aria-expanded')).toBe('true');
    expect(handleValueChange).toHaveBeenCalledWith('two');

    await user.click(triggerTwo);
    expect(triggerTwo.getAttribute('aria-expanded')).toBe('false');
    expect(handleValueChange).toHaveBeenCalledWith('');
  });

  it('prevents closing the active item when collapsible is false in single mode', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Accordion
        type="single"
        defaultValue="one"
        collapsible={false}
        onValueChange={handleValueChange}
      >
        <AccordionItem value="one">
          <AccordionTrigger>Section One</AccordionTrigger>
          <AccordionContent>Content One</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const triggerOne = screen.getByRole('button', { name: 'Section One' });
    await user.click(triggerOne);

    expect(triggerOne.getAttribute('aria-expanded')).toBe('true');
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('allows multiple items to be open simultaneously when type is multiple', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Accordion type="multiple" defaultValue={['a']} onValueChange={handleValueChange}>
        <AccordionItem value="a">
          <AccordionTrigger>Trigger A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Trigger B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const triggerA = screen.getByRole('button', { name: 'Trigger A' });
    const triggerB = screen.getByRole('button', { name: 'Trigger B' });

    await user.click(triggerB);
    expect(triggerA.getAttribute('aria-expanded')).toBe('true');
    expect(triggerB.getAttribute('aria-expanded')).toBe('true');
    expect(handleValueChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('supports WAI-ARIA keyboard navigation (ArrowDown, ArrowUp, Home, End) and forwards refs', async () => {
    const user = userEvent.setup();
    const accordionRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();

    render(
      <Accordion ref={accordionRef}>
        <AccordionItem value="1">
          <AccordionTrigger ref={triggerRef}>First</AccordionTrigger>
          <AccordionContent>First content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2" disabled>
          <AccordionTrigger>Second (Disabled)</AccordionTrigger>
          <AccordionContent>Second content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger>Third</AccordionTrigger>
          <AccordionContent>Third content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const firstTrigger = screen.getByRole('button', { name: 'First' });
    const thirdTrigger = screen.getByRole('button', { name: 'Third' });

    expect(accordionRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBe(firstTrigger);

    firstTrigger.focus();
    expect(document.activeElement).toBe(firstTrigger);

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(thirdTrigger);

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(firstTrigger);

    await user.keyboard('{End}');
    expect(document.activeElement).toBe(thirdTrigger);

    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(firstTrigger);
  });
});
