import { Link } from 'react-router-dom';
import { ArrowRight, Check, ExternalLink, Globe, Lock, Share2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFetch } from '@/hooks/useFetch';
import { openShareDialog, useContentVersion } from '@/lib/contentEvents';
import { profileService } from '@/services/profile.service';
import { projectService } from '@/services/project.service';
import { experienceService } from '@/services/experience.service';
import { technologyService } from '@/services/technology.service';
import { socialLinkService } from '@/services/socialLink.service';
import { cn } from '@/utils/cn';

interface Step {
  label: string;
  done: boolean;
  /** Section on this page to jump to… */
  section?: string;
  /** …or something to do instead. */
  onClick?: () => void;
}

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join('') || '?'
  );
}

/** Progress ring: how much of the checklist is done. */
function Ring({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 72 72" className="size-[72px] -rotate-90" aria-hidden="true">
      <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6" className="stroke-[var(--color-bg-elevated-2)]" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        className="stroke-[var(--color-accent)] transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </svg>
  );
}

/**
 * The top of Personal information: who the portfolio belongs to, whether it's
 * public, and how complete it is — with the next steps one click away.
 * Re-counts whenever a section below changes (see contentEvents).
 */
export function PortfolioHeader() {
  const { user } = useAuth();
  const version = useContentVersion();
  const { data: profile } = useFetch(() => profileService.get(), [version]);
  const { data: published } = useFetch(() => projectService.listAdmin({ published: true, page: 1, limit: 1 }), [version]);
  const { data: experience } = useFetch(() => experienceService.list(), [version]);
  const { data: technologies } = useFetch(() => technologyService.list(true), [version]);
  const { data: links } = useFetch(() => socialLinkService.list(true), [version]);

  const name = profile?.name || user?.name || '';
  const steps: Step[] = [
    { label: 'Add a photo', done: Boolean(profile?.profileImage?.url), section: 'profile' },
    { label: 'Write your introduction', done: Boolean(profile?.heroStatement?.trim() || profile?.bio?.trim()), section: 'profile' },
    { label: 'Publish a project', done: (published?.meta.total ?? 0) > 0, section: 'projects' },
    { label: 'Add your experience', done: (experience?.length ?? 0) > 0, section: 'experience' },
    { label: 'Add your skills', done: (technologies?.length ?? 0) > 0, section: 'technologies' },
    { label: 'Add a way to reach you', done: (links?.length ?? 0) > 0 || Boolean(profile?.email), section: 'social-links' },
    { label: 'Make it public', done: Boolean(user?.portfolioPublic), onClick: openShareDialog },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const progress = doneCount / steps.length;
  const nextIndex = steps.findIndex((s) => !s.done);
  const isPublic = Boolean(user?.portfolioPublic);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)]">
      {/* Soft accent glow — the one splash of colour that makes the page feel like yours. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 140% at 0% 0%, var(--color-accent-soft), transparent 70%), radial-gradient(35% 90% at 100% 0%, var(--color-accent-soft), transparent 70%)',
        }}
      />

      <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--color-accent)] text-lg font-semibold text-[var(--color-on-accent)] ring-4 ring-[var(--color-accent-soft)]">
            {profile?.profileImage?.url ? <img src={profile.profileImage.url} alt="" className="absolute inset-0 size-full object-cover" /> : initialsOf(name)}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">Your portfolio</p>
            <p className="truncate text-xl font-semibold text-[var(--color-text)]">{name || 'Add your name'}</p>
            <p className="truncate text-sm text-[var(--color-text-muted)]">{profile?.headline || 'Add a headline so visitors know what you do'}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                  isPublic ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'bg-[var(--color-bg-elevated-2)] text-[var(--color-text-muted)]'
                )}
              >
                {isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
                {isPublic ? 'Public' : 'Private'}
              </span>
              <a
                href="/admin/preview"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-elevated-2)]"
              >
                <ExternalLink className="size-3" /> Preview
              </a>
              <button
                type="button"
                onClick={openShareDialog}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-elevated-2)]"
              >
                <Share2 className="size-3" /> Share
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative grid place-items-center">
            <Ring value={progress} />
            <span className="absolute text-base font-semibold tabular-nums text-[var(--color-text)]">{Math.round(progress * 100)}%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Portfolio strength</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {doneCount} of {steps.length} steps done
            </p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[var(--color-border)] px-6 py-4">
        {nextIndex === -1 ? (
          <p className="flex items-center gap-2 text-sm text-[var(--color-text)]">
            <Sparkles className="size-4 text-[var(--color-accent)]" />
            Your portfolio is complete — share it and keep your projects fresh.
          </p>
        ) : (
          <>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">Next steps</p>
            <ul className="flex flex-wrap gap-2">
              {steps.map((step, i) => {
                const next = i === nextIndex;
                const body = (
                  <>
                    <span
                      className={cn(
                        'grid size-4 shrink-0 place-items-center rounded-full border',
                        step.done ? 'border-transparent bg-[var(--color-accent)] text-[var(--color-on-accent)]' : next ? 'border-[var(--color-accent)]' : 'border-[var(--color-border-hover)]'
                      )}
                    >
                      {step.done && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <span className={cn(step.done && 'text-[var(--color-text-faint)] line-through decoration-[var(--color-border-hover)]')}>{step.label}</span>
                    {!step.done && <ArrowRight className={cn('size-3.5 transition-transform group-hover:translate-x-0.5', next ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')} />}
                  </>
                );
                const cls = cn(
                  'group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
                  step.done
                    ? 'border-transparent bg-[var(--color-bg-elevated-2)]/60'
                    : next
                      ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent-soft)] font-medium text-[var(--color-text)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)]'
                );
                return (
                  <li key={step.label}>
                    {step.done ? (
                      <span className={cls} aria-label={`${step.label} — done`}>
                        {body}
                      </span>
                    ) : step.onClick ? (
                      <button type="button" onClick={step.onClick} className={cls}>
                        {body}
                      </button>
                    ) : (
                      <Link to={`/admin/personal#${step.section}`} className={cls}>
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
