/**
 * "Modern" section designs — the current generation of high-end portfolio /
 * product-site patterns: beam grids, mesh gradients, kinetic type, scroll-
 * linked reveals, pinned horizontal tracks, glass surfaces and 3D walls.
 * Each export list is merged into its section's variants in the registry.
 */
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Mail } from 'lucide-react';
import { getTechIcon } from '@/lib/techIcons';
import { formatDateRange } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Experience, Project, Technology } from '@/types/models';
import {
  Avatar,
  CountUp,
  Heading,
  PrimaryCTA,
  SecondaryCTA,
  Section,
  groupTech,
  newestFirst,
  pickProjects,
  statementLines,
  statsOf,
  type SectionProps,
  type SectionVariant,
} from './shared';

// ---------------------------------------------------------------------------
// Shared visual primitives
// ---------------------------------------------------------------------------

/** Hairline grid that fades out toward the edges. */
function GridBackdrop({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage:
          'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
        backgroundSize: `${size}px ${size}px`,
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)',
      }}
    />
  );
}

/** Slow drifting blurred color blobs — the "mesh gradient" look. */
function MeshBlobs({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  const blobs = [
    { c: 'var(--color-accent)', x: [0, 80, -40, 0], y: [0, -60, 40, 0], pos: 'left-[5%] top-[10%]', size: 'size-[480px]', d: 20 },
    { c: 'var(--color-accent-strong)', x: [0, -70, 50, 0], y: [0, 60, -30, 0], pos: 'right-[0%] top-[20%]', size: 'size-[420px]', d: 24 },
    { c: 'var(--color-accent)', x: [0, 40, -60, 0], y: [0, 40, 60, 0], pos: 'left-[35%] bottom-[-10%]', size: 'size-[380px]', d: 28 },
  ];
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
          className={cn('absolute rounded-full blur-[110px]', b.pos, b.size)}
          style={{ background: b.c, opacity: 0.35 * intensity }}
        />
      ))}
    </div>
  );
}

const glass =
  'rounded-2xl border border-white/10 bg-[var(--color-bg-elevated)]/50 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl';

function TechIcon({ tech, className }: { tech: Technology; className?: string }) {
  const Icon = getTechIcon(tech.icon || tech.slug, tech.category);
  return <Icon className={className} />;
}

function Thumb({ project, className }: { project: Project; className?: string }) {
  return project.thumbnail?.url ? (
    <img src={project.thumbnail.url} alt={project.title} loading="lazy" className={cn('size-full object-cover', className)} />
  ) : (
    <div className="size-full bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-bg-elevated-2)]" />
  );
}

