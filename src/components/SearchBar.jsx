import { Search, X } from 'lucide-react';

export function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search by title or author',
}) {
  return (
    <div className="relative w-full">
      <label htmlFor="book-search-input" className="sr-only">
        Search books by title or author
      </label>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>
      <input
        id="book-search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[44px] pl-10 pr-10 py-2.5 text-sm bg-surface border border-border rounded-xl text-ink placeholder:text-muted
          focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold shadow-sm transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-ink min-w-[44px] justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold rounded-r-xl"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
