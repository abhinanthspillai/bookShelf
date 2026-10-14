import { StatusBadge } from './StatusBadge.jsx';
import { StatusSelect } from './StatusSelect.jsx';
import { Trash2 } from 'lucide-react';

/**
 * Deterministically generates an editorial gradient style based on book title string.
 */
function getBookGradient(title = '') {
  const gradients = [
    'from-[#E8DFD1] via-[#D5C7B2] to-[#B8812E]/30 text-[#6B5024]',
    'from-[#E3E8E1] via-[#CAD6C6] to-[#7B9274]/30 text-[#3F5438]',
    'from-[#E7E2DC] via-[#D6CDCE] to-[#8C6D68]/30 text-[#543D39]',
    'from-[#F0E6D2] via-[#E2D2B3] to-[#C99C49]/40 text-[#73531A]',
    'from-[#DFE5EA] via-[#CAD4DE] to-[#6C849B]/30 text-[#36495A]',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export function BookCard({
  book,
  onStatusChange,
  onDeleteRequest,
}) {
  const gradientClass = getBookGradient(book.title);
  const initials = (book.title || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');

  return (
    <article
      aria-label={`Book: ${book.title} by ${book.author}`}
      className="bg-surface rounded-card border border-border p-5 sm:p-6 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start gap-4">
          {/* Editorial Generated Book Tile */}
          <div
            className={`w-14 h-20 rounded-lg bg-gradient-to-br ${gradientClass} flex-shrink-0 flex items-center justify-center border border-border/80 shadow-inner select-none font-serif text-lg font-bold`}
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
