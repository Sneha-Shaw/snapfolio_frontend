import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio as RadioIcon, Tv } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SectionVariant } from './shared';
import {
  Heading,
  PrimaryCTA,
  Reveal,
  SecondaryCTA,
  Section,
  groupTech,
  newestFirst,
  pickProjects,
  statementLines,
  type SectionProps,
} from './shared';

/**
 * Analog set (✺) — clock, valve radio, cathode-ray television.
 *
 * These are objects with visible mechanisms, so the mechanism does the work:
 * the clock runs on the real system time, the radio's needle tunes to a real
 * station in your stack, the television actually changes channel with a burst
 * of static. Material work is in index.css — `.clock-face`, `.veneer`,
 * `.grille-cloth`, `.knob`, `.crt-tube`, `.shadow-mask`, `.crt-vignette`.
 */

// ---------------------------------------------------------------------------
// CLOCK
// ---------------------------------------------------------------------------

/** Ticks once a second; the hands are driven from the real clock. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function ClockFace({ size = 'w-full', showSeconds = true }: { size?: string; showSeconds?: boolean }) {
  const now = useNow();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  return (
    <div className={cn('clock-bezel relative aspect-square p-3', size)}>
      <div className="clock-face relative size-full">
        <div className="clock-minutes absolute inset-0" aria-hidden />
        <div className="clock-hours absolute inset-0" aria-hidden />

        {/* Numerals at the quarters only — a cleaner dial than all twelve. */}
        {[
          { n: '12', cls: 'left-1/2 top-[7%] -translate-x-1/2' },
          { n: '3', cls: 'right-[7%] top-1/2 -translate-y-1/2' },
          { n: '6', cls: 'left-1/2 bottom-[7%] -translate-x-1/2' },
          { n: '9', cls: 'left-[7%] top-1/2 -translate-y-1/2' },
        ].map((m) => (
          <span key={m.n} className={cn('absolute text-xs font-semibold text-[var(--color-text-muted)]', m.cls)}>
            {m.n}
          </span>
        ))}

        {/* Hands. Each rotates about its base, which sits at the dial centre. */}
        <div
          className="clock-hand absolute bottom-1/2 left-1/2 w-[7px] -translate-x-1/2"
          style={{ height: '27%', transform: `translateX(-50%) rotate(${hours * 30}deg)` }}
          aria-hidden
        />
        <div
          className="clock-hand absolute bottom-1/2 left-1/2 w-[5px] -translate-x-1/2"
          style={{ height: '38%', transform: `translateX(-50%) rotate(${minutes * 6}deg)` }}
          aria-hidden
        />
        {showSeconds && (
          <div
            className="clock-hand-second absolute bottom-1/2 left-1/2 w-[2px] -translate-x-1/2"
            style={{ height: '42%', transform: `translateX(-50%) rotate(${seconds * 6}deg)` }}
            aria-hidden
          />
        )}
        <span
          className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_0_2px_var(--color-bg-elevated)]"
          aria-hidden
        />
      </div>
    </div>
  );
}

