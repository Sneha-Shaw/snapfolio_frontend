/**
 * "Premium" (◆) section designs — luxury-studio polish: travelling conic
 * borders, metallic text sheen, planet-horizon glows, clip-path reveals, 3D
 * orbit rings, rolling-digit counters, glare-tilt cards and a live dashboard.
 * The CSS helpers (.conic-border, .shine-text, .grain, .horizon-glow) live in
 * index.css.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Clock, Code2, Cpu, Database, Layers, Mail, MapPin, Quote, Rocket, Sparkles, Zap } from 'lucide-react';
import { Globe } from '@/components/aceternity/Globe';
import { getTechIcon } from '@/lib/techIcons';
import { cn } from '@/utils/cn';
import type { Project, Technology } from '@/types/models';
import {
  Avatar,
  Heading,
  Section,
  groupTech,
  initials,
  pickProjects,
  servicesOf,
  statementLines,
  statsOf,
  type SectionProps,
  type SectionVariant,
} from './shared';

const MotionLink = motion.create(Link);

const SERIF: CSSProperties = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

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

/** Pill-shaped CTA with the travelling conic border. */
function ConicButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'conic-border conic-glow group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-bg-elevated)] px-6 text-sm font-medium text-[var(--color-text)] transition-transform hover:scale-[1.03]',
        className
      )}
    >
      {children}
    </a>
  );
}

function SolidButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-[var(--color-text)] px-6 text-sm font-semibold text-[var(--color-bg)] transition-transform hover:scale-[1.03]',
        className
      )}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------

function HeroShine({ profile, technologies }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="grain relative overflow-hidden">
      <div className="shine-glow pointer-events-none absolute inset-0" />
      <div className="horizon-glow top-[88%]" />
      <div className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col items-center px-6 pb-32 pt-32 text-center">
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="conic-border inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-elevated)] px-4 py-1.5 text-xs text-[var(--color-text-muted)]"
        >
          <Sparkles className="size-3.5 text-[var(--color-accent)]" />
          {profile?.availability || profile?.headline || 'Available for select projects'}
        </motion.a>
        <h1 className="mt-10 text-balance text-5xl font-semibold leading-[1] tracking-[-0.045em] sm:text-7xl lg:text-[88px]">
          {lines.map((line, i) => (
            <motion.span
              key={`${line}-${i}`}
              initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={cn('block', i === lines.length - 1 ? 'shine-text' : 'text-[var(--color-text)]')}
            >
              {line}
            </motion.span>
          ))}
        </h1>
        {profile?.bio && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            {profile.bio}
          </motion.p>
        )}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-10 flex flex-wrap justify-center gap-3">
          <SolidButton href="#contact">
            Start a project <ArrowRight className="size-4" />
          </SolidButton>
          <ConicButton href="/work">View work</ConicButton>
        </motion.div>
        {technologies.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16 max-w-3xl font-mono text-[11px] uppercase leading-6 tracking-[0.25em] text-[var(--color-text-faint)]">
            {technologies.slice(0, 7).map((t) => t.name).join('  ·  ')}
          </motion.p>
        )}
      </div>
    </section>
  );
}

function Ring({ tilt, size, duration, reverse, dot }: { tilt: number; size: string; duration: number; reverse?: boolean; dot?: boolean }) {
  return (
    <div className={cn('absolute left-1/2 top-1/2', size)} style={{ transform: `translate(-50%, -50%) rotateX(72deg) rotateY(${tilt}deg)`, transformStyle: 'preserve-3d' }}>
      <motion.div
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className="relative size-full rounded-full border border-[var(--color-accent)]/50"
        style={{ boxShadow: '0 0 30px -6px var(--color-accent), inset 0 0 30px -10px var(--color-accent)' }}
      >
        {dot && <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_16px_var(--color-accent)]" />}
      </motion.div>
    </div>
  );
}

