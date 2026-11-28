import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { notifyContentChanged } from '@/lib/contentEvents';
import { Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTechIcon } from '@/lib/techIcons';
import { Badge, Button, ConfirmDialog, Input, Modal, Select, Switch } from '@/components/ui';
import { AddButton, RowActions, SectionEmpty, SectionLoading, SettingsSection } from '@/components/admin/SettingsSection';
import { useFetch } from '@/hooks/useFetch';
import { technologyService, type TechnologyInput } from '@/services/technology.service';
import { TECH_CATEGORIES, type Technology } from '@/types/models';

const EMPTY_FORM: TechnologyInput = {
  name: '',
  slug: '',
  icon: '',
  category: 'frontend',
  documentationUrl: '',
  enabled: true,
  displayOrder: 0,
};

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  'ai-data': 'AI & Data',
  devops: 'DevOps',
  language: 'Language',
  tooling: 'Tooling',
};

export default function Technologies() {
  const listFetcher = useCallback(() => technologyService.list(true), []);
  const { data: technologies, isLoading, refetch } = useFetch(listFetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TechnologyInput>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Technology | null>(null);

  const grouped = useMemo(() => {
    const groups = new Map<string, Technology[]>();
    for (const tech of technologies ?? []) {
      const list = groups.get(tech.category) ?? [];
      list.push(tech);
      groups.set(tech.category, list);
    }
    for (const list of groups.values()) list.sort((a, b) => a.displayOrder - b.displayOrder);
    return TECH_CATEGORIES.filter((c) => groups.has(c)).map((c) => [c, groups.get(c)!] as const);
  }, [technologies]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (tech: Technology) => {
    setEditingId(tech._id);
    setForm({
      name: tech.name,
      slug: tech.slug,
      icon: tech.icon,
      category: tech.category,
      documentationUrl: tech.documentationUrl,
      enabled: tech.enabled,
      displayOrder: tech.displayOrder,
    });
    setIsModalOpen(true);
  };

  const update = <K extends keyof TechnologyInput>(key: K, value: TechnologyInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: TechnologyInput = { ...form, slug: form.slug?.trim() || undefined };
      if (editingId) {
        await technologyService.update(editingId, payload);
        toast.success('Technology updated');
      } else {
        await technologyService.create(payload);
        toast.success('Technology added');
      }
      setIsModalOpen(false);
      refetch();
      notifyContentChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save technology');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await technologyService.remove(deleteTarget._id);
      toast.success('Technology deleted');
      refetch();
      notifyContentChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete technology');
    }
  };

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Technologies"
        icon={Cpu}
        tone="pink"
        description="Tags you attach to projects and roles — they show as icons on your portfolio."
        count={technologies?.length ?? 0}
        action={<AddButton onClick={openCreate}>Add technology</AddButton>}
      >
        {isLoading ? (
          <SectionLoading />
        ) : grouped.length === 0 ? (
          <SectionEmpty title="No technologies yet" description="Add the tools and languages you work with." actionLabel="Add technology" onAction={openCreate} />
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {grouped.map(([category, items]) => (
              <div key={category}>
                <h3 className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated-2)]/40 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-faint)]">
                  {CATEGORY_LABELS[category] ?? category} <span className="font-normal normal-case tracking-normal">· {items.length}</span>
                </h3>
                <div className="divide-y divide-[var(--color-border)]">
                  {items.map((tech) => {
                    const Icon = getTechIcon(tech.slug, tech.category);
                    return (
                      <div key={tech._id} className="flex items-center gap-4 px-5 py-3">
                        <Icon className="size-5 shrink-0 text-[var(--color-text-muted)]" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[var(--color-text)]">{tech.name}</p>
                          <p className="font-mono text-xs text-[var(--color-text-faint)]">{tech.slug}</p>
                        </div>
                        {!tech.enabled && <Badge>Disabled</Badge>}
                        <RowActions label={tech.name} onEdit={() => openEdit(tech)} onDelete={() => setDeleteTarget(tech)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </SettingsSection>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Technology' : 'Add Technology'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <Input
            label="Slug"
            value={form.slug ?? ''}
            onChange={(e) => update('slug', e.target.value)}
            hint="Leave blank to auto-generate from the name"
          />
          <Input
            label="Icon key"
            value={form.icon ?? ''}
            onChange={(e) => update('icon', e.target.value)}
            hint="e.g. react, typescript, nodejs — matches an icon in the tech icon set"
          />
          <Select label="Category" value={form.category} onChange={(e) => update('category', e.target.value as TechnologyInput['category'])}>
            {TECH_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] ?? c}
              </option>
            ))}
          </Select>
          <Input
            label="Documentation URL"
            value={form.documentationUrl}
            onChange={(e) => update('documentationUrl', e.target.value)}
          />
          <Switch checked={form.enabled} onChange={(v) => update('enabled', v)} label="Enabled" />
          <Input
            label="Display order"
            type="number"
            value={form.displayOrder}
            onChange={(e) => update('displayOrder', Number(e.target.value))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingId ? 'Save changes' : 'Add technology'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete technology"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
