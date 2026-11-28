import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { TechBadge } from '@/components/tech/TechBadge';
import { formatDateRange } from '@/utils/format';
import type { Experience } from '@/types/models';

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  const sorted = [...experience].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
        Where I've worked
      </p>
      <h2 className="mb-12 text-3xl font-semibold text-[var(--color-text)]">Experience</h2>

      <div className="relative space-y-10">
        <div className="pointer-events-none absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-[var(--color-border)] md:block" />

        {sorted.map((exp, i) => (
          <motion.div
            key={exp._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08 }}
            className="relative grid gap-3 md:grid-cols-[180px_1fr] md:gap-8"
          >
            <div className="flex items-start gap-3 md:block md:pt-1">
              <span className="relative z-10 mt-1.5 hidden size-4 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)] md:flex" />
              <div>
                <p className="font-mono text-xs text-[var(--color-text-faint)]">
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </p>
                {exp.current && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-accent)]">
                    <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
                    Current
                  </span>
                )}
              </div>
            </div>

            <div className="elevated-card rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-colors hover:border-[var(--color-border-hover)]">
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{exp.position}</h3>
              <p className="mt-1 text-sm text-[var(--color-accent)]">
                {exp.company}
                {exp.location && <span className="text-[var(--color-text-faint)]"> · {exp.location}</span>}
              </p>

              {exp.description && (
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{exp.description}</p>
              )}

              {exp.responsibilities.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {exp.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[var(--color-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {exp.technologies.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <TechBadge key={tech._id} technology={tech} className="px-2 py-1 text-[11px]" />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
