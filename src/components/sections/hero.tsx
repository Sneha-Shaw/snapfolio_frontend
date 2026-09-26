import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Mail, MapPin } from 'lucide-react';
import { Hero as AuroraHero } from '@/components/home/Hero';
import { GridGlow } from '@/components/aceternity/GridGlow';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import {
  Avatar,
  MetroTile,
  PrimaryCTA,
  Prompt,
  SecondaryCTA,
  TerminalOutput,
  TerminalWindow,
  metroColor,
  pickProjects,
  shellHost,
  statementLines,
  yearsOfExperience,
  type SectionProps,
  type SectionVariant,
} from './shared';

function HeroAurora({ profile }: SectionProps) {
  return <AuroraHero profile={profile} />;
}

function HeroMinimal({ profile, socialLinks }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <header className="mx-auto max-w-4xl px-6 pb-16 pt-24 sm:pt-32">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10 flex flex-wrap gap-x-3 text-sm text-[var(--color-text-muted)]">
        <span className="font-medium text-[var(--color-text)]">{profile?.name || 'Your Name'}</span>
        {profile?.headline && <span>— {profile.headline}</span>}
      </motion.p>
      <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-tight text-[var(--color-text)] sm:text-6xl">
        {lines.map((line, i) => (
          <motion.span key={`${line}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 * i }} className="block">
            {line}
          </motion.span>
        ))}
      </h1>
      {profile?.bio && <p className="mt-10 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">{profile.bio}</p>}
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
        {socialLinks.map((link) => (
          <a key={link._id} href={link.url} target="_blank" rel="noreferrer" className="capitalize text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            {link.label || link.platform} ↗
          </a>
        ))}
      </div>
    </header>
  );
}

function HeroSplit({ profile, projects, experiences, technologies }: SectionProps) {
  const lines = statementLines(profile);
  const stats = [
    { value: `${yearsOfExperience(experiences)}+`, label: 'Years building' },
    { value: String(projects.length), label: 'Projects shipped' },
    { value: String(technologies.length), label: 'Technologies' },
  ];
  return (
    <section className="relative overflow-hidden">
      <GridGlow className="opacity-50" />
      <div className="relative mx-auto grid min-h-[80vh] max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {profile?.heroEyebrow && (
            <p className="mb-5 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-accent)]">
              {profile.heroEyebrow}
            </p>
          )}
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.join(' ')}
          </h1>
          {profile?.bio && <p className="mt-6 max-w-xl text-lg text-[var(--color-text-muted)]">{profile.bio}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--color-border)] pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-3xl font-semibold text-[var(--color-text)]">{s.value}</dt>
                <dd className="mt-1 text-xs text-[var(--color-text-faint)]">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rotate-3 rounded-3xl border-2 border-[var(--color-accent)] opacity-60" />
          <Avatar profile={profile} className="relative aspect-[4/5] w-full rounded-3xl text-7xl" />
          {profile?.availability && (
            <div className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm shadow-[var(--shadow-card)]">
              <span className="size-2 animate-pulse rounded-full bg-[var(--color-accent)]" />
              <span className="text-[var(--color-text)]">{profile.availability}</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function HeroCentered({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const { theme } = useTheme();
  return (
    <section className="relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill={theme.accent} />
      <div className="relative mx-auto flex min-h-[85vh] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-[var(--color-accent)] opacity-40 blur-2xl" />
          <Avatar profile={profile} className="relative size-28 rounded-full border-4 border-[var(--color-bg-elevated)] text-3xl" />
        </motion.div>
        <p className="mb-4 text-sm text-[var(--color-text-muted)]">
          Hi, I'm <span className="font-medium text-[var(--color-text)]">{profile?.name || 'there'}</span>
          {profile?.headline && <> · {profile.headline}</>}
        </p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-balance bg-gradient-to-b from-[var(--color-text)] to-[var(--color-text-muted)] bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-7xl">
          {lines.join(' ')}
        </motion.h1>
        {profile?.bio && <p className="mt-6 max-w-2xl text-lg text-[var(--color-text-muted)]">{profile.bio}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </div>
      </div>
    </section>
  );
}

function HeroBento({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const tile = 'elevated-card relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6';
  return (
    <section className="mx-auto max-w-6xl px-6 pt-10">
      <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`${tile} flex flex-col justify-between sm:col-span-2 lg:row-span-2`}>
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[var(--color-accent-soft)] blur-3xl" />
          <div className="relative">
            {profile?.heroEyebrow && <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">{profile.heroEyebrow}</p>}
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
              {lines.map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </h1>
            {profile?.bio && <p className="mt-4 text-[var(--color-text-muted)]">{profile.bio}</p>}
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <PrimaryCTA className="h-11" />
            <SecondaryCTA className="h-11" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`${tile} p-0 lg:row-span-2`}>
          <Avatar profile={profile} className="size-full min-h-[280px] text-6xl" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <p className="font-semibold text-white">{profile?.name}</p>
            {profile?.headline && <p className="text-sm text-white/75">{profile.headline}</p>}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${tile} flex flex-col justify-between`}>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            <span className="size-2 animate-pulse rounded-full bg-[var(--color-accent)]" /> Status
          </p>
          <p className="text-lg font-medium text-[var(--color-text)]">{profile?.availability || 'Open to opportunities'}</p>
          {profile?.heroCurrently && <p className="text-sm text-[var(--color-text-muted)]">{profile.heroCurrently}</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={`${tile} flex flex-col justify-between`}>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            <MapPin className="size-3.5" /> Based in
          </p>
          <p className="text-lg font-medium text-[var(--color-text)]">{profile?.location || 'Remote'}</p>
          {profile?.heroTimezone && <p className="font-mono text-xs text-[var(--color-text-faint)]">{profile.heroTimezone}</p>}
        </motion.div>
      </div>
    </section>
  );
}

function HeroTerminal({ profile }: SectionProps) {
  const host = shellHost(profile);
  return (
    <section className="mx-auto max-w-4xl px-4 pb-6 pt-12 sm:px-6 sm:pt-16">
      <TerminalWindow title={`guest@${host}: ~ — zsh`}>
        <p className="text-xs text-[var(--color-text-faint)]">Last login: {new Date().toDateString()} on ttys001</p>
        <Prompt host={host} cmd="whoami" />
        <TerminalOutput>
          <p className="text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">{profile?.name || 'guest'}</p>
          {profile?.headline && <p className="mt-1 text-[var(--color-accent)]">{profile.headline}</p>}
          <p className="mt-3 text-[var(--color-text)]">{statementLines(profile).join(' ')}</p>
          <p className="mt-3 text-xs">{[profile?.location, profile?.heroTimezone, profile?.availability].filter(Boolean).join('  ·  ')}</p>
        </TerminalOutput>
        <Prompt host={host} cursor />
      </TerminalWindow>
    </section>
  );
}

function HeroMarquee({ profile }: SectionProps) {
  const name = (profile?.name || 'Your Name').toUpperCase();
  const row = Array.from({ length: 4 }, () => name).join(' — ');
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-6xl px-6">
        {profile?.heroEyebrow && <p className="mb-6 font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]">{profile.heroEyebrow}</p>}
      </div>
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((k) => (
          <span key={k} className="pr-8 text-[18vw] font-black leading-none tracking-tighter text-[var(--color-text)] sm:text-[12vw]">
            {row} —
          </span>
        ))}
      </div>
      <div className="flex w-max animate-[marquee_40s_linear_infinite_reverse] whitespace-nowrap">
        {[0, 1].map((k) => (
          <span key={k} className="pr-8 text-[18vw] font-black leading-none tracking-tighter text-transparent sm:text-[12vw]" style={{ WebkitTextStroke: '1.5px var(--color-accent)' }}>
            {row} —
          </span>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-xl text-balance text-xl text-[var(--color-text-muted)]">{statementLines(profile).join(' ')}</p>
        <div className="flex gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </div>
      </div>
    </section>
  );
}

function HeroGlass({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden px-6 py-24">
      <motion.div
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[10%] top-[15%] size-[420px] rounded-full bg-[var(--color-accent)] opacity-40 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[5%] right-[10%] size-[380px] rounded-full bg-[var(--color-accent-strong)] opacity-35 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-[var(--color-bg-elevated)]/40 p-8 shadow-2xl backdrop-blur-2xl sm:p-14"
      >
        <div className="flex items-center gap-4">
          <Avatar profile={profile} className="size-14 rounded-full text-lg" />
          <div>
            <p className="font-semibold text-[var(--color-text)]">{profile?.name}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{profile?.headline}</p>
          </div>
        </div>
        <h1 className="mt-10 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-6xl">
          {lines.map((l, i) => (
            <span key={i} className={i === lines.length - 1 ? 'block text-[var(--color-accent)]' : 'block'}>
              {l}
            </span>
          ))}
        </h1>
        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryCTA />
          <SecondaryCTA className="bg-[var(--color-bg)]/40" />
        </div>
      </motion.div>
    </section>
  );
}

function HeroMetro({ profile, projects, technologies }: SectionProps) {
  const top = pickProjects(projects, 2);
  return (
    <section className="mx-auto max-w-6xl px-6 pb-6 pt-14">
      <h1 className="mb-8 text-5xl font-light tracking-tight text-[var(--color-text)] sm:text-7xl">
        {(profile?.name || 'start').toLowerCase()}
      </h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 [&_.metro-tile]:min-h-32">
        <MetroTile color={metroColor(0)} index={0} className="col-span-2 row-span-2 min-h-64">
          <p className="text-sm opacity-80">{profile?.heroEyebrow || 'hello'}</p>
          <p className="text-3xl font-light leading-tight sm:text-4xl">{statementLines(profile).join(' ')}</p>
          <p className="text-sm">{profile?.headline}</p>
        </MetroTile>
        <MetroTile color={metroColor(1)} index={1} className="p-0">
          <Avatar profile={profile} className="absolute inset-0 size-full text-4xl" />
          <span className="absolute bottom-2 left-3 text-sm font-semibold text-white drop-shadow">me</span>
        </MetroTile>
        <MetroTile color={metroColor(2)} index={2}>
          <MapPin className="size-6" />
          <p className="text-sm">{profile?.location || 'remote'}</p>
        </MetroTile>
        <a href={profile?.email ? `mailto:${profile.email}` : '#contact'} className="contents">
          <MetroTile color={metroColor(3)} index={3}>
            <Mail className="size-6" />
            <p className="text-sm">mail</p>
          </MetroTile>
        </a>
        <MetroTile color={metroColor(4)} index={4}>
          <p className="text-4xl font-light">{technologies.length}</p>
          <p className="text-sm">technologies</p>
        </MetroTile>
        {top.map((p, i) => (
          <Link key={p._id} to={`/work/${p.slug}`} className="contents">
            <MetroTile color={metroColor(5 + i)} index={5 + i} className="col-span-2 sm:col-span-1">
              {p.thumbnail?.url && <img src={p.thumbnail.url} alt="" className="absolute inset-0 size-full object-cover opacity-40" />}
              <span />
              <p className="relative text-sm font-semibold">{p.title}</p>
            </MetroTile>
          </Link>
        ))}
        <Link to="/work" className="contents">
          <MetroTile color={metroColor(7)} index={7} className={top.length === 1 ? 'col-span-1' : 'col-span-2'}>
            <ArrowRight className="size-6" />
            <p className="text-sm">all work</p>
          </MetroTile>
        </Link>
      </div>
    </section>
  );
}

function HeroMagazine({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const issue = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 pt-12">
      <div className="flex items-center justify-between border-y-2 border-[var(--color-text)] py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text)]">
        <span>Portfolio</span>
        <span>Vol. {new Date().getFullYear() - 2000}</span>
        <span className="hidden sm:inline">{issue}</span>
      </div>
      <h1 className="mt-6 text-center text-[15vw] font-black uppercase leading-[0.85] tracking-tighter text-[var(--color-text)] lg:text-[150px]">
        {(profile?.name || 'Your Name').split(' ')[0]}
      </h1>
      <div className="mt-8 grid gap-8 border-t border-[var(--color-border)] pt-8 md:grid-cols-[1fr_1.3fr_1fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">Cover story</p>
          <p className="text-2xl font-semibold leading-snug text-[var(--color-text)]">{lines.join(' ')}</p>
        </div>
        <div className="relative">
          <Avatar profile={profile} className="aspect-[4/5] w-full text-7xl grayscale transition-all duration-500 hover:grayscale-0" />
          <span className="absolute left-3 top-3 bg-[var(--color-accent)] px-2 py-1 text-xs font-bold uppercase text-[var(--color-on-accent)]">Exclusive</span>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <p className="text-[var(--color-text-muted)] first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-[var(--color-accent)]">
            {profile?.bio || profile?.aboutText || 'Engineer, builder, and lifelong learner.'}
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)] hover:text-[var(--color-accent)]">
            Read more <ArrowDownRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function useTypewriter(words: string[], speed = 70, pause = 1400) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length] ?? '';
    const done = !deleting && text === word;
    const empty = deleting && text === '';
    const timeout = setTimeout(
      () => {
        if (done) setDeleting(true);
        else if (empty) {
          setDeleting(false);
          setIndex((i) => i + 1);
        } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      },
      done ? pause : deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, speed, pause]);

  return text;
}

function HeroTypewriter({ profile }: SectionProps) {
  const words = profile?.focusAreas?.length ? profile.focusAreas : ['web apps', 'APIs', 'AI systems', 'clean code'];
  const typed = useTypewriter(words);
  return (
    <section className="relative overflow-hidden">
      <GridGlow />
      <div className="relative mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center px-6 py-24">
        <p className="mb-6 text-lg text-[var(--color-text-muted)]">
          👋 I'm <span className="font-semibold text-[var(--color-text)]">{profile?.name || 'a developer'}</span>
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--color-text)] sm:text-7xl">
          I build
          <br />
          <span className="text-[var(--color-accent)]">{typed}</span>
          <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-1 animate-pulse bg-[var(--color-accent)]" />
        </h1>
        {profile?.bio && <p className="mt-8 max-w-2xl text-lg text-[var(--color-text-muted)]">{profile.bio}</p>}
        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </div>
      </div>
    </section>
  );
}


