import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Battery, Command, Signal, Wifi } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SectionVariant } from './shared';
import {
  Avatar,
  CountUp,
  Heading,
  PrimaryCTA,
  Reveal,
  SecondaryCTA,
  Section,
  galleryOf,
  groupTech,
  initials,
  newestFirst,
  pickProjects,
  servicesOf,
  statementLines,
  statsOf,
  type SectionProps,
} from './shared';

/**
 * Concept motifs, part two: the made objects — comic book, computer and
 * keyboard, phone, painting.
 *
 * Same rule as the organic set: the object has to hold the content, not frame
 * it. Keycaps are the tools you actually use; comic panels are the projects;
 * the phone's lock screen is your intro; the gallery wall is your work hung
 * and captioned. The drawing lives in index.css — `.halftone`, `.ink-panel`,
 * `.keycap`, `.phone-bezel`, `.gilt-frame` and friends.
 */

// ---------------------------------------------------------------------------
// COMIC BOOK
// ---------------------------------------------------------------------------

function HeroComic({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative overflow-hidden">
      <div className="halftone halftone-fade pointer-events-none absolute inset-0 opacity-[0.16]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Cover furniture: issue box and price, like a real comic masthead. */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <span className="ink-panel px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--color-text)]">
            Issue #1 · Origin story
          </span>
          {profile?.availability && (
            <span className="ink-panel ink-panel-accent px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--color-text)]">
              {profile.availability}
            </span>
          )}
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <h1 className="ink-title text-[clamp(2.75rem,9vw,6rem)] font-black uppercase leading-[0.86] tracking-tight">
              {lines.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, x: -40, rotate: -3 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Caption box — the yellow narration strip of the genre. */}
            {profile?.bio && (
              <Reveal delay={0.35}>
                <p className="ink-panel mt-8 max-w-lg -rotate-1 p-4 text-sm font-medium leading-relaxed text-[var(--color-text)]">
                  {profile.bio.split('\n')[0]}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-3">
              <PrimaryCTA />
              <SecondaryCTA />
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            {/* Starburst behind the portrait, the classic cover device. */}
            <motion.div
              aria-hidden
              initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="burst absolute -inset-6 animate-spin-slow"
            />
            <div className="ink-panel relative rotate-2 overflow-hidden">
              <Avatar profile={profile} className="aspect-[4/5] w-full" />
            </div>
            {/* Sound-effect sticker. */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="ink-panel ink-panel-accent absolute -bottom-4 -left-4 -rotate-12 bg-[var(--color-accent)] px-4 py-2 text-lg font-black uppercase italic tracking-tight text-[var(--color-on-accent)]"
            >
              Ka-pow!
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsComic({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 6);
  if (projectsLoading || items.length === 0) return null;

  /* Uneven panel spans are what stops a comic page looking like a CSS grid. */
  const spans = ['sm:col-span-2 sm:row-span-2', '', '', 'sm:col-span-2', '', ''];

  return (
    <Section id="projects">
      <Heading eyebrow="Case files" title="The adventures" />
      <div className="grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((project, i) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 24, rotate: i % 2 ? 1.5 : -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className={cn('group', spans[i] ?? '')}
          >
            <Link
              to={`/work/${project.slug}`}
              className="ink-panel relative flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
            >
              {project.thumbnail?.url && (
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="halftone pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply" aria-hidden />
                </div>
              )}
              {/* Narration strip at the foot of the panel. */}
              <div className="border-t-[2.5px] border-[var(--color-text)] bg-[var(--color-bg-elevated-2)] p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)]">
                  Panel {String(i + 1).padStart(2, '0')} · {project.year}
                </p>
                <p className="mt-1 font-black uppercase leading-tight text-[var(--color-text)]">{project.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-muted)]">{project.shortDescription}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function TestimonialsComic({ profile }: SectionProps) {
  const quotes = profile?.testimonials ?? [];
  if (quotes.length === 0) return null;

  return (
    <Section>
      <Heading eyebrow="Word on the street" title="What they say" align="center" />
      <div className="halftone-fade relative">
        <div className="grid gap-8 sm:grid-cols-2">
          {quotes.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 0.07}>
              <figure>
                {/* Balloon with a clipped tail so the ink border wraps it. */}
                <blockquote
                  className={cn(
                    'ink-panel balloon-tail relative rounded-[1.75rem] bg-[var(--color-bg-elevated)] p-6 text-[var(--color-text)]',
                    i % 2 ? 'rotate-1' : '-rotate-1'
                  )}
                >
                  <p className="text-sm font-medium leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 pl-6">
                  <span className="grid size-9 place-items-center rounded-full border-[2.5px] border-[var(--color-text)] bg-[var(--color-accent)] text-xs font-black text-[var(--color-on-accent)]">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[var(--color-text)]">{t.name}</p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                      {[t.role, t.company].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function StatsComic(props: SectionProps) {
  const stats = statsOf(props);
  if (stats.length === 0) return null;

  return (
    <Section>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.slice(0, 4).map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.07}>
            <div className="relative grid aspect-square place-items-center">
              <div className="burst absolute inset-0 opacity-90" aria-hidden />
              <div className="relative text-center">
                <p className="text-4xl font-black text-[var(--color-on-accent)]">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mx-auto mt-1 max-w-[7rem] text-[10px] font-black uppercase leading-tight tracking-wider text-[var(--color-on-accent)]">
                  {stat.label}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// COMPUTER & KEYBOARD
// ---------------------------------------------------------------------------

function SkillsKeycaps({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  const [pressed, setPressed] = useState<string | null>(null);
  if (groups.length === 0) return null;

  return (
    <Section id="skills">
      <Heading eyebrow="Stack" title="Daily drivers" align="center" />

      {/* The deck: a brushed aluminium case holding one row per category. */}
      <div className="key-deck mx-auto max-w-4xl rounded-2xl border border-[var(--color-border)] p-4 shadow-[var(--shadow-card)] sm:p-6">
        <div className="space-y-4">
          {groups.map((group, gi) => (
            <div key={group.cat}>
              <p className="mb-2 pl-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                {group.label}
              </p>
              {/* Each row is offset like a real staggered keyboard. */}
              <div className="flex flex-wrap gap-2" style={{ paddingLeft: `${(gi % 3) * 0.75}rem` }}>
                {group.items.map((tech, ti) => (
                  <motion.button
                    key={tech._id}
                    type="button"
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.3, delay: gi * 0.06 + ti * 0.02 }}
                    onPointerDown={() => setPressed(tech._id)}
                    onPointerUp={() => setPressed(null)}
                    onPointerLeave={() => setPressed((p) => (p === tech._id ? null : p))}
                    data-pressed={pressed === tech._id}
                    className="keycap px-3.5 py-2.5 text-xs font-semibold text-[var(--color-text)]"
                  >
                    {tech.name}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}

          {/* Spacebar row, for the silhouette. */}
          <div className="flex items-center gap-2 pt-1">
            <span className="keycap grid h-10 w-14 place-items-center text-[10px] font-semibold text-[var(--color-text-faint)]">
              <Command className="size-3.5" />
            </span>
            <span className="keycap h-10 flex-1" />
            <span className="keycap grid h-10 w-14 place-items-center text-[10px] font-semibold text-[var(--color-text-faint)]">
              alt
            </span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-[var(--color-text-faint)]">Press a key.</p>
    </Section>
  );
}

function HeroDesktop({ profile, projects }: SectionProps) {
  const lines = statementLines(profile);
  const latest = projects[0];

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden py-20">
      <div className="mx-auto w-full max-w-5xl px-6">
        {/* A desktop OS window holding the introduction. */}
        <Reveal>
          <div className="crt-scanlines screen-glare relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card-hover)]">
            {/* Title bar */}
            <div className="relative z-[3] flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-4 py-2.5">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="mx-auto truncate font-mono text-[11px] text-[var(--color-text-faint)]">
                {profile?.name || 'portfolio'} — README
              </span>
            </div>

            <div className="relative z-[3] grid gap-8 p-7 sm:p-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <div>
                {profile?.heroEyebrow && (
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent)]">
                    {profile.heroEyebrow}
                  </p>
                )}
                <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-[var(--color-text)] sm:text-6xl">
                  {lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                {profile?.bio && (
                  <p className="mt-6 max-w-lg text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryCTA />
                  <SecondaryCTA />
                </div>
              </div>

              {/* Side panel: a file-listing of the latest work. */}
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-mono text-[11px]">
                <p className="text-[var(--color-text-faint)]">~/work</p>
                <ul className="mt-2 space-y-1.5">
                  {projects.slice(0, 5).map((p) => (
                    <li key={p._id} className="flex items-center justify-between gap-2">
                      <Link to={`/work/${p.slug}`} className="truncate text-[var(--color-text)] hover:text-[var(--color-accent)]">
                        {p.slug}
                      </Link>
                      <span className="shrink-0 text-[var(--color-text-faint)]">{p.year}</span>
                    </li>
                  ))}
                </ul>
                {latest && (
                  <p className="mt-3 border-t border-[var(--color-border)] pt-3 text-[var(--color-text-faint)]">
                    last modified: {latest.title}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Dock */}
        <Reveal delay={0.3}>
          <div className="mx-auto mt-6 flex w-fit items-end gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 p-2 backdrop-blur">
            {(profile?.focusAreas ?? []).slice(0, 6).map((area, i) => (
              <span
                key={area}
                title={area}
                className="grid size-11 place-items-center rounded-xl bg-[var(--color-accent-soft)] text-[10px] font-semibold text-[var(--color-accent)] transition-transform duration-200 hover:-translate-y-2"
                style={{ transitionDelay: `${i * 10}ms` }}
              >
                {area.slice(0, 2).toUpperCase()}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectsWindows({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 4);
  if (projectsLoading || items.length === 0) return null;

  return (
    <Section id="projects">
      <Heading eyebrow="Work" title="Open windows" />
      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((project, i) => (
          <Reveal key={project._id} delay={i * 0.08}>
            <Link
              to={`/work/${project.slug}`}
              className="screen-glare group relative block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="relative z-[3] flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-3 py-2">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 truncate font-mono text-[10px] text-[var(--color-text-faint)]">
                  {project.slug}.app
                </span>
              </div>
              {project.thumbnail?.url && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="relative z-[3] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-[var(--color-text)]">{project.title}</h3>
                  <ArrowUpRight className="size-4 shrink-0 text-[var(--color-text-faint)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-text-muted)]">{project.shortDescription}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// PHONE
// ---------------------------------------------------------------------------

/** Device shell: bezel, notch, status bar. Children fill the screen. */
function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('phone-bezel relative mx-auto w-full max-w-[19rem] p-2.5', className)}>
      <div className="screen-glare relative aspect-[9/19.5] overflow-hidden rounded-[2rem] bg-[var(--color-bg)]">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black/80" aria-hidden />
        {/* Status bar */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-2.5 text-[10px] font-semibold text-[var(--color-text)]">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <Signal className="size-3" />
            <Wifi className="size-3" />
            <Battery className="size-3.5" />
          </span>
        </div>
        <div className="relative z-[5] h-full overflow-hidden pt-12">{children}</div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-[var(--color-text)]/40" aria-hidden />
      </div>
    </div>
  );
}

function HeroPhone({ profile, projects }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                {profile.heroEyebrow}
              </p>
            </Reveal>
          )}
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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

        {/* Lock screen: the intro arrives as notifications. */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: -4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="animate-float-slow"
        >
          <PhoneFrame>
            <div className="flex h-full flex-col px-3 pb-6">
              <div className="pt-4 text-center">
                <Avatar profile={profile} className="mx-auto size-16 rounded-full ring-2 ring-[var(--color-accent)]" />
                <p className="mt-3 text-lg font-semibold text-[var(--color-text)]">{profile?.name || 'Portfolio'}</p>
                <p className="text-[11px] text-[var(--color-text-faint)]">{profile?.headline}</p>
              </div>

              <div className="mt-5 space-y-2 overflow-hidden">
                {projects.slice(0, 4).map((p, i) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.16 }}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/90 p-3 backdrop-blur"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] font-semibold text-[var(--color-text)]">{p.title}</p>
                      <span className="shrink-0 text-[9px] text-[var(--color-text-faint)]">{p.year}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[var(--color-text-muted)]">
                      {p.shortDescription}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </PhoneFrame>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectsPhone({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 6);
  const [active, setActive] = useState(0);
  if (projectsLoading || items.length === 0) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <Section id="projects">
      <Heading
        eyebrow="Work"
        title="On device"
        action={
          <div className="hidden gap-1.5 sm:flex">
            {items.map((p, i) => (
              <button
                key={p._id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${p.title}`}
                aria-current={i === active}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === active ? 'w-7 bg-[var(--color-accent)]' : 'w-1.5 bg-[var(--color-border-hover)] hover:bg-[var(--color-text-faint)]'
                )}
              />
            ))}
          </div>
        }
      />

      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <PhoneFrame>
          {current?.thumbnail?.url ? (
            <motion.img
              key={current._id}
              src={current.thumbnail.url}
              alt={current.title}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center text-xs text-[var(--color-text-faint)]">No preview</div>
          )}
        </PhoneFrame>

        <div className="space-y-2">
          {items.map((project, i) => (
            <button
              key={project._id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all duration-300',
                i === active
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)]'
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className={cn('font-medium', i === active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]')}>
                  {project.title}
                </p>
                <span className="shrink-0 font-mono text-xs text-[var(--color-text-faint)]">{project.year}</span>
              </div>
              {i === active && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">{project.shortDescription}</p>
                  <Link
                    to={`/work/${project.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]"
                  >
                    Open case study <ArrowUpRight className="size-3.5" />
                  </Link>
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ContactChat({ profile, socialLinks }: SectionProps) {
  const email = profile?.email || 'hello@example.com';
  /* A short scripted thread — the last bubble is the call to action. */
  const thread: { from: 'them' | 'me'; text: string }[] = [
    { from: 'them', text: 'Hey — saw your portfolio. Are you taking on work?' },
    { from: 'me', text: profile?.availability || 'Yes, currently open to new projects.' },
    { from: 'them', text: 'Perfect. What is the best way to reach you?' },
    { from: 'me', text: email },
  ];

  return (
    <section id="contact">
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">Contact</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
              Start the thread.
            </h2>
            <p className="mt-4 max-w-md text-[var(--color-text-muted)]">
              {profile?.heroCurrently || 'Send a message and I will get back to you.'}
            </p>
            <a
              href={`mailto:${email}`}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-medium text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] transition-colors hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]"
            >
              {email}
            </a>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((l) => (
                  <a
                    key={l._id}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                  >
                    {l.label || l.platform}
                  </a>
                ))}
              </div>
            )}
          </Reveal>

          <PhoneFrame>
            <div className="flex h-full flex-col gap-2.5 px-3 pb-8 pt-2">
              {thread.map((msg, i) => (
                <motion.div
                  key={msg.text}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.35 }}
                  className={cn('max-w-[82%]', msg.from === 'me' ? 'self-end' : 'self-start')}
                >
                  <p
                    className={cn(
                      'break-words rounded-2xl px-3.5 py-2 text-[11px] leading-snug',
                      msg.from === 'me'
                        ? 'rounded-br-md bg-[var(--color-accent)] text-[var(--color-on-accent)]'
                        : 'rounded-bl-md bg-[var(--color-bg-elevated-2)] text-[var(--color-text)]'
                    )}
                  >
                    {msg.text}
                  </p>
                </motion.div>
              ))}
              <span className="mt-auto flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md bg-[var(--color-bg-elevated-2)] px-3 py-2">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="size-1.5 rounded-full bg-[var(--color-text-faint)]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                  />
                ))}
              </span>
            </div>
          </PhoneFrame>
        </div>
      </Section>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAINTING
// ---------------------------------------------------------------------------

function GalleryMuseum({ projects }: SectionProps) {
  const items = galleryOf(projects, 8);
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Wall wash from the picture lights above. */}
      <div className="picture-light pointer-events-none absolute inset-x-0 top-0 h-2/3" aria-hidden />
      <Section>
        <Heading eyebrow="Exhibition" title="The collection" align="center" />

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={`${item.slug}-${item.url}`} delay={i * 0.06}>
              <figure className="group">
                {/* Picture light fixture. */}
                <div className="mx-auto mb-3 h-4 w-14" aria-hidden>
                  <div className="mx-auto h-1.5 w-10 rounded-t-full bg-[var(--color-accent)] opacity-70" />
                  <div className="mx-auto h-2 w-px bg-[var(--color-border-hover)]" />
                </div>
                <Link to={`/work/${item.slug}`} className="block">
                  <div className="gilt-frame canvas-tooth overflow-hidden bg-[var(--color-bg-elevated)] transition-transform duration-500 group-hover:scale-[1.02]">
                    <img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                </Link>
                {/* Museum plaque. */}
                <figcaption className="mx-auto mt-4 w-fit max-w-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-center">
                  <p className="truncate text-xs font-medium tracking-wide text-[var(--color-text)]">{item.title}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                    Plate {String(i + 1).padStart(2, '0')}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}

function AboutPalette({ profile }: SectionProps) {
  const services = servicesOf(profile).slice(0, 7);

  /* Blob positions on the palette's thumb-hole curve. */
  const blobs = [
    { left: '20%', top: '24%', size: 74 },
    { left: '44%', top: '15%', size: 62 },
    { left: '66%', top: '22%', size: 70 },
    { left: '80%', top: '44%', size: 58 },
    { left: '66%', top: '66%', size: 66 },
    { left: '40%', top: '72%', size: 60 },
    { left: '18%', top: '52%', size: 68 },
  ];

  return (
    <Section id="about">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">The palette</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
            {profile?.headline || 'What I work in'}
          </h2>
          {profile?.aboutText && (
            <div className="mt-5 space-y-4 text-[var(--color-text-muted)]">
              {profile.aboutText.split('\n').filter(Boolean).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          )}
          <ul className="mt-7 space-y-2.5">
            {services.map((s, i) => (
              <li key={s.title} className="flex items-start gap-3">
                <span
                  className="paint-blob mt-1 size-3.5 shrink-0"
                  style={{ background: i % 2 ? 'var(--color-accent-strong)' : 'var(--color-accent)' }}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{s.title}</p>
                  {s.description && <p className="text-xs text-[var(--color-text-muted)]">{s.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The palette itself: a rounded board with a thumb hole and wet dabs. */}
        <div className="relative mx-auto aspect-[5/4] w-full max-w-md">
          <div
            className="canvas-tooth absolute inset-0 bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card-hover)]"
            style={{ borderRadius: '48% 52% 46% 54% / 56% 44% 56% 44%' }}
            aria-hidden
          />
          <span
            className="absolute left-[14%] top-[62%] size-[14%] rounded-full bg-[var(--color-bg)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]"
            aria-hidden
          />
          {services.map((s, i) => {
            const blob = blobs[i % blobs.length]!;
            return (
              <motion.span
                key={s.title}
                title={s.title}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                className="paint-blob absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: blob.left,
                  top: blob.top,
                  width: blob.size,
                  height: blob.size * 0.86,
                  background:
                    i % 3 === 0
                      ? 'var(--color-accent)'
                      : i % 3 === 1
                        ? 'var(--color-accent-strong)'
                        : 'color-mix(in srgb, var(--color-accent) 55%, var(--color-text))',
                }}
              />
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function ExperienceCanvas({ experiences }: SectionProps) {
  const items = newestFirst(experiences);
  if (items.length === 0) return null;

  return (
    <Section id="experience">
      <Heading eyebrow="Provenance" title="Body of work" />
      <div className="space-y-5">
        {items.map((exp, i) => (
          <Reveal key={exp._id} delay={i * 0.05}>
            <article className="group relative overflow-hidden border-l-2 border-[var(--color-border)] pl-6 transition-colors hover:border-[var(--color-accent)]">
              {/* Brush stroke wash that sweeps in on hover. */}
              <span
                aria-hidden
                className="brush-stroke pointer-events-none absolute inset-y-0 left-0 w-0 bg-[var(--color-accent-soft)] transition-all duration-700 group-hover:w-full"
              />
              <div className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-text)]">{exp.position}</h3>
                  <p className="text-sm text-[var(--color-accent)]">{exp.company}</p>
                </div>
                <p className="font-mono text-xs text-[var(--color-text-faint)]">
                  {new Date(exp.startDate).getFullYear()} —{' '}
                  {exp.current ? 'present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                </p>
              </div>
              {exp.description && (
                <p className="relative pb-4 text-sm text-[var(--color-text-muted)]">{exp.description.split('\n')[0]}</p>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const OBJECT_HERO: SectionVariant[] = [
  { id: 'comic', name: 'Comic cover ✺', description: 'Ben-Day halftone, inked display type with hard offset, starburst portrait and a KA-POW sticker.', Component: HeroComic },
  { id: 'desktop', name: 'Desktop OS ✺', description: 'A scan-lined application window holding the intro, with a file listing of recent work and a dock.', Component: HeroDesktop },
  { id: 'phone', name: 'Lock screen ✺', description: 'A floating handset whose notifications stack up as your latest projects.', Component: HeroPhone },
];

export const OBJECT_ABOUT: SectionVariant[] = [
  { id: 'palette', name: "Painter's palette ✺", description: 'Disciplines as wet dabs of paint on a thumb-holed palette board.', Component: AboutPalette },
];

export const OBJECT_PROJECTS: SectionVariant[] = [
  { id: 'comic', name: 'Comic panels ✺', description: 'Uneven inked panels with halftone overlays and narration strips.', Component: ProjectsComic },
  { id: 'windows', name: 'App windows ✺', description: 'Every project framed as its own titled application window.', Component: ProjectsWindows },
  { id: 'phone', name: 'On device ✺', description: 'Screens inside a handset, switched from a list beside it.', Component: ProjectsPhone },
];

export const OBJECT_EXPERIENCE: SectionVariant[] = [
  { id: 'canvas', name: 'Provenance ✺', description: 'Gallery-label rows with a brush-stroke wash that sweeps across on hover.', Component: ExperienceCanvas },
];

export const OBJECT_SKILLS: SectionVariant[] = [
  { id: 'keycaps', name: 'Keycaps ✺', description: 'A staggered mechanical keyboard — every tool is a sculpted cap that travels when pressed.', Component: SkillsKeycaps },
];

export const OBJECT_STATS: SectionVariant[] = [
  { id: 'comic', name: 'Power bursts ✺', description: 'Figures punched into spinning comic starbursts.', Component: StatsComic },
];

export const OBJECT_TESTIMONIALS: SectionVariant[] = [
  { id: 'comic', name: 'Speech balloons ✺', description: 'Inked balloons with clipped tails over a halftone field.', Component: TestimonialsComic },
];

export const OBJECT_GALLERY: SectionVariant[] = [
  { id: 'museum', name: 'Gallery wall ✺', description: 'Gilt-framed canvases under picture lights, each with an engraved plaque.', Component: GalleryMuseum },
];

export const OBJECT_CONTACT: SectionVariant[] = [
  { id: 'chat', name: 'Message thread ✺', description: 'A scripted conversation on a handset that ends with your address.', Component: ContactChat },
];
