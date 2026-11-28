import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { TechBadge } from '@/components/tech/TechBadge';
import { CardContainer, CardBody, CardItem } from '@/components/aceternity/ThreeDCard';
import { ImagesBadge } from '@/components/aceternity/ImagesBadge';
import type { Project } from '@/types/models';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const gallery = project.images.slice(0, 3).map((img) => img.url).filter(Boolean);

  return (
    <div className="elevated-card group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-colors hover:border-[var(--color-border-hover)]">
      <CardContainer containerClassName="w-full py-0" className="w-full">
        <CardBody className="h-auto w-full">
          <Link to={`/work/${project.slug}`} className="block">
            <CardItem translateZ={30} className="block w-full">
              <div className="relative aspect-video overflow-hidden bg-[var(--color-bg-elevated-2)]">
                {project.thumbnail?.url ? (
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-[var(--color-text-faint)]">
                    <ImageOff className="size-8" />
                  </div>
                )}
              </div>
            </CardItem>

            <div className="space-y-3 p-5">
              <CardItem translateZ={50} className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                  {project.title}
                </h3>
                {project.year ? (
                  <span className="shrink-0 font-mono text-xs text-[var(--color-text-faint)]">{project.year}</span>
                ) : null}
              </CardItem>

              {project.shortDescription && (
                <CardItem translateZ={40} className="line-clamp-2 block text-sm text-[var(--color-text-muted)]">
                  {project.shortDescription}
                </CardItem>
              )}

              {project.technologies.length > 0 && (
                <CardItem translateZ={30} className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <TechBadge key={tech._id} technology={tech} className="px-2 py-1 text-[11px]" />
                  ))}
                </CardItem>
              )}
            </div>
          </Link>
        </CardBody>
      </CardContainer>

      {/* A flat footer row within the same card frame — kept outside the
          3D-tilted CardBody so the fan-out hover never composes with the
          card's own perspective/rotation transform, but still visually part
          of one cohesive card rather than a separate floating box. */}
      {gallery.length > 0 && (
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-border)] px-5 py-3">
          <span className="text-xs text-[var(--color-text-faint)]">Project gallery</span>
          <ImagesBadge
            text={`${gallery.length + 1} photos`}
            images={gallery}
            hoverImageSize={{ width: 44, height: 30 }}
            hoverTranslateY={-28}
            hoverSpread={16}
            hoverRotation={12}
          />
        </div>
      )}
    </div>
  );
}
