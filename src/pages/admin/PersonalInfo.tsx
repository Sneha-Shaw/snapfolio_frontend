import ProfileSettings from './ProfileSettings';
import Projects from './Projects';
import Experience from './Experience';
import Education from './Education';
import Technologies from './Technologies';
import SocialLinks from './SocialLinks';
import { PERSONAL_SECTIONS, type PersonalSectionId } from '@/config/adminSections';
import { useSectionNav } from '@/hooks/useSectionNav';
import { PortfolioHeader } from '@/components/admin/PortfolioHeader';

const COMPONENTS: Record<PersonalSectionId, () => React.JSX.Element> = {
  profile: ProfileSettings,
  projects: Projects,
  experience: Experience,
  education: Education,
  technologies: Technologies,
  'social-links': SocialLinks,
};

/** Everything the portfolio says about you, on one page — each section saves on its own. */
export default function PersonalInfo() {
  useSectionNav(PERSONAL_SECTIONS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Personal information</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Your content — the portfolio's design is set in Build portfolio.</p>
      </div>

      <PortfolioHeader />

      <div className="space-y-8">
        {PERSONAL_SECTIONS.map(({ id }) => {
          const Component = COMPONENTS[id];
          return (
            <section key={id} id={id} className="scroll-mt-6">
              <Component />
            </section>
          );
        })}
      </div>
    </div>
  );
}
