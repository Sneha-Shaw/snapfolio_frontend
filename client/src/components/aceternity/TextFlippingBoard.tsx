import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface TextFlippingBoardProps {
  words: string[];
  duration?: number;
  className?: string;
}

/**
 * A split-flap / airport-departure-board character animation, matching the
 * concept of aceternity.com's "Text Flipping Board" component
 * (ui.aceternity.com/components/text-flipping-board). That component is a
 * newer, more niche addition to their catalog and its exact source wasn't
 * extractable from this environment, so this is a from-scratch, independent
 * implementation of the same split-flap mechanic — not copied from elsewhere.
 */
export function TextFlippingBoard({ words, duration = 2500, className }: TextFlippingBoardProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(id);
  }, [words.length, duration]);

  const maxLength = words.reduce((max, word) => Math.max(max, word.length), 0);
  const current = (words[index] ?? '').padEnd(maxLength, ' ');
  const chars = current.split('');

  return (
    <div className={cn('inline-flex gap-1', className)} style={{ perspective: '600px' }}>
      {chars.map((char, charIndex) => {
        const isSpace = char === ' ';
        return (
          <div
            key={charIndex}
            className={cn(
              'relative flex h-10 w-8 items-center justify-center overflow-hidden rounded-md font-mono text-[var(--color-text)] sm:h-12 sm:w-10',
              !isSpace && 'border border-[var(--color-border)] bg-[var(--color-bg-elevated-2)]'
            )}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {!isSpace && (
              <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--color-border)]" />
            )}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${index}-${charIndex}-${char}`}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.35, delay: charIndex * 0.03 }}
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isSpace ? ' ' : char}
              </motion.span>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
