import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { AsciiArt } from '@/components/aceternity/AsciiArt';
import { DraggableCardBody, DraggableCardContainer } from '@/components/aceternity/DraggableCard';
import { cn } from '@/utils/cn';
import {
  Heading,
  Marquee,
  MetroTile,
  Reveal,
  Section,
  TerminalSection,
  galleryOf,
  metroColor,
  type GalleryItem,
  type SectionProps,
  type SectionVariant,
} from './shared';

function Caption({ item }: { item: GalleryItem }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-gradient-to-t from-black/75 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <span className="text-sm font-medium text-white">{item.title}</span>
      <ArrowUpRight className="size-4 text-white" />
    </div>
  );
}

function Tile({ item, className, imgClass }: { item: GalleryItem; className?: string; imgClass?: string }) {
  return (
    <Link to={`/work/${item.slug}`} className={cn('group relative block overflow-hidden rounded-xl bg-[var(--color-bg-elevated-2)]', className)}>
      <img src={item.url} alt={item.title} loading="lazy" className={cn('size-full object-cover transition-transform duration-700 group-hover:scale-110', imgClass)} />
      <Caption item={item} />
    </Link>
  );
}

function GalleryMasonry({ projects }: SectionProps) {
  const items = galleryOf(projects, 12);
  if (items.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Gallery" title="Snapshots from my work" />
      <div className="columns-2 gap-3 md:columns-3 [&>*]:mb-3">
        {items.map((item, i) => (
          <Reveal key={item.url} delay={(i % 3) * 0.06} className="break-inside-avoid">
            <Tile item={item} className={cn(i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]')} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function GalleryGrid({ projects }: SectionProps) {
  const items = galleryOf(projects, 9);
  if (items.length === 0) return null;
  return (
    <Section>
      <Heading eyebrow="Gallery" title="Visual highlights" align="center" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.url} delay={(i % 3) * 0.05}>
            <Tile item={item} className="aspect-square" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function GalleryParallax({ projects }: SectionProps) {
  const items = galleryOf(projects, 12);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -260]);
  if (items.length === 0) return null;
  const cols = [0, 1, 2].map((c) => items.filter((_, i) => i % 3 === c));
  const ys = [y1, y2, y3];
  return (
    <Section>
      <Heading eyebrow="Gallery" title="In motion" align="center" />
      <div ref={ref} className="grid h-[720px] grid-cols-2 gap-3 overflow-hidden md:grid-cols-3" style={{ maskImage: 'linear-gradient(transparent, black 12%, black 88%, transparent)' }}>
        {cols.map((col, c) => (
          <motion.div key={c} style={{ y: ys[c] }} className={cn('space-y-3', c === 2 && 'hidden md:block', c === 1 && 'pt-24')}>
            {[...col, ...col].map((item, i) => (
              <Tile key={`${item.url}-${i}`} item={item} className="aspect-[4/5]" />
            ))}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function GalleryMarquee({ projects }: SectionProps) {
  const items = galleryOf(projects, 16);
  if (items.length === 0) return null;
  const half = Math.ceil(items.length / 2);
  return (
    <section className="space-y-3 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Heading eyebrow="Gallery" title="A glimpse of the work" />
      </div>
      <Marquee duration={45}>
        {items.slice(0, half).map((item) => (
          <Tile key={item.url} item={item} className="h-56 w-80 shrink-0" />
        ))}
      </Marquee>
      <Marquee duration={55} reverse>
        {(items.slice(half).length ? items.slice(half) : items).map((item) => (
          <Tile key={item.url} item={item} className="h-56 w-80 shrink-0" />
        ))}
      </Marquee>
    </section>
  );
}

function GalleryLightbox({ projects }: SectionProps) {
  const items = galleryOf(projects, 12);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((n) => (n === null ? n : (n + 1) % items.length));
      if (e.key === 'ArrowLeft') setOpen((n) => (n === null ? n : (n - 1 + items.length) % items.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items.length]);
  if (items.length === 0) return null;
  const current = open !== null ? items[open] : null;
  return (
    <Section>
      <Heading eyebrow="Gallery" title="Click to enlarge" />
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
        {items.map((item, i) => (
          <motion.button
            key={item.url}
            type="button"
            layoutId={`lb-${item.url}`}
            onClick={() => setOpen(i)}
            className={cn('overflow-hidden rounded-lg', i === 0 && 'col-span-2 row-span-2')}
          >
            <img src={item.url} alt={item.title} loading="lazy" className="aspect-square size-full object-cover transition-transform duration-500 hover:scale-105" />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {current && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm">
            <motion.img layoutId={`lb-${current.url}`} src={current.url} alt={current.title} className="max-h-[85vh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {current.title} · {(open ?? 0) + 1}/{items.length} · ← →
            </p>
            <button type="button" aria-label="Close" className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              <X className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function GalleryPolaroids({ projects }: SectionProps) {
  const items = galleryOf(projects, 6);
  if (items.length === 0) return null;
  const spots = ['left-[5%] top-[8%]', 'left-[35%] top-[2%]', 'left-[65%] top-[10%]', 'left-[12%] top-[45%]', 'left-[42%] top-[40%]', 'left-[70%] top-[48%]'];
  const rot = [-8, 5, -3, 7, -5, 4];
  return (
    <Section>
      <Heading eyebrow="Gallery" title="Scattered memories" align="center" />
      <p className="-mt-6 mb-6 text-center text-sm text-[var(--color-text-faint)]">Drag the photos around</p>
      <DraggableCardContainer className="relative h-[640px] overflow-hidden rounded-3xl border border-dashed border-[var(--color-border-hover)]">
        {items.map((item, i) => (
          <div key={item.url} className={cn('absolute', spots[i])}>
            <DraggableCardBody rotate={rot[i]} className="w-52 bg-white p-2.5 pb-10 shadow-2xl sm:w-60">
              <img src={item.url} alt={item.title} className="pointer-events-none aspect-square w-full object-cover" />
              <p className="mt-3 text-center font-[cursive] text-sm text-neutral-800">{item.title}</p>
            </DraggableCardBody>
          </div>
        ))}
      </DraggableCardContainer>
    </Section>
  );
}

function GalleryFilmstrip({ projects }: SectionProps) {
  const items = galleryOf(projects, 12);
  if (items.length === 0) return null;
  const holes = (
    <div className="flex gap-3 px-2 py-1.5">
      {Array.from({ length: 60 }, (_, i) => (
        <span key={i} className="h-3 w-5 shrink-0 rounded-[2px] bg-[var(--color-bg)]" />
      ))}
    </div>
  );
  return (
    <section className="overflow-hidden py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Heading eyebrow="Reel" title="Frame by frame" />
      </div>
      <div className="-rotate-1 overflow-hidden bg-neutral-900">
        <div className="overflow-hidden">{holes}</div>
        <Marquee duration={60} className="py-1">
          {items.map((item) => (
            <Link key={item.url} to={`/work/${item.slug}`} className="block h-48 w-72 shrink-0 overflow-hidden">
              <img src={item.url} alt={item.title} className="size-full object-cover sepia-[0.3] transition-all duration-500 hover:sepia-0" />
            </Link>
          ))}
        </Marquee>
        <div className="overflow-hidden">{holes}</div>
      </div>
    </section>
  );
}

function GalleryMosaic({ projects }: SectionProps) {
  const items = galleryOf(projects, 7);
  if (items.length === 0) return null;
  const spans = ['md:col-span-2 md:row-span-2', '', '', 'md:row-span-2', '', 'md:col-span-2', ''];
  return (
    <Section>
      <Heading eyebrow="Gallery" title="Mosaic" />
      <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.url} delay={i * 0.05} className={spans[i]}>
            <Tile item={item} className="size-full rounded-2xl" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function GalleryMetro({ projects }: SectionProps) {
  const items = galleryOf(projects, 8);
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-6 text-4xl font-light text-[var(--color-text)]">pictures</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 [&_.metro-tile]:min-h-40">
        {items.map((item, i) => (
          <Link key={item.url} to={`/work/${item.slug}`} className={cn('contents')}>
            <MetroTile color={metroColor(i)} index={i} className={cn('p-0', i === 0 && 'col-span-2 row-span-2')}>
              <img src={item.url} alt={item.title} className="absolute inset-0 size-full object-cover" />
              <span className="absolute bottom-0 left-0 bg-black/50 px-3 py-1.5 text-xs text-white">{item.title}</span>
            </MetroTile>
          </Link>
        ))}
      </div>
    </section>
  );
}

function GalleryTerminal({ profile, projects }: SectionProps) {
  const items = galleryOf(projects, 1);
  const first = items[0];
  if (!first) return null;
  return (
    <TerminalSection profile={profile} cmd={`img2ascii ./${first.slug}.png`}>
      <AsciiArt src={first.url} className="w-full text-[var(--color-accent)]" cellSize={7} />
    </TerminalSection>
  );
}

export const GALLERY_VARIANTS: SectionVariant[] = [
  { id: 'parallax', name: 'Parallax columns', description: 'Three image columns drifting at different speeds as you scroll.', Component: GalleryParallax },
  { id: 'marquee', name: 'Image marquee', description: 'Two endless rows of images, opposite directions.', Component: GalleryMarquee },
  { id: 'lightbox', name: 'Lightbox', description: 'Grid that zooms images fullscreen (arrow keys work).', Component: GalleryLightbox },
  { id: 'masonry', name: 'Masonry', description: 'Mixed-height columns with hover captions.', Component: GalleryMasonry },
  { id: 'mosaic', name: 'Mosaic', description: 'Magazine-style mixed-size tiles.', Component: GalleryMosaic },
  { id: 'polaroids', name: 'Polaroid scatter', description: 'Draggable polaroids scattered on a table.', Component: GalleryPolaroids },
  { id: 'filmstrip', name: 'Film strip', description: 'Tilted scrolling film reel with sprocket holes.', Component: GalleryFilmstrip },
  { id: 'grid', name: 'Square grid', description: 'Clean 3-column grid, zoom on hover.', Component: GalleryGrid },
  { id: 'metro', name: 'Metro tiles', description: 'Photo live tiles.', Component: GalleryMetro },
  { id: 'terminal', name: 'ASCII art', description: 'Your first project image rendered as ASCII.', Component: GalleryTerminal },
];
