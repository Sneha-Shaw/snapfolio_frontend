import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SectionVariant } from './shared';
import {
  Heading,
  PrimaryCTA,
  Reveal,
  SecondaryCTA,
  Section,
  groupTech,
  pickProjects,
  statementLines,
  type SectionProps,
} from './shared';

/**
 * MacBook (✺) — a laptop assembled from CSS, with the page on its screen.
 *
 * The lid and the base are siblings in one `preserve-3d` scene, hinged on the
 * same axis: the lid rotates up about its bottom edge, the base rotates away
 * about its top edge. Sharing that axis is what produces a real wedge
 * silhouette and makes the keyboard foreshorten correctly — the first version
 * drew the base flat and consequently looked like an elevation drawing.
 *
 * Because a CSS transform does not affect layout, the base is absolutely
 * positioned and its *visual* (foreshortened) height is reserved by a spacer:
 * depth × cos(tilt). Without that the machine would leave a hole under itself.
 *
 * Material work is in index.css — `.alu`, `.mac-lid`, `.mac-bezel`,
 * `.mac-notch`, `.mac-glass`, `.mac-chin`, `.mac-hinge`, `.mac-base`,
 * `.mac-deck`, `.mac-key`, `.mac-trackpad`, `.mac-grille`.
 */

/** Real MacBook proportions: depth is about 0.707 of the width. */
const BASE_DEPTH_RATIO = 0.707;

/**
 * Keyboard rows as [label, width in key units]. A real keyboard's character is
 * mostly in the staggered modifier widths — uniform keys read as a calculator.
 */
type Key = [string, number];

const ROW_FN: Key[] = [
  ['esc', 1.6], ['F1', 1], ['F2', 1], ['F3', 1], ['F4', 1], ['F5', 1], ['F6', 1],
  ['F7', 1], ['F8', 1], ['F9', 1], ['F10', 1], ['F11', 1], ['F12', 1], ['◉', 1.6],
];
const ROW_NUM: Key[] = [
  ['`', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1],
  ['8', 1], ['9', 1], ['0', 1], ['–', 1], ['=', 1], ['⌫', 1.6],
];
const ROW_TOP: Key[] = [
  ['⇥', 1.6], ['Q', 1], ['W', 1], ['E', 1], ['R', 1], ['T', 1], ['Y', 1], ['U', 1],
  ['I', 1], ['O', 1], ['P', 1], ['[', 1], [']', 1], ['\\', 1],
];
const ROW_HOME: Key[] = [
  ['⇪', 1.9], ['A', 1], ['S', 1], ['D', 1], ['F', 1], ['G', 1], ['H', 1], ['J', 1],
  ['K', 1], ['L', 1], [';', 1], ["'", 1], ['⏎', 1.9],
];
const ROW_BOTTOM: Key[] = [
  ['⇧', 2.4], ['Z', 1], ['X', 1], ['C', 1], ['V', 1], ['B', 1], ['N', 1], ['M', 1],
  [',', 1], ['.', 1], ['/', 1], ['⇧', 2.0],
];
const ROW_SPACE: Key[] = [
  ['fn', 1], ['⌃', 1], ['⌥', 1], ['⌘', 1.3], [' ', 5.4], ['⌘', 1.3], ['⌥', 1],
];

const LETTER_ROWS = [ROW_NUM, ROW_TOP, ROW_HOME, ROW_BOTTOM];

function KeyCap({ label, units, fn }: { label: string; units: number; fn?: boolean }) {
  return (
    <span
      className={cn(
        'mac-key grid place-items-center overflow-hidden text-white/45',
        fn ? 'text-[clamp(3px,0.42vw,6px)]' : 'text-[clamp(4px,0.58vw,8px)]'
      )}
      style={{ flexGrow: units, flexBasis: 0, minWidth: 0 }}
    >
      {label.trim() && label}
    </span>
  );
}

