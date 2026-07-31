import { useEffect, useState, useRef } from 'react';
import ComicSection from '../components/ComicSection';

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
}

export default function StudioPage({ onNavigateToProjects }: StudioPageProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const metricsRef = useRef<HTMLDivElement | null>(null);

  const initialMetrics: Metric[] = [
    { id: 'm1', label: 'Projects Completed', target: 148, suffix: '+', current: 0 },
    { id: 'm2', label: 'Clients Served', target: 62, suffix: '', current: 0 },
    { id: 'm3', label: 'Design Awards', target: 24, suffix: '', current: 0 },
    { id: 'm4', label: 'Client Satisfaction', target: 99.8, suffix: '%', current: 0 },
    { id: 'm5', label: 'Client Capital Raised', target: 450, prefix: '$', suffix: 'M+', current: 0 },
  ];

  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);

  useEffect(() => {
    window.scrollTo(0, 0);
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
      {/* Editorial Header (No Tag) */}
      <div className="space-y-6 max-w-4xl pt-8">
        <h1 className="font-outfit text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.06] text-white">
          Engineering <span className="text-[#E6A800]">digital monuments</span> with architectural discipline.
        </h1>
        <p className="font-inter text-lg sm:text-xl text-[#9a9a9e] font-normal leading-relaxed">
          KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.
        </p>
      </div>

      {/* Long-form Studio Story */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-white/10">
        <div className="md:col-span-4">
          <h2 className="font-outfit text-2xl sm:text-3xl font-light text-white tracking-tight sticky top-32">
            The Origin & Craft
          </h2>
        </div>
        <div className="md:col-span-8 space-y-6 font-inter text-base sm:text-lg text-[#9a9a9e] leading-relaxed">
          <p className="text-white font-medium text-lg sm:text-xl leading-relaxed">
            Founded in 2018, KINETIC emerged from a conviction that modern digital interfaces had succumbed to disposable SaaS visual formulas, homogenized component libraries, and visual noise.
          </p>
          <p>
            With over eight years of international practice spanning Tokyo, London, and New York, our partners approach digital architecture with the same material gravity, tactile inertia, and editorial permanence as stone, steel, and light.
          </p>
          <p>
            We collaborate with visionary founders, private equity firms, aerospace labs, and cultural institutions who reject transient design trends in pursuit of undeniable visual authority.
          </p>
          <p>
            Every project begins with fundamental brand architecture before progressing through physical prototype sketching, manga storyboard mapping, and custom shader engineering.
          </p>
        </div>
      </div>

      {/* Mission, Vision & Creative Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
        <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-2xl space-y-4 hover:border-white/20 transition-colors">
          <div className="text-xs font-inter uppercase tracking-widest text-[#E6A800]">01 / Mission</div>
          <h3 className="font-outfit text-2xl text-white font-light">Eliminate Noise</h3>
          <p className="font-inter text-sm text-[#9a9a9e] leading-relaxed">
            To strip away superfluous digital decoration and build quiet, high-contrast digital monuments that command immediate respect and lasting clarity.
          </p>
        </div>

        <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-2xl space-y-4 hover:border-white/20 transition-colors">
          <div className="text-xs font-inter uppercase tracking-widest text-[#E6A800]">02 / Vision</div>
          <h3 className="font-outfit text-2xl text-white font-light">Permanence & Inertia</h3>
          <p className="font-inter text-sm text-[#9a9a9e] leading-relaxed">
            A web ecosystem where interactive architecture exhibits physical weight, tactile responsiveness, and editorial craftsmanship worthy of museum archival status.
          </p>
        </div>

        <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-2xl space-y-4 hover:border-white/20 transition-colors">
          <div className="text-xs font-inter uppercase tracking-widest text-[#E6A800]">03 / Philosophy</div>
          <h3 className="font-outfit text-2xl text-white font-light">Sculptural Rigor</h3>
          <p className="font-inter text-sm text-[#9a9a9e] leading-relaxed">
            We treat layout margins, typographic scale ratios, and animation inertia curves as mathematical laws, ensuring every interface feels bespoke and deliberate.
          </p>
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
          {metrics.map((m) => (
            <div
              key={m.id}
              className="bg-[#0a0a0c] border border-white/10 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-4 hover:border-white/20 transition-colors"
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
          ))}
        </div>
      </div>

      {/* Final Studio CTA: Explore Selected Projects */}
      <div className="pt-16 pb-8 border-t border-white/10 text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="font-outfit text-4xl sm:text-6xl font-light text-white tracking-tight">
          You’ve seen how we think. <span className="text-[#E6A800]">Now explore what we’ve built.</span>
        </h2>
        <p className="font-inter text-base sm:text-lg text-[#9a9a9e]">
          Examine our curated archive of interactive monuments, physical artefacts, and digital brand architecture.
        </p>
        <div className="pt-4">
          <button
            onClick={onNavigateToProjects}
            className="inline-flex items-center justify-center gap-3 bg-[#0097FF] hover:bg-[#0082e6] text-white rounded-full px-10 py-4 text-base font-medium tracking-wide transition-all duration-300 active:scale-98 cursor-pointer"
          >
            <span>Explore Selected Projects</span>
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
