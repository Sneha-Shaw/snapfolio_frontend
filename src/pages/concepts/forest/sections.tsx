import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Compass, Github, Leaf, Linkedin, Mail, MapPin, Sprout, TreePine, Twitter, Wind, Link as LinkIcon } from 'lucide-react';
import { groupTech, pickProjects, statementLines, yearsOfExperience } from '@/components/sections/shared';
import type { Experience, Profile, Project, SocialLink, SocialPlatform, Technology } from '@/types/models';

/**
 * Forest — section components.
 *
 * Ten sections, each answering the brief's own question before being written:
 * why does it exist, what should it feel like, how does it hand off to the
 * next one. The throughline is depth (arrival's dense canopy → the exit's
 * parting treeline) and a small vocabulary of recurring shapes — the organic
 * blob, the torn photo edge, the trunk ring — reused deliberately so the page
 * reads as one authored place rather than ten unrelated demos.
 *
 * Material and atmosphere CSS lives in ../forest.css, scoped under
 * `.forest-page` so none of it can leak into, or be affected by, the site's
 * shared theme.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Small deterministic pseudo-random generator — stable across re-renders,
 *  unlike Math.random(), so hover/selection state doesn't reshuffle layout. */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const PLATFORM_ICONS: Record<SocialPlatform, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  twitter: Twitter,
  portfolio: LinkIcon,
  other: LinkIcon,
};

// ---------------------------------------------------------------------------
// Shared: real trees, and the trail that runs through every section.
//
// These two are what actually make the page read as a forest and as a walk
// through it, rather than a dark-green template — everything else builds on
// top of them, so they come before the sections that use them.
// ---------------------------------------------------------------------------

type TreeSpecies = 'pine' | 'round';

/** One depth layer of trees: same two hand-authored silhouettes, varied
 *  per-instance so a row of the same species doesn't read as one stamped
 *  pattern — scale, lean and species mix all come off `rand(seed + i)`. */
