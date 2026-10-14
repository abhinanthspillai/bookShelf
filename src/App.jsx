import { useState } from 'react';
import { useBooks } from './hooks/useBooks.js';
import { BookForm } from './components/BookForm.jsx';
import { BookList } from './components/BookList.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { sortBooks } from './utils/sortBooks.js';
import { filterBooks } from './utils/filterBooks.js';

export default function App() {
  const { books, addBook, updateBookStatus } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');

  const sortedBooks = sortBooks(books);
  const displayedBooks = filterBooks(sortedBooks, searchQuery);
  const isSearching = Boolean(searchQuery.trim());

  return (
    <main className="min-h-screen bg-cream py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-ink">
            Book<span className="text-gold">Shelf</span>
          </h1>
          <p className="text-muted mt-1 text-sm sm:text-base">
            Track your reading journey with care and clarity.
          </p>
        </header>

        <BookForm onAddBook={addBook} />

        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-serif text-xl sm:text-2xl text-ink font-semibold">
              Your <span className="text-gold">Collection</span>
            </h2>

            {/* Toolbar search */}
            {books.length > 0 && (
              <div className="w-full sm:w-72">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                />
              </div>
            )}
          </div>

          <BookList
            books={displayedBooks}
            onStatusChange={updateBookStatus}
            isSearching={isSearching}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        </div>
      </div>
    </main>
  );
}



