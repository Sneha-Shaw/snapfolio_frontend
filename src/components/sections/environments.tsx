import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
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
  galleryOf,
  groupTech,
  newestFirst,
  pickProjects,
  statementLines,
  statsOf,
  type SectionProps,
} from './shared';

/**
 * Environment motifs: sea, forest, desert, mountain, galaxy, storm, ember, sky.
 *
 * Each one is built as three layers — a ground plane, a mid layer that moves
 * with scroll or time, and an atmospheric wash on top. That separation is what
 * makes a place read as depth instead of wallpaper, and it's why each of these
 * feels different even though they share a section skeleton.
 *
 * Drawing lives in index.css (`.wave-crest`, `.treeline`, `.ridge`, `.nebula`,
 * `.rain-streaks`, `.lava-crack`, `.cloud-bank`, …).
 */

// ---------------------------------------------------------------------------
// Shared atmosphere pieces
// ---------------------------------------------------------------------------

/** Deterministic pseudo-random so layouts are stable between renders. */
function seeded(n: number, salt = 1): number {
  const x = Math.sin(n * 127.1 * salt) * 43758.5453;
  return x - Math.floor(x);
}

/** Centred hero copy, shared by every environment so the motif is the variable. */
function HeroCopy({
  profile,
  className,
  tone = 'center',
}: {
  profile: SectionProps['profile'];
  className?: string;
  tone?: 'center' | 'left';
}) {
  const lines = statementLines(profile);
  return (
    <div className={cn('relative z-10 mx-auto w-full max-w-4xl px-6', tone === 'center' && 'text-center', className)}>
      {profile?.heroEyebrow && (
        <Reveal>
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
            {profile.heroEyebrow}
          </p>
        </Reveal>
      )}
      <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-7xl">
        {lines.map((line, i) => (
          <motion.span
            key={line}
            initial={{ opacity: 0, y: 26 }}
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
          <p className={cn('mt-6 max-w-xl text-balance text-[var(--color-text-muted)]', tone === 'center' && 'mx-auto')}>
            {profile.bio.split('\n')[0]}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.45} className={cn('mt-9 flex flex-wrap gap-3', tone === 'center' && 'justify-center')}>
        <PrimaryCTA />
        <SecondaryCTA />
      </Reveal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SEA
// ---------------------------------------------------------------------------

const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  left: `${seeded(i + 1) * 96}%`,
  size: 6 + seeded(i + 1, 2) * 16,
  duration: 7 + seeded(i + 1, 3) * 8,
  delay: seeded(i + 1, 4) * 9,
}));

function BubbleField({ count = BUBBLES.length }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {BUBBLES.slice(0, count).map((b, i) => (
        <span
          key={i}
          className="bubble animate-bubble absolute bottom-0"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function HeroSea({ profile }: SectionProps) {
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden">
      {/* Water column */}
      <div className="sea-depth pointer-events-none absolute inset-0" aria-hidden />
      {/* Light net on the surface */}
      <div className="caustics pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-70" aria-hidden />
      <BubbleField />

      {/* Surface: three crest rows drifting at different speeds. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden" aria-hidden>
        {[
          { o: 0.35, d: 11, h: 'h-16' },
          { o: 0.22, d: 17, h: 'h-20' },
          { o: 0.14, d: 25, h: 'h-24' },
        ].map((w, i) => (
          <div
            key={i}
            className={cn('wave-crest animate-wave absolute inset-x-0 top-0', w.h)}
            style={{ opacity: w.o, animationDuration: `${w.d}s`, transform: `scaleY(${1 - i * 0.1})` }}
          />
        ))}
      </div>

      <HeroCopy profile={profile} className="py-28" />
    </section>
  );
}

function ProjectsDepth({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 5);
  if (projectsLoading || items.length === 0) return null;

  return (
    <section id="projects" className="relative overflow-hidden">
      <div className="sea-depth pointer-events-none absolute inset-0" aria-hidden />
      <BubbleField count={8} />
      <Section>
        <Heading eyebrow="Descent" title="Deeper water" />
        {/* Each row sinks further: less light, more blur, more indent. */}
        <div className="space-y-5">
          {items.map((project, i) => {
            const depth = i / Math.max(items.length - 1, 1);
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{ marginLeft: `${depth * 8}%`, marginRight: `${depth * 2}%` }}
              >
                <Link
                  to={`/work/${project.slug}`}
                  className="group flex items-center gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 p-4 backdrop-blur-sm transition-all duration-500 hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-elevated)]"
                >
                  {project.thumbnail?.url && (
                    <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-xl sm:block">
                      <img src={project.thumbnail.url} alt={project.title} loading="lazy" className="size-full object-cover" />
                      {/* Water absorbs colour with depth. */}
                      <span
                        className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                        style={{ background: 'var(--color-bg)', opacity: depth * 0.45 }}
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="truncate font-medium text-[var(--color-text)]">{project.title}</h3>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                        −{Math.round(120 + depth * 3800)}m
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">{project.shortDescription}</p>
                  </div>
                  <ArrowUpRight className="hidden size-4 shrink-0 text-[var(--color-text-faint)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </section>
  );
}

function SkillsBubbles({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;

  return (
    <section id="skills" className="relative overflow-hidden">
      <div className="sea-depth pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <Section>
        <Heading eyebrow="Stack" title="Surfacing" align="center" />
        <div className="space-y-7">
          {groups.map((group, gi) => (
            <div key={group.cat}>
              <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-text-faint)]">
                {group.label}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {group.items.map((tech, ti) => {
                  const size = 4.5 + seeded(gi * 20 + ti) * 2.5;
                  return (
                    <motion.span
                      key={tech._id}
                      initial={{ opacity: 0, y: 24, scale: 0.6 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.6, delay: gi * 0.07 + ti * 0.04, ease: [0.34, 1.56, 0.64, 1] }}
                      className="bubble grid place-items-center text-center text-[10px] font-medium leading-tight text-[var(--color-text)] sm:text-xs"
                      style={{ width: `${size}rem`, height: `${size}rem` }}
                    >
                      <span className="px-1">{tech.name}</span>
                    </motion.span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FOREST
// ---------------------------------------------------------------------------

function HeroForest({ profile }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  /* Nearer treelines travel further — that difference is the parallax. */
  const far = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const mid = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const near = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);

  return (
    <section ref={ref} className="relative flex min-h-[94vh] items-center overflow-hidden">
      {/* Light shafts through the canopy */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[14, 38, 63, 86].map((l, i) => (
          <div
            key={l}
            className="light-shaft absolute top-0 h-[78%] w-28 animate-fog"
            style={{ left: `${l}%`, opacity: 0.5 - i * 0.07, animationDelay: `${i * 3}s` }}
          />
        ))}
      </div>

      <HeroCopy profile={profile} className="py-28" />

      {/* Three treelines, back to front */}
      <motion.div style={{ y: far }} className="pointer-events-none absolute inset-x-0 bottom-0 h-56 text-[var(--color-accent)] opacity-20" aria-hidden>
        <div className="treeline size-full" />
      </motion.div>
      <motion.div style={{ y: mid }} className="pointer-events-none absolute inset-x-0 bottom-0 h-44 text-[var(--color-accent-strong)] opacity-40" aria-hidden>
        <div className="treeline size-full" style={{ backgroundSize: '22px 100%, 44px 100%' }} />
      </motion.div>
      <motion.div style={{ y: near }} className="pointer-events-none absolute inset-x-0 bottom-0 h-32 text-[var(--color-bg)] opacity-95" aria-hidden>
        <div className="treeline size-full" style={{ backgroundSize: '34px 100%, 68px 100%' }} />
      </motion.div>

      {/* Ground fog last so it sits in front of the trunks */}
      <div className="fog-band animate-fog pointer-events-none absolute inset-x-0 bottom-16 h-28" aria-hidden />
    </section>
  );
}

function ExperienceTrail({ experiences }: SectionProps) {
  const items = newestFirst(experiences);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 45%'] });
  const walked = useTransform(scrollYProgress, [0, 1], [0, 1]);
  if (items.length === 0) return null;

  return (
    <Section id="experience">
      <Heading eyebrow="The trail" title="Where it led" align="center" />
      <div ref={ref} className="relative">
        {/* The path itself: an SVG curve that draws as you scroll. */}
        <svg
          className="pointer-events-none absolute left-1/2 top-0 h-full w-24 -translate-x-1/2 overflow-visible"
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M50 0 C 18 120, 82 240, 50 360 S 18 600, 50 720 S 82 900, 50 1000"
            fill="none"
            stroke="var(--color-border-hover)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
          <motion.path
            d="M50 0 C 18 120, 82 240, 50 360 S 18 600, 50 720 S 82 900, 50 1000"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ pathLength: walked }}
          />
        </svg>

        <div className="relative space-y-12 py-4">
          {items.map((exp, i) => (
            <div key={exp._id} className={cn('flex', i % 2 ? 'justify-end' : 'justify-start')}>
              <Reveal delay={i * 0.05} className="w-full sm:w-[44%]">
                <div className={cn(cardClass, 'p-5')}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                    Marker {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 font-medium text-[var(--color-text)]">{exp.position}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{exp.company}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-faint)]">
                    {new Date(exp.startDate).getFullYear()} —{' '}
                    {exp.current ? 'present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function GalleryDappled({ projects }: SectionProps) {
  const items = useMemo(() => galleryOf(projects, 9), [projects]);
  if (items.length === 0) return null;

  return (
    <Section>
      <Heading eyebrow="Gallery" title="Through the canopy" align="center" />
      <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={`${item.slug}-${item.url}`} delay={i * 0.05}>
            <Link to={`/work/${item.slug}`} title={item.title} className="group relative block overflow-hidden rounded-xl">
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Leaf shadow falling across the print. */}
              <span className="dappled pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" aria-hidden />
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="fog-band pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// DESERT
// ---------------------------------------------------------------------------

function HeroDesert({ profile }: SectionProps) {
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden">
      {/* Low sun behind the ridge */}
      <div className="sun-disc pointer-events-none absolute left-1/2 top-[22%] size-52 -translate-x-1/2 opacity-80" aria-hidden />

      <div className="animate-haze relative w-full">
        <HeroCopy profile={profile} className="py-28" />
      </div>

      {/* Overlapping dunes — each one a cropped ellipse, wider and lower. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] overflow-hidden" aria-hidden>
        {[
          { w: '150%', h: '70%', left: '-25%', bottom: '18%', o: 0.35 },
          { w: '170%', h: '62%', left: '-42%', bottom: '4%', o: 0.55 },
          { w: '160%', h: '50%', left: '10%', bottom: '-8%', o: 0.8 },
        ].map((d, i) => (
          <div
            key={i}
            className="dune absolute"
            style={{ width: d.w, height: d.h, left: d.left, bottom: d.bottom, opacity: d.o }}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectsMirage({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 6);
  if (projectsLoading || items.length === 0) return null;

  return (
    <Section id="projects">
      <Heading eyebrow="Work" title="On the horizon" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project, i) => (
          <Reveal key={project._id} delay={i * 0.07}>
            <Link to={`/work/${project.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl">
                {project.thumbnail?.url && (
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                )}
                {/* The mirage: a heat-shimmered reflection hanging below. */}
                <span
                  aria-hidden
                  className="animate-haze pointer-events-none absolute inset-x-0 bottom-0 h-1/3 opacity-60 blur-[3px]"
                  style={{
                    background: 'linear-gradient(to top, var(--color-accent-soft), transparent)',
                  }}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="truncate font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                  {project.title}
                </h3>
                <span className="shrink-0 font-mono text-xs text-[var(--color-text-faint)]">{project.year}</span>
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
// MOUNTAIN
// ---------------------------------------------------------------------------

function HeroMountain({ profile }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const back = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const front = useTransform(scrollYProgress, [0, 1], ['0%', '26%']);

  return (
    <section ref={ref} className="relative flex min-h-[94vh] items-center overflow-hidden">
      <div className="contour pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <HeroCopy profile={profile} className="py-28" />

      <motion.div style={{ y: back }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] opacity-45" aria-hidden>
        <div className="ridge ridge-far size-full" />
      </motion.div>
      <motion.div style={{ y: front }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]" aria-hidden>
        <div className="ridge size-full" />
        {/* Snow on the two highest peaks. */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            clipPath: 'polygon(30% 34%, 36% 28%, 43% 44%, 36% 40%)',
            background: 'color-mix(in srgb, var(--color-text) 85%, transparent)',
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            clipPath: 'polygon(54% 40%, 58% 34%, 64% 50%, 58% 46%)',
            background: 'color-mix(in srgb, var(--color-text) 80%, transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}

/** Peaks readable at a glance need roughly this much column width each. */
const MAX_PEAKS = 9;

function ExperienceAscent({ experiences }: SectionProps) {
  // Unbounded columns collapse: at 20 real roles each got ~70px, truncating
  // every label to three letters. Cap it, keeping the climb's shape — the
  // earliest and the most recent roles, evenly sampled between.
  const sorted = [...experiences].sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
  const items =
    sorted.length <= MAX_PEAKS
      ? sorted
      : sorted.filter((_, i) => i % Math.ceil(sorted.length / MAX_PEAKS) === 0 || i === sorted.length - 1);
  if (items.length === 0) return null;

  /* Each role is a peak; later roles sit higher, so the row reads as a climb. */
  const points = items.map((exp, i) => ({
    exp,
    height: 28 + ((i + 1) / items.length) * 62,
  }));

  return (
    <Section id="experience">
      <Heading eyebrow="Ascent" title="The climb" />
      <div className="contour relative overflow-hidden rounded-2xl border border-[var(--color-border)] p-6 pt-14 sm:p-8 sm:pt-16">
        <div className="flex items-end gap-3 sm:gap-5" style={{ minHeight: '17rem' }}>
          {points.map(({ exp, height }, i) => (
            <motion.div
              key={exp._id}
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: `${height}%`, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex-1"
            >
              {/* The peak */}
              <div
                className="size-full border-t-2 border-[var(--color-accent)] bg-gradient-to-t from-transparent to-[var(--color-accent-soft)] transition-colors group-hover:to-[var(--color-accent)]/30"
                style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
              />
              {/* Summit marker + label */}
              <div className="absolute inset-x-0 -top-1 flex justify-center">
                <span className="size-2 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)]" />
              </div>
              {/* Rotated so a real word fits a narrow column instead of "Hac…". */}
              <div className="absolute -top-11 left-1/2 w-24 -translate-x-1/2 -rotate-[30deg] text-center sm:w-28">
                <p className="truncate text-[10px] font-medium text-[var(--color-text)]">{exp.position}</p>
                <p className="text-[9px] text-[var(--color-text-faint)]">{new Date(exp.startDate).getFullYear()}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--color-border)] pt-4">
          {points.map(({ exp }) => (
            <span key={exp._id} className="text-xs text-[var(--color-text-muted)]">
              <span className="text-[var(--color-accent)]">▲</span> {exp.company}
            </span>
          ))}
          {sorted.length > items.length && (
            <span className="text-xs text-[var(--color-text-faint)]">
              +{sorted.length - items.length} more roles
            </span>
          )}
        </div>
      </div>
    </Section>
  );
}

function StatsAltitude(props: SectionProps) {
  const stats = statsOf(props);
  if (stats.length === 0) return null;

  return (
    <Section>
      <div className="contour grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
        {stats.slice(0, 4).map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.07}>
            <div className="h-full bg-[var(--color-bg)]/70 p-6 backdrop-blur-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                {String((i + 1) * 1000 + 240).padStart(4, '0')} m
              </p>
              <p className="tabular mt-3 text-4xl font-semibold text-[var(--color-text)]">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// GALAXY
// ---------------------------------------------------------------------------

const STARS = Array.from({ length: 90 }, (_, i) => ({
  left: `${seeded(i + 1) * 100}%`,
  top: `${seeded(i + 1, 2) * 100}%`,
  size: 1 + seeded(i + 1, 3) * 2,
  delay: seeded(i + 1, 4) * 4,
}));

function Starfield({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div className="nebula absolute inset-[-10%] opacity-70" />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-[var(--color-text)]"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
      {/* Two shooting stars on long, offset loops. */}
      {[
        { top: '18%', delay: 3, dur: 11 },
        { top: '62%', delay: 8, dur: 14 },
      ].map((sh) => (
        <motion.span
          key={sh.top}
          className="shooting-star absolute h-px w-40"
          style={{ top: sh.top }}
          initial={{ left: '-12%', opacity: 0 }}
          animate={{ left: ['-12%', '110%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, delay: sh.delay, repeat: Infinity, repeatDelay: sh.dur, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function HeroGalaxy({ profile }: SectionProps) {
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden">
      <Starfield />
      <HeroCopy profile={profile} className="py-28" />
    </section>
  );
}

function ProjectsConstellation({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 6);
  if (projectsLoading || items.length === 0) return null;

  /* Nodes on a wandering path, joined in sequence like a star chart. */
  const nodes = items.map((project, i) => ({
    project,
    x: 12 + (i / Math.max(items.length - 1, 1)) * 76,
    y: 22 + seeded(i + 3, 5) * 56,
  }));

  return (
    <section id="projects" className="relative overflow-hidden">
      <Starfield className="opacity-80" />
      <Section>
        <Heading eyebrow="Star chart" title="The constellation" align="center" />
        <div className="relative aspect-[16/10] w-full">
          {/* Joining lines */}
          <svg className="absolute inset-0 size-full overflow-visible" aria-hidden>
            {nodes.slice(0, -1).map((n, i) => {
              const next = nodes[i + 1]!;
              return (
                <motion.line
                  key={n.project._id}
                  x1={`${n.x}%`}
                  y1={`${n.y}%`}
                  x2={`${next.x}%`}
                  y2={`${next.y}%`}
                  stroke="var(--color-accent)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.55 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.14 }}
                />
              );
            })}
          </svg>

          {nodes.map(({ project, x, y }, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.14, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <Link to={`/work/${project.slug}`} className="group flex flex-col items-center gap-2">
                <span className="size-3 rounded-full bg-[var(--color-accent)] shadow-[0_0_16px_4px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] transition-transform group-hover:scale-150" />
                <span className="max-w-28 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/85 px-2 py-1 text-center text-[10px] font-medium text-[var(--color-text)] opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 sm:opacity-100">
                  {project.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>
    </section>
  );
}

// ---------------------------------------------------------------------------
// STORM
// ---------------------------------------------------------------------------

function HeroStorm({ profile }: SectionProps) {
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden">
      {/* Lightning sheet behind everything, on a long irregular cycle. */}
      <div className="lightning-sheet animate-flash pointer-events-none absolute inset-0" aria-hidden />
      <div className="rain-streaks animate-rain pointer-events-none absolute inset-0" aria-hidden />
      <div className="wet-glass pointer-events-none absolute inset-0 opacity-70" aria-hidden />

      <HeroCopy profile={profile} className="py-28" />
    </section>
  );
}

function TestimonialsDroplets({ profile }: SectionProps) {
  const quotes = profile?.testimonials ?? [];
  if (quotes.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="rain-streaks animate-rain pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <Section>
        <Heading eyebrow="Word of mouth" title="Against the glass" align="center" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 0.07}>
              <figure className="wet-glass relative h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/50 p-6 backdrop-blur-md">
                <p className="relative text-sm leading-relaxed text-[var(--color-text)]">&ldquo;{t.quote}&rdquo;</p>
                <figcaption className="relative mt-5 border-t border-[var(--color-border)] pt-4">
                  <p className="text-sm font-medium text-[var(--color-text)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-text-faint)]">{[t.role, t.company].filter(Boolean).join(', ')}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}

// ---------------------------------------------------------------------------
// EMBER
// ---------------------------------------------------------------------------

const SPARKS = Array.from({ length: 22 }, (_, i) => ({
  left: `${seeded(i + 7) * 100}%`,
  size: 2 + seeded(i + 7, 2) * 3,
  duration: 5 + seeded(i + 7, 3) * 6,
  delay: seeded(i + 7, 4) * 7,
  drift: `${(seeded(i + 7, 5) - 0.5) * 90}px`,
}));

function SparkField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="spark animate-ember absolute bottom-0"
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            ['--ember-drift' as string]: s.drift,
          }}
        />
      ))}
    </div>
  );
}

function HeroEmber({ profile }: SectionProps) {
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden">
      <div className="ember-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="lava-crack pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-80" aria-hidden />
      <SparkField />
      <HeroCopy profile={profile} className="py-28" />
    </section>
  );
}

function StatsMagma(props: SectionProps) {
  const stats = statsOf(props);
  if (stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="ember-glow pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <SparkField />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.slice(0, 4).map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 p-6 backdrop-blur-sm">
                <div className="lava-crack pointer-events-none absolute inset-0 opacity-50" aria-hidden />
                <p className="tabular relative text-4xl font-semibold text-[var(--color-accent)]">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="relative mt-1 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SKY
// ---------------------------------------------------------------------------

function HeroSky({ profile }: SectionProps) {
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden">
      <div className="sun-rays pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-60" aria-hidden />
      {/* Three cloud banks drifting at different rates and heights. */}
      {[
        { top: '14%', dur: 52, o: 0.9, h: 'h-40' },
        { top: '42%', dur: 38, o: 0.65, h: 'h-32' },
        { top: '68%', dur: 64, o: 0.5, h: 'h-48' },
      ].map((c, i) => (
        <div
          key={i}
          className={cn('cloud-bank animate-cloud pointer-events-none absolute inset-x-[-15%]', c.h)}
          style={{ top: c.top, opacity: c.o, animationDuration: `${c.dur}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}
          aria-hidden
        />
      ))}
      <HeroCopy profile={profile} className="py-28" />
    </section>
  );
}

function AboutSky({ profile }: SectionProps) {
  const areas = (profile?.focusAreas ?? []).slice(0, 6);
  return (
    <section id="about" className="relative overflow-hidden">
      {[
        { top: '10%', dur: 46, o: 0.5 },
        { top: '60%', dur: 60, o: 0.35 },
      ].map((c, i) => (
        <div
          key={i}
          className="cloud-bank animate-cloud pointer-events-none absolute inset-x-[-15%] h-40"
          style={{ top: c.top, opacity: c.o, animationDuration: `${c.dur}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}
          aria-hidden
        />
      ))}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">About</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
              {profile?.headline || 'Room to think'}
            </h2>
          </Reveal>
          {profile?.aboutText && (
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-[var(--color-text-muted)]">
                {profile.aboutText.split('\n').filter(Boolean).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          )}
          {areas.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {areas.map((area, i) => (
                <Reveal key={area} delay={0.15 + i * 0.06}>
                  <span className="animate-float-slow rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 px-4 py-2 text-sm text-[var(--color-text)] backdrop-blur" style={{ animationDelay: `${i * 0.7}s` }}>
                    {area}
                  </span>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const ENV_HERO: SectionVariant[] = [
  { id: 'sea', name: 'Deep sea ✺', description: 'Drifting surface crests, a light-caustic net, rising bubbles and a crushing depth gradient.', Component: HeroSea },
  { id: 'forest', name: 'Forest ✺', description: 'Three parallax treelines, shafts of canopy light and ground fog that drifts.', Component: HeroForest },
  { id: 'desert', name: 'Desert dunes ✺', description: 'Overlapping dune ridges under a low sun, with a real heat-shimmer on the type.', Component: HeroDesert },
  { id: 'mountain', name: 'Mountain ✺', description: 'Parallax ridge silhouettes with snow caps over a topographic contour ground.', Component: HeroMountain },
  { id: 'galaxy', name: 'Galaxy ✺', description: 'Nebula clouds, ninety twinkling stars and shooting stars on long offset loops.', Component: HeroGalaxy },
  { id: 'storm', name: 'Storm ✺', description: 'Falling rain on wet glass with a double-strike lightning sheet behind it.', Component: HeroStorm },
  { id: 'ember', name: 'Ember ✺', description: 'Molten fissures across the floor with sparks drifting up through the dark.', Component: HeroEmber },
  { id: 'sky', name: 'Open sky ✺', description: 'Sun rays and three cloud banks drifting at different heights and speeds.', Component: HeroSky },
];

export const ENV_ABOUT: SectionVariant[] = [
  { id: 'sky', name: 'Open sky ✺', description: 'Centred copy between drifting cloud banks, focus areas floating as pills.', Component: AboutSky },
];

export const ENV_PROJECTS: SectionVariant[] = [
  { id: 'depth', name: 'Descent ✺', description: 'Rows sink deeper — indenting, dimming and losing colour, each tagged with a depth.', Component: ProjectsDepth },
  { id: 'mirage', name: 'Mirage ✺', description: 'Cards with a heat-shimmered reflection hanging beneath them.', Component: ProjectsMirage },
  { id: 'constellation', name: 'Star chart ✺', description: 'Projects as stars on a wandering path, joined by lines that draw in sequence.', Component: ProjectsConstellation },
];

export const ENV_SKILLS: SectionVariant[] = [
  { id: 'bubbles', name: 'Bubbles ✺', description: 'Every tool is a glass bubble, sized at random, surfacing by category.', Component: SkillsBubbles },
];

export const ENV_EXPERIENCE: SectionVariant[] = [
  { id: 'trail', name: 'Forest trail ✺', description: 'A winding SVG path that draws as you scroll, roles pinned as trail markers.', Component: ExperienceTrail },
  { id: 'ascent', name: 'Ascent ✺', description: 'An elevation profile — each role is a peak, and they get higher as you climb.', Component: ExperienceAscent },
];

export const ENV_STATS: SectionVariant[] = [
  { id: 'altitude', name: 'Altitude ✺', description: 'Figures on contour-lined panels, each marked with an elevation.', Component: StatsAltitude },
  { id: 'magma', name: 'Magma ✺', description: 'Glowing figures on cracked, backlit plates with sparks rising past.', Component: StatsMagma },
];

export const ENV_TESTIMONIALS: SectionVariant[] = [
  { id: 'droplets', name: 'Rain glass ✺', description: 'Quotes on frosted panes streaked with rain and clinging droplets.', Component: TestimonialsDroplets },
];

export const ENV_GALLERY: SectionVariant[] = [
  { id: 'dappled', name: 'Dappled ✺', description: 'A grid under leaf shadow that lifts off the image on hover.', Component: GalleryDappled },
];
