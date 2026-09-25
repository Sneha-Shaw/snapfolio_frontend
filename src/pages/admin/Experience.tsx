import { useCallback, useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { DynamicStringList } from '@/components/admin/DynamicStringList';
import { TechMultiSelect } from '@/components/admin/TechMultiSelect';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  PageSpinner,
  Switch,
  Textarea,
} from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { experienceService, type ExperienceInput } from '@/services/experience.service';
import { technologyService } from '@/services/technology.service';
import type { Experience as ExperienceModel } from '@/types/models';
import { formatDateRange, toInputDate } from '@/utils/format';

const EMPTY_FORM: ExperienceInput = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  responsibilities: [],
  technologies: [],
  displayOrder: 0,
};

export default function Experience() {
  const listFetcher = useCallback(() => experienceService.list(), []);
  const { data: experiences, isLoading, refetch } = useFetch(listFetcher);
  const techFetcher = useCallback(() => technologyService.list(true), []);
  const { data: technologies } = useFetch(techFetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceInput>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceModel | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (exp: ExperienceModel) => {
    setEditingId(exp._id);
    setForm({
      company: exp.company,
      position: exp.position,
      location: exp.location,
      startDate: toInputDate(exp.startDate),
      endDate: toInputDate(exp.endDate),
      current: exp.current,
      description: exp.description,
      responsibilities: exp.responsibilities,
      technologies: exp.technologies.map((t) => t._id),
      displayOrder: exp.displayOrder,
    });
    setIsModalOpen(true);
  };

  const update = <K extends keyof ExperienceInput>(key: K, value: ExperienceInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim() || !form.startDate) {
      toast.error('Company, position and start date are required');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: ExperienceInput = { ...form, endDate: form.current ? undefined : form.endDate || undefined };
      if (editingId) {
        await experienceService.update(editingId, payload);
        toast.success('Experience updated');
      } else {
        await experienceService.create(payload);
        toast.success('Experience added');
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save experience');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await experienceService.remove(deleteTarget._id);
      toast.success('Experience deleted');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete experience');
    }
  };

  const sorted = [...(experiences ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Experience</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Manage your work history.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add experience
        </Button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : sorted.length === 0 ? (
        <EmptyState title="No experience yet" description="Add your first work experience." />
      ) : (
        <Card className="divide-y divide-[var(--color-border)]">
          {sorted.map((exp) => (
            <div key={exp._id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--color-text)]">
                  {exp.position} <span className="text-[var(--color-text-faint)]">@ {exp.company}</span>
                </p>
                <p className="text-xs text-[var(--color-text-faint)]">
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  {exp.location ? ` · ${exp.location}` : ''}
                </p>
              </div>
              {exp.current && <Badge className="text-green-400">Current</Badge>}
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(exp)}
                  className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(exp)}
                  className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Experience' : 'Add Experience'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Company" value={form.company} onChange={(e) => update('company', e.target.value)} required />
            <Input label="Position" value={form.position} onChange={(e) => update('position', e.target.value)} required />
          </div>
          <Input label="Location" value={form.location} onChange={(e) => update('location', e.target.value)} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Start date"
              type="date"
              value={form.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              required
            />
            <Input
              label="End date"
              type="date"
              value={form.endDate ?? ''}
              onChange={(e) => update('endDate', e.target.value)}
              disabled={form.current}
            />
          </div>
          <Switch checked={form.current} onChange={(v) => update('current', v)} label="Currently working here" />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
          />
          <DynamicStringList
            label="Responsibilities"
            value={form.responsibilities}
            onChange={(v) => update('responsibilities', v)}
            placeholder="Add a responsibility…"
          />
          <TechMultiSelect
            label="Technologies"
            technologies={technologies ?? []}
            value={form.technologies}
            onChange={(v) => update('technologies', v)}
          />
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
              {editingId ? 'Save changes' : 'Add experience'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete experience"
        description={`Are you sure you want to delete "${deleteTarget?.position}" at "${deleteTarget?.company}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
