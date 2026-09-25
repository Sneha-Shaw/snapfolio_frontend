import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Mail, MapPin } from 'lucide-react';
import { Hero as AuroraHero } from '@/components/home/Hero';
import { GridGlow } from '@/components/aceternity/GridGlow';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { useTheme } from '@/context/ThemeContext';
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
];
