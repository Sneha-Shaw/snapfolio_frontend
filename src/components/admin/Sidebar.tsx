import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Briefcase, GraduationCap, Cpu, Link2, UserCircle } from 'lucide-react';
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

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] sm:block">
      <div className="flex h-16 items-center px-6 font-mono text-sm font-semibold text-[var(--color-text)]">
        arnab<span className="text-[var(--color-accent)]">.dev</span>
        <span className="ml-2 rounded-full bg-[var(--color-bg-elevated-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-faint)]">
          admin
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]'
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
