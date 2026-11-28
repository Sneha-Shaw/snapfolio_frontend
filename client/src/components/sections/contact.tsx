import { useEffect, useState, type ComponentType, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Copy, Github, Link as LinkIcon, Linkedin, Mail, MapPin, Send, Twitter } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Profile, SocialLink, SocialPlatform } from '@/types/models';
import {
  Avatar,
  GlowCard,
  Marquee,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  metroColor,
  type SectionProps,
  type SectionVariant,
} from './shared';

const PLATFORM_ICONS: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  twitter: Twitter,
  portfolio: LinkIcon,
  other: LinkIcon,
};

function emailOf(profile: Profile | null) {
  return profile?.email || 'hello@example.com';
}

function Socials({ links, className }: { links: SocialLink[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {links.map((link) => {
        const Icon = PLATFORM_ICONS[link.platform];
        return (
          <a
            key={link._id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label || link.platform}
            className="flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(email).then(() => setCopied(true))}
      className={cn('inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]', className)}
    >
      {copied ? <Check className="size-4 text-[var(--color-accent)]" /> : <Copy className="size-4" />}
      {copied ? 'Copied!' : 'Copy email'}
    </button>
  );
}

function AvailabilityDot({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-xs text-[var(--color-text-muted)]">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-[var(--color-accent)]" />
      </span>
      {text}
    </span>
  );
}

function ContactCentered({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  return (
    <Section id="contact" className="overflow-hidden py-32 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px]" />
      <Reveal className="relative">
        <AvailabilityDot text={profile?.availability} />
        <h2 className="mx-auto mt-8 max-w-3xl text-balance text-5xl font-semibold tracking-tight text-[var(--color-text)] sm:text-7xl">
          Let's build something <span className="text-[var(--color-accent)]">great</span> together.
        </h2>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={`mailto:${email}`} className="inline-flex h-14 items-center gap-2 rounded-full bg-[var(--color-accent)] px-8 text-base font-semibold text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
            <Mail className="size-5" /> {email}
          </a>
          <CopyEmail email={email} />
        </div>
        <Socials links={socialLinks} className="mt-10 justify-center" />
      </Reveal>
    </Section>
  );
}

function ContactGiantEmail({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  return (
    <Section id="contact" className="py-28">
      <p className="mb-6 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">Got a project? Drop me a line</p>
      <a href={`mailto:${email}`} className="group block">
        <span className="relative inline-block break-all text-[9vw] font-bold leading-none tracking-tighter text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] lg:text-[96px]">
          {email}
          <span className="absolute -bottom-2 left-0 h-1 w-0 bg-[var(--color-accent)] transition-all duration-500 group-hover:w-full" />
        </span>
      </a>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-border)] pt-8">
        <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-muted)]">
          {profile?.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {profile.location}
            </span>
          )}
          <AvailabilityDot text={profile?.availability} />
        </div>
        <Socials links={socialLinks} />
      </div>
    </Section>
  );
}

function ContactForm({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${name || 'your portfolio'}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(message)}`;
  };
  const field =
    'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]';
  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">Contact</p>
          <h2 className="text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">Tell me about your project.</h2>
          <p className="mt-5 text-lg text-[var(--color-text-muted)]">I usually reply within a day. Prefer email? Write to <a className="text-[var(--color-accent)] hover:underline" href={`mailto:${email}`}>{email}</a>.</p>
          <div className="mt-8 flex items-center gap-4">
            <Avatar profile={profile} className="size-14 rounded-full text-lg" />
            <div>
              <p className="font-semibold text-[var(--color-text)]">{profile?.name}</p>
              <AvailabilityDot text={profile?.availability} />
            </div>
          </div>
          <Socials links={socialLinks} className="mt-8" />
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="elevated-card space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 sm:p-8">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--color-text)]">Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={field} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--color-text)]">Message</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required placeholder="What are you building?" className={cn(field, 'resize-none')} />
            </label>
            <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] text-sm font-semibold text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]">
              Send message <Send className="size-4" />
            </button>
            <p className="text-center text-xs text-[var(--color-text-faint)]">Opens your email app with the message filled in.</p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function ContactGlowCard({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  return (
    <Section id="contact">
      <Reveal>
        <GlowCard className="rounded-3xl">
          <div className="relative overflow-hidden p-10 sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[var(--color-accent)] opacity-20 blur-3xl" />
            <div className="relative grid items-end gap-10 md:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 className="text-balance text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">Have an idea? Let's make it real.</h2>
                <p className="mt-4 text-lg text-[var(--color-text-muted)]">{profile?.availability || 'Open to freelance and full-time roles.'}</p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <a href={`mailto:${email}`} className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-on-accent)] shadow-[var(--shadow-glow)] hover:bg-[var(--color-accent-strong)]">
                  Start a conversation <ArrowRight className="size-4" />
                </a>
                <Socials links={socialLinks} />
              </div>
            </div>
          </div>
        </GlowCard>
      </Reveal>
    </Section>
  );
}

function ContactBanner({ profile }: SectionProps) {
  const email = emailOf(profile);
  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--color-accent)] text-[var(--color-on-accent)]">
      <div className="pointer-events-none absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium opacity-80">{profile?.availability || 'Available for new projects'}</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Ready when you are.</h2>
        </div>
        <a href={`mailto:${email}`} className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--color-on-accent)] px-8 font-semibold text-[var(--color-accent)] transition-transform hover:scale-105">
          Get in touch <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
        </a>
      </div>
    </section>
  );
}

function ContactSocialTiles({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  const links = [{ _id: 'email', platform: 'email' as const, label: 'Email', url: `mailto:${email}` }, ...socialLinks.filter((l) => l.platform !== 'email')];
  return (
    <Section id="contact">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">Find me online</p>
        <h2 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">Let's connect</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link, i) => {
          const Icon = PLATFORM_ICONS[link.platform];
          return (
            <Reveal key={link._id} delay={i * 0.06}>
              <a href={link.url} target={link.platform === 'email' ? undefined : '_blank'} rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--color-accent)]">
                <span className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] transition-colors group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-on-accent)]">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-medium capitalize text-[var(--color-text)]">{link.label || link.platform}</span>
                </span>
                <ArrowUpRight className="size-5 text-[var(--color-text-faint)] transition-all group-hover:rotate-45 group-hover:text-[var(--color-accent)]" />
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function ContactMarquee({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  return (
    <section id="contact" className="py-24">
      <a href={`mailto:${email}`} className="group block">
        <Marquee duration={22} pauseOnHover={false}>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap text-7xl font-black uppercase tracking-tighter text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-9xl">
              Let's talk <span className="text-[var(--color-accent)]">✺</span>
            </span>
          ))}
        </Marquee>
      </a>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6">
        <a href={`mailto:${email}`} className="text-xl font-medium text-[var(--color-text)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-8 hover:text-[var(--color-accent)]">
          {email}
        </a>
        <Socials links={socialLinks} />
      </div>
    </section>
  );
}

function ContactMinimal({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6">
      <Reveal className="grid gap-6 border-t border-[var(--color-border)] py-14 md:grid-cols-[180px_1fr] md:gap-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Contact</h2>
        <div>
          <p className="text-xl text-[var(--color-text)]">
            The best way to reach me is by email:{' '}
            <a href={`mailto:${email}`} className="underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)]">
              {email}
            </a>
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {socialLinks.map((l) => (
              <a key={l._id} href={l.url} target="_blank" rel="noreferrer" className="capitalize text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                {l.label || l.platform} ↗
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ContactMetro({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">contact</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 [&_.metro-tile]:min-h-32">
        <a href={`mailto:${email}`} className="contents">
          <MetroTile color={metroColor(0)} className="col-span-2 row-span-2 min-h-64">
            <Mail className="size-8" />
            <div>
              <p className="text-sm opacity-80">mail me</p>
              <p className="break-all text-2xl font-light">{email}</p>
            </div>
          </MetroTile>
        </a>
        {socialLinks.map((l, i) => {
          const Icon = PLATFORM_ICONS[l.platform];
          return (
            <a key={l._id} href={l.url} target="_blank" rel="noreferrer" className="contents">
              <MetroTile color={metroColor(i + 1)} index={i + 1}>
                <Icon className="size-6" />
                <p className="text-sm lowercase">{l.label || l.platform}</p>
              </MetroTile>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ContactTerminal({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  return (
    <TerminalSection profile={profile} cmd="contact --list">
      <ul className="space-y-1">
        <li>
          <span className="inline-block w-24 text-[var(--color-text-faint)]">email</span>
          <a href={`mailto:${email}`} className="text-[var(--color-accent)] hover:underline">
            {email}
          </a>
        </li>
        {profile?.resumeUrl && (
          <li>
            <span className="inline-block w-24 text-[var(--color-text-faint)]">resume</span>
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
              download
            </a>
          </li>
        )}
        {socialLinks.map((l) => (
          <li key={l._id}>
            <span className="inline-block w-24 text-[var(--color-text-faint)]">{l.platform}</span>
            <a href={l.url} target="_blank" rel="noreferrer" className="break-all text-[var(--color-accent)] hover:underline">
              {l.url.replace(/^(https?:\/\/|mailto:)/, '')}
            </a>
          </li>
        ))}
      </ul>
    </TerminalSection>
  );
}

function ContactSplitPortrait({ profile, socialLinks }: SectionProps) {
  const email = emailOf(profile);
  return (
    <Section id="contact">
      <div className="grid overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-72">
          <Avatar profile={profile} className="absolute inset-0 size-full text-8xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[var(--color-bg-elevated)]" />
        </div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col justify-center p-10 sm:p-14">
          <AvailabilityDot text={profile?.availability} />
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--color-text)]">Say hello 👋</h2>
          <p className="mt-3 text-lg text-[var(--color-text-muted)]">Whether it's a project, a role, or just a chat about tech — my inbox is open.</p>
          <a href={`mailto:${email}`} className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)]">
            <Mail className="size-4" /> {email}
          </a>
          <Socials links={socialLinks} className="mt-8" />
        </motion.div>
      </div>
    </Section>
  );
}

export const CONTACT_VARIANTS: SectionVariant[] = [
  { id: 'centered', name: 'Centered CTA', description: 'Huge headline, glowing email button, copy-to-clipboard.', Component: ContactCentered },
  { id: 'giant-email', name: 'Giant email', description: 'Your email address as the headline, underline on hover.', Component: ContactGiantEmail },
  { id: 'form', name: 'Message form', description: 'Name + message form that opens a pre-filled email.', Component: ContactForm },
  { id: 'glow-card', name: 'Glow card', description: 'Big rounded card with cursor-following border glow.', Component: ContactGlowCard },
  { id: 'split-portrait', name: 'Portrait split', description: 'Your photo on one side, the invite on the other.', Component: ContactSplitPortrait },
  { id: 'marquee', name: "Let's talk marquee", description: 'Giant scrolling "LET\'S TALK" that is one big link.', Component: ContactMarquee },
  { id: 'banner', name: 'Accent banner', description: 'Full-width accent band with grid texture.', Component: ContactBanner },
  { id: 'social-tiles', name: 'Social tiles', description: 'A big clickable tile per platform.', Component: ContactSocialTiles },
  { id: 'metro', name: 'Metro tiles', description: 'Mail tile plus a tile per social link.', Component: ContactMetro },
  { id: 'minimal', name: 'Minimal', description: 'One sentence and a row of text links.', Component: ContactMinimal },
  { id: 'terminal', name: 'Terminal', description: '`contact --list`.', Component: ContactTerminal },
];
