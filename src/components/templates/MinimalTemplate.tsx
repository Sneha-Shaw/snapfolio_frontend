import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { formatDateRange } from '@/utils/format';
import { TECH_CATEGORIES } from '@/types/models';
import type { TemplateProps } from './types';

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Data',
  'ai-data': 'AI / ML',
  devops: 'DevOps',
  language: 'Languages',
  tooling: 'Tooling',
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="grid gap-6 border-t border-[var(--color-border)] py-14 md:grid-cols-[180px_1fr] md:gap-10"
    >
      <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)]">{label}</h2>
      <div>{children}</div>
    </motion.section>
  );
}

/** Editorial single column — big type, list-style work, lots of whitespace. */
export function MinimalTemplate({ profile, technologies, projects, experiences, education, socialLinks }: TemplateProps) {
  const lines = profile?.heroStatement ? profile.heroStatement.split('\n').filter(Boolean) : ['Building thoughtful software, end to end.'];
  const work = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 6);
  const sortedExp = [...experiences].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));
  const sortedEdu = [...education].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));
  const stack = TECH_CATEGORIES.map((cat) => ({ cat, items: technologies.filter((t) => t.category === cat) })).filter(
    (g) => g.items.length > 0
  );

  return (
    <div className="mx-auto max-w-4xl px-6">
      <header className="pb-20 pt-24 sm:pt-32">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-muted)]"
        >
          <span className="font-medium text-[var(--color-text)]">{profile?.name || 'Your Name'}</span>
          {profile?.headline && <span>— {profile.headline}</span>}
        </motion.p>

        <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-tight text-[var(--color-text)] sm:text-6xl">
          {lines.map((line, i) => (
            <motion.span
              key={`${line}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 * i }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        {profile?.bio && (
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">{profile.bio}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          {profile?.availability && (
            <span className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
              <span className="size-2 rounded-full bg-[var(--color-accent)]" />
              {profile.availability}
            </span>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="text-[var(--color-text)] underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)]">
              {profile.email}
            </a>
          )}
          {profile?.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              Résumé ↗
            </a>
          )}
          {socialLinks.map((link) => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="capitalize text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              {link.label || link.platform} ↗
            </a>
          ))}
        </div>
      </header>

      {profile?.aboutText && (
        <Row label="About">
          <p className="text-balance text-xl leading-relaxed text-[var(--color-text)]">{profile.aboutText}</p>
          {profile.focusAreas.length > 0 && (
            <p className="mt-6 text-sm text-[var(--color-text-muted)]">
              Focused on {profile.focusAreas.join(' · ')}
            </p>
          )}
        </Row>
      )}

      {work.length > 0 && (
        <Row label="Selected work">
          <ul className="-mt-4">
            {work.map((project) => (
              <li key={project._id} className="border-b border-[var(--color-border)] last:border-0">
                <Link to={`/work/${project.slug}`} className="group flex items-baseline gap-4 py-5">
                  <span className="w-12 shrink-0 font-mono text-xs text-[var(--color-text-faint)]">{project.year || ''}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                      {project.title}
                    </span>
                    {project.shortDescription && (
                      <span className="mt-1 block text-sm text-[var(--color-text-muted)]">{project.shortDescription}</span>
                    )}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-[var(--color-text-faint)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/work" className="mt-6 inline-block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            All projects →
          </Link>
        </Row>
      )}

      {sortedExp.length > 0 && (
        <Row label="Experience">
          <div className="space-y-10">
            {sortedExp.map((exp) => (
              <div key={exp._id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-medium text-[var(--color-text)]">
                    {exp.position} <span className="text-[var(--color-text-muted)]">at</span>{' '}
                    <span className="text-[var(--color-accent)]">{exp.company}</span>
                  </h3>
                  <span className="font-mono text-xs text-[var(--color-text-faint)]">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {exp.description && <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">{exp.description}</p>}
                {exp.technologies.length > 0 && (
                  <p className="mt-3 font-mono text-xs text-[var(--color-text-faint)]">
                    {exp.technologies.map((t) => t.name).join(' / ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Row>
      )}

      {sortedEdu.length > 0 && (
        <Row label="Education">
          <div className="space-y-6">
            {sortedEdu.map((edu) => (
              <div key={edu._id} className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">{edu.institution}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {[edu.degree, edu.field].filter(Boolean).join(', ')}
                  </p>
                </div>
                <span className="font-mono text-xs text-[var(--color-text-faint)]">
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </span>
              </div>
            ))}
          </div>
        </Row>
      )}

      {stack.length > 0 && (
        <Row label="Toolbox">
          <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {stack.map(({ cat, items }) => (
              <div key={cat}>
                <dt className="text-xs text-[var(--color-text-faint)]">{CATEGORY_LABELS[cat] ?? cat}</dt>
                <dd className="mt-1 text-[var(--color-text)]">{items.map((t) => t.name).join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Row>
      )}
    </div>
  );
}
