import { useState } from 'react';
import { cn } from '@/utils/cn';

interface FocusCard {
  title: string;
  subtitle?: string;
  imageUrl: string;
  href?: string;
}

interface FocusCardsProps {
  cards: FocusCard[];
  className?: string;
}

/**
 * Aceternity UI's "Focus Cards" component
 * (ui.aceternity.com/components/focus-cards) — a free, copy-paste
 * component: hovering one card in a grid blurs and slightly shrinks all the
 * others, drawing focus to it. Reproduced from memory (their docs page only
 * exposes source via an interactive tab this environment can't render).
 */
export function FocusCards({ cards, className }: FocusCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {cards.map((card, i) => {
        const Wrapper = card.href ? 'a' : 'div';
        return (
          <Wrapper
            key={card.title + i}
            {...(card.href ? { href: card.href } : {})}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'elevated-card relative h-72 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-all duration-300 ease-out',
              hovered !== null && hovered !== i && 'scale-[0.97] opacity-70 blur-sm'
            )}
          >
            <img
              src={card.imageUrl}
              alt={card.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500"
              style={hovered === i ? { transform: 'scale(1.05)' } : undefined}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5">
              <p className="font-semibold text-white">{card.title}</p>
              {card.subtitle && <p className="text-sm text-white/70">{card.subtitle}</p>}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
