import { useBooks } from './hooks/useBooks.js';
import { BookForm } from './components/BookForm.jsx';
import { BookList } from './components/BookList.jsx';
import { sortBooks } from './utils/sortBooks.js';

export default function App() {
  const { books, addBook, updateBookStatus } = useBooks();

  const sortedBooks = sortBooks(books);

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

        <div className="pt-2">
          <h2 className="font-serif text-xl sm:text-2xl text-ink font-semibold mb-4">
            Your <span className="text-gold">Collection</span>
          </h2>
          <BookList
            books={sortedBooks}
            onStatusChange={updateBookStatus}
          />
        </div>
      </div>
    </main>
  );
}


