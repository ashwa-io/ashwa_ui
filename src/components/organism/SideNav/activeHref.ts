const trim = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/** The longest item href matching the path, so `/admin` and `/admin/users` are never both active. */
export const activeHref = (hrefs: string[], currentPath: string): string | null => {
  const path = trim(currentPath);
  let best: string | null = null;
  for (const href of hrefs) {
    const candidate = trim(href);
    const matches = path === candidate || path.startsWith(`${candidate}/`);
    if (matches && candidate !== '/' && (best === null || candidate.length > trim(best).length)) {
      best = href;
    }
    if (path === '/' && candidate === '/') best = href;
  }
  return best;
};
