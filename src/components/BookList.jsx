import { BookCard } from './BookCard.jsx';
import { EmptyState } from './EmptyState.jsx';

export function BookList({
  books = [],
  onStatusChange,
  onDeleteRequest,
  isSearching = false,
  searchQuery = '',
  onClearSearch,
}) {
  if (books.length === 0) {
    if (isSearching) {
      return (
        <EmptyState
          type="search"
          query={searchQuery}
          onClearSearch={onClearSearch}
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
