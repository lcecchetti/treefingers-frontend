import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './text';

describe('Text', () => {
  it('renders a span by default', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello').tagName).toBe('SPAN');
  });

  it('renders storyTitle as an h1 with the large serif classes', () => {
    render(<Text variant="storyTitle">Big Title</Text>);
    const el = screen.getByText('Big Title');
    expect(el.tagName).toBe('H1');
    expect(el).toHaveClass('text-4xl', 'lg:text-5xl', 'font-serif', 'font-bold');
  });

  it('renders label variant as a <label> element with no default classes', () => {
    render(<Text variant="label">A label</Text>);
    expect(screen.getByText('A label').tagName).toBe('LABEL');
  });

  it('renders error variant as a span with the error text color', () => {
    render(<Text variant="error">Oops</Text>);
    const el = screen.getByText('Oops');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('text-error');
  });

  it('renders p variant as a <p> with the block class', () => {
    render(<Text variant="p">Paragraph</Text>);
    const el = screen.getByText('Paragraph');
    expect(el.tagName).toBe('P');
    expect(el).toHaveClass('block');
  });

  it('lets the as prop override the default tag', () => {
    render(<Text variant="title" as="h4">Custom tag</Text>);
    expect(screen.getByText('Custom tag').tagName).toBe('H4');
  });
});
