import { useCallback, useEffect, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { DynamicStringList } from '@/components/admin/DynamicStringList';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { AppearanceSettings } from '@/components/admin/AppearanceSettings';
import { Button, Card, Input, PageSpinner, Textarea } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { useTheme } from '@/context/ThemeContext';
import { profileService, type ProfileInput } from '@/services/profile.service';
import { DEFAULT_THEME } from '@/lib/themes';
import type { SiteTemplate, SiteTheme } from '@/types/models';

const EMPTY_FORM: Required<ProfileInput> = {
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
  theme: DEFAULT_THEME,
  template: 'aurora',
};

export default function ProfileSettings() {
  const fetcher = useCallback(() => profileService.get(), []);
  const { data: profile, isLoading, refetch } = useFetch(fetcher);
  const { setTheme, setTemplate } = useTheme();

  const [form, setForm] = useState<Required<ProfileInput>>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm({
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
      theme: { ...DEFAULT_THEME, ...profile.theme },
      template: profile.template ?? 'aurora',
    });
  }, [profile]);

  const update = <K extends keyof ProfileInput>(key: K, value: Required<ProfileInput>[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const updateTheme = (next: SiteTheme) => {
    update('theme', next);
    setTheme(next); // live-preview across the whole site immediately
  };

  const updateTemplate = (next: SiteTemplate) => {
    update('template', next);
    setTemplate(next);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await profileService.update(form);
      toast.success('Profile updated');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Profile</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Content shown on the public site's home page and about section.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Basics</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} />
            <Input label="Headline" value={form.headline} onChange={(e) => update('headline', e.target.value)} />
          </div>
          <Textarea label="Bio" value={form.bio} onChange={(e) => update('bio', e.target.value)} rows={3} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Location" value={form.location} onChange={(e) => update('location', e.target.value)} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Resume URL" value={form.resumeUrl} onChange={(e) => update('resumeUrl', e.target.value)} />
            <Input label="Availability" value={form.availability} onChange={(e) => update('availability', e.target.value)} />
          </div>
          <div className="max-w-xs">
            <ImageUploader
              label="Profile image"
              value={form.profileImage.url || null}
              onUploaded={(img) => update('profileImage', { url: img.url, publicId: img.publicId })}
              onRemove={() => update('profileImage', { url: '', publicId: '' })}
            />
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Hero Section</h2>
          <Input label="Hero eyebrow" value={form.heroEyebrow} onChange={(e) => update('heroEyebrow', e.target.value)} />
          <Textarea
            label="Hero statement"
            value={form.heroStatement}
            onChange={(e) => update('heroStatement', e.target.value)}
            rows={4}
            hint="This field intentionally contains literal newline (\n) characters that control line breaks in the public hero heading."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Currently doing" value={form.heroCurrently} onChange={(e) => update('heroCurrently', e.target.value)} />
            <Input label="Timezone" value={form.heroTimezone} onChange={(e) => update('heroTimezone', e.target.value)} />
          </div>
        </Card>

        <AppearanceSettings
          theme={form.theme}
          template={form.template}
          onThemeChange={updateTheme}
          onTemplateChange={updateTemplate}
        />

        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">About</h2>
          <Textarea label="About text" value={form.aboutText} onChange={(e) => update('aboutText', e.target.value)} rows={5} />
          <DynamicStringList
            label="Focus areas"
            value={form.focusAreas}
            onChange={(v) => update('focusAreas', v)}
            placeholder="Add a focus area…"
          />
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
