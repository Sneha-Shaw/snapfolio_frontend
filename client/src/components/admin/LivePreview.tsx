import { useEffect, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { ThemeSample } from '@/components/admin/ThemeSample';
import { cn } from '@/utils/cn';
import type { SiteTheme } from '@/types/models';

/** `value`, but only after it has stopped changing for `ms`. */
function useDebounced<T>(value: T, ms: number): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return settled;
}

// The real preview page is rendered at desktop size, then scaled into the frame.
const PAGE_WIDTH = 1280;
const PAGE_HEIGHT = 800;

/**
 * A scaled-down live view of the actual portfolio — the selected layout,
 * section designs, theme and footer, unsaved changes included — not a mock.
 * Reloads once edits settle; the theme sample stands in while it loads.
 */
export function LivePreview({
  src,
  theme,
  username,
  width = 358,
  className,
}: {
  src: string;
  theme: SiteTheme;
  username?: string;
  /** Frame width in px; the page inside is scaled to fit. */
  width?: number;
  className?: string;
}) {
  const scale = width / PAGE_WIDTH;
  const settledSrc = useDebounced(src, 700);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(false), [settledSrc]);

  return (
    <div className={cn('overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card-hover)]', className)} style={{ width: width + 2 }}>
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] px-3 py-2">
        <span className="size-2 rounded-full bg-red-400/70" />
        <span className="size-2 rounded-full bg-amber-400/70" />
        <span className="size-2 rounded-full bg-green-400/70" />
        <span className="ml-2 truncate rounded-md bg-[var(--color-bg-elevated-2)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-faint)]">/p/{username ?? 'you'}</span>
        {(!loaded || settledSrc !== src) && <Loader2 className="ml-auto size-3 animate-spin text-[var(--color-text-faint)]" aria-label="Updating preview" />}
      </div>
      <div className="group relative overflow-hidden" style={{ height: PAGE_HEIGHT * scale, background: theme.background }}>
        {/* Stand-in while the real page loads. */}
        <div className="absolute inset-0 origin-top-left scale-[0.62]" style={{ width: 580 }} aria-hidden="true">
          <ThemeSample theme={theme} className="rounded-none border-0" />
        </div>
        <iframe
          key={settledSrc}
          src={settledSrc}
          title="Live preview of your portfolio"
          tabIndex={-1}
          scrolling="no"
          onLoad={() => setTimeout(() => setLoaded(true), 500)}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-300"
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
        />
        {/* The whole frame opens the full preview. */}
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          aria-label="Open the full preview"
          className="absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
        >
          <span className="inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
            Open full preview <ExternalLink className="size-3" />
          </span>
        </a>
      </div>
    </div>
  );
}
