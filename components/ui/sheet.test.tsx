import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sheet, SheetContent } from './sheet';

// Radix's Presence gates mounting in two independent places for a Dialog:
// once on Dialog.Portal and once on Dialog.Content. A CSS-transition-based
// slide animation needs the closed content to stay in the DOM (so it can
// transition *into* view rather than popping in), which requires
// forceMount on both. This regression was found via live-Playwright
// debugging -- the first fix attempt only covered one of the two gates.
describe('SheetContent forceMount propagation', () => {
  it('keeps content and overlay mounted with data-state="closed" when forceMount is set and the sheet is closed', () => {
    render(
      <Sheet open={false}>
        <SheetContent forceMount showOverlay data-testid="sheet-content" overlayClassName="sheet-overlay">
          content
        </SheetContent>
      </Sheet>
    );

    const content = screen.getByTestId('sheet-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('data-state', 'closed');
    expect(screen.getByText('content')).toBeInTheDocument();

    const overlay = document.querySelector('.sheet-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay).toHaveAttribute('data-state', 'closed');
  });

  it('does not render content when the sheet is closed and forceMount is not set (default behavior)', () => {
    render(
      <Sheet open={false}>
        <SheetContent data-testid="sheet-content">content</SheetContent>
      </Sheet>
    );

    expect(screen.queryByTestId('sheet-content')).not.toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });
});