/** Button that leans toward the cursor. */
function MagneticLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  return (
    <motion.a
      href={href}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------

function Beam({ left, delay, duration }: { left: string; delay: number; duration: number }) {
  return (
    <div className="pointer-events-none absolute top-0 h-full w-px overflow-hidden" style={{ left }}>
      <motion.div
        className="h-40 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent"
        initial={{ y: '-10rem' }}
        animate={{ y: '110vh' }}
        transition={{ duration, delay, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
      />
    </div>
  );
}

function HeroBeam({ profile, projects }: SectionProps) {
  const lines = statementLines(profile);
  const shots = pickProjects(projects, 3);
  const badge = profile?.heroCurrently || profile?.availability;

  return (
    <section className="relative overflow-hidden pb-10">
      <GridBackdrop />
      <Beam left="calc(50% - 320px)" delay={0} duration={5} />
      <Beam left="calc(50% + 256px)" delay={2.2} duration={6} />
      <Beam left="calc(50% - 64px)" delay={4} duration={7} />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 opacity-40"
        style={{ background: 'radial-gradient(ellipse at top, var(--color-accent), transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-28 text-center sm:pt-36">
        {badge && (
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 py-1 pl-1 pr-3 text-xs text-[var(--color-text-muted)] backdrop-blur transition-colors hover:border-[var(--color-border-hover)]"
          >
            <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 font-semibold text-[var(--color-on-accent)]">Now</span>
            {badge}
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </motion.a>
        )}
        <h1 className="mt-8 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl">
          {lines.map((line, i) => (
            <motion.span
              key={`${line}-${i}`}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12 }}
              className={cn(
                'block bg-clip-text text-transparent',
                i === lines.length - 1
                  ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-strong)]'
                  : 'bg-gradient-to-b from-[var(--color-text)] to-[var(--color-text-muted)]'
              )}
            >
              {line}
            </motion.span>
          ))}
        </h1>
        {profile?.bio && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-muted)]">
            {profile.bio}
          </motion.p>
        )}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </motion.div>
      </div>

      {shots.length > 0 && (
        <div className="relative mx-auto mt-20 max-w-5xl px-6" style={{ perspective: 1200 }}>
          <div className="absolute inset-x-20 top-10 h-40 rounded-full bg-[var(--color-accent)] opacity-25 blur-[90px]" />
          {/* whileInView, not a scroll-linked useTransform: the previous version
              tied rotation to the element's ABSOLUTE position on the page, so
              if the visitor was already scrolled past that point when this
              design mounted (switching designs in preview, or a route change
              that doesn't reset scroll) it computed as "already flat" and the
              tilt-in never visibly played. An intersection-based trigger fires
              correctly every time the window actually enters view, regardless
              of where the page happened to be scrolled to. Tilt angle bumped
              from 28deg to 52deg for a much more dramatic reveal. */}
          <motion.div
            initial={{ rotateX: 52, scale: 0.88 }}
            whileInView={{ rotateX: 0, scale: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="relative overflow-hidden rounded-2xl border border-[var(--color-border-hover)] bg-[var(--color-bg-elevated)] shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
              <span className="size-2.5 rounded-full bg-[var(--color-border-hover)]" />
              <span className="size-2.5 rounded-full bg-[var(--color-border-hover)]" />
              <span className="size-2.5 rounded-full bg-[var(--color-border-hover)]" />
              <span className="mx-auto rounded-md bg-[var(--color-bg)] px-4 py-1 font-mono text-[11px] text-[var(--color-text-faint)]">
                {(profile?.name || 'portfolio').toLowerCase().replace(/\s+/g, '')}.dev/work
              </span>
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-[1.4fr_1fr]">
              {shots[0] && (
                <Link to={`/work/${shots[0].slug}`} className="group relative aspect-[16/10] overflow-hidden rounded-lg">
                  <Thumb project={shots[0]} className="transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">{shots[0].title}</span>
                </Link>
              )}
              <div className="grid gap-3">
                {shots.slice(1).map((p) => (
                  <Link key={p._id} to={`/work/${p.slug}`} className="group relative overflow-hidden rounded-lg">
                    <Thumb project={p} className="aspect-[16/9] transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white backdrop-blur">{p.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

function HeroMesh({ profile }: SectionProps) {
  const words = statementLines(profile).join(' ').split(' ');
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden px-6">
      <MeshBlobs intensity={1.2} />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, var(--color-bg) 85%)' }} />
      <div className="relative mx-auto w-full max-w-5xl py-28">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
          <Avatar profile={profile} className="size-9 rounded-full text-xs ring-2 ring-[var(--color-bg)]" />
          <span>
            <span className="font-semibold text-[var(--color-text)]">{profile?.name}</span>
            {profile?.headline && <> — {profile.headline}</>}
          </span>
        </motion.p>
        <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--color-text)] sm:text-7xl lg:text-8xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.05 * i }}
              className="mr-[0.22em] inline-block"
            >
              {w}
            </motion.span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + 0.05 * words.length }} className="mt-12 flex flex-wrap items-center gap-3">
          <PrimaryCTA className="rounded-full" />
          <SecondaryCTA className="rounded-full backdrop-blur" />
        </motion.div>
      </div>
      <motion.a
        href="#about"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs text-[var(--color-text-faint)]"
      >
        scroll <ChevronDown className="size-4" />
      </motion.a>
    </section>
  );
}

