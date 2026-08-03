import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card, CardHeader, CardContent, CardFooter } from './card';

describe('Card', () => {
  it('renders the base card layout classes', () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstChild).toHaveClass('rounded-2xl', 'p-lg', 'flex', 'flex-col', 'gap-md', 'justify-between');
  });

  it('merges a custom className', () => {
    const { container } = render(<Card className="bg-primary">content</Card>);
    expect(container.firstChild).toHaveClass('bg-primary', 'rounded-2xl');
  });
});

describe('CardHeader', () => {
  it('renders the header layout classes', () => {
    const { container } = render(<CardHeader>header</CardHeader>);
    expect(container.firstChild).toHaveClass('flex', 'justify-between', 'items-center', 'gap-md');
  });
});

describe('CardContent', () => {
  it('renders the content layout classes', () => {
    const { container } = render(<CardContent>body</CardContent>);
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'items-center', 'gap-md', 'grow');
  });
});

describe('CardFooter', () => {
  it('renders the footer layout classes', () => {
    const { container } = render(<CardFooter>footer</CardFooter>);
    expect(container.firstChild).toHaveClass('flex', 'justify-between', 'items-center', 'gap-md');
  });
});
