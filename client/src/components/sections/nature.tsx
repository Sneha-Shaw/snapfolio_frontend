import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Globe } from '@/components/aceternity/Globe';
import type { SectionVariant } from './shared';
import {
  Avatar,
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
  oldestFirst,
  statementLines,
  statsOf,
  type SectionProps,
} from './shared';

/**
 * Concept motifs, part one: the organic ones — spider web, tree, bloom, globe.
 *
 * The rule these follow is that the motif has to carry real content, not sit
 * behind it as decoration. A web's rings are the skill categories; a tree's
 * branches are the jobs; a flower's petals are the disciplines. If you can
 * delete the motif and lose nothing, it isn't doing its job.
 *
 * All of the heavy drawing lives in index.css (`.web-silk`, `.bark`, `.petal`,
 * `.growth-rings`, …) so every one of these re-tints from the theme accent.
 */

// ---------------------------------------------------------------------------
// Shared geometry
// ---------------------------------------------------------------------------

/** Point on a circle, in percentages, for absolute positioning. */
function polar(angleDeg: number, radiusPct: number, cx = 50, cy = 50) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { left: `${cx + Math.cos(rad) * radiusPct}%`, top: `${cy + Math.sin(rad) * radiusPct}%` };
}

// ---------------------------------------------------------------------------
// SPIDER WEB
// ---------------------------------------------------------------------------

/** Leg sweep angles for one side; the other side mirrors them. */
const LEG_ANGLES = [-54, -21, 13, 45];

/** Eight-legged, drawn from divs — two body segments and four mirrored leg pairs. */
function Spider({ className }: { className?: string }) {
  return (
    <div className={cn('relative size-8', className)} aria-hidden>
      {LEG_ANGLES.flatMap((angle, i) =>
        [1, -1].map((dir) => (
          <span
            key={`${angle}:${dir}`}
            className="absolute left-1/2 top-1/2 h-[1.5px] origin-left rounded-full bg-[var(--color-text)]"
            /* Right legs sweep from the angle itself, left legs from its mirror. */
            style={{
              width: i === 1 || i === 2 ? '1.25rem' : '1rem',
              transform: `rotate(${dir === 1 ? angle : 180 - angle}deg)`,
            }}
          />
        ))
      )}
      <span className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-text)]" />
      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 translate-y-1.5 rounded-full bg-[var(--color-accent)]" />
    </div>
  );
}

/** Dew beads scattered on the silk. Fixed offsets so they sit on the rings. */
const DEW = [
  { left: '31%', top: '30%', size: 7, delay: 0 },
  { left: '68%', top: '27%', size: 5, delay: 1.1 },
  { left: '22%', top: '55%', size: 6, delay: 2.2 },
  { left: '76%', top: '58%', size: 8, delay: 0.6 },
  { left: '44%', top: '70%', size: 5, delay: 1.7 },
  { left: '59%', top: '15%', size: 6, delay: 2.8 },
];

