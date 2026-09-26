import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

/** Mount near the viewport once. Preserve forms/state after mounting, and pause
 * CSS atmosphere outside the viewport or when the browser tab is hidden. */
export function SectionViewport({ children, section, eager = false }: { children: ReactNode; section: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(eager);
  const [active, setActive] = useState(eager);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let intersecting = false;
    const update = () => setActive(intersecting && !document.hidden);
    const load = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setReady(true); load.disconnect(); }
    }, { rootMargin: '500px 0px' });
    const visibility = new IntersectionObserver(([entry]) => { intersecting = !!entry?.isIntersecting; update(); });
    load.observe(element);
    visibility.observe(element);
    document.addEventListener('visibilitychange', update);
    // Anchor destinations must exist before the deferred content does.
    const revealAnchor = () => {
      if (window.location.hash === `#${section}`) {
        setReady(true);
        element.scrollIntoView({ block: 'start' });
      }
    };
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.('a');
      if (anchor?.getAttribute('href') === `#${section}`) setReady(true);
    };
    revealAnchor();
    window.addEventListener('hashchange', revealAnchor);
    document.addEventListener('click', click);
    return () => { load.disconnect(); visibility.disconnect(); document.removeEventListener('visibilitychange', update); window.removeEventListener('hashchange', revealAnchor); document.removeEventListener('click', click); };
  }, [section]);

  return <div ref={ref} className="section-viewport" data-section-kind={section} data-active={active} data-mounted={ready}>
    {!ready && <span id={section} className="section-anchor" />}
    <Suspense fallback={<div className="section-placeholder" aria-label={`Loading ${section}`} />}>
      {ready ? children : <div className="section-placeholder" />}
    </Suspense>
  </div>;
}
