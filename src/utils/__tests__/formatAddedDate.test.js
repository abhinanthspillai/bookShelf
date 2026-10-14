import { describe, it, expect } from 'vitest';
import { formatAddedDate, formatFullDateTime } from '../formatAddedDate.js';

describe('formatAddedDate utility', () => {
  it('formats an ISO date string correctly (e.g. "Added 15 Oct 2026")', () => {
    // 12:00 UTC on 15 Oct 2026 remains 15 Oct 2026 across almost all timezones
    const isoString = '2026-10-15T12:00:00.000Z';
    const result = formatAddedDate(isoString);

    expect(result).toBe('Added 15 Oct 2026');
  });

  it('formats a numeric timestamp correctly', () => {
    const timestamp = new Date('2026-10-15T12:00:00.000Z').getTime();
    const result = formatAddedDate(timestamp);

    expect(result).toBe('Added 15 Oct 2026');
  });

  it('formats a numeric string timestamp correctly', () => {
    const timestamp = String(new Date('2026-10-15T12:00:00.000Z').getTime());
    const result = formatAddedDate(timestamp);

    expect(result).toBe('Added 15 Oct 2026');
  });

  it('returns null when createdAt is missing, null, undefined, or empty', () => {
    expect(formatAddedDate(null)).toBeNull();
    expect(formatAddedDate(undefined)).toBeNull();
    expect(formatAddedDate('')).toBeNull();
    expect(formatAddedDate()).toBeNull();
  });

  it('returns null and does not crash when createdAt is invalid', () => {
    expect(formatAddedDate('not-a-date')).toBeNull();
    expect(formatAddedDate('2026-99-99')).toBeNull();
    expect(formatAddedDate({})).toBeNull();
    expect(formatAddedDate(NaN)).toBeNull();
  });

  describe('formatFullDateTime', () => {
    it('returns full date and time string for valid dates', () => {
      const isoString = '2026-10-15T12:00:00.000Z';
      const result = formatFullDateTime(isoString);

      expect(typeof result).toBe('string');
      expect(result).toContain('2026');
      expect(result).toContain('October');
    });

    it('returns null for missing or invalid dates', () => {
      expect(formatFullDateTime(null)).toBeNull();
      expect(formatFullDateTime('invalid')).toBeNull();
    });
  });
});
