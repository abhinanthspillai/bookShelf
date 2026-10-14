import { BookCard } from './BookCard.jsx';
import { EmptyState } from './EmptyState.jsx';

export function BookList({
  books = [],
  onStatusChange,
  onDeleteRequest,
  searchQuery = '',
  statusFilter = 'all',
  statusLabel = '',
  onClearSearch,
  onResetFilter,
}) {
  if (books.length === 0) {
    if (searchQuery.trim()) {
      return (
        <EmptyState
          type="search"
          query={searchQuery}
          statusLabel={statusFilter !== 'all' ? statusLabel : ''}
          onClearSearch={onClearSearch}
        />
      );
    }
    if (statusFilter !== 'all') {
      return (
        <EmptyState
          type="filter"
          statusLabel={statusLabel}
          onResetFilter={onResetFilter}
        />
      );
    }
    return <EmptyState type="empty" />;
  }

  return (
    <section aria-label="Books list">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onStatusChange={onStatusChange}
            onDeleteRequest={onDeleteRequest}
          />
        ))}
      </div>
    </section>
  );
}

export default BookList;
