import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Code, Heading, Text } from './Typography';

describe('Typography', () => {
  describe('Heading', () => {
    it('renders h2 by default and supports polymorphic h1-h6 elements', () => {
      const { rerender } = render(<Heading>Default Heading</Heading>);
      expect(screen.getByRole('heading', { level: 2, name: 'Default Heading' })).toBeDefined();

      rerender(<Heading as="h1">Main Title</Heading>);
      const h1 = screen.getByRole('heading', { level: 1, name: 'Main Title' });
      expect(h1.tagName).toBe('H1');
      expect(h1.classList.contains('mhui:text-3xl')).toBe(true);

      rerender(
        <Heading as="h4" size="2xl">
          Custom Sized H4
        </Heading>,
      );
      const h4 = screen.getByRole('heading', { level: 4, name: 'Custom Sized H4' });
      expect(h4.tagName).toBe('H4');
      expect(h4.classList.contains('mhui:text-2xl')).toBe(true);
      expect(h4.classList.contains('mhui:text-lg')).toBe(false);
    });

    it('forwards ref and native attributes to the heading element', () => {
      const ref = createRef<HTMLHeadingElement>();
      render(
        <Heading ref={ref} as="h3" id="section-heading">
          Section
        </Heading>,
      );

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.tagName).toBe('H3');
      expect(ref.current?.id).toBe('section-heading');
    });
  });

  describe('Text', () => {
    it('renders p by default and supports span, div, and label with htmlFor', () => {
      const { rerender } = render(<Text>Paragraph text</Text>);
      expect(screen.getByText('Paragraph text').tagName).toBe('P');

      rerender(<Text as="span">Inline text</Text>);
      expect(screen.getByText('Inline text').tagName).toBe('SPAN');

      rerender(<Text as="div">Block text</Text>);
      expect(screen.getByText('Block text').tagName).toBe('DIV');

      rerender(
        <div>
          <Text as="label" htmlFor="email-input">
            Email Address
          </Text>
          <input id="email-input" type="email" />
        </div>,
      );
      expect(screen.getByLabelText('Email Address')).toBeInstanceOf(HTMLInputElement);
    });

    it('forwards ref and merges mhui-prefixed classes cleanly', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Text ref={ref} size="sm" className="custom-text mhui:text-lg">
          Merged Text
        </Text>,
      );

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
      expect(ref.current?.classList.contains('mhui:text-lg')).toBe(true);
      expect(ref.current?.classList.contains('mhui:text-sm')).toBe(false);
      expect(ref.current?.classList.contains('custom-text')).toBe(true);
    });
  });

  describe('Code', () => {
    it('renders inline and block code elements with ref forwarding', () => {
      const ref = createRef<HTMLElement>();
      const { rerender } = render(
        <Code ref={ref} id="inline-snippet">
          const x = 1;
        </Code>,
      );

      expect(ref.current?.tagName).toBe('CODE');
      expect(ref.current?.id).toBe('inline-snippet');
      expect(ref.current?.classList.contains('mhui:inline-block')).toBe(true);

      rerender(
        <Code ref={ref} block>
          const y = 2;
        </Code>,
      );
      expect(ref.current?.classList.contains('mhui:block')).toBe(true);
      expect(ref.current?.classList.contains('mhui:inline-block')).toBe(false);
    });
  });
});
