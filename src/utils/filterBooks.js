/**
 * Pure function to filter books by search query and optional status filter.
 * Search is case-insensitive and matches partial text in either title or author.
 *
 * @param {Array<Object>} books - The list of books to filter
 * @param {string} [query=''] - The search text
 * @param {string} [statusFilter='all'] - Optional status filter value ('all', 'to-read', 'reading', 'finished')
 * @returns {Array<Object>} Filtered array of books
 */
export function filterBooks(books = [], query = '', statusFilter = 'all') {
  if (!Array.isArray(books)) {
    return [];
  }

  const trimmedQuery = (query || '').trim().toLowerCase();

  return books.filter(book => {
    if (!book) return false;

    // Status filter check
    if (statusFilter && statusFilter !== 'all' && book.status !== statusFilter) {
      return false;
    }

    // If no query string, keep all books matching the status filter
    if (!trimmedQuery) {
      return true;
    }

    const titleMatch = (book.title || '').toLowerCase().includes(trimmedQuery);
    const authorMatch = (book.author || '').toLowerCase().includes(trimmedQuery);

    return titleMatch || authorMatch;
  });
}

export default filterBooks;
