import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/types/models';

interface ProjectGridProps {
  projects: Project[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProjectGrid({
  projects,
  emptyTitle = 'No projects yet',
  emptyDescription = 'Check back soon.',
}: ProjectGridProps) {
  if (projects.length === 0) {
    return <EmptyState icon={<FolderOpen className="size-8" />} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.05 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