function WebBackdrop({ x = '50%', y = '42%' }: { x?: string; y?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="web-silk absolute inset-[-30%]" style={{ '--web-x': x, '--web-y': y } as React.CSSProperties} />
      {/* Anchor threads into the corners — a web needs tethers to read as one. */}
      {[
        'left-0 top-0 origin-top-left rotate-0',
        'right-0 top-0 origin-top-right rotate-90',
        'left-0 bottom-0 origin-bottom-left -rotate-90',
        'right-0 bottom-0 origin-bottom-right rotate-180',
      ].map((pos) => (
        <div key={pos} className={cn('web-anchor absolute h-40 w-40', pos)} />
      ))}
      {DEW.map((d) => (
        <motion.span
          key={`${d.left}${d.top}`}
          className="web-dew absolute rounded-full"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
          animate={{ y: [0, 3, 0], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 4, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function HeroSpiderweb({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <WebBackdrop />

      {/* Spider on a dropline from the top edge. */}
      <div className="pointer-events-none absolute left-[78%] top-0 z-10 flex flex-col items-center" aria-hidden>
        <div className="h-28 w-px bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--color-accent)_60%,transparent)] sm:h-44" />
        <div className="animate-dangle">
          <Spider />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        {profile?.heroEyebrow && (
          <Reveal>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)] backdrop-blur">
              {profile.heroEyebrow}
            </p>
          </Reveal>
        )}
        <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-7xl">
          {lines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>
        {profile?.bio && (
          <Reveal delay={0.35}>
            <p className="mx-auto mt-7 max-w-xl text-balance text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>
          </Reveal>
        )}
        <Reveal delay={0.45} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </Reveal>
      </div>
    </section>
  );
}

function SkillsWeb({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;

  return (
    <Section id="skills">
      <Heading eyebrow="Stack" title="Caught in the web" align="center" />
      <div className="relative mx-auto aspect-square w-full max-w-3xl">
        <WebBackdrop x="50%" y="50%" />

        {/* Each category is one ring out from the centre; techs sit on it. */}
        {groups.map((group, gi) => {
          const radius = 14 + (gi * 34) / Math.max(groups.length - 1, 1);
          return (
            <div key={group.cat}>
              {group.items.map((tech, ti) => {
                const angle = (ti / group.items.length) * 360 + gi * 18;
                const pos = polar(angle, radius);
                return (
                  <motion.span
                    key={tech._id}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: gi * 0.09 + ti * 0.03 }}
                    style={pos}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text)] shadow-[var(--shadow-card)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    {tech.name}
                  </motion.span>
                );
              })}
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-4xl font-semibold text-[var(--color-accent)]">
            <CountUp to={technologies.length} />
          </p>
          <p className="text-[11px] uppercase tracking-widest text-[var(--color-text-faint)]">tools</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {groups.map((g, i) => (
          <span key={g.cat} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <span
              className="size-1.5 rounded-full bg-[var(--color-accent)]"
              style={{ opacity: 0.35 + (i / Math.max(groups.length - 1, 1)) * 0.65 }}
            />
            {g.label}
          </span>
        ))}
      </div>
    </Section>
  );
}

function ContactWeb({ profile, socialLinks }: SectionProps) {
  const email = profile?.email || 'hello@example.com';
  return (
    <section id="contact" className="relative overflow-hidden">
      <WebBackdrop x="50%" y="46%" />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">Let&apos;s connect</p>
          <a
            href={`mailto:${email}`}
            className="mt-6 block break-all text-3xl font-semibold text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] sm:text-5xl"
          >
            {email}
          </a>
        </Reveal>

        {/* Social links as beads strung along the silk. */}
        {socialLinks.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((link, i) => (
              <Reveal key={link._id} delay={i * 0.06}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 px-4 py-2 text-sm text-[var(--color-text-muted)] backdrop-blur transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                >
                  <span className="web-dew size-2 rounded-full" />
                  {link.label || link.platform}
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TREE
// ---------------------------------------------------------------------------

function ExperienceTree({ experiences }: SectionProps) {
  const items = newestFirst(experiences);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 40%'] });
  const growth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (items.length === 0) return null;

  return (
    <Section id="experience">
      <Heading eyebrow="Career" title="How it grew" align="center" />

      <div ref={ref} className="relative mx-auto max-w-4xl pb-16">
        {/* Canopy */}
        <div className="relative mx-auto mb-4 h-20 w-full max-w-md" aria-hidden>
          <div className="absolute inset-0 rounded-[50%] bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)] blur-2xl" />
          {[18, 42, 58, 82].map((l, i) => (
            <span
              key={l}
              className="leaf absolute size-6 animate-sway"
              style={{ left: `${l}%`, top: `${12 + (i % 2) * 26}%`, animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>

        {/* Trunk: a bark-textured column with a growth line that fills on scroll. */}
        <div className="absolute bottom-16 left-1/2 top-24 w-5 -translate-x-1/2 overflow-hidden rounded-full sm:w-6" aria-hidden>
          <div className="bark absolute inset-0 opacity-50" />
          <motion.div
            style={{ height: growth }}
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-strong)] opacity-70"
          />
        </div>

        <div className="relative space-y-10 pt-8">
          {items.map((exp, i) => {
            const right = i % 2 === 1;
            return (
              <div key={exp._id} className={cn('relative flex', right ? 'justify-end' : 'justify-start')}>
                {/* Branch from trunk out to the card. */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-7 hidden h-px bg-gradient-to-r from-[var(--color-accent)] to-transparent sm:block',
                    right ? 'right-1/2 w-[8%] bg-gradient-to-l' : 'left-1/2 w-[8%]'
                  )}
                />
                <span
                  aria-hidden
                  className={cn('leaf absolute top-[22px] hidden size-3.5 sm:block', right ? 'right-[56%]' : 'left-[56%]')}
                />
                <Reveal delay={i * 0.05} className="w-full sm:w-[46%]">
                  <div className={cn(cardClass, 'p-5')}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-medium text-[var(--color-text)]">{exp.position}</h3>
                      {exp.current && (
                        <span className="shrink-0 rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-accent)]">
                          now
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-accent)]">{exp.company}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">
                      {new Date(exp.startDate).getFullYear()} —{' '}
                      {exp.current ? 'present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </p>
                    {exp.responsibilities.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {exp.responsibilities.slice(0, 2).map((r) => (
                          <li key={r} className="flex gap-2 text-xs text-[var(--color-text-muted)]">
                            <span className="leaf mt-1 size-2 shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>

        {/* Roots */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-16 max-w-sm" aria-hidden>
          {[-28, -12, 12, 28].map((deg) => (
            <span
              key={deg}
              className="absolute left-1/2 top-0 h-14 w-px origin-top bg-gradient-to-b from-[color-mix(in_srgb,var(--color-accent)_55%,transparent)] to-transparent"
              style={{ transform: `rotate(${deg}deg)` }}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function EducationRings({ education }: SectionProps) {
  const items = oldestFirst(education).slice(0, 8);
  if (items.length === 0) return null;

  return (
    <Section id="education">
      <Heading eyebrow="Education" title="Rings of growth" align="center" />

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Trunk cross-section: one ring per qualification, oldest at the core. */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="growth-rings absolute inset-0 rounded-full opacity-60" aria-hidden />
          {items.map((edu, i) => {
            const scale = ((i + 1) / items.length) * 100;
            return (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-accent)]"
                style={{ width: `${scale}%`, height: `${scale}%`, opacity: 0.25 + (i / items.length) * 0.6 }}
              />
            );
          })}
          <span className="pollen absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden />
        </div>

        <ol className="space-y-3">
          {items
            .slice()
            .reverse()
            .map((edu, i) => (
              <Reveal key={edu._id} delay={i * 0.05}>
                <li className={cn(cardClass, 'flex items-start gap-4 p-4')}>
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[var(--color-accent)] text-xs font-semibold text-[var(--color-accent)]">
                    {items.length - i}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--color-text)]">{edu.degree}</p>
                    <p className="truncate text-sm text-[var(--color-text-muted)]">{edu.institution}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-faint)]">
                      {new Date(edu.startDate).getFullYear()}
                      {edu.endDate ? ` — ${new Date(edu.endDate).getFullYear()}` : ''}
                      {edu.field ? ` · ${edu.field}` : ''}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
        </ol>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// BLOOM
// ---------------------------------------------------------------------------

/** Petals radiating from a core; each petal is one label. */
function PetalRing({
  labels,
  radiusPct = 30,
  petalClass,
}: {
  labels: string[];
  radiusPct?: number;
  petalClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative aspect-square w-full">
      {labels.map((label, i) => {
        const angle = (i / labels.length) * 360;
        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.2, rotate: angle }}
            animate={inView ? { opacity: 1, scale: 1, rotate: angle } : undefined}
            transition={{ duration: 0.75, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              height: `${radiusPct}%`,
              width: 'clamp(2.5rem, 9vw, 4.5rem)',
              translate: '-50% -100%',
            }}
          >
            <div className={cn('petal h-full w-full', petalClass)} />
            {/* Counter-rotated so the label stays upright. */}
            <span
              className="absolute left-1/2 top-[18%] w-24 -translate-x-1/2 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-on-accent)] sm:text-[11px]"
              style={{ transform: `translateX(-50%) rotate(${-angle}deg)` }}
            >
              {label}
            </span>
          </motion.div>
        );
      })}
      <span className="pollen absolute left-1/2 top-1/2 size-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden />
    </div>
  );
}

function AboutBloom({ profile }: SectionProps) {
  const areas = (profile?.focusAreas ?? []).slice(0, 8);
  return (
    <Section id="about">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">About</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
            {profile?.headline || 'What I do'}
          </h2>
          {profile?.aboutText && (
            <div className="mt-5 space-y-4 text-[var(--color-text-muted)]">
              {profile.aboutText.split('\n').filter(Boolean).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          )}
          {profile?.availability && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm text-[var(--color-text-muted)]">
              <span className="size-2 animate-pulse rounded-full bg-[var(--color-accent)]" />
              {profile.availability}
            </p>
          )}
        </Reveal>

        {areas.length > 0 && (
          <div className="mx-auto w-full max-w-md animate-sway [animation-duration:9s]">
            <PetalRing labels={areas} />
          </div>
        )}
      </div>
    </Section>
  );
}

function SkillsBloom({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;

  return (
    <Section id="skills">
      <Heading eyebrow="Stack" title="In full bloom" align="center" />
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="mx-auto w-full max-w-sm">
          <PetalRing labels={groups.map((g) => g.label)} />
        </div>
        <div className="space-y-5">
          {groups.map((group, gi) => (
            <Reveal key={group.cat} delay={gi * 0.06}>
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
                  <span className="leaf size-3" />
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((tech) => (
                    <span
                      key={tech._id}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function GalleryBloom({ projects }: SectionProps) {
  const items = useMemo(() => galleryOf(projects, 10), [projects]);
  if (items.length === 0) return null;

  return (
    <Section>
      <Heading eyebrow="Gallery" title="Petals" align="center" />
      <div className="relative mx-auto aspect-square w-full max-w-2xl">
        {items.map((item, i) => {
          const angle = (i / items.length) * 360;
          const pos = polar(angle, 34);
          return (
            <motion.div
              key={`${item.slug}-${item.url}`}
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ ...pos, rotate: `${angle}deg` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <Link
                to={`/work/${item.slug}`}
                title={item.title}
                className="group block size-[clamp(4rem,14vw,7rem)] overflow-hidden shadow-[var(--shadow-card)] transition-transform duration-500 hover:scale-110"
                style={{ borderRadius: '62% 62% 62% 8% / 78% 78% 34% 34%' }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
            </motion.div>
          );
        })}
        <span className="pollen absolute left-1/2 top-1/2 size-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden />
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// GLOBE
// ---------------------------------------------------------------------------

function HeroGlobe({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[94vh] flex-col items-center justify-start overflow-hidden pt-24">
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
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
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>
        <Reveal delay={0.4} className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </Reveal>
        {(profile?.location || profile?.heroTimezone) && (
          <Reveal delay={0.5}>
            <p className="mt-7 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <MapPin className="size-3.5 text-[var(--color-accent)]" />
              {[profile?.location, profile?.heroTimezone].filter(Boolean).join(' · ')}
            </p>
          </Reveal>
        )}
      </div>

      {/* Globe sits half below the fold so it reads as a horizon. */}
      <div className="pointer-events-none relative mt-[-2rem] aspect-square w-[min(120vw,60rem)] shrink-0 translate-y-[28%]">
        <Globe className="size-full" />
      </div>
    </section>
  );
}

function StatsOrbit(props: SectionProps) {
  const stats = statsOf(props);
  if (stats.length === 0) return null;

  return (
    <Section>
      <Heading eyebrow="By the numbers" title="In orbit" align="center" />
      <div className="relative mx-auto aspect-square w-full max-w-2xl">
        {/* Orbit paths */}
        {[52, 74, 96].map((size, i) => (
          <div
            key={size}
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--color-border-hover)]"
            style={{ width: `${size}%`, height: `${size}%`, opacity: 0.8 - i * 0.18 }}
          />
        ))}

        {/* The planet */}
        <div className="absolute left-1/2 top-1/2 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2">
          <Globe className="size-full" />
        </div>

        {/* One satellite per stat, each on its own slow orbit. */}
        {stats.map((stat, i) => {
          const radius = 26 + (i % 3) * 11;
          const duration = 26 + i * 7;
          return (
            <div
              key={stat.label}
              className="absolute inset-0 animate-spin-slow"
              style={{ animationDuration: `${duration}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}
            >
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={polar(i * (360 / stats.length), radius)}>
                {/* Counter-spin keeps the label readable while it travels. */}
                <div
                  className="animate-spin-slow rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/90 px-3 py-2 text-center shadow-[var(--shadow-card)] backdrop-blur"
                  style={{ animationDuration: `${duration}s`, animationDirection: i % 2 ? 'normal' : 'reverse' }}
                >
                  <p className="text-lg font-semibold text-[var(--color-accent)]">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="whitespace-nowrap text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ContactGlobe({ profile, socialLinks }: SectionProps) {
  const email = profile?.email || 'hello@example.com';
  return (
    <section id="contact" className="relative overflow-hidden">
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-faint)]">Anywhere</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
              Working across time zones.
            </h2>
            <p className="mt-4 max-w-md text-[var(--color-text-muted)]">
              {profile?.heroCurrently || 'Available for remote collaboration worldwide.'}
            </p>

            <a
              href={`mailto:${email}`}
              className="group mt-8 inline-flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-3.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]"
            >
              <Mail className="size-4 text-[var(--color-accent)]" />
              {email}
              <ArrowUpRight className="size-4 text-[var(--color-text-faint)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                  >
                    {link.label || link.platform}
                  </a>
                ))}
              </div>
            )}
          </Reveal>

          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <Globe className="size-full" />
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
              <span className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/85 px-4 py-1.5 text-xs text-[var(--color-text-muted)] backdrop-blur">
                <Avatar profile={profile} className="size-5 rounded-full" />
                {profile?.location || 'Remote'}
              </span>
            </div>
          </div>
        </div>
      </Section>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const NATURE_HERO: SectionVariant[] = [
  { id: 'spiderweb', name: 'Spider web ✺', description: 'Name at the centre of a silk web with dew beads and a spider on a dropline.', Component: HeroSpiderweb },
  { id: 'globe-horizon', name: 'Globe horizon ✺', description: 'Headline over a spinning WebGL globe rising like a planet horizon.', Component: HeroGlobe },
];

export const NATURE_ABOUT: SectionVariant[] = [
  { id: 'bloom', name: 'Bloom ✺', description: 'Focus areas become petals of a flower that blooms open and sways.', Component: AboutBloom },
];

export const NATURE_SKILLS: SectionVariant[] = [
  { id: 'web', name: 'Spider web ✺', description: 'Each category is a ring of the web; every tool is a node on the silk.', Component: SkillsWeb },
  { id: 'bloom', name: 'Bloom ✺', description: 'Categories as flower petals beside the full, grouped tool list.', Component: SkillsBloom },
];

export const NATURE_EXPERIENCE: SectionVariant[] = [
  { id: 'tree', name: 'Career tree ✺', description: 'Bark trunk that grows as you scroll, roles branching off left and right.', Component: ExperienceTree },
];

export const NATURE_EDUCATION: SectionVariant[] = [
  { id: 'rings', name: 'Growth rings ✺', description: 'A trunk cross-section — one annual ring per qualification, oldest at the core.', Component: EducationRings },
];

export const NATURE_GALLERY: SectionVariant[] = [
  { id: 'bloom', name: 'Petals ✺', description: 'Project images cut as petals radiating from a pollen core.', Component: GalleryBloom },
];

export const NATURE_STATS: SectionVariant[] = [
  { id: 'orbit-globe', name: 'Orbit ✺', description: 'Figures ride dashed orbits around a spinning globe, counter-rotated to stay readable.', Component: StatsOrbit },
];

export const NATURE_CONTACT: SectionVariant[] = [
  { id: 'web', name: 'Spider web ✺', description: 'Your address at the centre of the web, socials strung along the silk as beads.', Component: ContactWeb },
  { id: 'globe', name: 'Globe ✺', description: 'Split layout with a live globe and your location pinned beneath it.', Component: ContactGlobe },
];
