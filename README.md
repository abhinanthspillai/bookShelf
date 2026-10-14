# BookShelf — Personal Book Tracker

> Live demo: <add link>

A small, polished, bug-free **Book Tracker** web application built with React 18, Vite, and Tailwind CSS. Designed with a warm, editorial aesthetic inspired by modern literary publications and dashboards, BookShelf lets readers organize their reading queue, track status updates, and search across their collection seamlessly.

---

## Features

- **Add Books**: Add books with required `Title`, `Author`, and `Status` (defaulting to `"To read"`).
- **Inline Accessible Validation**: 
  - Empty or whitespace-only inputs trigger immediate helpful error messages directly beneath the respective inputs (`"Please enter a title"` and `"Please enter an author"`).
  - Validation messages clear dynamically as the user types.
  - Form validation utilizes `aria-invalid`, `aria-describedby`, and `aria-live="polite"` for screen readers.
- **Strict Status Lifecycle**: Statuses are strictly `"To read"`, `"Reading"`, and `"Finished"`, visually identified by editorial color-coded badges (Slate for *To read*, Gold for *Reading*, Emerald for *Finished*).
- **Newest-First Ordering**: Newly created books immediately appear at the top of the collection list.
- **Instant Search**: Case-insensitive partial matching across book titles and authors. Features distinct empty states for an empty collection vs. search results without a match.
- **Immediate Status Changing**: Change reading statuses directly from any book card using an accessible dropdown control; badges and count metrics update instantaneously.
- **Deletion with Confirmation**: Delete books safely with a focused, keyboard-accessible confirmation dialog modal.
- **Reading Counts Summary**: Real-time tally cards and a formatted reading overview (`"3 finished, 2 reading, 1 to read"`) with correct singular/plural and zero-count handling.
- **Local Storage Persistence**: Persists books safely across browser refreshes under key `booktracker:v1`.
- **Fault-Tolerant Storage**: Safely handles missing or corrupted `localStorage` payloads (invalid JSON, non-array structures, or null items) with automatic fallbacks to prevent crashes.
- **Responsive & Mobile-First**: Crafted with minimum 44px touch targets, zero horizontal scrolling, high-contrast typography, and smooth micro-interactions.

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Test Runner**: [Vitest](https://vitest.dev/) with `jsdom`
- **Typography**: Google Fonts (*DM Serif Display* & *Inter*)

---

## Getting Started

### Prerequisites
- Node.js `18.0.0` or higher
- npm `9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/abhinanthspillai/bookShelf.git

# Enter project directory
cd bookShelf

# Install dependencies
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Unit Tests

Run the Vitest test suite:

```bash
npm test
```

For watch mode during development:

```bash
npm run test:watch
```

### Production Build

Build static assets ready for deployment:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Folder Structure

```
bookShelf/
├── src/
│   ├── config/
│   │   └── constants.js             # STATUSES, DEFAULT_STATUS, STORAGE_KEY
│   ├── repositories/
│   │   ├── bookRepository.js        # Interface contract (getAll, create, update, remove)
│   │   ├── localStorageRepository.js# Safe JSON parsing & localStorage CRUD
│   │   ├── index.js                 # Exports active repository (swap point for API backend)
│   │   └── __tests__/
│   │       └── localStorageRepository.test.js
│   ├── hooks/
│   │   └── useBooks.js              # State management & repository CRUD orchestration
│   ├── utils/
│   │   ├── validateBook.js          # Pure function for title/author validation
│   │   ├── filterBooks.js           # Pure function for title/author/status search
│   │   ├── sortBooks.js             # Pure function for newest-first sorting
│   │   ├── countByStatus.js         # Pure function for status tallies & summary formatting
│   │   └── __tests__/
│   │       ├── validateBook.test.js
│   │       ├── filterBooks.test.js
│   │       ├── sortBooks.test.js
│   │       └── countByStatus.test.js
│   ├── components/
│   │   ├── BookForm.jsx             # Add book form with inline validation
│   │   ├── BookList.jsx             # Responsive book grid and empty states
│   │   ├── BookCard.jsx             # Editorial book card with gradient tile & status changer
│   │   ├── SearchBar.jsx            # Search input with clear button
│   │   ├── StatusBadge.jsx          # Color-coded status badge (slate/gold/green)
│   │   ├── StatusSelect.jsx         # Accessible 44px+ status select dropdown
│   │   ├── CountsSummary.jsx        # Stats overview cards and summary readout
│   │   ├── EmptyState.jsx           # Friendly empty and search-empty illustrations
│   │   └── ConfirmDialog.jsx        # Accessible deletion confirmation modal
│   ├── App.jsx                      # Main application page layout
│   ├── main.jsx                     # React DOM entry point
│   └── index.css                    # Base Tailwind and editorial theme styles
├── index.html                       # HTML5 template with Google Fonts
├── tailwind.config.js               # Editorial theme colors, typography, and shadows
├── vite.config.js                   # Vite and Vitest configuration
└── package.json
```

---

## Architecture Decisions

### 1. Repository Pattern
To maintain high cohesion and decoupling, data access is separated from presentation and state logic through the **Repository Pattern**:
- `BookRepository` (`src/repositories/bookRepository.js`) acts as an explicit abstract interface contract defining asynchronous CRUD operations (`getAll`, `create`, `update`, `remove`).
- `LocalStorageRepository` (`src/repositories/localStorageRepository.js`) implements this interface using browser `localStorage` with defensive JSON parsing, error boundaries, and UUID generation.
- `src/repositories/index.js` exports the active repository singleton instance (`bookRepository`).

#### How to Swap in a Backend (REST API / GraphQL / Supabase)
To transition from client-side `localStorage` to a remote server or database backend:
1. Create a new repository implementation class, for example `src/repositories/apiRepository.js`:
   ```javascript
   import { BookRepository } from './bookRepository.js';

   export class ApiBookRepository extends BookRepository {
     async getAll() {
       const res = await fetch('/api/books');
       return res.json();
     }
     async create(bookData) {
       const res = await fetch('/api/books', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(bookData),
       });
       return res.json();
     }
     async update(id, updates) {
       const res = await fetch(`/api/books/${id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(updates),
       });
       return res.json();
     }
     async remove(id) {
       await fetch(`/api/books/${id}`, { method: 'DELETE' });
     }
   }

   export const apiBookRepository = new ApiBookRepository();
   ```
2. In `src/repositories/index.js`, change a single line:
   ```diff
   - import { localStorageRepository } from './localStorageRepository.js';
   - export const bookRepository = localStorageRepository;
   + import { apiBookRepository } from './apiRepository.js';
   + export const bookRepository = apiBookRepository;
   ```
3. **Zero UI components or hooks require modification**. `useBooks.js` and all React components remain 100% untouched because they consume the abstract `BookRepository` interface.

### 2. Pure Utility Functions
All core business logic (validation, filtering, sorting, counting) resides in stateless pure functions under `src/utils/`. This guarantees:
- 100% test coverage with isolated unit tests without mocking DOM or React internals.
- Immutability guarantees (e.g. `sortBooks` uses `[...books].sort(...)` without mutating state).

### 3. Component Hierarchy & Accessibility
- Components never touch `localStorage` directly.
- All form inputs and buttons enforce a minimum 44px by 44px bounding box to satisfy WCAG touch target guidelines.
- Dynamic error messaging uses `role="alert"` and `aria-live="polite"`.
- Modals trap focus, close on `Escape`, and manage `aria-modal="true"`.

---

## Assumptions

- Users operate modern web browsers supporting ES2020+ and `localStorage`.
- Client-side UUID generation uses `crypto.randomUUID()` with a safe pseudo-random fallback.
- Book identifiers (`id`) and timestamps (`createdAt`) are immutable once created.

---

## Limitations

- Data is stored in browser `localStorage`, limited by origin storage quotas (~5MB) and device isolation.
- Without backend authentication or WebSockets, data does not synchronize across multiple separate devices or browsers.
- Real-time search and sorting occur client-side in memory; suitable for typical reading lists (up to thousands of books).

---

## License

MIT © [Abhinanth S Pillai](https://github.com/abhinanthspillai)
