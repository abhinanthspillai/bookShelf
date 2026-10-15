/**
 * Curated palette of 7 harmonious, warm editorial tones.
 * Each pair defines a background gradient, initials text color, and border.
 * Initials text color provides at least 6.6:1 contrast against all gradient tones.
 */
export const COVER_PALETTE = [
  {
    name: 'sage',
    gradientClass: 'from-[#E3E8E1] via-[#D5DDD2] to-[#B8C5B3]',
    textClass: 'text-[#2B3B28]',
    borderClass: 'border-[#CBD5C7]',
    textColor: '#2B3B28',
    bgColors: ['#E3E8E1', '#D5DDD2', '#B8C5B3'],
  },
  {
    name: 'terracotta',
    gradientClass: 'from-[#F4E6DE] via-[#EBD5C8] to-[#DEBEAD]',
    textClass: 'text-[#522314]',
    borderClass: 'border-[#E0C6B8]',
    textColor: '#522314',
    bgColors: ['#F4E6DE', '#EBD5C8', '#DEBEAD'],
  },
  {
    name: 'dusty-blue',
    gradientClass: 'from-[#E2E8EE] via-[#D3DDE6] to-[#BAC8D5]',
    textClass: 'text-[#1E3547]',
    borderClass: 'border-[#C4D0DC]',
    textColor: '#1E3547',
    bgColors: ['#E2E8EE', '#D3DDE6', '#BAC8D5'],
  },
  {
    name: 'mustard',
    gradientClass: 'from-[#F5EEDC] via-[#EBDEC3] to-[#DECBA5]',
    textClass: 'text-[#4D3810]',
    borderClass: 'border-[#DECBA7]',
    textColor: '#4D3810',
    bgColors: ['#F5EEDC', '#EBDEC3', '#DECBA5'],
  },
  {
    name: 'plum',
    gradientClass: 'from-[#EDE4EC] via-[#E1D1E0] to-[#CFBACD]',
    textClass: 'text-[#451D42]',
    borderClass: 'border-[#D6C4D5]',
    textColor: '#451D42',
    bgColors: ['#EDE4EC', '#E1D1E0', '#CFBACD'],
  },
  {
    name: 'slate',
    gradientClass: 'from-[#E5E7EB] via-[#D6D9DF] to-[#C1C6D0]',
    textClass: 'text-[#232A36]',
    borderClass: 'border-[#CDD1D9]',
    textColor: '#232A36',
    bgColors: ['#E5E7EB', '#D6D9DF', '#C1C6D0'],
  },
  {
    name: 'clay',
    gradientClass: 'from-[#EFE7DC] via-[#E4D8C8] to-[#D5C4AF]',
    textClass: 'text-[#4A3525]',
    borderClass: 'border-[#D9CCBE]',
    textColor: '#4A3525',
    bgColors: ['#EFE7DC', '#E4D8C8', '#D5C4AF'],
  },
];

/**
 * Pure function that deterministically maps a book title to a color pair from COVER_PALETTE.
 * Normalizes input (trims whitespace and converts to lower case).
 * Falls back to default tint if input is empty or non-string.
 *
 * @param {string} [title] - The book title
 * @returns {typeof COVER_PALETTE[number]} The selected tint pair object
 */
export function coverTint(title) {
  if (!title || typeof title !== 'string') {
    return COVER_PALETTE[0];
  }

  const normalized = title.trim().toLowerCase();
  if (!normalized) {
    return COVER_PALETTE[0];
  }

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % COVER_PALETTE.length;
  return COVER_PALETTE[index];
}

export default coverTint;