function HeroKinetic({ profile }: SectionProps) {
  const words = profile?.focusAreas?.length ? profile.focusAreas : ['products', 'platforms', 'AI systems'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);
  const first = (profile?.name || 'Hello').split(' ')[0];
  const rows: ReactNode[] = [
    <>Hi, I'm {first}</>,
    <>
      I design
      <span className="relative mx-[0.15em] inline-block h-[0.8em] w-[1.6em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline">
        <Avatar profile={profile} className="size-full text-sm" />
      </span>
      &amp; build
    </>,
    <span className="inline-flex items-center">
      <span className="relative inline-flex h-[1.1em] min-w-[3ch] items-center overflow-hidden rounded-[0.3em] bg-[var(--color-accent)] px-[0.25em] text-[var(--color-on-accent)]">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.7, 0, 0.3, 1] }}
            className="block whitespace-nowrap"
          >
            {words[i % words.length]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>,
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-24">
        <h1 className="text-[13vw] font-bold leading-[0.95] tracking-[-0.05em] text-[var(--color-text)] sm:text-[9vw] lg:text-[112px]">
          {rows.map((row, n) => (
            <span key={n} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, delay: 0.1 + n * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {row}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 grid gap-8 border-t border-[var(--color-border)] pt-8 md:grid-cols-[1.5fr_1fr]">
          <p className="max-w-xl text-lg text-[var(--color-text-muted)]">{profile?.bio || statementLines(profile).join(' ')}</p>
          <div className="flex flex-wrap items-start gap-3 md:justify-end">
            <PrimaryCTA className="rounded-full" />
            <SecondaryCTA className="rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroSpotlightGrid({ profile, technologies }: SectionProps) {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const dots = (color: string) => ({
    backgroundImage: `radial-gradient(${color} 1.2px, transparent 1.2px)`,
    backgroundSize: '22px 22px',
  });
  const mask = `radial-gradient(260px circle at ${pos.x}px ${pos.y}px, black, transparent)`;
  return (
    <section onMouseMove={onMove} onMouseLeave={() => setPos({ x: -999, y: -999 })} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={dots('var(--color-border-hover)')} />
      <div className="pointer-events-none absolute inset-0" style={{ ...dots('var(--color-accent)'), maskImage: mask, WebkitMaskImage: mask }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, var(--color-bg) 80%)' }} />
      <div className="relative mx-auto flex min-h-[88vh] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1 pr-4 text-sm text-[var(--color-text-muted)]">
          <Avatar profile={profile} className="size-7 rounded-full text-[10px]" />
          {profile?.name} · {profile?.location || 'Remote'}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--color-text)] sm:text-7xl"
        >
          {statementLines(profile).join(' ')}
        </motion.h1>
        {profile?.headline && <p className="mt-6 text-lg text-[var(--color-text-muted)]">{profile.headline}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </div>
        {technologies.length > 0 && (
          <div className="mt-16">
            <p className="mb-4 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">Daily drivers</p>
            <div className="flex flex-wrap justify-center gap-5 text-[var(--color-text-faint)]">
              {technologies.slice(0, 8).map((t) => (
                <span key={t._id} title={t.name} className="transition-colors hover:text-[var(--color-accent)]">
                  <TechIcon tech={t} className="size-6" />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FloatingCard({ project, mx, my, depth, className, rotate }: { project: Project; mx: MotionValue<number>; my: MotionValue<number>; depth: number; className: string; rotate: number }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y, rotate }} className={cn('absolute hidden overflow-hidden rounded-2xl border border-[var(--color-border-hover)] shadow-2xl lg:block', className)}>
      <Link to={`/work/${project.slug}`} className="block size-full">
        <Thumb project={project} />
      </Link>
    </motion.div>
  );
}

function HeroFloatingCards({ profile, projects }: SectionProps) {
  const mx = useSpring(0, { stiffness: 60, damping: 20 });
  const my = useSpring(0, { stiffness: 60, damping: 20 });
  const shots = pickProjects(projects, 4);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) / r.width);
    my.set((e.clientY - r.top - r.height / 2) / r.height);
  };
  const spots = [
    { className: 'left-[3%] top-[14%] h-40 w-56', depth: -40, rotate: -8 },
    { className: 'right-[4%] top-[10%] h-44 w-64', depth: 50, rotate: 7 },
    { className: 'left-[8%] bottom-[10%] h-36 w-52', depth: 30, rotate: 5 },
    { className: 'right-[8%] bottom-[12%] h-40 w-56', depth: -60, rotate: -6 },
  ];
  return (
    <section onMouseMove={onMove} className="relative overflow-hidden">
      <MeshBlobs intensity={0.5} />
      {shots.map((p, i) => (
        <FloatingCard key={p._id} project={p} mx={mx} my={my} {...spots[i]!} />
      ))}
      <div className="relative mx-auto flex min-h-[88vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 font-mono text-sm text-[var(--color-accent)]">
          {profile?.heroEyebrow || profile?.headline}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--color-text)] sm:text-7xl"
        >
          {statementLines(profile).join(' ')}
        </motion.h1>
        {profile?.bio && <p className="mt-6 max-w-xl text-lg text-[var(--color-text-muted)]">{profile.bio}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryCTA className="rounded-full" />
          <SecondaryCTA className="rounded-full" />
        </div>
      </div>
    </section>
  );
}

