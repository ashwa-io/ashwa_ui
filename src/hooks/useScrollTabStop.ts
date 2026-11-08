import { useCallback, useState } from 'react';

const FOCUSABLE =
  'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

/**
 * A scroller with nothing focusable inside needs a tab stop for keyboard scrolling; anywhere else
 * a tab stop would take first focus from its first control.
 */
export const useScrollTabStop = () => {
  const [needsTabStop, setNeedsTabStop] = useState(false);

  const ref = useCallback((element: HTMLElement | null) => {
    if (!element) return undefined;
    const check = () => {
      const overflows =
        element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
      setNeedsTabStop(overflows && !element.querySelector(FOCUSABLE));
    };
    const resize = new ResizeObserver(check);
    const watchChildren = () => {
      resize.disconnect();
      resize.observe(element);
      Array.from(element.children).forEach(child => resize.observe(child));
    };
    // A fixed-height scroller doesn't resize when its content arrives or is swapped.
    const mutation = new MutationObserver(() => {
      watchChildren();
      check();
    });
    mutation.observe(element, { childList: true, subtree: true });
    watchChildren();
    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, []);

  return { ref, tabIndex: needsTabStop ? 0 : undefined };
};
