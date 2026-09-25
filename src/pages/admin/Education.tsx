import { useCallback, useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Card, ConfirmDialog, EmptyState, Input, Modal, PageSpinner, Textarea } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { educationService, type EducationInput } from '@/services/education.service';
import type { Education as EducationModel } from '@/types/models';
import { formatDateRange, toInputDate } from '@/utils/format';

const EMPTY_FORM: EducationInput = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  description: '',
  displayOrder: 0,
};

export default function Education() {
  const listFetcher = useCallback(() => educationService.list(), []);
  const { data: education, isLoading, refetch } = useFetch(listFetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EducationInput>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EducationModel | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (edu: EducationModel) => {
    setEditingId(edu._id);
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: toInputDate(edu.startDate),
      endDate: toInputDate(edu.endDate),
      description: edu.description,
      displayOrder: edu.displayOrder,
    });
    setIsModalOpen(true);
  };

  const update = <K extends keyof EducationInput>(key: K, value: EducationInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.institution.trim() || !form.degree.trim() || !form.startDate) {
      toast.error('Institution, degree and start date are required');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: EducationInput = { ...form, endDate: form.endDate || undefined };
      if (editingId) {
        await educationService.update(editingId, payload);
        toast.success('Education updated');
      } else {
        await educationService.create(payload);
        toast.success('Education added');
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save education');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await educationService.remove(deleteTarget._id);
      toast.success('Education deleted');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete education');
    }
  };

  const sorted = [...(education ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Education</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Manage your education history.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add education
        </Button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : sorted.length === 0 ? (
        <EmptyState title="No education yet" description="Add your first education entry." />
      ) : (
        <Card className="divide-y divide-[var(--color-border)]">
          {sorted.map((edu) => (
            <div key={edu._id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--color-text)]">
                  {edu.degree}
                  {edu.field ? `, ${edu.field}` : ''}
                </p>
                <p className="text-xs text-[var(--color-text-faint)]">
                  {edu.institution} · {formatDateRange(edu.startDate, edu.endDate, false)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(edu)}
                  className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(edu)}
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
        title={editingId ? 'Edit Education' : 'Add Education'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Institution" value={form.institution} onChange={(e) => update('institution', e.target.value)} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Degree" value={form.degree} onChange={(e) => update('degree', e.target.value)} required />
            <Input label="Field of study" value={form.field} onChange={(e) => update('field', e.target.value)} />
          </div>
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
            />
          </div>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
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
              {editingId ? 'Save changes' : 'Add education'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete education"
        description={`Are you sure you want to delete "${deleteTarget?.degree}" at "${deleteTarget?.institution}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
