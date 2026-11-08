import { useCallback, useState } from 'react';

const FOCUSABLE =
  'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

/**
 * A scroller with nothing focusable inside needs a tab stop for keyboard scrolling; anywhere else
 * a tab stop would take first focus from its first control.
 */
export const useScrollTabStop = () => {
  const [needsTabStop, setNeedsTabStop] = useState(false);

  // shortcut: children swapped in after mount aren't observed, observe a wrapper if that shows up.
  const ref = useCallback((element: HTMLElement | null) => {
    if (!element) return undefined;
    const check = () => {
      const overflows =
        element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
      setNeedsTabStop(overflows && !element.querySelector(FOCUSABLE));
    };
    const observer = new ResizeObserver(check);
    observer.observe(element);
    Array.from(element.children).forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  return { ref, tabIndex: needsTabStop ? 0 : undefined };
};
