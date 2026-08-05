import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { formatDate } from './date';
import { useFormattedDate } from './use-formatted-date';

describe('useFormattedDate', () => {
  it('settles on the client-formatted date after mount', async () => {
    const { result } = renderHook(() => useFormattedDate('2024-03-05T10:00:00.000Z'));

    await waitFor(() => {
      expect(result.current).toBe(formatDate('2024-03-05T10:00:00.000Z'));
    });
  });
});
