/**
 * Validates book input fields.
 * Trims whitespace so whitespace-only inputs count as empty.
 *
 * @param {Object} input
 * @param {string} [input.title]
 * @param {string} [input.author]
 * @param {string} [input.status]
 * @returns {{ isValid: boolean, errors: { title?: string, author?: string } }}
 */
export function validateBook(input = {}) {
  const errors = {};
  const trimmedTitle = (input.title || '').trim();
  const trimmedAuthor = (input.author || '').trim();

  if (!trimmedTitle) {
    errors.title = 'Please enter a title';
  }

  if (!trimmedAuthor) {
    errors.author = 'Please enter an author';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default validateBook;
