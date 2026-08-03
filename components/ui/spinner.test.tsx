import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('renders nothing when loading is false', () => {
    const { container } = render(<Spinner loading={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a spin icon by default', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders the label text next to the spinner', () => {
    render(<Spinner label="Loading more" />);
    expect(screen.getByText('Loading more')).toBeInTheDocument();
  });
});
