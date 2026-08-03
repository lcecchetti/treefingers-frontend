import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Container } from './container';

describe('Container', () => {
  it('applies the responsive container class by default', () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstChild).toHaveClass('lg:container', 'mx-auto', 'px-md', 'w-full');
  });

  it('omits the container class when fluid', () => {
    const { container } = render(<Container fluid>content</Container>);
    expect(container.firstChild).not.toHaveClass('lg:container');
    expect(container.firstChild).toHaveClass('mx-auto', 'px-md', 'w-full');
  });

  it('merges a custom className', () => {
    const { container } = render(<Container className="bg-card">content</Container>);
    expect(container.firstChild).toHaveClass('bg-card');
  });
});
