import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sheet, SheetContent } from './sheet';

// Radix's Presence gates mounting in two places for a Dialog (Portal and
// Content), so a CSS slide-in animation needs forceMount on both to keep
// closed content in the DOM.
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
