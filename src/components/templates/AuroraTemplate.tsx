import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { TechMarquee } from '@/components/tech/TechMarquee';
import { TextGenerateEffect } from '@/components/aceternity/TextGenerateEffect';
import { BackgroundLines } from '@/components/aceternity/BackgroundLines';
import { FocusCards } from '@/components/aceternity/FocusCards';
import { JourneyPath } from '@/components/home/JourneyPath';
import { AboutCard } from '@/components/home/AboutCard';
import { ExperienceSection } from '@/components/home/ExperienceSection';
import { PageSpinner } from '@/components/ui';
import type { TemplateProps } from './types';

/** The original layout — animated hero, spotlight effects, 3D cards, journey timeline. */
export function AuroraTemplate({ profile, technologies, projects, projectsLoading, experiences, education }: TemplateProps) {
  const [aboutInView, setAboutInView] = useState(false);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div>
      <Hero profile={profile} />

      {profile?.focusAreas && profile.focusAreas.length > 0 && (
        <section className="relative mx-auto max-w-5xl px-6 py-16">
          <BackgroundLines className="opacity-70" />
          <p className="relative mb-5 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
            Focus areas
          </p>
          <div className="relative flex flex-wrap gap-2">
            {profile.focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-sm text-[var(--color-text-muted)]"
              >
                {area}
              </span>
            ))}
          </div>
        </section>
      )}

      <TechMarquee technologies={technologies} />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
              Selected work
            </p>
            <h2 className="text-3xl font-semibold text-[var(--color-text)]">Featured projects</h2>
          </div>
          <Link
            to="/work"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] sm:inline-flex"
          >
            View all work <ArrowRight className="size-4" />
          </Link>
        </div>

        {projectsLoading ? (
          <PageSpinner />
        ) : featured.length > 0 ? (
          <FocusCards
            cards={featured.map((p) => ({
              title: p.title,
              subtitle: p.shortDescription,
              imageUrl: p.thumbnail.url,
              href: `/work/${p.slug}`,
            }))}
          />
        ) : (
          <p className="text-sm text-[var(--color-text-faint)]">No featured projects yet. Check back soon.</p>
        )}

        <Link
          to="/work"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] sm:hidden"
        >
          View all work <ArrowRight className="size-4" />
        </Link>
      </section>

      {profile?.aboutText && (
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => setAboutInView(true)}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
                About
              </p>
              {aboutInView ? (
                <TextGenerateEffect
                  words={profile.aboutText}
                  className="text-balance text-xl leading-relaxed"
                  duration={0.4}
                />
              ) : (
                <p className="text-balance text-xl leading-relaxed text-transparent">{profile.aboutText}</p>
              )}
            </motion.div>

            {profile.profileImage?.url && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto shrink-0 lg:mx-0"
              >
                <AboutCard imageUrl={profile.profileImage.url} name={profile.name || 'Profile photo'} />
              </motion.div>
            )}
          </div>
        </section>
      )}

      <ExperienceSection experience={experiences} />

      <JourneyPath experience={experiences} education={education} />
    </div>
  );
}
