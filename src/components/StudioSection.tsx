import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import comic1 from '../assets/images/comic_panel_1_1785513144023.jpg';
import comic2 from '../assets/images/comic_panel_2_1785513156210.jpg';
import comic3 from '../assets/images/comic_panel_3_1785513168462.jpg';
import p1Img from '../assets/images/project_artwork_1_1785513185877.jpg';
import p2Img from '../assets/images/project_artwork_2_1785513204720.jpg';
import { adminApi } from '../admin/services/adminApi';

interface Metric {
  id: string;
  label: string;
  target: number;
  suffix: string;
  prefix?: string;
  current: number;
  thumbImgs: string[];
}

interface ValueCard {
  id: string;
  number: string;
  title: string;
  description: string;
}

const decorativeThumbPool = [comic1, comic2, comic3, p1Img, p2Img];

// Statistics are stored in the DB as plain display strings (e.g. "148+", "99.8%", "$1M")
// since that's what the admin actually types in. To preserve the count-up animation,
// split each value into a leading prefix, a numeric target, and a trailing suffix.
function parseStatValue(raw: string): { prefix: string; target: number; suffix: string } {
  const match = (raw || '').trim().match(/^([^0-9.]*)([0-9]*\.?[0-9]+)([^0-9]*)$/);
  if (!match) return { prefix: '', target: 0, suffix: raw || '' };
  const [, prefix, numeric, suffix] = match;
  return { prefix, target: parseFloat(numeric) || 0, suffix };
}

