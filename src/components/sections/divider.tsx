import { motion } from 'framer-motion';
import { Marquee, shellHost, type SectionProps, type SectionVariant } from './shared';

function words(props: SectionProps): string[] {
  const areas = props.profile?.focusAreas ?? [];
  if (areas.length) return areas;
  return props.technologies.slice(0, 8).map((t) => t.name);
}

function DividerLine() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="h-px origin-center bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
      />
    </div>
  );
}

function DividerGlow() {
  return (
    <div className="relative mx-auto h-24 max-w-6xl">
      <div className="absolute left-1/2 top-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-8 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-25 blur-2xl" />
    </div>
  );
}

function DividerWords(props: SectionProps) {
  const list = words(props);
  if (list.length === 0) return null;
  return (
    <div className="border-y border-[var(--color-border)] py-6">
      <Marquee duration={30} pauseOnHover={false}>
        {list.map((w) => (
          <span key={w} className="flex items-center gap-4 whitespace-nowrap text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
            {w} <span className="text-[var(--color-accent)]">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

function DividerTiltedBand(props: SectionProps) {
  const list = words(props);
  if (list.length === 0) return null;
  return (
    <div className="relative overflow-hidden py-16">
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 -rotate-3 bg-[var(--color-text)] py-4">
        <Marquee duration={25} pauseOnHover={false} reverse>
          {list.map((w) => (
            <span key={w} className="whitespace-nowrap text-2xl font-bold uppercase tracking-wide text-[var(--color-bg)]">
              {w} ★
            </span>
          ))}
        </Marquee>
      </div>
      <div className="relative -mx-[5%] rotate-2 bg-[var(--color-accent)] py-4 shadow-2xl">
        <Marquee duration={22} pauseOnHover={false}>
          {list.map((w) => (
            <span key={w} className="whitespace-nowrap text-2xl font-bold uppercase tracking-wide text-[var(--color-on-accent)]">
              {w} ★
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

function DividerWave() {
  return (
    <div className="overflow-hidden py-4 text-[var(--color-accent)]">
      <motion.svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="h-12 w-[200%]" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
        <path
          d="M0 30 Q 75 0 150 30 T 300 30 T 450 30 T 600 30 T 750 30 T 900 30 T 1050 30 T 1200 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.6"
        />
      </motion.svg>
    </div>
  );
}

function DividerDots() {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-[var(--color-accent)]"
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function DividerQuote({ profile }: SectionProps) {
  const text = profile?.heroCurrently || profile?.headline;
  if (!text) return null;
  return (
    <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-10">
      <span className="h-px flex-1 bg-[var(--color-border-hover)]" />
      <p className="max-w-lg text-center font-serif text-lg italic text-[var(--color-text-muted)]">“{text}”</p>
      <span className="h-px flex-1 bg-[var(--color-border-hover)]" />
    </div>
  );
}

function DividerSpace() {
  return <div className="h-20" aria-hidden />;
}

function DividerGradientBar() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div
        className="h-2 rounded-full"
        style={{
          background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-strong), var(--color-accent))',
          backgroundSize: '200% 100%',
          animation: 'shimmer-bg 4s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
}

function DividerTerminal({ profile }: SectionProps) {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden whitespace-nowrap px-6 py-4 font-mono text-xs text-[var(--color-text-faint)]">
      # ─── {shellHost(profile)} ─────────────────────────────────────────────────────────────────────────────────────
    </div>
  );
}

export const DIVIDER_VARIANTS: SectionVariant[] = [
  { id: 'tilted-band', name: 'Tilted bands', description: 'Two crossing marquee ribbons — very bold.', Component: DividerTiltedBand },
  { id: 'words', name: 'Word marquee', description: 'Your focus areas scrolling large between borders.', Component: DividerWords },
  { id: 'glow', name: 'Glow line', description: 'Hairline with a soft accent glow.', Component: DividerGlow },
  { id: 'line', name: 'Drawn line', description: 'Gradient line that draws itself in.', Component: DividerLine },
  { id: 'wave', name: 'Wave', description: 'A gently moving wave line.', Component: DividerWave },
  { id: 'quote', name: 'Quote', description: 'Your "currently" line between rules.', Component: DividerQuote },
  { id: 'dots', name: 'Pulsing dots', description: 'Five dots breathing in sequence.', Component: DividerDots },
  { id: 'gradient-bar', name: 'Gradient bar', description: 'Thick shimmering accent bar.', Component: DividerGradientBar },
  { id: 'space', name: 'Spacer', description: 'Just breathing room.', Component: DividerSpace },
  { id: 'terminal', name: 'Terminal rule', description: 'A `# ───` comment line.', Component: DividerTerminal },
];
