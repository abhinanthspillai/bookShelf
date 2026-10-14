import { describe, it, expect } from 'vitest';
import { sortBooks } from '../sortBooks.js';

describe('sortBooks utility', () => {
  it('sorts books newest first by createdAt timestamp', () => {
    const books = [
      { id: '1', title: 'Older Book', createdAt: '2025-01-01T10:00:00.000Z' },
      { id: '2', title: 'Newest Book', createdAt: '2025-03-01T10:00:00.000Z' },
      { id: '3', title: 'Middle Book', createdAt: '2025-02-01T10:00:00.000Z' },
    ];

    const sorted = sortBooks(books);

    expect(sorted.map(b => b.id)).toEqual(['2', '3', '1']);
  });

  it('is immutable and does not mutate original array', () => {
    const books = [
      { id: '1', title: 'A', createdAt: '2025-01-01T00:00:00.000Z' },
      { id: '2', title: 'B', createdAt: '2025-02-01T00:00:00.000Z' },
    ];
    const clone = [...books];

    sortBooks(books);

    expect(books).toEqual(clone);
  });

  it('handles missing or malformed createdAt values gracefully', () => {
    const books = [
      { id: '1', title: 'No Date' },
      { id: '2', title: 'Recent', createdAt: '2025-05-01T00:00:00.000Z' },
      { id: '3', title: 'Invalid Date', createdAt: 'invalid-date' },
    ];

    const sorted = sortBooks(books);
    expect(sorted[0].id).toBe('2');
  });

  it('handles empty or non-array arguments safely', () => {
    expect(sortBooks([])).toEqual([]);
    expect(sortBooks(null)).toEqual([]);
    expect(sortBooks(undefined)).toEqual([]);
  });
});
