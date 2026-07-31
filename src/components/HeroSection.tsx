import { useEffect, useState, useRef } from 'react';
import heroNebulaImg from '../assets/images/hero_nebula_bg_1785513124347.jpg';
import InteractiveHeading from './InteractiveHeading';

interface HeroSectionProps {
  onOpenBookCall: () => void;
  onViewProjects: () => void;
}

export default function HeroSection({ onOpenBookCall, onViewProjects }: HeroSectionProps) {
  const [isIlluminated, setIsIlluminated] = useState(false);
  const headingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIlluminated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="section-home"
      className="relative w-full h-screen min-h-[700px] flex flex-col justify-center items-center text-center px-6 sm:px-12 bg-[#050505] overflow-hidden"
    >
      {/* Authentic Nebula Image Background - concentrated at edges, dark center */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={heroNebulaImg}
          alt="Cosmic space nebula background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-85 scale-105 transform-gpu"
        />
        {/* Subtle center vignetting to guarantee pristine text contrast */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/60 to-[#050505]/90" />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8 sm:space-y-10 py-12">
        {/* Main Heading with First Word 100% & Hover Opacity Interaction */}
        <div ref={headingRef}>
          <InteractiveHeading
            as="h1"
            firstWord="Comic"
            yellowText="Book"
            tailText="Artists."
            isIlluminated={isIlluminated}
            className="font-outfit text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#f3f3f3] tracking-tight leading-[1.08] max-w-3xl"
          />
        </div>

        {/* Sub Heading (Inter Font, warm light gray - Static as specified) */}
        <p className="font-inter text-base sm:text-lg md:text-xl text-[#9a9a9e] font-normal leading-relaxed max-w-2xl text-center">
          An independent creative studio engineering brand identities, interactive architecture, and physical motion design with uncompromising editorial craft.
        </p>

        {/* Two CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
          {/* Button One: #0097FF with diagonal upward arrow */}
          <button
            onClick={onOpenBookCall}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer"
          >
            <span>Book a call</span>
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

          {/* Button Two: Outline with horizontal arrow pointing right */}
          <button
            onClick={onViewProjects}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-white/20 hover:border-white/50 bg-transparent hover:bg-white/5 text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer"
          >
            <span>View Project Portfolio</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

