import { STATUSES } from '../config/constants.js';

/**
 * StatusSelect component for selecting a book's reading status.
 * Ensures minimum 44px touch target and accessible keyboard controls.
 */
export function StatusSelect({
  id = 'book-status',
  value,
  onChange,
  ariaLabel = 'Select reading status',
  className = '',
  disabled = false,
}) {
  return (
    <div className="relative inline-block w-full">
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white border border-border rounded-xl text-ink font-medium
          focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold
          transition-colors appearance-none cursor-pointer pr-10 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {STATUSES.map(status => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}

export default StatusSelect;