function HeroOrbit3D({ profile }: SectionProps) {
  return (
    <section className="grain relative overflow-hidden">
      <div className="pointer-events-none absolute right-[-10%] top-1/2 size-[700px] -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-10 blur-[140px]" />
      <div className="relative mx-auto grid min-h-[90vh] max-w-6xl items-center gap-10 px-6 py-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            {profile?.headline || 'Engineer'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--color-text)] sm:text-7xl"
          >
            {statementLines(profile).join(' ')}
          </motion.h1>
          {profile?.bio && <p className="mt-8 max-w-lg text-lg text-[var(--color-text-muted)]">{profile.bio}</p>}
          <div className="mt-10 flex flex-wrap gap-3">
            <SolidButton href="#contact">
              Let's talk <ArrowRight className="size-4" />
            </SolidButton>
            <ConicButton href="/work">Selected work</ConicButton>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[520px]" style={{ perspective: 1000 }}>
          <Ring tilt={0} size="size-[92%]" duration={22} dot />
          <Ring tilt={55} size="size-[74%]" duration={16} reverse dot />
          <Ring tilt={-50} size="size-[58%]" duration={12} />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-1/2 size-[36%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-[var(--color-border-hover)] shadow-[0_0_80px_-10px_var(--color-accent)]"
          >
            <Avatar profile={profile} className="size-full text-4xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroCurtain({ profile }: SectionProps) {
  const [first, ...rest] = (profile?.name || 'Your Name').split(' ');
  const last = rest.join(' ') || '';
  const ease = [0.76, 0, 0.24, 1] as const;
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto flex min-h-[94vh] max-w-7xl flex-col justify-between px-6 pb-10 pt-24">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-text-faint)]">
          <span>Portfolio © {new Date().getFullYear()}</span>
          <span className="hidden sm:inline">{profile?.location}</span>
          <span>{profile?.heroTimezone || 'Available worldwide'}</span>
        </div>

        <div className="relative my-10 flex items-center justify-center">
          <motion.div
            initial={{ clipPath: 'inset(45% 46% 45% 46% round 999px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            transition={{ duration: 1.6, delay: 0.6, ease }}
            className="absolute inset-y-[-6%] left-1/2 w-[38%] max-w-[420px] -translate-x-1/2 overflow-hidden"
          >
            <Avatar profile={profile} className="size-full text-6xl grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent opacity-70" />
          </motion.div>
          <h1 className="relative z-10 flex w-full flex-col text-[17vw] font-semibold uppercase leading-[0.82] tracking-[-0.06em] text-[var(--color-text)] mix-blend-difference lg:text-[210px]" style={SERIF}>
            <span className="overflow-hidden">
              <motion.span initial={{ x: '-110%' }} animate={{ x: '0%' }} transition={{ duration: 1.3, ease }} className="block">
                {first}
              </motion.span>
            </span>
            {last && (
              <span className="self-end overflow-hidden italic">
                <motion.span initial={{ x: '110%' }} animate={{ x: '0%' }} transition={{ duration: 1.3, delay: 0.1, ease }} className="block">
                  {last}
                </motion.span>
              </span>
            )}
          </h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="grid gap-6 border-t border-[var(--color-border)] pt-6 md:grid-cols-3 md:items-end">
          <p className="max-w-sm text-[var(--color-text-muted)]">{statementLines(profile).join(' ')}</p>
          <p className="text-sm text-[var(--color-text-faint)] md:text-center">{profile?.headline}</p>
          <div className="md:text-right">
            <a href="#contact" className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
              <span className="border-b border-[var(--color-text)] pb-0.5">Get in touch</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Time in the admin's timezone when heroTimezone contains "UTC+5:30"-style info, else the visitor's time. */
function useLiveClock(tz: string | undefined) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const m = tz?.match(/UTC\s*([+-])\s*(\d{1,2})(?::(\d{2}))?/i);
  if (!m) return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const offset = (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0));
  const local = new Date(now.getTime() + (offset + now.getTimezoneOffset()) * 60000);
  return local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function HeroDashboard({ profile, projects, technologies }: SectionProps) {
  const time = useLiveClock(profile?.heroTimezone);
  const latest = pickProjects(projects, 1)[0];
  const tile = 'relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6';
  const fade = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 * i, duration: 0.6 } });
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 pt-12">
      <div className="grid auto-rows-[minmax(150px,auto)] gap-4 md:grid-cols-4">
        <motion.div {...fade(0)} className={cn(tile, 'grain conic-border flex flex-col justify-between md:col-span-3 md:row-span-2')}>
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-[var(--color-accent)] opacity-15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <Avatar profile={profile} className="size-11 rounded-full text-sm" />
            <div>
              <p className="font-semibold text-[var(--color-text)]">{profile?.name}</p>
              <p className="text-xs text-[var(--color-text-faint)]">{profile?.headline}</p>
            </div>
          </div>
          <h1 className="relative mt-10 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--color-text)] sm:text-6xl">
            {statementLines(profile).map((l, i, all) => (
              <span key={i} className={cn('block', i === all.length - 1 && 'shine-text')}>
                {l}
              </span>
            ))}
          </h1>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <SolidButton href="#contact">
              Get in touch <ArrowRight className="size-4" />
            </SolidButton>
            <ConicButton href="/work">See work</ConicButton>
          </div>
        </motion.div>

        <motion.div {...fade(1)} className={cn(tile, 'flex flex-col justify-between')}>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            <Clock className="size-3.5" /> Local time
          </p>
          <p className="font-mono text-3xl tabular-nums text-[var(--color-text)]">{time}</p>
          <p className="text-xs text-[var(--color-text-faint)]">{profile?.heroTimezone || 'Your timezone'}</p>
        </motion.div>

        <motion.div {...fade(2)} className={cn(tile, 'flex flex-col justify-between')}>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            Status
          </p>
          <p className="text-lg font-medium leading-snug text-[var(--color-text)]">{profile?.availability || 'Open to opportunities'}</p>
        </motion.div>

        <motion.div {...fade(3)} className={cn(tile, 'p-0 md:row-span-2')}>
          <div className="absolute left-6 top-6 z-10">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
              <MapPin className="size-3.5" /> Based in
            </p>
            <p className="mt-1 text-lg font-medium text-[var(--color-text)]">{profile?.location || 'Earth'}</p>
          </div>
          <Globe className="absolute -bottom-16 left-1/2 w-[130%] -translate-x-1/2 md:w-[150%]" />
        </motion.div>

        {latest && (
          <motion.div {...fade(4)} className={cn(tile, 'group p-0 md:col-span-2')}>
            <Link to={`/work/${latest.slug}`} className="block size-full min-h-56">
              <Thumb project={latest} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">Latest project</p>
                  <p className="mt-1 text-xl font-semibold text-white">{latest.title}</p>
                </div>
                <ArrowUpRight className="size-5 text-white transition-transform group-hover:rotate-45" />
              </div>
            </Link>
          </motion.div>
        )}

        <motion.div {...fade(5)} className={cn(tile, 'flex flex-col justify-between', latest ? '' : 'md:col-span-3')}>
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-faint)]">Stack</p>
          <div className="grid grid-cols-4 gap-3 text-[var(--color-text-muted)]">
            {technologies.slice(0, 8).map((t) => (
              <span key={t._id} title={t.name} className="flex aspect-square items-center justify-center rounded-xl border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                <TechIcon tech={t} className="size-5" />
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export const PREMIUM_HERO: SectionVariant[] = [
  { id: 'shine', name: 'Horizon shine ◆', description: 'Metallic sheen headline, travelling-border pill, glowing planet horizon.', Component: HeroShine },
  { id: 'curtain', name: 'Curtain reveal ◆', description: 'Name splits in from both sides, portrait opens from a slit. Fashion-house editorial.', Component: HeroCurtain },
  { id: 'orbit3d', name: '3D orbit ◆', description: 'Your portrait inside glowing 3D rings rotating on different axes.', Component: HeroOrbit3D },
  { id: 'dashboard', name: 'Live dashboard ◆', description: 'Bento of live clock, status, spinning globe, latest project and stack.', Component: HeroDashboard },
];

// ---------------------------------------------------------------------------
// ABOUT — manifesto with marker highlights
// ---------------------------------------------------------------------------

function Marker({ children, delay }: { children: ReactNode; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay, ease: [0.65, 0, 0.35, 1] }}
        className="marker-hl absolute inset-x-[-0.1em] bottom-[0.08em] top-[0.45em] -z-10 origin-left rounded-sm bg-[var(--color-accent)] opacity-35"
      />
      {children}
    </span>
  );
}

function AboutManifesto({ profile }: SectionProps) {
  const text = profile?.aboutText || profile?.bio || '';
  const areas = profile?.focusAreas ?? [];
  if (!text) return null;
  // Every 7th word switches to italic serif for rhythm.
  const words = text.split(/\s+/);
  return (
    <Section id="about" className="py-32">
      <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Manifesto</p>
        <div>
          <p className="isolate text-3xl leading-[1.3] tracking-[-0.02em] text-[var(--color-text)] sm:text-[44px]">
            {words.map((w, i) => (
              <span key={i}>
                {i % 7 === 3 ? (
                  <span className="italic text-[var(--color-accent)]" style={SERIF}>
                    {w}
                  </span>
                ) : (
                  w
                )}{' '}
              </span>
            ))}
          </p>
          {areas.length > 0 && (
            <p className="isolate mt-12 text-2xl leading-relaxed text-[var(--color-text-muted)] sm:text-3xl" style={SERIF}>
              I care most about{' '}
              {areas.map((a, i) => (
                <span key={a}>
                  <Marker delay={i * 0.2}>
                    <span className="italic text-[var(--color-text)]">{a}</span>
                  </Marker>
                  {i < areas.length - 2 ? ', ' : i === areas.length - 2 ? ' and ' : '.'}
                </span>
              ))}
            </p>
          )}
          <div className="mt-14 flex items-center gap-4">
            <Avatar profile={profile} className="size-12 rounded-full text-sm" />
            <div>
              <p className="text-2xl italic text-[var(--color-text)]" style={SERIF}>
                {profile?.name}
              </p>
              <p className="text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{profile?.headline}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export const PREMIUM_ABOUT: SectionVariant[] = [
  { id: 'manifesto', name: 'Manifesto ◆', description: 'Large type with serif-italic accents and marker-highlighted focus areas, signed.', Component: AboutManifesto },
];

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------

function GlareCard({ project, index }: { project: Project; index: number }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 14);
    rx.set((0.5 - py) * 14);
    setGlare({ x: px * 100, y: py * 100, o: 1 });
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
    setGlare((g) => ({ ...g, o: 0 }));
  };
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: (index % 2) * 0.1, duration: 0.7 }} style={{ perspective: 1000 }}>
      <MotionLink
        to={`/work/${project.slug}`}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        className="conic-border group block overflow-hidden rounded-3xl bg-[var(--color-bg-elevated)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Thumb project={project} className="transition-transform duration-700 group-hover:scale-105" />
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{ opacity: glare.o, background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.35), transparent 45%)`, mixBlendMode: 'overlay' }}
          />
        </div>
        <div className="flex items-start justify-between gap-4 p-7" style={{ transform: 'translateZ(30px)' }}>
          <div>
            <p className="font-mono text-xs text-[var(--color-accent)]">
              {String(index + 1).padStart(2, '0')} · {project.year || project.role}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">{project.title}</h3>
            {project.shortDescription && <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{project.shortDescription}</p>}
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-hover)] text-[var(--color-text)] transition-all group-hover:rotate-45 group-hover:bg-[var(--color-text)] group-hover:text-[var(--color-bg)]">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </MotionLink>
    </motion.div>
  );
}

function ProjectsGlare({ projects }: SectionProps) {
  const list = pickProjects(projects, 6);
  if (list.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Selected work" title="Crafted with care" />
      <div className="grid gap-6 md:grid-cols-2">
        {list.map((p, i) => (
          <GlareCard key={p._id} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}

function StickyItem({ project, index, onActive }: { project: Project; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  return (
    <div ref={ref} className="flex min-h-[70vh] flex-col justify-center py-10">
      <div className="mb-6 aspect-[16/10] overflow-hidden rounded-2xl lg:hidden">
        <Thumb project={project} />
      </div>
      <motion.div animate={{ opacity: inView ? 1 : 0.3 }} transition={{ duration: 0.4 }}>
        <p className="font-mono text-sm text-[var(--color-accent)]">{String(index + 1).padStart(2, '0')}</p>
        <h3 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl">{project.title}</h3>
        {project.shortDescription && <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--color-text-muted)]">{project.shortDescription}</p>}
        {project.technologies.length > 0 && (
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{project.technologies.slice(0, 5).map((t) => t.name).join(' · ')}</p>
        )}
        <Link to={`/work/${project.slug}`} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
          <span className="border-b border-[var(--color-text)] pb-0.5">View case study</span>
          <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
        </Link>
      </motion.div>
    </div>
  );
}

function ProjectsStickySplit({ projects }: SectionProps) {
  const list = pickProjects(projects, 6);
  const [active, setActive] = useState(0);
  if (list.length === 0) return null;
  const current = list[active] ?? list[0]!;
  return (
    <Section>
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Selected work</p>
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="sticky top-24 h-[calc(100vh-8rem)] py-10">
            <div className="relative size-full overflow-hidden rounded-3xl border border-[var(--color-border)]">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={current._id}
                  initial={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Thumb project={current} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-5 left-5 flex gap-1.5">
                {list.map((p, i) => (
                  <span key={p._id} className={cn('h-1 rounded-full bg-white transition-all', i === active ? 'w-8' : 'w-2 opacity-50')} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          {list.map((p, i) => (
            <StickyItem key={p._id} project={p} index={i} onActive={setActive} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export const PREMIUM_PROJECTS: SectionVariant[] = [
  { id: 'glare', name: 'Glare tilt ◆', description: '3D tilting cards with light glare and travelling gradient borders.', Component: ProjectsGlare },
  { id: 'sticky-split', name: 'Sticky showcase ◆', description: 'Big pinned image cross-fades as you scroll through the project list.', Component: ProjectsStickySplit },
];

// ---------------------------------------------------------------------------
// SERVICES — conic cards
// ---------------------------------------------------------------------------

const SERVICE_ICONS = [Code2, Layers, Cpu, Database, Rocket, Zap, Sparkles];

function ServicesConic({ profile }: SectionProps) {
  const services = servicesOf(profile);
  if (services.length === 0) return null;
  return (
    <Section>
      <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">Services</p>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl">
            Built to a <span className="italic" style={SERIF}>higher</span> standard.
          </h2>
        </div>
        <p className="text-[var(--color-text-muted)] md:text-right">End-to-end ownership, from first sketch to production.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]!;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="conic-border grain relative overflow-hidden rounded-3xl bg-[var(--color-bg-elevated)] p-8"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[var(--color-accent)] opacity-10 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-strong)] text-[var(--color-on-accent)] shadow-[0_10px_30px_-10px_var(--color-accent)]">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-xs text-[var(--color-text-faint)]">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="relative mt-10 text-xl font-semibold text-[var(--color-text)]">{s.title}</h3>
              {s.description && <p className="relative mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{s.description}</p>}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

export const PREMIUM_SERVICES: SectionVariant[] = [
  { id: 'conic', name: 'Travelling borders ◆', description: 'Grain-textured cards whose borders carry a moving light arc.', Component: ServicesConic },
];

// ---------------------------------------------------------------------------
// STATS — odometer
// ---------------------------------------------------------------------------

function DigitColumn({ digit, delay, active }: { digit: number; delay: number; active: boolean }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top leading-none">
      <motion.span
        initial={{ y: '0%' }}
        animate={{ y: active ? `-${digit * 10}%` : '0%' }}
        transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col"
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="h-[1em] leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Odometer({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const digits = String(value).split('').map(Number);
  return (
    <span ref={ref} className="inline-flex font-mono tabular-nums">
      {digits.map((d, i) => (
        <DigitColumn key={i} digit={d} delay={i * 0.12} active={inView} />
      ))}
      {suffix && <span className="leading-none text-[var(--color-accent)]">{suffix}</span>}
    </span>
  );
}

function StatsOdometer(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;
  return (
    <Section className="py-24">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="grain relative bg-[var(--color-bg)] p-8">
            <p className="text-6xl font-semibold tracking-tight text-[var(--color-text)] sm:text-7xl">
              <Odometer value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">{s.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export const PREMIUM_STATS: SectionVariant[] = [
  { id: 'odometer', name: 'Odometer ◆', description: 'Digits roll into place like a mechanical counter.', Component: StatsOdometer },
];

// ---------------------------------------------------------------------------
// TESTIMONIALS — social cards
// ---------------------------------------------------------------------------

function TestimonialsSocial({ profile }: SectionProps) {
  const list = profile?.testimonials ?? [];
  if (list.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Testimonials" title="In their words" align="center" />
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {list.map((t, i) => (
          <motion.figure
            key={`${t.name}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.08 }}
            className="break-inside-avoid rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-card)] transition-colors hover:border-[var(--color-border-hover)]"
          >
            <figcaption className="flex items-center gap-3">
              {t.avatarUrl ? (
                <img src={t.avatarUrl} alt={t.name} className="size-11 rounded-full object-cover" />
              ) : (
                <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-strong)] text-sm font-bold text-[var(--color-on-accent)]">
                  {initials(t.name)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--color-text)]">{t.name}</p>
                <p className="truncate text-xs text-[var(--color-text-faint)]">{[t.role, t.company].filter(Boolean).join(' at ')}</p>
              </div>
              <Quote className="size-5 shrink-0 text-[var(--color-accent)]" />
            </figcaption>
            <blockquote className="mt-5 leading-relaxed text-[var(--color-text)]">{t.quote}</blockquote>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}

