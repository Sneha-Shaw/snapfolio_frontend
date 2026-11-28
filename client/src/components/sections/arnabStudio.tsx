import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { GazeCharacter, type GazeConfig } from '@/components/motion/GazeCharacter';
import { ARNAB_ANGLES } from './arnabFrames';
import { statementLines, yearsOfExperience, type SectionProps } from './shared';

/**
 * The "Arnab" hero: a full-screen night-time studio with an animated character whose head and eyes
 * follow your cursor in every direction, and everything else wrapped around him: who this is at the
 * top, the statement and buttons on the left, the numbers on the right, links top-right and shortcuts
 * to the rest of the page along the bottom. His face stays clear in the middle.
 * The character is a ring of frames cut from one locked-camera video of a full gaze circle
 * (public/hero/arnab/r_001…), each tagged with the direction it looks (arnabFrames.ts).
 */
const GAZE: GazeConfig = {
  ring: ARNAB_ANGLES.map((angle, i) => ({ angle, src: `/hero/arnab/r_${String(i + 1).padStart(3, '0')}.webp` })),
  neutral: '/hero/arnab/neutral.webp',
  focus: { x: 0.5, y: 0.3 },
  background: '#070b1c',
  anchor: { x: 0.5, y: 0.34 },
  deadZone: 70,
  band: 50,
  smoothing: 0.1,
};

const EASE = [0.16, 1, 0.3, 1] as const;

const SECTION_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
];

const fade = (delay: number, y = 12) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

const glass = 'border border-white/15 bg-[rgba(10,14,32,0.5)] backdrop-blur-md';

export function ArnabStudioHero({ profile, projects, experiences, technologies, socialLinks }: SectionProps) {
  const lines = statementLines(profile);
  const stats = [
    { value: `${yearsOfExperience(experiences)}+`, label: 'Years building' },
    { value: String(projects.length), label: 'Projects shipped' },
    { value: String(technologies.length), label: 'Technologies' },
  ];

  return (
    <section className="relative isolate h-[calc(100svh-4rem)] min-h-[620px] overflow-hidden bg-[#070b1c] text-white">
      <GazeCharacter
        config={GAZE}
        fallback={<div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_30%_45%,rgba(255,190,120,0.22),transparent_70%),radial-gradient(50%_60%_at_75%_35%,rgba(90,120,255,0.28),transparent_70%),linear-gradient(180deg,#0a1030,#070b18)]" aria-hidden="true" />}
      />

      {/* Scrims: readable text around the edges, the face left untouched. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(0deg,rgba(5,8,18,0.94)_0%,rgba(5,8,18,0.6)_42%,transparent_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-[linear-gradient(90deg,rgba(5,8,18,0.5),transparent)] max-md:hidden" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(5,8,18,0.55),transparent)]" aria-hidden="true" />

      {/* Top: who this is (left) and where else to find me (right) */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <motion.div {...fade(0.3, -8)} className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 ${glass}`}>
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
              <span className="relative size-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            {profile?.heroEyebrow || profile?.availability || 'Available for work'}
          </span>
          {profile?.name && (
            <span className={`hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/90 sm:inline-flex ${glass}`}>
              {profile.name}
              {profile.headline && <span className="hidden text-white/50 lg:inline">· {profile.headline}</span>}
            </span>
          )}
        </motion.div>

        {socialLinks.length > 0 && (
          <motion.nav {...fade(0.4, -8)} aria-label="Elsewhere" className="hidden items-center gap-6 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 md:flex">
            {socialLinks.slice(0, 4).map((l) => (
              <a key={l._id} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 capitalize transition-colors duration-500 hover:text-white">
                {l.label || l.platform} <ArrowUpRight className="size-3.5 opacity-60" />
              </a>
            ))}
          </motion.nav>
        )}
      </div>

      {/* Bottom: one statement, then one row: shortcuts, the single call to action, and the numbers */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 sm:px-8 sm:pb-8">
        <h1 className="max-w-2xl text-balance text-2xl font-semibold leading-[1.1] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-3xl lg:text-4xl">
          {lines.map((line, i) => (
            <span key={`${line}-${i}`} className="block overflow-hidden pb-[0.08em]">
              <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.35 + i * 0.12 }}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div {...fade(0.8, 16)} className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3">
          {SECTION_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 ${glass}`}>
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-accent)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]"
          >
            Get in touch <ArrowRight className="size-3.5" />
          </a>

          <dl className={`ml-auto hidden items-center divide-x divide-white/15 rounded-full px-2 py-1.5 lg:flex ${glass}`}>
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2 px-4 py-1">
                <dt className="text-base font-semibold leading-none">{s.value}</dt>
                <dd className="text-[9px] uppercase tracking-[0.14em] text-white/55">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
