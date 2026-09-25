import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Briefcase, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import { TechBadge } from '@/components/tech/TechBadge';
import { formatDateRange } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { TemplateProps } from './types';

function Tile({ className, children, index = 0 }: { className?: string; children: ReactNode; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: Math.min(index, 10) * 0.05 }}
      className={cn(
        'elevated-card relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-colors hover:border-[var(--color-border-hover)]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function TileLabel({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
      {icon}
      {children}
    </p>
  );
}

/** Everything on one screen as a grid of tiles. Dense and scannable. */
export function BentoTemplate({ profile, technologies, projects, experiences, education, socialLinks }: TemplateProps) {
  const lines = profile?.heroStatement ? profile.heroStatement.split('\n').filter(Boolean) : ['Building thoughtful software, end to end.'];
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const sortedExp = [...experiences].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate)).slice(0, 4);
  const sortedEdu = [...education].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate)).slice(0, 3);
  const initials = (profile?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  let i = 0;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
      <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Intro */}
        <Tile index={i++} className="flex flex-col justify-between sm:col-span-2 lg:row-span-2">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-60 blur-3xl"
            style={{ background: 'var(--color-accent-soft)' }}
          />
          <div className="relative">
            {profile?.heroEyebrow && (
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">{profile.heroEyebrow}</p>
            )}
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
              {lines.map((line, n) => (
                <span key={`${line}-${n}`} className="block">
                  {line}
                </span>
              ))}
            </h1>
            {profile?.bio && <p className="mt-4 text-[var(--color-text-muted)]">{profile.bio}</p>}
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex h-11 items-center rounded-lg bg-[var(--color-accent)] px-5 text-sm font-medium text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] transition-colors hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]"
            >
              Get in touch
            </a>
            <Link
              to="/work"
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-border-hover)]"
            >
              See work <ArrowRight className="size-4" />
            </Link>
          </div>
        </Tile>

        {/* Photo */}
        <Tile index={i++} className="p-0 lg:row-span-2">
          {profile?.profileImage?.url ? (
            <img
              src={profile.profileImage.url}
              alt={profile.name || 'Profile photo'}
              className="size-full min-h-[280px] object-cover"
            />
          ) : (
            <div className="flex size-full min-h-[280px] items-center justify-center bg-[var(--color-accent-soft)] text-6xl font-semibold text-[var(--color-accent)]">
              {initials}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <p className="font-semibold text-white">{profile?.name}</p>
            {profile?.headline && <p className="text-sm text-white/75">{profile.headline}</p>}
          </div>
        </Tile>

        {/* Status */}
        <Tile index={i++} className="flex flex-col justify-between">
          <TileLabel icon={<span className="size-2 animate-pulse rounded-full bg-[var(--color-accent)]" />}>Status</TileLabel>
          <p className="text-lg font-medium text-[var(--color-text)]">{profile?.availability || 'Open to opportunities'}</p>
          {profile?.heroCurrently && <p className="mt-2 text-sm text-[var(--color-text-muted)]">{profile.heroCurrently}</p>}
        </Tile>

        {/* Location */}
        <Tile index={i++} className="flex flex-col justify-between">
          <TileLabel icon={<MapPin className="size-3.5" />}>Based in</TileLabel>
          <p className="text-lg font-medium text-[var(--color-text)]">{profile?.location || 'Remote'}</p>
          {profile?.heroTimezone && <p className="mt-2 font-mono text-xs text-[var(--color-text-faint)]">{profile.heroTimezone}</p>}
        </Tile>

        {/* Featured projects */}
        {featured.map((project, n) => (
          <Tile key={project._id} index={i++} className={cn('group p-0', n === 0 && 'sm:col-span-2')}>
            <Link to={`/work/${project.slug}`} className="flex h-full flex-col">
              <div className="relative aspect-video overflow-hidden bg-[var(--color-bg-elevated-2)]">
                {project.thumbnail?.url && (
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 items-start justify-between gap-3 p-5">
                <div>
                  <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">{project.title}</h3>
                  {project.shortDescription && (
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">{project.shortDescription}</p>
                  )}
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-[var(--color-text-faint)] group-hover:text-[var(--color-accent)]" />
              </div>
            </Link>
          </Tile>
        ))}

        {/* About */}
        {profile?.aboutText && (
          <Tile index={i++} className="sm:col-span-2">
            <TileLabel icon={<Sparkles className="size-3.5" />}>About</TileLabel>
            <p className="leading-relaxed text-[var(--color-text-muted)]">{profile.aboutText}</p>
            {profile.focusAreas.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.focusAreas.map((area) => (
                  <span key={area} className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                    {area}
                  </span>
                ))}
              </div>
            )}
          </Tile>
        )}

        {/* Experience */}
        {sortedExp.length > 0 && (
          <Tile index={i++} className="sm:col-span-2">
            <TileLabel icon={<Briefcase className="size-3.5" />}>Experience</TileLabel>
            <ul className="space-y-4">
              {sortedExp.map((exp) => (
                <li key={exp._id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{exp.position}</p>
                    <p className="text-sm text-[var(--color-accent)]">{exp.company}</p>
                  </div>
                  <span className="shrink-0 text-right font-mono text-[11px] text-[var(--color-text-faint)]">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </li>
              ))}
            </ul>
          </Tile>
        )}

        {/* Stack */}
        {technologies.length > 0 && (
          <Tile index={i++} className="sm:col-span-2">
            <TileLabel>Stack</TileLabel>
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 24).map((tech) => (
                <TechBadge key={tech._id} technology={tech} className="px-2.5 py-1 text-[11px]" />
              ))}
            </div>
          </Tile>
        )}

        {/* Education */}
        {sortedEdu.length > 0 && (
          <Tile index={i++} className="sm:col-span-2 lg:col-span-1">
            <TileLabel icon={<GraduationCap className="size-3.5" />}>Education</TileLabel>
            <ul className="space-y-3">
              {sortedEdu.map((edu) => (
                <li key={edu._id}>
                  <p className="text-sm font-medium text-[var(--color-text)]">{edu.institution}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>
                </li>
              ))}
            </ul>
          </Tile>
        )}

        {/* Contact */}
        <Tile index={i++} className="flex flex-col justify-between bg-[var(--color-accent)] sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-on-accent)] opacity-70">Say hello</p>
          <div>
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="block break-all text-lg font-semibold text-[var(--color-on-accent)] hover:underline">
                {profile.email}
              </a>
            )}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {socialLinks.map((link) => (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm capitalize text-[var(--color-on-accent)] opacity-80 hover:opacity-100"
                >
                  {link.label || link.platform} ↗
                </a>
              ))}
            </div>
          </div>
        </Tile>
      </div>
    </div>
  );
}