/** The generated keyboard, including the arrow cluster. */
function Keyboard() {
  return (
    <div className="flex h-full flex-col gap-[2.5px]">
      <div className="flex gap-[2.5px]" style={{ flexGrow: 0.72, flexBasis: 0 }}>
        {ROW_FN.map(([l, u], i) => (
          <KeyCap key={`f${i}`} label={l} units={u} fn />
        ))}
      </div>
      {LETTER_ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-[2.5px]" style={{ flexGrow: 1, flexBasis: 0 }}>
          {row.map(([l, u], i) => (
            <KeyCap key={`${ri}-${i}`} label={l} units={u} />
          ))}
        </div>
      ))}
      {/* Space row with the inverted-T arrow cluster on the right. */}
      <div className="flex gap-[2.5px]" style={{ flexGrow: 1, flexBasis: 0 }}>
        {ROW_SPACE.map(([l, u], i) => (
          <KeyCap key={`s${i}`} label={l} units={u} />
        ))}
        <span className="flex flex-col gap-[2.5px]" style={{ flexGrow: 1, flexBasis: 0 }}>
          <span className="mac-key grid flex-1 place-items-center text-[clamp(3px,0.4vw,6px)] text-white/40">▲</span>
          <span className="mac-key grid flex-1 place-items-center text-[clamp(3px,0.4vw,6px)] text-white/40">▼</span>
        </span>
        <KeyCap label="◀" units={1} fn />
        <KeyCap label="▶" units={1} fn />
      </div>
    </div>
  );
}

/**
 * The machine.
 *
 * `tilt` is how far the base lies away from the viewer. 72° is the realistic
 * desk angle; sections that need the keycap labels legible (the skills design)
 * pass a gentler tilt and trade some realism for readability.
 */
