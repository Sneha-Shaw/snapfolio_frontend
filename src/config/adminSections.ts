/** In-page sections of the long admin pages — listed as sub-links under their sidebar item. */
export const PERSONAL_SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'social-links', label: 'Social links' },
] as const;

export const BUILD_SECTIONS = [
  { id: 'layouts', label: 'Starting layout' },
  { id: 'sections', label: 'Sections' },
  { id: 'theme', label: 'Theme' },
  { id: 'footer', label: 'Footer' },
] as const;

export type PersonalSectionId = (typeof PERSONAL_SECTIONS)[number]['id'];

/** Fired as sections scroll into view, so the sidebar can highlight the current one. */
export const ACTIVE_SECTION_EVENT = 'admin:active-section';
