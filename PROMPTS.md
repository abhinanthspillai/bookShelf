# PROMPTS.md: how I built BookShelf with AI

**Tools:** Claude for planning, writing prompts and reviewing my work; Antigravity for generating the code.

**Process:** I planned first, built second, and then tested the result by hand. The build itself came from one structured prompt, with the brief's example behaviours written in as acceptance checks. Everything after that was a small, targeted prompt with one commit per change. I started with a larger plan (landing page, detail page, routing) and cut it back to the brief's scope once I had read it.

These are my five most important prompts, in the order I used them. For each prompt below I note what I asked for and what came back.

---

## Prompt 1: Plan the app before I had the brief

**Goal:** Understand what a book tracker needs and decide how to build it.

Original text (typos included):

```text
I need to build a book tacker web app for a technical round for an intership,

Act as an experienced web developer and help me build a winning app.

Task - we need to create a book tracker web app , for that we need to find the requirements for a book tracker app and plan the implementation.
```

**What happened:** I got a requirements list split into must-have, should-have and stretch features, plus an implementation plan. I chose React, Vite and Tailwind, and decided to keep all storage behind a repository layer so that localStorage can later be swapped for a backend by changing one file.

---

## Prompt 2: Build the app

**Goal:** Generate the whole app in the brief's scope, with the brief's own examples as acceptance checks.

