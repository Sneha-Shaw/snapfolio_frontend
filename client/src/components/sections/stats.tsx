import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  CountUp,
  Heading,
  Marquee,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  cardClass,
  metroColor,
  shellHost,
  statsOf,
  type SectionProps,
  type SectionVariant,
} from './shared';

function StatsRow(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;
  return (
    <Section className="py-14">
      <div className="grid grid-cols-2 divide-[var(--color-border)] border-y border-[var(--color-border)] md:grid-cols-4 md:divide-x">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-10 text-center">
            <CountUp to={s.value} suffix={s.suffix} className="block text-5xl font-semibold tracking-tight text-[var(--color-text)] sm:text-6xl" />
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{s.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function StatsCards(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;
  return (
    <Section>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.07} className={`${cardClass} relative overflow-hidden p-6`}>
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[var(--color-accent-soft)] blur-xl" />
            <CountUp to={s.value} suffix={s.suffix} className="relative block text-4xl font-bold text-[var(--color-accent)]" />
            <p className="relative mt-8 text-sm text-[var(--color-text-muted)]">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function StatsBanner(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-[var(--color-accent)] py-16 text-[var(--color-on-accent)]">
      <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <CountUp to={s.value} suffix={s.suffix} className="block text-5xl font-black tracking-tight sm:text-6xl" />
            <p className="mt-1 text-sm font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Ring({ value, max, label, suffix }: { value: number; max: number; label: string; suffix: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / Math.max(max, 1));
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-36">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="stroke-[var(--color-border)]" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className="stroke-[var(--color-accent)]"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - pct) }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
        </svg>
        <CountUp to={value} suffix={suffix} className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[var(--color-text)]" />
      </div>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}

function StatsRings(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;
  const max = Math.max(...stats.map((s) => s.value));
  return (
    <Section>
      <Heading eyebrow="By the numbers" title="Track record" align="center" />
      <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map((s) => (
          <Ring key={s.label} value={s.value} max={max} label={s.label} suffix={s.suffix} />
        ))}
      </div>
    </Section>
  );
}

function StatsSentence(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;
  return (
    <Section className="py-24">
      <Reveal>
        <p className="text-balance text-3xl font-medium leading-snug tracking-tight text-[var(--color-text-muted)] sm:text-5xl">
          {stats.map((s, i) => (
            <span key={s.label}>
              <CountUp to={s.value} suffix={s.suffix} className="text-[var(--color-accent)]" /> <span className="text-[var(--color-text)]">{s.label.toLowerCase()}</span>
              {i < stats.length - 2 ? ', ' : i === stats.length - 2 ? ' and ' : '.'}
            </span>
          ))}
        </p>
      </Reveal>
    </Section>
  );
}

function StatsOutline(props: SectionProps) {
  const stats = statsOf(props).slice(0, 3);
  if (stats.length === 0) return null;
  return (
    <Section>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="group">
            <CountUp
              to={s.value}
              suffix={s.suffix}
              className="block text-[120px] font-black leading-none tracking-tighter text-transparent transition-colors duration-500 group-hover:text-[var(--color-accent)] sm:text-[160px]"
              style={{ WebkitTextStroke: '2px var(--color-accent)' }}
            />
            <div className="-mt-4 border-t border-[var(--color-border)] pt-3 text-sm uppercase tracking-widest text-[var(--color-text-muted)]">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function StatsBento(props: SectionProps) {
  const stats = statsOf(props);
  if (stats.length === 0) return null;
  return (
    <Section>
      <div className="grid auto-rows-[150px] grid-cols-2 gap-4 md:grid-cols-4">
        {stats.slice(0, 5).map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.06}
            className={cn(
              'flex flex-col justify-between rounded-2xl border border-[var(--color-border)] p-6',
              i === 0 ? 'col-span-2 row-span-2 bg-[var(--color-accent)] text-[var(--color-on-accent)]' : 'bg-[var(--color-bg-elevated)] text-[var(--color-text)]'
            )}
          >
            <p className={cn('text-sm', i === 0 ? 'opacity-80' : 'text-[var(--color-text-muted)]')}>{s.label}</p>
            <CountUp to={s.value} suffix={s.suffix} className={cn('block font-bold tracking-tight', i === 0 ? 'text-8xl' : 'text-4xl')} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function StatsTicker(props: SectionProps) {
  const stats = statsOf(props);
  if (stats.length === 0) return null;
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-6">
      <Marquee duration={28}>
        {[...stats, ...stats].map((s, i) => (
          <span key={i} className="flex items-baseline gap-3 whitespace-nowrap px-6">
            <span className="text-4xl font-bold text-[var(--color-accent)]">
              {s.value}
              {s.suffix}
            </span>
            <span className="text-lg text-[var(--color-text-muted)]">{s.label}</span>
            <span className="pl-6 text-[var(--color-text-faint)]">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}

function StatsMetro(props: SectionProps) {
  const stats = statsOf(props);
  if (stats.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 [&_.metro-tile]:min-h-32">
        {stats.map((s, i) => (
          <MetroTile key={s.label} color={metroColor(i + 1)} index={i}>
            <CountUp to={s.value} suffix={s.suffix} className="text-5xl font-light" />
            <p className="text-sm">{s.label.toLowerCase()}</p>
          </MetroTile>
        ))}
      </div>
    </section>
  );
}

function StatsTerminal(props: SectionProps) {
  const stats = statsOf(props);
  const host = shellHost(props.profile);
  if (stats.length === 0) return null;
  const logo = ['   ▄▄▄▄▄▄▄   ', ' ▄█▀     ▀█▄ ', ' █   ◉ ◉   █ ', ' █  ╰───╯  █ ', ' ▀█▄     ▄█▀ ', '   ▀▀▀▀▀▀▀   '];
  return (
    <TerminalSection profile={props.profile} cmd="neofetch">
      <div className="flex flex-col gap-6 sm:flex-row">
        <pre className="leading-tight text-[var(--color-accent)]">{logo.join('\n')}</pre>
        <div>
          <p>
            <span className="font-semibold text-[var(--color-accent)]">guest</span>@<span className="font-semibold text-[var(--color-accent)]">{host}</span>
          </p>
          <p className="text-[var(--color-text-faint)]">-----------------</p>
          <p>
            <span className="text-[var(--color-accent)]">Role</span>: {props.profile?.headline || 'Engineer'}
          </p>
          {stats.map((s) => (
            <p key={s.label}>
              <span className="text-[var(--color-accent)]">{s.label}</span>: {s.value}
              {s.suffix}
            </p>
          ))}
          <div className="mt-3 flex gap-1">
            {['var(--color-accent)', 'var(--color-accent-strong)', '#ff5f57', '#febc2e', '#28c840', '#2d89ef'].map((c) => (
              <span key={c} className="h-4 w-6" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </TerminalSection>
  );
}

export const STATS_VARIANTS: SectionVariant[] = [
  { id: 'row', name: 'Divided row', description: 'Big count-up numbers separated by hairlines.', Component: StatsRow },
  { id: 'banner', name: 'Accent banner', description: 'Full-width accent band with dot texture.', Component: StatsBanner },
  { id: 'rings', name: 'Progress rings', description: 'Circular rings that fill as they appear.', Component: StatsRings },
  { id: 'outline', name: 'Outline giants', description: 'Huge outlined numbers that fill on hover.', Component: StatsOutline },
  { id: 'bento', name: 'Bento', description: 'One hero number tile plus smaller tiles.', Component: StatsBento },
  { id: 'cards', name: 'Cards', description: 'Four soft cards with glowing corners.', Component: StatsCards },
  { id: 'sentence', name: 'Sentence', description: 'Stats woven into one big sentence.', Component: StatsSentence },
  { id: 'ticker', name: 'Ticker', description: 'Stock-ticker style scrolling strip.', Component: StatsTicker },
  { id: 'metro', name: 'Metro tiles', description: 'A live tile per number.', Component: StatsMetro },
  { id: 'terminal', name: 'Neofetch', description: 'Your stats as `neofetch` output.', Component: StatsTerminal },
];
