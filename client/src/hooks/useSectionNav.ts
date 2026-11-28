import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ACTIVE_SECTION_EVENT } from '@/config/adminSections';

/** How far down the viewport a section's top must pass to count as the current one. */
const ACTIVE_LINE = 0.3;

function announce(id: string | null) {
  window.dispatchEvent(new CustomEvent(ACTIVE_SECTION_EVENT, { detail: id }));
}

/**
 * For pages made of anchored sections: scrolls to `#id` links (again on a
 * repeat click) and reports the current section to the sidebar.
 */
export function useSectionNav(sections: readonly { id: string }[], ready = true) {
  const location = useLocation();

  useEffect(() => {
    if (!ready) return;

    // After a sidebar click, keep that section highlighted until the user
    // scrolls themselves — short sections near the end of the page can't
    // reach the active line, so measuring would pick the one above.
    let pinned: string | null = null;

    const measure = () => {
      if (pinned) return announce(pinned);
      const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);
      if (els.length === 0) return;
      const root = document.scrollingElement ?? document.documentElement;
      // At the very bottom, the last section is the current one even if it never reached the line.
      if (root.scrollTop + window.innerHeight >= root.scrollHeight - 2) return announce(els[els.length - 1]!.id);
      const line = window.innerHeight * ACTIVE_LINE;
      // The last section whose top has scrolled past the line; the first one before any has.
      const current = [...els].reverse().find((el) => el.getBoundingClientRect().top <= line) ?? els[0]!;
      announce(current.id);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const release = () => {
      if (!pinned) return;
      pinned = null;
      onScroll();
    };

    const target = location.hash.slice(1);
    if (target && sections.some((s) => s.id === target)) {
      pinned = target;
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView());
    }
    measure();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Any scrolling the user does themselves releases the pin.
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchmove', release, { passive: true });
    window.addEventListener('keydown', release);
    window.addEventListener('mousedown', release); // e.g. dragging the scrollbar
    // Sections load their data after mount and change height — keep a clicked
    // section in view while content above it is still growing.
    const resize = new ResizeObserver(() => {
      if (pinned) document.getElementById(pinned)?.scrollIntoView();
      onScroll();
    });
    resize.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchmove', release);
      window.removeEventListener('keydown', release);
      window.removeEventListener('mousedown', release);
      resize.disconnect();
      announce(null);
    };
    // location.key: a repeat click on the same link scrolls (and pins) again.
  }, [ready, sections, location.key, location.hash]);
}