```text
You are a senior front-end engineer. Build a small, polished, bug-free "Book Tracker" web app and push it to this GitHub repository:
https://github.com/abhinanthspillai/book-tracker-webapp

FIRST, inspect the repository. If it is empty, build from scratch. If it already contains code from an earlier, larger attempt, REMOVE everything outside this scope (landing page, routing, detail page, sidebar, stats dashboard, extra fields) and refactor to the scope below. Keep the commit history intact; never force-push.

## Scope (this is a short assessment, so do NOT add anything beyond it)
Single page. Users keep a list of books they want to read.

### Must-have
1. Add a book with title, author, and status. Statuses are EXACTLY: "To read", "Reading", "Finished" (default "To read"). Title and author are required.
2. Validation: empty title shows the message "Please enter a title" directly under the title input; empty author shows "Please enter an author" under the author input. Trim whitespace, so "   " counts as empty. Clear the errors as the user types. Nothing is added when invalid.
3. Show the list of books, NEWEST FIRST (a newly added book appears at the top).
4. Search by title or author: case-insensitive, matches partial text, updates as the user types. Show a friendly "No books match your search" state, and a separate empty state when there are no books at all.
5. Change a book's status from the list (a select or segmented control on each book); the status label updates immediately.
6. Data persists across page refresh using localStorage.

### Optional extras (all required in this build)
7. Delete a book (with a confirmation).
8. Counts summary, e.g. "3 finished, 2 reading, 1 to read" (computed from real data, correct singular/plural handling and zero counts).
9. A layout that works well on a phone (mobile-first, no horizontal scroll, touch targets at least 44px).

## Acceptance checks (verify each manually and where possible with tests)
- Add "Aadujeevitham" by Benyamin with status To read -> appears at the top with a "To read" label
- Click Add with an empty title -> "Please enter a title" appears under the title box
- Type "ben" in search -> only books with "ben" in the title or author remain visible
- Change a book's status to Finished -> label changes to "Finished", counts update
- Refresh -> all books and statuses are still there
- Corrupted or missing localStorage data must not crash the app (fall back to an empty list)

## Tech stack
React 18 + Vite (JavaScript) and Tailwind CSS, with Vitest for tests. Single page, no router, no backend.

## Architecture (keep it small and clean)
src/
  config/constants.js        // STATUSES = [{ value: "to-read", label: "To read" }, { value: "reading", label: "Reading" }, { value: "finished", label: "Finished" }]
  repositories/
    bookRepository.js        // documents the interface: getAll, create, update, remove (async)
    localStorageRepository.js // key "booktracker:v1", safe JSON parsing
    index.js                 // exports the active repository (so a REST API repository could replace it later by changing this one file)
  hooks/useBooks.js          // all state + CRUD; the only place that uses the repository
  utils/ (filterBooks.js, sortBooks.js, countByStatus.js, validateBook.js)   // pure functions
  components/ (BookForm, BookList, BookCard, SearchBar, StatusSelect, StatusBadge, CountsSummary, EmptyState, ConfirmDialog)
  App.jsx, main.jsx
Book = { id (crypto.randomUUID), title, author, status, createdAt (ISO or timestamp) }
Rules: components never touch localStorage; business logic stays in pure functions in utils/.

## Design (adapt the visual feel from the attached reference images; copy NO text, brand names, photos or numbers from them)
Warm and editorial: background cream #FAF6EE; surface white; ink #1C1A17; muted #6B645A; border #E8E0D2; accent gold #B8812E. Headings in a serif (Playfair Display or DM Serif Display) with ONE key word highlighted in gold; body in Inter. Rounded cards (16px), pill buttons (primary = dark ink), soft shadows, subtle hover lift, status badges (To read = slate, Reading = gold, Finished = green). Layout inspired by the dashboard reference: header with title and subtitle, a counts row, add-book form card, toolbar with search (and optional status filter chips), then a responsive card grid of books (1 column on phones). Generated gradient book-cover tiles are allowed, but no external photos. Accessible: labels, focus rings, aria-live for validation messages, keyboard operable, AA contrast.

## Testing
Vitest unit tests for validateBook, filterBooks, sortBooks (newest first), countByStatus, and localStorageRepository (including corrupted data). `npm test` must pass.

## Git workflow (STRICT)
- Repository: https://github.com/abhinanthspillai/book-tracker-webapp. Use branch `main` and remote `origin`.
- Add a proper .gitignore (node_modules, dist, .env, OS/editor files) BEFORE the first commit.
- Push ONLY meaningful commits: one logical, working change each, with Conventional Commits messages, e.g. "chore: scaffold Vite React Tailwind project", "feat: add localStorage book repository", "feat: add book form with validation", "feat: list books newest first", "feat: add search by title or author", "feat: change book status", "feat: add delete and status counts", "style: apply responsive design system", "test: add unit tests for utils".
- No "wip", "update", "fix stuff", "changes" or "final" commits; no giant single commit. Never commit node_modules, build output, .env files or secrets (the repo is public).
- Commit and push after each completed step, with the app working at every commit. Never force-push. If a push fails, stop and tell me exactly what is needed.

## Deployment readiness
Make sure `npm run build` produces a working static site that can be deployed on Vercel or Netlify with zero extra configuration.

## Documentation
LAST step: write README.md with a short overview, features, tech stack, how to run/test/build, folder structure, an "Architecture decisions" section (repository pattern and how to swap in a backend), assumptions, limitations, and a placeholder line "Live demo: <add link>". Commit as "docs: add README" and push.

## Definition of done
`npm install && npm run dev` works; `npm run build` and `npm test` pass; no console errors; every acceptance check above passes; everything is pushed to `main` with a clean, meaningful commit history. Finish with a short report of what you built and anything you could not complete.
```

**What happened:** I attached three reference designs for visual direction and told the agent to adapt the layout and style but not copy any text or branding. The app came out with every must-have plus delete, the counts summary and a phone layout. The agent built it as ten small commits on 14 October, in the order the prompt asked for: project scaffold, localStorage repository, add-book form with validation, newest-first list, search, status change, delete and counts, responsive design system, unit tests, and README. I tested the result against the brief's example table before accepting it.

---

## Prompt 3: Replace the status dropdown

**Goal:** Make the status control match the app's design instead of the browser default.

