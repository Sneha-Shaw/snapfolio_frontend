import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { TECH_CATEGORIES } from '@/types/models';
import type { Education, Experience, Profile, Project, Service, SocialLink, Technology } from '@/types/models';

/** Everything a section can render — fetched once by the Home page. */
export interface SectionProps {
  profile: Profile | null;
  technologies: Technology[];
  projects: Project[];
  projectsLoading: boolean;
  experiences: Experience[];
  education: Education[];
  socialLinks: SocialLink[];
}

export interface SectionVariant {
  id: string;
  name: string;
  description: string;
  Component: ComponentType<SectionProps>;
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

export const DEFAULT_STATEMENT = ['Building thoughtful software,', 'end to end.'];

export function statementLines(profile: Profile | null): string[] {
  return profile?.heroStatement ? profile.heroStatement.split('\n').filter(Boolean) : DEFAULT_STATEMENT;
}

/** Featured projects if any are flagged, otherwise the most recent ones. */
export function pickProjects(projects: Project[], count: number): Project[] {
  const featured = projects.filter((p) => p.featured);
  return (featured.length > 0 ? featured : projects).slice(0, count);
}

export function newestFirst<T extends { startDate: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));
}

export function oldestFirst<T extends { startDate: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
}

export function initials(name: string | undefined): string {
  return (name || '?')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function shellHost(profile: Profile | null): string {
  const first = (profile?.name || 'portfolio').split(' ')[0] ?? 'portfolio';
  return first.toLowerCase().replace(/[^a-z0-9]/g, '') || 'portfolio';
}

export function yearsOfExperience(experiences: Experience[]): number {
  if (experiences.length === 0) return 0;
  const earliest = Math.min(...experiences.map((e) => +new Date(e.startDate)));
  return Math.max(1, Math.round((Date.now() - earliest) / (365.25 * 24 * 3600 * 1000)));
}

export const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Data',
  'ai-data': 'AI / ML',
  devops: 'DevOps',
  language: 'Languages',
  tooling: 'Tooling',
};

export function groupTech(technologies: Technology[]) {
  return TECH_CATEGORIES.map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat] ?? cat,
    items: technologies.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0);
}

/** Flat Windows-Metro tile palette — theme accents first, then the classic Metro colors. */
export const METRO_COLORS = [
  'var(--color-accent)',
  '#2d89ef',
  '#00a300',
  '#e3a21a',
  '#b91d47',
  '#9f00a7',
  '#00aba9',
  '#da532c',
  'var(--color-accent-strong)',
  '#1e7145',
];

