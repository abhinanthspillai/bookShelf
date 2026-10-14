import { useState } from 'react';
import { useBooks } from './hooks/useBooks.js';
import { BookForm } from './components/BookForm.jsx';
import { BookList } from './components/BookList.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { CountsSummary } from './components/CountsSummary.jsx';
import { ConfirmDialog } from './components/ConfirmDialog.jsx';
import { sortBooks } from './utils/sortBooks.js';
import { filterBooks } from './utils/filterBooks.js';
import { countByStatus } from './utils/countByStatus.js';
import { STATUSES } from './config/constants.js';

export default function App() {
  const { books, addBook, updateBookStatus, deleteBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookToDelete, setBookToDelete] = useState(null);

  const counts = countByStatus(books);
  const sortedBooks = sortBooks(books);
  const displayedBooks = filterBooks(sortedBooks, searchQuery, statusFilter);
  const isSearching = Boolean(searchQuery.trim()) || statusFilter !== 'all';

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      await deleteBook(bookToDelete.id);
      setBookToDelete(null);
    }
  };

  return (
    <main className="min-h-screen bg-cream py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-7 sm:space-y-8">
        {/* Header */}
        <header className="border-b border-border/80 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-bold tracking-tight">
                Book<span className="text-gold">Shelf</span>
              </h1>
              <p className="text-muted mt-1 text-sm sm:text-base">
                Track your reading journey with care and clarity.
              </p>
            </div>
            <div className="text-xs text-muted/80 self-start sm:self-auto font-medium">
              Curated reading queue
            </div>
          </div>
        </header>

        {/* Counts row */}
        <CountsSummary
          counts={counts}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {/* Add-book form card */}
        <BookForm onAddBook={addBook} />

        {/* Toolbar & Books section */}
        <div className="space-y-5 pt-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-ink font-semibold">
                Your <span className="text-gold">Collection</span>
              </h2>
              {statusFilter !== 'all' && (
                <p className="text-xs text-muted mt-0.5">
                  Filtered by:{' '}
                  <span className="font-medium text-ink">
                    {STATUSES.find(s => s.value === statusFilter)?.label || statusFilter}
                  </span>{' '}
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className="text-gold hover:underline ml-1 cursor-pointer"
                  >
                    (Reset filter)
                  </button>
                </p>
              )}
            </div>

            {/* Toolbar with search and filter chips */}
            {books.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                {/* Search bar */}
                <div className="w-full sm:w-64">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                  />
                </div>

                {/* Status filter chips for quick filtering */}
                <div
                  className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
                  role="group"
                  aria-label="Filter books by status chips"
                >
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    aria-pressed={statusFilter === 'all'}
                    className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold ${
                      statusFilter === 'all'
                        ? 'bg-ink text-white shadow-sm ring-2 ring-ink/20'
                        : 'bg-white text-muted hover:text-ink border border-border hover:bg-cream'
                    }`}
                  >
                    All
                  </button>
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatusFilter(s.value)}
                      aria-pressed={statusFilter === s.value}
                      className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold ${
                        statusFilter === s.value
                          ? 'bg-ink text-white shadow-sm ring-2 ring-ink/20'
                          : 'bg-white text-muted hover:text-ink border border-border hover:bg-cream'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <BookList
            books={displayedBooks}
            onStatusChange={updateBookStatus}
            onDeleteRequest={setBookToDelete}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            statusLabel={STATUSES.find(s => s.value === statusFilter)?.label || ''}
            onClearSearch={() => setSearchQuery('')}
            onResetFilter={() => setStatusFilter('all')}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(bookToDelete)}
        title="Delete Book"
        message={
          bookToDelete
            ? `Are you sure you want to remove "${bookToDelete.title}" by ${bookToDelete.author} from your shelf? This action cannot be undone.`
            : ''
        }
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Book"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setBookToDelete(null)}
      />
    </main>
  );
}




