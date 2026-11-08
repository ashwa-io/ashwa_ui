const HEX6 = /^#?([0-9a-f]{6})$/i;

/** '#1A73E8' | '1a73e8' → '#1a73e8'; anything that is not 6 hex digits → null. */
export const normalizeHex = (input: string): string | null => {
  const match = HEX6.exec(input.trim());
  return match ? `#${match[1].toLowerCase()}` : null;
};
