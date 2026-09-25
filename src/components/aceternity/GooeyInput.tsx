import { useId, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface GooeyInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  className?: string;
}

/**
 * Aceternity UI's "Gooey Input" component
 * (ui.aceternity.com/components/gooey-input) — a free, copy-paste component:
 * a circular icon button that morphs into a pill-shaped text input via a
 * gooey SVG filter (the classic Chris Coyier "gooey effect") combined with a
 * framer-motion layout animation. Reproduced from memory (their docs page
 * only exposes source via an interactive tab this environment can't render).
 */
export function GooeyInput({ placeholder = 'Search...', value, onChange, onSubmit, className }: GooeyInputProps) {
  const rawId = useId();
  const filterId = `gooey-input-filter-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [expanded, setExpanded] = useState(false);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onSubmit?.();
    }
  }

  return (
    <div className={cn('relative', className)}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div style={{ filter: `url(#${filterId})` }} className="relative flex h-11 items-center">
        <motion.div
          layout
          onClick={() => setExpanded((prev) => !prev || value.length === 0)}
          className="absolute left-0 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[var(--color-bg-elevated-2)] text-[var(--color-text-muted)]"
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          <Search size={18} />
        </motion.div>

        <motion.input
          layout
          type="text"
          value={value}
          placeholder={placeholder}
          onFocus={() => setExpanded(true)}
          onBlur={() => {
            if (!value) setExpanded(false);
          }}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          initial={false}
          animate={{ width: expanded ? '100%' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className={cn(
            'h-11 rounded-full border-none bg-[var(--color-bg-elevated-2)] pl-11 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]',
            !expanded && 'pointer-events-none'
          )}
        />
      </div>
    </div>
  );
}
