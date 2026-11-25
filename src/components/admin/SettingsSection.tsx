import { createContext, useContext, type ComponentType, type ReactNode } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

/** Colour of a section's icon tile — gives each section its own identity. */
export type SectionTone = 'accent' | 'violet' | 'amber' | 'sky' | 'pink' | 'teal';

const TONES: Record<SectionTone, string> = {
  accent: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-[var(--color-accent)]/20',
  violet: 'bg-violet-500/12 text-violet-500 ring-violet-500/20',
  amber: 'bg-amber-500/12 text-amber-500 ring-amber-500/20',
  sky: 'bg-sky-500/12 text-sky-500 ring-sky-500/20',
  pink: 'bg-pink-500/12 text-pink-500 ring-pink-500/20',
  teal: 'bg-teal-500/12 text-teal-500 ring-teal-500/20',
};

export type Icon = ComponentType<{ className?: string }>;

/** Lets a section's empty state reuse the section's icon and colour. */
const SectionContext = createContext<{ icon?: Icon; tone: SectionTone }>({ tone: 'accent' });

export function IconTile({ icon: Icon, tone, size = 'md' }: { icon: Icon; tone: SectionTone; size?: 'md' | 'lg' }) {
  return (
    <span className={cn('grid shrink-0 place-items-center rounded-xl ring-1 ring-inset', TONES[tone], size === 'lg' ? 'size-12' : 'size-9')}>
      <Icon className={size === 'lg' ? 'size-5' : 'size-4'} />
    </span>
  );
}

/**
 * One settings panel: a card with a header (title, optional count, description,
 * action), a body, and an optional footer. The building block of the
 * Personal information page — every section has the same frame.
 */
export function SettingsSection({
  title,
  description,
  icon,
  tone = 'accent',
  count,
  action,
  toolbar,
  footer,
  stickyFooter = false,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  icon?: Icon;
  tone?: SectionTone;
  /** Shown as a small pill next to the title (e.g. number of entries). */
  count?: number;
  /** Header action, usually <AddButton>. */
  action?: ReactNode;
  /** Optional row under the header — search, filters. */
  toolbar?: ReactNode;
  footer?: ReactNode;
  /** Keep the footer (e.g. a save bar) pinned to the bottom of the screen while the section scrolls. */
  stickyFooter?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SectionContext.Provider value={{ icon, tone }}>
      {/* overflow-clip (not hidden) so a sticky footer can still stick to the viewport. */}
      <section
        className={cn(
          'overflow-clip rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]',
          className
        )}
      >
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            {icon && <IconTile icon={icon} tone={tone} />}
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-text)]">
                {title}
                {count !== undefined && (
                  <span className="rounded-full bg-[var(--color-bg-elevated-2)] px-2 py-0.5 text-xs font-medium tabular-nums text-[var(--color-text-muted)]">{count}</span>
                )}
              </h2>
              {description && <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{description}</p>}
            </div>
          </div>
          {action}
        </header>
        {toolbar && <div className="border-b border-[var(--color-border)] px-5 py-3">{toolbar}</div>}
        {/* Rows in list sections light up on hover. */}
        <div className="[&_.divide-y>*]:transition-colors [&_.divide-y>*:hover]:bg-[var(--color-bg-elevated-2)]/50">{children}</div>
        {footer && (
          <footer
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] px-5 py-3',
              stickyFooter ? 'sticky bottom-0 z-10 bg-[var(--color-bg-elevated)]/95 backdrop-blur' : 'bg-[var(--color-bg-elevated-2)]/40'
            )}
          >
            {footer}
          </footer>
        )}
      </section>
    </SectionContext.Provider>
  );
}

/** The section-level "Add …" action — secondary, so it doesn't compete with Save. */
export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Button variant="secondary" size="sm" onClick={onClick}>
      <Plus className="size-4" />
      {children}
    </Button>
  );
}

/** Compact empty state inside a section body, with the same add action inline. */
export function SectionEmpty({ title, description, actionLabel, onAction }: { title: string; description?: string; actionLabel?: string; onAction?: () => void }) {
  const { icon, tone } = useContext(SectionContext);
  return (
    <div className="flex flex-col items-center gap-1 px-5 py-8 text-center">
      {icon && (
        <span className="mb-2">
          <IconTile icon={icon} tone={tone} size="lg" />
        </span>
      )}
      <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
      {description && <p className="text-sm text-[var(--color-text-muted)]">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline">
          <Plus className="size-3.5" /> {actionLabel}
        </button>
      )}
    </div>
  );
}

export function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-8 text-[var(--color-text-faint)]" role="status" aria-label="Loading">
      <Loader2 className="size-5 animate-spin" />
    </div>
  );
}

const iconBtn = 'rounded-lg p-2 text-[var(--color-text-muted)] transition-colors';

/** Edit / delete buttons at the end of a list row, labelled with what they act on. */
export function RowActions({ label, onEdit, editHref, onDelete }: { label: string; onEdit?: () => void; editHref?: ReactNode; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 gap-0.5">
      {editHref ?? (
        <button type="button" onClick={onEdit} className={cn(iconBtn, 'hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]')} aria-label={`Edit ${label}`} title="Edit">
          <Pencil className="size-4" />
        </button>
      )}
      <button type="button" onClick={onDelete} className={cn(iconBtn, 'hover:bg-red-500/10 hover:text-red-400')} aria-label={`Delete ${label}`} title="Delete">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export const rowIconBtn = cn(iconBtn, 'hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]');
