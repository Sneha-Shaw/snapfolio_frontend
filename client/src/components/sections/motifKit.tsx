import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SectionVariant } from './shared';
import { conceptVariant, isConceptId, CONCEPT_SCENES } from './conceptScenes';
import {
  Avatar,
  CountUp,
  Reveal,
  galleryOf,
  groupTech,
  initials,
  newestFirst,
  oldestFirst,
  pickProjects,
  servicesOf,
  statsOf,
  type SectionProps,
} from './shared';

/**
 * Motif kits.
 *
 * The problem this solves: a concept preset is only convincing if *every*
 * section belongs to the same object. Before this, 122 of the 196 sections
 * across the concept presets were borrowed generic designs — a walnut radio
 * page whose contact block was a plain form, a ploughed-field page with a
 * glass stat row. The motif held for one section and then evaporated.
 *
 * Rather than hand-write 122 one-off components (unmaintainable, and they
 * would drift apart), each motif declares a small kit:
 *
 *   Frame     the material housing — walnut cabinet, carbon fascia, chart
 *             paper, cloth board. This is what makes the section belong.
 *   Backdrop  optional atmosphere painted behind the section.
 *   Bullet    the ornament used for list markers.
 *   surface   'dark' or 'paper', which drives the ink colours.
 *
 * `buildMotifSections` then renders every section type through that kit, so a
 * motif gets a complete, internally consistent page for one small declaration.
 * Lighting and depth come from the shared `.motif-panel` / `.motif-tile` /
 * `.motif-well` classes, so all 28 motifs share one light direction.
 */

