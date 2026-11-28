import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, Layers, Quote, Rocket, Sparkles, Zap } from 'lucide-react';
import { TextGenerateEffect } from '@/components/aceternity/TextGenerateEffect';
import { BackgroundLines } from '@/components/aceternity/BackgroundLines';
import { DraggableCardBody, DraggableCardContainer } from '@/components/aceternity/DraggableCard';
import { AboutCard } from '@/components/home/AboutCard';
import {
  Avatar,
  Heading,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  cardClass,
  metroColor,
  yearsOfExperience,
  type SectionProps,
  type SectionVariant,
} from './shared';

const FALLBACK_ABOUT = 'I design and build software end to end — from data models and APIs to polished interfaces.';
const FEATURE_ICONS = [Code2, Layers, Cpu, Rocket, Zap, Sparkles];

function aboutText(props: SectionProps) {
  return props.profile?.aboutText || props.profile?.bio || FALLBACK_ABOUT;
}

function AboutAurora(props: SectionProps) {
  const { profile } = props;
  const [inView, setInView] = useState(false);
  const text = aboutText(props);
  return (
    <Section>
      <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">About</p>
          {inView ? (
            <TextGenerateEffect words={text} className="text-balance text-xl leading-relaxed" duration={0.4} />
          ) : (
            <p className="text-balance text-xl leading-relaxed text-transparent">{text}</p>
          )}
        </motion.div>
        {profile?.profileImage?.url && (
          <Reveal delay={0.1} className="mx-auto shrink-0 lg:mx-0">
            <AboutCard imageUrl={profile.profileImage.url} name={profile.name || 'Profile photo'} />
          </Reveal>
        )}
      </div>
    </Section>
  );
}

function AboutFocusLines({ profile }: SectionProps) {
  const areas = profile?.focusAreas ?? [];
  if (areas.length === 0) return null;
  return (
    <Section className="py-16">
      <BackgroundLines className="opacity-70" />
      <p className="relative mb-5 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">Focus areas</p>
      <div className="relative flex flex-wrap gap-2">
        {areas.map((area) => (
          <span key={area} className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-sm text-[var(--color-text-muted)]">
            {area}
          </span>
        ))}
      </div>
    </Section>
  );
}

function AboutMinimal(props: SectionProps) {
  const areas = props.profile?.focusAreas ?? [];
  return (
    <section className="mx-auto max-w-4xl px-6">
      <Reveal className="grid gap-6 border-t border-[var(--color-border)] py-14 md:grid-cols-[180px_1fr] md:gap-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)]">About</h2>
        <div>
          <p className="text-balance text-xl leading-relaxed text-[var(--color-text)]">{aboutText(props)}</p>
          {areas.length > 0 && <p className="mt-6 text-sm text-[var(--color-text-muted)]">Focused on {areas.join(' · ')}</p>}
        </div>
      </Reveal>
    </section>
  );
}

