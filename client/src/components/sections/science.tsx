import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Atom, FlaskConical, Sprout } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SectionVariant } from './shared';
import {
  CountUp,
  Heading,
  PrimaryCTA,
  Reveal,
  SecondaryCTA,
  Section,
  cardClass,
  groupTech,
  oldestFirst,
  pickProjects,
  statementLines,
  statsOf,
  yearsOfExperience,
  type SectionProps,
} from './shared';

/**
 * Science set (✺) — medicine, chemistry, physics, agriculture.
 *
 * The apparatus is real apparatus: the ECG traces an actual PQRST complex on
 * 1mm/5mm chart paper, the beakers have graduations and a meniscus, the atom's
 * shells are separate 3D planes rather than flat ellipses, and the field is a
 * ploughed plane in perspective. Material work is in index.css — `.ecg-paper`,
 * `.monitor-bezel`, `.seven-seg`, `.beaker-glass`, `.reagent`, `.meniscus`,
 * `.element-tile`, `.orbital`, `.nucleus`, `.furrows`, `.grain-ear`.
 */

// ---------------------------------------------------------------------------
// MEDICINE
// ---------------------------------------------------------------------------

/**
 * One cardiac cycle as an SVG path: flat baseline, P wave, the sharp QRS
 * complex, then the rounded T wave. Repeating it is what makes a trace read as
 * a heartbeat rather than as a zigzag.
 */
function ecgPath(cycles: number, width: number, height: number): string {
  const cycleW = width / cycles;
  const mid = height / 2;
  let d = `M 0 ${mid}`;
  for (let c = 0; c < cycles; c++) {
    const x = c * cycleW;
    const u = cycleW / 100;
    d +=
      ` L ${x + 14 * u} ${mid}` +
      ` Q ${x + 20 * u} ${mid - height * 0.12}, ${x + 26 * u} ${mid}` + // P
      ` L ${x + 36 * u} ${mid}` +
      ` L ${x + 40 * u} ${mid + height * 0.09}` + // Q
      ` L ${x + 46 * u} ${mid - height * 0.46}` + // R
      ` L ${x + 52 * u} ${mid + height * 0.24}` + // S
      ` L ${x + 58 * u} ${mid}` +
      ` Q ${x + 70 * u} ${mid - height * 0.19}, ${x + 82 * u} ${mid}` + // T
      ` L ${x + 100 * u} ${mid}`;
  }
  return d;
}

function EcgTrace({ cycles = 4, className }: { cycles?: number; className?: string }) {
  const d = useMemo(() => ecgPath(cycles, 1000, 220), [cycles]);
  return (
    <svg viewBox="0 0 1000 220" preserveAspectRatio="none" className={cn('size-full', className)} aria-hidden>
      <motion.path
        d={d}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 3.2, ease: 'linear' }}
        style={{ filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--color-accent) 60%, transparent))' }}
      />
    </svg>
  );
}

function HeroEcg(props: SectionProps) {
  const { profile, experiences, projects } = props;
  const lines = statementLines(profile);
  const bpm = 60 + (projects.length % 30);

  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                <Activity className="size-4 text-[var(--color-accent)]" />
                {profile.heroEyebrow}
              </p>
            </Reveal>
          )}
          <h1 className="text-4xl font-semibold leading-[1] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* The monitor */}
        <Reveal delay={0.2}>
          <div className="monitor-bezel p-4 sm:p-5">
            <div className="ecg-paper relative overflow-hidden rounded-md bg-[var(--color-bg)]">
              <div className="h-40 sm:h-56">
                <EcgTrace cycles={4} />
              </div>

              {/* Readouts, laid out the way a bedside monitor does. */}
              <div className="absolute right-3 top-3 text-right">
                <p className="seven-seg text-3xl font-bold leading-none text-[var(--color-accent)]">
                  <CountUp to={bpm} />
                </p>
                <p className="text-[9px] uppercase tracking-widest text-[var(--color-text-faint)]">bpm</p>
              </div>
              <div className="absolute left-3 top-3">
                <p className="text-[9px] uppercase tracking-widest text-[var(--color-text-faint)]">
                  {profile?.name || 'patient'} · {profile?.location || 'remote'}
                </p>
              </div>
            </div>

            {/* Secondary channels */}
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { label: 'yrs', value: yearsOfExperience(experiences), suffix: '' },
                { label: 'proj', value: projects.length, suffix: '' },
                { label: 'spo2', value: 98, suffix: '%' },
              ].map((r) => (
                <div key={r.label} className="rounded-md bg-black/25 px-3 py-2">
                  <p className="seven-seg text-lg font-bold leading-none text-[var(--color-accent)]">
                    <CountUp to={r.value} suffix={r.suffix} />
                  </p>
                  <p className="text-[8px] uppercase tracking-widest text-[var(--color-text-faint)]">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4} className="mt-9 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </Reveal>
      </div>
    </section>
  );
}

