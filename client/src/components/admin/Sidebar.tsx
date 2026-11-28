import { Fragment, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Palette, UserCircle, Users, CreditCard, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { PRODUCT_NAME } from '@/config/product';
import { ACTIVE_SECTION_EVENT, BUILD_SECTIONS, PERSONAL_SECTIONS } from '@/config/adminSections';

const NAV_ITEMS = [
  { to: '/admin/personal', label: 'Personal information', icon: UserCircle, end: false, children: PERSONAL_SECTIONS },
  { to: '/admin/build', label: 'Build portfolio', icon: Palette, end: false, children: BUILD_SECTIONS },
];

/** Platform management, shown to the super admin only. */
const SUPER_ADMIN_ITEMS = [{ to: '/admin/users', label: 'Users', icon: Users, end: false, children: undefined }];

/** Subscribers manage their plan here. */
const USER_ITEMS = [{ to: '/admin/billing', label: 'Billing', icon: CreditCard, end: false, children: undefined }];

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
  const { user } = useAuth();
  const items = user?.role === 'super_admin' ? [...NAV_ITEMS, ...SUPER_ADMIN_ITEMS] : [...NAV_ITEMS, ...USER_ITEMS];
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Highlight the section currently in view on long pages (see useSectionNav).
  useEffect(() => {
    const onActive = (e: Event) => setActiveSection((e as CustomEvent<string | null>).detail);
    window.addEventListener(ACTIVE_SECTION_EVENT, onActive);
    return () => window.removeEventListener(ACTIVE_SECTION_EVENT, onActive);
  }, []);

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
        // Pinned to the viewport so the nav stays put while long pages scroll.
        'sticky top-0 hidden h-screen shrink-0 self-start overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] sm:block',
        collapsed ? 'w-[4.5rem]' : 'w-60'
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        {!collapsed && (
          <span className="flex min-w-0 items-center font-mono text-sm font-semibold text-[var(--color-text)]">
            {PRODUCT_NAME}
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
        {items.map((item) => (
          <Fragment key={item.to}>
            <NavLink
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
            {item.children && !collapsed && (
              <ul className="mb-1 ml-5 mt-0.5 space-y-0.5 border-l border-[var(--color-border)] pl-3">
                {item.children.map((child) => {
                  const active = location.pathname === item.to && activeSection === child.id;
                  return (
                    <li key={child.id}>
                      <Link
                        to={`${item.to}#${child.id}`}
                        aria-current={active ? 'location' : undefined}
                        className={cn(
                          'block truncate rounded-md px-2 py-1 text-[13px] transition-colors',
                          active
                            ? 'font-medium text-[var(--color-accent)]'
                            : 'text-[var(--color-text-faint)] hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]'
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Fragment>
        ))}
      </nav>
    </aside>
  );
}
