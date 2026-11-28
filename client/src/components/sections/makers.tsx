import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Fuel, Gauge, Music } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SectionVariant } from './shared';
import {
  CountUp,
  Heading,
  PrimaryCTA,
  Reveal,
  SecondaryCTA,
  Section,
  groupTech,
  newestFirst,
  pickProjects,
  statementLines,
  statsOf,
  yearsOfExperience,
  type SectionProps,
} from './shared';

/**
 * Maker set (✺) — instrument, car, book.
 *
 * Playable, drivable, readable. The piano keys depress, the tachometer needle
 * sweeps to a real figure and hits its red line, the book opens on a gutter
 * shadow with a proper drop cap. Material work is in index.css —
 * `.piano-white`, `.fretboard`, `.eq-bar`, `.carbon`, `.tacho`, `.odo-drum`,
 * `.book-cloth`, `.book-paper`, `.fore-edge`, `.gutter-shadow`, `.drop-cap`.
 */

// ---------------------------------------------------------------------------
// MUSIC
// ---------------------------------------------------------------------------

/** One octave: seven naturals, with the five accidentals laid over the gaps. */
const NATURALS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
/** Offsets (in white-key widths) where a black key sits. No key after E or B. */
const ACCIDENTALS = [0, 1, 3, 4, 5];

