import { describe, it, expect } from 'vitest';
import { filterBooks } from '../filterBooks.js';

describe('filterBooks utility', () => {
  const sampleBooks = [
    { id: '1', title: 'Aadujeevitham', author: 'Benyamin', status: 'to-read' },
    { id: '2', title: 'The God of Small Things', author: 'Arundhati Roy', status: 'reading' },
    { id: '3', title: 'Khasakkinte Itihasam', author: 'O. V. Vijayan', status: 'finished' },
    { id: '4', title: 'Benjamin Franklin: An American Life', author: 'Walter Isaacson', status: 'to-read' },
  ];

  it('filters books by title case-insensitively with partial match', () => {
    const results = filterBooks(sampleBooks, 'small');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('The God of Small Things');
  });

  it('filters books by author case-insensitively with partial match (e.g. "ben")', () => {
    const results = filterBooks(sampleBooks, 'ben');
    expect(results).toHaveLength(2);
    expect(results.map(b => b.id)).toEqual(['1', '4']);
  });

  it('returns all books when query is empty or whitespace', () => {
    expect(filterBooks(sampleBooks, '')).toEqual(sampleBooks);
    expect(filterBooks(sampleBooks, '   ')).toEqual(sampleBooks);
  });

  it('filters by status when statusFilter is supplied', () => {
    const toRead = filterBooks(sampleBooks, '', 'to-read');
    expect(toRead).toHaveLength(2);
    expect(toRead.every(b => b.status === 'to-read')).toBe(true);

    const finished = filterBooks(sampleBooks, '', 'finished');
    expect(finished).toHaveLength(1);
    expect(finished[0].title).toBe('Khasakkinte Itihasam');
  });

  it('combines text search with status filter', () => {
    const results = filterBooks(sampleBooks, 'ben', 'to-read');
    expect(results).toHaveLength(2);

    const none = filterBooks(sampleBooks, 'ben', 'finished');
    expect(none).toHaveLength(0);
  });

  it('returns empty array when no books match', () => {
    const results = filterBooks(sampleBooks, 'Nonexistent Query');
    expect(results).toEqual([]);
  });

  it('handles empty or invalid inputs gracefully', () => {
    expect(filterBooks(null, 'query')).toEqual([]);
    expect(filterBooks(undefined, 'query')).toEqual([]);
    expect(filterBooks([], 'query')).toEqual([]);
  });
});