function AboutSplitPhoto(props: SectionProps) {
  const { profile } = props;
  return (
    <Section wide>
      <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="relative">
          <div className="absolute -bottom-4 -right-4 size-full rounded-2xl bg-[var(--color-accent-soft)]" />
          <Avatar profile={profile} className="relative aspect-square w-full rounded-2xl text-7xl" />
        </Reveal>
        <Reveal delay={0.1}>
          <Heading eyebrow="About me" title={profile?.name ? `Hey, I'm ${profile.name.split(' ')[0]}.` : 'About me'} className="mb-6" />
          <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">{aboutText(props)}</p>
          {!!profile?.focusAreas?.length && (
            <div className="mt-8 flex flex-wrap gap-2">
              {profile.focusAreas.map((a) => (
                <span key={a} className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--color-accent)]">
                  {a}
                </span>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

function AboutQuote(props: SectionProps) {
  const { profile } = props;
  return (
    <Section className="py-28">
      <Reveal className="relative text-center">
        <Quote className="mx-auto mb-8 size-12 text-[var(--color-accent)]" />
        <blockquote className="text-balance text-2xl font-medium leading-snug tracking-tight text-[var(--color-text)] sm:text-4xl">
          “{aboutText(props)}”
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Avatar profile={profile} className="size-11 rounded-full text-sm" />
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--color-text)]">{profile?.name}</p>
            <p className="text-xs text-[var(--color-text-faint)]">{profile?.headline}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function AboutFeatureCards(props: SectionProps) {
  const areas = props.profile?.focusAreas?.length ? props.profile.focusAreas : ['Full-stack', 'APIs', 'Performance'];
  return (
    <Section wide>
      <Heading eyebrow="What I do" title="About" align="center" />
      <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-[var(--color-text-muted)]">{aboutText(props)}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, i) => {
          const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]!;
          return (
            <Reveal key={area} delay={i * 0.06} className={`${cardClass} group p-6`}>
              <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)] transition-transform group-hover:scale-110">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold text-[var(--color-text)]">{area}</h3>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function AboutStats(props: SectionProps) {
  const { projects, experiences, technologies } = props;
  const stats = [
    { value: `${yearsOfExperience(experiences)}+`, label: 'Years of experience' },
    { value: projects.length, label: 'Projects' },
    { value: new Set(experiences.map((e) => e.company)).size, label: 'Companies' },
    { value: technologies.length, label: 'Technologies' },
  ];
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <Heading eyebrow="About" title="A bit about me" className="mb-6" />
          <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">{aboutText(props)}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className={`${cardClass} flex flex-col justify-end p-6`}>
              <p className="text-4xl font-bold tracking-tight text-[var(--color-accent)] sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function AboutFacts(props: SectionProps) {
  const { profile } = props;
  const facts = [
    ['Based in', profile?.location],
    ['Currently', profile?.heroCurrently],
    ['Availability', profile?.availability],
    ['Timezone', profile?.heroTimezone],
    ['Focus', profile?.focusAreas?.join(', ')],
  ].filter(([, v]) => v) as [string, string][];
  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <Heading eyebrow="About" title="The short version" className="mb-6" />
          <p className="leading-relaxed text-[var(--color-text-muted)]">{aboutText(props)}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-sm text-[var(--color-text-faint)]">{k}</dt>
                <dd className="text-right text-[var(--color-text)]">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

function AboutPolaroid(props: SectionProps) {
  const { profile } = props;
  return (
    <Section wide>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <DraggableCardContainer className="flex min-h-[420px] items-center justify-center">
          <DraggableCardBody rotate={-4} className="w-72 bg-white p-3 pb-12 text-neutral-900 shadow-2xl">
            <Avatar profile={profile} className="aspect-square w-full text-6xl" />
            <p className="mt-4 text-center font-[cursive] text-lg">{profile?.name?.split(' ')[0] || 'me'} ✌️</p>
          </DraggableCardBody>
        </DraggableCardContainer>
        <Reveal>
          <Heading eyebrow="About" title="Nice to meet you" className="mb-6" />
          <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">{aboutText(props)}</p>
          <p className="mt-6 text-xs text-[var(--color-text-faint)]">(psst — drag the photo)</p>
        </Reveal>
      </div>
    </Section>
  );
}

function AboutMetro(props: SectionProps) {
  const areas = props.profile?.focusAreas ?? [];
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">about</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 [&_.metro-tile]:min-h-32">
        <MetroTile color={metroColor(1)} className="col-span-2 row-span-2 min-h-64">
          <span className="text-sm opacity-80">bio</span>
          <p className="text-lg leading-relaxed">{aboutText(props)}</p>
        </MetroTile>
        {areas.slice(0, 4).map((a, i) => (
          <MetroTile key={a} color={metroColor(i + 2)} index={i + 1}>
            <Sparkles className="size-5" />
            <p className="text-base font-semibold">{a}</p>
          </MetroTile>
        ))}
      </div>
    </section>
  );
}

function AboutTerminal(props: SectionProps) {
  const areas = props.profile?.focusAreas ?? [];
  return (
    <TerminalSection profile={props.profile} cmd="cat about.md">
      <p className="whitespace-pre-line">{aboutText(props)}</p>
      {areas.length > 0 && (
        <p className="mt-3">
          <span className="text-[var(--color-text-faint)]">focus: </span>[{areas.map((f) => `"${f}"`).join(', ')}]
        </p>
      )}
    </TerminalSection>
  );
}

export const ABOUT_VARIANTS: SectionVariant[] = [
  { id: 'aurora', name: 'Aurora', description: 'Word-by-word reveal with a 3D tilting photo card.', Component: AboutAurora },
  { id: 'split-photo', name: 'Split with photo', description: 'Large offset photo, greeting, focus chips.', Component: AboutSplitPhoto },
  { id: 'stats', name: 'Stats', description: 'Your story next to big number counters.', Component: AboutStats },
  { id: 'feature-cards', name: 'Feature cards', description: 'Focus areas as icon cards under a centered intro.', Component: AboutFeatureCards },
  { id: 'quote', name: 'Pull quote', description: 'Your about text as a big centered quote.', Component: AboutQuote },
  { id: 'facts', name: 'Quick facts', description: 'Intro plus a tidy key/value fact list.', Component: AboutFacts },
  { id: 'polaroid', name: 'Polaroid', description: 'A draggable polaroid of you beside the text.', Component: AboutPolaroid },
  { id: 'focus-lines', name: 'Focus chips', description: 'Just your focus areas over flowing lines.', Component: AboutFocusLines },
  { id: 'metro', name: 'Metro tiles', description: 'Bio tile with a tile per focus area.', Component: AboutMetro },
  { id: 'minimal', name: 'Minimal', description: 'Label on the left, text on the right.', Component: AboutMinimal },
  { id: 'terminal', name: 'Terminal', description: '`cat about.md`.', Component: AboutTerminal },
];