```text
The status dropdown on each book card (src/components/StatusSelect.jsx) uses a native <select>. Its opened option list uses the browser's default styling (blue highlight, square corners) and does not match the app's design.

Replace it with a custom dropdown that follows the app's design system, as a small, contained change:
- Keep the same component name, props and behavior, so BookCard and everything else stay unchanged. Statuses still come from src/config/constants.js: "To read", "Reading", "Finished".
- Trigger button: same look as the current select (pill shape, cream surface, border, gold focus ring), showing the current status, with a chevron that rotates when open.
- Opened menu: white card with rounded corners (about 12-16px), thin border, soft shadow, small gap below the button. Each option has a small status dot matching the badge colors (slate, gold, green), a hover/focus background in the soft accent tone (not browser blue), and a check mark on the selected option.
- Behavior: click to open/close; clicking an option selects it, closes the menu and updates the status immediately (badge and counts update as before); close on outside click and on Escape.
- Accessibility: use the ARIA listbox pattern (button with aria-haspopup="listbox" and aria-expanded, menu role="listbox", options role="option" with aria-selected); keyboard support for Enter/Space to open, Arrow Up/Down to move, Enter to select, Escape to close, Tab to leave; visible focus states; touch targets at least 44px.
- The menu must not be clipped by the card (check the last card in the list and narrow phone widths) and should open upward if there is no room below.
- Do not change any other behavior. Run `npm test` and `npm run build` and make sure both pass; add a small component test for selecting an option and for keyboard navigation.
- Commit as one meaningful commit, e.g. "feat: replace native status select with styled accessible dropdown", and push.
```

**What happened:** The opened list showed the browser's default blue highlight and square corners, which clashed with the rest of the app. I asked for a custom accessible dropdown that keeps the same props, so no other component had to change. The prompt also required checks for clipping on the last card and on narrow screens. Commit: `feat: replace native status select with styled accessible dropdown`.

---

## Prompt 4: Polish after testing (one prompt, four steps, one commit each)

**Goal:** Fix the gaps I found while using the finished app.

