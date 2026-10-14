/**
 * BookRepository Interface Definition
 *
 * @typedef {Object} Book
 * @property {string} id - Unique identifier (UUID)
 * @property {string} title - Title of the book
 * @property {string} author - Author of the book
 * @property {'to-read' | 'reading' | 'finished'} status - Current reading status
 * @property {string} createdAt - ISO timestamp string
 *
 * @interface BookRepository
 */

export class BookRepository {
  /**
   * Retrieves all books.
   * @returns {Promise<Book[]>}
   */
  async getAll() {
    throw new Error('BookRepository.getAll() must be implemented.');
  }

  /**
   * Creates and stores a new book.
   * @param {Omit<Book, 'id' | 'createdAt'>} bookData
   * @returns {Promise<Book>}
   */
  async create(bookData) {
    throw new Error('BookRepository.create() must be implemented.');
  }

  /**
   * Updates an existing book by its ID.
   * @param {string} id
   * @param {Partial<Book>} updates
   * @returns {Promise<Book>}
   */
  async update(id, updates) {
    throw new Error('BookRepository.update() must be implemented.');
  }

  /**
   * Removes a book by its ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async remove(id) {
    throw new Error('BookRepository.remove() must be implemented.');
  }
}
