import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageRepository } from '../localStorageRepository.js';
import { STORAGE_KEY } from '../../config/constants.js';

describe('LocalStorageRepository', () => {
  let repository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageRepository();
  });

  it('returns empty array when storage is empty', async () => {
    const books = await repository.getAll();
    expect(books).toEqual([]);
  });

  it('creates and persists a new book with generated id and createdAt', async () => {
    const newBook = await repository.create({
      title: 'Aadujeevitham',
      author: 'Benyamin',
      status: 'to-read',
    });

    expect(newBook.id).toBeDefined();
    expect(newBook.title).toBe('Aadujeevitham');
    expect(newBook.author).toBe('Benyamin');
    expect(newBook.status).toBe('to-read');
    expect(newBook.createdAt).toBeDefined();

    const stored = await repository.getAll();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(newBook.id);
  });

  it('updates an existing book status and preserves id and createdAt', async () => {
    const book = await repository.create({
      title: '1984',
      author: 'George Orwell',
      status: 'to-read',
    });

    const updated = await repository.update(book.id, { status: 'finished' });
    expect(updated.status).toBe('finished');
    expect(updated.id).toBe(book.id);
    expect(updated.createdAt).toBe(book.createdAt);

    const all = await repository.getAll();
    expect(all[0].status).toBe('finished');
  });

  it('removes a book by its id', async () => {
    const book1 = await repository.create({ title: 'Book 1', author: 'Author 1' });
    const book2 = await repository.create({ title: 'Book 2', author: 'Author 2' });

    await repository.remove(book1.id);

    const remaining = await repository.getAll();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(book2.id);
  });

  describe('Corrupted and missing storage resilience', () => {
    it('does not crash and returns empty array when localStorage contains invalid JSON', async () => {
      localStorage.setItem(STORAGE_KEY, 'corrupted: { [invalid-json]');

      const books = await repository.getAll();
      expect(books).toEqual([]);
    });

    it('does not crash and returns empty array when localStorage contains non-array JSON', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ error: 'not an array' }));

      const books = await repository.getAll();
      expect(books).toEqual([]);
    });

    it('filters out corrupted or null items within the stored array', async () => {
      const mixedData = [
        null,
        undefined,
        'string instead of object',
        { invalid: true }, // missing id and title
        { id: 'valid-1', title: 'Valid Book', author: 'Valid Author', status: 'to-read' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mixedData));

      const books = await repository.getAll();
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Valid Book');
    });
  });
});
