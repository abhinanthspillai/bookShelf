/**
 * Pure function to format a book's creation date into "Added D MMM YYYY" (e.g. "Added 15 Oct 2026").
 * Returns null if createdAt is missing, null, undefined, or invalid.
 *
 * @param {string|number|Date} [createdAt] - The creation timestamp or ISO string
 * @returns {string|null} Formatted added date string or null if invalid
 */
export function formatAddedDate(createdAt) {
  if (!createdAt) {
    return null;
  }

  let parsed = createdAt;
  if (typeof createdAt === 'string' && /^\d+$/.test(createdAt.trim())) {
    parsed = Number(createdAt.trim());
  }

  const date = new Date(parsed);
  if (isNaN(date.getTime())) {
    return null;
  }

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return `Added ${formattedDate}`;
}

/**
 * Formats a full date and time string suitable for element title tooltips.
 * Returns null if createdAt is missing or invalid.
 *
 * @param {string|number|Date} [createdAt]
 * @returns {string|null}
 */
export function formatFullDateTime(createdAt) {
  if (!createdAt) {
    return null;
  }

  let parsed = createdAt;
  if (typeof createdAt === 'string' && /^\d+$/.test(createdAt.trim())) {
    parsed = Number(createdAt.trim());
  }

  const date = new Date(parsed);
  if (isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
}

export default formatAddedDate;
