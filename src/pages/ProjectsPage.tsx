import { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { useSettings } from '../context/SettingsContext';
import { adminApi } from '../admin/services/adminApi';

import p1Img from '../assets/images/project_artwork_1_1785513185877.jpg';
import p2Img from '../assets/images/project_artwork_2_1785513204720.jpg';
import p3Img from '../assets/images/project_artwork_3_1785513218624.jpg';
import p4Img from '../assets/images/hero_nebula_bg_1785513124347.jpg';
import p5Img from '../assets/images/comic_panel_1_1785513144023.jpg';
import p6Img from '../assets/images/comic_panel_3_1785513168462.jpg';

const defaultProjectsList: Project[] = [
  {
    id: 'proj-1',
    title: 'Monolith Architectural Pavilion',
    client: 'Vanguard Space Group',
    year: '2026',
    category: 'Spatial Design & Identity',
    description: 'A brutalist obsidian pavilion designed for acoustic isolation and digital resonance.',
    imageUrl: p1Img,
    aspectRatio: 'aspect-[4/3]',
    gridSpan: 'col-span-12 md:col-span-7',
    route: '/projects/monolith-pavilion',
  },
  {
    id: 'proj-2',
    title: 'Aether Artefact Series',
    client: 'Kuroda Museum Tokyo',
    year: '2025',
    category: 'Physical Industrial Craft',
    description: 'Precision brass and obsidian sculptures exploring tactile physical interfaces.',
    imageUrl: p2Img,
    aspectRatio: 'aspect-[3/4]',
    gridSpan: 'col-span-12 md:col-span-5',
    route: '/projects/aether-artefact',
  },
  {
    id: 'proj-3',
    title: 'Nocturne Spatial Chair',
    client: 'Atelier Nocturne London',
    year: '2025',
    category: 'Object & Furniture',
    description: 'A matte black steel chair cast in single-point directional lighting.',
    imageUrl: p3Img,
    aspectRatio: 'aspect-[1/1]',
    gridSpan: 'col-span-12 md:col-span-4',
    route: '/projects/nocturne-chair',
  },
  {
    id: 'proj-4',
    title: 'Cosmic Edge Identity',
    client: 'Orbital Research Lab',
    year: '2026',
    category: 'Brand Architecture',
    description: 'Deep cosmic imagery coupled with minimal typographic systems for aerospace innovation.',
    imageUrl: p4Img,
    aspectRatio: 'aspect-[16/9]',
    gridSpan: 'col-span-12 md:col-span-8',
    route: '/projects/cosmic-edge',
  },
  {
    id: 'proj-5',
    title: 'Manga Monograph Monolith',
    client: 'Graphic Novel Press',
    year: '2025',
    category: 'Editorial Monograph',
    description: 'Sequential ink drawings compiled into a limited edition linen-bound volume.',
    imageUrl: p5Img,
    aspectRatio: 'aspect-[3/4]',
    gridSpan: 'col-span-12 md:col-span-5',
    route: '/projects/manga-monograph',
  },
  {
    id: 'proj-6',
    title: 'Void Monolithic Structure',
    client: 'Sora Foundation Zurich',
    year: '2026',
    category: 'Spatial Installations',
    description: 'Abstract geometric monoliths erected in high-altitude topography.',
    imageUrl: p6Img,
    aspectRatio: 'aspect-[16/10]',
    gridSpan: 'col-span-12 md:col-span-7',
    route: '/projects/void-structure',
  },
  {
    id: 'proj-7',
    title: 'Helios Solar Observatory',
    client: 'Atacama Space Institute',
    year: '2026',
    category: 'Interaction Architecture',
    description: 'Real-time telemetry interface for high-altitude solar magnetic field observation.',
    imageUrl: p1Img,
    aspectRatio: 'aspect-[16/9]',
    gridSpan: 'col-span-12 md:col-span-8',
    route: '/projects/helios-observatory',
  },
  {
    id: 'proj-8',
    title: 'Chronos Mechanical Timepiece',
    client: 'Horology Geneva',
    year: '2025',
    category: 'Industrial Design',
    description: 'Single-hand mechanical movement encased in dark titanium alloy.',
    imageUrl: p2Img,
    aspectRatio: 'aspect-[4/5]',
    gridSpan: 'col-span-12 md:col-span-4',
    route: '/projects/chronos-timepiece',
  },
];

interface ProjectsPageProps {
  onSelectProject: (project: Project) => void;
  onOpenBookCall: () => void;
  onNavigateToContact?: () => void;
}

export default function ProjectsPage({ onSelectProject, onOpenBookCall, onNavigateToContact }: ProjectsPageProps) {
  const { settings } = useSettings();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [projects, setProjects] = useState<Project[]>(defaultProjectsList);

  useEffect(() => {
    async function loadProjects() {
      try {
        const fetched = await adminApi.getProjects();
        if (fetched && fetched.length > 0) {
          const mapped: Project[] = fetched
            .filter((p) => p.is_published)
            .map((p, idx) => ({
              id: String(p.id),
              title: p.title,
              client: p.client || 'Client',
              year: String(p.year || '2026'),
              category: p.description?.substring(0, 30) || 'Design',
              description: p.description || '',
              imageUrl: p.image_url || p1Img,
              aspectRatio: p.aspect_ratio || (idx % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[16/9]'),
              gridSpan: p.grid_span || (idx % 3 === 0 ? 'col-span-12 md:col-span-7' : 'col-span-12 md:col-span-5'),
              route: `/projects/${p.slug}`,
              full_case_study: p.full_case_study,
              tools_used: p.tools_used,
              gallery_images: p.gallery_images,
            }));
          setProjects(mapped);
        }
      } catch (err) {
        console.warn('Could not load dynamic projects:', err);
      }
    }
    loadProjects();
  }, []);

  const heroHeading = settings.projects_hero_heading || 'Selected Works & Commissions';
  const heroSubheading = settings.projects_hero_subheading || 'An editorial archive of interactive monuments, physical artefacts, brand identities, and spatial structures built between 2018 and present.';
  const ctaHeading = settings.projects_cta_heading || 'Ready to build something together?';
  const ctaSubheading = settings.projects_cta_subheading || 'Our partners review all project inquiries personally within 24 hours.';
  const ctaButtonText = settings.projects_cta_button_text || 'Book a Call';
  const ctaButtonUrl = settings.projects_cta_button_url || '/contact';

  useEffect(() => {
    window.scrollTo(0, 0);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const startPoint = windowHeight;
            const endPoint = windowHeight * 0.1;
            const totalDistance = startPoint - endPoint;
            const scrollDistance = startPoint - rect.top;

            const rawProgress = scrollDistance / totalDistance;
            const progress = Math.min(Math.max(rawProgress, 0), 1);
            setScrollProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="pt-28 pb-20 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto space-y-20 bg-[#050505] text-[#f3f3f3] overflow-hidden">
      {/* Header (White text brightness reveal, yellow text static) */}
      <div className="space-y-4 max-w-3xl pt-8">
        <h1 className="font-outfit text-4xl sm:text-6xl font-light text-white tracking-tight leading-[1.08]">
          <span
            className="inline-block transition-all duration-1000 ease-out will-change-[opacity,filter]"
            style={{
              opacity: scrollProgress > 0.05 ? 1 : 0.35,
              filter: scrollProgress > 0.05 ? 'brightness(1)' : 'brightness(0.35)',
            }}
          >
            {heroHeading}
          </span>
        </h1>
        <p className="font-inter text-base sm:text-lg text-[#9a9a9e] font-normal leading-relaxed">
          {heroSubheading}
        </p>
      </div>

      {/* Editorial Masonry Layout (Varied Image Sizes) - Alternating card entry assembly */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 pt-4">
        {projects.map((proj, idx) => {
          const isHovered = hoveredId === proj.id;
          const isAnythingHovered = hoveredId !== null;
          const isOther = isAnythingHovered && !isHovered;
          const isEven = idx % 2 === 0;

          // Scroll-responsive factor (1 when un-assembled, 0 when fully assembled)
          const easeProgress = 1 - Math.pow(1 - scrollProgress, 3);
          const factor = 1 - easeProgress;

          let transformVal = 'translate3d(0, 0, 0) rotate(0deg)';
          if (isHovered) {
            transformVal = 'scale(1.02) rotate(0deg)';
          } else if (isOther) {
            transformVal = 'scale(0.99) rotate(0deg)';
          } else if (factor > 0.005) {
            const offsetDist = 75 * factor;
            const rotDeg = 5 * factor;
            transformVal = isEven
              ? `translate3d(-${offsetDist}px, 0, 0) rotate(-${rotDeg}deg)`
              : `translate3d(${offsetDist}px, 0, 0) rotate(${rotDeg}deg)`;
          }

          const opacityVal = isOther ? 0.4 : Math.max(0.15, easeProgress);

          const transitionVal = isAnythingHovered
            ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, border-color 0.3s ease, filter 0.3s ease'
            : 'transform 0.15s ease-out, opacity 0.15s ease-out, border-color 0.3s ease, filter 0.3s ease';

          return (
            <div
              key={proj.id}
              className={`${proj.gridSpan} relative group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0c] ${
                isHovered
                  ? 'z-30 shadow-2xl shadow-black border-white/50'
                  : 'z-10'
              } ${isOther ? 'filter brightness-75' : ''}`}
              style={{
                transform: transformVal,
                opacity: opacityVal,
                transition: transitionVal,
              }}
              onMouseEnter={() => setHoveredId(proj.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectProject(proj)}
            >
              <div className="block relative w-full h-full">
                <div className={`relative w-full ${proj.aspectRatio} overflow-hidden`}>
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/30 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />
                </div>

                {/* Project Details Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end space-y-1 z-10">
                  <div className="flex items-center justify-between font-inter text-xs text-[#9a9a9e]">
                    <span>{proj.client}</span>
                    <span className="text-[#E6A800]">{proj.year}</span>
                  </div>
                  <h3 className="font-outfit text-xl sm:text-2xl text-[#f3f3f3] font-light group-hover:text-white transition-colors">
                    {proj.title}
                  </h3>
                  <p className="font-inter text-xs sm:text-sm text-[#9a9a9e] opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2 mt-1">
                    {proj.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Contact CTA */}
      <div className="pt-16 pb-8 border-t border-white/10 text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="font-outfit text-3xl sm:text-5xl font-light text-white tracking-tight">
          {ctaHeading}
        </h2>
        <p className="font-inter text-sm sm:text-base text-[#9a9a9e]">
          {ctaSubheading}
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              if (ctaButtonUrl && ctaButtonUrl.startsWith('http')) {
                window.open(ctaButtonUrl, '_blank');
              } else if (onNavigateToContact) {
                onNavigateToContact();
              } else {
                onOpenBookCall();
              }
            }}
            className="inline-flex items-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer"
          >
            <span>{ctaButtonText}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
