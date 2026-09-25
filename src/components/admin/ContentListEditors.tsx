import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Card, Input, Textarea } from '@/components/ui';
import type { Service, Testimonial } from '@/types/models';

/** Generic ordered list editor: add / remove / reorder rows, each rendered by `renderItem`. */
function ListEditor<T>({
  title,
  hint,
  items,
  onChange,
  empty,
  addLabel,
  renderItem,
}: {
  title: string;
  hint: string;
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
}) {
  const iconBtn =
    'rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)] disabled:opacity-30';
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const [row] = next.splice(i, 1);
    if (row !== undefined) next.splice(i + dir, 0, row);
    onChange(next);
  };

  return (
    <Card className="space-y-4 p-5">
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
        <p className="mt-1 text-xs text-[var(--color-text-faint)]">{hint}</p>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-text-faint)]">#{i + 1}</span>
            <div className="flex gap-0.5">
              <button type="button" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                <ArrowUp className="size-4" />
              </button>
              <button type="button" className={iconBtn} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                <ArrowDown className="size-4" />
              </button>
              <button type="button" className={`${iconBtn} hover:text-red-400`} onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          {renderItem(item, (patch) => onChange(items.map((row, j) => (j === i ? { ...row, ...patch } : row))))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, empty])}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-border-hover)] py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        <Plus className="size-4" /> {addLabel}
      </button>
    </Card>
  );
}

export function ServicesEditor({ value, onChange }: { value: Service[]; onChange: (v: Service[]) => void }) {
  return (
    <ListEditor
      title="Services"
      hint="Shown by the Services section. Leave empty to fall back to your focus areas (titles only)."
      items={value}
      onChange={onChange}
      empty={{ title: '', description: '' }}
      addLabel="Add service"
      renderItem={(item, update) => (
        <div className="space-y-3">
          <Input label="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Full-stack development" />
          <Textarea label="Description" value={item.description} onChange={(e) => update({ description: e.target.value })} rows={2} />
        </div>
      )}
    />
  );
}

export function TestimonialsEditor({ value, onChange }: { value: Testimonial[]; onChange: (v: Testimonial[]) => void }) {
  return (
    <ListEditor
      title="Testimonials"
      hint="Quotes from clients, managers or teammates. The Testimonials section is hidden until you add at least one."
      items={value}
      onChange={onChange}
      empty={{ name: '', role: '', company: '', quote: '', avatarUrl: '' }}
      addLabel="Add testimonial"
      renderItem={(item, update) => (
        <div className="grid gap-4 md:grid-cols-[1fr_160px]">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input label="Name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
              <Input label="Role" value={item.role} onChange={(e) => update({ role: e.target.value })} />
              <Input label="Company" value={item.company} onChange={(e) => update({ company: e.target.value })} />
            </div>
            <Textarea label="Quote" value={item.quote} onChange={(e) => update({ quote: e.target.value })} rows={3} />
          </div>
          <ImageUploader
            label="Photo (optional)"
            value={item.avatarUrl || null}
            onUploaded={(img) => update({ avatarUrl: img.url })}
            onRemove={() => update({ avatarUrl: '' })}
          />
        </div>
      )}
    />
  );
}
