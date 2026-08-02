import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UIProvider } from '@/lib/ui/context';
import { Toast } from './toast';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('Toast', () => {
  it('renders its label', () => {
    render(
      <UIProvider>
        <Toast toast={{ id: 1, label: 'Saved!', duration: 3000 }} />
      </UIProvider>
    );
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('schedules a dismissal timer when duration is set', () => {
    render(
      <UIProvider>
        <Toast toast={{ id: 1, label: 'Bye', duration: 1000 }} />
      </UIProvider>
    );
    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });

  it('never schedules dismissal when duration is 0', () => {
    render(
      <UIProvider>
        <Toast toast={{ id: 1, label: 'Sticky', duration: 0 }} />
      </UIProvider>
    );
    expect(vi.getTimerCount()).toBe(0);
  });
});