function Keybed({
  octaves = 2,
  labels,
  onPress,
}: {
  octaves?: number;
  labels?: string[];
  onPress?: (label: string) => void;
}) {
  const [pressed, setPressed] = useState<string | null>(null);
  const whiteCount = NATURALS.length * octaves;

  return (
    <div className="relative w-full" style={{ perspective: '700px' }}>
      {/* Naturals */}
      <div className="flex h-[clamp(5rem,16vw,9rem)] gap-[2px]">
        {Array.from({ length: whiteCount }, (_, i) => {
          const label = labels?.[i];
          const id = `w${i}`;
          return (
            <button
              key={id}
              type="button"
              title={label}
              onPointerDown={() => {
                setPressed(id);
                if (label) onPress?.(label);
              }}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed((p) => (p === id ? null : p))}
              data-pressed={pressed === id}
              className="piano-white relative flex-1 pb-2"
            >
              <span className="absolute inset-x-0 bottom-1.5 truncate px-0.5 text-[clamp(5px,0.75vw,10px)] font-semibold text-black/55">
                {label ?? NATURALS[i % NATURALS.length]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Accidentals, positioned over the seams between naturals. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[62%]">
        {Array.from({ length: octaves }, (_, o) =>
          ACCIDENTALS.map((offset) => {
            const unit = 100 / whiteCount;
            const left = (o * NATURALS.length + offset + 1) * unit;
            const id = `b${o}-${offset}`;
            return (
              <button
                key={id}
                type="button"
                onPointerDown={() => setPressed(id)}
                onPointerUp={() => setPressed(null)}
                onPointerLeave={() => setPressed((p) => (p === id ? null : p))}
                data-pressed={pressed === id}
                className="piano-black pointer-events-auto absolute top-0 h-full"
                style={{ left: `${left}%`, width: `${unit * 0.62}%`, translate: '-50% 0' }}
                aria-hidden
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function HeroPiano({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="mx-auto w-full max-w-5xl px-6">
        {/* Title set on a stave, like a score's headline. */}
        <div className="relative mb-14">
          <div className="stave pointer-events-none absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 opacity-30" aria-hidden />
          <div className="relative text-center">
            {profile?.heroEyebrow && (
              <Reveal>
                <p className="mb-4 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                  <Music className="size-4 text-[var(--color-accent)]" />
                  {profile.heroEyebrow}
                </p>
              </Reveal>
            )}
            <h1 className="text-4xl font-semibold leading-[1] tracking-tight text-[var(--color-text)] sm:text-6xl">
              {lines.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.11, ease: [0.16, 1, 0.3, 1] }}
                  className="block bg-[var(--color-bg)] px-4"
                >
                  {line}
                </motion.span>
              ))}
            </h1>
          </div>
        </div>

        {profile?.bio && (
          <Reveal delay={0.3}>
            <p className="mx-auto max-w-xl text-center text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>
          </Reveal>
        )}
        <Reveal delay={0.4} className="mt-8 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </Reveal>

        {/* The keybed, in its case. */}
        <Reveal delay={0.25}>
          <div className="mt-14 rounded-xl bg-gradient-to-b from-[#1a1a1f] to-[#0c0c0f] p-3 shadow-[0_26px_50px_-24px_rgba(0,0,0,0.8)] sm:p-4">
            <div className="mb-2 h-1 rounded-full bg-[var(--color-accent)]/30" aria-hidden />
            <Keybed octaves={2} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SkillsFretboard({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  const [plucked, setPlucked] = useState<string | null>(null);
  if (groups.length === 0) return null;

  /* Six strings, like a guitar — categories are assigned to them in order. */
  const strings = groups.slice(0, 6);

  return (
    <Section id="skills">
      <Heading eyebrow="Stack" title="Six strings" align="center" />
      <div className="fretboard relative mx-auto max-w-4xl overflow-hidden rounded-xl p-5 sm:p-7">
        {/* Inlay dots at the usual positions. */}
        <div className="pointer-events-none absolute inset-0 flex items-center" aria-hidden>
          {[3, 5, 7, 9].map((f) => (
            <span
              key={f}
              className="absolute size-2.5 rounded-full bg-white/25"
              style={{ left: `${f * 11 - 5.5}%`, top: '50%', translate: '-50% -50%' }}
            />
          ))}
        </div>

        <div className="relative space-y-3">
          {strings.map((group, si) => (
            <div key={group.cat} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-white/50">
                {group.label}
              </span>
              <div className="relative flex-1">
                {/* The string itself — thicker for the lower ones. */}
                <span
                  className={cn('guitar-string absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full', plucked === group.cat && 'animate-string')}
                  style={{ height: `${1 + (strings.length - si) * 0.35}px` }}
                  aria-hidden
                />
                <div className="relative flex flex-wrap gap-1.5 py-1">
                  {group.items.map((tech) => (
                    <button
                      key={tech._id}
                      type="button"
                      onPointerDown={() => setPlucked(group.cat)}
                      onPointerUp={() => setPlucked(null)}
                      onPointerLeave={() => setPlucked((p) => (p === group.cat ? null : p))}
                      className="rounded bg-black/55 px-2 py-1 text-[11px] font-medium text-white/85 ring-1 ring-white/10 transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)]"
                    >
                      {tech.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 text-center text-xs text-[var(--color-text-faint)]">Hold a fret to make the string ring.</p>
    </Section>
  );
}

function StatsEqualizer(props: SectionProps) {
  const stats = statsOf(props).slice(0, 5);
  if (stats.length === 0) return null;
  const peak = Math.max(...stats.map((s) => s.value));

  return (
    <Section>
      <Heading eyebrow="Levels" title="On the meters" align="center" />
      <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-b from-[#16161b] to-[#0a0a0d] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex h-56 items-end justify-center gap-3 sm:gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3">
              {/* Column of segments; the lit height tracks the value. */}
              <div className="relative flex w-full flex-1 items-end">
                <motion.div
                  className="eq-bar animate-eq w-full rounded-sm"
                  style={{ animationDelay: `${i * 0.18}s` }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${Math.max((stat.value / peak) * 100, 14)}%` }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Tick scale down the side. */}
                <div
                  className="pointer-events-none absolute inset-y-0 -left-2 w-1"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 12px)',
                  }}
                  aria-hidden
                />
              </div>
              <p className="tabular text-lg font-semibold text-[var(--color-accent)]">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="w-full break-words text-center text-[10px] uppercase leading-tight tracking-wider text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// CAR
// ---------------------------------------------------------------------------

/** Rev counter with a real red line at the top of its sweep. */
function Tacho({ value, max, label, size = 168 }: { value: number; max: number; label: string; size?: number }) {
  const fraction = max > 0 ? Math.min(value / max, 1) : 0;
  /* The usable sweep is 216° of the 270° arc — the rest is red line. */
  const needleAngle = -135 + fraction * 216;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="dial-ticks absolute inset-0" aria-hidden />
        <motion.div
          className="tacho absolute inset-2"
          style={{ ['--rev' as string]: fraction }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          aria-hidden
        />
        <motion.div
          className="needle absolute bottom-1/2 left-1/2 w-2 origin-bottom"
          style={{ height: size * 0.36 }}
          initial={{ rotate: -135, x: '-50%' }}
          whileInView={{ rotate: needleAngle, x: '-50%' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.6, ease: [0.34, 1.2, 0.4, 1] }}
          aria-hidden
        />
        <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1c1c22] ring-2 ring-white/15" aria-hidden />
        <div className="absolute inset-x-0 bottom-4 text-center">
          <p className="tabular text-2xl font-bold leading-none text-white">
            <CountUp to={value} />
          </p>
          <p className="mt-0.5 text-[9px] uppercase tracking-widest text-white/40">{label}</p>
        </div>
      </div>
    </div>
  );
}

function HeroCockpit(props: SectionProps) {
  const { profile, projects, experiences, technologies } = props;
  const lines = statementLines(profile);
  const years = yearsOfExperience(experiences);
  const odo = String(projects.length).padStart(6, '0');

  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                {profile.heroEyebrow}
              </p>
            </Reveal>
          )}
          <h1 className="text-5xl font-semibold uppercase leading-[0.94] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
        </div>

        {/* Instrument binnacle on a carbon fascia. */}
        <Reveal delay={0.2}>
          <div className="carbon rounded-2xl p-6 shadow-[var(--shadow-card-hover)] sm:p-8">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <Tacho value={years} max={Math.max(years + 3, 10)} label="years" size={132} />
              <Tacho value={technologies.length} max={Math.max(technologies.length + 6, 30)} label="tools" size={168} />
            </div>

            {/* Mechanical odometer. */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/40">
                <Gauge className="size-3" /> total
              </span>
              <div className="flex gap-[2px]">
                {odo.split('').map((d, i) => (
                  <motion.span
                    key={i}
                    className="odo-drum grid h-8 w-6 place-items-center rounded font-mono text-sm font-bold text-white"
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}
                  >
                    {d}
                  </motion.span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/40">
                <Fuel className="size-3" /> {profile?.availability ? 'full' : 'res'}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatsDashboard(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;

  return (
    <Section>
      <div className="carbon rounded-2xl p-7 sm:p-9">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <Tacho
                value={stat.value}
                max={Math.max(stat.value + Math.ceil(stat.value * 0.35) + 2, 10)}
                label={stat.label}
                size={144}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// BOOK
// ---------------------------------------------------------------------------

function HeroBook({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="book-cloth gilt-rule relative mx-auto rounded-r-lg rounded-l-sm p-3 sm:p-4">
          {/* Ribbon marker hanging out of the top. */}
          <span className="ribbon-mark absolute -top-4 right-[18%] z-20 h-16 w-5" aria-hidden />

          <div className="relative grid grid-cols-1 sm:grid-cols-2">
            {/* Fore-edge: the stack of sheets, visible on the outside. */}
            <span className="fore-edge absolute -left-1.5 inset-y-3 w-1.5 rounded-l" aria-hidden />
            <span className="fore-edge absolute -right-1.5 inset-y-3 w-1.5 rounded-r" aria-hidden />

            {/* Verso */}
            <div className="book-paper relative rounded-l-sm p-7 sm:p-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/45">{profile?.heroEyebrow || 'Frontispiece'}</p>
              <h1 className="mt-6 font-serif text-3xl font-bold leading-tight tracking-tight text-black/85 sm:text-4xl">
                {lines.map((line, i) => (
                  <motion.span
                    key={line}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: i * 0.12 }}
                    className="block"
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>
              <p className="mt-8 text-xs italic text-black/50">{profile?.headline}</p>
              <p className="absolute bottom-5 left-7 text-[10px] text-black/35 sm:left-10">i</p>
            </div>

            {/* Recto */}
            <div className="book-paper relative rounded-r-sm p-7 sm:p-10">
              {profile?.bio && (
                <p className="drop-cap text-sm leading-relaxed text-black/70">{profile.bio.split('\n')[0]}</p>
              )}
              {(profile?.focusAreas ?? []).length > 0 && (
                <ul className="mt-6 space-y-1.5">
                  {(profile?.focusAreas ?? []).slice(0, 5).map((area, i) => (
                    <li key={area} className="flex items-baseline gap-2 text-xs text-black/60">
                      <span className="font-serif font-bold text-black/40">{i + 1}.</span>
                      {area}
                    </li>
                  ))}
                </ul>
              )}
              <p className="absolute bottom-5 right-7 text-[10px] text-black/35 sm:right-10">ii</p>
            </div>

            {/* The gutter, drawn over both pages. */}
            <span className="gutter-shadow pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 sm:block" aria-hidden />
          </div>
        </div>

        <Reveal delay={0.5} className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </Reveal>
      </div>
    </section>
  );
}

function ProjectsChapters({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 8);
  if (projectsLoading || items.length === 0) return null;

  return (
    <Section id="projects">
      <Heading eyebrow="Contents" title="Chapters" />
      <div className="book-paper rounded-lg p-7 sm:p-10">
        <p className="mb-7 text-center font-serif text-lg font-bold uppercase tracking-[0.25em] text-black/70">
          Table of Contents
        </p>
        <ol className="space-y-1">
          {items.map((project, i) => (
            <Reveal key={project._id} delay={i * 0.04}>
              <li>
                <Link to={`/work/${project.slug}`} className="group flex items-baseline gap-3 py-2">
                  <span className="shrink-0 font-serif text-sm font-bold text-black/45">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="shrink-0 font-serif text-base text-black/80 transition-colors group-hover:text-[var(--color-accent-strong)]">
                    {project.title}
                  </span>
                  {/* Dot leaders, the way a real contents page sets them. */}
                  <span
                    className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-black/30"
                    aria-hidden
                  />
                  <span className="shrink-0 font-serif text-sm text-black/50">{project.year}</span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function AboutPage({ profile, experiences }: SectionProps) {
  const items = newestFirst(experiences).slice(0, 3);
  return (
    <Section id="about">
      <div className="book-paper relative rounded-lg p-8 sm:p-12">
        <p className="mb-6 text-center text-[10px] uppercase tracking-[0.35em] text-black/40">
          Chapter one — {profile?.headline || 'About'}
        </p>
        <div className="mx-auto max-w-2xl">
          {profile?.aboutText && (
            <div className="space-y-4 text-sm leading-relaxed text-black/70">
              {profile.aboutText.split('\n').filter(Boolean).map((p, i) => (
                <p key={p} className={cn(i === 0 && 'drop-cap')}>
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Marginalia: recent roles set as footnotes. */}
          {items.length > 0 && (
            <div className="mt-9 border-t border-black/15 pt-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-black/40">Notes</p>
              <ol className="space-y-1">
                {items.map((exp, i) => (
                  <li key={exp._id} className="text-[11px] italic text-black/55">
                    <sup className="mr-1 not-italic font-bold">{i + 1}</sup>
                    {exp.position}, {exp.company} ({new Date(exp.startDate).getFullYear()}
                    {exp.current ? '– ' : exp.endDate ? `–${new Date(exp.endDate).getFullYear()}` : ''})
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        <BookOpen className="absolute bottom-5 right-6 size-4 text-black/20" aria-hidden />
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const MAKER_HERO: SectionVariant[] = [
  { id: 'piano', name: 'Piano ✺', description: 'Title set on a five-line stave above a two-octave keybed whose keys actually depress.', Component: HeroPiano },
  { id: 'cockpit', name: 'Cockpit ✺', description: 'A carbon-weave binnacle with rev counters that sweep to their red line and a mechanical odometer.', Component: HeroCockpit },
  { id: 'book', name: 'Open book ✺', description: 'A cloth-bound volume with gilt rule, fore-edge, ribbon marker, gutter shadow and a printed drop cap.', Component: HeroBook },
];

export const MAKER_ABOUT: SectionVariant[] = [
  { id: 'page', name: 'Printed page ✺', description: 'Your story set as chapter one, with a drop cap and roles as footnotes.', Component: AboutPage },
];

export const MAKER_SKILLS: SectionVariant[] = [
  { id: 'fretboard', name: 'Fretboard ✺', description: 'Six strings on rosewood with nickel frets and inlays; hold a fret and the string rings.', Component: SkillsFretboard },
];

export const MAKER_STATS: SectionVariant[] = [
  { id: 'equalizer', name: 'Equaliser ✺', description: 'Figures as bouncing EQ columns against a tick scale.', Component: StatsEqualizer },
  { id: 'dashboard', name: 'Rev counters ✺', description: 'A carbon fascia of gauges, each needle settling past its own sweep.', Component: StatsDashboard },
];

export const MAKER_PROJECTS: SectionVariant[] = [
  { id: 'chapters', name: 'Contents page ✺', description: 'Work as a typeset table of contents with dot leaders and page years.', Component: ProjectsChapters },
];
