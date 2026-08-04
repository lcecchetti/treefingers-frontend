import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { ClientOnly } from './client-only';

describe('ClientOnly', () => {
  // this is the contract the story/forest/user routes rely on to stay
  // static/ISR-eligible: the wrapped child (whose own data fetching may
  // touch cookies()) must never render during the server pass
  it('renders only the fallback during server rendering, never the children', () => {
    const html = renderToStaticMarkup(
      <ClientOnly fallback={<span>loading</span>}>
        <span>real content</span>
      </ClientOnly>
    );

    expect(html).toContain('loading');
    expect(html).not.toContain('real content');
  });

  it('swaps to the children once mounted on the client', async () => {
    render(
      <ClientOnly fallback={<span>loading</span>}>
        <span>real content</span>
      </ClientOnly>
    );

    expect(await screen.findByText('real content')).toBeInTheDocument();
  });
});
