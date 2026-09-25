import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge, Button, Card, ConfirmDialog, EmptyState, PageSpinner, Select } from '@/components/ui';
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Projects</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Manage your portfolio projects.</p>
        </div>
        <Button onClick={() => navigate('/admin/projects/new')}>
          <Plus className="size-4" />
          New project
        </Button>
      </div>

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

      {isLoading ? (
        <PageSpinner />
      ) : !data || data.items.length === 0 ? (
        <EmptyState title="No projects found" description="Try adjusting your search or filters." />
      ) : (
        <Card className="divide-y divide-[var(--color-border)]">
          {data.items.map((project) => (
            <div key={project._id} className="flex items-center gap-4 px-5 py-3.5">
              <img
                src={project.thumbnail?.url}
                alt=""
                className="size-12 shrink-0 rounded-md object-cover bg-[var(--color-bg-elevated-2)]"
              />
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
              <div className="flex shrink-0 gap-1">
                <Link
                  to={`/admin/projects/${project._id}/edit`}
                  className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-elevated-2)] hover:text-[var(--color-text)]"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </Link>
                <button
                  onClick={() => setDeleteTarget(project)}
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

      {data && data.meta.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-[var(--color-text-muted)]">
            Page {data.meta.page} of {data.meta.pages}
          </span>
          <Button variant="ghost" size="sm" disabled={page >= data.meta.pages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

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
