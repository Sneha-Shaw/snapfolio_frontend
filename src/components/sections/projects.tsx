import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { FocusCards } from '@/components/aceternity/FocusCards';
import { ProjectGrid } from '@/components/work/ProjectGrid';
import { TechBadge } from '@/components/tech/TechBadge';
import { PageSpinner } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { Project } from '@/types/models';
import {
  Heading,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  ViewAllLink,
  cardClass,
  metroColor,
  pickProjects,
  type SectionProps,
  type SectionVariant,
} from './shared';

function Thumb({ project, className }: { project: Project; className?: string }) {
  return project.thumbnail?.url ? (
    <img src={project.thumbnail.url} alt={project.title} loading="lazy" className={cn('size-full object-cover', className)} />
  ) : (
    <div className="flex size-full items-center justify-center bg-[var(--color-bg-elevated-2)] text-[var(--color-text-faint)]">
      <ImageOff className="size-8" />
    </div>
  );
}

/** Shared wrapper: heading, loading/empty states, "view all" link. */
function ProjectsShell({
  props,
  title = 'Featured projects',
  eyebrow = 'Selected work',
  wide,
  children,
}: {
  props: SectionProps;
  title?: string;
  eyebrow?: string;
  wide?: boolean;
  children: ReactNodeFn;
}) {
  const list = pickProjects(props.projects, 6);
  return (
    <Section wide={wide}>
      <Heading eyebrow={eyebrow} title={title} action={<ViewAllLink className="hidden sm:inline-flex" />} />
      {props.projectsLoading ? (
        <PageSpinner />
      ) : list.length === 0 ? (
        <p className="text-sm text-[var(--color-text-faint)]">No projects yet. Check back soon.</p>
      ) : (
        children(list)
      )}
      <ViewAllLink className="mt-8 sm:hidden" />
    </Section>
  );
}
type ReactNodeFn = (list: Project[]) => ReactNode;

function ProjectsFocus(props: SectionProps) {
  return (
    <ProjectsShell props={props}>
      {(list) => (
        <FocusCards
          cards={list.slice(0, 3).map((p) => ({ title: p.title, subtitle: p.shortDescription, imageUrl: p.thumbnail.url, href: `/work/${p.slug}` }))}
        />
      )}
    </ProjectsShell>
  );
}

function ProjectsGrid3D(props: SectionProps) {
  return <ProjectsShell props={props} wide>{(list) => <ProjectGrid projects={list} />}</ProjectsShell>;
}