function HeroClock({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const now = useNow();

  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <div>
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
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
          <Reveal delay={0.55}>
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
              {profile?.location || 'Remote'} ·{' '}
              <span className="text-[var(--color-accent)]">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>{' '}
              local
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mx-auto max-w-sm">
            <ClockFace />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ExperienceDial({ experiences }: SectionProps) {
  const items = newestFirst(experiences).slice(0, 12);
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <Section id="experience">
      <Heading eyebrow="Hours logged" title="Around the dial" align="center" />
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="clock-bezel relative mx-auto aspect-square w-full max-w-md p-3">
          <div className="clock-face relative size-full">
            <div className="clock-minutes absolute inset-0" aria-hidden />
            {/* Each role is a marker at its own hour position. */}
            {items.map((exp, i) => {
              const angle = (i / items.length) * 360;
              const rad = ((angle - 90) * Math.PI) / 180;
              return (
                <button
                  key={exp._id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  title={`${exp.position} — ${exp.company}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${50 + Math.cos(rad) * 36}%`, top: `${50 + Math.sin(rad) * 36}%` }}
                >
                  <span
                    className={cn(
                      'block rounded-full transition-all duration-300',
                      i === active
                        ? 'size-4 bg-[var(--color-accent)] ring-4 ring-[var(--color-accent-soft)]'
                        : 'size-2.5 bg-[var(--color-text-faint)] hover:bg-[var(--color-text)]'
                    )}
                  />
                </button>
              );
            })}
            {/* A single hand pointing at the selected role. */}
            <div
              className="clock-hand absolute bottom-1/2 left-1/2 w-[6px] transition-transform duration-500"
              style={{ height: '34%', transform: `translateX(-50%) rotate(${(active / items.length) * 360}deg)` }}
              aria-hidden
            />
            <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]" aria-hidden />
          </div>
        </div>

        {current && (
          <motion.div key={current._id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              {new Date(current.startDate).getFullYear()} —{' '}
              {current.current ? 'present' : current.endDate ? new Date(current.endDate).getFullYear() : ''}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-[var(--color-text)]">{current.position}</h3>
            <p className="mt-1 text-[var(--color-text-muted)]">
              {current.company}
              {current.location ? ` · ${current.location}` : ''}
            </p>
            {current.responsibilities.length > 0 && (
              <ul className="mt-5 space-y-2">
                {current.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2.5 text-sm text-[var(--color-text-muted)]">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// RADIO
// ---------------------------------------------------------------------------

function HeroRadio({ profile, technologies }: SectionProps) {
  const lines = statementLines(profile);
  /* The needle parks on a "station" derived from the stack, for flavour. */
  const station = 88.1 + (technologies.length % 20) * 0.5;
  const needlePct = ((station - 88) / 20) * 100;

  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
                <RadioIcon className="size-4 text-[var(--color-accent)]" />
                {profile.heroEyebrow}
              </p>
            </Reveal>
          )}
          <h1 className="text-4xl font-semibold leading-[1] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <Reveal delay={0.4} className="mt-8 flex flex-wrap justify-center gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </Reveal>
        </div>

        {/* The set: walnut cabinet, cloth grille, lit dial, knurled controls. */}
        <Reveal delay={0.2}>
          <div className="veneer mx-auto max-w-2xl rounded-2xl p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-[1.1fr_1fr]">
              <div className="grille-cloth aspect-[4/3] rounded-lg" aria-hidden />

              <div className="flex flex-col justify-between gap-4">
                {/* Tuning dial */}
                <div>
                  <div className="tuning-scale relative h-16 overflow-hidden rounded-md px-2">
                    <div className="flex h-full items-end justify-between pb-1">
                      {[88, 92, 96, 100, 104, 108].map((f) => (
                        <span key={f} className="text-[8px] font-medium text-[var(--color-text-muted)]">
                          {f}
                        </span>
                      ))}
                    </div>
                    {/* Needle */}
                    <motion.span
                      className="absolute inset-y-1 w-[2px] rounded bg-[#ff4d4d] shadow-[0_0_8px_2px_rgba(255,77,77,0.5)]"
                      initial={{ left: '4%' }}
                      whileInView={{ left: `${Math.min(Math.max(needlePct, 4), 95)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                    {station.toFixed(1)} FM · {profile?.availability ? 'on air' : 'standby'}
                  </p>
                </div>

                {/* VU meter — the needle swings as if there were signal. */}
                <div className="relative h-14 overflow-hidden rounded-md bg-[#e8dcc0] px-3 pt-1">
                  <div className="flex justify-between text-[7px] font-bold text-black/50">
                    <span>-20</span>
                    <span>0</span>
                    <span>+3</span>
                  </div>
                  <span
                    className="animate-vu absolute bottom-0 left-1/2 h-10 w-[1.5px] origin-bottom bg-black/70"
                    aria-hidden
                  />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-bold uppercase text-black/40">
                    VU
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-3">
                  {['Vol', 'Tune', 'Tone'].map((label) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="knob relative size-9" aria-hidden />
                      <span className="text-[8px] uppercase tracking-widest text-white/50">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SkillsTuner({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  const [band, setBand] = useState(0);
  if (groups.length === 0) return null;
  const current = groups[Math.min(band, groups.length - 1)];

  return (
    <Section id="skills">
      <Heading eyebrow="Stack" title="Tune the band" align="center" />
      <div className="veneer mx-auto max-w-3xl rounded-2xl p-5 sm:p-7">
        {/* Band selector across the dial glass. */}
        <div className="tuning-scale relative h-20 overflow-hidden rounded-lg">
          <div className="absolute inset-0 flex">
            {groups.map((g, i) => (
              <button
                key={g.cat}
                type="button"
                onClick={() => setBand(i)}
                aria-current={i === band}
                className="group relative flex-1 border-r border-white/10 last:border-r-0"
              >
                <span
                  className={cn(
                    'absolute inset-x-0 bottom-2 text-[9px] font-semibold uppercase tracking-wider transition-colors',
                    i === band ? 'text-[var(--color-accent)]' : 'text-white/45 group-hover:text-white/80'
                  )}
                >
                  {g.label}
                </span>
              </button>
            ))}
          </div>
          <motion.span
            className="pointer-events-none absolute inset-y-2 w-[3px] rounded bg-[#ff4d4d] shadow-[0_0_10px_3px_rgba(255,77,77,0.55)]"
            animate={{ left: `${((band + 0.5) / groups.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            aria-hidden
          />
        </div>

        {/* What's "playing" on the selected band. */}
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="min-h-24 rounded-lg bg-black/30 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
              now playing · {current?.label}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {current?.items.map((tech) => (
                <motion.span
                  key={tech._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="grille-cloth w-full rounded-lg sm:w-28" aria-hidden />
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// CATHODE-RAY TELEVISION
// ---------------------------------------------------------------------------

/** The tube, with all of its glass artefacts stacked over the content. */
function CrtTube({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('crt-tube crt-scanlines animate-crt-flicker relative aspect-[4/3]', className)}>
      <div className="relative z-[1] size-full overflow-hidden">{children}</div>
      <div className="shadow-mask pointer-events-none absolute inset-0 z-[3]" aria-hidden />
      <div className="crt-fringe pointer-events-none absolute inset-0 z-[3]" aria-hidden />
      <div className="crt-vignette pointer-events-none absolute inset-0 z-[4]" aria-hidden />
    </div>
  );
}

function HeroCrt({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden py-20">
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="crt-cabinet relative mx-auto rounded-2xl p-5 sm:p-7">
          {/* Bloom escaping around the tube. */}
          <div className="crt-bloom pointer-events-none absolute inset-6 z-0" aria-hidden />

          <div className="relative z-[1] grid gap-5 sm:grid-cols-[1fr_auto]">
            <CrtTube className="rounded-xl">
              <div className="flex size-full flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center">
                {profile?.heroEyebrow && (
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)]">
                    {profile.heroEyebrow}
                  </p>
                )}
                <h1 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
                  {lines.map((line, i) => (
                    <motion.span
                      key={line}
                      initial={{ opacity: 0, scaleY: 0.4 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                      className="block"
                    >
                      {line}
                    </motion.span>
                  ))}
                </h1>
                {profile?.bio && (
                  <p className="mt-4 max-w-md text-xs text-[var(--color-text-muted)] sm:text-sm">
                    {profile.bio.split('\n')[0]}
                  </p>
                )}
              </div>
            </CrtTube>

            {/* Control column: channel/volume knobs and the tally lamp. */}
            <div className="flex flex-row items-center justify-center gap-5 sm:w-20 sm:flex-col">
              <div className="flex flex-col items-center gap-1.5">
                <span className="knob relative size-11" aria-hidden />
                <span className="text-[8px] uppercase tracking-widest text-white/45">Ch</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="knob relative size-11" aria-hidden />
                <span className="text-[8px] uppercase tracking-widest text-white/45">Vol</span>
              </div>
              <div className="mac-grille h-8 w-12 rounded sm:w-full" aria-hidden />
              <span className="size-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_2px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]" aria-hidden />
            </div>
          </div>
        </div>

        <Reveal delay={0.5} className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </Reveal>
      </div>
    </section>
  );
}

function ProjectsChannels({ projects, projectsLoading }: SectionProps) {
  const items = pickProjects(projects, 6);
  const [channel, setChannel] = useState(0);
  const [tuning, setTuning] = useState(false);
  if (projectsLoading || items.length === 0) return null;
  const current = items[Math.min(channel, items.length - 1)];

  /* Changing channel bursts static first, the way a real set does. */
  const switchTo = (i: number) => {
    if (i === channel) return;
    setTuning(true);
    setChannel(i);
    setTimeout(() => setTuning(false), 260);
  };

  return (
    <Section id="projects">
      <Heading eyebrow="Broadcast" title="Change the channel" />
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="crt-cabinet relative rounded-2xl p-4 sm:p-6">
          <div className="crt-bloom pointer-events-none absolute inset-6 z-0" aria-hidden />
          <CrtTube className="relative z-[1] rounded-xl">
            {/* Static burst */}
            {tuning && (
              <div
                className="absolute inset-0 z-[2] opacity-70"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
                aria-hidden
              />
            )}
            {current?.thumbnail?.url ? (
              <img src={current.thumbnail.url} alt={current.title} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center bg-[var(--color-bg)] text-xs text-[var(--color-text-faint)]">
                No signal
              </div>
            )}
            {/* On-screen display, bottom-left like a real set. */}
            <div className="absolute bottom-3 left-3 z-[2] rounded bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
              CH {String(channel + 1).padStart(2, '0')} · {current?.year}
            </div>
          </CrtTube>
        </div>

        <div className="space-y-2">
          {items.map((project, i) => (
            <button
              key={project._id}
              type="button"
              onClick={() => switchTo(i)}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300',
                i === channel
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)]'
              )}
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold',
                  i === channel ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)]' : 'bg-[var(--color-bg-elevated-2)] text-[var(--color-text-faint)]'
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-[var(--color-text)]">{project.title}</span>
                <span className="block truncate text-xs text-[var(--color-text-muted)]">{project.shortDescription}</span>
              </span>
              <Tv className={cn('size-4 shrink-0', i === channel ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-faint)]')} />
            </button>
          ))}
          {current && (
            <Link
              to={`/work/${current.slug}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]"
            >
              Open {current.title} →
            </Link>
          )}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const ANALOG_HERO: SectionVariant[] = [
  { id: 'clock', name: 'Clock ✺', description: 'A guilloché dial with tapered hands running on your real system time, ticking every second.', Component: HeroClock },
  { id: 'radio', name: 'Valve radio ✺', description: 'Walnut cabinet, woven grille cloth, a lit tuning scale with a needle that sweeps to your station, and a swinging VU meter.', Component: HeroRadio },
  { id: 'crt', name: 'CRT television ✺', description: 'A bulging tube with aperture-grille triads, misconverged edges, corner vignette and mains flicker.', Component: HeroCrt },
];

export const ANALOG_EXPERIENCE: SectionVariant[] = [
  { id: 'dial', name: 'Around the dial ✺', description: 'Roles placed around a clock face; the hand swings to whichever you pick.', Component: ExperienceDial },
];

export const ANALOG_SKILLS: SectionVariant[] = [
  { id: 'tuner', name: 'Band tuner ✺', description: 'Categories as radio bands — the needle springs across the dial to what is playing.', Component: SkillsTuner },
];

export const ANALOG_PROJECTS: SectionVariant[] = [
  { id: 'channels', name: 'TV channels ✺', description: 'Each project is a channel, with a burst of static on every change and an on-screen display.', Component: ProjectsChannels },
];