function ForestTreeRow({
  seed,
  count,
  layerClass,
  heightClass,
  opacity = 1,
}: {
  seed: number;
  count: number;
  layerClass: string;
  heightClass: string;
  opacity?: number;
}) {
  const trees = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const cell = 100 / count;
        const species: TreeSpecies = rand(seed + i * 7) > 0.52 ? 'pine' : 'round';
        return {
          left: `${i * cell + cell / 2 + (rand(seed + i) - 0.5) * cell * 0.8}%`,
          scale: 0.72 + rand(seed + i + 31) * 0.56,
          skew: (rand(seed + i + 62) - 0.5) * 8,
          species,
        };
      }),
    [seed, count]
  );

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 bottom-0 overflow-hidden ${layerClass}`} style={{ opacity }} aria-hidden>
      {trees.map((t, i) => (
        <div
          key={i}
          className={`absolute bottom-0 ${heightClass} aspect-[0.52]`}
          style={{ left: t.left, transform: `translateX(-50%) scale(${t.scale}) skewX(${t.skew}deg)`, transformOrigin: 'bottom center' }}
        >
          <div className={`absolute inset-x-0 top-0 ${t.species === 'pine' ? 'forest-pine' : 'forest-round'}`} style={{ height: '80%', background: 'currentColor' }} />
          <div className="forest-trunk absolute inset-x-0 bottom-0 left-[42%] w-[16%]" style={{ height: '24%' }} />
        </div>
      ))}
    </div>
  );
}

/** One planting of the trail texture. `x` is a percentage offset so
 *  consecutive sections can zigzag it left/right/centre rather than every
 *  section repeating the same straight line down the middle. */
function ForestTrailSegment({ x = '50%', width = 72, opacity = 0.5 }: { x?: string; width?: number; opacity?: number }) {
  return (
    <div
      className="forest-trail pointer-events-none absolute inset-y-0"
      style={{ left: x, width, transform: 'translateX(-50%)', opacity }}
      aria-hidden
    />
  );
}

// ---------------------------------------------------------------------------
// 1. ARRIVAL — hero
// ---------------------------------------------------------------------------

const SPORES = Array.from({ length: 16 }, (_, i) => ({
  left: `${rand(i + 1) * 96}%`,
  size: 3 + rand(i + 9) * 5,
  duration: 14 + rand(i + 21) * 16,
  delay: rand(i + 33) * 18,
  drift: `${(rand(i + 45) - 0.5) * 60}px`,
}));

export function ForestArrival({ profile }: { profile: Profile | null }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const back = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);
  const midFar = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const midNear = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const front = useTransform(scrollYProgress, [0, 1], ['0%', '38%']);

  const lines = statementLines(profile);
  const now = new Date();

  return (
    <section ref={ref} className="forest-arrival-sky relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Depth: four rows of real trees — dense and hazy at the back, a few
          large individual trees up front — a mist band, light shafts, a
          trail already receding into the woods, and drifting spores. */}
      <motion.div style={{ y: back }} className="absolute inset-x-0 bottom-0 h-[20svh]">
        <ForestTreeRow seed={1} count={22} layerClass="forest-layer-far" heightClass="h-full" />
      </motion.div>
      <motion.div style={{ y: midFar }} className="absolute inset-x-0 bottom-0 h-[16svh]">
        <ForestTreeRow seed={2} count={16} layerClass="forest-layer-mid-far" heightClass="h-full" opacity={0.92} />
      </motion.div>
      <motion.div style={{ y: midNear }} className="absolute inset-x-0 bottom-0 h-[12svh]">
        <ForestTreeRow seed={3} count={10} layerClass="forest-layer-mid-near" heightClass="h-full" opacity={0.95} />
      </motion.div>

      {/* The trail, already leading in — the first sign this page is a walk. */}
      <ForestTrailSegment x="50%" width={140} opacity={0.4} />

      <motion.div style={{ y: front }} className="absolute inset-x-0 bottom-0 h-[9svh] z-[1]">
        <ForestTreeRow seed={4} count={6} layerClass="forest-layer-near" heightClass="h-full" />
      </motion.div>

      <div className="forest-shaft pointer-events-none absolute inset-y-0 left-[28%] z-[1] w-32 animate-[forest-shaft-drift_11s_ease-in-out_infinite]" aria-hidden />
      <div className="forest-shaft pointer-events-none absolute inset-y-0 left-[62%] z-[1] w-24 animate-[forest-shaft-drift_16s_ease-in-out_infinite]" style={{ animationDelay: '4s' }} aria-hidden />
      <div className="forest-mist pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2 animate-[forest-drift-a_26s_ease-in-out_infinite]" aria-hidden />

      {SPORES.map((s, i) => (
        <span
          key={i}
          className="forest-spore pointer-events-none absolute bottom-0"
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            animation: `forest-rise ${s.duration}s linear infinite`,
            animationDelay: `${s.delay}s`,
            ['--spore-drift' as string]: s.drift,
          }}
          aria-hidden
        />
      ))}

      <div className="forest-grain" />
      <div className="forest-vignette pointer-events-none absolute inset-0" aria-hidden />

      {/* Minimal wordmark + exit, top corners — the only chrome this page has. */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <Link to="/" className="forest-mono text-xs tracking-[0.2em] text-[var(--forest-ink-muted)] transition-colors hover:text-[var(--forest-ink)]">
          {(profile?.name || 'PORTFOLIO').toUpperCase()}
        </Link>
        <span className="forest-compass flex items-center gap-2 rounded-full px-3.5 py-1.5">
          <Compass className="size-3.5 text-[var(--forest-amber)]" />
          <span className="forest-label">{profile?.location || 'Unknown coordinates'}</span>
        </span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="forest-label mb-6"
        >
          {profile?.heroEyebrow || 'A field journal · software engineer'}
        </motion.p>

        <h1 className="forest-serif text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[1.03] tracking-tight text-[var(--forest-ink)]">
          {lines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 26, rotateX: -12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease: EASE }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        {profile?.bio && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="mx-auto mt-7 max-w-lg text-balance text-[var(--forest-ink-muted)]"
          >
            {profile.bio.split('\n')[0]}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#discoveries"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--forest-amber)] px-6 text-sm font-medium text-[#241a08] transition-transform hover:-translate-y-0.5"
          >
            Enter the grove
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href="#clearing"
            className="inline-flex h-12 items-center rounded-full border border-[var(--forest-rule)] px-6 text-sm text-[var(--forest-ink-muted)] transition-colors hover:border-[var(--forest-moss)] hover:text-[var(--forest-ink)]"
          >
            Read the field notes
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2"
      >
        <span className="forest-label">{now.getFullYear()} edition</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[var(--forest-ink-faint)]"
        >
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. THE CLEARING — concept intro + personal story
// ---------------------------------------------------------------------------

export function ForestClearing({ profile, experiences }: { profile: Profile | null; experiences: Experience[] }) {
  const areas = (profile?.focusAreas ?? []).slice(0, 6);
  return (
    <section id="clearing" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-[10%] top-[15%] size-72 rounded-full bg-[var(--forest-moss-soft)] blur-[90px]" />
        <div className="absolute bottom-[10%] right-[8%] size-80 rounded-full bg-[rgba(219,168,71,0.06)] blur-[100px]" />
      </div>
      <ForestTrailSegment x="41%" width={90} opacity={0.22} />
      <div className="forest-grain" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mx-auto aspect-[4/5] w-full max-w-sm"
        >
          <div className="absolute -inset-6 rounded-full bg-[var(--forest-moss-soft)] blur-2xl" aria-hidden />
          {profile?.profileImage?.url ? (
            <img src={profile.profileImage.url} alt={profile.name || 'Portrait'} className="forest-portrait-mask relative size-full object-cover" />
          ) : (
            <div className="forest-portrait-mask relative grid size-full place-items-center bg-[var(--forest-elevated)] text-4xl text-[var(--forest-moss)]">
              <TreePine className="size-16" />
            </div>
          )}
        </motion.div>

        <div>
          <p className="forest-label mb-4">01 · The clearing</p>
          <h2 className="forest-serif text-3xl font-medium leading-tight tracking-tight text-[var(--forest-ink)] sm:text-4xl">
            {profile?.headline || 'Why a forest, and who this is'}
          </h2>

          {profile?.aboutText && (
            <div className="mt-7 space-y-4 text-[var(--forest-ink-muted)]">
              {profile.aboutText
                .split('\n')
                .filter(Boolean)
                .map((p, i) => (
                  <p key={p} className={i === 0 ? 'forest-clearing text-base leading-relaxed' : 'text-base leading-relaxed'}>
                    {p}
                  </p>
                ))}
            </div>
          )}

          {areas.length > 0 && (
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {areas.map((area, i) => (
                <motion.li
                  key={area}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="forest-specimen flex items-center gap-2 pl-3 text-sm text-[var(--forest-ink-muted)]"
                >
                  <Leaf className="size-3.5 shrink-0 text-[var(--forest-moss)]" />
                  {area}
                </motion.li>
              ))}
            </ul>
          )}

          <p className="forest-label mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
            {profile?.heroCurrently && (
              <span className="flex items-center gap-2">
                <span className="size-1.5 animate-pulse rounded-full bg-[var(--forest-moss)]" />
                {profile.heroCurrently}
              </span>
            )}
            {yearsOfExperience(experiences) > 0 && <span>{yearsOfExperience(experiences)}+ years in the field</span>}
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. DISCOVERIES — project explorer, laid out along a path
// ---------------------------------------------------------------------------

export function ForestDiscoveries({ projects, projectsLoading }: { projects: Project[]; projectsLoading?: boolean }) {
  const items = useMemo(() => pickProjects(projects, 6), [projects]);
  if (projectsLoading || items.length === 0) return null;

  return (
    <section id="discoveries" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="forest-label mb-4">02 · Discoveries</p>
        <h2 className="forest-serif text-3xl font-medium tracking-tight text-[var(--forest-ink)] sm:text-4xl">
          Found along the path
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--forest-ink-muted)]">
          Selected work, in the order it was made — not sorted into a grid, but come across the way a walk turns up things worth stopping for.
        </p>
      </div>

      <div className="relative mx-auto mt-20 max-w-4xl px-6">
        <ForestTrailSegment x="50%" width={56} opacity={0.6} />
        <div className="relative space-y-20 sm:space-y-28">
          {items.map((project, i) => {
            const right = i % 2 === 1;
            return (
              <div key={project._id} className={`relative flex ${right ? 'sm:justify-end' : 'sm:justify-start'}`}>
                <span
                  className="forest-sighting-pin absolute left-1/2 top-8 hidden size-2.5 -translate-x-1/2 rounded-full sm:block"
                  aria-hidden
                />
                <motion.div
                  initial={{ opacity: 0, x: right ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="w-full sm:w-[46%]"
                >
                  <Link to={`/work/${project.slug}`} className="group block">
                    {project.thumbnail?.url && (
                      <div className="forest-sighting overflow-hidden">
                        <img
                          src={project.thumbnail.url}
                          alt={project.title}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <p className="forest-label mt-4">Sighting Nº {String(i + 1).padStart(2, '0')} · {project.year}</p>
                    <h3 className="forest-serif mt-1.5 text-xl text-[var(--forest-ink)] transition-colors group-hover:text-[var(--forest-amber)]">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[var(--forest-ink-muted)]">{project.shortDescription}</p>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. A CLOSER LOOK — single case-study spotlight
// ---------------------------------------------------------------------------

export function ForestCloserLook({ projects, projectsLoading }: { projects: Project[]; projectsLoading?: boolean }) {
  const featured = useMemo(() => pickProjects(projects, 1)[0], [projects]);
  if (projectsLoading || !featured) return null;
  const notes = [
    { label: 'Challenge', body: featured.challenges },
    { label: 'Approach', body: featured.solution },
    { label: 'Outcome', body: featured.results },
  ].filter((n) => n.body);
  if (notes.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <ForestTrailSegment x="58%" width={90} opacity={0.18} />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: EASE }}
          className="forest-sighting overflow-hidden"
        >
          {featured.thumbnail?.url && (
            <img src={featured.thumbnail.url} alt={featured.title} className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full" />
          )}
        </motion.div>

        <div>
          <p className="forest-label mb-4">03 · A closer look</p>
          <h2 className="forest-serif text-3xl font-medium tracking-tight text-[var(--forest-ink)] sm:text-4xl">{featured.title}</h2>
          <p className="mt-3 text-[var(--forest-ink-muted)]">{featured.shortDescription}</p>

          <div className="relative mt-10 pl-8">
            <svg className="absolute inset-y-0 left-0 w-8 overflow-visible" aria-hidden>
              <motion.line
                x1="4" y1="0" x2="4" y2="100%"
                className="forest-root-line"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE }}
              />
            </svg>
            <div className="space-y-8">
              {notes.map((note, i) => (
                <motion.div
                  key={note.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  className="relative"
                >
                  <span className="absolute -left-8 top-1 size-2 -translate-x-1/2 rounded-full bg-[var(--forest-amber)]" aria-hidden />
                  <p className="forest-label">{note.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--forest-ink-muted)]">{note.body}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <Link
            to={`/work/${featured.slug}`}
            className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-[var(--forest-amber)]"
          >
            Read the full log
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5. THE GROVE — skills, as clustered organic patches
// ---------------------------------------------------------------------------

export function ForestGrove({ technologies }: { technologies: Technology[] }) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <ForestTrailSegment x="50%" width={140} opacity={0.14} />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="forest-label mb-4">04 · The grove</p>
        <h2 className="forest-serif text-3xl font-medium tracking-tight text-[var(--forest-ink)] sm:text-4xl">
          What I grow with
        </h2>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-5xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, gi) => (
          <motion.div
            key={group.cat}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: gi * 0.08, ease: EASE }}
            className="forest-clearing-patch min-h-52 p-6"
          >
            <p className="forest-signpost forest-label mb-4">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.slice(0, 10).map((tech, ti) => (
                <span
                  key={tech._id}
                  className="forest-leaf-chip px-3 py-1.5 text-xs font-medium text-[var(--forest-ink)]"
                  style={{ rotate: `${(rand(gi * 20 + ti) - 0.5) * 6}deg` }}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 6. RINGS — experience timeline as a trunk cross-section
// ---------------------------------------------------------------------------

const MAX_RINGS = 8;

export function ForestRings({ experiences }: { experiences: Experience[] }) {
  const sorted = useMemo(() => [...experiences].sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate)), [experiences]);
  // Same lesson as the rest of the site this session: an unbounded ring count
  // collapses into an unreadable smear. Sample evenly, keep first and last.
  const items = useMemo(
    () => (sorted.length <= MAX_RINGS ? sorted : sorted.filter((_, i) => i % Math.ceil(sorted.length / MAX_RINGS) === 0 || i === sorted.length - 1)),
    [sorted]
  );
  // `active`'s initial value can only reflect whatever `items` is on first
  // render — and that render happens before the fetch resolves, so `items`
  // is empty and this would otherwise capture -1 forever (items[-1] is
  // undefined, not a wrap-around, so reading .startDate off it crashes the
  // instant real data arrives). Default to 0 and snap to "most recent" once,
  // the first time real data shows up, instead of trusting the initializer.
  const [active, setActive] = useState(0);
  const snapped = useRef(false);
  useEffect(() => {
    if (!snapped.current && items.length > 0) {
      snapped.current = true;
      setActive(items.length - 1);
    }
  }, [items.length]);
  if (items.length === 0) return null;
  const clampedActive = Math.min(active, items.length - 1);
  const selected = items[clampedActive];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="forest-label mb-4">05 · Growth rings</p>
        <h2 className="forest-serif text-3xl font-medium tracking-tight text-[var(--forest-ink)] sm:text-4xl">
          A cross-section of the work
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl items-center gap-14 px-6 lg:grid-cols-[1fr_1fr]">
        {/*
          The trunk face itself already reads as a cut log — its bark texture
          bakes in concentric rings. Markers used to be solid discs at each
          ring's own radius, but a disc that size sits on top of every smaller
          one before it, so the largest (last) role silently absorbed every
          click anywhere on the trunk. Real, independently clickable targets
          instead: one dot per role, spiralling outward — position marks time
          (further out = more recent) without any element covering another.
        */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="forest-trunk-face absolute inset-0" aria-hidden />
          {items.map((exp, i) => {
            const t = items.length > 1 ? i / (items.length - 1) : 1;
            const angle = -90 + t * 300;
            const radius = 16 + t * 34; // percent from centre, spiralling out
            const rad = (angle * Math.PI) / 180;
            const size = 14 + t * 14;
            return (
              <button
                key={exp._id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${exp.position} at ${exp.company}`}
                aria-pressed={i === clampedActive}
                data-active={i === clampedActive}
                className="forest-ring-mark absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--forest-amber)]"
                style={{
                  left: `${50 + Math.cos(rad) * radius}%`,
                  top: `${50 + Math.sin(rad) * radius}%`,
                  width: size,
                  height: size,
                }}
              />
            );
          })}
          <span className="forest-ring-pith absolute left-1/2 top-1/2 size-[10%] -translate-x-1/2 -translate-y-1/2" aria-hidden />
        </div>

        <motion.div key={selected?._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="forest-label">
            Ring Nº {String(clampedActive + 1).padStart(2, '0')} · {new Date(selected!.startDate).getFullYear()}
            {selected!.current ? ' — present' : selected!.endDate ? `–${new Date(selected!.endDate).getFullYear()}` : ''}
          </p>
          <h3 className="forest-serif mt-2 text-2xl text-[var(--forest-ink)]">{selected!.position}</h3>
          <p className="mt-1 text-[var(--forest-ink-muted)]">
            {selected!.company}
            {selected!.location ? ` · ${selected!.location}` : ''}
          </p>
          {selected!.responsibilities.length > 0 && (
            <ul className="mt-5 space-y-2">
              {selected!.responsibilities.slice(0, 3).map((r) => (
                <li key={r} className="forest-specimen pl-3 text-sm text-[var(--forest-ink-muted)]">
                  {r}
                </li>
              ))}
            </ul>
          )}
          {sorted.length > items.length && (
            <p className="forest-label mt-6">Rings sampled from {sorted.length} recorded roles.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7. PHILOSOPHY — seed to bloom
// ---------------------------------------------------------------------------

const STAGES = ['Seed', 'Root', 'Growth', 'Bloom'];

export function ForestPhilosophy({ profile }: { profile: Profile | null }) {
  const notes = (profile?.focusAreas ?? []).slice(0, 4);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  if (notes.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <ForestTrailSegment x="50%" width={120} opacity={0.12} />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="forest-label mb-4">06 · Philosophy</p>
        <h2 className="forest-serif text-3xl font-medium tracking-tight text-[var(--forest-ink)] sm:text-4xl">
          How the work grows
        </h2>
      </div>

      <div ref={ref} className="relative mx-auto mt-16 max-w-5xl px-6">
        <svg className="absolute inset-x-12 top-11 hidden h-4 w-[calc(100%-6rem)] lg:block" preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden>
          <motion.path
            d="M0 5 Q 16 0, 33 5 T 66 5 T 100 5"
            className="forest-vine-path"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </svg>

        <div className="grid gap-6 lg:grid-cols-4">
          {notes.map((note, i) => (
            <motion.div
              key={note}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
              className="forest-plaque rounded-2xl p-6"
            >
              <p className="forest-serif text-3xl text-[var(--forest-amber)]">{String(i + 1).padStart(2, '0')}</p>
              <p className="forest-label mt-3">{STAGES[i] ?? STAGES[STAGES.length - 1]}</p>
              <p className="mt-2 text-sm text-[var(--forest-ink)]">{note}</p>
            </motion.div>
          ))}
        </div>

        {profile?.aboutText && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="forest-serif mx-auto mt-14 max-w-2xl text-balance text-center text-xl italic text-[var(--forest-ink-muted)]"
          >
            &ldquo;{profile.aboutText.split('\n').filter(Boolean).pop()}&rdquo;
          </motion.p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8. PLAYGROUND — cursor-reactive light
// ---------------------------------------------------------------------------

export function ForestPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shaftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef<number | null>(null);

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    if (frame.current) cancelAnimationFrame(frame.current);
    // Direct style mutation, not React state — a mousemove-driven re-render
    // would thrash; this is the one place in the page that isn't declarative.
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--light-x', `${px}%`);
      el.style.setProperty('--light-y', `${py}%`);
      shaftRefs.current.forEach((shaft, i) => {
        if (!shaft) return;
        const pull = (px - 50) * (0.12 + i * 0.05);
        shaft.style.transform = `translateX(${pull}%) rotate(${pull * 0.15}deg)`;
      });
    });
  };

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="forest-label mb-4">07 · Playground</p>
        <h2 className="forest-serif text-3xl font-medium tracking-tight text-[var(--forest-ink)] sm:text-4xl">
          Let the light in
        </h2>
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--forest-ink-faint)]">
          <Wind className="size-4" />
          Move your cursor across the canopy below.
        </p>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMove}
        className="forest-playground relative mx-auto mt-14 h-72 max-w-4xl overflow-hidden rounded-3xl border border-[var(--forest-rule)] sm:h-96"
      >
        {[
          { left: '22%', width: '5rem' },
          { left: '48%', width: '7rem' },
          { left: '72%', width: '4.5rem' },
        ].map((shaft, i) => (
          <div
            key={i}
            ref={(el) => {
              shaftRefs.current[i] = el;
            }}
            className="forest-playground-shaft absolute inset-y-0"
            style={{ left: shaft.left, width: shaft.width }}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-1/3">
          <ForestTreeRow seed={9} count={7} layerClass="forest-layer-near" heightClass="h-full" />
        </div>
        <div className="forest-grain" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 9. EXIT — contact experience
// ---------------------------------------------------------------------------

export function ForestExit({ profile, socialLinks }: { profile: Profile | null; socialLinks: SocialLink[] }) {
  const email = profile?.email || 'hello@example.com';
  return (
    <section id="exit" className="forest-exit-sky relative overflow-hidden py-28 sm:py-36">
      {/* The treeline parts low and sparse here — this is the walk coming out
          of the woods, the visual opposite of Arrival's dense, rising canopy. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56" aria-hidden>
        <ForestTreeRow seed={10} count={9} layerClass="forest-layer-near" heightClass="h-full" opacity={0.95} />
      </div>
      <ForestTrailSegment x="50%" width={110} opacity={0.55} />
      <div className="forest-grain" />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <p className="forest-label mb-4 flex items-center justify-center gap-2">
          <MapPin className="size-3.5 text-[var(--forest-amber)]" />
          The trailhead
        </p>
        <h2 className="forest-serif text-3xl font-medium tracking-tight text-[var(--forest-ink)] sm:text-4xl">
          {profile?.availability || 'Open for new work'}
        </h2>
        <p className="mt-4 text-[var(--forest-ink-muted)]">
          {profile?.heroCurrently || 'The path continues by email.'}
        </p>

        <div className="forest-trailboard mx-auto mt-10 max-w-md rounded-2xl p-7">
          <a
            href={`mailto:${email}`}
            className="group flex items-center justify-center gap-2 text-lg font-medium text-[var(--forest-ink)] transition-colors hover:text-[var(--forest-amber)]"
          >
            <Mail className="size-4.5 text-[var(--forest-amber)]" />
            {email}
          </a>
          {socialLinks.length > 0 && (
            <div className="mt-6 flex justify-center gap-3">
              {socialLinks.slice(0, 5).map((link) => {
                const Icon = PLATFORM_ICONS[link.platform] ?? LinkIcon;
                return (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label || link.platform}
                    className="forest-leaf-chip grid size-10 place-items-center text-[var(--forest-ink-muted)] transition-colors hover:text-[var(--forest-ink)]"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 10. FINAL SCENE — footer
// ---------------------------------------------------------------------------

const NIGHT_DOTS = Array.from({ length: 30 }, (_, i) => ({
  left: `${rand(i + 3) * 100}%`,
  top: `${rand(i + 17) * 100}%`,
  size: 1 + rand(i + 29) * 1.4,
}));

export function ForestFinalScene({ profile }: { profile: Profile | null }) {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--forest-rule)] bg-[var(--forest-void)] py-10">
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
        {NIGHT_DOTS.map((d, i) => (
          <span key={i} className="absolute rounded-full bg-[var(--forest-ink-faint)]" style={{ left: d.left, top: d.top, width: d.size, height: d.size }} />
        ))}
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="forest-label">
          © {new Date().getFullYear()} {profile?.name || 'Portfolio'} · a concept exploration
        </p>
        <div className="flex items-center gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="forest-label transition-colors hover:text-[var(--forest-ink-muted)]"
          >
            Back to the entrance ↑
          </a>
          <Link to="/" className="forest-label flex items-center gap-1.5 transition-colors hover:text-[var(--forest-ink-muted)]">
            <Sprout className="size-3.5" />
            Standard site
          </Link>
        </div>
      </div>
    </footer>
  );
}