```text
You are working on the existing "BookShelf" Book Tracker app (React + Vite + Tailwind, repo: https://github.com/abhinanthspillai/bookShelf). Do NOT rebuild anything. Apply the four small improvements below, in the order given, as separate steps. Keep the existing design system (warm cream background, gold accent, serif headings, pill buttons, soft rounded cards) and do not change any other behavior.

## Rules for every step
- Do NOT modify src/components/StatusSelect.jsx or its tests: the status dropdown is being handled separately. If your changes touch BookCard.jsx, leave the StatusSelect usage as it is. Before starting, pull the latest `main` so you build on top of any recent commits.
- Before each step, read the relevant existing files and follow the current code style, folder structure and the repository pattern (components never touch localStorage; business logic in pure functions under src/utils/).
- After each step, run `npm test` and `npm run build`. Both must pass before you commit.
- ONE meaningful commit per step using Conventional Commits, then push to `main`. No "wip", "update" or "fix stuff" commits, no giant commit, no force-push. Never commit node_modules, dist, .env or secrets. If a push fails, stop and tell me what is needed.
- Add or update unit tests for any new pure function or changed behavior.
- Newest-first ordering, search, status changes, delete and persistence across refresh must keep working exactly as they do now.

## Step 1: Show the added date on each book card
- In src/components/BookCard.jsx, show "Added 15 Oct 2026" (day, short month, year) as a small muted line under the author (or in the footer, wherever fits the layout best), using the existing createdAt field.
- Put the full date and time in the element's title attribute as a tooltip.
- Implement formatting as a pure function in src/utils/formatAddedDate.js. If createdAt is missing or invalid, render nothing and do not crash.
- Unit tests: valid timestamp, ISO string, missing, invalid.
- Do not change the data model, storage or sorting.
- Commit: "feat: show added date on book cards"

## Step 2: Make the summary cards and filter chips one consistent control
The summary cards (All Books / To read / Reading / Finished) and the filter chips beside the search box both filter the list.
- Use ONE shared filter state so clicking a card or a chip always highlights BOTH the matching card and the matching chip and filters the list identically.
- Cards must look and act clickable: pointer cursor, subtle hover lift, a clear selected state (the current dark border is fine), and a visible keyboard focus ring.
- Render the cards as buttons with aria-pressed reflecting the selected state; Enter and Space activate them.
- Filtering must work together with the search text. Empty states must stay correct (e.g. "no books in Reading" vs "no search match").
- Keep touch targets at least 44px.
- Commit: "feat: sync summary cards and filter chips with shared filter state"

## Step 3: Placeholder copy and contrast
- Remove the trailing period: the search placeholder reads "Search by title or author".
- Make all input placeholders (search, title, author) more readable on the cream background: use a muted color with at least 4.5:1 contrast against the input background, but keep them visibly lighter than typed text.
- Do not change labels, validation messages or behavior.
- Commit: "style: improve placeholder copy and contrast"

## Step 4: Vary cover tints by title
The generated cover tiles are all the same muted green.
- Create a pure function in src/utils/coverTint.js that deterministically maps a book title to one color pair from a curated palette of 6-8 harmonious, muted tones (e.g. sage, terracotta, dusty blue, mustard, plum, slate, clay), staying within the app's warm editorial design.
- Each pair has a soft background gradient and a darker initials color; initials must meet 4.5:1 contrast against the tile.
- The same title always gives the same tint; case and surrounding spaces must not change the result; empty or odd input falls back to a default tint without crashing. Compute at render time; no data model or storage changes.
- Unit tests: deterministic, case-insensitive, trimmed, empty input, palette coverage.
- Commit: "feat: vary book cover tints by title"

## Final checks
1. `npm test` and `npm run build` pass.
2. Manually verify: add two books (newest first, dates shown); change a status and refresh (it persists); click each summary card and chip (both highlight together, works with search text); check a 360px-wide window for wrapping or overflow.
3. Confirm `git log --oneline` shows four clean new commits, all pushed to `main`.
4. Finish with a short report of what changed and anything you could not complete.
```

**The three changes that mattered most:**

- **Added date on each card** (`feat: show added date on book cards`). The brief asks for newest first, but nothing on screen proved the order. With a date on every card, the ordering can be checked at a glance.
- **Summary cards and filter chips share one filter state** (`feat: sync summary cards and filter chips with shared filter state`). The cards looked clickable but duplicated the chips. They now behave as a single control, with `aria-pressed` for assistive technology.
- **Cover tints vary by title** (`feat: vary book cover tints by title`). Every cover was the same green. The tint is now computed from the title, so a book always gets the same colour, even after a refresh.

The fourth step, placeholder wording and contrast (`style: improve placeholder copy and contrast`), was a smaller change. All four commits landed with the names the prompt specified, in the order it listed them.

---

## Prompt 5: Fix the duplicate clear button and the placeholder examples

**Goal:** Fix two problems I spotted while testing the finished app (the first one is the mistake described below).