export const PREMIUM_TESTIMONIALS: SectionVariant[] = [
  { id: 'social', name: 'Social cards ◆', description: 'Clean profile-card quotes in a masonry wall.', Component: TestimonialsSocial },
];

// ---------------------------------------------------------------------------
// SKILLS — constellation
// ---------------------------------------------------------------------------

function SkillsConstellation({ technologies, profile }: SectionProps) {
  const groups = groupTech(technologies).slice(0, 6);
  const [hover, setHover] = useState<string | null>(null);
  const layout = useMemo(() => {
    const hubs = groups.map((g, i) => {
      const a = (i / groups.length) * Math.PI * 2 - Math.PI / 2;
      return { ...g, x: 50 + Math.cos(a) * 25, y: 50 + Math.sin(a) * 24, a };
    });
    // Each hub's techs fan out on an arc facing away from the centre; the
    // arc never exceeds the hub's share of the circle so clusters don't meet.
    const spread = Math.min(Math.PI * 0.75, ((Math.PI * 2) / Math.max(groups.length, 1)) * 0.85);
    const nodes = hubs.flatMap((h) =>
      h.items.slice(0, 6).map((t, j, arr) => {
        const a = h.a - spread / 2 + (arr.length === 1 ? spread / 2 : (j / (arr.length - 1)) * spread);
        // Alternate between an inner and outer ring so dense groups don't overlap.
        const far = j % 2 === 1 && arr.length > 3;
        return { tech: t, hub: h.cat, x: h.x + Math.cos(a) * (far ? 20 : 13), y: h.y + Math.sin(a) * (far ? 25 : 16) };
      })
    );
    return { hubs, nodes };
  }, [groups]);
  if (groups.length === 0) return null;

  return (
    <Section>
      <Heading eyebrow="Stack" title="A connected toolkit" align="center" />
      <div className="relative mx-auto hidden aspect-[16/10] w-full max-w-5xl md:block">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {layout.hubs.map((h) => (
            <line key={h.cat} x1={50} y1={50} x2={h.x} y2={h.y} stroke="var(--color-accent)" strokeOpacity={hover && hover !== h.cat ? 0.1 : 0.5} strokeWidth={0.15} strokeDasharray="0.8 0.8" vectorEffect="non-scaling-stroke" />
          ))}
          {layout.nodes.map((n, i) => {
            const h = layout.hubs.find((x) => x.cat === n.hub)!;
            return <line key={i} x1={h.x} y1={h.y} x2={n.x} y2={n.y} stroke="var(--color-border-hover)" strokeOpacity={hover && hover !== n.hub ? 0.2 : 1} strokeWidth={0.1} vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
        <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg font-bold text-[var(--color-on-accent)] shadow-[0_0_60px_-5px_var(--color-accent)]">
          {initials(profile?.name)}
        </div>
        {layout.hubs.map((h) => (
          <button
            key={h.cat}
            type="button"
            onMouseEnter={() => setHover(h.cat)}
            onMouseLeave={() => setHover(null)}
            className="conic-border absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            {h.label}
          </button>
        ))}
        {layout.nodes.map((n) => (
          <motion.span
            key={n.tech._id}
            title={n.tech.name}
            animate={{ opacity: hover && hover !== n.hub ? 0.25 : 1, scale: hover === n.hub ? 1.15 : 1 }}
            className="absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] shadow-[var(--shadow-card)]"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <TechIcon tech={n.tech} className="size-4" />
          </motion.span>
        ))}
      </div>
      {/* Phones: grouped list instead of the graph. */}
      <div className="space-y-6 md:hidden">
        {groups.map((g) => (
          <div key={g.cat}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">{g.label}</p>
            <p className="text-[var(--color-text)]">{g.items.map((t) => t.name).join(' · ')}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export const PREMIUM_SKILLS: SectionVariant[] = [
  { id: 'constellation', name: 'Constellation ◆', description: 'Your stack as a connected graph — hover a category to light it up.', Component: SkillsConstellation },
];

// ---------------------------------------------------------------------------
// CONTACT — mega sign-off
// ---------------------------------------------------------------------------

function ContactMega({ profile, socialLinks }: SectionProps) {
  const email = profile?.email || 'hello@example.com';
  const time = useLiveClock(profile?.heroTimezone);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  return (
    <section id="contact" className="grain relative overflow-hidden border-t border-[var(--color-border)]">
      <div className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[80%] w-[120%] -translate-x-1/2 rounded-[100%] bg-[var(--color-accent)] opacity-20 blur-[120px]" />
      <div ref={ref} className="relative mx-auto max-w-6xl px-6 pb-8 pt-28">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">{profile?.availability || 'Available for new work'}</p>
            <h2 className="text-balance text-5xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--color-text)] sm:text-7xl">
              Have something <span className="italic" style={SERIF}>ambitious</span> in mind?
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <SolidButton href={`mailto:${email}`} className="h-14 px-8 text-base">
              <Mail className="size-5" /> {email}
            </SolidButton>
            <p className="font-mono text-xs text-[var(--color-text-faint)]">
              Local time · <span className="tabular-nums text-[var(--color-text-muted)]">{time}</span>
            </p>
          </div>
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-20 grid border-t border-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
            {socialLinks.map((l) => (
              <a key={l._id} href={l.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-[var(--color-border)] py-6 pr-6 text-lg capitalize text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0">
                {l.label || l.platform}
                <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
              </a>
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 80 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="shine-text mt-16 select-none whitespace-nowrap text-center text-[15vw] font-semibold leading-[0.8] tracking-[-0.06em] lg:text-[190px]"
        >
          {(profile?.name || 'Your Name').split(' ')[0]}
          <span className="italic" style={SERIF}>
            .
          </span>
        </motion.p>
      </div>
    </section>
  );
}

export const PREMIUM_CONTACT: SectionVariant[] = [
  { id: 'mega', name: 'Mega sign-off ◆', description: 'Big invitation, live local time, social grid and your name in shimmering giant type.', Component: ContactMega },
];
