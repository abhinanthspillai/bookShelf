import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusSelect } from '../StatusSelect.jsx';

describe('StatusSelect component', () => {
  it('renders closed trigger button with selected status label and aria attributes', () => {
    render(
      <StatusSelect
        id="test-status"
        value="to-read"
        onChange={vi.fn()}
        ariaLabel="Select book status"
      />
    );

    const button = screen.getByRole('button', { name: 'Select book status' });
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.textContent).toContain('To read');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('opens listbox on click and allows selecting an option', () => {
    const handleChange = vi.fn();
    render(
      <StatusSelect
        id="test-status"
        value="to-read"
        onChange={handleChange}
        ariaLabel="Select book status"
      />
    );

    const button = screen.getByRole('button', { name: 'Select book status' });
    fireEvent.click(button);

    expect(button.getAttribute('aria-expanded')).toBe('true');
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeDefined();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0].textContent).toContain('To read');
    expect(options[1].textContent).toContain('Reading');
    expect(options[2].textContent).toContain('Finished');

    // Click "Finished"
    fireEvent.click(options[2]);

    expect(handleChange).toHaveBeenCalledWith('finished');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('supports keyboard navigation (ArrowDown, Enter, Escape)', () => {
    const handleChange = vi.fn();
    render(
      <StatusSelect
        id="test-status"
        value="to-read"
        onChange={handleChange}
        ariaLabel="Select book status"
      />
    );

    const button = screen.getByRole('button', { name: 'Select book status' });

    // Open via ArrowDown
    fireEvent.keyDown(button, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeDefined();

    // Move to next item ("Reading")
    fireEvent.keyDown(button, { key: 'ArrowDown' });

    // Select via Enter
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith('reading');
    expect(screen.queryByRole('listbox')).toBeNull();

    // Open again and close with Escape
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeDefined();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('closes when clicking outside the dropdown', () => {
    render(
      <div>
        <div data-testid="outside">Outside area</div>
        <StatusSelect
          id="test-status"
          value="to-read"
          onChange={vi.fn()}
        />
      </div>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeDefined();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