```text
You are working on the existing "BookShelf" Book Tracker app (React + Vite + Tailwind, repo: https://github.com/abhinanthspillai/bookShelf). Do NOT rebuild anything. Apply the two small fixes below as separate steps. Keep the existing design system (warm cream background, gold accent, serif headings, pill buttons, soft rounded cards) and do not change any other behavior.

## Rules
- Pull the latest `main` first so you build on top of recent commits. Do NOT modify src/components/StatusSelect.jsx or its tests.
- Read the relevant existing files first and follow the current code style, folder structure and the repository pattern.
- After each step run `npm test` and `npm run build`; both must pass before you commit.
- ONE meaningful Conventional Commit per step, then push to `main`. No "wip"/"update"/"fix stuff" commits, no force-push, never commit node_modules, dist, .env or secrets. If a push fails, stop and tell me what is needed.
- Search, filtering, adding, validation, status changes, delete, newest-first ordering and persistence across refresh must keep working exactly as they do now.

## Step 1: Replace the placeholder examples
The title and author placeholders currently use "e.g. Aadujeevitham" and "e.g. Benyamin", which copy the example from the assessment brief, and they look like real typed values.
- Change them to a common, well-known pair: Title placeholder "e.g. The Alchemist"; Author placeholder "e.g. Paulo Coelho". Keep the "e.g." prefix. Search placeholder: "Search by title or author" (no trailing period).
- Search for any other place in the UI where "Aadujeevitham" or "Benyamin" is used as visible example text and replace it the same way. Do not touch unit tests that use them as test data.
- Style placeholders so they are clearly distinguishable from typed text: a lighter muted tone that still meets at least 4.5:1 contrast against the input background, while typed text stays in the full ink color and slightly heavier. Define this once (a shared class or Tailwind theme token), not per input.
- Do not change labels, required asterisks, validation messages ("Please enter a title" / "Please enter an author") or any behavior.
- Commit: "style: use common example placeholders and clearer placeholder styling"

## Step 2: Remove the duplicate clear button in the search box
The search input shows TWO clear (x) buttons: the browser's native one (the blue x that appears for type="search") and the app's custom one in src/components/SearchBar.jsx.
- Keep the custom clear button, since it matches the app design, and hide the native one with CSS (::-webkit-search-cancel-button, ::-webkit-search-decoration and ::-webkit-search-results-button set to appearance: none and display: none; also cover Firefox/Edge/Safari behavior). Put the rule in the global stylesheet, scoped to the search input.
- The custom button must: appear only when the field has text; have aria-label="Clear search"; clear the text, return focus to the input and restore the full list when clicked; have a touch target of at least 44px; and not overlap the typed text (add right padding to the input).
- Pressing Escape inside the search field should also clear it.
- Add a component test: with text in the box exactly one clear button exists; clicking it empties the input and restores the list; Escape clears it.
- Commit: "fix: remove duplicate clear button from search input"

## Final checks
1. `npm test` and `npm run build` pass.
2. Manually verify in Chrome and Edge: type in the search box and confirm only ONE clear icon appears; clear it by click and by Escape; the placeholders show the new examples and look clearly different from typed text; the form still validates and adds books; a 360px-wide window has no overflow.
3. `git log --oneline` shows two clean new commits, pushed to `main`.
4. Finish with a short report of what changed and anything you could not complete.
```

**What happened:** In my own testing I found two problems: the search box showed two clear buttons, and the form placeholders reused the brief's own example, which looked like real typed values. This prompt fixed both, as two commits: `style: use common example placeholders and clearer placeholder styling` and `fix: remove duplicate clear button from search input`. After the new version loaded, the search box showed a single clear button.

---

## One time the AI got it wrong

**What went wrong:** The search box showed two × buttons. The AI had built its own custom clear button, but the input was `type="search"`, so the browser also drew its built-in one. A user would see two controls that do the same thing.

**How I noticed:** I typed into the search box while testing the finished app and saw two crosses side by side. The code had passed its tests and built without errors, so only using the app revealed the problem.

**How I fixed it:** I identified the cause (the native button plus the custom one) and wrote it into the prompt rather than just saying "there are two crosses". I asked the agent to keep the custom button because it matches the design, hide the native one with CSS, make Escape clear the field too, and add a test asserting that exactly one clear button exists. After the new version loaded and I refreshed the page, the search box showed a single cross.

**A smaller example:** The AI copied the brief's own example ("Aadujeevitham" by Benyamin) into the form placeholders, where it looked like real input. I replaced it with a common pair (Paulo Coelho's "The Alchemist").

**What I learned:** The AI builds what you ask for, but it doesn't use the app the way a user does. Tests and builds passing didn't catch either problem, so I click through every control myself before accepting the work, and I describe a bug's cause in the prompt instead of only its symptom.
