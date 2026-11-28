import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GridGlow } from '@/components/aceternity/GridGlow';
import { CursorGlow } from '@/components/aceternity/CursorGlow';
import { SpotlightNew } from '@/components/aceternity/SpotlightNew';
import { TextFlippingBoard } from '@/components/aceternity/TextFlippingBoard';
import { PixelatedCanvas } from '@/components/aceternity/PixelatedCanvas';
import { useTheme } from '@/context/ThemeContext';
import type { Profile } from '@/types/models';

interface HeroProps {
  profile: Profile | null;
}

const DEFAULT_STATEMENT = ['Building thoughtful software,', 'end to end.'];
const DEFAULT_FOCUS_AREAS = ['full-stack', 'AI systems', 'clean code'];

export function Hero({ profile }: HeroProps) {
  const lines = profile?.heroStatement ? profile.heroStatement.split('\n').filter(Boolean) : DEFAULT_STATEMENT;
  const photoUrl = profile?.profileImage?.url;
  const { theme } = useTheme();

  return (
    <section className="relative overflow-hidden">
      <GridGlow />
      <SpotlightNew />
      <CursorGlow />

      <div className="relative mx-auto flex min-h-[85vh] max-w-6xl items-center px-6 py-28">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            {profile?.heroEyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]"
              >
                {profile.heroEyebrow}
              </motion.p>
            )}

            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-6xl lg:text-7xl">
              {lines.map((line, i) => (
                <motion.span
                  key={`${line}-${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {profile?.heroCurrently && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 px-3 py-1.5 text-xs text-[var(--color-text-muted)] backdrop-blur">
                  <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
                  {profile.heroCurrently}
                </span>
              )}
              {profile?.heroTimezone && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 px-3 py-1.5 font-mono text-xs text-[var(--color-text-muted)] backdrop-blur">
                  {profile.heroTimezone}
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-muted)]"
            >
              <span>Currently diving into</span>
              <TextFlippingBoard words={profile?.focusAreas?.length ? profile.focusAreas : DEFAULT_FOCUS_AREAS} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 text-sm font-medium text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] transition-all hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]"
              >
                Get in touch
              </a>
              <Link
                to="/work"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] px-6 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)]"
              >
                See my work <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          </div>

          {photoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mx-auto hidden w-full max-w-[360px] lg:block"
            >
              <PixelatedCanvas
                src={photoUrl}
                responsive
                className="aspect-[4/5] w-full rounded-2xl border border-[var(--color-border)]"
                cellSize={5}
                dotScale={0.85}
                shape="circle"
                backgroundColor={theme.background}
                duotone={{ shadow: theme.background, highlight: theme.accent }}
                dropoutStrength={0.32}
                distortionMode="swirl"
                distortionStrength={4}
                distortionRadius={90}
                jitterStrength={1.2}
                jitterSpeed={1.5}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
