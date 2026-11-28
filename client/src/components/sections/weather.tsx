import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CloudSun, Compass, Droplets, Gauge, Sunrise, Thermometer, Wind } from 'lucide-react';
import type { SectionVariant } from './shared';
import {
  CountUp,
  Heading,
  PrimaryCTA,
  Reveal,
  SecondaryCTA,
  Section,
  groupTech,
  pickProjects,
  statementLines,
  statsOf,
  yearsOfExperience,
  type SectionProps,
} from './shared';

/**
 * Weather station (✺).
 *
 * The other two weather motifs simulate conditions — Storm drops rain, Cirrus
 * drifts cloud. This one is the instrument panel instead: swept dials with tick
 * rings, a sun path with the sun on it, an hourly strip over a temperature
 * scale, and a hazard-striped advisory. Every readout is driven by real profile
 * data, so nothing on the panel is decorative.
 *
 * Drawing lives in index.css: `.dial`, `.dial-ticks`, `.needle`,
 * `.station-panel`, `.temp-scale`, `.hazard-stripes`, `.isobars`.
 */

/** 0–1 of the way through the day, used to place the sun on its arc. */
function dayFraction(date = new Date()): number {
  const minutes = date.getHours() * 60 + date.getMinutes();
  const sunrise = 6 * 60;
  const sunset = 19 * 60;
  return Math.min(Math.max((minutes - sunrise) / (sunset - sunrise), 0), 1);
}

/** A swept instrument dial. `value`/`max` drive both the arc and the needle. */
function Dial({
  value,
  max,
  suffix = '',
  label,
  Icon,
  size = 132,
}: {
  value: number;
  max: number;
  suffix?: string;
  label: string;
  Icon: typeof Wind;
  size?: number;
}) {
  const fraction = max > 0 ? Math.min(value / max, 1) : 0;
  /* The arc spans 270°, starting at the 135° mark (bottom-left). */
  const needleAngle = -135 + fraction * 270;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="dial-ticks absolute inset-0" aria-hidden />
        <motion.div
          className="dial absolute inset-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          style={{ ['--gauge' as string]: fraction }}
          aria-hidden
        />
        {/* Needle */}
        <motion.div
          className="needle absolute bottom-1/2 left-1/2 w-1.5 origin-bottom"
          style={{ height: size * 0.34 }}
          initial={{ rotate: -135, x: '-50%' }}
          whileInView={{ rotate: needleAngle, x: '-50%' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />
        <span
          className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)]"
          aria-hidden
        />
        {/* Readout sits below the pivot so the needle never crosses it. */}
        <div className="absolute inset-x-0 bottom-3 text-center">
          <p className="tabular text-xl font-semibold leading-none text-[var(--color-text)]">
            <CountUp to={value} suffix={suffix} />
          </p>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
        <Icon className="size-3.5 text-[var(--color-accent)]" />
        {label}
      </p>
    </div>
  );
}

