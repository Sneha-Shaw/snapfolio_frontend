import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Cpu,
  Link2,
  UserCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/technologies', label: 'Technologies', icon: Cpu },
  { to: '/admin/social-links', label: 'Social Links', icon: Link2 },
  { to: '/admin/profile', label: 'Profile', icon: UserCircle },
];

const STORAGE_KEY = 'admin:sidebar-collapsed';

/** Remembered across reloads so the admin keeps the width they chose. */
function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch {
      /* private mode / blocked storage — the choice just won't persist */
    }
  }, [collapsed]);

  return (
    <aside
      className={cn(
        'hidden shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] sm:block',
        collapsed ? 'w-[4.5rem]' : 'w-60'
      )}
    >
      <div className="sticky top-0 flex h-16 items-center gap-2 px-4">
        {!collapsed && (
          <span className="flex min-w-0 items-center font-mono text-sm font-semibold text-[var(--color-text)]">
            arnab<span className="text-[var(--color-accent)]">.dev</span>
            <span className="ml-2 rounded-full bg-[var(--color-bg-elevated-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-faint)]">
              admin
            </span>
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-lg text-[var(--color-text-faint)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]',
            collapsed ? 'mx-auto' : 'ml-auto'
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className={cn('flex flex-col gap-1 py-2', collapsed ? 'px-2' : 'px-3')}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            /* Native tooltip is the label's only carrier once text is hidden. */
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center rounded-lg text-sm font-medium transition-colors',
                collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2',
                isActive
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]'
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
