import { Award, GraduationCap } from 'lucide-react';
import { JourneyPath } from '@/components/home/JourneyPath';
import { formatDateRange, formatMonthYear } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Education } from '@/types/models';
import {
  Heading,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  cardClass,
  metroColor,
  newestFirst,
  oldestFirst,
  type SectionProps,
  type SectionVariant,
} from './shared';

function range(edu: Education) {
  return formatDateRange(edu.startDate, edu.endDate, false);
}

function degree(edu: Education) {
  return [edu.degree, edu.field].filter(Boolean).join(', ');
}

function EduJourney({ experiences, education }: SectionProps) {
  return <JourneyPath experience={experiences} education={education} />;
}

function EduTimeline({ education }: SectionProps) {
  if (education.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Education" title="Where I studied" />
      <ol className="relative space-y-10 border-l border-[var(--color-border)] pl-8">
        {newestFirst(education).map((edu, i) => (
          <Reveal key={edu._id} delay={i * 0.06} className="relative">
            <span className="absolute -left-[45px] flex size-7 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-accent)]">
              <GraduationCap className="size-3.5" />
            </span>
            <p className="font-mono text-xs text-[var(--color-text-faint)]">{range(edu)}</p>
            <h3 className="mt-1 text-lg font-semibold text-[var(--color-text)]">{edu.institution}</h3>
            <p className="text-sm text-[var(--color-accent)]">{degree(edu)}</p>
            {edu.description && <p className="mt-2 text-sm text-[var(--color-text-muted)]">{edu.description}</p>}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function EduCards({ education }: SectionProps) {
  if (education.length === 0) return null;
  return (
    <Section wide>
      <Heading eyebrow="Education" title="Academic background" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {newestFirst(education).map((edu, i) => (
          <Reveal key={edu._id} delay={i * 0.06} className={`${cardClass} p-6`}>
            <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <GraduationCap className="size-5" />
            </div>
            <h3 className="font-semibold text-[var(--color-text)]">{edu.degree || edu.institution}</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{edu.field}</p>
            <p className="mt-4 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-text)]">{edu.institution}</p>
            <p className="font-mono text-xs text-[var(--color-text-faint)]">{range(edu)}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function EduCertificate({ education }: SectionProps) {
  if (education.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Credentials" title="Education" align="center" />
      <div className={cn('grid gap-6', education.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-md')}>
        {newestFirst(education).map((edu, i) => (
          <Reveal key={edu._id} delay={i * 0.08} className="relative border-4 border-double border-[var(--color-accent)] bg-[var(--color-bg-elevated)] p-8 text-center">
            <Award className="mx-auto size-10 text-[var(--color-accent)]" />
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-faint)]">This certifies</p>
            <h3 className="mt-2 font-serif text-2xl italic text-[var(--color-text)]">{edu.degree || 'Graduate'}</h3>
            {edu.field && <p className="mt-1 text-sm text-[var(--color-text-muted)]">in {edu.field}</p>}
            <div className="mx-auto my-5 h-px w-24 bg-[var(--color-border-hover)]" />
            <p className="font-semibold text-[var(--color-text)]">{edu.institution}</p>
            <p className="mt-1 font-mono text-xs text-[var(--color-text-faint)]">{range(edu)}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function EduMinimal({ education }: SectionProps) {
  if (education.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-6">
      <Reveal className="grid gap-6 border-t border-[var(--color-border)] py-14 md:grid-cols-[180px_1fr] md:gap-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Education</h2>
        <div className="space-y-6">
          {newestFirst(education).map((edu) => (
            <div key={edu._id} className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="font-medium text-[var(--color-text)]">{edu.institution}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{degree(edu)}</p>
              </div>
              <span className="font-mono text-xs text-[var(--color-text-faint)]">{range(edu)}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function EduCompact({ education }: SectionProps) {
  if (education.length === 0) return null;
  return (
    <Section className="py-12">
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 sm:w-40">
          <GraduationCap className="size-5 text-[var(--color-accent)]" />
          <span className="text-sm font-semibold text-[var(--color-text)]">Education</span>
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          {newestFirst(education).map((edu) => (
            <span key={edu._id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">{edu.degree || edu.institution}</span>
              <span className="text-[var(--color-text-faint)]"> · {edu.institution} · {new Date(edu.endDate || edu.startDate).getFullYear()}</span>
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

function EduHorizontal({ education }: SectionProps) {
  if (education.length === 0) return null;
  const list = oldestFirst(education);
  return (
    <Section wide>
      <Heading eyebrow="Education" title="Learning path" />
      <div className={cn('grid gap-6', list.length > 1 && 'md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]')}>
        {list.map((edu, i) => (
          <Reveal key={edu._id} delay={i * 0.1} className="relative">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-[var(--color-on-accent)]">{i + 1}</span>
              <span className="h-px flex-1 bg-[var(--color-border-hover)]" />
            </div>
            <p className="font-mono text-xs text-[var(--color-text-faint)]">{formatMonthYear(edu.startDate)}</p>
            <h3 className="mt-1 font-semibold text-[var(--color-text)]">{edu.degree}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">{edu.institution}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function EduSpotlight({ education }: SectionProps) {
  const [latest, ...rest] = newestFirst(education);
  if (!latest) return null;
  return (
    <Section className="text-center">
      <Reveal>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">Education</p>
        <GraduationCap className="mx-auto size-12 text-[var(--color-accent)]" />
        <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">{latest.degree}</h2>
        {latest.field && <p className="mt-2 text-xl text-[var(--color-accent)]">{latest.field}</p>}
        <p className="mt-4 text-[var(--color-text-muted)]">
          {latest.institution} · {range(latest)}
        </p>
      </Reveal>
      {rest.length > 0 && (
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {rest.map((edu) => (
            <span key={edu._id} className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-muted)]">
              {edu.degree || edu.institution} — {edu.institution}
            </span>
          ))}
        </div>
      )}
    </Section>
  );
}

function EduMetro({ education }: SectionProps) {
  if (education.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">education</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 [&_.metro-tile]:min-h-40">
        {newestFirst(education).map((edu, i) => (
          <MetroTile key={edu._id} color={metroColor(i + 4)} index={i}>
            <GraduationCap className="size-6" />
            <div>
              <p className="text-lg font-semibold">{edu.degree || edu.institution}</p>
              <p className="text-sm opacity-85">{edu.institution}</p>
              <p className="text-xs opacity-70">{range(edu)}</p>
            </div>
          </MetroTile>
        ))}
      </div>
    </section>
  );
}

function EduTerminal({ profile, education }: SectionProps) {
  if (education.length === 0) return null;
  return (
    <TerminalSection profile={profile} cmd="cat education.txt">
      <ul className="space-y-2">
        {newestFirst(education).map((edu) => (
          <li key={edu._id}>
            <span className="text-[var(--color-text)]">{edu.institution}</span>
            <span className="text-[var(--color-text-faint)]"> — </span>
            {degree(edu)}
            <span className="block text-xs text-[var(--color-text-faint)]">{range(edu)}</span>
          </li>
        ))}
      </ul>
    </TerminalSection>
  );
}

export const EDUCATION_VARIANTS: SectionVariant[] = [
  { id: 'journey', name: 'Journey path', description: 'Draggable cards mixing education and jobs in one timeline.', Component: EduJourney },
  { id: 'timeline', name: 'Timeline', description: 'Vertical rail with cap icons.', Component: EduTimeline },
  { id: 'cards', name: 'Cards', description: 'A card per degree.', Component: EduCards },
  { id: 'certificate', name: 'Certificate', description: 'Double-bordered diploma-style cards.', Component: EduCertificate },
  { id: 'spotlight', name: 'Spotlight', description: 'Highest degree centered and large.', Component: EduSpotlight },
  { id: 'horizontal', name: 'Numbered steps', description: 'Left-to-right numbered learning path.', Component: EduHorizontal },
  { id: 'compact', name: 'Compact strip', description: 'One slim row of chips — takes little space.', Component: EduCompact },
  { id: 'metro', name: 'Metro tiles', description: 'A colored tile per degree.', Component: EduMetro },
  { id: 'minimal', name: 'Minimal', description: 'Label left, plain entries right.', Component: EduMinimal },
  { id: 'terminal', name: 'Terminal', description: '`cat education.txt`.', Component: EduTerminal },
];
