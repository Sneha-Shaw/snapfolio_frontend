import { useCallback, useState, type FormEvent } from 'react';
import { notifyContentChanged } from '@/lib/contentEvents';
import { Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge, Button, ConfirmDialog, Input, Modal, Select, Switch } from '@/components/ui';
import { AddButton, RowActions, SectionEmpty, SectionLoading, SettingsSection } from '@/components/admin/SettingsSection';
import { useFetch } from '@/hooks/useFetch';
import { socialLinkService, type SocialLinkInput } from '@/services/socialLink.service';
import { SOCIAL_PLATFORMS, type SocialLink } from '@/types/models';

const EMPTY_FORM: SocialLinkInput = {
  platform: 'github',
  label: '',
  url: '',
  icon: '',
  displayOrder: 0,
  enabled: true,
};

const PLATFORM_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  email: 'Email',
  twitter: 'Twitter / X',
  portfolio: 'Portfolio',
  other: 'Other',
};

export default function SocialLinks() {
  const listFetcher = useCallback(() => socialLinkService.list(true), []);
  const { data: links, isLoading, refetch } = useFetch(listFetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SocialLinkInput>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (link: SocialLink) => {
    setEditingId(link._id);
    setForm({
      platform: link.platform,
      label: link.label,
      url: link.url,
      icon: link.icon,
      displayOrder: link.displayOrder,
      enabled: link.enabled,
    });
    setIsModalOpen(true);
  };

  const update = <K extends keyof SocialLinkInput>(key: K, value: SocialLinkInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.label.trim() || !form.url.trim()) {
      toast.error('Label and URL are required');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await socialLinkService.update(editingId, form);
        toast.success('Social link updated');
      } else {
        await socialLinkService.create(form);
        toast.success('Social link added');
      }
      setIsModalOpen(false);
      refetch();
      notifyContentChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save social link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await socialLinkService.remove(deleteTarget._id);
      toast.success('Social link deleted');
      refetch();
      notifyContentChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete social link');
    }
  };

  const sorted = [...(links ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Social links"
        icon={Link2}
        tone="teal"
        description="Profiles and contact links shown on your portfolio."
        count={links?.length ?? 0}
        action={<AddButton onClick={openCreate}>Add link</AddButton>}
      >
        {isLoading ? (
          <SectionLoading />
        ) : sorted.length === 0 ? (
          <SectionEmpty title="No links yet" description="Add GitHub, LinkedIn, email and more." actionLabel="Add link" onAction={openCreate} />
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {sorted.map((link) => (
              <div key={link._id} className="flex items-center gap-4 px-5 py-3.5">
                <Badge>{PLATFORM_LABELS[link.platform] ?? link.platform}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--color-text)]">{link.label}</p>
                  <p className="truncate text-xs text-[var(--color-text-faint)]">{link.url}</p>
                </div>
                {!link.enabled && <Badge>Disabled</Badge>}
                <RowActions label={link.label || link.platform} onEdit={() => openEdit(link)} onDelete={() => setDeleteTarget(link)} />
              </div>
            ))}
          </div>
        )}
      </SettingsSection>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Social Link' : 'Add Social Link'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Platform" value={form.platform} onChange={(e) => update('platform', e.target.value as SocialLinkInput['platform'])}>
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p] ?? p}
              </option>
            ))}
          </Select>
          <Input label="Label" value={form.label} onChange={(e) => update('label', e.target.value)} required />
          <Input label="URL" value={form.url} onChange={(e) => update('url', e.target.value)} required />
          <Input
            label="Icon key"
            value={form.icon}
            onChange={(e) => update('icon', e.target.value)}
            hint="e.g. github, linkedin, mail"
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
              {editingId ? 'Save changes' : 'Add link'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete social link"
        description={`Are you sure you want to delete "${deleteTarget?.label}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
