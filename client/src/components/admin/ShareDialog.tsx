import { useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Copy, ExternalLink, Globe, Lock } from 'lucide-react';
import { Button, Modal, Switch } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { portfolioUrl, shareUrl } from '@/lib/username';
import { UsernameEditor } from '@/components/admin/UsernameEditor';
import { cn } from '@/utils/cn';

/** Share the portfolio: public/private, the username in its address, and the link itself. */
export function ShareDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, updateSharing } = useAuth();
  const current = user?.username ?? '';
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hand out the share link (it carries the preview card); it opens the portfolio page.
  const url = current ? shareUrl(current) : '';
  const pageUrl = current ? portfolioUrl(current) : '';

  const run = async (input: { username?: string; portfolioPublic?: boolean }, success: string) => {
    setBusy(true);
    try {
      await updateSharing(input);
      toast.success(success);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update sharing');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Couldn’t copy — select the link and copy it manually');
    }
  };

  if (!user) return null;
  const isPublic = user.portfolioPublic;

  return (
    <Modal open={open} onClose={onClose} title="Share your portfolio">
      <div className="space-y-6">
        {/* Visibility */}
        <div className="flex items-start justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4">
          <div className="flex gap-3">
            <span
              className={cn(
                'grid size-9 shrink-0 place-items-center rounded-lg',
                isPublic ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'bg-[var(--color-bg-elevated-2)] text-[var(--color-text-muted)]'
              )}
            >
              {isPublic ? <Globe className="size-4" /> : <Lock className="size-4" />}
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">{isPublic ? 'Public' : 'Private'}</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                {isPublic ? 'Anyone with the link can view your portfolio.' : 'Only you can open the link (while signed in). Make it public to share it.'}
              </p>
            </div>
          </div>
          <Switch
            checked={isPublic}
            disabled={busy}
            onChange={(on) => run({ portfolioPublic: on }, on ? 'Your portfolio is public' : 'Your portfolio is private')}
          />
        </div>

        {/* Link */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-text)]">Link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Portfolio link"
              className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs text-[var(--color-text)]"
            />
            <Button variant="secondary" size="sm" onClick={copy} disabled={!url} aria-label="Copy link">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open link"
              className="grid place-items-center rounded-lg border border-[var(--color-border)] px-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>
          <p className="text-xs text-[var(--color-text-faint)]">
            Shows a preview card with your name, headline and a project image when pasted into LinkedIn, WhatsApp, Slack or X — then opens{' '}
            <a href={pageUrl} target="_blank" rel="noreferrer" className="underline hover:text-[var(--color-text)]">
              your portfolio
            </a>
            .
          </p>
          {!isPublic && <p className="text-xs text-amber-400">Private — others will see “This portfolio isn’t public” until you switch it on.</p>}
        </div>

        {/* Username */}
        <UsernameEditor id="share-username" />

        <p className="border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-faint)]">
          Visitors see your saved design and published projects — unsaved changes and drafts stay private.
        </p>
      </div>
    </Modal>
  );
}
