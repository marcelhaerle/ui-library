import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders Card with CardHeader, CardBody, and CardFooter content', () => {
    render(
      <Card data-testid="card">
        <CardHeader>System Status</CardHeader>
        <CardBody>All services operational.</CardBody>
        <CardFooter>Updated just now</CardFooter>
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(screen.getByText('System Status')).toBeTruthy();
    expect(screen.getByText('All services operational.')).toBeTruthy();
    expect(screen.getByText('Updated just now')).toBeTruthy();
  });

  it('renders semantic HTML element specified via the as prop', () => {
    const { rerender } = render(
      <Card as="article" aria-label="Release Note">
        <CardBody>Version 2.4</CardBody>
      </Card>,
    );

    expect(screen.getByRole('article', { name: 'Release Note' }).tagName).toBe('ARTICLE');

    rerender(
      <Card as="section" aria-label="Metrics Section">
        <CardBody>Version 2.4</CardBody>
      </Card>,
    );

    expect(screen.getByRole('region', { name: 'Metrics Section' }).tagName).toBe('SECTION');
  });

  it('supports click and keyboard activation when interactive is true', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Card interactive onClick={handleClick} aria-label="Deployment card">
        <CardBody>Click to open</CardBody>
      </Card>,
    );

    const card = screen.getByLabelText('Deployment card');
    expect(card.getAttribute('tabindex')).toBe('0');
    expect(card.getAttribute('data-interactive')).toBe('true');

    await user.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);

    card.focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(2);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('forwards refs to Card and its subcomponents', () => {
    const cardRef = createRef<HTMLElement>();
    const headerRef = createRef<HTMLDivElement>();
    const bodyRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();

    render(
      <Card ref={cardRef} as="article">
        <CardHeader ref={headerRef}>Header</CardHeader>
        <CardBody ref={bodyRef}>Body</CardBody>
        <CardFooter ref={footerRef}>Footer</CardFooter>
      </Card>,
    );

    expect(cardRef.current).toBeInstanceOf(HTMLElement);
    expect(cardRef.current?.tagName).toBe('ARTICLE');
    expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(bodyRef.current).toBeInstanceOf(HTMLDivElement);
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
