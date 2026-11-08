/** 'Aarav Sharma' → 'AS'; 'Aarav' → 'A'; '' → ''. First character of the first two words. */
export const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => Array.from(word)[0] ?? '')
    .join('')
    .toUpperCase();