// ---------------------------------------------------------------------------
// Five additions. Each borrows a real mechanic from award-tier studio sites
// (spotlight-reveal type, scroll-pinned cinematic zoom, masked kinetic-type
// reveal, a genuinely draggable card deck, a magnetic CTA over a liquid
// blob) rather than another recolour of the eleven variants above — the
// point of "unique" is a different mechanic, not a different palette.
// ---------------------------------------------------------------------------

/** Spotlight reveal: the headline sits twice — a dim base copy, and a bright
 *  copy visible only inside a soft circle that follows the cursor (masked via
 *  a CSS custom property, mutated directly on the DOM node so a mousemove
 *  never triggers a React re-render). Idles through a slow figure-eight sweep
 *  when there's no pointer, so touch visitors still see the full effect. */
function HeroReveal({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const wrapRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const idling = useRef(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const start = performance.now();
    const idle = (t: number) => {
      if (idling.current) {
        const p = (t - start) / 1000;
        el.style.setProperty('--rx', `${50 + Math.sin(p * 0.6) * 32}%`);
        el.style.setProperty('--ry', `${50 + Math.sin(p * 0.9) * 26}%`);
      }
      frame.current = requestAnimationFrame(idle);
    };
    frame.current = requestAnimationFrame(idle);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    idling.current = false;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--rx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--ry', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const headline = (
    <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
      {lines.map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
    </h1>
  );

  return (
    <section
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={() => {
        idling.current = true;
      }}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-[#08080a] text-center"
      style={{ '--rx': '50%', '--ry': '42%' } as CSSProperties}
    >
      {/* Dim base layer — always faintly legible, so the section still reads
          with JS disabled or before the first paint of the spotlight. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div className="text-white/[0.06]">{headline}</div>
      </div>
      {/* Bright layer, masked to a circle riding (--rx, --ry). */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-white"
        style={{
          WebkitMaskImage: 'radial-gradient(circle 240px at var(--rx) var(--ry), #000 55%, transparent 100%)',
          maskImage: 'radial-gradient(circle 240px at var(--rx) var(--ry), #000 55%, transparent 100%)',
        }}
      >
        {headline}
      </div>
      <div className="relative z-10 mt-[26rem] flex flex-col items-center gap-6 sm:mt-[30rem]">
        {profile?.bio && <p className="max-w-lg text-balance text-white/50">{profile.bio.split('\n')[0]}</p>}
        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA className="border-white/15 text-white hover:border-white/30 hover:bg-white/5" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/25">Move to find the light</p>
      </div>
    </section>
  );
}

/** Cinematic zoom: the headline opens the section filling the screen, then
 *  scales down and settles as you scroll a pinned viewport — the "camera
 *  pulling back" beat used across Apple's product pages. The wrapper is
 *  taller than the viewport specifically so there's scroll distance for the
 *  pin to consume; the section itself never grows past one screen. */
function HeroCinematic({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.42]);
  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '-14vh']);
  const restOpacity = useTransform(scrollYProgress, [0.35, 0.7], [0, 1]);
  const restY = useTransform(scrollYProgress, [0.35, 0.75], [24, 0]);

  return (
    <div ref={ref} className="relative h-[230vh] bg-[var(--color-bg)]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <motion.h1
          style={{ scale, y }}
          className="text-balance px-6 text-center text-[13vw] font-bold leading-[0.92] tracking-tighter text-[var(--color-text)] sm:text-[9vw]"
        >
          {lines[0]}
        </motion.h1>
        <motion.div style={{ opacity: restOpacity, y: restY }} className="mt-8 flex flex-col items-center gap-6 px-6 text-center">
          {lines.slice(1).map((l) => (
            <p key={l} className="text-2xl font-medium text-[var(--color-text-muted)] sm:text-3xl">
              {l}
            </p>
          ))}
          {profile?.bio && <p className="max-w-lg text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>}
          <div className="flex flex-wrap justify-center gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Kinetic reveal: each word rises out from behind an overflow mask on its
 *  own line, the way a film title card reveals its credits — a real crop
 *  reveal (clip via `overflow-hidden` on a wrapper sized to one line), not
 *  just a fade, which is what makes it read as "motion design" rather than
 *  a delayed fade-in. */
function HeroWordReveal({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[86vh] items-center overflow-hidden">
      <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
        {profile?.heroEyebrow && (
          <div className="mb-6 overflow-hidden">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]"
            >
              {profile.heroEyebrow}
            </motion.p>
          </div>
        )}
        <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--color-text)] sm:text-7xl">
          {lines.map((line, li) => (
            <span key={line} className="block overflow-hidden py-1">
              <motion.span
                initial={{ y: '110%', rotate: 4 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ duration: 0.85, delay: 0.15 + li * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        {profile?.bio && (
          <div className="mt-6 overflow-hidden">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-xl text-balance text-[var(--color-text-muted)]"
            >
              {profile.bio.split('\n')[0]}
            </motion.p>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <PrimaryCTA />
          <SecondaryCTA />
        </motion.div>
      </div>
    </section>
  );
}

/** A physically draggable stack of recent work — drag the top card and it
 *  swipes away, promoting the next one, the way a real card-sort deck works.
 *  This is the one variant here that's genuinely interactive rather than
 *  purely decorative motion. */
function HeroDeck({ profile, projects }: SectionProps) {
  const lines = statementLines(profile);
  const deck = pickProjects(projects, 5);
  // Same lesson as elsewhere this session: an initializer only ever sees the
  // FIRST render, which happens before projects have loaded (deck is still
  // empty then) -- so this can't just seed itself once at mount, or the deck
  // permanently renders zero cards even once real data arrives.
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => {
    setOrder(deck.map((_, i) => i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.length]);

  const cycle = (dir: 1 | -1) => setOrder((o) => (dir === 1 ? [...o.slice(1), o[0]!] : [o[o.length - 1]!, ...o.slice(0, -1)]));

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[82vh] max-w-6xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          {profile?.heroEyebrow && (
            <p className="mb-5 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-accent)]">
              {profile.heroEyebrow}
            </p>
          )}
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.join(' ')}
          </h1>
          {profile?.bio && <p className="mt-6 max-w-xl text-lg text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </div>
        </div>

        {deck.length > 0 && (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
            {order.map((projectIndex, stackPos) => {
              const project = deck[projectIndex]!;
              const depth = order.length - 1 - stackPos;
              const isTop = stackPos === 0;
              return (
                <motion.div
                  key={project._id}
                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_e, info) => {
                    if (Math.abs(info.offset.x) > 90) cycle(1);
                  }}
                  animate={{ scale: 1 - depth * 0.045, y: depth * 14, rotate: depth === 0 ? 0 : (stackPos % 2 ? 1 : -1) * (depth + 1) * 1.6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  whileTap={isTop ? { cursor: 'grabbing' } : undefined}
                  className="elevated-card absolute inset-0 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card-hover)]"
                  style={{ zIndex: 10 - depth, cursor: isTop ? 'grab' : 'default' }}
                >
                  {project.thumbnail?.url && (
                    <img src={project.thumbnail.url} alt={project.title} className="pointer-events-none h-2/3 w-full object-cover" draggable={false} />
                  )}
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{project.year}</p>
                    <p className="mt-1 font-medium text-[var(--color-text)]">{project.title}</p>
                  </div>
                </motion.div>
              );
            })}
            <p className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs text-[var(--color-text-faint)]">Drag to browse the work</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** A magnetic CTA — the button visibly pulls toward the cursor within a
 *  radius and springs back when it leaves — floating over a slowly morphing
 *  liquid blob built from cycling `border-radius` keyframes. */
function MagneticButton({ children, href, primary }: { children: ReactNode; href: string; primary?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn(
        'inline-flex h-14 items-center gap-2 rounded-full px-8 text-sm font-medium transition-colors',
        primary
          ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]'
          : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-hover)]'
      )}
    >
      {children}
    </motion.a>
  );
}

function HeroLiquid({ profile }: SectionProps) {
  const lines = statementLines(profile);
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden text-center">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[65vmin] w-[65vmin] -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent)] opacity-[0.16] blur-3xl"
        animate={{
          borderRadius: [
            '62% 38% 55% 45% / 48% 55% 45% 52%',
            '45% 55% 38% 62% / 55% 45% 62% 38%',
            '55% 45% 62% 38% / 40% 60% 40% 60%',
            '62% 38% 55% 45% / 48% 55% 45% 52%',
          ],
          rotate: [0, 20, -10, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {profile?.heroEyebrow && (
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">{profile.heroEyebrow}</p>
        )}
        <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--color-text)] sm:text-7xl">
          {lines.join(' ')}
        </h1>
        {profile?.bio && <p className="mx-auto mt-6 max-w-lg text-balance text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <MagneticButton href="#contact" primary>
            Get in touch
          </MagneticButton>
          <MagneticButton href="/work">See my work</MagneticButton>
        </div>
      </div>
    </section>
  );
}


// ---------------------------------------------------------------------------
// Five more — this batch deliberately hybrids, not new standalone ideas: each
// one takes two mechanics already proven above (the terminal, the drag deck,
// the cinematic scroll-zoom, the frosted glass, the cursor-spotlight, the
// giant marquee, the bento grid) and fuses them into one coherent piece.
// The test for a hybrid earning its place: could you describe what makes it
// different in one sentence that isn't just "two things happening near each
// other"? If the fusion doesn't change how either half behaves, it isn't one.
// ---------------------------------------------------------------------------

/** Terminal + card deck: the deck itself becomes shell windows — swipe the
 *  top project away and the next one's `cat` output types into view. The
 *  drag mechanic is identical to HeroDeck; what's fused is the object being
 *  dragged (a terminal, not a photo) and its content (a command result). */
function HeroTerminalDeck({ profile, projects }: SectionProps) {
  const host = shellHost(profile);
  const deck = pickProjects(projects, 5);
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => {
    setOrder(deck.map((_, i) => i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.length]);
  const cycle = () => setOrder((o) => [...o.slice(1), o[0]!]);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[82vh] max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <Prompt host={host} cmd="whoami" />
          <p className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-5xl">
            {statementLines(profile).join(' ')}
          </p>
          {profile?.bio && <p className="mt-5 max-w-lg text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </div>
        </div>

        {deck.length > 0 && (
          <div className="relative mx-auto aspect-[5/4] w-full max-w-lg">
            {order.map((projectIndex, stackPos) => {
              const project = deck[projectIndex]!;
              const depth = order.length - 1 - stackPos;
              const isTop = stackPos === 0;
              return (
                <motion.div
                  key={project._id}
                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_e, info) => {
                    if (Math.abs(info.offset.x) > 90) cycle();
                  }}
                  animate={{ scale: 1 - depth * 0.04, y: depth * 12, rotate: depth === 0 ? 0 : (stackPos % 2 ? 1 : -1) * (depth + 1) * 1.4 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="absolute inset-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] font-mono text-sm shadow-[var(--shadow-card-hover)]"
                  style={{ zIndex: 10 - depth, cursor: isTop ? 'grab' : 'default' }}
                >
                  <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-4 py-3">
                    <span className="size-3 rounded-full bg-[#ff5f57]" />
                    <span className="size-3 rounded-full bg-[#febc2e]" />
                    <span className="size-3 rounded-full bg-[#28c840]" />
                    <span className="ml-2 truncate text-xs text-[var(--color-text-faint)]">guest@{host}: ~/work</span>
                  </div>
                  <div className="space-y-2 p-5">
                    {isTop && <Prompt host={host} cmd={`cat ${project.slug}.json`} />}
                    <TerminalOutput>
                      <p className="text-[var(--color-accent)]">"{project.title}"</p>
                      <p className="mt-1 text-xs text-[var(--color-text-faint)]">year: {project.year}</p>
                      <p className="mt-2 text-[var(--color-text-muted)]">{project.shortDescription}</p>
                    </TerminalOutput>
                  </div>
                </motion.div>
              );
            })}
            <p className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs text-[var(--color-text-faint)]">Drag to run the next file</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Cinematic zoom + card deck: the giant title still pulls back on scroll,
 *  but this time it settles beside — not above — a draggable stack, which
 *  fades and rises into place exactly as the zoom completes, so the deck
 *  reads as the thing the camera was pulling back to reveal. */
function HeroCinematicStack({ profile, projects }: SectionProps) {
  const lines = statementLines(profile);
  const deck = pickProjects(projects, 4);
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => {
    setOrder(deck.map((_, i) => i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.length]);
  const cycle = () => setOrder((o) => [...o.slice(1), o[0]!]);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const deckOpacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
  const deckX = useTransform(scrollYProgress, [0.4, 0.85], [40, 0]);

  return (
    <div ref={ref} className="relative h-[220vh] bg-[var(--color-bg)]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <motion.h1
          style={{ scale, x }}
          className="pointer-events-none absolute text-balance text-center text-[11vw] font-bold leading-[0.95] tracking-tighter text-[var(--color-text)] sm:text-[7vw]"
        >
          {lines[0]}
        </motion.h1>

        {deck.length > 0 && (
          <motion.div style={{ opacity: deckOpacity, x: deckX }} className="relative ml-[38%] aspect-[4/5] w-full max-w-xs sm:ml-[32%]">
            {order.map((projectIndex, stackPos) => {
              const project = deck[projectIndex]!;
              const depth = order.length - 1 - stackPos;
              const isTop = stackPos === 0;
              return (
                <motion.div
                  key={project._id}
                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_e, info) => {
                    if (Math.abs(info.offset.x) > 90) cycle();
                  }}
                  animate={{ scale: 1 - depth * 0.045, y: depth * 14, rotate: depth === 0 ? 0 : (stackPos % 2 ? 1 : -1) * (depth + 1) * 1.6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="elevated-card absolute inset-0 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card-hover)]"
                  style={{ zIndex: 10 - depth, cursor: isTop ? 'grab' : 'default' }}
                >
                  {project.thumbnail?.url && <img src={project.thumbnail.url} alt={project.title} className="pointer-events-none h-2/3 w-full object-cover" draggable={false} />}
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-faint)]">{project.year}</p>
                    <p className="mt-1 font-medium text-[var(--color-text)]">{project.title}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Glassmorphism + card deck: the frosted card is replaced by a draggable
 *  stack of frosted cards, still floating over the same slow colour blobs —
 *  so the material stays identical, only "one static panel" becomes
 *  "several you can move through." */
function HeroGlassDeck({ profile, projects }: SectionProps) {
  const deck = pickProjects(projects, 5);
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => {
    setOrder(deck.map((_, i) => i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.length]);
  const cycle = () => setOrder((o) => [...o.slice(1), o[0]!]);

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden px-6 py-24">
      <motion.div
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[8%] top-[12%] size-[420px] rounded-full bg-[var(--color-accent)] opacity-40 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[5%] right-[8%] size-[380px] rounded-full bg-[var(--color-accent-strong)] opacity-35 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex items-center gap-4">
            <Avatar profile={profile} className="size-14 rounded-full text-lg" />
            <div>
              <p className="font-semibold text-[var(--color-text)]">{profile?.name}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{profile?.headline}</p>
            </div>
          </div>
          <h1 className="mt-8 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-5xl">
            {statementLines(profile).join(' ')}
          </h1>
          <div className="mt-9 flex flex-wrap gap-3">
            <PrimaryCTA />
            <SecondaryCTA className="bg-[var(--color-bg)]/40" />
          </div>
        </div>

        {deck.length > 0 && (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs">
            {order.map((projectIndex, stackPos) => {
              const project = deck[projectIndex]!;
              const depth = order.length - 1 - stackPos;
              const isTop = stackPos === 0;
              return (
                <motion.div
                  key={project._id}
                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_e, info) => {
                    if (Math.abs(info.offset.x) > 90) cycle();
                  }}
                  animate={{ scale: 1 - depth * 0.04, y: depth * 12, rotate: depth === 0 ? 0 : (stackPos % 2 ? 1 : -1) * (depth + 1) * 1.4 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="absolute inset-0 overflow-hidden rounded-3xl border border-white/15 bg-[var(--color-bg-elevated)]/40 shadow-2xl backdrop-blur-2xl"
                  style={{ zIndex: 10 - depth, cursor: isTop ? 'grab' : 'default' }}
                >
                  {/* Glass is translucent by design, so a card's own text was
                      showing straight through to the ones behind it, all at
                      the same spot -- an unreadable overlap. Only the top
                      card gets its label; the ones behind stay a wordless
                      frosted hint of depth, which is what a real stack of
                      glass panes actually looks like from the front. */}
                  {project.thumbnail?.url && (
                    <img
                      src={project.thumbnail.url}
                      alt={project.title}
                      className={cn('pointer-events-none h-2/3 w-full object-cover', !isTop && 'opacity-40 blur-[1px]')}
                      draggable={false}
                    />
                  )}
                  {isTop && (
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-widest text-white/50">{project.year}</p>
                      <p className="mt-1 font-medium text-white">{project.title}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
            <p className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs text-[var(--color-text-faint)]">Drag to browse the work</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Spotlight reveal + bento: the same info tiles as HeroBento, but dimmed at
 *  rest, each individually lit only where the cursor's soft circle passes
 *  over it — the grid stays fully legible without a pointer (a low resting
 *  opacity, not zero), the spotlight is what adds detail, not what unlocks it. */
function HeroSpotlightBento({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  const tile =
    'relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-[background-color] duration-300';

  return (
    <section
      ref={wrapRef}
      onMouseMove={onMove}
      className="relative mx-auto max-w-6xl px-6 pt-10"
      style={{ '--sx': '50%', '--sy': '30%' } as CSSProperties}
    >
      {/* One shared spotlight wash sitting above the tiles, screened so it
          only ever brightens, letting each tile's own content show through
          unchanged underneath. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle 260px at var(--sx) var(--sy), color-mix(in srgb, var(--color-accent) 35%, transparent), transparent 70%)',
        }}
      />
      <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${tile} flex flex-col justify-between sm:col-span-2 lg:row-span-2`}>
          {profile?.heroEyebrow && <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">{profile.heroEyebrow}</p>}
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
            {lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h1>
          {profile?.bio && <p className="mt-4 text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryCTA className="h-11" />
            <SecondaryCTA className="h-11" />
          </div>
        </div>
        <div className={`${tile} p-0 lg:row-span-2`}>
          <Avatar profile={profile} className="size-full min-h-[280px] text-6xl" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <p className="font-semibold text-white">{profile?.name}</p>
            {profile?.headline && <p className="text-sm text-white/75">{profile.headline}</p>}
          </div>
        </div>
        <div className={`${tile} flex flex-col justify-between`}>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            <span className="size-2 animate-pulse rounded-full bg-[var(--color-accent)]" /> Status
          </p>
          <p className="text-lg font-medium text-[var(--color-text)]">{profile?.availability || 'Open to opportunities'}</p>
        </div>
        <div className={`${tile} flex flex-col justify-between`}>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            <MapPin className="size-3.5" /> Based in
          </p>
          <p className="text-lg font-medium text-[var(--color-text)]">{profile?.location || 'Remote'}</p>
        </div>
      </div>
      <p className="relative z-10 mt-4 text-center text-xs text-[var(--color-text-faint)]">Move to light up the grid</p>
    </section>
  );
}

/** Marquee + spotlight beams: the same giant scrolling name as HeroMarquee,
 *  crossed by two slow rotating light beams (Aurora's device, reused) so the
 *  wall of type reads as something being swept by a searchlight rather than
 *  a static banner. */
function HeroBeaconMarquee({ profile }: SectionProps) {
  const name = (profile?.name || 'Your Name').toUpperCase();
  const row = Array.from({ length: 4 }, () => name).join(' — ');
  return (
    <section className="relative overflow-hidden bg-[#08080a] py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute left-1/2 top-1/2 h-[140vmax] w-40 origin-top -translate-x-1/2 -translate-y-full bg-gradient-to-b from-[var(--color-accent)]/25 via-[var(--color-accent)]/5 to-transparent blur-2xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[140vmax] w-24 origin-top -translate-x-1/2 -translate-y-full bg-gradient-to-b from-[var(--color-accent-strong)]/20 via-[var(--color-accent-strong)]/5 to-transparent blur-2xl"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {profile?.heroEyebrow && <p className="mb-6 font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]">{profile.heroEyebrow}</p>}
      </div>
      <div className="relative flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((k) => (
          <span key={k} className="pr-8 text-[18vw] font-black leading-none tracking-tighter text-white sm:text-[12vw]">
            {row} —
          </span>
        ))}
      </div>
      <div className="relative flex w-max animate-[marquee_40s_linear_infinite_reverse] whitespace-nowrap">
        {[0, 1].map((k) => (
          <span
            key={k}
            className="pr-8 text-[18vw] font-black leading-none tracking-tighter text-transparent sm:text-[12vw]"
            style={{ WebkitTextStroke: '1.5px var(--color-accent)' }}
          >
            {row} —
          </span>
        ))}
      </div>
      <div className="relative mx-auto mt-12 flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-xl text-balance text-xl text-white/60">{statementLines(profile).join(' ')}</p>
        <div className="flex gap-3">
          <PrimaryCTA />
          <SecondaryCTA className="border-white/15 text-white hover:border-white/30 hover:bg-white/5" />
        </div>
      </div>
    </section>
  );
}


// ---------------------------------------------------------------------------
// Five more, this time each anchored to something genuinely current rather
// than an idea I made up: Apple's "Liquid Glass" material (their 2025 system-
// wide redesign — specular highlights that move with the pointer, not a
// static frosted panel), true multi-stop mesh gradients (the look behind most
// 2025 SaaS landing pages, distinct from a two-blob blur), a text-masked
// image reveal (bold type as a window onto a photo, an editorial staple this
// year), the Y2K/chrome revival (glossy holographic surfaces, back in a big
// way), and a generative flow-field background (the "creative-dev portfolio"
// look — drifting hand-drawn-feeling lines, not a stock particle system).
// Each is still a mix: the trend supplies the material, an existing mechanic
// supplies the structure it's applied to.
// ---------------------------------------------------------------------------

/** A true mesh gradient — five soft colour stops drifting independently,
 *  not two blurred circles — sitting under Apple's "Liquid Glass" material:
 *  a translucent panel whose specular highlight is a bright diagonal band
 *  that slides to meet the cursor, the way real refractive glass catches
 *  light differently depending on where you look at it from. */
function HeroLiquidGlass({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const panelRef = useRef<HTMLDivElement>(null);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* The mesh: five stops, each drifting on its own slow independent
          loop so the blend between them never repeats in an obvious cycle. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[
          { color: 'var(--color-accent)', pos: '18% 24%', size: '60vmax', dur: 19, o: 0.34, hue: 0 },
          { color: 'var(--color-accent-strong)', pos: '82% 20%', size: '54vmax', dur: 23, o: 0.32, hue: -35 },
          { color: 'var(--color-accent)', pos: '75% 78%', size: '58vmax', dur: 27, o: 0.3, hue: 95 },
          { color: 'var(--color-accent-strong)', pos: '22% 82%', size: '52vmax', dur: 21, o: 0.36, hue: 165 },
          { color: 'var(--color-accent)', pos: '50% 50%', size: '65vmax', dur: 31, o: 0.24, hue: -110 },
        ].map((blob, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[160px]"
            style={{
              background: blob.color,
              width: blob.size,
              height: blob.size,
              left: blob.pos.split(' ')[0],
              top: blob.pos.split(' ')[1],
              translate: '-50% -50%',
              opacity: blob.o,
              filter: `hue-rotate(${blob.hue}deg) saturate(1.6)`,
            }}
            animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
            transition={{ duration: blob.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <motion.div
        ref={panelRef}
        onMouseMove={onMove}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/20 p-10 text-center shadow-2xl sm:p-16"
        style={
          {
            '--gx': '30%',
            '--gy': '20%',
            background: 'color-mix(in srgb, var(--color-bg-elevated) 38%, transparent)',
            backdropFilter: 'blur(28px) saturate(160%)',
          } as CSSProperties
        }
      >
        {/* The refraction: a bright sheen that tracks the cursor, plus a
            faint fixed rim-light along the top edge — glass always keeps
            some highlight even when nothing is pointing at it. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: 'radial-gradient(420px circle at var(--gx) var(--gy), rgba(255,255,255,0.22), transparent 60%)' }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
        />
        <div className="relative">
          {profile?.heroEyebrow && (
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">{profile.heroEyebrow}</p>
          )}
          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-text)] sm:text-6xl">
            {lines.join(' ')}
          </h1>
          {profile?.bio && <p className="mx-auto mt-5 max-w-lg text-balance text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <PrimaryCTA />
            <SecondaryCTA className="bg-white/5" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** A text-masked image reveal: the headline is cut as a window onto a slowly
 *  panning photo (your own, if there's one uploaded — otherwise a moving
 *  gradient stands in), finished with a pass of real film grain. The
 *  editorial trick this year is restraint: one enormous cutout, nothing
 *  competing with it. */
function HeroTextMask({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const photo = profile?.profileImage?.url;
  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-[#08080a] py-20 text-center">
      <div className="grain relative mx-auto w-full max-w-6xl px-6">
        <h1 className="text-balance text-[15vw] font-black uppercase leading-[0.88] tracking-tighter sm:text-[10vw]">
          {lines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block bg-clip-text text-transparent"
              style={
                photo
                  ? { backgroundImage: `url(${photo})`, backgroundSize: '140% 140%', backgroundPosition: `${20 + i * 15}% 40%` }
                  : { backgroundImage: 'linear-gradient(120deg, var(--color-accent), var(--color-accent-strong), var(--color-text))', backgroundSize: '220% 220%' }
              }
            >
              {line}
            </motion.span>
          ))}
        </h1>
        {profile?.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative z-10 mx-auto mt-8 max-w-lg text-balance text-white/55"
          >
            {profile.bio.split('\n')[0]}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="relative z-10 mt-9 flex flex-wrap justify-center gap-3"
        >
          <PrimaryCTA />
          <SecondaryCTA className="border-white/15 text-white hover:border-white/30 hover:bg-white/5" />
        </motion.div>
      </div>
    </section>
  );
}

/** Bento, but every tile carries its own quiet mesh-gradient wash and a pass
 *  of grain — the specific look behind most 2025 SaaS landing pages, where
 *  a "flat" info grid is actually never flat: each card has its own soft,
 *  slightly-off-palette colour field underneath the content. */
function HeroMeshBento({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const tile = 'grain relative overflow-hidden rounded-2xl border border-[var(--color-border)] p-6';
  const wash = (pos: string) => ({ background: `radial-gradient(120% 100% at ${pos}, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 65%), var(--color-bg-elevated)` });

  return (
    <section className="mx-auto max-w-6xl px-6 pt-10">
      <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`${tile} flex flex-col justify-between sm:col-span-2 lg:row-span-2`} style={wash('20% 10%')}>
          <div className="relative">
            {profile?.heroEyebrow && <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">{profile.heroEyebrow}</p>}
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-4xl">
              {lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h1>
            {profile?.bio && <p className="mt-4 text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>}
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <PrimaryCTA className="h-11" />
            <SecondaryCTA className="h-11" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`${tile} p-0 lg:row-span-2`} style={wash('80% 90%')}>
          <Avatar profile={profile} className="size-full min-h-[280px] text-6xl" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <p className="font-semibold text-white">{profile?.name}</p>
            {profile?.headline && <p className="text-sm text-white/75">{profile.headline}</p>}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${tile} flex flex-col justify-between`} style={wash('10% 90%')}>
          <p className="relative flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            <span className="size-2 animate-pulse rounded-full bg-[var(--color-accent)]" /> Status
          </p>
          <p className="relative text-lg font-medium text-[var(--color-text)]">{profile?.availability || 'Open to opportunities'}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={`${tile} flex flex-col justify-between`} style={wash('90% 10%')}>
          <p className="relative flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            <MapPin className="size-3.5" /> Based in
          </p>
          <p className="relative text-lg font-medium text-[var(--color-text)]">{profile?.location || 'Remote'}</p>
        </motion.div>
      </div>
    </section>
  );
}

/** Y2K / chrome revival + the drag deck: glossy holographic cards, a
 *  moving specular streak instead of a flat highlight, chunky rounded type —
 *  the metallic-and-bubbly look currently coming back hard after a decade of
 *  flat design, applied to the interaction people already responded well to. */
function HeroChromeDeck({ profile, projects }: SectionProps) {
  const lines = statementLines(profile);
  const deck = pickProjects(projects, 5);
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => {
    setOrder(deck.map((_, i) => i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.length]);
  const cycle = () => setOrder((o) => [...o.slice(1), o[0]!]);

  return (
    <section className="relative overflow-hidden bg-[#0a0a0d] py-24">
      <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl">
            {lines.join(' ')}
          </h1>
          {profile?.bio && <p className="mt-6 max-w-lg text-lg text-white/55">{profile.bio.split('\n')[0]}</p>}
          <div className="mt-9 flex flex-wrap gap-3">
            <PrimaryCTA />
            <SecondaryCTA className="border-white/15 text-white hover:border-white/30 hover:bg-white/5" />
          </div>
        </div>

        {deck.length > 0 && (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs">
            {order.map((projectIndex, stackPos) => {
              const project = deck[projectIndex]!;
              const depth = order.length - 1 - stackPos;
              const isTop = stackPos === 0;
              return (
                <motion.div
                  key={project._id}
                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_e, info) => {
                    if (Math.abs(info.offset.x) > 90) cycle();
                  }}
                  animate={{ scale: 1 - depth * 0.04, y: depth * 12, rotate: depth === 0 ? 0 : (stackPos % 2 ? 1 : -1) * (depth + 1) * 1.5 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl"
                  style={{
                    zIndex: 10 - depth,
                    cursor: isTop ? 'grab' : 'default',
                    background: 'linear-gradient(155deg, #f4f4f8 0%, #c9cdd8 22%, #8a90a3 38%, #f0f1f5 52%, #a3a8ba 68%, #eceef2 85%, #babed0 100%)',
                    border: '1px solid rgba(255,255,255,0.6)',
                  }}
                >
                  {isTop && (
                    <motion.div
                      className="pointer-events-none absolute inset-y-0 w-1/3 bg-white/50 blur-lg"
                      animate={{ left: ['-40%', '140%'] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.4 }}
                    />
                  )}
                  {project.thumbnail?.url && (
                    <div className="absolute inset-3 overflow-hidden rounded-[1.6rem] border border-black/10">
                      <img src={project.thumbnail.url} alt={project.title} className="pointer-events-none h-full w-full object-cover" draggable={false} />
                    </div>
                  )}
                  {isTop && (
                    <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/55 p-3 backdrop-blur">
                      <p className="text-xs uppercase tracking-widest text-white/60">{project.year}</p>
                      <p className="font-semibold text-white">{project.title}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
            <p className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs text-white/40">Drag to browse the work</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** A generative flow field: dozens of long, gently curved strokes drifting
 *  sideways at slightly different speeds — the hand-drawn-feeling ambient
 *  motion behind a lot of current creative-developer portfolios — behind
 *  spare, centred type. */
function HeroFlowField({ profile }: SectionProps) {
  const lines = statementLines(profile);
  const strands = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const y = 4 + (i / 25) * 92;
        const wobble = 6 + (i % 5) * 3;
        const duration = 26 + (i % 7) * 6;
        return { y, wobble, duration, delay: -(i * 1.7), reverse: i % 2 === 0 };
      }),
    []
  );

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[var(--color-bg)] text-center">
      <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {strands.map((s, i) => (
          <motion.path
            key={i}
            d={`M -10 ${s.y} Q 25 ${s.y - s.wobble} 50 ${s.y} T 110 ${s.y}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={i % 4 === 0 ? '0.35' : '0.2'}
            strokeOpacity={i % 4 === 0 ? 0.55 : 0.28}
            vectorEffect="non-scaling-stroke"
            animate={{ x: s.reverse ? [0, -8, 0] : [0, 8, 0] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {profile?.heroEyebrow && (
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-faint)]">{profile.heroEyebrow}</p>
        )}
        <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--color-text)] sm:text-7xl">
          {lines.join(' ')}
        </h1>
        {profile?.bio && <p className="mx-auto mt-6 max-w-lg text-balance text-[var(--color-text-muted)]">{profile.bio.split('\n')[0]}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryCTA />
          <SecondaryCTA />
        </div>
      </div>
    </section>
  );
}

export const HERO_VARIANTS: SectionVariant[] = [
  { id: 'aurora', name: 'Aurora', description: 'Spotlight beams, cursor glow, pixel-art portrait.', Component: HeroAurora },
  { id: 'split', name: 'Split + stats', description: 'Text left, framed photo right, stat counters.', Component: HeroSplit },
  { id: 'centered', name: 'Centered spotlight', description: 'Avatar, gradient headline, spotlight beam.', Component: HeroCentered },
  { id: 'glass', name: 'Glassmorphism', description: 'Frosted card floating over moving color blobs.', Component: HeroGlass },
  { id: 'typewriter', name: 'Typewriter', description: '"I build …" typing through your focus areas.', Component: HeroTypewriter },
  { id: 'marquee', name: 'Giant marquee', description: 'Your name scrolling huge across the screen.', Component: HeroMarquee },
  { id: 'magazine', name: 'Magazine cover', description: 'Masthead, cover story, drop-cap intro.', Component: HeroMagazine },
  { id: 'bento', name: 'Bento', description: 'Intro, photo, status and location as tiles.', Component: HeroBento },
  { id: 'metro', name: 'Metro tiles', description: 'Windows-style flat live tiles.', Component: HeroMetro },
  { id: 'minimal', name: 'Minimal', description: 'Editorial type, text links, no effects.', Component: HeroMinimal },
  { id: 'terminal', name: 'Terminal', description: '`whoami` in a shell window.', Component: HeroTerminal },
  { id: 'reveal', name: 'Spotlight reveal ✦', description: 'The headline is hidden in the dark; a soft light follows your cursor to find it.', Component: HeroReveal },
  { id: 'cinematic', name: 'Cinematic zoom ✦', description: 'A giant title fills the screen, then pulls back into the full scene as you scroll — the Apple keynote move.', Component: HeroCinematic },
  { id: 'word-reveal', name: 'Kinetic reveal ✦', description: 'Each line rises out from behind a hard crop, like a film title card.', Component: HeroWordReveal },
  { id: 'deck', name: 'Card deck ✦', description: 'Recent work as a physical stack of cards — drag the top one to swipe it away.', Component: HeroDeck },
  { id: 'liquid', name: 'Liquid + magnetic ✦', description: 'A slowly morphing blob behind the headline; the buttons pull toward your cursor.', Component: HeroLiquid },
  { id: 'terminal-deck', name: 'Terminal deck ✦', description: 'Terminal × card deck: swipe through project shell windows, each one’s `cat` output typed fresh.', Component: HeroTerminalDeck },
  { id: 'cinematic-stack', name: 'Cinematic stack ✦', description: 'Cinematic zoom × card deck: the title pulls back on scroll to reveal a draggable stack of work beside it.', Component: HeroCinematicStack },
  { id: 'glass-deck', name: 'Glass deck ✦', description: 'Glassmorphism × card deck: frosted project cards you can swipe through, floating over slow colour blobs.', Component: HeroGlassDeck },
  { id: 'spotlight-bento', name: 'Spotlight bento ✦', description: 'Bento × spotlight reveal: the info grid is dimmed at rest and lights up wherever your cursor passes.', Component: HeroSpotlightBento },
  { id: 'beacon-marquee', name: 'Beacon marquee ✦', description: 'Marquee × spotlight beams: your giant scrolling name, swept by two slow rotating searchlights.', Component: HeroBeaconMarquee },
  { id: 'liquid-glass', name: 'Liquid glass ✦', description: 'Apple’s Liquid Glass material — a specular sheen that tracks your cursor — over a true five-stop mesh gradient.', Component: HeroLiquidGlass },
  { id: 'text-mask', name: 'Text mask ✦', description: 'Enormous type cut as a window onto your own photo, finished with real film grain.', Component: HeroTextMask },
  { id: 'mesh-bento', name: 'Mesh bento ✦', description: 'Bento × mesh gradient: every tile carries its own quiet colour wash and grain — the 2025 SaaS-hero look.', Component: HeroMeshBento },
  { id: 'chrome-deck', name: 'Chrome deck ✦', description: 'The Y2K chrome revival × card deck: glossy holographic cards with a moving specular streak.', Component: HeroChromeDeck },
  { id: 'flow-field', name: 'Flow field ✦', description: 'A generative field of drifting hand-drawn-feeling strands behind spare, centred type.', Component: HeroFlowField },
];
