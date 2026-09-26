import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Github, Linkedin, Link as LinkIcon, Mail, Twitter } from 'lucide-react';
import { Globe } from '@/components/aceternity/Globe';
import { MOTIF_KITS } from '@/components/sections/kits';
import { cn } from '@/utils/cn';
import type { Profile, SocialLink, SocialPlatform } from '@/types/models';

/**
 * Footer designs.
 *
 * The footer is the last thing a visitor sees and the one place every page
 * shares, so a portfolio that nails its hero and then drops into a generic
 * two-line copyright bar reads as unfinished. Each design below is a complete
 * closing statement, not a strip of links.
 *
 * `compact` is set when the page already rendered its own contact section:
 * designs then drop their call-to-action (the page just made that pitch) and
 * keep only their signature element and the bottom bar.
 */

export interface FooterProps {
  profile: Profile | null;
  links: SocialLink[];
  compact: boolean;
  /** Active layout preset id — used by the motif footer to pick its material. */
  template?: string;
}

export interface FooterDesign {
  id: string;
  name: string;
  description: string;
  Component: ComponentType<FooterProps>;
}

const PLATFORM_ICONS: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  twitter: Twitter,
  portfolio: LinkIcon,
  other: LinkIcon,
};

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/#about', label: 'About' },
  { to: '/#contact', label: 'Contact' },
];

/** Platforms with a recognisable mark, in the order people look for them. */
const PRIORITY: SocialPlatform[] = ['github', 'linkedin', 'twitter', 'email', 'portfolio', 'other'];

/**
 * The links worth showing. Recognisable platforms first; `iconsOnly` drops the
 * generic ones entirely, because a row of identical fallback icons tells the
 * visitor nothing and reads as clutter.
 */
function topLinks(links: SocialLink[], max = 6, iconsOnly = false): SocialLink[] {
  const ranked = [...links].sort((a, b) => PRIORITY.indexOf(a.platform) - PRIORITY.indexOf(b.platform));
  const pool = iconsOnly ? ranked.filter((l) => l.platform !== 'other') : ranked;
  return (pool.length ? pool : ranked).slice(0, max);
}

const year = () => new Date().getFullYear();
const nameOf = (p: Profile | null) => p?.name || 'Portfolio';
const emailOf = (p: Profile | null) => p?.email || 'hello@example.com';

