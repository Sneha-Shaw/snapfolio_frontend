import { useState, type KeyboardEvent } from 'react';
import { GripVertical, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

interface DynamicStringListProps {
  value: string[];
  onChange: (items: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DynamicStringList({ value, onChange, label, placeholder, className }: DynamicStringListProps) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateAt = (index: number, next: string) => {
    onChange(value.map((v, i) => (i === index ? next : v)));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const a = next[index];
    const b = next[target];
    if (a === undefined || b === undefined) return;
    next[index] = b;
    next[target] = a;
    onChange(next);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <span className="block text-sm font-medium text-[var(--color-text)]">{label}</span>}

      {value.length > 0 && (
        <ul className="space-y-1.5">
          {value.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <GripVertical className="size-4 shrink-0 text-[var(--color-text-faint)]" />
              <input
                type="text"
                value={item}
                onChange={(e) => updateAt(index, e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="shrink-0 rounded p-1 text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text)] disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                className="shrink-0 rounded p-1 text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text)] disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="shrink-0 rounded p-1 text-[var(--color-text-faint)] transition-colors hover:text-red-400"
                aria-label="Remove"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-1.5">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Add an item…'}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <Button type="button" variant="secondary" size="sm" onClick={add}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
