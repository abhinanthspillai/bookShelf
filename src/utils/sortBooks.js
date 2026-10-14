/**
 * Pure function to sort books newest first.
 * Safely compares ISO strings or timestamps without mutating the input array.
 *
 * @param {Array<Object>} books - The list of books to sort
 * @returns {Array<Object>} A new sorted array of books (newest first)
 */
export function sortBooks(books = []) {
  if (!Array.isArray(books)) {
    return [];
  }

  return [...books].sort((a, b) => {
    const timeA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

export default sortBooks;
