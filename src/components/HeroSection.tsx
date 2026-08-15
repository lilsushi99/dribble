import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import heroNebulaImg from '../assets/images/hero_nebula_bg_1785513124347.jpg';
import InteractiveHeading from './InteractiveHeading';
import { useSettings } from '../context/SettingsContext';
import { adminApi, defaultHomepageData } from '../admin/services/adminApi';
import { HomepageContent } from '../admin/types/admin.types';

interface HeroSectionProps {
  onOpenBookCall: () => void;
  onViewProjects: () => void;
  bgType?: 'image' | 'color';
  bgImage?: string;
  bgColor?: string;
  homeContent?: HomepageContent | null;
}

export default function HeroSection({
  onOpenBookCall,
  onViewProjects,
  bgType = 'image',
  bgImage,
  bgColor = '#000000',
  homeContent,
}: HeroSectionProps) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [isIlluminated, setIsIlluminated] = useState(false);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState<HomepageContent>(homeContent || defaultHomepageData);

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

  // If HomePage didn't already supply fetched content (e.g. component used standalone),
  // fall back to fetching it directly so the hero is never stuck on hardcoded copy.
  useEffect(() => {
    if (homeContent) {
      setContent(homeContent);
      return;
    }
    let isMounted = true;
    adminApi.getHomepageData().then((data) => {
      if (isMounted && data) setContent(data);
    });
    return () => {
      isMounted = false;
    };
  }, [homeContent]);

  // The heading is stored as a single editable string in the CMS. To preserve the
  // existing "last word in accent color" visual treatment without a redesign, the
  // final word is rendered in the accent color and the rest in white.
  const headingWords = (content.hero_heading || '').trim().split(/\s+/).filter(Boolean);
  const headingLead = headingWords.length > 1 ? headingWords.slice(0, -1).join(' ') : '';
  const headingAccent = headingWords.length > 0 ? headingWords[headingWords.length - 1] : 'Comic Book Artist';

  const heroBackgroundImage = settings?.hero_background_image || bgImage || heroNebulaImg;

  // The admin can now set a real URL/action per button. An empty value or a lone '#'
  // preserves the original default behavior (chat widget for primary, projects page
  // for secondary) so existing sites don't change unless the admin explicitly sets a URL.
  const handlePrimaryClick = () => {
    const url = (content.hero_cta_primary_url || '').trim();
    if (!url || url === '#') {
      adminApi.trackEvent('chat_click', 'home');
      const api = window.Tawk_API as any;
      if (api?.maximize) api.maximize();
      else if (api?.toggle) api.toggle();
      else if (api?.popup) api.popup();
      else onOpenBookCall();
      return;
    }
    adminApi.trackEvent('cta_click', 'home');
    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(url);
    }
  };

  const handleSecondaryClick = () => {
    const url = (content.hero_cta_secondary_url || '').trim();
    if (!url || url === '#') {
      adminApi.trackEvent('portfolio_click', 'home');
      onViewProjects();
      return;
    }
    adminApi.trackEvent('cta_click', 'home');
    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(url);
    }
  };

  return (
    <section
      id="section-home"
      className="relative w-full h-screen min-h-[700px] flex flex-col justify-center items-center text-center px-6 sm:px-12 bg-[#050505] overflow-hidden"
      style={{ backgroundColor: bgType === 'color' ? bgColor : '#050505' }}
    >
      {/* Background Image / Color Mode */}
      {bgType !== 'color' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={heroBackgroundImage}
            alt="Cosmic space nebula background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85 scale-105 transform-gpu"
          />
          {/* Subtle center vignetting to guarantee text contrast */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/60 to-[#050505]/90" />
        </div>
      )}

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8 sm:space-y-10 py-12">
        {/* Main Heading */}
        <div ref={headingRef}>
          <InteractiveHeading
            as="h1"
            firstWord={headingLead}
            yellowText={headingAccent}
            isIlluminated={isIlluminated}
            className="font-outfit text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#f3f3f3] tracking-tight leading-[1.08] max-w-3xl"
          />
        </div>

        {/* Sub Heading */}
        <p className="font-inter text-base sm:text-lg md:text-xl text-[#9a9a9e] font-normal leading-relaxed max-w-2xl text-center">
          {content.hero_subtitle ||
            'Comic Art Studio is a premier creative studio specializing in bespoke comic book illustration, sequential storytelling, manga pages, graphic novels, character design, concept art, and visual storytelling.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 pt-4">
          {/* Primary Button: Chat With Us */}
          <button
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-7 py-3.5 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer shadow-lg shadow-[#0097FF]/20"
          >
            <span>{content.hero_cta_primary_text || 'Chat With Us'}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.81-.94 6.3 6.3 0 00.912-2.183A8.207 8.207 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </button>

          {/* Secondary Button: View Portfolio -> /projects */}
          <button
            onClick={handleSecondaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-white/20 hover:border-white/50 bg-transparent hover:bg-white/5 text-white rounded-full px-7 py-3.5 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer"
          >
            <span>{content.hero_cta_secondary_text || 'View Portfolio'}</span>
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

