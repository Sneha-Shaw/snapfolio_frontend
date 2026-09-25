import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDateRange, formatMonthYear } from '@/utils/format';
import type { TemplateProps } from './types';

function Command({ host, cmd, index, children }: { host: string; cmd: string; index: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: Math.min(index, 3) * 0.15 }}
      className="space-y-3"
    >
      <p className="break-all">
        <span className="text-[var(--color-accent)]">guest@{host}</span>
        <span className="text-[var(--color-text-faint)]">:</span>
        <span className="text-[var(--color-accent-strong)]">~</span>
        <span className="text-[var(--color-text-faint)]">$ </span>
        <span className="text-[var(--color-text)]">{cmd}</span>
      </p>
      <div className="border-l border-[var(--color-border)] pl-4 text-[var(--color-text-muted)]">{children}</div>
    </motion.div>
  );
}

/** A developer shell — commands, output and a blinking cursor. */
export function TerminalTemplate({ profile, technologies, projects, experiences, education, socialLinks }: TemplateProps) {
  const host = (profile?.name || 'portfolio').split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'portfolio';
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 6);
  const sortedExp = [...experiences].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));
  const sortedEdu = [...education].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));
  const statement = profile?.heroStatement ? profile.heroStatement.split('\n').filter(Boolean).join(' ') : '';
  let i = 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 font-mono text-sm sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="elevated-card overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate text-xs text-[var(--color-text-faint)]">
            guest@{host}: ~ — zsh
          </span>
        </div>

        <div className="space-y-8 p-5 leading-relaxed sm:p-8">
          <p className="text-xs text-[var(--color-text-faint)]">
            Last login: {new Date().toDateString()} on ttys001
          </p>

          <Command host={host} cmd="whoami" index={i++}>
            <p className="text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">{profile?.name || 'guest'}</p>
            {profile?.headline && <p className="mt-1 text-[var(--color-accent)]">{profile.headline}</p>}
            {statement && <p className="mt-3 text-[var(--color-text)]">{statement}</p>}
            <p className="mt-3 text-xs">
              {[profile?.location, profile?.heroTimezone, profile?.availability].filter(Boolean).join('  ·  ')}
            </p>
          </Command>

          {profile?.aboutText && (
            <Command host={host} cmd="cat about.md" index={i++}>
              <p className="whitespace-pre-line">{profile.aboutText}</p>
              {profile.focusAreas.length > 0 && (
                <p className="mt-3">
                  <span className="text-[var(--color-text-faint)]">focus: </span>
                  [{profile.focusAreas.map((f) => `"${f}"`).join(', ')}]
                </p>
              )}
            </Command>
          )}

          {featured.length > 0 && (
            <Command host={host} cmd="ls -l ./projects" index={i++}>
              <p className="text-[var(--color-text-faint)]">total {featured.length}</p>
              <ul className="mt-1 space-y-2">
                {featured.map((p) => (
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
            </Command>
          )}

          {sortedExp.length > 0 && (
            <Command host={host} cmd="cat experience.log" index={i++}>
              <ul className="space-y-4">
                {sortedExp.map((exp) => (
                  <li key={exp._id}>
                    <p>
                      <span className="text-[var(--color-text-faint)]">[{formatMonthYear(exp.startDate)}]</span>{' '}
                      <span className="text-[var(--color-text)]">{exp.position}</span>{' '}
                      <span className="text-[var(--color-accent)]">@{exp.company}</span>
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
            </Command>
          )}

          {technologies.length > 0 && (
            <Command host={host} cmd="ls ~/stack" index={i++}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
                {technologies.map((t) => (
                  <span key={t._id} className="truncate text-[var(--color-text)]">
                    {t.slug || t.name}
                  </span>
                ))}
              </div>
            </Command>
          )}

          {sortedEdu.length > 0 && (
            <Command host={host} cmd="cat education.txt" index={i++}>
              <ul className="space-y-2">
                {sortedEdu.map((edu) => (
                  <li key={edu._id}>
                    <span className="text-[var(--color-text)]">{edu.institution}</span>
                    <span className="text-[var(--color-text-faint)]"> — </span>
                    {[edu.degree, edu.field].filter(Boolean).join(', ')}
                    <span className="block text-xs text-[var(--color-text-faint)]">
                      {formatDateRange(edu.startDate, edu.endDate, false)}
                    </span>
                  </li>
                ))}
              </ul>
            </Command>
          )}

          <Command host={host} cmd="contact --list" index={i++}>
            <ul className="space-y-1">
              {profile?.email && (
                <li>
                  <span className="inline-block w-24 text-[var(--color-text-faint)]">email</span>
                  <a href={`mailto:${profile.email}`} className="text-[var(--color-accent)] hover:underline">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile?.resumeUrl && (
                <li>
                  <span className="inline-block w-24 text-[var(--color-text-faint)]">resume</span>
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                    download
                  </a>
                </li>
              )}
              {socialLinks.map((link) => (
                <li key={link._id}>
                  <span className="inline-block w-24 text-[var(--color-text-faint)]">{link.platform}</span>
                  <a href={link.url} target="_blank" rel="noreferrer" className="break-all text-[var(--color-accent)] hover:underline">
                    {link.url.replace(/^(https?:\/\/|mailto:)/, '')}
                  </a>
                </li>
              ))}
            </ul>
          </Command>

          <p>
            <span className="text-[var(--color-accent)]">guest@{host}</span>
            <span className="text-[var(--color-text-faint)]">:</span>
            <span className="text-[var(--color-accent-strong)]">~</span>
            <span className="text-[var(--color-text-faint)]">$ </span>
            <motion.span
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
              className="inline-block h-4 w-2 translate-y-0.5 bg-[var(--color-accent)]"
            />
          </p>
        </div>
      </motion.div>
    </div>
  );
}
