import { useState } from 'react';
import { DEFAULT_STATUS } from '../config/constants.js';
import { validateBook } from '../utils/validateBook.js';
import { StatusSelect } from './StatusSelect.jsx';
import { Plus } from 'lucide-react';

export function BookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
    if (errors.author) {
      setErrors(prev => ({ ...prev, author: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateBook({ title, author, status });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddBook({
        title: title.trim(),
        author: author.trim(),
        status,
      });

      // Reset form upon successful submission
      setTitle('');
      setAuthor('');
      setStatus(DEFAULT_STATUS);
      setErrors({});
    } catch (err) {
      console.error('Failed to submit book form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="add-book-heading"
      className="bg-surface rounded-card p-6 sm:p-7 shadow-soft border border-border transition-shadow hover:shadow-lift"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 id="add-book-heading" className="font-serif text-xl sm:text-2xl text-ink font-semibold">
            Add a <span className="text-gold">Book</span>
          </h2>
          <p className="text-muted text-xs sm:text-sm mt-0.5">
            Add a title to your personal collection to begin tracking.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Title Input */}
          <div className="md:col-span-5">
            <label htmlFor="book-title" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Title <span className="text-gold" aria-hidden="true">*</span>
            </label>
            <input
              id="book-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Aadujeevitham"
              aria-required="true"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-cream/40 border rounded-xl text-ink placeholder:text-muted/60
                focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500'
                    : 'border-border focus:ring-gold focus:border-gold'
                }`}
            />
            {errors.title && (
              <p
                id="title-error"
                role="alert"
                aria-live="polite"
                className="text-xs text-red-600 mt-1.5 font-medium flex items-center gap-1"
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Author Input */}
          <div className="md:col-span-4">
            <label htmlFor="book-author" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Author <span className="text-gold" aria-hidden="true">*</span>
            </label>
            <input
              id="book-author"
              type="text"
              value={author}
              onChange={handleAuthorChange}
              placeholder="e.g. Benyamin"
              aria-required="true"
              aria-invalid={Boolean(errors.author)}
              aria-describedby={errors.author ? 'author-error' : undefined}
              className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-cream/40 border rounded-xl text-ink placeholder:text-muted/60
                focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.author
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500'
                    : 'border-border focus:ring-gold focus:border-gold'
                }`}
            />
            {errors.author && (
              <p
                id="author-error"
                role="alert"
                aria-live="polite"
                className="text-xs text-red-600 mt-1.5 font-medium flex items-center gap-1"
              >
                {errors.author}
              </p>
            )}
          </div>

          {/* Status Select */}
          <div className="md:col-span-3">
            <label htmlFor="form-status" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Status
            </label>
            <StatusSelect
              id="form-status"
              value={status}
              onChange={setStatus}
              ariaLabel="Initial reading status"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-ink text-white text-sm font-medium rounded-full shadow hover:bg-ink-light active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Add Book
          </button>
        </div>
      </form>
    </section>
  );
}

export default BookForm;
