import { useEffect, useRef, useState } from 'react';

interface AsciiArtProps {
  src: string;
  className?: string;
  cellSize?: number;
  ramp?: string;
}

/**
 * Image-to-ASCII-art renderer. This is NOT an aceternity.com component —
 * it has no counterpart in their catalog. This is an original creative
 * addition built for this app, not reproduced from any library.
 */
/** Measures the real rendered advance width of a monospace glyph at `fontSizePx`, rather than assuming a fixed ratio — actual font-family fallback/loading state varies by browser. */
function measureCharWidth(fontSizePx: number): number {
  const probe = document.createElement('span');
  probe.textContent = '0';
  probe.style.fontFamily = 'var(--font-mono)';
  probe.style.fontSize = `${fontSizePx}px`;
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.whiteSpace = 'pre';
  document.body.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  document.body.removeChild(probe);
  return width || fontSizePx * 0.6;
}

export function AsciiArt({ src, className, cellSize = 9, ramp = ' .:-=+*#%@' }: AsciiArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ascii, setAscii] = useState('');

  useEffect(() => {
    let cancelled = false;
    let debounceId: ReturnType<typeof setTimeout> | undefined;

    const image = new Image();
    image.crossOrigin = 'anonymous';

    function render() {
      const container = containerRef.current;
      if (!container || !image.complete || image.naturalWidth === 0) return;

      const containerWidth = container.clientWidth || 300;
      const aspectRatio = image.naturalHeight / image.naturalWidth;
      // Line height is `cellSize` (the `<pre>` uses leading-[1]), while glyph
      // advance width varies by font/fallback — measure it instead of guessing,
      // so the ASCII grid's rendered aspect ratio actually matches the source image.
      const charWidth = measureCharWidth(cellSize);
      const cols = Math.max(1, Math.floor(containerWidth / charWidth));
      const rows = Math.max(1, Math.floor(cols * (charWidth / cellSize) * aspectRatio));

      const canvas = document.createElement('canvas');
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(image, 0, 0, cols, rows);
      let data: Uint8ClampedArray;
      try {
        data = ctx.getImageData(0, 0, cols, rows).data;
      } catch {
        // Canvas got tainted (e.g. CORS-blocked image) — bail out silently.
        return;
      }

      const rampLength = ramp.length;
      let output = '';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const offset = (y * cols + x) * 4;
          const r = data[offset] ?? 0;
          const g = data[offset + 1] ?? 0;
          const b = data[offset + 2] ?? 0;
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          const rampIndex = Math.min(rampLength - 1, Math.floor((luminance / 255) * rampLength));
          output += ramp[rampIndex] ?? ' ';
        }
        output += '\n';
      }

      if (!cancelled) setAscii(output);
    }

    image.onload = () => render();
    image.onerror = () => {
      if (!cancelled) setAscii('');
    };
    image.src = src;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(debounceId);
      debounceId = setTimeout(render, 150);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      cancelled = true;
      clearTimeout(debounceId);
      resizeObserver.disconnect();
    };
  }, [src, cellSize, ramp]);

  return (
    <div ref={containerRef} className={className}>
      {ascii && (
        <pre
          className="whitespace-pre select-none font-mono leading-[1] text-[var(--color-accent)]"
          style={{ fontSize: cellSize }}
        >
          {ascii}
        </pre>
      )}
    </div>
  );
}