function StatsVitals(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;

  return (
    <Section>
      <Heading eyebrow="Vitals" title="Readings" align="center" />
      <div className="monitor-bezel p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="ecg-paper relative overflow-hidden rounded-md bg-[var(--color-bg)] p-4">
                {/* A single beat behind each figure. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 opacity-50">
                  <EcgTrace cycles={1} />
                </div>
                <p className="relative text-[9px] uppercase tracking-widest text-[var(--color-text-faint)]">{stat.label}</p>
                <p className="seven-seg relative mt-1 text-3xl font-bold text-[var(--color-accent)]">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                {/* Pulse rings, on the same cadence as the trace. */}
                <span className="pulse-ring animate-pulse-ring absolute right-3 top-3 size-2.5" aria-hidden />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// CHEMISTRY
// ---------------------------------------------------------------------------

/** Vessel with graduations, coloured reagent and a curved meniscus. */
function Beaker({ fill, label, value }: { fill: number; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="beaker-glass relative h-40 w-24 overflow-hidden sm:h-52 sm:w-28">
        <div className="graduations absolute inset-0 z-[2]" aria-hidden />
        <motion.div
          className="reagent animate-slosh absolute inset-x-0 bottom-0"
          initial={{ height: 0 }}
          whileInView={{ height: `${Math.max(fill * 100, 8)}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* The concave surface sits on top of the liquid column. */}
          <span className="meniscus absolute inset-x-0 -top-1.5 h-3" aria-hidden />
          {/* Rising bubbles inside the liquid. */}
          {[18, 42, 68, 84].map((l, i) => (
            <span
              key={l}
              className="bubble animate-bubble absolute bottom-0 size-1.5"
              style={{ left: `${l}%`, animationDuration: `${3 + i}s`, animationDelay: `${i * 0.8}s` }}
              aria-hidden
            />
          ))}
        </motion.div>
      </div>
      <p className="tabular text-xl font-semibold text-[var(--color-accent)]">
        <CountUp to={value} />
      </p>
      <p className="max-w-24 text-center text-[10px] uppercase leading-tight tracking-wider text-[var(--color-text-muted)]">
        {label}
      </p>
    </div>
  );
}

function HeroLab(props: SectionProps) {
  const { profile, technologies, projects, experiences } = props;
  const lines = statementLines(profile);
  const stats = statsOf(props).slice(0, 3);
  const peak = Math.max(...stats.map((s) => s.value), 1);

  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="field-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div>
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                <FlaskConical className="size-4 text-[var(--color-accent)]" />
                {profile.heroEyebrow}
              </p>
            </Reveal>
          )}
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.11, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>
          {profile?.bio && (
            <Reveal delay={0.35}>
              <p className="mt-6 max-w-lg text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>
            </Reveal>
          )}
          <Reveal delay={0.45} className="mt-9 flex flex-wrap gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </Reveal>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
            {technologies.length} reagents · {projects.length} trials · {experiences.length} lab books
          </p>
        </div>

        {/* The bench */}
        <Reveal delay={0.2}>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/50 p-6 backdrop-blur-sm">
            <div className="flex items-end justify-center gap-5 sm:gap-7">
              {stats.map((s) => (
                <Beaker key={s.label} fill={s.value / peak} label={s.label} value={s.value} />
              ))}
            </div>
            {/* Bench surface. */}
            <div className="mt-5 h-2 rounded-full bg-gradient-to-b from-[var(--color-border-hover)] to-transparent" aria-hidden />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SkillsPeriodic({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;

  /* Two-letter symbol from the name, the way the table abbreviates. */
  const symbolOf = (name: string) => {
    const cleaned = name.replace(/[^A-Za-z]/g, '');
    return ((cleaned[0] ?? '?') + (cleaned[1] ?? '')).replace(/^(.)(.)$/, (_, a: string, b: string) => a.toUpperCase() + b.toLowerCase());
  };

  let atomic = 0;

  return (
    <Section id="skills">
      <Heading eyebrow="Stack" title="The table of elements" align="center" />
      <div className="space-y-6">
        {groups.map((group, gi) => (
          <div key={group.cat}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-text-faint)]">
              Group {gi + 1} · {group.label}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
              {group.items.map((tech) => {
                atomic += 1;
                return (
                  <motion.div
                    key={tech._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: (atomic % 8) * 0.03 }}
                    className="element-tile aspect-square p-2"
                    title={tech.name}
                  >
                    <p className="text-[9px] tabular text-[var(--color-text-faint)]">{atomic}</p>
                    <p className="mt-0.5 text-lg font-bold leading-none text-[var(--color-accent)]">
                      {symbolOf(tech.name)}
                    </p>
                    <p className="mt-1 truncate text-[8px] uppercase tracking-wide text-[var(--color-text-muted)]">
                      {tech.name}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// PHYSICS
// ---------------------------------------------------------------------------

/** Electron shells as three rings, each tilted onto its own plane and spun. */
function AtomModel({ shells = 3, className }: { shells?: number; className?: string }) {
  const planes = [
    { rot: 'rotateX(74deg) rotateY(0deg)', dur: 9 },
    { rot: 'rotateX(-62deg) rotateY(34deg)', dur: 13 },
    { rot: 'rotateX(20deg) rotateY(72deg)', dur: 17 },
  ];

  return (
    <div className={cn('atom-scene relative aspect-square', className)}>
      {planes.slice(0, shells).map((p, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ transform: p.rot, transformStyle: 'preserve-3d' }}
          aria-hidden
        >
          <motion.div
            className="orbital absolute size-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'linear' }}
          >
            {/* One electron riding the ring. */}
            <span
              className="electron absolute size-3"
              style={{ left: '50%', top: 0, translate: '-50% -50%' }}
            />
          </motion.div>
        </div>
      ))}
      <span className="nucleus absolute left-1/2 top-1/2 size-[22%] -translate-x-1/2 -translate-y-1/2" aria-hidden />
    </div>
  );
}

function HeroAtom({ profile, technologies }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="field-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <div>
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                <Atom className="size-4 text-[var(--color-accent)]" />
                {profile.heroEyebrow}
              </p>
            </Reveal>
          )}
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.11, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>
          {profile?.bio && (
            <Reveal delay={0.35}>
              <p className="mt-6 max-w-lg text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>
            </Reveal>
          )}
          <Reveal delay={0.45} className="mt-9 flex flex-wrap gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </Reveal>
          {/* A couple of annotations, set like margin notes in a textbook. */}
          <Reveal delay={0.55}>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] text-[var(--color-text-faint)]">
              <span>Z = {technologies.length}</span>
              <span>shells = 3</span>
              <span>E = mc²</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <AtomModel className="mx-auto w-full max-w-sm" />
        </Reveal>
      </div>
    </section>
  );
}

function StatsWave(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;
  const peak = Math.max(...stats.map((s) => s.value), 1);

  return (
    <Section>
      <Heading eyebrow="Amplitude" title="Measured" align="center" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const amp = 0.25 + (stat.value / peak) * 0.6;
          /* Higher value, bigger amplitude — the wave *is* the figure. */
          const d = Array.from({ length: 61 }, (_, k) => {
            const x = (k / 60) * 100;
            const y = 50 - Math.sin((k / 60) * Math.PI * 4) * (amp * 40);
            return `${k === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ');

          return (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className={cn(cardClass, 'relative overflow-hidden p-5')}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-20 w-full" aria-hidden>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.8 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 1.6, delay: i * 0.1, ease: 'easeOut' }}
                  />
                </svg>
                <p className="relative tabular text-4xl font-semibold text-[var(--color-text)]">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="relative mt-1 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{stat.label}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// AGRICULTURE
// ---------------------------------------------------------------------------

function HeroField({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const areas = (profile?.focusAreas ?? []).slice(0, 7);

  return (
    <section className="relative flex min-h-[94vh] items-end overflow-hidden">
      {/* Sky and a low sun. */}
      <div className="sun-disc pointer-events-none absolute left-[22%] top-[18%] size-44 opacity-70" aria-hidden />
      {/* Barn on the horizon. */}
      <div className="pointer-events-none absolute bottom-[38%] right-[14%] h-16 w-24 opacity-70" aria-hidden>
        <div className="barn size-full bg-[color-mix(in_srgb,var(--color-accent-strong)_65%,black)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-56 pt-28 text-center">
        {profile?.heroEyebrow && (
          <Reveal>
            <p className="mb-4 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
              <Sprout className="size-4 text-[var(--color-accent)]" />
              {profile.heroEyebrow}
            </p>
          </Reveal>
        )}
        <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-6xl">
          {lines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.11, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>
        {profile?.bio && (
          <Reveal delay={0.35}>
            <p className="mx-auto mt-6 max-w-xl text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>
          </Reveal>
        )}
        <Reveal delay={0.45} className="mt-9 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </Reveal>
      </div>

      {/* The ploughed field: a tilted plane, so the furrows converge. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] overflow-hidden" aria-hidden>
        <div className="field-perspective absolute inset-x-[-40%] bottom-0 h-[160%]">
          <div className="furrows size-full" />
        </div>
        {/* Crops standing in the near rows, one per focus area. */}
        <div className="absolute inset-x-0 bottom-6 flex items-end justify-center gap-6 sm:gap-10">
          {areas.map((area, i) => (
            <motion.div
              key={area}
              className="flex flex-col items-center"
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'bottom center' }}
            >
              <span className="grain-ear animate-sway size-5" style={{ animationDelay: `${i * 0.4}s` }} />
              <span className="stalk w-[2px]" style={{ height: `${44 + (i % 3) * 14}px` }} />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="soil pointer-events-none absolute inset-x-0 bottom-0 h-8" aria-hidden />
    </section>
  );
}

/** Same reasoning as environments.tsx's MAX_PEAKS: unbounded columns collapse
 *  their labels once there are more than about this many. */
const MAX_STALKS = 10;

function ExperienceSeasons({ experiences }: SectionProps) {
  const sorted = oldestFirst(experiences);
  const items =
    sorted.length <= MAX_STALKS
      ? sorted
      : sorted.filter((_, i) => i % Math.ceil(sorted.length / MAX_STALKS) === 0 || i === sorted.length - 1);
  if (items.length === 0) return null;

  /* Growth stages, so an early role reads as a seedling and a late one as harvest. */
  const stage = (i: number) => {
    const p = items.length > 1 ? i / (items.length - 1) : 1;
    if (p < 0.3) return { label: 'Sown', height: 30 };
    if (p < 0.6) return { label: 'Growing', height: 52 };
    if (p < 0.85) return { label: 'Ripening', height: 74 };
    return { label: 'Harvest', height: 96 };
  };

  return (
    <Section id="experience">
      <Heading eyebrow="Seasons" title="Sown to harvest" align="center" />
      <div className="soil overflow-hidden rounded-2xl p-6 sm:p-9">
        <div className="flex items-end justify-center gap-3 sm:gap-6" style={{ minHeight: '15rem' }}>
          {items.map((exp, i) => {
            const s = stage(i);
            return (
              <motion.div
                key={exp._id}
                className="group flex flex-1 flex-col items-center justify-end gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.09 }}
              >
                <span className="text-center text-[9px] uppercase tracking-wider text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                  {s.label}
                </span>
                <span className="grain-ear animate-sway size-6" style={{ animationDelay: `${i * 0.35}s` }} aria-hidden />
                <motion.span
                  className="stalk w-[3px] rounded-full"
                  initial={{ height: 0 }}
                  whileInView={{ height: s.height }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden
                />
                <span className="w-full border-t border-dashed border-[var(--color-accent)]/30 pt-2 text-center">
                  <span className="block truncate text-[10px] font-medium text-[var(--color-text)]">{exp.position}</span>
                  <span className="block truncate text-[9px] text-[var(--color-text-faint)]">
                    {new Date(exp.startDate).getFullYear()}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
        {sorted.length > items.length && (
          <p className="mt-3 text-center text-xs text-[var(--color-text-faint)]">
            +{sorted.length - items.length} more roles between these
          </p>
        )}
      </div>
    </Section>
  );
}

function ProjectsHarvest({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 6);
  if (projectsLoading || items.length === 0) return null;

  return (
    <Section id="projects">
      <Heading eyebrow="Yield" title="This season's crop" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project, i) => (
          <Reveal key={project._id} delay={i * 0.06}>
            <Link to={`/work/${project.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl">
                {project.thumbnail?.url && (
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <span className="soil pointer-events-none absolute inset-x-0 bottom-0 h-6 opacity-80" aria-hidden />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="grain-ear size-3.5 shrink-0" aria-hidden />
                <h3 className="truncate font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                  {project.title}
                </h3>
                <span className="ml-auto shrink-0 font-mono text-xs text-[var(--color-text-faint)]">{project.year}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">{project.shortDescription}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const SCI_HERO: SectionVariant[] = [
  { id: 'ecg', name: 'Heart monitor ✺', description: 'A real PQRST complex tracing across 1mm/5mm chart paper, with seven-segment bedside readouts.', Component: HeroEcg },
  { id: 'lab', name: 'Laboratory bench ✺', description: 'Graduated borosilicate beakers filling with coloured reagent, meniscus and rising bubbles.', Component: HeroLab },
  { id: 'atom', name: 'Atom ✺', description: 'Three electron shells on separate 3D planes, each spinning with an electron riding it.', Component: HeroAtom },
  { id: 'field', name: 'Ploughed field ✺', description: 'Furrows converging on a tilted plane under a low sun, crops standing in the near rows.', Component: HeroField },
];

export const SCI_STATS: SectionVariant[] = [
  { id: 'vitals', name: 'Vitals ✺', description: 'Seven-segment readouts on chart paper, each with its own beat and pulse ring.', Component: StatsVitals },
  { id: 'wave', name: 'Waveform ✺', description: 'Each figure drives the amplitude of its own sine wave.', Component: StatsWave },
];

export const SCI_SKILLS: SectionVariant[] = [
  { id: 'periodic', name: 'Periodic table ✺', description: 'Every tool becomes an element — atomic number, two-letter symbol, grouped by category.', Component: SkillsPeriodic },
];

export const SCI_EXPERIENCE: SectionVariant[] = [
  { id: 'seasons', name: 'Sown to harvest ✺', description: 'Roles as crops growing taller through the seasons, from seedling to harvest.', Component: ExperienceSeasons },
];

export const SCI_PROJECTS: SectionVariant[] = [
  { id: 'harvest', name: 'Crop yield ✺', description: 'Work gathered as this season’s yield, each card rooted in soil.', Component: ProjectsHarvest },
];
