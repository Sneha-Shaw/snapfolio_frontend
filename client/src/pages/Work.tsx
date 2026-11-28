import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '@/hooks/useFetch';
import { projectService } from '@/services/project.service';
import { ProjectGrid } from '@/components/work/ProjectGrid';
import { GooeyInput } from '@/components/aceternity/GooeyInput';
import { PageSpinner } from '@/components/ui';

export default function Work() {
  const { data: projects, isLoading } = useFetch(() => projectService.listPublic(), []);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const items = projects ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((p) =>
      [p.title, p.shortDescription, ...p.technologies.map((t) => t.name)].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [projects, search]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
      >
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-text-faint)]">
            Portfolio
          </p>
          <h1 className="text-balance text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">Selected work</h1>
          <p className="mt-4 max-w-xl text-[var(--color-text-muted)]">
            A collection of projects I&apos;ve designed, built, and shipped.
          </p>
        </div>

        <GooeyInput
          placeholder="Search by title or tech..."
          value={search}
          onChange={setSearch}
          className="w-full shrink-0 sm:w-auto"
        />
      </motion.div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <ProjectGrid
          projects={filtered}
          emptyTitle={search ? 'No projects match your search' : 'No projects published yet'}
          emptyDescription={search ? 'Try a different title or technology.' : 'Check back soon for new work.'}
        />
      )}
    </div>
  );
}