function SocialIcons({ links, className, iconClass }: { links: SocialLink[]; className?: string; iconClass?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {topLinks(links, 5, true).map((link) => {
        const Icon = PLATFORM_ICONS[link.platform] ?? LinkIcon;
        return (
          <a
            key={link._id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label || link.platform}
            className={cn(
              'grid size-10 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
              iconClass
            )}
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

function BackToTop({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'group inline-flex items-center gap-1.5 text-xs text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text)]',
        className
      )}
    >
      Back to top
      <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}

function BottomBar({ profile, className, children }: { profile: Profile | null; className?: string; children?: ReactNode }) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse items-center justify-between gap-4 py-6 text-xs text-[var(--color-text-faint)] sm:flex-row',
        className
      )}
    >
      <p>
        © {year()} {nameOf(profile)}. All rights reserved.
      </p>
      {children ?? <BackToTop />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Classic — the original: pitch on the left, globe on the right.
// ---------------------------------------------------------------------------

function FooterClassic({ profile, links, compact }: FooterProps) {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6">
        {!compact && (
          <div className="flex flex-col items-center gap-10 py-16 sm:flex-row sm:justify-between">
            <div className="w-full space-y-3 sm:max-w-md">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
                Let&apos;s build something
              </p>
              <h2 className="text-balance text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
                Have a project in mind?
              </h2>
              <a
                href={`mailto:${emailOf(profile)}`}
                className="inline-block font-mono text-sm text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-strong)]"
              >
                {emailOf(profile)}
              </a>
              <SocialIcons links={links} className="pt-2" iconClass="rounded-lg" />
            </div>
            <div className="relative w-48 shrink-0 sm:w-56">
              <Globe className="w-full opacity-90" />
              {profile?.location && (
                <p className="mt-2 text-center font-mono text-xs text-[var(--color-text-faint)]">
                  {profile.location} · open to remote
                </p>
              )}
            </div>
          </div>
        )}
        <BottomBar profile={profile} className={cn(!compact && 'border-t border-[var(--color-border)]')} />
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// 2. Wordmark — your name set enormous across the full width, bleeding off
//    the bottom edge. The agency-site signature.
// ---------------------------------------------------------------------------

function FooterWordmark({ profile, links, compact }: FooterProps) {
  const first = nameOf(profile).split(' ')[0] ?? 'Portfolio';
  /* ~0.66em per capital at this tracking, so this fills the width. */
  const size = `min(26rem, ${(148 / Math.max(first.length, 3)).toFixed(1)}vw)`;
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            {!compact && (
              <>
                <p className="text-sm text-[var(--color-text-muted)]">Currently</p>
                <p className="mt-1 max-w-xs text-lg font-medium text-[var(--color-text)]">
                  {profile?.availability || profile?.heroCurrently || 'Open to new work'}
                </p>
                <a
                  href={`mailto:${emailOf(profile)}`}
                  className="group mt-5 inline-flex items-center gap-2 border-b border-[var(--color-accent)] pb-1 text-sm font-medium text-[var(--color-text)]"
                >
                  {emailOf(profile)}
                  <ArrowUpRight className="size-4 text-[var(--color-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </>
            )}
          </div>
          <nav>
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Index</p>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.label}>
                  <Link to={n.to} className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Elsewhere</p>
            <ul className="space-y-2">
              {topLinks(links, 6).map((l) => (
                <li key={l._id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    {l.label || l.platform}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <BottomBar profile={profile} className="border-t border-[var(--color-border)]" />
      </div>

      {/* The wordmark, sized from the name's length to run edge to edge and
          cropped by the bottom of the page — the agency-site sign-off. */}
      <div className="pointer-events-none relative -mb-[4%] select-none overflow-hidden" aria-hidden>
        <p
          className="translate-y-[16%] whitespace-nowrap text-center font-semibold uppercase leading-[0.78] tracking-[-0.06em] text-transparent"
          style={{
            fontSize: size,
            backgroundImage: 'linear-gradient(180deg, var(--color-text) 10%, transparent 92%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            opacity: 0.9,
          }}
        >
          {first}
        </p>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// 3. Ticker — an endless "let's work together" band, then a quiet bar.
// ---------------------------------------------------------------------------

function FooterTicker({ profile, links, compact }: FooterProps) {
  const phrase = profile?.availability || "Let's work together";
  const email = emailOf(profile);
  const items = Array.from({ length: 6 }, () => phrase);

  return (
    <footer className="border-t border-[var(--color-border)]">
      {!compact && (
        <a href={`mailto:${email}`} className="group block overflow-hidden border-b border-[var(--color-border)] py-8" aria-label={`Email ${email}`}>
          <div className="flex w-max" style={{ animation: 'marquee-full 38s linear infinite' }}>
            {[0, 1].map((k) => (
              <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
                {items.map((t, i) => (
                  <span key={i} className="flex items-center">
                    <span className="px-8 text-5xl font-semibold tracking-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-7xl">
                      {t}
                    </span>
                    <span className="size-3 rotate-45 bg-[var(--color-accent)]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </a>
      )}
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          <a href={`mailto:${email}`} className="font-mono text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-strong)]">
            {email}
          </a>
          <SocialIcons links={links} />
        </div>
        <BottomBar profile={profile} className="border-t border-[var(--color-border)]" />
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// 4. Spotlight — a large lit card carrying the pitch, over a columns row.
// ---------------------------------------------------------------------------

function FooterSpotlight({ profile, links, compact }: FooterProps) {
  const email = emailOf(profile);
  return (
    <footer className="relative">
      <div className="mx-auto max-w-6xl px-6 pb-4 pt-16">
        {!compact && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] px-8 py-14 text-center sm:px-16"
            style={{
              background:
                'radial-gradient(ellipse 70% 90% at 50% 0%, color-mix(in srgb, var(--color-accent) 26%, transparent), transparent 70%), var(--color-bg-elevated)',
            }}
          >
            {/* Hairline highlight along the top edge, where the light is. */}
            <div
              className="pointer-events-none absolute inset-x-[15%] top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
              aria-hidden
            />
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              {profile?.availability || 'Available for work'}
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
              Let&apos;s make something worth shipping.
            </h2>
            <a
              href={`mailto:${email}`}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 text-sm font-medium text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] transition-colors hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]"
            >
              Start a conversation
              <ArrowUpRight className="size-4" />
            </a>
          </motion.div>
        )}

        <div className="flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
          <Link to="/" className="whitespace-nowrap text-sm font-semibold text-[var(--color-text)]">
            {nameOf(profile)}
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
                {n.label}
              </Link>
            ))}
          </nav>
          <SocialIcons links={links} />
        </div>
        <BottomBar profile={profile} className="border-t border-[var(--color-border)]" />
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// 5. Columns — a proper sitemap footer: brand, index, elsewhere, contact.
// ---------------------------------------------------------------------------

function FooterColumns({ profile, links, compact }: FooterProps) {
  const email = emailOf(profile);
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <p className="text-lg font-semibold text-[var(--color-text)]">{nameOf(profile)}</p>
            <p className="mt-2 max-w-xs text-sm text-[var(--color-text-muted)]">
              {profile?.headline || 'Designer and engineer.'}
            </p>
            {profile?.location && (
              <p className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--color-text-faint)]">
                <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
                {profile.location}
              </p>
            )}
          </div>
          <FooterColumn title="Index">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
                {n.label}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Elsewhere">
            {topLinks(links, 6).map((l) => (
              <a key={l._id} href={l.url} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
                {l.label || l.platform}
              </a>
            ))}
          </FooterColumn>
          {!compact && (
            <FooterColumn title="Contact">
              <p className="text-sm text-[var(--color-text-muted)]">{profile?.availability || 'Open to new work.'}</p>
              <a
                href={`mailto:${email}`}
                className="mt-1 inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]"
              >
                <Mail className="size-4 text-[var(--color-accent)]" />
                Email me
              </a>
            </FooterColumn>
          )}
        </div>
        <BottomBar profile={profile} className="border-t border-[var(--color-border)]" />
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">{title}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Signature — a large serif sign-off, like the end of a letter.
// ---------------------------------------------------------------------------

function FooterSignature({ profile, links, compact }: FooterProps) {
  const email = emailOf(profile);
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6">
        {!compact && (
          <div className="py-20 text-center">
            <p className="font-serif text-6xl italic leading-none text-[var(--color-text)] sm:text-8xl">Let&apos;s talk.</p>
            {/* Hand-drawn underline stroke under the sign-off. */}
            <svg viewBox="0 0 300 20" className="mx-auto mt-2 h-4 w-56 sm:w-72" aria-hidden>
              <motion.path
                d="M4 14 C 70 4, 150 4, 296 10"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              />
            </svg>
            <a
              href={`mailto:${email}`}
              className="mt-8 inline-block text-lg text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {email}
            </a>
            <p className="mt-10 font-serif text-2xl italic text-[var(--color-text-faint)]">— {nameOf(profile)}</p>
            <SocialIcons links={links} className="mt-8 justify-center" />
          </div>
        )}
        <BottomBar profile={profile} className={cn(!compact && 'border-t border-[var(--color-border)]')} />
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// 7. Terminal — the session ends with the contact command.
// ---------------------------------------------------------------------------

function FooterTerminal({ profile, links, compact }: FooterProps) {
  const host = (nameOf(profile).split(' ')[0] ?? 'site').toLowerCase().replace(/[^a-z0-9]/g, '') || 'site';
  const email = emailOf(profile);
  return (
    <footer className="border-t border-[var(--color-border)] font-mono">
      <div className="mx-auto max-w-4xl px-6">
        {!compact && (
          <div className="py-14 text-sm leading-relaxed">
            <p>
              <span className="text-[var(--color-accent)]">guest@{host}</span>
              <span className="text-[var(--color-text-faint)]">:~$ </span>
              <span className="text-[var(--color-text)]">contact --all</span>
            </p>
            <div className="mt-3 space-y-1 border-l border-[var(--color-border)] pl-4 text-[var(--color-text-muted)]">
              <p>
                email{'    '}→{' '}
                <a href={`mailto:${email}`} className="text-[var(--color-accent)] hover:underline">
                  {email}
                </a>
              </p>
              {topLinks(links, 5).map((l) => (
                <p key={l._id}>
                  {(l.label || l.platform).toLowerCase().padEnd(8, ' ')}→{' '}
                  <a href={l.url} target="_blank" rel="noreferrer" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                    {l.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                  </a>
                </p>
              ))}
              <p className="text-[var(--color-text-faint)]">status{'   '}→ {profile?.availability || 'online'}</p>
            </div>
            <p className="mt-4">
              <span className="text-[var(--color-accent)]">guest@{host}</span>
              <span className="text-[var(--color-text-faint)]">:~$ </span>
              <motion.span
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                className="inline-block h-4 w-2 translate-y-0.5 bg-[var(--color-accent)]"
              />
            </p>
          </div>
        )}
        <BottomBar profile={profile} className={cn('font-sans', !compact && 'border-t border-[var(--color-border)]')}>
          <p>exit 0</p>
        </BottomBar>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// 8. Minimal — a single centred line. For pages that say enough above it.
// ---------------------------------------------------------------------------

function FooterMinimal({ profile, links }: FooterProps) {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-10 text-center">
        <SocialIcons links={links} className="justify-center" iconClass="size-9 border-transparent" />
        <p className="text-xs text-[var(--color-text-faint)]">
          © {year()} {nameOf(profile)}
          <span className="mx-2 text-[var(--color-border-hover)]">/</span>
          {profile?.location || 'Remote'}
          <span className="mx-2 text-[var(--color-border-hover)]">/</span>
          <a href={`mailto:${emailOf(profile)}`} className="transition-colors hover:text-[var(--color-accent)]">
            {emailOf(profile)}
          </a>
        </p>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// 9. Motif — the footer made of the concept preset's own material, so a
//    walnut-radio page ends in walnut and a book page ends on paper.
// ---------------------------------------------------------------------------

function FooterMotif(props: FooterProps) {
  const kit = MOTIF_KITS.find((k) => k.id === props.template);
  if (!kit) return <FooterSpotlight {...props} />;

  const { profile, links, compact } = props;
  const { Frame, Backdrop, Bullet } = kit;
  const email = emailOf(profile);
  const ink = kit.surface === 'paper' ? 'on-paper' : 'on-dark';

  return (
    <footer className="relative overflow-hidden">
      {Backdrop && <Backdrop />}
      <div className="relative mx-auto max-w-6xl px-6 pb-8 pt-16">
        <Frame className={ink}>
          {!compact && (
            <div className="mb-8 grid items-end gap-8 sm:grid-cols-[1.4fr_1fr]">
              <div>
                <p className={cn('text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--ink-faint)]', kit.eyebrowClass)}>
                  {profile?.availability || 'Get in touch'}
                </p>
                <h2 className={cn('mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl', kit.titleClass)}>
                  Have a project in mind?
                </h2>
              </div>
              <a
                href={`mailto:${email}`}
                className={cn('motif-tile flex items-center justify-between gap-3 px-5 py-4 text-[var(--ink)]', kit.tileClass)}
              >
                <span className="flex min-w-0 items-center gap-3">
                  {Bullet ? <Bullet /> : null}
                  <span className="truncate text-sm font-medium">{email}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-[var(--color-accent)]" />
              </a>
            </div>
          )}
          <div className={cn('flex flex-col items-center justify-between gap-5 sm:flex-row', !compact && 'border-t border-[var(--ink-rule)] pt-6')}>
            <p className="text-xs text-[var(--ink-faint)]">
              © {year()} {nameOf(profile)}
            </p>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {NAV.map((n) => (
                <Link key={n.label} to={n.to} className="text-xs text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-3">
              {topLinks(links, 5, true).map((l) => {
                const Icon = PLATFORM_ICONS[l.platform] ?? LinkIcon;
                return (
                  <a key={l._id} href={l.url} target="_blank" rel="noreferrer" aria-label={l.label || l.platform} className="text-[var(--ink-muted)] transition-colors hover:text-[var(--color-accent)]">
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </Frame>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const FOOTER_DESIGNS: FooterDesign[] = [
  { id: 'classic', name: 'Classic', description: 'Pitch and email on the left, spinning globe on the right.', Component: FooterClassic },
  { id: 'wordmark', name: 'Wordmark', description: 'Your name set edge to edge and cropped by the page, over index columns.', Component: FooterWordmark },
  { id: 'ticker', name: 'Ticker', description: 'An endless “let’s work together” band that is itself the email link.', Component: FooterTicker },
  { id: 'spotlight', name: 'Spotlight', description: 'A lit card carrying the pitch, over a navigation row.', Component: FooterSpotlight },
  { id: 'columns', name: 'Columns', description: 'A proper sitemap footer — brand, index, elsewhere, contact.', Component: FooterColumns },
  { id: 'signature', name: 'Signature', description: 'A large serif “Let’s talk.” with a hand-drawn underline, signed.', Component: FooterSignature },
  { id: 'terminal', name: 'Terminal', description: 'The session ends by running the contact command.', Component: FooterTerminal },
  { id: 'minimal', name: 'Minimal', description: 'One centred line. For pages that already said everything.', Component: FooterMinimal },
  { id: 'motif', name: 'Motif ✺', description: 'Built from the concept preset’s own material — walnut, paper, carbon, soil.', Component: FooterMotif },
];

export function getFooterDesign(id?: string | null): FooterDesign {
  return FOOTER_DESIGNS.find((f) => f.id === id) ?? FOOTER_DESIGNS[0]!;
}
