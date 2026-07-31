import { useState } from 'react';
import { Project } from '../types';

import p1Img from '../assets/images/project_artwork_1_1785513185877.jpg';
import p2Img from '../assets/images/project_artwork_2_1785513204720.jpg';
import p3Img from '../assets/images/project_artwork_3_1785513218624.jpg';
import p4Img from '../assets/images/hero_nebula_bg_1785513124347.jpg';
import p5Img from '../assets/images/comic_panel_1_1785513144023.jpg';
import p6Img from '../assets/images/comic_panel_3_1785513168462.jpg';

interface ProjectsSectionProps {
  onSelectProject?: (project: Project) => void;
  onViewAllProjects?: () => void;
}

export default function ProjectsSection({
  onSelectProject,
  onViewAllProjects,
}: ProjectsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const projects: Project[] = [
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
  ];

  return (
    <section
      id="section-projects"
      className="relative w-full min-h-screen py-24 px-6 sm:px-12 bg-[#050505] flex flex-col justify-between"
    >
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
        <h2 className="font-outfit text-3xl sm:text-5xl md:text-6xl font-light text-[#f3f3f3] tracking-tight">
          Selected works pinned in <span className="text-[#E6A800]">architectural unity</span>.
        </h2>
        <p className="font-inter text-base sm:text-lg text-[#9a9a9e] max-w-xl mx-auto font-normal leading-relaxed">
          Hover over any project artwork to elevate its visual detail and mute surrounding elements.
        </p>
      </div>

      {/* Irregular Masonry Grid - Very tight spacing (almost touching) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-1.5 sm:gap-2">
        {projects.map((proj) => {
          const isHovered = hoveredId === proj.id;
          const isAnythingHovered = hoveredId !== null;
          const isOther = isAnythingHovered && !isHovered;

          return (
            <div
              key={proj.id}
              className={`${proj.gridSpan} relative group cursor-pointer transition-all duration-500 rounded-lg overflow-hidden border border-white/10 bg-[#0a0a0c] ${
                isHovered ? 'z-30 scale-[1.02] shadow-2xl shadow-black border-white/40' : 'z-10'
              } ${isOther ? 'opacity-35 filter brightness-75 scale-[0.99]' : 'opacity-100'}`}
              onMouseEnter={() => setHoveredId(proj.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectProject?.(proj)}
            >
              <a
                href={proj.route}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectProject?.(proj);
                }}
                className="block relative w-full h-full"
              >
                <div className={`relative w-full ${proj.aspectRatio} overflow-hidden`}>
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                </div>

                {/* Project Details Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex flex-col justify-end space-y-1 z-10">
                  <div className="flex items-center justify-between font-inter text-xs text-[#9a9a9e]">
                    <span>{proj.client}</span>
                    <span className="text-[#E6A800] font-medium">{proj.year}</span>
                  </div>
                  <h3 className="font-outfit text-xl sm:text-2xl text-[#f3f3f3] font-light group-hover:text-white transition-colors">
                    {proj.title}
                  </h3>
                  <p className="font-inter text-xs sm:text-sm text-[#9a9a9e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                    {proj.description}
                  </p>
                </div>
              </a>
            </div>
          );
        })}
      </div>

      {/* View All Projects Button */}
      <div className="text-center pt-16">
        <button
          onClick={onViewAllProjects}
          className="inline-flex items-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 cursor-pointer active:scale-98"
        >
          <span>View All Projects</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>
      </div>
    </section>
  );
}