export function metroColor(i: number): string {
  return METRO_COLORS[i % METRO_COLORS.length]!;
}

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  /** Kept for call-site readability; every section now shares one width so edges align. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn('relative mx-auto max-w-6xl px-6 py-20', className)}>
      {children}
    </section>
  );
}

export function Heading({
  eyebrow,
  title,
  align = 'left',
  className,
  action,
}: {
  eyebrow?: string;
  title?: string;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn('mb-10 flex items-end justify-between gap-4', align === 'center' && 'flex-col items-center text-center', className)}>
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">{eyebrow}</p>
        )}
        {title && <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">{title}</h2>}
      </div>
      {action}
    </div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PrimaryCTA({ href = '#contact', children = 'Get in touch', className }: { href?: string; children?: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-6 text-sm font-medium text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] transition-all hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]',
        className
      )}
    >
      {children}
    </a>
  );
}

export function SecondaryCTA({ to = '/work', children, className }: { to?: string; children?: ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] px-6 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)]',
        className
      )}
    >
      {children ?? (
        <>
          See my work <ArrowRight className="size-4" />
        </>
      )}
    </Link>
  );
}

export function ViewAllLink({ className }: { className?: string }) {
  return (
    <Link
      to="/work"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]',
        className
      )}
    >
      View all work <ArrowRight className="size-4" />
    </Link>
  );
}

export function Avatar({ profile, className }: { profile: Profile | null; className?: string }) {
  return profile?.profileImage?.url ? (
    <img src={profile.profileImage.url} alt={profile.name || 'Profile photo'} className={cn('object-cover', className)} />
  ) : (
    <div
      className={cn(
        'flex items-center justify-center bg-[var(--color-accent-soft)] font-semibold text-[var(--color-accent)]',
        className
      )}
    >
      {initials(profile?.name)}
    </div>
  );
}

export const cardClass =
  'elevated-card rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-colors hover:border-[var(--color-border-hover)]';

// ---------------------------------------------------------------------------
// Terminal primitives (shared by every "terminal" variant)
// ---------------------------------------------------------------------------

export function Prompt({ host, cmd, cursor }: { host: string; cmd?: string; cursor?: boolean }) {
  return (
    <p className="break-all">
      <span className="text-[var(--color-accent)]">guest@{host}</span>
      <span className="text-[var(--color-text-faint)]">:</span>
      <span className="text-[var(--color-accent-strong)]">~</span>
      <span className="text-[var(--color-text-faint)]">$ </span>
      {cmd && <span className="text-[var(--color-text)]">{cmd}</span>}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          className="inline-block h-4 w-2 translate-y-0.5 bg-[var(--color-accent)]"
        />
      )}
    </p>
  );
}

export function TerminalWindow({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <Reveal
      className={cn(
        'elevated-card overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] font-mono text-sm',
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate text-xs text-[var(--color-text-faint)]">{title}</span>
      </div>
      <div className="space-y-3 p-5 leading-relaxed sm:p-7">{children}</div>
    </Reveal>
  );
}

export function TerminalOutput({ children }: { children: ReactNode }) {
  return <div className="border-l border-[var(--color-border)] pl-4 text-[var(--color-text-muted)]">{children}</div>;
}

/** Wraps a terminal-styled section with the page's standard width. */
export function TerminalSection({ profile, cmd, children }: { profile: Profile | null; cmd: string; children: ReactNode }) {
  const host = shellHost(profile);
  return (
    <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <TerminalWindow title={`guest@${host}: ~ — ${cmd.split(' ')[0]}`}>
        <Prompt host={host} cmd={cmd} />
        <TerminalOutput>{children}</TerminalOutput>
      </TerminalWindow>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Metro primitives
// ---------------------------------------------------------------------------

export function MetroTile({
  color,
  className,
  children,
  index = 0,
}: {
  color: string;
  className?: string;
  children: ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -70 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.06, ease: 'easeOut' }}
      style={{
        background: color,
        color:
          color === 'var(--color-accent)'
            ? 'var(--color-on-accent)'
            : color === 'var(--color-accent-strong)'
              ? 'var(--color-on-accent-strong)'
              : '#ffffff',
        transformPerspective: 800,
      }}
      className={cn(
        'metro-tile relative flex flex-col justify-between overflow-hidden p-4 transition-transform duration-150 hover:scale-[0.98]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Shared content helpers for the newer sections
// ---------------------------------------------------------------------------

/** Explicit services if the admin wrote any, otherwise focus areas as bare titles. */
export function servicesOf(profile: Profile | null): Service[] {
  if (profile?.services?.length) return profile.services;
  return (profile?.focusAreas ?? []).map((title) => ({ title, description: '' }));
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export function statsOf({ experiences, projects, technologies, education }: SectionProps): StatItem[] {
  return [
    { value: yearsOfExperience(experiences), suffix: '+', label: 'Years of experience' },
    { value: projects.length, suffix: '', label: 'Projects shipped' },
    { value: new Set(experiences.map((e) => e.company)).size, suffix: '', label: 'Companies' },
    { value: technologies.length, suffix: '', label: 'Technologies' },
    { value: education.length, suffix: '', label: 'Degrees' },
  ].filter((s) => s.value > 0);
}

export interface GalleryItem {
  url: string;
  title: string;
  slug: string;
}

/** Every project image (thumbnail first), tagged with its project for linking. */
export function galleryOf(projects: Project[], limit = 24): GalleryItem[] {
  const items: GalleryItem[] = [];
  for (const p of projects) {
    const urls = [p.thumbnail?.url, ...p.images.map((i) => i.url)].filter(Boolean) as string[];
    for (const url of new Set(urls)) items.push({ url, title: p.title, slug: p.slug });
  }
  return items.slice(0, limit);
}

/** Counts from 0 to `to` the first time the element scrolls into view. */
export function CountUp({
  to,
  suffix = '',
  className,
  style,
}: {
  to: number;
  suffix?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className} style={style}>
      {value}
      {suffix}
    </span>
  );
}

/** Card with a soft accent glow that follows the cursor. */
export function GlowCard({ className, children }: { className?: string; children: ReactNode }) {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: -999, y: -999 })}
      className={cn('group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-px', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, var(--color-accent), transparent 45%)` }}
      />
      <div className="relative h-full rounded-[calc(var(--radius-2xl)-1px)] bg-[var(--color-bg-elevated)]">
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, var(--color-accent-soft), transparent 50%)` }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}

/** Horizontally scrolling strip; children are duplicated so the loop is seamless. */
export function Marquee({
  children,
  duration = 40,
  reverse,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={cn('group flex overflow-hidden', className)}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
    >
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1}
          className={cn('flex shrink-0 items-center gap-4 pr-4', pauseOnHover && 'group-hover:[animation-play-state:paused]')}
          style={{ animation: `marquee-full ${duration}s linear infinite${reverse ? ' reverse' : ''}` }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
