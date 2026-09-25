import { Github, Linkedin, Mail, Twitter, Link as LinkIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { socialLinkService } from '@/services/socialLink.service';
import { profileService } from '@/services/profile.service';
import { Globe } from '@/components/aceternity/Globe';
import type { SocialPlatform } from '@/types/models';

const PLATFORM_ICONS: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  twitter: Twitter,
  portfolio: LinkIcon,
  other: LinkIcon,
};

export function Footer() {
  const { data: links } = useFetch(() => socialLinkService.list(), []);
  const { data: profile } = useFetch(() => profileService.get(), []);

  return (
    <footer id="contact" className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full space-y-3 sm:max-w-md">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
              Let's build something
            </p>
            <h2 className="text-balance text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
              Have a project in mind?
            </h2>
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-block font-mono text-sm text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-strong)]"
              >
                {profile.email}
              </a>
            )}

            <div className="flex gap-2 pt-2">
              {links?.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform];
                return (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label || link.platform}
                    className="flex size-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)]"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
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

        <div className="mt-16 flex flex-col-reverse items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-faint)] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {profile?.name || 'Arnab Das'}. All rights reserved.
          </p>
          <p>Built with React, TypeScript &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
