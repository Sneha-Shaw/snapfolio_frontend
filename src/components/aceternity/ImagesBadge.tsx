import { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Size {
  width: number;
  height: number;
}

interface ImagesBadgeProps {
  text: string;
  images: string[];
  className?: string;
  href?: string;
  target?: string;
  folderSize?: Size;
  teaserImageSize?: Size;
  hoverImageSize?: Size;
  hoverTranslateY?: number;
  hoverSpread?: number;
  hoverRotation?: number;
}

/**
 * Aceternity UI's "Images Badge" component
 * (ui.aceternity.com/components/images-badge) — a free, copy-paste
 * component: a badge with a folder icon and up to 3 preview images that fan
 * out and grow on hover. Reproduced from memory (their docs page only
 * exposes source via an interactive tab this environment can't render).
 */
export function ImagesBadge({
  text,
  images,
  className,
  href,
  target,
  folderSize = { width: 32, height: 24 },
  teaserImageSize = { width: 20, height: 14 },
  hoverImageSize = { width: 48, height: 32 },
  hoverTranslateY = -35,
  hoverSpread = 20,
  hoverRotation = 15,
}: ImagesBadgeProps) {
  const [hovered, setHovered] = useState(false);
  const shown = images.slice(0, 3);
  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      {...(href ? { href, target } : {})}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative inline-flex items-center gap-2 overflow-visible rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-hover)]',
        className
      )}
    >
      <span className="relative shrink-0 text-[var(--color-accent)]" style={{ width: folderSize.width, height: folderSize.height }}>
        {hovered ? <FolderOpen size={folderSize.width} /> : <Folder size={folderSize.width} />}

        {shown.map((src, i) => {
          const mid = (shown.length - 1) / 2;
          const offset = i - mid;
          const rotate = offset * hoverRotation;
          const x = offset * hoverSpread;

          return (
            <motion.img
              key={src + i}
              src={src}
              alt=""
              className="pointer-events-none absolute rounded-sm border border-[var(--color-border)] object-cover shadow-md"
              style={{ left: folderSize.width * 0.25, top: folderSize.height * 0.3, zIndex: shown.length - i }}
              initial={false}
              animate={
                hovered
                  ? {
                      width: hoverImageSize.width,
                      height: hoverImageSize.height,
                      x,
                      y: hoverTranslateY,
                      rotate,
                      opacity: 1,
                    }
                  : {
                      width: teaserImageSize.width,
                      height: teaserImageSize.height,
                      x: i * 2,
                      y: -i * 2,
                      rotate: 0,
                      opacity: 0.9,
                    }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            />
          );
        })}
      </span>

      <span>{text}</span>
    </Wrapper>
  );
}
