import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar.jsx';

describe('SearchBar component', () => {
  it('does not render a clear button when input is empty', () => {
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    );

    const clearButton = screen.queryByRole('button', { name: 'Clear search' });
    expect(clearButton).toBeNull();
  });

  it('renders exactly one clear button when text is in the box', () => {
    render(
      <SearchBar
        value="Alchemist"
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    );

    const clearButtons = screen.getAllByRole('button', { name: 'Clear search' });
    expect(clearButtons).toHaveLength(1);
    expect(clearButtons[0].getAttribute('aria-label')).toBe('Clear search');
  });

  it('clicking the clear button calls onClear and restores focus to input', () => {
    const handleClear = vi.fn();
    render(
      <SearchBar
        value="Alchemist"
        onChange={vi.fn()}
        onClear={handleClear}
      />
    );

    const input = screen.getByRole('searchbox');
    const clearButton = screen.getByRole('button', { name: 'Clear search' });

    fireEvent.click(clearButton);

    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
  });

  it('pressing Escape inside the search field clears it when text is present', () => {
    const handleClear = vi.fn();
    render(
      <SearchBar
        value="Alchemist"
        onChange={vi.fn()}
        onClear={handleClear}
      />
    );

    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape when input is empty does not trigger onClear', () => {
    const handleClear = vi.fn();
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
        onClear={handleClear}
      />
    );

    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(handleClear).not.toHaveBeenCalled();
  });

  it('integration: typing filters list, clicking clear empties input and restores full list, and Escape clears it', () => {
    const allBooks = ['The Alchemist', 'Dune', '1984'];

    function SearchListIntegration() {
      const [query, setQuery] = useState('');
      const filtered = allBooks.filter(b => b.toLowerCase().includes(query.toLowerCase()));

      return (
        <div>
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => setQuery('')}
          />
          <ul data-testid="book-list">
            {filtered.map(book => (
              <li key={book}>{book}</li>
            ))}
          </ul>
        </div>
      );
    }

    render(<SearchListIntegration />);

    const input = screen.getByRole('searchbox');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    // Type "Dune"
    fireEvent.change(input, { target: { value: 'Dune' } });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Dune')).toBeDefined();

    // Exactly one clear button appears
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toBeDefined();

    // Click clear button -> empties input and restores full list
    fireEvent.click(clearButton);
    expect(input.value).toBe('');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    // Type "1984"
    fireEvent.change(input, { target: { value: '1984' } });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    // Press Escape -> empties input and restores full list
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input.value).toBe('');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
