import { StatusBadge } from './StatusBadge.jsx';
import { StatusSelect } from './StatusSelect.jsx';
import { formatAddedDate, formatFullDateTime } from '../utils/formatAddedDate.js';
import { coverTint } from '../utils/coverTint.js';
import { Trash2 } from 'lucide-react';

export function BookCard({
  book,
  onStatusChange,
  onDeleteRequest,
}) {
  const tint = coverTint(book.title);
  const initials = (book.title || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');

  const addedDate = formatAddedDate(book.createdAt);
  const fullDateTime = formatFullDateTime(book.createdAt);

  return (
    <article
      aria-label={`Book: ${book.title} by ${book.author}`}
      className="bg-surface rounded-card border border-border p-5 sm:p-6 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start gap-4">
          {/* Editorial Generated Book Tile */}
          <div
            className={`w-14 h-20 rounded-lg bg-gradient-to-br ${tint.gradientClass} ${tint.textClass} flex-shrink-0 flex items-center justify-center border ${tint.borderClass} shadow-inner select-none font-serif text-lg font-bold`}
            aria-hidden="true"
          >
            <span>{initials || 'BK'}</span>
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <StatusBadge status={book.status} />
              {onDeleteRequest && (
                <button
                  type="button"
                  onClick={() => onDeleteRequest(book)}
                  aria-label={`Delete ${book.title}`}
                  className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 p-2 flex items-center justify-center text-muted/60 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <h3 className="font-serif text-lg text-ink font-semibold mt-2 leading-snug line-clamp-2 break-words">
              {book.title}
            </h3>
            <p className="text-muted text-sm mt-0.5 line-clamp-1 break-words">
              by <span className="text-ink/80 font-medium">{book.author}</span>
            </p>
            {addedDate && (
              <p
                title={fullDateTime || undefined}
                className="text-xs text-muted/80 mt-1 cursor-default"
              >
                {addedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status Changer Footer */}
      <div className="mt-5 pt-3.5 border-t border-border/70 flex items-center justify-between gap-3">
        <label
          htmlFor={`status-select-${book.id}`}
          className="text-xs font-semibold uppercase tracking-wider text-muted whitespace-nowrap"
        >
          Status
        </label>
        <div className="w-36 sm:w-44">
          <StatusSelect
            id={`status-select-${book.id}`}
            value={book.status}
            onChange={(newStatus) => onStatusChange && onStatusChange(book.id, newStatus)}
            ariaLabel={`Change status for ${book.title}`}
          />
        </div>
      </div>
    </article>
  );
}

export default BookCard;