export const MODERN_HERO: SectionVariant[] = [
  { id: 'beam', name: 'Beam grid ✦', description: 'Light beams on a grid, gradient headline, 3D product window that flattens on scroll.', Component: HeroBeam },
  { id: 'mesh', name: 'Mesh gradient ✦', description: 'Full-screen drifting color mesh, words blur in one by one.', Component: HeroMesh },
  { id: 'kinetic', name: 'Kinetic type ✦', description: 'Giant masked lines, your photo inline in the headline, flipping word pill.', Component: HeroKinetic },
  { id: 'spotlight-grid', name: 'Spotlight dots ✦', description: 'Dot grid that lights up under the cursor, tech icon row.', Component: HeroSpotlightGrid },
  { id: 'floating-cards', name: 'Floating cards ✦', description: 'Project shots float around the headline with mouse parallax.', Component: HeroFloatingCards },
];

// ---------------------------------------------------------------------------
// ABOUT — scroll-linked word reveal
// ---------------------------------------------------------------------------

function RevealWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

function AboutScrollReveal({ profile }: SectionProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const text = profile?.aboutText || profile?.bio || '';
  if (!text) return null;
  const words = text.split(/\s+/);
  return (
    <Section id="about" className="py-32">
      <p className="mb-8 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">About</p>
      <p ref={ref} className="text-3xl font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--color-text)] sm:text-5xl">
        {words.map((w, i) => (
          <RevealWord key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
        ))}
      </p>
    </Section>
  );
}

export const MODERN_ABOUT: SectionVariant[] = [
  { id: 'scroll-reveal', name: 'Scroll reveal ✦', description: 'Huge text that lights up word by word as you scroll.', Component: AboutScrollReveal },
];

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------