function ProjectsList(props: SectionProps) {
  return (
    <ProjectsShell props={props}>
      {(list) => (
        <ul className="border-t border-[var(--color-border)]">
          {list.map((p) => (
            <li key={p._id} className="border-b border-[var(--color-border)]">
              <Link to={`/work/${p.slug}`} className="group flex items-baseline gap-4 py-5">
                <span className="w-12 shrink-0 font-mono text-xs text-[var(--color-text-faint)]">{p.year || ''}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">{p.title}</span>
                  {p.shortDescription && <span className="mt-1 block text-sm text-[var(--color-text-muted)]">{p.shortDescription}</span>}
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-[var(--color-text-faint)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ProjectsShell>
  );
}

function ProjectsBento(props: SectionProps) {
  return (
    <ProjectsShell props={props} wide>
      {(list) => (
        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p, i) => (
            <Reveal
              key={p._id}
              delay={i * 0.05}
              className={cn('group relative overflow-hidden rounded-2xl border border-[var(--color-border)]', i === 0 && 'sm:col-span-2 sm:row-span-2', i === 3 && 'lg:col-span-2')}
            >
              <Link to={`/work/${p.slug}`} className="block size-full">
                <Thumb project={p} className="transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className={cn('font-semibold text-white', i === 0 && 'text-2xl')}>{p.title}</p>
                  {p.shortDescription && <p className="mt-1 line-clamp-2 text-sm text-white/75">{p.shortDescription}</p>}
                </div>
                <ArrowUpRight className="absolute right-4 top-4 size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </ProjectsShell>
  );
}

function ProjectsShowcase(props: SectionProps) {
  return (
    <ProjectsShell props={props} wide>
      {(list) => (
        <div className="space-y-24">
          {list.slice(0, 4).map((p, i) => (
            <Reveal key={p._id} className={cn('grid items-center gap-10 md:grid-cols-2', i % 2 === 1 && 'md:[&>*:first-child]:order-2')}>
              <Link to={`/work/${p.slug}`} className="group block aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-card)]">
                <Thumb project={p} className="transition-transform duration-700 group-hover:scale-105" />
              </Link>
              <div>
                <p className="font-mono text-sm text-[var(--color-accent)]">0{i + 1}{p.role && ` — ${p.role}`}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">{p.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-[var(--color-text-muted)]">{p.shortDescription}</p>
                {p.technologies.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {p.technologies.slice(0, 6).map((t) => (
                      <TechBadge key={t._id} technology={t} className="px-2 py-1 text-[11px]" />
                    ))}
                  </div>
                )}
                <Link to={`/work/${p.slug}`} className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  Read case study <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </ProjectsShell>
  );
}

function ProjectsCarousel(props: SectionProps) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <ProjectsShell props={props} wide>
      {(list) => (
        <div className="relative">
          <div ref={track} className="custom-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6">
            {list.map((p) => (
              <Link key={p._id} to={`/work/${p.slug}`} className={`${cardClass} group w-[80%] shrink-0 snap-start overflow-hidden sm:w-[46%] lg:w-[31%]`}>
                <div className="aspect-video overflow-hidden">
                  <Thumb project={p} className="transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">{p.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-2 flex justify-end gap-2">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                aria-label={d < 0 ? 'Previous' : 'Next'}
                onClick={() => scroll(d)}
                className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)]"
              >
                {d < 0 ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </ProjectsShell>
  );
}

function ProjectsHoverReveal(props: SectionProps) {
  const [active, setActive] = useState<Project | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <ProjectsShell props={props}>
      {(list) => (
        <div className="relative" onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
          {list.map((p, i) => (
            <Link
              key={p._id}
              to={`/work/${p.slug}`}
              onMouseEnter={() => setActive(p)}
              className="group flex items-center justify-between gap-4 border-b border-[var(--color-border)] py-7 transition-colors"
            >
              <span className="flex items-baseline gap-5">
                <span className="font-mono text-xs text-[var(--color-text-faint)]">0{i + 1}</span>
                <span className="text-2xl font-semibold tracking-tight text-[var(--color-text-muted)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--color-text)] sm:text-5xl">
                  {p.title}
                </span>
              </span>
              <span className="hidden text-sm text-[var(--color-text-faint)] sm:block">{p.role || p.year}</span>
            </Link>
          ))}
          {active?.thumbnail?.url && (
            <motion.img
              key={active._id}
              src={active.thumbnail.url}
              alt=""
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, x: pos.x + 24, y: pos.y - 110 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className="pointer-events-none absolute left-0 top-0 z-10 hidden h-44 w-72 rounded-xl object-cover shadow-2xl md:block"
            />
          )}
        </div>
      )}
    </ProjectsShell>
  );
}

function StackCard({ project, i, total, progress }: { project: Project; i: number; total: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - i) * 0.04]);
  return (
    <div className="sticky top-24 h-[70vh] pt-[calc(var(--i)*28px)]" style={{ ['--i' as string]: i }}>
      <motion.div style={{ scale }} className={`${cardClass} grid h-[60vh] origin-top overflow-hidden md:grid-cols-[1fr_1.2fr]`}>
        <div className="flex flex-col justify-between p-8">
          <div>
            <p className="font-mono text-sm text-[var(--color-accent)]">0{i + 1} / 0{total}</p>
            <h3 className="mt-4 text-3xl font-semibold text-[var(--color-text)]">{project.title}</h3>
            <p className="mt-3 text-[var(--color-text-muted)]">{project.shortDescription}</p>
          </div>
          <Link to={`/work/${project.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)]">
            View project <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="hidden overflow-hidden md:block">
          <Thumb project={project} />
        </div>
      </motion.div>
    </div>
  );
}

function StackList({ list }: { list: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const items = list.slice(0, 5);
  return (
    <div ref={ref}>
      {items.map((p, i) => (
        <StackCard key={p._id} project={p} i={i} total={items.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function ProjectsStack(props: SectionProps) {
  return <ProjectsShell props={props} wide>{(list) => <StackList list={list} />}</ProjectsShell>;
}

function ProjectsMagazine(props: SectionProps) {
  return (
    <ProjectsShell props={props} title="In this issue" eyebrow="Features">
      {(list) => (
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {list.map((p, i) => (
            <Reveal key={p._id} delay={(i % 2) * 0.08} className={cn(i % 2 === 1 && 'md:mt-20')}>
              <Link to={`/work/${p.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden">
                  <Thumb project={p} className="grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                </div>
                <div className="mt-4 flex gap-4 border-t-2 border-[var(--color-text)] pt-4">
                  <span className="text-4xl font-black leading-none text-[var(--color-accent)]">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-[var(--color-text)]">{p.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{p.shortDescription}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </ProjectsShell>
  );
}

function ProjectsMetro(props: SectionProps) {
  const list = pickProjects(props.projects, 6);
  if (list.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">work</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 [&_.metro-tile]:min-h-40">
        {list.map((p, i) => (
          <Link key={p._id} to={`/work/${p.slug}`} className={cn('contents')}>
            <MetroTile color={metroColor(i)} index={i} className={cn(i === 0 && 'col-span-2 row-span-2 min-h-80', i === 3 && 'col-span-2')}>
              {p.thumbnail?.url && <img src={p.thumbnail.url} alt="" className="absolute inset-0 size-full object-cover opacity-30 mix-blend-luminosity" />}
              <span className="relative text-xs opacity-80">{p.year}</span>
              <div className="relative">
                <p className={cn('font-semibold', i === 0 ? 'text-2xl' : 'text-base')}>{p.title}</p>
                {i === 0 && <p className="mt-1 text-sm opacity-85">{p.shortDescription}</p>}
              </div>
            </MetroTile>
          </Link>
        ))}
        <Link to="/work" className="contents">
          <MetroTile color={metroColor(list.length)} index={list.length}>
            <ArrowRight className="size-6" />
            <p className="text-sm">all projects</p>
          </MetroTile>
        </Link>
      </div>
    </section>
  );
}

function ProjectsTerminal(props: SectionProps) {
  const list = pickProjects(props.projects, 6);
  if (list.length === 0) return null;
  return (
    <TerminalSection profile={props.profile} cmd="ls -l ./projects">
      <p className="text-[var(--color-text-faint)]">total {list.length}</p>
      <ul className="mt-1 space-y-2">
        {list.map((p) => (
          <li key={p._id} className="grid gap-x-4 sm:grid-cols-[auto_1fr]">
            <span className="hidden text-[var(--color-text-faint)] sm:inline">drwxr-xr-x {p.year || '----'}</span>
            <span>
              <Link to={`/work/${p.slug}`} className="font-semibold text-[var(--color-accent)] hover:underline">
                {p.slug}/
              </Link>
              {p.shortDescription && <span className="block text-xs sm:inline sm:text-sm"> — {p.shortDescription}</span>}
            </span>
          </li>
        ))}
      </ul>
      <Link to="/work" className="mt-3 inline-block text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]">
        → cd ./work to see everything
      </Link>
    </TerminalSection>
  );
}

export const PROJECTS_VARIANTS: SectionVariant[] = [
  { id: 'focus', name: 'Focus cards', description: 'Three image cards — hovering one blurs the rest.', Component: ProjectsFocus },
  { id: 'grid-3d', name: '3D card grid', description: 'Cards that tilt in 3D with tech badges.', Component: ProjectsGrid3D },
  { id: 'showcase', name: 'Zig-zag showcase', description: 'Big alternating image/text rows, case-study style.', Component: ProjectsShowcase },
  { id: 'hover-reveal', name: 'Hover reveal list', description: 'Huge titles; a preview image follows your cursor.', Component: ProjectsHoverReveal },
  { id: 'stack', name: 'Sticky stack', description: 'Cards stack on top of each other as you scroll.', Component: ProjectsStack },
  { id: 'bento', name: 'Bento grid', description: 'Mixed-size image tiles, first one large.', Component: ProjectsBento },
  { id: 'carousel', name: 'Carousel', description: 'Swipeable horizontal slider with arrows.', Component: ProjectsCarousel },
  { id: 'magazine', name: 'Magazine', description: 'Numbered, staggered two-column features.', Component: ProjectsMagazine },
  { id: 'metro', name: 'Metro tiles', description: 'Flat colored tiles with image tint.', Component: ProjectsMetro },
  { id: 'list', name: 'Minimal list', description: 'Year, title, one-liner. Nothing else.', Component: ProjectsList },
  { id: 'terminal', name: 'Terminal', description: '`ls -l ./projects`.', Component: ProjectsTerminal },
];
