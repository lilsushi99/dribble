import { useEffect, useState, useRef } from 'react';

interface Metric {
  id: string;
  label: string;
  target: number;
  suffix: string;
  prefix?: string;
  current: number;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export default function StudioSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const initialMetrics: Metric[] = [
    { id: 'm1', label: 'Projects Completed', target: 148, suffix: '+', current: 0 },
    { id: 'm2', label: 'Clients Served', target: 62, suffix: '', current: 0 },
    { id: 'm3', label: 'Design Awards', target: 24, suffix: '', current: 0 },
    { id: 'm4', label: 'Client Satisfaction', target: 99.8, suffix: '%', current: 0 },
    { id: 'm5', label: 'Client Capital Raised', target: 450, prefix: '$', suffix: 'M+', current: 0 },
  ];

  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);

  const testimonials: Testimonial[] = [
    {
      quote:
        'KINETIC approached our brand architecture with the gravity of monumental sculpture. Their spatial and digital systems redefined our global positioning overnight.',
      author: 'Marcus Vance',
      role: 'Chief Creative Officer',
      company: 'Vanguard Orbital',
    },
    {
      quote:
        'In an industry saturated with disposable AI templates, KINETIC builds digital monuments. Their attention to physical scroll inertia and typographic hierarchy is unmatched.',
      author: 'Evelyn Kuroda',
      role: 'Founding Director',
      company: 'Kuroda Museum Tokyo',
    },
    {
      quote:
        'Working with KINETIC felt like commissioning a custom architectural pavilion. Every detail was handcrafted with extraordinary discipline.',
      author: 'Julian Thorne',
      role: 'Head of Brand',
      company: 'Atelier Nocturne London',
    },
  ];

  // Intersection Observer to trigger counting numbers from 0 when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

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
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      id="section-studio-full"
      className="relative w-full min-h-screen py-24 px-6 sm:px-16 bg-white text-black flex flex-col justify-between space-y-24"
    >
      {/* Top Editorial Story Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-end pt-8">
        {/* Left Heading - Large and sitting slightly lower vertically */}
        <div className="md:col-span-5 md:pt-20">
          <h2 className="font-outfit text-4xl sm:text-6xl lg:text-7xl font-light text-black tracking-tight leading-[1.06]">
            The Studio Story & Philosophy
          </h2>
        </div>

        {/* Right Long Editorial Text */}
        <div className="md:col-span-7 space-y-6 font-inter text-base sm:text-lg text-[#55555d] leading-relaxed">
          <p className="text-[#111115] font-normal text-lg sm:text-xl leading-relaxed">
            Founded in 2018, KINETIC operates as a disciplined design laboratory at the intersection of brand architecture, physical motion systems, and digital craftsmanship.
          </p>
          <p>
            With over eight years of rigorous practice spanning Tokyo, London, and New York, our mission is singular: to eliminate digital noise and engineer lasting visual monuments for visionary founders and global cultural institutions.
          </p>
          <p>
            Our approach rejects generic SaaS conventions, pre-built template trends, and artificial decoration. We treat digital spaces with the same architectural gravity, material honesty, and physical inertia as stone, steel, and light.
          </p>
        </div>
      </div>

      {/* Metrics Section - White cards with thin black borders */}
      <div className="max-w-7xl mx-auto w-full pt-12 border-t border-black/15">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-black/15 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-4 hover:border-black/30 transition-colors shadow-sm"
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
          ))}
        </div>
      </div>
    </section>
  );
}
