import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { notifyContentChanged } from '@/lib/contentEvents';
import toast from 'react-hot-toast';
import { UserRound } from 'lucide-react';
import { DynamicStringList } from '@/components/admin/DynamicStringList';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { UsernameEditor } from '@/components/admin/UsernameEditor';
import { ServicesEditor, TestimonialsEditor } from '@/components/admin/ContentListEditors';
import { Button, Input, PageSpinner, Textarea } from '@/components/ui';
import { SettingsSection } from '@/components/admin/SettingsSection';
import { cn } from '@/utils/cn';
import type { Profile } from '@/types/models';
import { useFetch } from '@/hooks/useFetch';
import { profileService, type ProfileInput } from '@/services/profile.service';

/** Content fields only — design (theme, template, layout) is saved from Build portfolio. */
type ContentForm = Required<Omit<ProfileInput, 'theme' | 'template' | 'layout'>>;

const EMPTY_FORM: ContentForm = {
  name: '',
  headline: '',
  bio: '',
  location: '',
  email: '',
  profileImage: { url: '', publicId: '' },
  resumeUrl: '',
  availability: '',
  heroEyebrow: '',
  heroStatement: '',
  heroCurrently: '',
  heroTimezone: '',
  aboutText: '',
  focusAreas: [],
  services: [],
  testimonials: [],
};

function formOf(profile: Profile): ContentForm {
  return {
    name: profile.name,
    headline: profile.headline,
    bio: profile.bio,
    location: profile.location,
    email: profile.email,
    profileImage: profile.profileImage,
    resumeUrl: profile.resumeUrl,
    availability: profile.availability,
    heroEyebrow: profile.heroEyebrow,
    heroStatement: profile.heroStatement,
    heroCurrently: profile.heroCurrently,
    heroTimezone: profile.heroTimezone,
    aboutText: profile.aboutText,
    focusAreas: profile.focusAreas,
    services: profile.services ?? [],
    testimonials: profile.testimonials ?? [],
  };
}

/** One labelled group of fields: what it is on the left, the fields on the right. */
function Group({ title, description, children }: { title: string; description: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-4 border-b border-[var(--color-border)] px-5 py-6 last:border-b-0 md:grid-cols-[13rem_1fr] md:gap-8">
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">{description}</p>
      </div>
      <div className="min-w-0 space-y-4">{children}</div>
    </div>
  );
}

