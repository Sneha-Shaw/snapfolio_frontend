import { collect, backdrop, motionOrnament, ornament, panelFrame, type MotifKit, type MotifSectionName } from './motifKit';
import type { SectionVariant } from './shared';

/**
 * One kit per concept motif — 28 of them.
 *
 * Each declaration is small on purpose: the material housing plus an ornament
 * and (where the motif has weather or atmosphere) a backdrop. `buildMotifSections`
 * turns that into a complete matched set of ten sections, so a concept preset
 * can be 100% on-motif without 122 bespoke components.
 *
 * The materials referenced here are the same classes the bespoke hero designs
 * use — `.veneer`, `.carbon`, `.book-cloth`, `.ecg-paper`, `.alu` and so on —
 * which is what ties a preset's hero to the rest of its page.
 */

export const MOTIF_KITS: MotifKit[] = [
  // --- Nature -------------------------------------------------------------
  {
    id: 'arachnid',
    label: 'Silk panel',
    Frame: panelFrame(''),
    Backdrop: backdrop('web-silk', 0.28),
    Bullet: ornament('web-dew rounded-full', 'size-2'),
    tileClass: 'rounded-lg',
  },
  {
    id: 'canopy',
    label: 'Bark panel',
    Frame: panelFrame('', { fibre: true }),
    Backdrop: backdrop('bark', 0.12),
    Bullet: ornament('leaf', 'size-3'),
    titleClass: 'font-serif',
  },
  {
    id: 'bloom',
    label: 'Petal panel',
    Frame: panelFrame(''),
    Bullet: ornament('petal', 'size-3'),
    tileClass: 'rounded-3xl',
  },
  {
    id: 'orbital',
    label: 'Orbit panel',
    Frame: panelFrame(''),
    Backdrop: backdrop('nebula', 0.3),
    Bullet: motionOrnament('bg-[var(--color-accent)]'),
    tileClass: 'rounded-2xl',
  },

  // --- Objects ------------------------------------------------------------
  {
    id: 'origin-story',
    label: 'Inked panel',
    Frame: panelFrame('ink-panel !rounded-none'),
    Backdrop: backdrop('halftone', 0.12),
    Bullet: ornament('burst', 'size-3.5'),
    titleClass: 'font-black uppercase tracking-tight',
    tileClass: 'ink-panel !rounded-none',
  },
  {
    id: 'mechanical',
    label: 'Key deck',
    Frame: panelFrame('key-deck'),
    Bullet: ornament('rounded-sm bg-[var(--color-accent)]', 'size-2.5'),
    tileClass: 'keycap !rounded-md',
  },
  {
    id: 'handset',
    label: 'Device panel',
    Frame: panelFrame(''),
    Bullet: motionOrnament('bg-[var(--color-accent)]', 'size-2'),
    tileClass: 'rounded-[1.75rem]',
  },
  {
    id: 'salon',
    label: 'Gilt panel',
    Frame: panelFrame('canvas-tooth'),
    Backdrop: backdrop('picture-light', 0.7),
    Bullet: ornament('paint-blob bg-[var(--color-accent)]', 'size-3'),
    titleClass: 'font-serif',
  },

  // --- Environments -------------------------------------------------------
  {
    id: 'abyss',
    label: 'Deep panel',
    Frame: panelFrame(''),
    Backdrop: backdrop('sea-depth'),
    Bullet: ornament('bubble', 'size-2.5'),
    tileClass: 'rounded-2xl',
  },
  {
    id: 'woodland',
    label: 'Forest panel',
    Frame: panelFrame('', { fibre: true }),
    Backdrop: backdrop('fog-band', 0.5),
    Bullet: ornament('leaf', 'size-3'),
    titleClass: 'font-serif',
  },
  {
    id: 'dune',
    label: 'Sand panel',
    Frame: panelFrame('', { fibre: true }),
    Bullet: ornament('rounded-full bg-[var(--color-accent)]', 'size-2.5'),
    tileClass: 'rounded-2xl',
  },
  {
    id: 'summit',
    label: 'Contour panel',
    Frame: panelFrame('contour'),
    Bullet: ornament('bg-[var(--color-accent)] [clip-path:polygon(50%_0,100%_100%,0_100%)]', 'size-3'),
    tileClass: 'rounded-none',
  },
  {
    id: 'nebula',
    label: 'Void panel',
    Frame: panelFrame(''),
    Backdrop: backdrop('nebula', 0.45),
    Bullet: motionOrnament('bg-[var(--color-accent)]', 'size-2'),
    tileClass: 'rounded-2xl',
  },
  {
    id: 'monsoon',
    label: 'Rain glass',
    Frame: panelFrame('wet-glass'),
    Backdrop: backdrop('rain-streaks animate-rain', 0.4),
    Bullet: ornament('rounded-full bg-[var(--color-accent)]', 'size-2'),
    tileClass: 'rounded-2xl',
  },
  {
    id: 'magma',
    label: 'Basalt panel',
    Frame: panelFrame('lava-crack'),
    Backdrop: backdrop('ember-glow', 0.7),
    Bullet: ornament('spark', 'size-2'),
    tileClass: 'rounded-none',
  },
  {
    id: 'cirrus',
    label: 'Cloud panel',
    Frame: panelFrame(''),
    Backdrop: backdrop('cloud-bank animate-cloud', 0.5),
    Bullet: ornament('rounded-full bg-[var(--color-accent)]', 'size-2'),
    tileClass: 'rounded-3xl',
  },

  // --- Instruments and machines ------------------------------------------
  {
    id: 'barometer',
    label: 'Station panel',
    Frame: panelFrame('station-panel'),
    Backdrop: backdrop('isobars', 0.5),
    Bullet: ornament('rounded-full bg-[var(--color-accent)]', 'size-2'),
    tileClass: 'rounded-xl',
  },
  {
    id: 'macbook',
    label: 'Aluminium panel',
    Frame: panelFrame('alu'),
    Bullet: ornament('rounded-sm bg-[var(--color-accent)]', 'size-2'),
    tileClass: 'rounded-lg',
  },
  {
    id: 'horology',
    label: 'Dial panel',
    Frame: panelFrame('clock-face !rounded-2xl'),
    Bullet: ornament('rounded-full bg-[var(--color-accent)]', 'size-2'),
    titleClass: 'font-serif',
    tileClass: 'rounded-xl',
  },
  {
    id: 'shortwave',
    label: 'Walnut cabinet',
    Frame: panelFrame('veneer', { fibre: true }),
    Bullet: ornament('rounded-full bg-[var(--color-accent)]', 'size-2.5'),
    titleClass: 'font-serif',
    tileClass: 'rounded-lg',
  },
  {
    id: 'cathode',
    label: 'Set cabinet',
    Frame: panelFrame('crt-cabinet'),
    Bullet: ornament('rounded-sm bg-[var(--color-accent)]', 'size-2'),
    titleClass: 'font-mono uppercase',
    tileClass: 'rounded-md',
  },
  {
    id: 'concert',
    label: 'Instrument case',
    Frame: panelFrame('', { pad: 'p-7 sm:p-10' }),
    Backdrop: backdrop('stave', 0.14),
    Bullet: ornament('rounded-full bg-[var(--color-accent)]', 'size-2.5'),
    titleClass: 'font-serif',
    tileClass: 'rounded-xl',
  },
  {
    id: 'redline',
    label: 'Carbon fascia',
    Frame: panelFrame('carbon'),
    Bullet: ornament('bg-[var(--color-accent)] [clip-path:polygon(0_0,100%_50%,0_100%)]', 'size-2.5'),
    titleClass: 'uppercase tracking-tight',
    tileClass: 'rounded-md',
  },
  {
    id: 'bindery',
    label: 'Printed leaf',
    Frame: panelFrame('book-paper', { fibre: true }),
    Bullet: ornament('rounded-full bg-[var(--color-accent-strong)]', 'size-2'),
    surface: 'paper',
    titleClass: 'font-serif',
    tileClass: 'rounded-sm',
  },

  // --- Science ------------------------------------------------------------
  {
    id: 'vitals',
    label: 'Monitor panel',
    Frame: panelFrame('ecg-paper'),
    Bullet: motionOrnament('bg-[var(--color-accent)]', 'size-2'),
    titleClass: 'font-mono',
    tileClass: 'rounded-md',
  },
  {
    id: 'reagent',
    label: 'Bench panel',
    Frame: panelFrame('beaker-glass !rounded-2xl'),
    Backdrop: backdrop('field-lines', 0.3),
    Bullet: ornament('bubble', 'size-2.5'),
    tileClass: 'element-tile !rounded-lg',
  },
  {
    id: 'quantum',
    label: 'Field panel',
    Frame: panelFrame(''),
    Backdrop: backdrop('field-lines', 0.4),
    Bullet: ornament('electron', 'size-2'),
    titleClass: 'font-mono',
    tileClass: 'rounded-2xl',
  },
  {
    id: 'meadow',
    label: 'Soil panel',
    Frame: panelFrame('soil', { fibre: true }),
    Backdrop: backdrop('furrows', 0.18),
    Bullet: ornament('grain-ear', 'size-3'),
    titleClass: 'font-serif',
    tileClass: 'rounded-xl',
  },
];

/** Every section family, built from all 28 kits. */
const build = (name: MotifSectionName): SectionVariant[] => collect(MOTIF_KITS, name);

export const KIT_ABOUT = build('about');
export const KIT_SERVICES = build('services');
export const KIT_TESTIMONIALS = build('testimonials');
export const KIT_CONTACT = build('contact');
export const KIT_EDUCATION = build('education');
export const KIT_GALLERY = build('gallery');
export const KIT_STATS = build('stats');
export const KIT_PROJECTS = build('projects');
export const KIT_SKILLS = build('skills');
export const KIT_EXPERIENCE = build('experience');