function MacBook({
  screen,
  keys,
  tilt = 70,
  className,
}: {
  screen: React.ReactNode;
  keys?: React.ReactNode;
  tilt?: number;
  className?: string;
}) {
  /* Reserve only the foreshortened height the rotated base actually occupies. */
  const visualDepth = BASE_DEPTH_RATIO * Math.cos((tilt * Math.PI) / 180);

  return (
    <div className={cn('mac-scene relative w-full', className)}>
      <div className="mac-assembly relative">
        {/* Lid — stands up about the hinge line. */}
        <motion.div
          className="alu mac-lid relative z-20"
          /* Open is the resting state. Earlier versions swung the lid up from
             closed, but any path where the animation did not run (an observer
             that never fired, reduced motion, a prerender) left an empty box
             where the screen should be. A design must not depend on an
             animation completing to be correct. */
          initial={false}
          animate={{ rotateX: -4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mac-bezel">
            <span className="mac-notch" aria-hidden />
            <div className="mac-screen mac-glass aspect-[16/10] w-full">
              <motion.div
                className="size-full"
                initial={false}
                animate={{ opacity: 1, filter: 'brightness(1)' }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                {screen}
              </motion.div>
            </div>
            <div className="mac-chin">
              <p className="mac-wordmark">MacBook Pro</p>
            </div>
          </div>
        </motion.div>

        {/* Hinge barrel */}
        <div className="mac-hinge" aria-hidden />

        {/* Base — lies away about its top edge. Spacer reserves its visual height. */}
        <div className="relative w-full" style={{ paddingBottom: `${visualDepth * 100}%` }}>
          <div
            className="alu mac-base absolute inset-x-0 top-0"
            style={{ aspectRatio: `1 / ${BASE_DEPTH_RATIO}`, transform: `rotateX(${tilt}deg)` }}
          >
            <div className="flex h-full flex-col px-[3.5%] pb-[2%] pt-[1.5%]">
              <div className="flex min-h-0 flex-1 items-stretch gap-[1.5%]">
                <div className="mac-grille w-[6%] shrink-0 rounded-sm" aria-hidden />
                <div className="mac-deck min-h-0 flex-1 p-[1.2%]">{keys ?? <Keyboard />}</div>
                <div className="mac-grille w-[6%] shrink-0 rounded-sm" aria-hidden />
              </div>
              {/* Trackpad sits in the palm rest below the deck. */}
              <div className="flex shrink-0 justify-center pt-[2%]" style={{ height: '34%' }}>
                <div className="mac-trackpad h-full w-[36%]" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desk: contact shadow, then the screen's light thrown forward onto it. */}
      <div className="mac-shadow pointer-events-none absolute inset-x-[4%] bottom-0 h-8" aria-hidden />
      <div className="mac-spill pointer-events-none absolute inset-x-[-4%] -bottom-6 h-16" aria-hidden />
    </div>
  );
}

/** Browser chrome, so the screen content reads as a real site being viewed. */
function BrowserChrome({ host, children }: { host: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-[var(--color-bg)]">
      <div className="flex shrink-0 items-center gap-[3px] border-b border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-2 py-[5px]">
        <span className="size-[5px] rounded-full bg-[#ff5f57]" />
        <span className="size-[5px] rounded-full bg-[#febc2e]" />
        <span className="size-[5px] rounded-full bg-[#28c840]" />
        <span className="mx-auto max-w-[55%] truncate rounded-full bg-[var(--color-bg)] px-2 py-[1px] text-[6px] text-[var(--color-text-faint)]">
          {host}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

const hostOf = (name?: string | null, path = '') =>
  `${(name || 'portfolio').split(' ')[0]?.toLowerCase() ?? 'portfolio'}.dev${path}`;

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------

function HeroMacBook({ profile, projects }: SectionProps) {
  const lines = statementLines(profile);

  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pt-14">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          {profile?.heroEyebrow && (
            <Reveal>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">
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

        <div className="mx-auto max-w-2xl">
          <MacBook
            screen={
              <BrowserChrome host={hostOf(profile?.name)}>
                {/* A miniature of the real site: nav, statement, work grid.
                    Proportion matters more than legibility at this size — it
                    has to read as a page, not as a caption. */}
                <div className="flex h-full flex-col px-[5%] py-[4%]">
                  <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] pb-[2%]">
                    <span className="text-[6px] font-bold text-[var(--color-text)]">
                      {(profile?.name || 'portfolio').split(' ')[0]}
                      <span className="text-[var(--color-accent)]">.dev</span>
                    </span>
                    <span className="flex gap-[6px] text-[5.5px] text-[var(--color-text-faint)]">
                      <span>Home</span>
                      <span>Work</span>
                      <span className="text-[var(--color-accent)]">Contact</span>
                    </span>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col justify-center py-[3%]">
                    <p className="text-[5.5px] uppercase tracking-[0.3em] text-[var(--color-accent)]">
                      {profile?.headline || 'Portfolio'}
                    </p>
                    {/* The whole statement, not just its first line — a clipped
                        sentence is the fastest way to look unfinished. */}
                    <p className="mt-[2%] text-[11px] font-semibold leading-[1.12] tracking-tight text-[var(--color-text)]">
                      {lines.join(' ')}
                    </p>
                    {profile?.bio && (
                      <p className="mt-[2%] line-clamp-2 max-w-[78%] text-[6px] leading-relaxed text-[var(--color-text-muted)]">
                        {profile.bio.split('\n')[0]}
                      </p>
                    )}
                  </div>

                  <div className="grid shrink-0 grid-cols-3 gap-[1.5%]">
                    {projects.slice(0, 3).map((p) => (
                      <div key={p._id} className="overflow-hidden rounded-[2px] bg-[var(--color-bg-elevated)]">
                        {p.thumbnail?.url ? (
                          <img src={p.thumbnail.url} alt="" className="aspect-[16/10] w-full object-cover" />
                        ) : (
                          <div className="aspect-[16/10] w-full bg-[var(--color-accent-soft)]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </BrowserChrome>
            }
          />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------

function ProjectsMacBook({ projects, projectsLoading, profile }: SectionProps) {
  const items = pickProjects(projects, 6);
  const [active, setActive] = useState(0);
  if (projectsLoading || items.length === 0) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <Section id="projects">
      <Heading eyebrow="Work" title="On the desk" />
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <MacBook
          screen={
            <BrowserChrome host={hostOf(profile?.name, `/${current?.slug ?? ''}`)}>
              {current?.thumbnail?.url ? (
                <motion.img
                  key={current._id}
                  src={current.thumbnail.url}
                  alt={current.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45 }}
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center text-[7px] text-[var(--color-text-faint)]">
                  No preview
                </div>
              )}
            </BrowserChrome>
          }
        />

        <div className="space-y-2">
          {items.map((project, i) => (
            <button
              key={project._id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all duration-300',
                i === active
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)]'
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className={cn('font-medium', i === active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]')}>
                  {project.title}
                </p>
                <span className="shrink-0 font-mono text-xs text-[var(--color-text-faint)]">{project.year}</span>
              </div>
              {i === active && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">{project.shortDescription}</p>
                  <Link
                    to={`/work/${project.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]"
                  >
                    Open case study <ArrowUpRight className="size-3.5" />
                  </Link>
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// SKILLS — the tools printed on the machine's own keycaps
// ---------------------------------------------------------------------------

function SkillsMacKeyboard({ technologies, profile }: SectionProps) {
  const groups = groupTech(technologies);
  const [pressed, setPressed] = useState<string | null>(null);
  if (groups.length === 0) return null;

  return (
    <Section id="skills">
      <Heading eyebrow="Stack" title="Every key I use" align="center" />
      <div className="mx-auto max-w-3xl">
        {/* Gentler tilt here: the caps carry text, so legibility wins over angle. */}
        <MacBook
          tilt={52}
          screen={
            <BrowserChrome host={hostOf(profile?.name, '/stack')}>
              <div className="grid size-full grid-cols-3 content-start gap-1 p-2">
                {groups.slice(0, 6).map((g) => (
                  <div key={g.cat} className="rounded-[3px] border border-[var(--color-border)] p-1.5">
                    <p className="truncate text-[5px] uppercase tracking-widest text-[var(--color-text-faint)]">
                      {g.label}
                    </p>
                    <p className="text-[11px] font-semibold leading-none text-[var(--color-accent)]">{g.items.length}</p>
                  </div>
                ))}
              </div>
            </BrowserChrome>
          }
          keys={
            <div className="flex h-full flex-col gap-[2.5px]">
              {groups.map((group) => (
                <div key={group.cat} className="flex gap-[2.5px]" style={{ flexGrow: 1, flexBasis: 0 }}>
                  {/* Row label occupies the modifier-key position. */}
                  <span
                    className="mac-key grid place-items-center overflow-hidden px-1 text-[clamp(3.5px,0.5vw,7px)] uppercase tracking-wider text-white/40"
                    style={{ flexGrow: 2.2, flexBasis: 0, minWidth: 0 }}
                  >
                    <span className="truncate">{group.label}</span>
                  </span>
                  {group.items.map((tech) => (
                    <button
                      key={tech._id}
                      type="button"
                      onPointerDown={() => setPressed(tech._id)}
                      onPointerUp={() => setPressed(null)}
                      onPointerLeave={() => setPressed((p) => (p === tech._id ? null : p))}
                      data-pressed={pressed === tech._id}
                      title={tech.name}
                      className="mac-key mac-key-lit grid place-items-center overflow-hidden px-0.5 text-[clamp(3.5px,0.52vw,8px)] font-medium text-white/85"
                      style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}
                    >
                      <span className="truncate">{tech.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          }
        />
      </div>
      <p className="mt-6 text-center text-xs text-[var(--color-text-faint)]">
        Press a key — the backlight sits under the caps.
      </p>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const MAC_HERO: SectionVariant[] = [
  {
    id: 'macbook',
    name: 'MacBook ✺',
    description:
      'Lid and base hinged in one 3D scene, so the deck foreshortens like a real machine on a desk — your site in the browser on screen, light spilling forward.',
    Component: HeroMacBook,
  },
];

export const MAC_PROJECTS: SectionVariant[] = [
  {
    id: 'macbook',
    name: 'MacBook screen ✺',
    description: 'Work shown on the laptop display, switched from the list beside it.',
    Component: ProjectsMacBook,
  },
];

export const MAC_SKILLS: SectionVariant[] = [
  {
    id: 'mac-keyboard',
    name: 'MacBook keys ✺',
    description: 'Your tools printed on the machine’s own chiclet caps, one row per category, backlit on press.',
    Component: SkillsMacKeyboard,
  },
];
