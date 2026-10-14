import { describe, it, expect } from 'vitest';
import { validateBook } from '../validateBook.js';

describe('validateBook utility', () => {
  it('returns valid when title and author are provided', () => {
    const result = validateBook({
      title: 'Aadujeevitham',
      author: 'Benyamin',
      status: 'to-read',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('fails with exact error when title is empty', () => {
    const result = validateBook({
      title: '',
      author: 'Benyamin',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe('Please enter a title');
    expect(result.errors.author).toBeUndefined();
  });

  it('fails when title consists solely of whitespace', () => {
    const result = validateBook({
      title: '   ',
      author: 'Benyamin',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe('Please enter a title');
  });

  it('fails with exact error when author is empty', () => {
    const result = validateBook({
      title: 'Aadujeevitham',
      author: '',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.author).toBe('Please enter an author');
    expect(result.errors.title).toBeUndefined();
  });

  it('fails when author consists solely of whitespace', () => {
    const result = validateBook({
      title: 'Aadujeevitham',
      author: '    ',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.author).toBe('Please enter an author');
  });

  it('reports both errors when title and author are missing or empty', () => {
    const result = validateBook({});

    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe('Please enter a title');
    expect(result.errors.author).toBe('Please enter an author');
  });
});