function ProjectsHorizontal({ projects }: SectionProps) {
  const list = pickProjects(projects, 6);
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [list.length]);

  if (list.length === 0) return null;
  return (
    <section ref={outer} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex gap-6 pl-6 pr-[10vw] sm:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
          <div className="flex w-[80vw] shrink-0 flex-col justify-center sm:w-[380px]">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">Selected work</p>
            <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--color-text)] sm:text-6xl">
              Things I've
              <br />
              shipped.
            </h2>
            <p className="mt-6 flex items-center gap-2 text-sm text-[var(--color-text-faint)]">
              Keep scrolling <ArrowRight className="size-4" />
            </p>
          </div>
          {list.map((p, i) => (
            <Link key={p._id} to={`/work/${p.slug}`} className="group relative h-[62vh] w-[80vw] shrink-0 overflow-hidden rounded-3xl border border-[var(--color-border)] sm:w-[560px]">
              <Thumb project={p} className="transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
                <div>
                  <p className="font-mono text-xs text-white/60">{String(i + 1).padStart(2, '0')} — {p.year || p.role}</p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">{p.title}</h3>
                  {p.shortDescription && <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/75">{p.shortDescription}</p>}
                </div>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectsExpandCards({ projects }: SectionProps) {
  const list = pickProjects(projects, 5);
  const [active, setActive] = useState(0);
  if (list.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Selected work" title="Featured projects" />
      <div className="flex flex-col gap-3 md:h-[520px] md:flex-row">
        {list.map((p, i) => {
          const isActive = active === i;
          return (
            <motion.div
              key={p._id}
              layout
              onMouseEnter={() => setActive(i)}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              className={cn('relative h-72 overflow-hidden rounded-3xl md:h-auto', isActive ? 'md:flex-[4]' : 'md:flex-1')}
            >
              <Link to={`/work/${p.slug}`} className="block size-full">
                <Thumb project={p} className={cn('transition-all duration-700', !isActive && 'md:grayscale')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div key="open" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <p className="font-mono text-xs text-white/60">{p.role || p.year}</p>
                        <h3 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{p.title}</h3>
                        {p.shortDescription && <p className="mt-2 max-w-md text-sm text-white/80">{p.shortDescription}</p>}
                      </motion.div>
                    ) : (
                      <motion.p key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold text-white md:[writing-mode:vertical-rl] md:rotate-180">
                        {p.title}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

export const MODERN_PROJECTS: SectionVariant[] = [
  { id: 'horizontal', name: 'Horizontal scroll ✦', description: 'Section pins while big project cards slide sideways as you scroll.', Component: ProjectsHorizontal },
  { id: 'expand-cards', name: 'Expanding images ✦', description: 'Image panels that widen on hover, others go grayscale.', Component: ProjectsExpandCards },
];

// ---------------------------------------------------------------------------
// STATS / SKILLS — glass
// ---------------------------------------------------------------------------

function StatsGlass(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;
  return (
    <section className="relative overflow-hidden py-24">
      <MeshBlobs intensity={0.8} />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={cn(glass, 'p-6')}
          >
            <CountUp to={s.value} suffix={s.suffix} className="block text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl" />
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SkillsGlassGrid({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;
  return (
    <section className="relative overflow-hidden py-24">
      <MeshBlobs intensity={0.6} />
      <div className="relative mx-auto max-w-6xl px-6">
        <Heading eyebrow="Stack" title="Tools I build with" align="center" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <motion.div
              key={g.cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={cn(glass, 'p-6')}
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <span key={t._id} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[var(--color-bg)]/40 px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]">
                    <TechIcon tech={t} className="size-4 text-[var(--color-text-muted)]" />
                    {t.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const MODERN_STATS: SectionVariant[] = [
  { id: 'glass', name: 'Glass cards ✦', description: 'Frosted-glass counters floating over a color mesh.', Component: StatsGlass },
];

export const MODERN_SKILLS: SectionVariant[] = [
  { id: 'glass-grid', name: 'Glass groups ✦', description: 'Frosted category panels over a color mesh.', Component: SkillsGlassGrid },
];

// ---------------------------------------------------------------------------
// TESTIMONIALS — tilted 3D wall
// ---------------------------------------------------------------------------

function TestimonialsWall3D({ profile }: SectionProps) {
  const list = profile?.testimonials ?? [];
  if (list.length === 0) return null;
  const pad = list.length < 6 ? [...list, ...list, ...list].slice(0, Math.max(6, list.length)) : list;
  const columns = [0, 1, 2, 3].map((c) => pad.filter((_, i) => i % 4 === c).concat(pad.filter((_, i) => i % 4 !== c).slice(0, 2)));
  return (
    <section className="relative overflow-hidden py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Heading eyebrow="Testimonials" title="People say nice things" align="center" />
      </div>
      <div className="relative h-[560px]" style={{ perspective: 1400 }}>
        <div
          className="absolute inset-x-[-10%] top-[-10%] grid h-[130%] grid-cols-2 gap-4 md:grid-cols-4"
          style={{ transform: 'rotateX(35deg) rotateZ(-12deg) skewX(8deg)', transformStyle: 'preserve-3d' }}
        >
          {columns.map((col, c) => (
            <div key={c} className={cn('overflow-hidden', c >= 2 && 'hidden md:block')}>
              <div className="space-y-4" style={{ animation: `marquee-up ${30 + c * 6}s linear infinite${c % 2 ? ' reverse' : ''}` }}>
                {[...col, ...col].map((t, i) => (
                  <figure key={i} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-card)]">
                    <blockquote className="text-sm leading-relaxed text-[var(--color-text)]">“{t.quote}”</blockquote>
                    <figcaption className="mt-4 text-xs">
                      <span className="font-semibold text-[var(--color-text)]">{t.name}</span>
                      <span className="text-[var(--color-text-faint)]"> · {t.company || t.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(var(--color-bg), transparent 25%, transparent 75%, var(--color-bg)), linear-gradient(90deg, var(--color-bg), transparent 20%, transparent 80%, var(--color-bg))' }} />
      </div>
    </section>
  );
}

export const MODERN_TESTIMONIALS: SectionVariant[] = [
  { id: 'wall3d', name: '3D wall ✦', description: 'A tilted 3D wall of quotes scrolling in columns.', Component: TestimonialsWall3D },
];

// ---------------------------------------------------------------------------
// EXPERIENCE — scroll-progress timeline
// ---------------------------------------------------------------------------

function TimelineItem({ exp }: { exp: Experience }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  return (
    <div ref={ref} className="relative pb-16 pl-10 last:pb-0">
      <span
        className={cn(
          'absolute left-0 top-1.5 size-3 -translate-x-1/2 rounded-full border-2 transition-all duration-300',
          inView ? 'scale-125 border-[var(--color-accent)] bg-[var(--color-accent)] shadow-[var(--shadow-glow)]' : 'border-[var(--color-border-hover)] bg-[var(--color-bg)]'
        )}
      />
      <motion.div animate={{ opacity: inView ? 1 : 0.45 }} transition={{ duration: 0.3 }}>
        <p className="font-mono text-xs text-[var(--color-accent)]">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">{exp.position}</h3>
        <p className="text-[var(--color-text-muted)]">
          {exp.company}
          {exp.location && ` · ${exp.location}`}
        </p>
        {exp.description && <p className="mt-4 max-w-xl leading-relaxed text-[var(--color-text-muted)]">{exp.description}</p>}
        {exp.technologies.length > 0 && (
          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-[var(--color-text-faint)]">
            {exp.technologies.map((t) => (
              <span key={t._id}>#{t.slug || t.name}</span>
            ))}
          </p>
        )}
      </motion.div>
    </div>
  );
}

function ExpScrollTimeline({ experiences }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 55%', 'end 55%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pct = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);
  const list = newestFirst(experiences);
  if (list.length === 0) return null;
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">Experience</p>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl">Where I've made an impact.</h2>
          <motion.p className="mt-6 font-mono text-sm text-[var(--color-text-faint)]">{pct}</motion.p>
        </div>
        <div ref={ref} className="relative">
          <div className="absolute left-0 top-0 h-full w-px bg-[var(--color-border)]" />
          <motion.div style={{ scaleY, transformOrigin: 'top' }} className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-strong)]" />
          {list.map((exp) => (
            <TimelineItem key={exp._id} exp={exp} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export const MODERN_EXPERIENCE: SectionVariant[] = [
  { id: 'scroll-timeline', name: 'Scroll timeline ✦', description: 'Line fills as you scroll; the role in view lights up.', Component: ExpScrollTimeline },
];

// ---------------------------------------------------------------------------
// CONTACT — aurora panel with magnetic button
// ---------------------------------------------------------------------------

function ContactAurora({ profile, socialLinks }: SectionProps) {
  const email = profile?.email || 'hello@example.com';
  return (
    <Section id="contact" className="py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-24 text-center sm:px-16">
        <MeshBlobs intensity={1.1} />
        <GridBackdrop size={48} className="opacity-60" />
        <div className="relative">
          {profile?.availability && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--color-bg)]/50 px-3 py-1 text-xs text-[var(--color-text-muted)] backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
              {profile.availability}
            </span>
          )}
          <h2 className="mx-auto mt-8 max-w-3xl text-balance text-5xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-7xl">
            Let's make something people remember.
          </h2>
          <div className="mt-12 flex justify-center">
            <MagneticLink
              href={`mailto:${email}`}
              className="inline-flex h-16 items-center gap-3 rounded-full bg-[var(--color-text)] px-10 text-lg font-semibold text-[var(--color-bg)] shadow-2xl"
            >
              <Mail className="size-5" /> Say hello
            </MagneticLink>
          </div>
          <p className="mt-6 font-mono text-sm text-[var(--color-text-muted)]">{email}</p>
          {socialLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {socialLinks.map((l) => (
                <a key={l._id} href={l.url} target="_blank" rel="noreferrer" className="capitalize text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                  {l.label || l.platform} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

export const MODERN_CONTACT: SectionVariant[] = [
  { id: 'aurora', name: 'Aurora panel ✦', description: 'Mesh-gradient panel with a magnetic "Say hello" button.', Component: ContactAurora },
];
