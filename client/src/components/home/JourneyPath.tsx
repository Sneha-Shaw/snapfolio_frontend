import { GraduationCap, Briefcase } from 'lucide-react';
import { DraggableCardContainer, DraggableCardBody } from '@/components/aceternity/DraggableCard';
import { GridGlow } from '@/components/aceternity/GridGlow';
import { formatDateRange } from '@/utils/format';
import type { Experience, Education } from '@/types/models';

interface JourneyItem {
  id: string;
  kind: 'education' | 'experience';
  title: string;
  org: string;
  dateLabel: string;
  description: string;
  start: string;
}

interface JourneyPathProps {
  experience: Experience[];
  education: Education[];
}

const ROTATIONS = [-4, 3, -2, 4, -3, 2, -4, 3];

export function JourneyPath({ experience, education }: JourneyPathProps) {
  const items: JourneyItem[] = [
    ...education.map((edu) => ({
      id: `edu-${edu._id}`,
      kind: 'education' as const,
      title: edu.degree,
      org: edu.institution,
      dateLabel: formatDateRange(edu.startDate, edu.endDate, false),
      description: edu.field || edu.description,
      start: edu.startDate,
    })),
    ...experience.map((exp) => ({
      id: `exp-${exp._id}`,
      kind: 'experience' as const,
      title: exp.position,
      org: exp.company,
      dateLabel: formatDateRange(exp.startDate, exp.endDate, exp.current),
      description: exp.description,
      start: exp.startDate,
    })),
  ].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 py-24">
      <GridGlow className="opacity-40" />

      <div className="relative mx-auto max-w-6xl px-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
          The path so far
        </p>
        <h2 className="mb-3 text-3xl font-semibold text-[var(--color-text)]">College to corporate</h2>
        <p className="mb-12 max-w-xl text-[var(--color-text-muted)]">
          A rough timeline of how I got here — drag a card around if you'd like.
        </p>

        <DraggableCardContainer className="custom-scrollbar overflow-x-auto pb-6">
          <div className="relative flex min-w-max items-start gap-8 px-4 pt-6">
            <div className="pointer-events-none absolute left-0 right-0 top-[88px] h-px bg-[var(--color-border)]" />

            {items.map((item, i) => {
              const Icon = item.kind === 'education' ? GraduationCap : Briefcase;
              return (
                <div key={item.id} className="flex w-64 shrink-0 flex-col items-center">
                  <span className="mb-1 font-mono text-xs text-[var(--color-text-faint)]">{item.dateLabel}</span>
                  <span className="relative z-10 mb-5 flex size-3 items-center justify-center rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)]" />

                  <DraggableCardBody rotate={ROTATIONS[i % ROTATIONS.length]} className="w-64 bg-[var(--color-bg-elevated)] p-5">
                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <Icon className="size-4" />
                    </div>
                    <p className="font-semibold text-[var(--color-text)]">{item.title}</p>
                    <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{item.org}</p>
                    {item.description && (
                      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[var(--color-text-faint)]">
                        {item.description}
                      </p>
                    )}
                  </DraggableCardBody>
                </div>
              );
            })}
          </div>
        </DraggableCardContainer>
      </div>
    </section>
  );
}