export default function StudioSection() {
  const navigate = useNavigate();
  const [hoveredMetricId, setHoveredMetricId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [studioConfig, setStudioConfig] = useState<{
    heading: string;
    subtitle: string;
    storyParagraphs: string[];
    missionTitle: string;
    missionDesc: string;
    visionTitle: string;
    visionDesc: string;
    philosophyTitle: string;
    philosophyDesc: string;
    buttonText: string;
    buttonUrl: string;
  }>({
    heading: 'Origin & Craft',
    subtitle: '',
    storyParagraphs: [
      'Founded in 2020, Comic Art Studio emerged from a deep passion for sequential art, character design, and compelling visual narrative.',
      'Our team of artists and storytellers approaches every comic page, graphic novel, and concept artwork with uncompromising craftsmanship and dedication.',
      'We collaborate with visionary writers, independent creators, publishers, and brands worldwide to transform imaginative concepts into striking visual worlds.',
      'Every commission progresses from initial character concept sketches and page layouts to fine line inking, expressive color scripting, and final publication prep.',
    ],
    missionTitle: 'Discover',
    missionDesc: 'We start by understanding your goals, audience, and the story you need told, grounding every decision in a clear creative brief.',
    visionTitle: 'Design',
    visionDesc: 'Concepts, character studies, and layout exploration follow, refined through iteration until the direction feels right.',
    philosophyTitle: 'Create',
    philosophyDesc: 'Full production begins: inking, coloring, and page assembly, crafted with the same discipline at every stage.',
    buttonText: 'View Studio',
    buttonUrl: '/studio',
  });

  useEffect(() => {
    // Primary source: the dedicated homepage_content table (real CMS data).
    adminApi.getHomepageData().then((home) => {
      if (!home) return;
      setStudioConfig((prev) => ({
        ...prev,
        heading: home.story_title || prev.heading,
        subtitle: home.story_subtitle || '',
        storyParagraphs: home.story_content
          ? home.story_content
              .replace(/\r\n/g, '\n')
              .split(/\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
          : prev.storyParagraphs,
        missionTitle: 'Discover',
        missionDesc: home.mission_statement || prev.missionDesc,
        visionTitle: 'Design',
        visionDesc: home.vision_statement || prev.visionDesc,
        philosophyTitle: 'Create',
        philosophyDesc: home.philosophy_statement || prev.philosophyDesc,
      }));

      if (home.statistics_json && home.statistics_json.length > 0) {
        setMetrics(
          home.statistics_json.slice(0, 5).map((stat, idx) => {
            const { prefix, target, suffix } = parseStatValue(stat.value);
            const ownImages = stat.images && stat.images.length > 0 ? stat.images : null;
            const thumbImgs = ownImages
              ? [0, 1, 2, 3, 4].map((i) => ownImages[i % ownImages.length])
              : [0, 1, 2, 3, 4].map((i) => decorativeThumbPool[(idx + i) % decorativeThumbPool.length]);
            return {
              id: `stat-${idx}`,
              label: stat.label,
              target,
              prefix,
              suffix,
              current: 0,
              thumbImgs,
            };
          })
        );
      }
    });

    // Button text/url has no equivalent in homepage_content, so it still comes from
    // the Layout Builder (the only place it can currently be edited).
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((resData) => {
        const settings = resData.data || resData;
        if (settings && settings.homepage_layout) {
          const sections = JSON.parse(settings.homepage_layout);
          const studioSec = sections.find((s: any) => s.key === 'studio');
          if (studioSec) {
            const custom = studioSec.customSettings || {};
            setStudioConfig((prev) => ({
              ...prev,
              buttonText: studioSec.primaryButtonText || custom.buttonText || prev.buttonText,
              buttonUrl: studioSec.primaryButtonLink || custom.buttonUrl || prev.buttonUrl,
            }));
          }
        }
      })
      .catch((e) => console.warn('Using default studio section button config', e));
  }, []);

  const valueCards: ValueCard[] = [
    {
      id: 'v1',
      number: '01 / Mission',
      title: studioConfig.missionTitle,
      description: studioConfig.missionDesc,
    },
    {
      id: 'v2',
      number: '02 / Vision',
      title: studioConfig.visionTitle,
      description: studioConfig.visionDesc,
    },
    {
      id: 'v3',
      number: '03 / Philosophy',
      title: studioConfig.philosophyTitle,
      description: studioConfig.philosophyDesc,
    },
  ];

  const initialMetrics: Metric[] = [
    { id: 'm1', label: 'Projects Completed', target: 148, suffix: '+', current: 0, thumbImgs: [comic1, comic2, comic3, p1Img, p2Img] },
    { id: 'm2', label: 'Clients Served', target: 62, suffix: '', current: 0, thumbImgs: [comic2, comic3, p1Img, p2Img, comic1] },
    { id: 'm3', label: 'Design Awards', target: 24, suffix: '', current: 0, thumbImgs: [comic3, p1Img, p2Img, comic1, comic2] },
    { id: 'm4', label: 'Client Satisfaction', target: 99.8, suffix: '%', current: 0, thumbImgs: [p1Img, p2Img, comic1, comic2, comic3] },
    { id: 'm5', label: 'Client Capital Raised', target: 1, prefix: '$', suffix: 'M', current: 0, thumbImgs: [p2Img, comic1, comic2, comic3, p1Img] },
  ];

  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);

  const paragraphsContainerRef = useRef<HTMLDivElement | null>(null);
  const maxOpacityReachedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = paragraphsContainerRef.current;
    if (!el) return;

    el.style.opacity = '0.3';
    el.style.willChange = 'opacity';

    const handleScroll = () => {
      if (maxOpacityReachedRef.current || !paragraphsContainerRef.current) return;

      const rect = paragraphsContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startPoint = windowHeight;
      const endPoint = windowHeight * 0.35;

      if (rect.top <= startPoint) {
        const scrollDistance = startPoint - rect.top;
        const totalDistance = startPoint - endPoint;
        const progress = Math.min(Math.max(scrollDistance / totalDistance, 0), 1);

        const calculatedOpacity = 0.3 + progress * 0.7;
        paragraphsContainerRef.current.style.opacity = calculatedOpacity.toFixed(3);

        if (calculatedOpacity >= 0.99) {
          paragraphsContainerRef.current.style.opacity = '1';
          maxOpacityReachedRef.current = true;
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer to trigger counting numbers every time section enters viewport
  useEffect(() => {
    let animFrame: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - (1 - progress) * (1 - progress);

            setMetrics((prevMetrics) =>
              prevMetrics.map((m) => ({
                ...m,
                current: Number((m.target * easedProgress).toFixed(m.target % 1 !== 0 ? 1 : 0)),
              }))
            );

            if (progress < 1) {
              animFrame = requestAnimationFrame(animate);
            }
          };

          animFrame = requestAnimationFrame(animate);
        } else {
          setMetrics((prevMetrics) =>
            prevMetrics.map((m) => ({ ...m, current: 0 }))
          );
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

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

  return (
    <section
      ref={sectionRef}
      id="section-studio-full"
      className="relative w-full min-h-screen py-24 px-6 sm:px-16 bg-white text-black flex flex-col justify-between space-y-20"
    >
      {/* 1. Top Editorial Story Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-start pt-8">
        {/* Left Heading: Origin & Craft */}
        <div className="md:col-span-5 md:pt-4 md:sticky md:top-28 space-y-4">
          <h2 className="font-outfit text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.06] text-[#111115]">
            {studioConfig.heading}
          </h2>
          {studioConfig.subtitle && (
            <p className="font-inter text-base sm:text-lg text-[#55555c] font-normal leading-relaxed">
              {studioConfig.subtitle}
            </p>
          )}
        </div>

        {/* Right Long Editorial Text */}
        <div
          ref={paragraphsContainerRef}
          className="md:col-span-7 space-y-6 font-inter text-base sm:text-lg leading-relaxed transition-opacity duration-75 text-[#111115]"
        >
          {studioConfig.storyParagraphs.map((para, idx) => (
            <p
              key={idx}
              className={
                idx === 0
                  ? 'text-[#111115] font-normal text-lg sm:text-xl leading-relaxed text-justify'
                  : 'text-[#333339] font-normal leading-relaxed text-justify'
              }
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* 2. Our Process — sequential timeline (previously Mission/Vision/Philosophy cards) */}
      <div className="max-w-7xl mx-auto w-full pt-12 border-t border-black/15">
        <h3 className="font-outfit text-2xl sm:text-3xl font-light text-[#111115] tracking-tight mb-10">
          Our <span className="text-[#E6A800]">Process</span>
        </h3>
        <div className="relative flex flex-col md:flex-row md:items-start gap-10 md:gap-6">
          <div className="hidden md:block absolute top-[13px] left-[6%] right-[6%] h-px bg-black/15" />
          <div className="md:hidden absolute top-1 bottom-1 left-[13px] w-px bg-black/15" />
          {valueCards.map((card, idx) => (
            <div key={card.id} className="relative flex md:flex-col items-start gap-4 md:gap-6 flex-1 min-w-0">
              <div className="relative z-10 w-7 h-7 rounded-full border border-black/25 bg-[#f8f8fa] flex items-center justify-center flex-shrink-0">
                <span className="font-inter text-[11px] text-[#E6A800]">{idx + 1}</span>
              </div>
              <div className="space-y-2 pt-0.5 min-w-0">
                <h3 className="font-outfit text-lg text-[#111115] font-light">{card.title}</h3>
                <p className="font-inter text-sm text-[#55555d] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Statistics Section - Animated numbers with emerging thumbnails */}
      <div className="max-w-7xl mx-auto w-full pt-12 border-t border-black/15">
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
                {/* 5 Artwork thumbnails emerging sequentially on hover */}
                {m.thumbImgs.map((imgSrc, imgIdx) => {
                  const offset = fanOffsets[imgIdx];

                  return (
                    <div
                      key={imgIdx}
                      className="absolute top-0 left-1/2 -ml-6 w-12 h-16 rounded border border-black/20 overflow-hidden shadow-xl pointer-events-none z-0"
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

                {/* Metric Card */}
                <div
                  className="relative z-10 bg-white border border-black/15 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300 shadow-sm"
                  style={{
                    transform: isHovered ? 'translate3d(0, -3px, 0)' : 'translate3d(0, 0, 0)',
                    borderColor: isHovered ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.15)',
                  }}
                >
                  <div className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-light text-black tracking-tight">
                    {m.prefix}
                    {m.current}
                    {m.suffix}
                  </div>
                  <div className="font-inter text-xs sm:text-sm text-[#55555d] font-normal">
                    {m.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Button: View Studio */}
      <div className="max-w-7xl mx-auto w-full pt-8 flex justify-center">
        <button
          onClick={() => {
            if (studioConfig.buttonUrl && studioConfig.buttonUrl.startsWith('http')) {
              window.open(studioConfig.buttonUrl, '_blank');
            } else {
              navigate(studioConfig.buttonUrl || '/studio');
            }
          }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#111115] hover:bg-black text-white text-sm font-semibold tracking-wider transition-all duration-300 hover:scale-105 group shadow-lg cursor-pointer active:scale-95"
        >
          <span>{studioConfig.buttonText}</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ transform: 'rotate(15deg)' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>
    </section>
  );
}
