import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TechMarquee } from '@/components/tech/TechMarquee';
import { TechBadge } from '@/components/tech/TechBadge';
import { getTechIcon } from '@/lib/techIcons';
import { cn } from '@/utils/cn';
import type { Technology } from '@/types/models';
import {
  Heading,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  cardClass,
  groupTech,
  metroColor,
  type SectionProps,
  type SectionVariant,
} from './shared';

function TechIcon({ tech, className }: { tech: Technology; className?: string }) {
  const Icon = getTechIcon(tech.icon || tech.slug, tech.category);
  return <Icon className={className} />;
}

function SkillsMarquee({ technologies }: SectionProps) {
  return <TechMarquee technologies={technologies} />;
}

function SkillsBadges({ technologies }: SectionProps) {
  if (technologies.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Toolbox" title="Tech I work with" />
      <Reveal className="flex flex-wrap gap-2">
        {technologies.map((t) => (
          <TechBadge key={t._id} technology={t} className="px-4 py-2 text-sm" />
        ))}
      </Reveal>
    </Section>
  );
}

function SkillsCategories({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;
  return (
    <Section wide>
      <Heading eyebrow="Skills" title="What I work with" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <Reveal key={g.cat} delay={i * 0.05} className={`${cardClass} p-6`}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">{g.label}</h3>
            <ul className="space-y-2.5">
              {g.items.map((t) => (
                <li key={t._id} className="flex items-center gap-2.5 text-sm text-[var(--color-text)]">
                  <TechIcon tech={t} className="size-4 text-[var(--color-text-muted)]" />
                  {t.name}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SkillsIconGrid({ technologies }: SectionProps) {
  if (technologies.length === 0) return null;
  return (
    <Section wide>
      <Heading eyebrow="Stack" title="Tools of the trade" align="center" />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {technologies.map((t, i) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i, 18) * 0.03 }}
            whileHover={{ y: -4 }}
            className={`${cardClass} group flex aspect-square flex-col items-center justify-center gap-3 p-3`}
          >
            <TechIcon tech={t} className="size-8 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent)]" />
            <span className="text-center text-xs text-[var(--color-text-muted)]">{t.name}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function SkillsCloud({ technologies }: SectionProps) {
  if (technologies.length === 0) return null;
  // Earlier display order = more prominent.
  const sizes = ['text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base'];
  return (
    <Section className="text-center">
      <Heading eyebrow="Skills" title="Word cloud" align="center" />
      <Reveal className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {technologies.map((t, i) => (
          <span
            key={t._id}
            className={cn(
              'font-semibold tracking-tight transition-colors hover:text-[var(--color-accent)]',
              sizes[Math.min(Math.floor(i / 3), sizes.length - 1)],
              i % 3 === 0 ? 'text-[var(--color-text)]' : i % 3 === 1 ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-accent)]'
            )}
          >
            {t.name}
          </span>
        ))}
      </Reveal>
    </Section>
  );
}

function Orbit({ items, radius, duration, reverse }: { items: Technology[]; radius: number; duration: number; reverse?: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-[var(--color-border-hover)]"
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {items.map((t, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        return (
          <motion.div
            key={t._id}
            title={t.name}
            className="absolute flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]"
            style={{ left: radius + Math.cos(angle) * radius - 22, top: radius + Math.sin(angle) * radius - 22 }}
            animate={{ rotate: reverse ? 360 : -360 }}
            transition={{ duration, repeat: Infinity, ease: 'linear' }}
          >
            <TechIcon tech={t} className="size-5 text-[var(--color-accent)]" />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function SkillsOrbit({ technologies, profile }: SectionProps) {
  if (technologies.length === 0) return null;
  const inner = technologies.slice(0, 6);
  const outer = technologies.slice(6, 18);
  return (
    <Section wide>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <Heading eyebrow="Stack" title="My universe of tools" className="mb-6" />
          <p className="text-lg text-[var(--color-text-muted)]">
            {technologies.length} technologies across {groupTech(technologies).length} areas — the ones in the inner ring are what I reach for first.
          </p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {technologies.slice(0, 10).map((t) => (
              <TechBadge key={t._id} technology={t} className="px-2 py-1 text-[11px]" />
            ))}
          </div>
        </Reveal>
        <div className="relative mx-auto aspect-square w-full max-w-[420px] max-sm:scale-[0.78]">
          <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg font-bold text-[var(--color-on-accent)] shadow-[var(--shadow-glow)]">
            {(profile?.name || 'me').split(' ')[0]?.slice(0, 2).toUpperCase()}
          </div>
          <Orbit items={inner} radius={100} duration={30} />
          {outer.length > 0 && <Orbit items={outer} radius={180} duration={50} reverse />}
        </div>
      </div>
    </Section>
  );
}

function SkillsTabs({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  const [active, setActive] = useState(0);
  const group = groups[active] ?? groups[0];
  if (!group) return null;
  return (
    <Section>
      <Heading eyebrow="Skills" title="Tech stack" />
      <div className="custom-scrollbar mb-8 flex gap-1 overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1">
        {groups.map((g, i) => (
          <button
            key={g.cat}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              i === active ? 'text-[var(--color-on-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            )}
          >
            {i === active && <motion.span layoutId="skills-tab" className="absolute inset-0 rounded-lg bg-[var(--color-accent)]" />}
            <span className="relative">{g.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={group.cat} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {group.items.map((t) => (
            <div key={t._id} className={`${cardClass} flex items-center gap-3 p-4`}>
              <TechIcon tech={t} className="size-5 text-[var(--color-accent)]" />
              <span className="text-sm text-[var(--color-text)]">{t.name}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

function SkillsMinimal({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-6">
      <Reveal className="grid gap-6 border-t border-[var(--color-border)] py-14 md:grid-cols-[180px_1fr] md:gap-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Toolbox</h2>
        <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.cat}>
              <dt className="text-xs text-[var(--color-text-faint)]">{g.label}</dt>
              <dd className="mt-1 text-[var(--color-text)]">{g.items.map((t) => t.name).join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

function SkillsMetro({ technologies }: SectionProps) {
  const groups = groupTech(technologies);
  if (groups.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">skills</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 [&_.metro-tile]:min-h-40">
        {groups.map((g, i) => (
          <MetroTile key={g.cat} color={metroColor(i + 2)} index={i} className={cn(g.items.length > 5 && 'col-span-2')}>
            <div className="flex flex-wrap gap-2">
              {g.items.slice(0, 8).map((t) => (
                <TechIcon key={t._id} tech={t} className="size-6" />
              ))}
            </div>
            <div>
              <p className="text-lg font-semibold">{g.label}</p>
              <p className="line-clamp-2 text-xs opacity-80">{g.items.map((t) => t.name).join(' · ')}</p>
            </div>
          </MetroTile>
        ))}
      </div>
    </section>
  );
}

function SkillsTerminal({ profile, technologies }: SectionProps) {
  if (technologies.length === 0) return null;
  return (
    <TerminalSection profile={profile} cmd="ls ~/stack">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
        {technologies.map((t) => (
          <span key={t._id} className="truncate text-[var(--color-text)]">
            {t.slug || t.name}
          </span>
        ))}
      </div>
    </TerminalSection>
  );
}

export const SKILLS_VARIANTS: SectionVariant[] = [
  { id: 'marquee', name: 'Marquee', description: 'Infinite scrolling logo strip.', Component: SkillsMarquee },
  { id: 'orbit', name: 'Orbit', description: 'Tech icons orbiting your initials.', Component: SkillsOrbit },
  { id: 'tabs', name: 'Category tabs', description: 'Animated tabs per category.', Component: SkillsTabs },
  { id: 'categories', name: 'Category cards', description: 'A card per category with icons.', Component: SkillsCategories },
  { id: 'icon-grid', name: 'Icon grid', description: 'Square icon tiles that lift on hover.', Component: SkillsIconGrid },
  { id: 'cloud', name: 'Word cloud', description: 'Mixed-size tech names.', Component: SkillsCloud },
  { id: 'badges', name: 'Badges', description: 'Simple wrapped pill badges.', Component: SkillsBadges },
  { id: 'metro', name: 'Metro tiles', description: 'A colored tile per category.', Component: SkillsMetro },
  { id: 'minimal', name: 'Minimal', description: 'Comma-separated lists by category.', Component: SkillsMinimal },
  { id: 'terminal', name: 'Terminal', description: '`ls ~/stack`.', Component: SkillsTerminal },
];
