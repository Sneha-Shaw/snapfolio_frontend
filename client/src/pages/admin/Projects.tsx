import { useCallback, useState } from 'react';
import { notifyContentChanged } from '@/lib/contentEvents';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pencil, Search, Star, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge, Button, ConfirmDialog, Select } from '@/components/ui';
import { AddButton, RowActions, SectionEmpty, SectionLoading, SettingsSection, rowIconBtn } from '@/components/admin/SettingsSection';
import { useFetch } from '@/hooks/useFetch';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/models';

type PublishedFilter = 'all' | 'published' | 'draft';

export default function Projects() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<PublishedFilter>('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const fetcher = useCallback(
    () =>
      projectService.listAdmin({
        search: search.trim() || undefined,
        published: publishedFilter === 'all' ? undefined : publishedFilter === 'published',
        page,
        limit: 10,
      }),
    [search, publishedFilter, page]
  );
  const { data, isLoading, refetch } = useFetch(fetcher, [search, publishedFilter, page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await projectService.remove(deleteTarget._id);
      toast.success('Project deleted');
      refetch();
      notifyContentChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Projects"
        icon={FolderKanban}
        tone="violet"
        description="Case studies and work on your portfolio. Only published projects are visible to visitors."
        count={data?.meta.total ?? 0}
        action={<AddButton onClick={() => navigate('/admin/projects/new')}>New project</AddButton>}
        toolbar={
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-faint)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search projects…"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <Select
              value={publishedFilter}
              onChange={(e) => {
                setPublishedFilter(e.target.value as PublishedFilter);
                setPage(1);
              }}
              className="w-auto"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
        }
        footer={
          data && data.meta.pages > 1 ? (
            <>
              <span className="text-sm text-[var(--color-text-muted)]">
                Page {data.meta.page} of {data.meta.pages} · {data.meta.total} projects
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="ghost" size="sm" disabled={page >= data.meta.pages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </>
          ) : undefined
        }
      >
        {isLoading ? (
          <SectionLoading />
        ) : !data || data.items.length === 0 ? (
          search || publishedFilter !== 'all' ? (
        <SectionEmpty title="No matching projects" description="Try a different search or status." />
      ) : (
        <SectionEmpty title="No projects yet" description="Add the work you want visitors to see." actionLabel="New project" onAction={() => navigate('/admin/projects/new')} />
      )
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {data.items.map((project) => (
              <div key={project._id} className="flex items-center gap-4 px-5 py-3.5">
                {project.thumbnail?.url ? (
                  <img src={project.thumbnail.url} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-violet-500/12 text-violet-500" aria-hidden="true">
                    <FolderKanban className="size-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate font-medium text-[var(--color-text)]">
                    {project.featured && <Star className="size-3.5 shrink-0 fill-[var(--color-accent)] text-[var(--color-accent)]" />}
                    {project.title}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-faint)]">{project.shortDescription}</p>
                </div>
                <Badge className={project.published ? 'text-green-400' : 'text-[var(--color-text-faint)]'}>
                  {project.published ? 'Published' : 'Draft'}
                </Badge>
                <RowActions
                  label={project.title}
                  editHref={
                    <Link to={`/admin/projects/${project._id}/edit`} className={rowIconBtn} aria-label={`Edit ${project.title}`} title="Edit">
                      <Pencil className="size-4" />
                    </Link>
                  }
                  onDelete={() => setDeleteTarget(project)}
                />
              </div>
            ))}
          </div>
        )}
      </SettingsSection>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete project"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
