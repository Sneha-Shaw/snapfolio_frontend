import { useEffect, useState } from 'react';
import { OPEN_SHARE_EVENT } from '@/lib/contentEvents';
import { useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { subscriptionLabel } from '@/lib/plans';
import { ShareDialog } from '@/components/admin/ShareDialog';
import { cn } from '@/utils/cn';

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sharing, setSharing] = useState(false);
  // Other parts of the admin (e.g. the completion checklist) can open Share.
  useEffect(() => {
    const open = () => setSharing(true);
    window.addEventListener(OPEN_SHARE_EVENT, open);
    return () => window.removeEventListener(OPEN_SHARE_EVENT, open);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-6">
      <div className="flex items-center gap-4">
        <a
          href="/admin/preview"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          Preview my portfolio <ExternalLink className="size-3.5" />
        </a>
        <button
          type="button"
          onClick={() => setSharing(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-elevated-2)]"
        >
          <Share2 className="size-3.5" /> Share
          <span
            className={cn('size-1.5 rounded-full', user?.portfolioPublic ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-text-faint)]')}
            title={user?.portfolioPublic ? 'Public' : 'Private'}
            aria-label={user?.portfolioPublic ? 'Public' : 'Private'}
          />
        </button>
      </div>
      <ShareDialog open={sharing} onClose={() => setSharing(false)} />

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm text-[var(--color-text-muted)]">
          {user?.name}
          <span className="ml-2 rounded-full bg-[var(--color-bg-elevated-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-faint)]">
            {user?.role === 'super_admin' ? 'Super admin' : subscriptionLabel(user?.subscription) || 'User'}
          </span>
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-red-400"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </header>
  );
}