export default function ProfileSettings() {
  const fetcher = useCallback(() => profileService.get(), []);
  const { data: profile, isLoading, refetch } = useFetch(fetcher);

  const [saved, setSaved] = useState<ContentForm>(EMPTY_FORM);
  const [form, setForm] = useState<ContentForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const loaded = formOf(profile);
    setSaved(loaded);
    setForm(loaded);
  }, [profile]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  // Closing the tab with unsaved profile edits asks first.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const update = <K extends keyof ContentForm>(key: K, value: ContentForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await profileService.update({
        ...form,
        // Blank rows are drafts — drop them rather than failing validation.
        services: form.services.filter((s) => s.title.trim()),
        testimonials: form.testimonials.filter((t) => t.name.trim() && t.quote.trim()),
      });
      toast.success('Profile updated');
      setSaved(form);
      refetch();
      notifyContentChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <form onSubmit={handleSubmit}>
      <SettingsSection
        title="Profile"
        icon={UserRound}
        tone="accent"
        description="Who you are — shown at the top of your portfolio, in your About section, and on link previews."
        // Pinned to the screen only while there is something to save.
        stickyFooter={isDirty}
        footer={
          <>
            <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]" role="status">
              <span aria-hidden="true" className={cn('size-2 rounded-full', isDirty ? 'bg-amber-400' : 'bg-[var(--color-accent)]')} />
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
            <div className="flex gap-2">
              {isDirty && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setForm(saved)} disabled={isSubmitting}>
                  Discard
                </Button>
              )}
              <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!isDirty}>
                Save changes
              </Button>
            </div>
          </>
        }
      >
        <Group title="Public address" description={<>Your username is your portfolio’s link. Make it public from <b>Share</b> in the top bar. Saves on its own.</>}>
          <UsernameEditor id="profile-username" prefix={`${window.location.host}/p/`} label="Username" />
        </Group>

        <Group title="Photo" description="Shown next to your introduction, in your About section and on link previews. A square image works best.">
          <ImageUploader
            variant="avatar"
            hint="JPG, PNG or WebP."
            value={form.profileImage.url || null}
            onUploaded={(img) => update('profileImage', { url: img.url, publicId: img.publicId })}
            onRemove={() => update('profileImage', { url: '', publicId: '' })}
          />
        </Group>

        <Group title="Basics" description="Your name and a one-line headline appear across your portfolio.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} />
            <Input label="Headline" placeholder="e.g. Brand & product designer" value={form.headline} onChange={(e) => update('headline', e.target.value)} />
          </div>
          <Textarea label="Bio" hint="A sentence or two. Also used as the description on link previews." value={form.bio} onChange={(e) => update('bio', e.target.value)} rows={3} />
        </Group>

        <Group title="Contact & availability" description="How people reach you, and whether you’re open to work.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            <Input label="Location" placeholder="e.g. Kolkata, India" value={form.location} onChange={(e) => update('location', e.target.value)} />
            <Input label="Resume URL" placeholder="https://…" value={form.resumeUrl} onChange={(e) => update('resumeUrl', e.target.value)} />
            <Input label="Availability" placeholder="e.g. Open to freelance" value={form.availability} onChange={(e) => update('availability', e.target.value)} />
          </div>
        </Group>

        {/* Stored as hero* fields — "hero" is web-design jargon, so the labels say what it is. */}
        <Group
          title="Your introduction"
          description="The big welcome at the very top of your portfolio — the first thing visitors see before they scroll."
        >
          <Input
            label="Small line above your introduction"
            placeholder="e.g. Hello, I’m Sneha"
            hint="Optional. A short greeting or label shown in small text above your main introduction."
            value={form.heroEyebrow}
            onChange={(e) => update('heroEyebrow', e.target.value)}
          />
          <Textarea
            label="Main introduction"
            placeholder={'e.g. I design calm, useful products\nfor people who hate clutter.'}
            value={form.heroStatement}
            onChange={(e) => update('heroStatement', e.target.value)}
            rows={4}
            hint="One or two sentences about what you do, shown in large text. Press Enter to start a new line — your line breaks are kept."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="What you’re doing now"
              placeholder="e.g. Designing at Acme"
              hint="Optional. Your current role or project."
              value={form.heroCurrently}
              onChange={(e) => update('heroCurrently', e.target.value)}
            />
            <Input
              label="Your timezone"
              placeholder="e.g. IST (UTC+5:30)"
              hint="Optional. Helps people know when you’re reachable."
              value={form.heroTimezone}
              onChange={(e) => update('heroTimezone', e.target.value)}
            />
          </div>
        </Group>

        <Group title="About" description="A longer introduction, and the areas you focus on.">
          <Textarea label="About text" value={form.aboutText} onChange={(e) => update('aboutText', e.target.value)} rows={5} />
          <DynamicStringList label="Focus areas" value={form.focusAreas} onChange={(v) => update('focusAreas', v)} placeholder="Add a focus area…" />
        </Group>

        <Group title="Services" description="Shown by the Services section. Leave empty to fall back to your focus areas.">
          <ServicesEditor framed={false} value={form.services} onChange={(v) => update('services', v)} />
        </Group>

        <Group title="Testimonials" description="Quotes from clients, managers or teammates. The section stays hidden until you add one.">
          <TestimonialsEditor framed={false} value={form.testimonials} onChange={(v) => update('testimonials', v)} />
        </Group>
      </SettingsSection>
    </form>
  );
}
