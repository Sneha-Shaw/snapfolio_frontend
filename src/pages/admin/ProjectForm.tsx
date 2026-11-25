import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { TechMultiSelect } from '@/components/admin/TechMultiSelect';
import { Button, Card, Input, PageSpinner, Switch, Textarea } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { projectService, type ProjectInput } from '@/services/project.service';
import { technologyService } from '@/services/technology.service';
import type { ProjectImage } from '@/types/models';

const EMPTY_FORM: ProjectInput = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  thumbnail: { url: '', publicId: '' },
  images: [],
  featured: false,
  published: false,
  displayOrder: 0,
  year: new Date().getFullYear(),
  role: '',
  liveUrl: '',
  githubUrl: '',
  challenges: '',
  solution: '',
  results: '',
  technologies: [],
};

export default function ProjectForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<ProjectInput>(EMPTY_FORM);
  const [isLoadingProject, setIsLoadingProject] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const techFetcher = useCallback(() => technologyService.list(true), []);
  const { data: technologies } = useFetch(techFetcher);

  useEffect(() => {
    if (!id) return;
    setIsLoadingProject(true);
    projectService
      .getById(id)
      .then((project) => {
        setForm({
          title: project.title,
          slug: project.slug,
          shortDescription: project.shortDescription,
          description: project.description,
          thumbnail: project.thumbnail,
          images: project.images,
          featured: project.featured,
          published: project.published,
          displayOrder: project.displayOrder,
          year: project.year,
          role: project.role,
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          challenges: project.challenges,
          solution: project.solution,
          results: project.results,
          technologies: project.technologies.map((t) => t._id),
        });
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load project'))
      .finally(() => setIsLoadingProject(false));
  }, [id]);

  const update = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const addImage = (image: { url: string; publicId: string; width?: number; height?: number }) => {
    setForm((f) => ({ ...f, images: [...f.images, { ...image, alt: '', displayOrder: f.images.length }] }));
  };

  const updateImageAt = (index: number, patch: Partial<ProjectImage>) => {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) => (i === index ? { ...img, ...patch } : img)),
    }));
  };

  const removeImageAt = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.shortDescription.trim() || !form.description.trim()) {
      toast.error('Title, short description and description are required');
      return;
    }
    if (!form.thumbnail.url) {
      toast.error('Please upload a thumbnail image');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ProjectInput = { ...form, slug: form.slug?.trim() || undefined };
      if (isEditing && id) {
        await projectService.update(id, payload);
        toast.success('Project updated');
      } else {
        await projectService.create(payload);
        toast.success('Project created');
      }
      navigate('/admin/personal#projects');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProject) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          {isEditing ? 'Edit Project' : 'New Project'}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {isEditing ? 'Update the details of this project.' : 'Add a new project to your portfolio.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Basics</h2>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
          />
          <Input
            label="Slug"
            value={form.slug ?? ''}
            onChange={(e) => update('slug', e.target.value)}
            hint="Leave blank to auto-generate from the title"
          />
          <Textarea
            label="Short description"
            value={form.shortDescription}
            onChange={(e) => update('shortDescription', e.target.value)}
            rows={2}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={5}
            required
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Input
              label="Year"
              type="number"
              value={form.year}
              onChange={(e) => update('year', Number(e.target.value))}
            />
            <Input label="Role" value={form.role} onChange={(e) => update('role', e.target.value)} />
            <Input
              label="Display order"
              type="number"
              value={form.displayOrder}
              onChange={(e) => update('displayOrder', Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Live URL" value={form.liveUrl} onChange={(e) => update('liveUrl', e.target.value)} />
            <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => update('githubUrl', e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-6 pt-1">
            <Switch checked={form.featured} onChange={(v) => update('featured', v)} label="Featured" />
            <Switch checked={form.published} onChange={(v) => update('published', v)} label="Published" />
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Case Study</h2>
          <Textarea
            label="Challenges"
            value={form.challenges}
            onChange={(e) => update('challenges', e.target.value)}
            rows={3}
          />
          <Textarea
            label="Solution"
            value={form.solution}
            onChange={(e) => update('solution', e.target.value)}
            rows={3}
          />
          <Textarea
            label="Results"
            value={form.results}
            onChange={(e) => update('results', e.target.value)}
            rows={3}
          />
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Technologies</h2>
          <TechMultiSelect
            technologies={technologies ?? []}
            value={form.technologies}
            onChange={(ids) => update('technologies', ids)}
          />
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Thumbnail</h2>
          <div className="max-w-xs">
            <ImageUploader
              value={form.thumbnail.url || null}
              onUploaded={(img) => update('thumbnail', { url: img.url, publicId: img.publicId })}
              onRemove={() => update('thumbnail', { url: '', publicId: '' })}
            />
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Gallery Images</h2>
          </div>

          <div className="space-y-4">
            {form.images.map((image, index) => (
              <div key={image.publicId + index} className="flex gap-4 rounded-lg border border-[var(--color-border)] p-3">
                <img src={image.url} alt="" className="size-20 shrink-0 rounded-md object-cover" />
                <div className="flex-1 space-y-2">
                  <Input
                    label="Alt text"
                    value={image.alt}
                    onChange={(e) => updateImageAt(index, { alt: e.target.value })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImageAt(index)}
                  className="shrink-0 self-start rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Remove image"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="max-w-xs">
            <ImageUploader value={null} onUploaded={addImage} hint="Add another image to the gallery" />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/personal#projects')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            <Plus className="size-4" />
            {isEditing ? 'Save changes' : 'Create project'}
          </Button>
        </div>
      </form>
    </div>
  );
}
