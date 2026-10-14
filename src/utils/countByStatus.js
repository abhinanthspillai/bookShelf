/**
 * Pure function to calculate book counts by status.
 *
 * @param {Array<Object>} books - The list of books
 * @returns {{ 'to-read': number, reading: number, finished: number, total: number }}
 */
export function countByStatus(books = []) {
  const counts = {
    'to-read': 0,
    reading: 0,
    finished: 0,
    total: 0,
  };

  if (!Array.isArray(books)) {
    return counts;
  }

  counts.total = books.length;

  for (const book of books) {
    if (book && typeof book === 'object') {
      if (book.status === 'to-read') {
        counts['to-read']++;
      } else if (book.status === 'reading') {
        counts.reading++;
      } else if (book.status === 'finished') {
        counts.finished++;
      }
    }
  }

  return counts;
}

/**
 * Formats status counts into a human-readable summary string.
 * Example: "3 finished, 2 reading, 1 to read"
 *
 * @param {Object} counts - Object containing counts for each status
 * @returns {string}
 */
export function formatCountsSummary(counts = {}) {
  const finished = counts.finished || 0;
  const reading = counts.reading || 0;
  const toRead = counts['to-read'] || 0;

  return `${finished} finished, ${reading} reading, ${toRead} to read`;
}

export default countByStatus;
