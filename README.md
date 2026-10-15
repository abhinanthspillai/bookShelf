# BookShelf — Personal Book Tracker

> **Live demo:** https://bookshelf20.netlify.app

A small, clean **Book Tracker** web app built with React 18, Vite and Tailwind CSS. It has a warm, editorial look inspired by modern literary publications and dashboards. BookShelf lets readers keep a reading list, update each book's status, and search their collection.

---

## Features

- **Add Books**: Add books with a required `Title` and `Author` and a `Status` (defaulting to `"To read"`).
- **Inline Accessible Validation**:
  * Empty or whitespace-only inputs show a helpful message directly beneath the field (`"Please enter a title"` and `"Please enter an author"`).
  * Messages clear as the user types.
  * The form uses `aria-invalid`, `aria-describedby` and `aria-live="polite"` for screen readers.
- **Strict Status Lifecycle**: Statuses are exactly `"To read"`, `"Reading"` and `"Finished"`, shown as colour-coded badges (slate for *To read*, gold for *Reading*, green for *Finished*).
- **Newest-First Ordering**: New books appear at the top of the collection. Each card shows the date the book was added.
- **Instant Search**: Case-insensitive partial matching on title and author, with separate empty states for an empty collection and for a search with no match.
- **Status Filtering**: Filter the list with the chips beside the search box or with the summary cards. Both share one filter state and work together with the search text.
- **Immediate Status Changes**: Change a book's status from its card with a custom, keyboard-accessible dropdown. Badges and counts update instantly.
- **Deletion with Confirmation**: Delete books through a keyboard-accessible confirmation dialog.
- **Reading Counts Summary**: Live tally cards and a readable overview (`"3 finished, 2 reading, 1 to read"`) with correct singular/plural and zero-count handling.
- **Generated Covers**: Gradient cover tiles with the book's initials, tinted from the title so a book always keeps the same colour.
- **Local Storage Persistence**: Books are saved in the browser under the key `booktracker:v1` and survive a refresh.
- **Fault-Tolerant Storage**: Missing or corrupted `localStorage` data (invalid JSON, non-array values, null items) falls back to an empty list instead of crashing the app.
- **Responsive Layout**: Designed for phones first, with touch targets of at least 44px and no horizontal scrolling.

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Test Runner**: [Vitest](https://vitest.dev/) with `jsdom`
- **Typography**: Google Fonts (*DM Serif Display* and *Inter*)

---

## Getting Started

### Prerequisites

- Node.js `18.0.0` or higher
- npm `9.0.0` or higher

### Installation

```
# Clone the repository
git clone https://github.com/abhinanthspillai/bookShelf.git

# Enter project directory
cd bookShelf

# Install dependencies
npm install
```

### Development Server

```
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Unit Tests

```
npm test
```

For watch mode during development:

```
npm run test:watch
```

### Production Build

```
npm run build
```

Preview the production build locally:

```
npm run preview
```

---

## Deployment

The app is deployed on Netlify as a static site. The settings live in `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`

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
│   │   ├── formatAddedDate.js       # Pure function for the "Added" date on cards
│   │   ├── coverTint.js             # Pure function mapping a title to a cover colour
│   │   └── __tests__/
│   │       ├── validateBook.test.js
│   │       ├── filterBooks.test.js
│   │       ├── sortBooks.test.js
│   │       └── countByStatus.test.js
│   ├── components/
│   │   ├── BookForm.jsx             # Add book form with inline validation
│   │   ├── BookList.jsx             # Responsive book grid and empty states
│   │   ├── BookCard.jsx             # Book card with cover tile, added date & status changer
│   │   ├── SearchBar.jsx            # Search input with clear button
│   │   ├── StatusBadge.jsx          # Colour-coded status badge (slate/gold/green)
│   │   ├── StatusSelect.jsx         # Custom accessible status dropdown
│   │   ├── CountsSummary.jsx        # Summary cards (also act as filters) and readout
│   │   ├── EmptyState.jsx           # Friendly empty and search-empty states
│   │   └── ConfirmDialog.jsx        # Accessible deletion confirmation modal
│   ├── App.jsx                      # Main application page layout
│   ├── main.jsx                     # React DOM entry point
│   └── index.css                    # Base Tailwind and theme styles
├── index.html                       # HTML5 template with Google Fonts
├── netlify.toml                     # Netlify build settings
├── tailwind.config.js               # Theme colours, typography and shadows
├── vite.config.js                   # Vite and Vitest configuration
└── package.json
```

---

## Architecture Decisions

### 1. Repository Pattern

Data access is separated from presentation and state logic through the **Repository Pattern**:

- `BookRepository` (`src/repositories/bookRepository.js`) is the interface contract. It defines asynchronous CRUD operations (`getAll`, `create`, `update`, `remove`).
- `LocalStorageRepository` (`src/repositories/localStorageRepository.js`) implements that interface with browser `localStorage`, defensive JSON parsing and UUID generation.
- `src/repositories/index.js` exports the active repository instance (`bookRepository`).

#### How to Swap in a Backend (REST API / GraphQL / Supabase)

1. Create a new repository implementation, for example `src/repositories/apiRepository.js`:

```
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

```
- import { localStorageRepository } from './localStorageRepository.js';
- export const bookRepository = localStorageRepository;
+ import { apiBookRepository } from './apiRepository.js';
+ export const bookRepository = apiBookRepository;
```

3. No UI component or hook needs to change. `useBooks.js` and the components only use the repository interface.

### 2. Pure Utility Functions

Core logic (validation, filtering, sorting, counting, formatting) lives in stateless pure functions under `src/utils/`. This means:

- Each function can be unit tested in isolation, without mocking the DOM or React.
- Nothing is mutated (for example, `sortBooks` uses `[...books].sort(...)` and leaves the original array alone).

### 3. Component Hierarchy & Accessibility

- Components never touch `localStorage` directly.
- Form inputs and buttons keep a minimum 44px touch target.
- Error messages use `role="alert"` and `aria-live="polite"`.
- Modals close on `Escape` and use `aria-modal="true"`.

---

## Built with AI

I built this project with AI assistance for the 2026 mini product assessment. I used Claude to plan the app and write prompts, and Antigravity to generate the code. I tested the result by hand and fixed problems with follow-up prompts, one commit per change.

The five prompts that mattered most, plus one time the AI got something wrong and how I fixed it, are in [PROMPTS.md](PROMPTS.md).

---

## Assumptions

- Users have a modern browser with ES2020+ and `localStorage` support.
- Client-side IDs use `crypto.randomUUID()` with a safe fallback.
- A book's `id` and `createdAt` never change once created.

---

## Limitations

- Data lives in the browser's `localStorage`, so it is limited by the browser's storage quota (about 5MB) and stays on one device.
- There is no authentication or sync, so data does not carry over between browsers or devices.
- Search and sorting run in memory on the client, which suits typical reading lists.

---

