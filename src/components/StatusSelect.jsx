import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { STATUSES } from '../config/constants.js';

const STATUS_DOT_COLORS = {
  'to-read': 'bg-slate-400',
  'reading': 'bg-[#B8812E]',
  'finished': 'bg-emerald-500',
};

/**
 * StatusSelect component implementing the accessible ARIA listbox pattern.
 * Custom styled dropdown with editorial design matching the app's palette.
 */
export function StatusSelect({
  id = 'book-status',
  value,
  onChange,
  ariaLabel = 'Select reading status',
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);

  const currentStatus = STATUSES.find(s => s.value === value) || STATUSES[0];
  const currentDotColor = STATUS_DOT_COLORS[currentStatus.value] || 'bg-slate-400';

  const checkPlacement = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedMenuHeight = 160; // 3 items of min 44px + padding

    // Open upward if there is not enough room below and more room above
    if (spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow) {
      setOpenUpward(true);
    } else {
      setOpenUpward(false);
    }
  }, []);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    checkPlacement();
    setIsOpen(true);
    const currentIndex = STATUSES.findIndex(s => s.value === value);
    setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
  }, [disabled, value, checkPlacement]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [isOpen, openDropdown, closeDropdown]);

  const handleSelect = useCallback((newValue) => {
    onChange(newValue);
    closeDropdown();
    triggerRef.current?.focus();
  }, [onChange, closeDropdown]);

  // Outside click & escape handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDropdown]);

  // Keyboard navigation on trigger button and listbox
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDropdown();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        checkPlacement();
        setIsOpen(true);
        const currentIndex = STATUSES.findIndex(s => s.value === value);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : STATUSES.length - 1);
      }
      return;
    }

    // Menu is open
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % STATUSES.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + STATUSES.length) % STATUSES.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(STATUSES.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < STATUSES.length) {
        handleSelect(STATUSES[focusedIndex].value);
      }
    } else if (e.key === 'Tab') {
      closeDropdown();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full ${isOpen ? 'z-30' : ''}`}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        aria-label={ariaLabel}
        aria-activedescendant={
          isOpen && focusedIndex >= 0 ? `${id}-option-${STATUSES[focusedIndex].value}` : undefined
        }
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white border border-border rounded-xl text-ink font-medium
          flex items-center justify-between gap-2 shadow-sm hover:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold
          transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <span className="flex items-center gap-2 truncate">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${currentDotColor}`}
            aria-hidden="true"
          />
          <span className="truncate">{currentStatus.label}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Opened Listbox Menu */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={`${id}-listbox`}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          className={`absolute left-0 right-0 z-50 bg-white rounded-card border border-border shadow-lift p-1.5 min-w-[170px] animate-fade-in ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
        >
          {STATUSES.map((status, index) => {
            const isSelected = status.value === value;
            const isHighlighted = index === focusedIndex;
            const dotColor = STATUS_DOT_COLORS[status.value] || 'bg-slate-400';

            return (
              <li
                key={status.value}
                id={`${id}-option-${status.value}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(status.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  isHighlighted
                    ? 'bg-gold-subtle text-ink'
                    : isSelected
                    ? 'bg-cream/60 text-ink'
                    : 'text-ink hover:bg-gold-subtle'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{status.label}</span>
                </div>

                {isSelected && (
                  <Check
                    className="w-4 h-4 text-gold flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default StatusSelect;
