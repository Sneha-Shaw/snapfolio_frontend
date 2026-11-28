import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Testimonial } from '@/types/models';
import {
  GlowCard,
  Heading,
  Marquee,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  cardClass,
  initials,
  metroColor,
  type SectionProps,
  type SectionVariant,
} from './shared';

function Person({ t, size = 'size-10', light }: { t: Testimonial; size?: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {t.avatarUrl ? (
        <img src={t.avatarUrl} alt={t.name} className={cn(size, 'shrink-0 rounded-full object-cover')} />
      ) : (
        <div className={cn(size, 'flex shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm font-semibold text-[var(--color-accent)]')}>
          {initials(t.name)}
        </div>
      )}
      <div className="min-w-0">
        <p className={cn('truncate text-sm font-semibold', light ? '' : 'text-[var(--color-text)]')}>{t.name}</p>
        <p className={cn('truncate text-xs', light ? 'opacity-75' : 'text-[var(--color-text-faint)]')}>{[t.role, t.company].filter(Boolean).join(' · ')}</p>
      </div>
    </div>
  );
}

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4 fill-current" />
      ))}
    </div>
  );
}

function useTestimonials(props: SectionProps) {
  return props.profile?.testimonials ?? [];
}

function TestimonialsGrid(props: SectionProps) {
  const list = useTestimonials(props);
  if (list.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Testimonials" title="What people say" align="center" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <Reveal key={`${t.name}-${i}`} delay={(i % 3) * 0.07}>
            <GlowCard className="h-full">
              <div className="flex h-full flex-col gap-6 p-7">
                <Stars />
                <p className="flex-1 leading-relaxed text-[var(--color-text)]">“{t.quote}”</p>
                <Person t={t} />
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TestimonialsSpotlight(props: SectionProps) {
  const list = useTestimonials(props);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % list.length), 7000);
    return () => clearInterval(id);
  }, [list.length]);
  const t = list[i];
  if (!t) return null;
  return (
    <Section className="py-28">
      <div className="relative mx-auto max-w-4xl text-center">
        <Quote className="mx-auto mb-10 size-14 text-[var(--color-accent)] opacity-80" />
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }} transition={{ duration: 0.5 }}>
            <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-[var(--color-text)] sm:text-4xl">“{t.quote}”</p>
            <div className="mt-10 flex justify-center">
              <Person t={t} size="size-12" />
            </div>
          </motion.div>
        </AnimatePresence>
        {list.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button type="button" aria-label="Previous" onClick={() => setI((n) => (n - 1 + list.length) % list.length)} className="rounded-full border border-[var(--color-border)] p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-1.5">
              {list.map((_, n) => (
                <button key={n} type="button" aria-label={`Testimonial ${n + 1}`} onClick={() => setI(n)} className={cn('h-1.5 rounded-full transition-all', n === i ? 'w-8 bg-[var(--color-accent)]' : 'w-1.5 bg-[var(--color-border-hover)]')} />
              ))}
            </div>
            <button type="button" aria-label="Next" onClick={() => setI((n) => (n + 1) % list.length)} className="rounded-full border border-[var(--color-border)] p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className={`${cardClass} w-[340px] shrink-0 p-6`}>
      <blockquote className="line-clamp-5 text-sm leading-relaxed text-[var(--color-text)]">“{t.quote}”</blockquote>
      <figcaption className="mt-5">
        <Person t={t} />
      </figcaption>
    </figure>
  );
}

