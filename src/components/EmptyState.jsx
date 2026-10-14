import { BookOpen, SearchX } from 'lucide-react';

export function EmptyState({ type = 'empty', query = '', onClearSearch }) {
  if (type === 'search') {
    return (
      <div className="bg-surface rounded-card p-10 sm:p-12 text-center border border-dashed border-border shadow-soft flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-gold-subtle flex items-center justify-center text-gold mb-4 border border-gold-border">
          <SearchX className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="font-serif text-xl text-ink font-semibold mb-1">
          No books match your search
        </h3>
        <p className="text-muted text-sm max-w-sm mb-5">
          We couldn&apos;t find any books matching <span className="font-medium text-ink">&ldquo;{query}&rdquo;</span> in title or author.
        </p>
        {onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm font-medium text-ink bg-cream hover:bg-border/60 rounded-full border border-border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card p-10 sm:p-12 text-center border border-border shadow-soft flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center text-gold mb-4 border border-border">
        <BookOpen className="w-8 h-8 stroke-[1.5]" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl text-ink font-semibold mb-1.5">
        Your reading shelf is <span className="text-gold">empty</span>
      </h3>
      <p className="text-muted text-sm max-w-md">
        Start building your reading queue by adding a book with title, author, and reading status above.
      </p>
    </div>
  );
}

export default EmptyState;
