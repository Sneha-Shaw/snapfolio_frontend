import { useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-6">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
      >
        View site <ExternalLink className="size-3.5" />
      </a>

      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--color-text-muted)]">{user?.name}</span>
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
