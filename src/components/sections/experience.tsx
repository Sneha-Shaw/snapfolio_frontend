import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, CheckCircle2, ChevronDown } from 'lucide-react';
import { ExperienceSection } from '@/components/home/ExperienceSection';
import { TechBadge } from '@/components/tech/TechBadge';
import { formatDateRange, formatMonthYear } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Experience } from '@/types/models';
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

function range(exp: Experience) {
  return formatDateRange(exp.startDate, exp.endDate, exp.current);
}

function Responsibilities({ exp, limit }: { exp: Experience; limit?: number }) {
  if (exp.responsibilities.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2">
      {exp.responsibilities.slice(0, limit).map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[var(--color-accent)]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Techs({ exp }: { exp: Experience }) {
  if (exp.technologies.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-1.5">
      {exp.technologies.map((t) => (
        <TechBadge key={t._id} technology={t} className="px-2 py-1 text-[11px]" />
      ))}
    </div>
  );
}

function CurrentPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-accent)]">
      <span className="size-1.5 rounded-full bg-[var(--color-accent)]" /> Current
    </span>
  );
}

function ExpTimeline({ experiences }: SectionProps) {
  return <ExperienceSection experience={experiences} />;
}

function ExpMinimal({ experiences }: SectionProps) {
  if (experiences.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-6">
      <Reveal className="grid gap-6 border-t border-[var(--color-border)] py-14 md:grid-cols-[180px_1fr] md:gap-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Experience</h2>
        <div className="space-y-10">
          {newestFirst(experiences).map((exp) => (
            <div key={exp._id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium text-[var(--color-text)]">
                  {exp.position} <span className="text-[var(--color-text-muted)]">at</span> <span className="text-[var(--color-accent)]">{exp.company}</span>
                </h3>
                <span className="font-mono text-xs text-[var(--color-text-faint)]">{range(exp)}</span>
              </div>
              {exp.description && <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">{exp.description}</p>}
              {exp.technologies.length > 0 && (
                <p className="mt-3 font-mono text-xs text-[var(--color-text-faint)]">{exp.technologies.map((t) => t.name).join(' / ')}</p>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ExpCards({ experiences }: SectionProps) {
  if (experiences.length === 0) return null;
  return (
    <Section wide>
      <Heading eyebrow="Where I've worked" title="Experience" />
      <div className="grid gap-4 md:grid-cols-2">
        {newestFirst(experiences).map((exp, i) => (
          <Reveal key={exp._id} delay={(i % 2) * 0.08} className={`${cardClass} p-6`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-lg font-bold text-[var(--color-accent)]">
                {exp.company.charAt(0)}
              </div>
              {exp.current && <CurrentPill />}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-[var(--color-text)]">{exp.position}</h3>
            <p className="text-sm text-[var(--color-accent)]">{exp.company}</p>
            <p className="mt-1 font-mono text-xs text-[var(--color-text-faint)]">{range(exp)}</p>
            {exp.description && <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{exp.description}</p>}
            <Techs exp={exp} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ExpTabs({ experiences }: SectionProps) {
  const sorted = newestFirst(experiences);
  const [active, setActive] = useState(0);
  const exp = sorted[active];
  if (!exp) return null;
  return (
    <Section>
      <Heading eyebrow="Career" title="Where I've worked" />
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <div className="custom-scrollbar flex overflow-x-auto border-b border-[var(--color-border)] md:flex-col md:overflow-visible md:border-b-0 md:border-l">
          {sorted.map((e, i) => (
            <button
              key={e._id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative shrink-0 px-4 py-3 text-left text-sm transition-colors md:-ml-px md:border-l-2',
                i === active
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)]'
              )}
            >
              {e.company}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={exp._id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
            <h3 className="text-xl font-semibold text-[var(--color-text)]">
              {exp.position} <span className="text-[var(--color-accent)]">@ {exp.company}</span>
            </h3>
            <p className="mt-1 font-mono text-xs text-[var(--color-text-faint)]">
              {range(exp)}
              {exp.location && ` · ${exp.location}`}
            </p>
            {exp.description && <p className="mt-5 leading-relaxed text-[var(--color-text-muted)]">{exp.description}</p>}
            <Responsibilities exp={exp} />
            <Techs exp={exp} />
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}

function ExpAccordion({ experiences }: SectionProps) {
  const sorted = newestFirst(experiences);
  const [open, setOpen] = useState<string | null>(sorted[0]?._id ?? null);
  if (sorted.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Experience" title="Roles & responsibilities" />
      <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {sorted.map((exp) => {
          const isOpen = open === exp._id;
          return (
            <div key={exp._id}>
              <button type="button" onClick={() => setOpen(isOpen ? null : exp._id)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span>
                  <span className="block font-semibold text-[var(--color-text)]">{exp.position}</span>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {exp.company} · <span className="font-mono text-xs">{range(exp)}</span>
                  </span>
                </span>
                <ChevronDown className={cn('size-5 shrink-0 text-[var(--color-text-faint)] transition-transform', isOpen && 'rotate-180 text-[var(--color-accent)]')} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pb-6">
                      {exp.description && <p className="text-[var(--color-text-muted)]">{exp.description}</p>}
                      <Responsibilities exp={exp} />
                      <Techs exp={exp} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ExpZigzag({ experiences }: SectionProps) {
  if (experiences.length === 0) return null;
  return (
    <Section wide>
      <Heading eyebrow="Journey" title="Experience" align="center" />
      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-border)] to-transparent md:left-1/2" />
        <div className="space-y-12">
          {newestFirst(experiences).map((exp, i) => (
            <Reveal key={exp._id} className={cn('relative pl-12 md:w-1/2 md:pl-0', i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12')}>
              <span
                className={cn(
                  'absolute left-4 top-6 size-3 -translate-x-1/2 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)]',
                  i % 2 === 0 ? 'md:left-auto md:right-0 md:translate-x-1/2' : 'md:left-0'
                )}
              />
              <div className={`${cardClass} p-6`}>
                <p className="font-mono text-xs text-[var(--color-accent)]">{range(exp)}</p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--color-text)]">{exp.position}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{exp.company}</p>
                {exp.description && <p className="mt-3 text-sm text-[var(--color-text-muted)]">{exp.description}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ExpTable({ experiences }: SectionProps) {
  if (experiences.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Experience" title="Work history" />
      <Reveal className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-text-faint)]">
              <th className="py-3 font-medium">Period</th>
              <th className="py-3 font-medium">Role</th>
              <th className="py-3 font-medium">Company</th>
              <th className="py-3 font-medium">Location</th>
            </tr>
          </thead>
          <tbody>
            {newestFirst(experiences).map((exp) => (
              <tr key={exp._id} className="border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-elevated)]">
                <td className="py-4 pr-4 font-mono text-xs text-[var(--color-text-faint)]">{range(exp)}</td>
                <td className="py-4 pr-4 font-medium text-[var(--color-text)]">{exp.position}</td>
                <td className="py-4 pr-4 text-[var(--color-accent)]">{exp.company}</td>
                <td className="py-4 text-[var(--color-text-muted)]">{exp.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Section>
  );
}

function ExpStepper({ experiences }: SectionProps) {
  if (experiences.length === 0) return null;
  return (
    <Section wide>
      <Heading eyebrow="Experience" title="Career path" />
      <div className="custom-scrollbar overflow-x-auto pb-4">
        <div className="relative flex min-w-max gap-6">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-[var(--color-border)]" />
          {oldestFirst(experiences).map((exp, i) => (
            <Reveal key={exp._id} delay={i * 0.08} className="relative w-64">
              <div className="relative z-10 flex size-10 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-accent)]">
                <Briefcase className="size-4" />
              </div>
              <p className="mt-4 font-mono text-xs text-[var(--color-text-faint)]">{formatMonthYear(exp.startDate)}</p>
              <h3 className="mt-1 font-semibold text-[var(--color-text)]">{exp.position}</h3>
              <p className="text-sm text-[var(--color-accent)]">{exp.company}</p>
              {exp.description && <p className="mt-2 line-clamp-3 text-sm text-[var(--color-text-muted)]">{exp.description}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ExpMetro({ experiences }: SectionProps) {
  if (experiences.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">experience</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 [&_.metro-tile]:min-h-44">
        {newestFirst(experiences).map((exp, i) => (
          <MetroTile key={exp._id} color={metroColor(i + 1)} index={i} className={cn(i === 0 && 'lg:col-span-2')}>
            <div className="flex items-start justify-between">
              <Briefcase className="size-6" />
              <span className="text-xs opacity-80">{range(exp)}</span>
            </div>
            <div>
              <p className="text-xl font-semibold">{exp.position}</p>
              <p className="text-sm opacity-85">{exp.company}</p>
            </div>
          </MetroTile>
        ))}
      </div>
    </section>
  );
}

function ExpTerminal({ profile, experiences }: SectionProps) {
  if (experiences.length === 0) return null;
  return (
    <TerminalSection profile={profile} cmd="cat experience.log">
      <ul className="space-y-4">
        {newestFirst(experiences).map((exp) => (
          <li key={exp._id}>
            <p>
              <span className="text-[var(--color-text-faint)]">[{formatMonthYear(exp.startDate)}]</span>{' '}
              <span className="text-[var(--color-text)]">{exp.position}</span> <span className="text-[var(--color-accent)]">@{exp.company}</span>
              {exp.current && <span className="ml-2 text-xs text-[var(--color-accent-strong)]">● running</span>}
            </p>
            {exp.description && <p className="mt-1 text-xs sm:text-sm">{exp.description}</p>}
            {exp.responsibilities.slice(0, 3).map((r) => (
              <p key={r} className="text-xs sm:text-sm">
                <span className="text-[var(--color-text-faint)]">  └─ </span>
                {r}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </TerminalSection>
  );
}

export const EXPERIENCE_VARIANTS: SectionVariant[] = [
  { id: 'timeline', name: 'Timeline', description: 'Vertical rail with detailed cards.', Component: ExpTimeline },
  { id: 'tabs', name: 'Company tabs', description: 'Pick a company, see the details — compact.', Component: ExpTabs },
  { id: 'zigzag', name: 'Zig-zag timeline', description: 'Cards alternate left and right of a center line.', Component: ExpZigzag },
  { id: 'accordion', name: 'Accordion', description: 'Expandable rows, first one open.', Component: ExpAccordion },
  { id: 'cards', name: 'Card grid', description: 'Two-column cards with company monograms.', Component: ExpCards },
  { id: 'stepper', name: 'Horizontal path', description: 'Scrollable left-to-right career steps.', Component: ExpStepper },
  { id: 'table', name: 'Table', description: 'Clean résumé-style table.', Component: ExpTable },
  { id: 'metro', name: 'Metro tiles', description: 'A colored tile per role.', Component: ExpMetro },
  { id: 'minimal', name: 'Minimal', description: 'Label left, plain text entries right.', Component: ExpMinimal },
  { id: 'terminal', name: 'Terminal', description: '`cat experience.log`.', Component: ExpTerminal },
];
