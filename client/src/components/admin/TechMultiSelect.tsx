import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { getTechIcon } from '@/lib/techIcons';
import type { Technology } from '@/types/models';
import { cn } from '@/utils/cn';

interface TechMultiSelectProps {
  technologies: Technology[];
  value: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  'ai-data': 'AI & Data',
  devops: 'DevOps',
  language: 'Language',
  tooling: 'Tooling',
};

export function TechMultiSelect({ technologies, value, onChange, label, className }: TechMultiSelectProps) {
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term ? technologies.filter((t) => t.name.toLowerCase().includes(term)) : technologies;
    const groups = new Map<string, Technology[]>();
    for (const tech of filtered) {
      const list = groups.get(tech.category) ?? [];
      list.push(tech);
      groups.set(tech.category, list);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [technologies, search]);

  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <span className="block text-sm font-medium text-[var(--color-text)]">{label}</span>}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-faint)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search technologies…"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>

      <div className="max-h-72 space-y-3 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3">
        {grouped.length === 0 && (
          <p className="py-4 text-center text-sm text-[var(--color-text-faint)]">No technologies found</p>
        )}
        {grouped.map(([category, items]) => (
          <div key={category} className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-faint)]">
              {CATEGORY_LABELS[category] ?? category}
            </p>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {items.map((tech) => {
                const Icon = getTechIcon(tech.slug, tech.category);
                const checked = value.includes(tech._id);
                return (
                  <label
                    key={tech._id}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                      checked
                        ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated-2)]'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(tech._id)}
                      className="sr-only"
                    />
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate">{tech.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {value.length > 0 && (
        <p className="text-xs text-[var(--color-text-faint)]">{value.length} selected</p>
      )}
    </div>
  );
}
