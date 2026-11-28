import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Code2, Cpu, Database, Layers, Minus, Plus, Rocket, Sparkles, Wand2, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Service } from '@/types/models';
import {
  GlowCard,
  Heading,
  Marquee,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  cardClass,
  metroColor,
  servicesOf,
  type SectionProps,
  type SectionVariant,
} from './shared';

const ICONS = [Code2, Layers, Cpu, Database, Rocket, Zap, Sparkles, Wand2];
const iconFor = (i: number) => ICONS[i % ICONS.length]!;

function useServices(props: SectionProps): Service[] {
  return servicesOf(props.profile);
}

function ServicesGlow(props: SectionProps) {
  const services = useServices(props);
  if (services.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Services" title="What I can do for you" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = iconFor(i);
          return (
            <Reveal key={s.title} delay={(i % 3) * 0.07}>
              <GlowCard className="h-full">
                <div className="flex h-full flex-col p-7">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-accent)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{s.title}</h3>
                  {s.description && <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{s.description}</p>}
                </div>
              </GlowCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function ServicesNumbered(props: SectionProps) {
  const services = useServices(props);
  if (services.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Services" title="How I can help" />
      <div className="border-t border-[var(--color-border)]">
        {services.map((s, i) => (
          <Reveal key={s.title} className="group grid gap-4 border-b border-[var(--color-border)] py-8 md:grid-cols-[120px_1fr_1.2fr] md:items-baseline">
            <span className="font-mono text-sm text-[var(--color-accent)]">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-text)] transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">{s.title}</h3>
            {s.description && <p className="text-[var(--color-text-muted)]">{s.description}</p>}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ServicesAccordion(props: SectionProps) {
  const services = useServices(props);
  const [open, setOpen] = useState(0);
  if (services.length === 0) return null;
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <Heading eyebrow="Services" title="Ways we can work together" className="mb-4" />
          <p className="text-[var(--color-text-muted)]">Pick what you need — or combine them into a single engagement.</p>
        </Reveal>
        <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.title}>
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className={cn('text-lg font-medium transition-colors', isOpen ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]')}>{s.title}</span>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-5 pr-12 text-[var(--color-text-muted)]">
                      {s.description || `I help teams with ${s.title.toLowerCase()} from first sketch to production.`}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function ServicesSticky(props: SectionProps) {
  const services = useServices(props);
  if (services.length === 0) return null;
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">Services</p>
          <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-5xl">
            Everything you need to go from <span className="text-[var(--color-accent)]">idea</span> to <span className="text-[var(--color-accent)]">shipped</span>.
          </h2>
        </div>
        <div className="space-y-4">
          {services.map((s, i) => {
            const Icon = iconFor(i);
            return (
              <Reveal key={s.title} className={`${cardClass} flex gap-5 p-6`}>
                <Icon className="mt-1 size-6 shrink-0 text-[var(--color-accent)]" />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{s.title}</h3>
                  {s.description && <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{s.description}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function ServicesBento(props: SectionProps) {
  const services = useServices(props);
  if (services.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Services" title="What I do" align="center" />
      <div className="grid auto-rows-[minmax(180px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = iconFor(i);
          const hero = i === 0;
          return (
            <Reveal
              key={s.title}
              delay={i * 0.05}
              className={cn(
                'elevated-card relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] p-7',
                hero ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] sm:col-span-2 sm:row-span-2' : 'bg-[var(--color-bg-elevated)]',
                i === 3 && 'lg:col-span-2'
              )}
            >
              {hero && <div className="pointer-events-none absolute -bottom-16 -right-16 size-64 rounded-full border-[40px] border-white/10" />}
              <Icon className={cn('size-7', hero ? '' : 'text-[var(--color-accent)]')} />
              <div className="relative">
                <h3 className={cn('font-semibold', hero ? 'text-3xl sm:text-4xl' : 'text-lg text-[var(--color-text)]')}>{s.title}</h3>
                {s.description && <p className={cn('mt-2 text-sm leading-relaxed', hero ? 'max-w-md opacity-85' : 'text-[var(--color-text-muted)]')}>{s.description}</p>}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function ServicesMarquee(props: SectionProps) {
  const services = useServices(props);
  if (services.length === 0) return null;
  const half = Math.ceil(services.length / 2);
  const rows = [services.slice(0, half), services.slice(half).length ? services.slice(half) : services];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Heading eyebrow="Services" title="I can help with" align="center" />
      </div>
      <div className="space-y-4">
        {rows.map((row, r) => (
          <Marquee key={r} duration={35 + r * 8} reverse={r === 1}>
            {row.map((s, i) => {
              const Icon = iconFor(i + r * 3);
              return (
                <span key={s.title} className="inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-3.5 text-lg font-medium text-[var(--color-text)]">
                  <Icon className="size-5 text-[var(--color-accent)]" /> {s.title}
                </span>
              );
            })}
          </Marquee>
        ))}
      </div>
    </section>
  );
}

function ServicesExpand(props: SectionProps) {
  const services = useServices(props).slice(0, 5);
  const [active, setActive] = useState(0);
  if (services.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Services" title="Hover to explore" />
      <div className="flex flex-col gap-2 md:h-[420px] md:flex-row">
        {services.map((s, i) => {
          const Icon = iconFor(i);
          const isActive = active === i;
          return (
            <motion.div
              key={s.title}
              layout
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn(
                'relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--color-border)] p-6 transition-colors',
                isActive ? 'min-h-64 flex-[4] bg-[var(--color-accent)] text-[var(--color-on-accent)]' : 'min-h-20 flex-1 bg-[var(--color-bg-elevated)] text-[var(--color-text)]'
              )}
            >
              <div className="flex h-full flex-col justify-between">
                <span className="font-mono text-sm opacity-70">0{i + 1}</span>
                <div>
                  <Icon className="mb-4 size-7" />
                  <h3 className={cn('font-semibold', isActive ? 'text-2xl' : 'text-base md:[writing-mode:vertical-rl] md:rotate-180')}>{s.title}</h3>
                  <AnimatePresence>
                    {isActive && s.description && (
                      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 0.85, y: 0 }} exit={{ opacity: 0 }} className="mt-3 max-w-md text-sm leading-relaxed">
                        {s.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

function ServicesProcess(props: SectionProps) {
  const services = useServices(props).slice(0, 5);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 50%'] });
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  if (services.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Process" title="How I work" align="center" />
      <div ref={ref} className="relative">
        <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-[var(--color-border)] md:block">
          <motion.div style={{ width }} className="h-full bg-[var(--color-accent)]" />
        </div>
        <div className="grid gap-10 md:grid-flow-col md:auto-cols-fr">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative text-center">
              <div className="relative z-10 mx-auto flex size-12 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)] font-mono text-sm font-bold text-[var(--color-accent)]">
                {i + 1}
              </div>
              <h3 className="mt-5 font-semibold text-[var(--color-text)]">{s.title}</h3>
              {s.description && <p className="mx-auto mt-2 max-w-xs text-sm text-[var(--color-text-muted)]">{s.description}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ServicesPricing(props: SectionProps) {
  const services = useServices(props).slice(0, 3);
  if (services.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Engagements" title="Choose how we work" align="center" />
      <div className="grid gap-4 md:grid-cols-3">
        {services.map((s, i) => {
          const featured = i === 1 || services.length === 1;
          return (
            <Reveal
              key={s.title}
              delay={i * 0.08}
              className={cn(
                'relative flex flex-col rounded-2xl border p-8',
                featured ? 'border-[var(--color-accent)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-glow)] md:-translate-y-4' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]'
              )}
            >
              {featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-on-accent)]">Most popular</span>
              )}
              <h3 className="text-xl font-semibold text-[var(--color-text)]">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{s.description || 'Scoped to your goals, delivered end to end.'}</p>
              <a
                href="#contact"
                className={cn(
                  'mt-8 inline-flex h-11 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors',
                  featured
                    ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)]'
                    : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-hover)]'
                )}
              >
                Let's talk <ArrowUpRight className="size-4" />
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function ServicesMetro(props: SectionProps) {
  const services = useServices(props);
  if (services.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">services</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 [&_.metro-tile]:min-h-36">
        {services.map((s, i) => {
          const Icon = iconFor(i);
          return (
            <MetroTile key={s.title} color={metroColor(i + 3)} index={i} className={cn(i === 0 && 'col-span-2')}>
              <Icon className="size-6" />
              <div>
                <p className="font-semibold">{s.title}</p>
                {i === 0 && s.description && <p className="mt-1 text-sm opacity-85">{s.description}</p>}
              </div>
            </MetroTile>
          );
        })}
      </div>
    </section>
  );
}

function ServicesTerminal(props: SectionProps) {
  const services = useServices(props);
  if (services.length === 0) return null;
  return (
    <TerminalSection profile={props.profile} cmd="man services">
      <p className="font-semibold text-[var(--color-text)]">SERVICES(1)</p>
      <p className="mt-3 text-[var(--color-text-faint)]">OPTIONS</p>
      <ul className="mt-1 space-y-2">
        {services.map((s) => (
          <li key={s.title}>
            <span className="text-[var(--color-accent)]">--{s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
            {s.description && <span className="block pl-6 text-xs sm:text-sm">{s.description}</span>}
          </li>
        ))}
      </ul>
    </TerminalSection>
  );
}

export const SERVICES_VARIANTS: SectionVariant[] = [
  { id: 'glow', name: 'Glow cards', description: 'Icon cards with a border glow that follows the cursor.', Component: ServicesGlow },
  { id: 'sticky', name: 'Sticky headline', description: 'Big statement pinned left while services scroll by.', Component: ServicesSticky },
  { id: 'expand', name: 'Expanding panels', description: 'Panels widen on hover to reveal details.', Component: ServicesExpand },
  { id: 'bento', name: 'Bento', description: 'Hero tile in accent color plus smaller tiles.', Component: ServicesBento },
  { id: 'process', name: 'Process steps', description: 'Numbered steps with a line that fills as you scroll.', Component: ServicesProcess },
  { id: 'pricing', name: 'Engagement cards', description: 'Three pricing-style cards, middle one highlighted.', Component: ServicesPricing },
  { id: 'numbered', name: 'Numbered rows', description: 'Editorial 01/02/03 rows with descriptions.', Component: ServicesNumbered },
  { id: 'accordion', name: 'Accordion', description: 'Headline left, expandable services right.', Component: ServicesAccordion },
  { id: 'marquee', name: 'Marquee pills', description: 'Two rows of service pills scrolling opposite ways.', Component: ServicesMarquee },
  { id: 'metro', name: 'Metro tiles', description: 'A colored tile per service.', Component: ServicesMetro },
  { id: 'terminal', name: 'Terminal', description: '`man services`.', Component: ServicesTerminal },
];
