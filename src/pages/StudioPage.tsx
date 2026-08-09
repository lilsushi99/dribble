import { useEffect, useState, useRef } from 'react';
import { useSeo } from '../hooks/useSeo';
import ComicSection from '../components/ComicSection';
import comic1 from '../assets/images/comic_panel_1_1785513144023.jpg';
import comic2 from '../assets/images/comic_panel_2_1785513156210.jpg';
import comic3 from '../assets/images/comic_panel_3_1785513168462.jpg';
import { adminApi } from '../admin/services/adminApi';
import { StudioPageData } from '../admin/types/admin.types';

interface StudioPageProps {
  onOpenBookCall: () => void;
  onNavigateToProjects: () => void;
}

interface Metric {
  id: string;
  label: string;
  target: number;
  suffix: string;
  prefix?: string;
  current: number;
  thumbImgs: string[];
}

export default function StudioPage({ onNavigateToProjects }: StudioPageProps) {
  useSeo('studio');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHeadingIlluminated, setIsHeadingIlluminated] = useState(false);
  const [hoveredMetricId, setHoveredMetricId] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const metricsRef = useRef<HTMLDivElement | null>(null);

  const [studioData, setStudioData] = useState<StudioPageData | null>(null);

  useEffect(() => {
    async function loadStudioData() {
      try {
        const data = await adminApi.getStudioData();
        if (data) {
          setStudioData(data);
          if (data.stats_cards && data.stats_cards.length > 0) {
            setMetrics(
              data.stats_cards.map((s: any, idx: number) => ({
                id: s.id || `m${idx + 1}`,
                label: s.title || s.label || 'Metric',
                target: parseFloat(String(s.value).replace(/[^0-9.]/g, '')) || 100,
                suffix: String(s.value).replace(/[0-9.]/g, '') || '',
                current: 0,
                thumbImgs: [comic1, comic2, comic3, comic1, comic2],
              }))
            );
          }
        }
      } catch (err) {
        console.warn('Could not fetch studio page data:', err);
      }
    }
    loadStudioData();
  }, []);

  const initialMetrics: Metric[] = [
    { id: 'm1', label: 'Projects Completed', target: 148, suffix: '+', current: 0, thumbImgs: [comic1, comic2, comic3, comic1, comic2] },
    { id: 'm2', label: 'Clients Served', target: 62, suffix: '', current: 0, thumbImgs: [comic2, comic3, comic1, comic2, comic3] },
    { id: 'm3', label: 'Design Awards', target: 24, suffix: '', current: 0, thumbImgs: [comic3, comic1, comic2, comic3, comic1] },
    { id: 'm4', label: 'Client Satisfaction', target: 99.8, suffix: '%', current: 0, thumbImgs: [comic1, comic2, comic3, comic1, comic2] },
    { id: 'm5', label: 'Client Capital Raised', target: 1, prefix: '$', suffix: 'M', current: 0, thumbImgs: [comic2, comic3, comic1, comic2, comic3] },
  ];

  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);

  const activeReplayTimersRef = useRef<{ [key: string]: number }>({});

  const handleMetricHover = (id: string, target: number) => {
    setHoveredMetricId(id);

    if (activeReplayTimersRef.current[id]) {
      cancelAnimationFrame(activeReplayTimersRef.current[id]);
    }

    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setMetrics((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m;
          return {
            ...m,
            current: Number((target * easedProgress).toFixed(target % 1 !== 0 ? 1 : 0)),
          };
        })
      );

      if (progress < 1) {
        activeReplayTimersRef.current[id] = requestAnimationFrame(animate);
      }
    };

    activeReplayTimersRef.current[id] = requestAnimationFrame(animate);
  };

  const fanOffsets = [
    { x: -52, y: -50, rot: -14, delay: '0ms' },
    { x: -26, y: -62, rot: -7, delay: '40ms' },
    { x: 0, y: -68, rot: 0, delay: '80ms' },
    { x: 26, y: -62, rot: 7, delay: '120ms' },
    { x: 52, y: -50, rot: 14, delay: '160ms' },
  ];

  // Intersection observer for white text illumination reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeadingIlluminated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Counting numbers animation when metrics section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setMetrics((prev) =>
              prev.map((m) => ({
                ...m,
                current: Number((m.target * easedProgress).toFixed(m.target % 1 !== 0 ? 1 : 0)),
              }))
            );

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div className="pt-28 pb-20 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto space-y-28 bg-[#050505] text-[#f3f3f3]">
      {/* Editorial Header */}
      <div className="space-y-6 max-w-4xl pt-8">
        <h1
          ref={headingRef}
          className="font-outfit text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.06] text-white"
        >
          {(() => {
            const headingText = studioData?.intro_heading || 'Our Story';
            const words = headingText.trim().split(/\s+/).filter(Boolean);
            const lead = words.length > 1 ? words.slice(0, -1).join(' ') : '';
            const accent = words.length > 0 ? words[words.length - 1] : 'Story';
            return (
              <>
                {lead && <span className="text-white">{lead}&nbsp;</span>}
                <span className="text-[#E6A800]">{accent}</span>
              </>
            );
          })()}
        </h1>
        <p className="font-inter text-lg sm:text-xl text-[#9a9a9e] font-normal leading-relaxed">
          {studioData?.intro_subtitle ||
            'Comic Art Studio is an independent creative studio dedicated to custom comic books, character design, sequential storytelling, manga, and collaborative visual arts.'}
        </p>
      </div>

      {/* Long-form Studio Story */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-white/10">
        <div className="md:col-span-4">
          <h2 className="font-outfit text-2xl sm:text-3xl font-light text-white tracking-tight md:sticky md:top-32">
            {studioData?.story_heading || 'The Origin & Craft'}
          </h2>
        </div>
        <div className="md:col-span-8 space-y-6 font-inter text-base sm:text-lg text-[#9a9a9e] leading-relaxed">
          {studioData?.story_content ? (
            studioData.story_content
              .replace(/\r\n/g, '\n')
              .split(/\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'text-white font-medium text-lg sm:text-xl leading-relaxed text-justify'
                      : 'leading-relaxed text-justify'
                  }
                >
                  {para}
                </p>
              ))
          ) : (
            <>
              <p className="text-white font-medium text-lg sm:text-xl leading-relaxed text-justify">
                Founded in 2020, Comic Art Studio emerged from a deep passion for sequential art, character design, and compelling visual narrative.
              </p>
              <p className="text-justify">
                Our team of artists and storytellers approaches every comic page, graphic novel, and concept artwork with uncompromising craftsmanship and dedication.
              </p>
              <p className="text-justify">
                We collaborate with visionary writers, independent creators, publishers, and brands worldwide to transform imaginative concepts into striking visual worlds.
              </p>
              <p className="text-justify">
                Every commission progresses from initial character concept sketches and page layouts to fine line inking, expressive color scripting, and final publication prep.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Our Process — sequential timeline (previously Mission/Vision/Philosophy cards) */}
      <div className="pt-8 border-t border-white/10 space-y-10">
        <h2 className="font-outfit text-2xl sm:text-3xl font-light text-white tracking-tight">
          Our <span className="text-[#E6A800]">Process</span>
        </h2>
        <div className="relative flex flex-col md:flex-row md:items-start gap-10 md:gap-6">
          {/* Connecting line: vertical on mobile, horizontal on desktop */}
          <div className="hidden md:block absolute top-[13px] left-[6%] right-[6%] h-px bg-white/15" />
          <div className="md:hidden absolute top-1 bottom-1 left-[13px] w-px bg-white/15" />

          {(studioData?.value_cards && studioData.value_cards.length > 0
            ? studioData.value_cards
            : [
                { id: '1', title: 'Discover', description: 'We start by understanding your goals, audience, and the story you need told, grounding every decision in a clear creative brief.' },
                { id: '2', title: 'Design', description: 'Concepts, character studies, and layout exploration follow, refined through iteration until the direction feels right.' },
                { id: '3', title: 'Create', description: 'Full production begins: inking, coloring, and page assembly, crafted with the same discipline at every stage.' },
                { id: '4', title: 'Deliver', description: 'Final review, polish, and handoff of production-ready files, with support available after launch.' },
              ]
          ).map((step, idx) => (
            <div key={step.id || idx} className="relative flex md:flex-col items-start gap-4 md:gap-6 flex-1 min-w-0">
              <div className="relative z-10 w-7 h-7 rounded-full border border-white/25 bg-[#050505] flex items-center justify-center flex-shrink-0">
                <span className="font-inter text-[11px] text-[#E6A800]">{idx + 1}</span>
              </div>
              <div className="space-y-2 pt-0.5 min-w-0">
                <h3 className="font-outfit text-lg text-white font-light">{step.title}</h3>
                <p className="font-inter text-sm text-[#9a9a9e] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reused Animated Comic Section */}
      <div className="pt-8 border-t border-white/10">
        <ComicSection />
      </div>

      {/* Elegant Studio Metrics with Animated Numbers */}
      <div ref={metricsRef} className="pt-12 border-t border-white/10 space-y-8">
        <h2 className="font-outfit text-3xl sm:text-4xl font-light text-white tracking-tight">
          Quantifiable Impact
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {metrics.map((m) => {
            const isHovered = hoveredMetricId === m.id;

            return (
              <div
                key={m.id}
                onMouseEnter={() => handleMetricHover(m.id, m.target)}
                onMouseLeave={() => setHoveredMetricId(null)}
                className="relative group transition-all duration-300 ease-out"
              >
                {/* 5 Comic artwork thumbnails emerging sequentially on hover */}
                {m.thumbImgs.map((imgSrc, imgIdx) => {
                  const offset = fanOffsets[imgIdx];

                  return (
                    <div
                      key={imgIdx}
                      className="absolute top-0 left-1/2 -ml-6 w-12 h-16 rounded border border-white/20 overflow-hidden shadow-xl pointer-events-none z-0"
                      style={{
                        transform: isHovered
                          ? `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${offset.rot}deg)`
                          : 'translate3d(0, 0, 0) rotate(0deg)',
                        opacity: isHovered ? 0.95 : 0,
                        transition: `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${offset.delay}, opacity 0.3s ease ${offset.delay}`,
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt=""
                        className="w-full h-full object-cover filter contrast-110"
                      />
                    </div>
                  );
                })}

                <div
                  className="relative z-10 bg-[#0a0a0c] border border-white/10 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300"
                  style={{
                    transform: isHovered ? 'translate3d(0, -3px, 0)' : 'translate3d(0, 0, 0)',
                    borderColor: isHovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
                    {m.prefix}
                    {m.current}
                    {m.suffix}
                  </div>
                  <div className="font-inter text-xs sm:text-sm text-[#9a9a9e] font-normal">
                    {m.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Studio CTA: Explore Selected Projects */}
      {studioData?.show_cta !== false && (
        <div className="pt-16 pb-8 border-t border-white/10 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="font-outfit text-4xl sm:text-6xl font-light text-white tracking-tight">
            {studioData?.cta_heading || "You’ve seen how we think. Now explore what we’ve built."}
          </h2>
          <p className="font-inter text-base sm:text-lg text-[#9a9a9e]">
            {studioData?.cta_description || "Examine our curated archive of interactive monuments, physical artefacts, and digital brand architecture."}
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                if (studioData?.cta_button_url && studioData.cta_button_url.startsWith('http')) {
                  window.open(studioData.cta_button_url, '_blank');
                } else {
                  onNavigateToProjects();
                }
              }}
              className="inline-flex items-center justify-center gap-3 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-10 py-4 text-base font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer"
            >
              <span>{studioData?.cta_button_text || "Explore Selected Projects"}</span>
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
      )}
    </div>
  );
}
