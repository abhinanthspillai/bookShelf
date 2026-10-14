import { STORAGE_KEY, DEFAULT_STATUS } from '../config/constants.js';
import { BookRepository } from './bookRepository.js';

/**
 * Safely generates a unique UUID.
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'b-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Safely parses JSON array from localStorage.
 * Handles missing data, malformed JSON, and non-array shapes.
 * @returns {Array}
 */
function readStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter out corrupted individual items
    return parsed.filter(item => item && typeof item === 'object' && item.id && item.title);
  } catch (error) {
    console.warn('Failed to parse localStorage data, falling back to empty list:', error);
    return [];
  }
}

/**
 * Safely writes an array to localStorage.
 * @param {Array} books
 */
function writeStorage(books) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  } catch (error) {
    console.error('Failed to write to localStorage:', error);
  }
}

/**
 * LocalStorage implementation of BookRepository.
 */
export class LocalStorageRepository extends BookRepository {
  async getAll() {
    return readStorage();
  }

  async create(bookData) {
    const books = readStorage();
    const newBook = {
      id: generateId(),
      title: (bookData.title || '').trim(),
      author: (bookData.author || '').trim(),
      status: bookData.status || DEFAULT_STATUS,
      createdAt: bookData.createdAt || new Date().toISOString(),
    };
    books.push(newBook);
    writeStorage(books);
    return newBook;
  }

  async update(id, updates) {
    const books = readStorage();
    const index = books.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error(`Book with id "${id}" not found.`);
    }
    const updated = {
      ...books[index],
      ...updates,
      id: books[index].id, // protect immutable id
      createdAt: books[index].createdAt, // protect original creation timestamp
    };
    if (updates.title !== undefined) updated.title = updates.title.trim();
    if (updates.author !== undefined) updated.author = updates.author.trim();

    books[index] = updated;
    writeStorage(books);
    return updated;
  }

  async remove(id) {
    const books = readStorage();
    const filtered = books.filter(b => b.id !== id);
    writeStorage(filtered);
  }
}

export const localStorageRepository = new LocalStorageRepository();
export default localStorageRepository;
