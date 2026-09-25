import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, FolderOpen } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { projectService } from '@/services/project.service';
import { ApiRequestError } from '@/services/api';
import { TechBadge } from '@/components/tech/TechBadge';
import { PageSpinner, EmptyState } from '@/components/ui';

const NARRATIVE_SECTIONS: Array<{ key: 'challenges' | 'solution' | 'results'; label: string }> = [
  { key: 'challenges', label: 'The challenge' },
  { key: 'solution', label: 'The solution' },
  { key: 'results', label: 'The results' },
];

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, error, isLoading } = useFetch(() => projectService.getBySlug(slug ?? ''), [slug]);

  if (isLoading) return <PageSpinner />;

  if (!project) {
    const notFound = error instanceof ApiRequestError && error.status === 404;
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <EmptyState
          icon={<FolderOpen className="size-8" />}
          title="Project not found"
          description={notFound ? "This project doesn't exist or isn't published." : (error?.message ?? undefined)}
          action={
            <Link
              to="/work"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-bg-elevated-2)] px-4 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border-hover)]"
            >
              <ArrowLeft className="size-4" /> Back to work
            </Link>
          }
        />
      </div>
    );
  }

  const sortedImages = [...project.images].sort((a, b) => a.displayOrder - b.displayOrder);
  const meta = [project.role, project.year ? String(project.year) : ''].filter(Boolean);

  return (
    <div>
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden bg-[var(--color-bg-elevated)] sm:h-[55vh]">
        {project.thumbnail?.url && (
          <img src={project.thumbnail.url} alt={project.title} className="size-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          to="/work"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          <ArrowLeft className="size-4" /> Back to work
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {meta.length > 0 && (
            <p className="mb-3 font-mono text-sm text-[var(--color-text-faint)]">{meta.join(' · ')}</p>
          )}

          <h1 className="text-balance text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">
            {project.title}
          </h1>

          {project.shortDescription && (
            <p className="mt-4 text-lg text-[var(--color-text-muted)]">{project.shortDescription}</p>
          )}

          {project.technologies.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <TechBadge key={tech._id} technology={tech} />
              ))}
            </div>
          )}

          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)] hover:text-[var(--color-on-accent-strong)]"
                >
                  <ExternalLink className="size-4" /> Live site
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-bg-elevated-2)] px-4 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border-hover)]"
                >
                  <Github className="size-4" /> Source
                </a>
              )}
            </div>
          )}
        </motion.div>

        {project.description && (
          <div className="mt-14 space-y-3">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Overview</h2>
            <p className="whitespace-pre-line leading-relaxed text-[var(--color-text-muted)]">
              {project.description}
            </p>
          </div>
        )}

        {NARRATIVE_SECTIONS.map(({ key, label }) => {
          const value = project[key];
          if (!value) return null;
          return (
            <div key={key} className="mt-10 space-y-3">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">{label}</h2>
              <p className="whitespace-pre-line leading-relaxed text-[var(--color-text-muted)]">{value}</p>
            </div>
          );
        })}

        {sortedImages.length > 0 && (
          <div className="mt-14 space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {sortedImages.map((image) => (
                <motion.img
                  key={image._id ?? image.publicId}
                  src={image.url}
                  alt={image.alt || project.title}
                  loading="lazy"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4 }}
                  className="rounded-xl border border-[var(--color-border)] object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