export interface MotifKit {
  /** Matches the preset id, so `kit-<id>` variant ids stay unique. */
  id: string;
  /** Shown in the design picker, e.g. "Walnut cabinet". */
  label: string;
  /** Material housing. Receives the section's content. */
  Frame: ComponentType<{ children: ReactNode; className?: string }>;
  /** Atmosphere behind the section. */
  Backdrop?: ComponentType;
  /** List marker ornament. */
  Bullet?: ComponentType<{ className?: string }>;
  /** Pale housings need dark ink. */
  surface?: 'dark' | 'paper';
  /** Extra classes for headings, e.g. a serif or uppercase treatment. */
  titleClass?: string;
  /** Extra classes for the small eyebrow label. */
  eyebrowClass?: string;
  /** Rounded corners for tiles inside this motif (sharp motifs want none). */
  tileClass?: string;
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

/** Wraps a section in the kit's backdrop and frame, with ink vars resolved. */
function Shell({
  kit,
  id,
  eyebrow,
  title,
  children,
  bare,
}: {
  kit: MotifKit;
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  /** Skip the frame — for sections that supply their own full-bleed layout. */
  bare?: boolean;
}) {
  const { Frame, Backdrop } = kit;
  const inkClass = kit.surface === 'paper' ? 'on-paper' : 'on-dark';

  const body = (
    <>
      {(eyebrow || title) && (
        <header className="mb-8">
          {eyebrow && (
            <p className={cn('mb-2 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--ink-faint)]', kit.eyebrowClass)}>
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className={cn('text-3xl font-semibold tracking-tight text-[var(--ink)]', kit.titleClass)}>{title}</h2>
          )}
        </header>
      )}
      {children}
    </>
  );

  return (
    <section id={id} className="relative overflow-hidden">
      {Backdrop && <Backdrop />}
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {bare ? (
          <div className={inkClass}>{body}</div>
        ) : (
          <Frame className={inkClass}>{body}</Frame>
        )}
      </div>
    </section>
  );
}

function Marker({ kit, className }: { kit: MotifKit; className?: string }) {
  const { Bullet } = kit;
  if (Bullet) return <Bullet className={className} />;
  return <span className={cn('size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]', className)} />;
}

const tile = (kit: MotifKit, extra?: string) => cn('motif-tile', kit.tileClass, extra);

// ---------------------------------------------------------------------------
// Section templates
// ---------------------------------------------------------------------------

function makeAbout(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifAbout({ profile }: SectionProps) {
    const areas = (profile?.focusAreas ?? []).slice(0, 8);
    return (
      <Shell kit={kit} id="about" eyebrow="About" title={profile?.headline || 'About'}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)]">
          <div>
            {profile?.aboutText && (
              <div className="space-y-4 text-[var(--ink-muted)]">
                {profile.aboutText.split('\n').filter(Boolean).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
            {areas.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {areas.map((area) => (
                  <span
                    key={area}
                    className={tile(kit, 'px-3.5 py-1.5 text-xs font-medium text-[var(--ink)]')}
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="motif-well overflow-hidden">
            <Avatar profile={profile} className="aspect-[4/5] w-full" />
          </div>
        </div>
      </Shell>
    );
  };
}

function makeServices(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifServices({ profile }: SectionProps) {
    const services = servicesOf(profile);
    if (services.length === 0) return null;
    return (
      <Shell kit={kit} eyebrow="Services" title="What I do">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className={tile(kit, 'h-full p-5')}>
                <p className="mb-3 font-mono text-[10px] tracking-widest text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="font-medium text-[var(--ink)]">{s.title}</p>
                {s.description && <p className="mt-1.5 text-sm text-[var(--ink-muted)]">{s.description}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>
    );
  };
}

function makeTestimonials(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifTestimonials({ profile }: SectionProps) {
    const quotes = profile?.testimonials ?? [];
    if (quotes.length === 0) return null;
    return (
      <Shell kit={kit} eyebrow="Testimonials" title="In their words">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={i * 0.06}>
              <figure className={tile(kit, 'flex h-full flex-col p-5')}>
                <blockquote className="flex-1 text-sm leading-relaxed text-[var(--ink)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--ink-rule)] pt-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--color-accent-soft)] text-[10px] font-semibold text-[var(--color-accent)]">
                    {initials(t.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--ink)]">{t.name}</p>
                    <p className="truncate text-xs text-[var(--ink-faint)]">
                      {[t.role, t.company].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Shell>
    );
  };
}

function makeContact(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifContact({ profile, socialLinks }: SectionProps) {
    const email = profile?.email || 'hello@example.com';
    return (
      <Shell kit={kit} id="contact" eyebrow="Contact" title={profile?.availability || 'Get in touch'}>
        <p className="max-w-xl text-[var(--ink-muted)]">
          {profile?.heroCurrently || 'Open to new work and collaborations.'}
        </p>
        <a
          href={`mailto:${email}`}
          className={tile(kit, 'mt-7 inline-flex items-center gap-3 px-6 py-4 text-base font-medium text-[var(--ink)]')}
        >
          <Marker kit={kit} />
          {email}
          <ArrowUpRight className="size-4 text-[var(--color-accent)]" />
        </a>
        {socialLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map((l) => (
              <a
                key={l._id}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className={tile(kit, 'px-3.5 py-1.5 text-xs text-[var(--ink-muted)]')}
              >
                {l.label || l.platform}
              </a>
            ))}
          </div>
        )}
      </Shell>
    );
  };
}

function makeEducation(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifEducation({ education }: SectionProps) {
    const items = oldestFirst(education).reverse();
    if (items.length === 0) return null;
    return (
      <Shell kit={kit} id="education" eyebrow="Education" title="Training">
        <ol className="space-y-3">
          {items.map((edu, i) => (
            <Reveal key={edu._id} delay={i * 0.04}>
              <li className={tile(kit, 'flex items-start gap-4 p-4')}>
                <Marker kit={kit} className="mt-1.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--ink)]">{edu.degree}</p>
                  <p className="text-sm text-[var(--ink-muted)]">{edu.institution}</p>
                  {edu.field && <p className="mt-0.5 text-xs text-[var(--ink-faint)]">{edu.field}</p>}
                </div>
                <p className="shrink-0 font-mono text-xs text-[var(--ink-faint)]">
                  {new Date(edu.startDate).getFullYear()}
                  {edu.endDate ? `–${new Date(edu.endDate).getFullYear()}` : ''}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Shell>
    );
  };
}

function makeGallery(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifGallery({ projects }: SectionProps) {
    const items = galleryOf(projects, 9);
    if (items.length === 0) return null;
    return (
      <Shell kit={kit} eyebrow="Gallery" title="Selected frames">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={`${item.slug}-${item.url}`} delay={i * 0.04}>
              <Link to={`/work/${item.slug}`} title={item.title} className="motif-well group block overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </Shell>
    );
  };
}

function makeStats(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifStats(props: SectionProps) {
    const stats = statsOf(props);
    if (stats.length === 0) return null;
    return (
      <Shell kit={kit} eyebrow="By the numbers" title="Record">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.slice(0, 4).map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <div className={tile(kit, 'p-5')}>
                <p className="tabular text-4xl font-semibold text-[var(--color-accent)]">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-wider text-[var(--ink-muted)]">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>
    );
  };
}

function makeProjects(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifProjects({ projects, projectsLoading }: SectionProps) {
    const items = pickProjects(projects, 6);
    if (projectsLoading || items.length === 0) return null;
    return (
      <Shell kit={kit} id="projects" eyebrow="Work" title="Selected work">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project, i) => (
            <Reveal key={project._id} delay={i * 0.06}>
              <Link to={`/work/${project.slug}`} className={tile(kit, 'group flex h-full flex-col overflow-hidden')}>
                {project.thumbnail?.url && (
                  <div className="motif-well m-2 overflow-hidden">
                    <img
                      src={project.thumbnail.url}
                      alt={project.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4 pt-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="truncate font-medium text-[var(--ink)]">{project.title}</h3>
                    <span className="shrink-0 font-mono text-xs text-[var(--ink-faint)]">{project.year}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-[var(--ink-muted)]">{project.shortDescription}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Shell>
    );
  };
}

function makeSkills(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifSkills({ technologies }: SectionProps) {
    const groups = groupTech(technologies);
    if (groups.length === 0) return null;
    return (
      <Shell kit={kit} id="skills" eyebrow="Stack" title="Tools">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, gi) => (
            <Reveal key={group.cat} delay={gi * 0.05}>
              <div className={tile(kit, 'h-full p-4')}>
                <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                  <Marker kit={kit} />
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((tech) => (
                    <span
                      key={tech._id}
                      className="rounded-md border border-[var(--ink-rule)] px-2 py-0.5 text-[11px] text-[var(--ink-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--ink)]"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>
    );
  };
}

function makeExperience(kit: MotifKit): ComponentType<SectionProps> {
  return function MotifExperience({ experiences }: SectionProps) {
    const items = newestFirst(experiences);
    if (items.length === 0) return null;
    return (
      <Shell kit={kit} id="experience" eyebrow="Experience" title="Where I have worked">
        <ol className="space-y-3">
          {items.map((exp, i) => (
            <Reveal key={exp._id} delay={i * 0.04}>
              <li className={tile(kit, 'p-5')}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <div className="flex items-center gap-3">
                    <Marker kit={kit} />
                    <div>
                      <p className="font-medium text-[var(--ink)]">{exp.position}</p>
                      <p className="text-sm text-[var(--color-accent)]">{exp.company}</p>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-[var(--ink-faint)]">
                    {new Date(exp.startDate).getFullYear()} —{' '}
                    {exp.current ? 'present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                  </p>
                </div>
                {exp.responsibilities.length > 0 && (
                  <ul className="mt-3 space-y-1.5 pl-6">
                    {exp.responsibilities.slice(0, 3).map((r) => (
                      <li key={r} className="text-xs text-[var(--ink-muted)]">
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </Shell>
    );
  };
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export type MotifSectionName =
  | 'about'
  | 'services'
  | 'testimonials'
  | 'contact'
  | 'education'
  | 'gallery'
  | 'stats'
  | 'projects'
  | 'skills'
  | 'experience';

const BUILDERS: Record<MotifSectionName, (kit: MotifKit) => ComponentType<SectionProps>> = {
  about: makeAbout,
  services: makeServices,
  testimonials: makeTestimonials,
  contact: makeContact,
  education: makeEducation,
  gallery: makeGallery,
  stats: makeStats,
  projects: makeProjects,
  skills: makeSkills,
  experience: makeExperience,
};

const BLURB: Record<MotifSectionName, string> = {
  about: 'About, set in the motif’s own housing.',
  services: 'Services as numbered plates in the motif’s material.',
  testimonials: 'Quotes mounted in the motif’s housing.',
  contact: 'Contact rendered as part of the same object.',
  education: 'Training listed on the motif’s surface.',
  gallery: 'Images recessed into the motif’s wells.',
  stats: 'Figures on plates of the motif’s material.',
  projects: 'Work recessed into the motif’s housing.',
  skills: 'Tools grouped on the motif’s plates.',
  experience: 'Roles listed in the motif’s housing.',
};

/**
 * Every section type for one motif, keyed by section name. Variant ids are
 * `kit-<motif id>`, which is unique because a motif appears in one preset.
 */
export function buildMotifSections(kit: MotifKit): Record<MotifSectionName, SectionVariant> {
  const out = {} as Record<MotifSectionName, SectionVariant>;
  for (const name of Object.keys(BUILDERS) as MotifSectionName[]) {
    out[name] = {
      id: `kit-${kit.id}`,
      name: `${isConceptId(kit.id) ? CONCEPT_SCENES[kit.id][0] + ' scene' : kit.label} ✺`,
      description: isConceptId(kit.id) ? `${CONCEPT_SCENES[kit.id][0]} objects and spatial arrangements for ${name}.` : BLURB[name],
      Component: isConceptId(kit.id) ? conceptVariant(kit.id, name) : BUILDERS[name](kit),
    };
  }
  return out;
}

/** Collects one section across many kits, for registering in the registry. */
export function collect(kits: MotifKit[], name: MotifSectionName): SectionVariant[] {
  return kits.map((kit) => ({
    id: `kit-${kit.id}`,
    name: `${isConceptId(kit.id) ? CONCEPT_SCENES[kit.id][0] + ' scene' : kit.label} ✺`,
    description: isConceptId(kit.id) ? `${CONCEPT_SCENES[kit.id][0]} objects and spatial arrangements for ${name}.` : BLURB[name],
    Component: isConceptId(kit.id) ? conceptVariant(kit.id, name) : BUILDERS[name](kit),
  }));
}

// ---------------------------------------------------------------------------
// Frame helpers shared by the kit definitions
// ---------------------------------------------------------------------------

/** Standard panel frame: shared lighting, with a material class layered on. */
export function panelFrame(material: string, opts?: { fibre?: boolean; pad?: string }) {
  return function Frame({ children, className }: { children: ReactNode; className?: string }) {
    return (
      <div
        className={cn(
          'motif-panel',
          opts?.fibre ? 'mat-fibre' : 'mat-noise',
          material,
          opts?.pad ?? 'p-7 sm:p-10',
          className
        )}
      >
        {children}
      </div>
    );
  };
}

/** A full-bleed atmospheric layer, e.g. the sea column or a starfield wash. */
export function backdrop(classes: string, opacity = 1) {
  return function Backdrop() {
    return <div className={cn('pointer-events-none absolute inset-0', classes)} style={{ opacity }} aria-hidden />;
  };
}

/** Simple ornament bullet from a CSS class (a leaf, an ear of wheat, a dew bead). */
export function ornament(classes: string, size = 'size-3') {
  return function Bullet({ className }: { className?: string }) {
    return <span className={cn(size, 'shrink-0', classes, className)} aria-hidden />;
  };
}

/** Animated marker, for motifs whose ornament should move (pulse, spin). */
export function motionOrnament(classes: string, size = 'size-2.5') {
  return function Bullet({ className }: { className?: string }) {
    return (
      <motion.span
        className={cn(size, 'shrink-0 rounded-full', classes, className)}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />
    );
  };
}
