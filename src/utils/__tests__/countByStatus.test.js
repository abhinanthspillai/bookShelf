import { describe, it, expect } from 'vitest';
import { countByStatus, formatCountsSummary } from '../countByStatus.js';

describe('countByStatus utility', () => {
  it('correctly tallies counts for each status and total', () => {
    const books = [
      { id: '1', status: 'finished' },
      { id: '2', status: 'finished' },
      { id: '3', status: 'finished' },
      { id: '4', status: 'reading' },
      { id: '5', status: 'reading' },
      { id: '6', status: 'to-read' },
    ];

    const counts = countByStatus(books);

    expect(counts).toEqual({
      'to-read': 1,
      reading: 2,
      finished: 3,
      total: 6,
    });
  });

  it('handles zero counts for all statuses when list is empty', () => {
    const counts = countByStatus([]);

    expect(counts).toEqual({
      'to-read': 0,
      reading: 0,
      finished: 0,
      total: 0,
    });
  });

  it('handles non-array inputs safely', () => {
    expect(countByStatus(null)).toEqual({
      'to-read': 0,
      reading: 0,
      finished: 0,
      total: 0,
    });
  });

  describe('formatCountsSummary', () => {
    it('formats summary with correct status counts (e.g. "3 finished, 2 reading, 1 to read")', () => {
      const summary = formatCountsSummary({
        finished: 3,
        reading: 2,
        'to-read': 1,
        total: 6,
      });

      expect(summary).toBe('3 finished, 2 reading, 1 to read');
    });

    it('formats summary with zero counts correctly', () => {
      const summary = formatCountsSummary({
        finished: 0,
        reading: 0,
        'to-read': 0,
        total: 0,
      });

      expect(summary).toBe('0 finished, 0 reading, 0 to read');
    });

    it('handles empty input gracefully', () => {
      expect(formatCountsSummary({})).toBe('0 finished, 0 reading, 0 to read');
    });
  });
});