function TestimonialsMarquee(props: SectionProps) {
  const list = useTestimonials(props);
  if (list.length === 0) return null;
  const rowA = list.length < 4 ? [...list, ...list] : list;
  const rowB = [...rowA].reverse();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Heading eyebrow="Kind words" title="Loved by the people I've worked with" align="center" />
      </div>
      <div className="space-y-4">
        <Marquee duration={50}>
          {rowA.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </Marquee>
        {list.length > 1 && (
          <Marquee duration={60} reverse>
            {rowB.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </Marquee>
        )}
      </div>
    </section>
  );
}

function TestimonialsMasonry(props: SectionProps) {
  const list = useTestimonials(props);
  if (list.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Testimonials" title="Word on the street" />
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {list.map((t, i) => (
          <Reveal key={`${t.name}-${i}`} delay={(i % 3) * 0.06} className={cn(`${cardClass} break-inside-avoid p-6`, i === 0 && 'bg-[var(--color-accent)] text-[var(--color-on-accent)]')}>
            <Quote className={cn('mb-4 size-6', i === 0 ? 'opacity-70' : 'text-[var(--color-accent)]')} />
            <p className={cn('leading-relaxed', i === 0 ? 'text-lg font-medium' : 'text-[var(--color-text)]')}>{t.quote}</p>
            <div className="mt-6">
              <Person t={t} light={i === 0} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TestimonialsFeatured(props: SectionProps) {
  const [first, ...rest] = useTestimonials(props);
  if (!first) return null;
  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[var(--color-accent)] p-10 text-[var(--color-on-accent)]">
          <Quote className="absolute -right-6 -top-6 size-48 opacity-10" />
          <p className="relative text-2xl font-medium leading-snug sm:text-3xl">“{first.quote}”</p>
          <div className="relative mt-10">
            <Person t={first} size="size-12" light />
          </div>
        </Reveal>
        <div className="space-y-4">
          {rest.slice(0, 3).map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 0.08} className={`${cardClass} p-6`}>
              <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-text)]">“{t.quote}”</p>
              <div className="mt-4">
                <Person t={t} size="size-8" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function TestimonialsChat(props: SectionProps) {
  const list = useTestimonials(props).slice(0, 5);
  if (list.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Messages" title="From my inbox" align="center" />
      <div className="mx-auto max-w-2xl space-y-6">
        {list.map((t, i) => {
          const right = i % 2 === 1;
          return (
            <motion.div
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, x: right ? 30 : -30, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.05 }}
              className={cn('flex items-end gap-3', right && 'flex-row-reverse')}
            >
              <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent-soft)] text-xs font-semibold text-[var(--color-accent)]">
                {t.avatarUrl ? <img src={t.avatarUrl} alt="" className="size-full object-cover" /> : initials(t.name)}
              </div>
              <div className={cn('max-w-[80%] rounded-2xl px-5 py-3.5', right ? 'rounded-br-sm bg-[var(--color-accent)] text-[var(--color-on-accent)]' : 'rounded-bl-sm border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)]')}>
                <p className="text-sm leading-relaxed">{t.quote}</p>
                <p className={cn('mt-2 text-xs', right ? 'opacity-75' : 'text-[var(--color-text-faint)]')}>
                  — {t.name}
                  {t.company && `, ${t.company}`}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

function TestimonialsDeck(props: SectionProps) {
  const list = useTestimonials(props);
  const [top, setTop] = useState(0);
  if (list.length === 0) return null;
  const order = list.map((_, n) => (top + n) % list.length).slice(0, 4);
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Heading eyebrow="Testimonials" title="Don't just take my word for it" className="mb-4" />
          <p className="text-[var(--color-text-muted)]">Click the card to shuffle through what collaborators have said.</p>
          <p className="mt-6 font-mono text-sm text-[var(--color-text-faint)]">
            {top + 1} / {list.length}
          </p>
        </Reveal>
        <div className="relative h-80 cursor-pointer" onClick={() => setTop((n) => (n + 1) % list.length)}>
          {order
            .slice()
            .reverse()
            .map((idx) => {
              const depth = order.indexOf(idx);
              const t = list[idx]!;
              return (
                <motion.figure
                  key={idx}
                  animate={{ y: depth * 16, scale: 1 - depth * 0.05, rotate: depth === 0 ? 0 : depth % 2 ? 3 : -3, opacity: 1 - depth * 0.2 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="absolute inset-x-0 top-0 flex h-72 flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 shadow-[var(--shadow-card-hover)]"
                  style={{ zIndex: 10 - depth }}
                >
                  <p className="line-clamp-5 text-lg leading-relaxed text-[var(--color-text)]">“{t.quote}”</p>
                  <Person t={t} />
                </motion.figure>
              );
            })}
        </div>
      </div>
    </Section>
  );
}

function TestimonialsMinimal(props: SectionProps) {
  const list = useTestimonials(props);
  if (list.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-6">
      <Reveal className="grid gap-6 border-t border-[var(--color-border)] py-14 md:grid-cols-[180px_1fr] md:gap-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Kind words</h2>
        <div className="space-y-10">
          {list.map((t, i) => (
            <blockquote key={i}>
              <p className="text-lg leading-relaxed text-[var(--color-text)]">“{t.quote}”</p>
              <footer className="mt-3 text-sm text-[var(--color-text-muted)]">
                — {t.name}
                {t.role && `, ${t.role}`}
                {t.company && ` at ${t.company}`}
              </footer>
            </blockquote>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function TestimonialsMetro(props: SectionProps) {
  const list = useTestimonials(props);
  if (list.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">people say</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 [&_.metro-tile]:min-h-48">
        {list.map((t, i) => (
          <MetroTile key={i} color={metroColor(i + 5)} index={i} className={cn(i === 0 && 'lg:col-span-2')}>
            <p className="text-base leading-relaxed">“{t.quote}”</p>
            <p className="mt-4 text-sm font-semibold">
              {t.name}
              <span className="font-normal opacity-80"> · {t.company || t.role}</span>
            </p>
          </MetroTile>
        ))}
      </div>
    </section>
  );
}

function TestimonialsTerminal(props: SectionProps) {
  const list = useTestimonials(props);
  if (list.length === 0) return null;
  return (
    <TerminalSection profile={props.profile} cmd="cat reviews.json | jq">
      <pre className="whitespace-pre-wrap text-xs sm:text-sm">
        <span className="text-[var(--color-text-faint)]">[</span>
        {list.map((t, i) => (
          <span key={i}>
            {'\n  {\n'}
            {'    '}
            <span className="text-[var(--color-accent)]">"from"</span>: <span className="text-[var(--color-text)]">"{t.name}{t.company ? `, ${t.company}` : ''}"</span>,{'\n'}
            {'    '}
            <span className="text-[var(--color-accent)]">"says"</span>: <span className="text-[var(--color-text)]">"{t.quote}"</span>
            {'\n  }'}
            {i < list.length - 1 ? ',' : ''}
          </span>
        ))}
        {'\n'}
        <span className="text-[var(--color-text-faint)]">]</span>
      </pre>
    </TerminalSection>
  );
}

export const TESTIMONIALS_VARIANTS: SectionVariant[] = [
  { id: 'marquee', name: 'Wall of love', description: 'Two rows of review cards scrolling opposite ways.', Component: TestimonialsMarquee },
  { id: 'spotlight', name: 'Spotlight carousel', description: 'One big quote at a time, auto-rotating with blur transitions.', Component: TestimonialsSpotlight },
  { id: 'grid', name: 'Glow grid', description: 'Star-rated cards with cursor-following glow.', Component: TestimonialsGrid },
  { id: 'featured', name: 'Featured + list', description: 'One big accent quote with smaller ones beside it.', Component: TestimonialsFeatured },
  { id: 'deck', name: 'Card deck', description: 'Stacked cards — click to shuffle.', Component: TestimonialsDeck },
  { id: 'chat', name: 'Chat bubbles', description: 'Quotes as a messaging conversation.', Component: TestimonialsChat },
  { id: 'masonry', name: 'Masonry', description: 'Pinterest-style columns, first card highlighted.', Component: TestimonialsMasonry },
  { id: 'metro', name: 'Metro tiles', description: 'A colored tile per quote.', Component: TestimonialsMetro },
  { id: 'minimal', name: 'Minimal', description: 'Plain blockquotes, label on the left.', Component: TestimonialsMinimal },
  { id: 'terminal', name: 'Terminal', description: '`cat reviews.json | jq`.', Component: TestimonialsTerminal },
];
