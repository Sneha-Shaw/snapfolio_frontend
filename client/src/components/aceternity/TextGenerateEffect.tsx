import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';
import { cn } from '@/utils/cn';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

/**
 * Aceternity UI's "Text Generate Effect" component
 * (ui.aceternity.com/components/text-generate-effect) — a free, copy-paste
 * component. Reproduced verbatim from memory (their docs page only exposes the
 * source via an interactive tab this environment can't render).
 */
export function TextGenerateEffect({ words, className, filter = true, duration = 0.5 }: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');

  useEffect(() => {
    animate(
      'span',
      { opacity: 1, filter: filter ? 'blur(0px)' : 'none' },
      { duration, delay: stagger(0.2) }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope.current]);

  return (
    <div className={cn('font-bold', className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0 text-[var(--color-text-muted)]"
            style={{ filter: filter ? 'blur(10px)' : 'none' }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
