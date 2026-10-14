import { useState, useEffect, useCallback } from 'react';
import { bookRepository } from '../repositories/index.js';
import { DEFAULT_STATUS } from '../config/constants.js';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookRepository.getAll();
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books:', err);
      setError('Could not load books from storage.');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const addBook = useCallback(async ({ title, author, status = DEFAULT_STATUS }) => {
    try {
      const newBook = await bookRepository.create({
        title,
        author,
        status,
      });
      setBooks(prev => [newBook, ...prev.filter(b => b.id !== newBook.id)]);
      return newBook;
    } catch (err) {
      console.error('Failed to add book:', err);
      setError('Could not add book.');
      throw err;
    }
  }, []);

  const updateBookStatus = useCallback(async (id, newStatus) => {
    try {
      // Optimistic update
      setBooks(prev => prev.map(book => (book.id === id ? { ...book, status: newStatus } : book)));
      const updated = await bookRepository.update(id, { status: newStatus });
      setBooks(prev => prev.map(book => (book.id === id ? updated : book)));
      return updated;
    } catch (err) {
      console.error('Failed to update book status:', err);
      // Revert on failure
      loadBooks();
      throw err;
    }
  }, [loadBooks]);

  const deleteBook = useCallback(async (id) => {
    try {
      // Optimistic removal
      setBooks(prev => prev.filter(book => book.id !== id));
      await bookRepository.remove(id);
    } catch (err) {
      console.error('Failed to delete book:', err);
      loadBooks();
      throw err;
    }
  }, [loadBooks]);

  return {
    books,
    isLoading,
    error,
    addBook,
    updateBookStatus,
    deleteBook,
    refreshBooks: loadBooks,
  };
}

export default useBooks;