function HeroWeatherStation(props: SectionProps) {
  const { profile, technologies, projects, experiences } = props;
  const lines = statementLines(profile);
  const years = yearsOfExperience(experiences);
  const areas = (profile?.focusAreas ?? []).slice(0, 6);
  const sun = dayFraction();

  /* Sun path: a flat arc across the panel; x tracks the day, y follows the curve. */
  const sunX = 8 + sun * 84;
  const sunY = 78 - Math.sin(sun * Math.PI) * 58;

  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden">
      <div className="isobars pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      {/* A single slow cloud drifting behind the panel. */}
      <div className="cloud-bank animate-drift-x pointer-events-none absolute inset-x-[-10%] top-[12%] h-40 opacity-40" aria-hidden />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                <CloudSun className="size-4 text-[var(--color-accent)]" />
                {profile.heroEyebrow}
              </p>
            </Reveal>
          )}
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.11, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>
          {profile?.bio && (
            <Reveal delay={0.35}>
              <p className="mt-6 max-w-lg text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>
            </Reveal>
          )}
          <Reveal delay={0.45} className="mt-9 flex flex-wrap gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </Reveal>
        </div>

        {/* The station panel */}
        <Reveal delay={0.2}>
          <div className="station-panel rounded-3xl p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-faint)]">Station</p>
                <p className="mt-0.5 text-sm font-medium text-[var(--color-text)]">{profile?.location || 'Remote'}</p>
              </div>
              <p className="text-right text-xs text-[var(--color-text-faint)]">
                {profile?.heroTimezone || 'local'}
                <br />
                <span className="text-[var(--color-accent)]">{profile?.availability ? 'open' : 'observing'}</span>
              </p>
            </div>

            {/* Sun path */}
            <div className="relative mt-5 h-28">
              <svg viewBox="0 0 100 90" className="absolute inset-0 size-full overflow-visible" preserveAspectRatio="none" aria-hidden>
                <path d="M8 78 Q 50 2, 92 78" fill="none" stroke="var(--color-border-hover)" strokeWidth="1" strokeDasharray="3 4" />
                <motion.path
                  d="M8 78 Q 50 2, 92 78"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: sun }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                />
                <line x1="0" y1="78" x2="100" y2="78" stroke="var(--color-border)" strokeWidth="1" />
              </svg>
              <motion.span
                className="sun-disc absolute size-6"
                style={{ left: `${sunX}%`, top: `${sunY}%`, translate: '-50% -50%' }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                aria-hidden
              />
              <span className="absolute bottom-0 left-0 flex items-center gap-1 text-[10px] text-[var(--color-text-faint)]">
                <Sunrise className="size-3" /> 06:00
              </span>
              <span className="absolute bottom-0 right-0 text-[10px] text-[var(--color-text-faint)]">19:00</span>
            </div>

            {/* Two primary instruments */}
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-5">
              <Dial value={years} max={Math.max(years + 4, 12)} suffix="y" label="Experience" Icon={Thermometer} size={116} />
              <Dial value={projects.length} max={Math.max(projects.length + 6, 24)} label="Shipped" Icon={Gauge} size={116} />
            </div>

            {/* Hourly strip — focus areas across a temperature scale. */}
            {areas.length > 0 && (
              <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                <p className="mb-2 text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">Outlook</p>
                <div className="temp-scale h-1 w-full rounded-full opacity-70" aria-hidden />
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {areas.map((area, i) => (
                    <span
                      key={area}
                      className="shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-2.5 py-1.5 text-center text-[10px] font-medium text-[var(--color-text)]"
                    >
                      <span className="block text-[9px] text-[var(--color-text-faint)]">
                        {String((i + 9) % 24).padStart(2, '0')}:00
                      </span>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 text-[10px] text-[var(--color-text-faint)]">
              {technologies.length} instruments online · readings from live profile data
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatsInstruments(props: SectionProps) {
  const stats = statsOf(props).slice(0, 4);
  if (stats.length === 0) return null;

  const icons = [Thermometer, Gauge, Wind, Droplets];

  return (
    <section className="relative overflow-hidden">
      <div className="isobars pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <Section>
        <Heading eyebrow="Readings" title="Current conditions" align="center" />
        <div className="station-panel grid gap-8 rounded-3xl p-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <Dial
                value={stat.value}
                max={Math.max(stat.value + Math.ceil(stat.value * 0.4) + 2, 10)}
                suffix={stat.suffix}
                label={stat.label}
                Icon={icons[i % icons.length] ?? Gauge}
              />
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}

function SkillsForecast({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;

  const peak = Math.max(...groups.map((g) => g.items.length));

  return (
    <Section id="skills">
      <Heading eyebrow="Stack" title="Five-day outlook" align="center" />

      <div className="station-panel overflow-hidden rounded-3xl p-6 sm:p-8">
        {/* Trend line across the categories, like a temperature graph. */}
        <div className="relative mb-6 h-24">
          <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
            <motion.polyline
              points={groups
                .map((g, i) => {
                  const x = (i / Math.max(groups.length - 1, 1)) * 100;
                  const y = 36 - (g.items.length / peak) * 30;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          </svg>
          {groups.map((g, i) => {
            const x = (i / Math.max(groups.length - 1, 1)) * 100;
            const y = (36 - (g.items.length / peak) * 30) / 40 * 100;
            return (
              <motion.span
                key={g.cat}
                className="absolute size-2.5 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg-elevated)]"
                style={{ left: `${x}%`, top: `${y}%`, translate: '-50% -50%' }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                aria-hidden
              />
            );
          })}
        </div>

        {/* One column per category, read as a daily forecast card. */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, gi) => (
            <Reveal key={group.cat} delay={gi * 0.06}>
              <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
                    {group.label}
                  </p>
                  <p className="tabular text-sm font-semibold text-[var(--color-accent)]">{group.items.length}</p>
                </div>
                <div className="temp-scale mt-2 h-0.5 rounded-full" style={{ width: `${(group.items.length / peak) * 100}%` }} aria-hidden />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((tech) => (
                    <span
                      key={tech._id}
                      className="rounded-md border border-[var(--color-border)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
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

function ProjectsStations({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 6);
  if (projectsLoading || items.length === 0) return null;

  return (
    <Section id="projects">
      <Heading eyebrow="Observations" title="Logged reports" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project, i) => (
          <Reveal key={project._id} delay={i * 0.06}>
            <Link to={`/work/${project.slug}`} className="station-panel group flex h-full flex-col rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                  Report {String(i + 1).padStart(3, '0')}
                </p>
                <span className="flex items-center gap-1 font-mono text-[10px] text-[var(--color-text-faint)]">
                  <Compass className="size-3" />
                  {project.year}
                </span>
              </div>
              <h3 className="mt-3 font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                {project.title}
              </h3>
              <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-[var(--color-text-muted)]">{project.shortDescription}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                <span className="temp-scale h-0.5 w-16 rounded-full opacity-70" aria-hidden />
                <ArrowUpRight className="size-4 text-[var(--color-text-faint)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ContactAdvisory({ profile, socialLinks }: SectionProps) {
  const email = profile?.email || 'hello@example.com';
  return (
    <section id="contact" className="relative overflow-hidden">
      <Section>
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)]">
            {/* Hazard band — how a real advisory is headed. */}
            <div className="hazard-stripes h-3" aria-hidden />
            <div className="station-panel p-7 sm:p-10">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
                <CloudSun className="size-4" />
                Availability advisory
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
                {profile?.availability || 'Open for new work'}
              </h2>
              <p className="mt-3 max-w-xl text-[var(--color-text-muted)]">
                {profile?.heroCurrently || 'Conditions favourable for new collaborations.'}
                {profile?.location ? ` Issued for ${profile.location}.` : ''}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-sm font-medium text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] transition-colors hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]"
                >
                  {email}
                  <ArrowUpRight className="size-4" />
                </a>
                {socialLinks.slice(0, 5).map((l) => (
                  <a
                    key={l._id}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center rounded-xl border border-[var(--color-border)] px-4 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                  >
                    {l.label || l.platform}
                  </a>
                ))}
              </div>
            </div>
            <div className="hazard-stripes h-3" aria-hidden />
          </div>
        </Reveal>
      </Section>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const WEATHER_HERO: SectionVariant[] = [
  {
    id: 'station',
    name: 'Weather station ✺',
    description: 'A frosted instrument panel: sun path tracking the real time of day, two swept dials, an hourly outlook strip.',
    Component: HeroWeatherStation,
  },
];

export const WEATHER_STATS: SectionVariant[] = [
  {
    id: 'instruments',
    name: 'Instrument dials ✺',
    description: 'Figures as 270° swept gauges with tick rings and needles that settle into place.',
    Component: StatsInstruments,
  },
];

export const WEATHER_SKILLS: SectionVariant[] = [
  {
    id: 'forecast',
    name: 'Five-day outlook ✺',
    description: 'A trend line across categories over daily forecast cards scaled to their depth.',
    Component: SkillsForecast,
  },
];

export const WEATHER_PROJECTS: SectionVariant[] = [
  {
    id: 'reports',
    name: 'Logged reports ✺',
    description: 'Work as numbered observation reports on frosted station cards.',
    Component: ProjectsStations,
  },
];

export const WEATHER_CONTACT: SectionVariant[] = [
  {
    id: 'advisory',
    name: 'Weather advisory ✺',
    description: 'Your availability issued as a hazard-banded advisory notice.',
    Component: ContactAdvisory,
  },
];
