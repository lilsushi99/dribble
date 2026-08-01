import { useEffect, useState, useRef } from 'react';
import comic1 from '../assets/images/comic_panel_1_1785513144023.jpg';
import comic2 from '../assets/images/comic_panel_2_1785513156210.jpg';
import comic3 from '../assets/images/comic_panel_3_1785513168462.jpg';
import p1Img from '../assets/images/project_artwork_1_1785513185877.jpg';
import p2Img from '../assets/images/project_artwork_2_1785513204720.jpg';
import InteractiveHeading from './InteractiveHeading';

interface Metric {
  id: string;
  label: string;
  target: number;
  suffix: string;
  prefix?: string;
  current: number;
  thumbImgs: string[];
}

export default function StudioSection() {
  const [hoveredMetricId, setHoveredMetricId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const initialMetrics: Metric[] = [
    { id: 'm1', label: 'Projects Completed', target: 148, suffix: '+', current: 0, thumbImgs: [comic1, comic2, comic3, p1Img, p2Img] },
    { id: 'm2', label: 'Clients Served', target: 62, suffix: '', current: 0, thumbImgs: [comic2, comic3, p1Img, p2Img, comic1] },
    { id: 'm3', label: 'Design Awards', target: 24, suffix: '', current: 0, thumbImgs: [comic3, p1Img, p2Img, comic1, comic2] },
    { id: 'm4', label: 'Client Satisfaction', target: 99.8, suffix: '%', current: 0, thumbImgs: [p1Img, p2Img, comic1, comic2, comic3] },
    { id: 'm5', label: 'Client Capital Raised', target: 450, prefix: '$', suffix: 'M+', current: 0, thumbImgs: [p2Img, comic1, comic2, comic3, p1Img] },
  ];

  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);

  // Paragraph container ref for scroll progress opacity reveal
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
          const duration = 2000; // 2 seconds count up
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
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
          // Reset to 0 when leaving viewport so it re-animates on re-entry
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

  // Fan transformation offsets for 5 emerging thumbnails
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
      className="relative w-full min-h-screen py-24 px-6 sm:px-16 bg-white text-black flex flex-col justify-between space-y-24"
    >
      {/* Top Editorial Story Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-end pt-8">
        {/* Left Heading - First Word Pure Black (#111115), Remaining words reduced opacity (#55555d) - Static */}
        <div className="md:col-span-5 md:pt-20">
          <h2 className="font-outfit text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.06]">
            <span className="text-[#111115] font-normal">The&nbsp;</span>
            <span className="text-[#55555d] font-light">Studio Story & Philosophy</span>
          </h2>
        </div>

        {/* Right Long Editorial Text - Scroll progress opacity reveal, pure black P1 & grey-black P2/P3 */}
        <div
          ref={paragraphsContainerRef}
          className="md:col-span-7 space-y-6 font-inter text-base sm:text-lg leading-relaxed transition-opacity duration-75"
        >
          <p className="text-[#111115] font-normal text-lg sm:text-xl leading-relaxed">
            Founded in 2018, KINETIC operates as a disciplined design laboratory at the intersection of brand architecture, physical motion systems, and digital craftsmanship.
          </p>
          <p className="text-[#55555d]">
            With over eight years of rigorous practice spanning Tokyo, London, and New York, our mission is singular: to eliminate digital noise and engineer lasting visual monuments for visionary founders and global cultural institutions.
          </p>
          <p className="text-[#55555d]">
            Our approach rejects generic SaaS conventions, pre-built template trends, and artificial decoration. We treat digital spaces with the same architectural gravity, material honesty, and physical inertia as stone, steel, and light.
          </p>
        </div>
      </div>

      {/* Metrics Section - White cards with subtle hover lift & 5 emerging artwork thumbnails */}
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
                {/* 5 Comic artwork thumbnails emerging sequentially from behind metric card on hover */}
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
    </section>
  );
}

