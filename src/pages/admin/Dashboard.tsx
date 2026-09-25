import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckCircle2, FileEdit, Star, Cpu, Briefcase } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { Badge, Card, EmptyState, PageSpinner } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { dashboardService } from '@/services/dashboard.service';

export default function Dashboard() {
  const fetcher = useCallback(() => dashboardService.getStats(), []);
  const { data: stats, isLoading, error } = useFetch(fetcher);

  if (isLoading) return <PageSpinner />;

  if (error || !stats) {
    return (
      <EmptyState
        title="Failed to load dashboard"
        description={error?.message ?? 'Something went wrong'}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Overview of your portfolio content.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Projects" value={stats.totalProjects} icon={<FolderKanban className="size-5" />} />
        <StatCard label="Published" value={stats.publishedProjects} icon={<CheckCircle2 className="size-5" />} />
        <StatCard label="Drafts" value={stats.draftProjects} icon={<FileEdit className="size-5" />} />
        <StatCard label="Featured" value={stats.featuredProjects} icon={<Star className="size-5" />} />
        <StatCard label="Technologies" value={stats.totalTechnologies} icon={<Cpu className="size-5" />} />
        <StatCard label="Experience Entries" value={stats.totalExperience} icon={<Briefcase className="size-5" />} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-text)]">Recent Projects</h2>
        {stats.recentProjects.length === 0 ? (
          <EmptyState title="No projects yet" description="Create your first project to see it here." />
        ) : (
          <Card className="divide-y divide-[var(--color-border)]">
            {stats.recentProjects.map((project) => (
              <Link
                key={project._id}
                to={`/admin/projects/${project._id}/edit`}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--color-bg-elevated-2)]"
              >
                <img
                  src={project.thumbnail?.url}
                  alt=""
                  className="size-12 shrink-0 rounded-md object-cover bg-[var(--color-bg-elevated-2)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--color-text)]">{project.title}</p>
                  <p className="text-xs text-[var(--color-text-faint)]">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {project.featured && <Badge className="border-[var(--color-accent)]/30 text-[var(--color-accent)]">Featured</Badge>}
                  <Badge className={project.published ? 'text-green-400' : 'text-[var(--color-text-faint)]'}>
                    {project.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </Link>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
