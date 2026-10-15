import { describe, it, expect } from 'vitest';
import { coverTint, COVER_PALETTE } from '../coverTint.js';

describe('coverTint utility', () => {
  it('is deterministic: the same title always yields the identical tint', () => {
    const title = 'The Great Gatsby';
    const first = coverTint(title);
    const second = coverTint(title);
    const third = coverTint(title);

    expect(first).toEqual(second);
    expect(second).toEqual(third);
    expect(first.name).toBeDefined();
  });

  it('is case-insensitive: casing does not change the result', () => {
    const lower = coverTint('aadujeevitham');
    const upper = coverTint('AADUJEEVITHAM');
    const mixed = coverTint('Aadujeevitham');

    expect(lower).toEqual(mixed);
    expect(upper).toEqual(mixed);
  });

  it('is trimmed: leading and trailing spaces do not alter the result', () => {
    const clean = coverTint('1984');
    const padded = coverTint('   1984   ');

    expect(padded).toEqual(clean);
  });

  it('falls back to default tint on empty or non-string input without crashing', () => {
    const defaultTint = COVER_PALETTE[0];

    expect(coverTint('')).toEqual(defaultTint);
    expect(coverTint('   ')).toEqual(defaultTint);
    expect(coverTint(null)).toEqual(defaultTint);
    expect(coverTint(undefined)).toEqual(defaultTint);
    expect(coverTint(12345)).toEqual(defaultTint);
    expect(coverTint({})).toEqual(defaultTint);
  });

  it('covers the entire palette across diverse book titles', () => {
    const sampleTitles = [
      'Aadujeevitham',
      'The God of Small Things',
      '1984',
      'To Kill a Mockingbird',
      'Pride and Prejudice',
      'The Hobbit',
      'Brave New World',
      'The Catcher in the Rye',
      'The Alchemist',
      'One Hundred Years of Solitude',
      'Crime and Punishment',
      'War and Peace',
      'The Odyssey',
      'Jane Eyre',
      'Wuthering Heights',
      'Frankenstein',
      'Dracula',
    ];

    const coveredNames = new Set(sampleTitles.map(t => coverTint(t).name));
    expect(coveredNames.size).toBe(COVER_PALETTE.length);
  });

  it('ensures initials color meets contrast requirements against background tones', () => {
    // Contrast formula implementation to verify >= 4.5:1
    function luminance(hex) {
      const rgb = [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
      ].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));

      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    }

    function getContrast(hex1, hex2) {
      const l1 = luminance(hex1);
      const l2 = luminance(hex2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    COVER_PALETTE.forEach(paletteItem => {
      paletteItem.bgColors.forEach(bgHex => {
        const ratio = getContrast(paletteItem.textColor, bgHex);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });
  });
});
