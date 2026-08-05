import { describe, it, expect } from 'vitest';
import { formatDate, DATE_SHORT, DATE_LONG } from './date';

describe('formatDate', () => {
  it('formats with the default short format', () => {
    expect(formatDate('2024-03-05T10:00:00.000Z')).toBe('05/03/2024');
  });

  it('formats with the long format when requested', () => {
    const result = formatDate('2024-03-05T10:00:00.000Z', DATE_LONG, { timeZone: 'UTC' });
    expect(result).toBe('05/03/2024 10:00:00');
  });

  it('accepts a Date instance directly', () => {
    expect(formatDate(new Date('2024-03-05T10:00:00.000Z'), DATE_SHORT, { timeZone: 'UTC' })).toBe('05/03/2024');
  });
});
