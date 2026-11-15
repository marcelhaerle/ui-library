import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabContent, TabList, Tabs, TabTrigger } from './Tabs';

describe('Tabs', () => {
  it('switches active tab panel on click and invokes onValueChange', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Tabs defaultValue="tab-1" onValueChange={handleValueChange}>
        <TabList aria-label="Sample tabs">
          <TabTrigger value="tab-1">First Tab</TabTrigger>
          <TabTrigger value="tab-2">Second Tab</TabTrigger>
        </TabList>
        <TabContent value="tab-1">First Panel</TabContent>
        <TabContent value="tab-2">Second Panel</TabContent>
      </Tabs>,
    );

    const firstTab = screen.getByRole('tab', { name: 'First Tab' });
    const secondTab = screen.getByRole('tab', { name: 'Second Tab' });

    expect(firstTab.getAttribute('aria-selected')).toBe('true');
    expect(firstTab.getAttribute('tabindex')).toBe('0');
    expect(secondTab.getAttribute('aria-selected')).toBe('false');
    expect(secondTab.getAttribute('tabindex')).toBe('-1');
    expect(screen.getByText('First Panel').hidden).toBe(false);
    expect(screen.getByText('Second Panel').hidden).toBe(true);

    await user.click(secondTab);
    expect(secondTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Second Panel').hidden).toBe(false);
    expect(screen.getByText('First Panel').hidden).toBe(true);
    expect(handleValueChange).toHaveBeenCalledWith('tab-2');
  });

  it('supports roving-tabindex keyboard navigation (ArrowRight, ArrowLeft, Home, End) skipping disabled tabs', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Tabs defaultValue="a" onValueChange={handleValueChange}>
        <TabList aria-label="Roving tabs">
          <TabTrigger value="a">Tab A</TabTrigger>
          <TabTrigger value="b" disabled>
            Tab B
          </TabTrigger>
          <TabTrigger value="c">Tab C</TabTrigger>
        </TabList>
        <TabContent value="a">Panel A</TabContent>
        <TabContent value="b">Panel B</TabContent>
        <TabContent value="c">Panel C</TabContent>
      </Tabs>,
    );

    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    const tabC = screen.getByRole('tab', { name: 'Tab C' });

    await user.tab();
    expect(document.activeElement).toBe(tabA);

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(tabC);
    expect(handleValueChange).toHaveBeenCalledWith('c');

    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(tabA);

    await user.keyboard('{End}');
    expect(document.activeElement).toBe(tabC);

    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(tabA);
  });

  it('supports ArrowDown/ArrowUp in vertical orientation and forwards refs', async () => {
    const user = userEvent.setup();
    const tabsRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Tabs ref={tabsRef} defaultValue="one" orientation="vertical">
        <TabList ref={listRef} aria-label="Vertical tabs">
          <TabTrigger ref={triggerRef} value="one">
            One
          </TabTrigger>
          <TabTrigger value="two">Two</TabTrigger>
        </TabList>
        <TabContent ref={contentRef} value="one">
          Content One
        </TabContent>
        <TabContent value="two">Content Two</TabContent>
      </Tabs>,
    );

    expect(tabsRef.current).toBeInstanceOf(HTMLDivElement);
    expect(listRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);

    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
  });
});
