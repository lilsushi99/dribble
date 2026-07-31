import { useRef, useEffect, useState } from 'react';
import comic1 from '../assets/images/comic_panel_1_1785513144023.jpg';
import comic2 from '../assets/images/comic_panel_2_1785513156210.jpg';
import comic3 from '../assets/images/comic_panel_3_1785513168462.jpg';
import InteractiveHeading from './InteractiveHeading';

export default function ComicSection() {
  const [isIlluminated, setIsIlluminated] = useState(false);
  const [isAssembled, setIsAssembled] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollRef1 = useRef<HTMLDivElement | null>(null);
  const scrollRef2 = useRef<HTMLDivElement | null>(null);
  const scrollRef3 = useRef<HTMLDivElement | null>(null);

  const panelSet1 = [
    { id: 'p1-1', title: 'Chapter I: Monolith', image: comic1, chapter: '01' },
    { id: 'p1-2', title: 'Chapter IV: Drafts', image: comic2, chapter: '04' },
    { id: 'p1-3', title: 'Chapter VII: Silence', image: comic3, chapter: '07' },
  ];

  const panelSet2 = [
    { id: 'p2-1', title: 'Chapter II: Craft', image: comic2, chapter: '02' },
    { id: 'p2-2', title: 'Chapter V: Space', image: comic3, chapter: '05' },
    { id: 'p2-3', title: 'Chapter VIII: Structure', image: comic1, chapter: '08' },
  ];

  const panelSet3 = [
    { id: 'p3-1', title: 'Chapter III: Void', image: comic3, chapter: '03' },
    { id: 'p3-2', title: 'Chapter VI: Form', image: comic1, chapter: '06' },
    { id: 'p3-3', title: 'Chapter IX: Light', image: comic2, chapter: '09' },
  ];

  // Intersection observer for heading illumination and column assembly
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIlluminated(true);
          setIsAssembled(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Infinite smooth upward reel animation - continuous, never pauses on hover or click
  useEffect(() => {
    let animId: number;
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;

    const animate = () => {
      pos1 += 0.4;
      pos2 += 0.6; // Slightly varied speed for natural parallax
      pos3 += 0.45;

      if (scrollRef1.current) {
        const max1 = scrollRef1.current.scrollHeight / 2;
        if (pos1 >= max1) pos1 = 0;
        scrollRef1.current.style.transform = `translate3d(0, -${pos1}px, 0)`;
      }

      if (scrollRef2.current) {
        const max2 = scrollRef2.current.scrollHeight / 2;
        if (pos2 >= max2) pos2 = 0;
        scrollRef2.current.style.transform = `translate3d(0, -${pos2}px, 0)`;
      }

      if (scrollRef3.current) {
        const max3 = scrollRef3.current.scrollHeight / 2;
        if (pos3 >= max3) pos3 = 0;
        scrollRef3.current.style.transform = `translate3d(0, -${pos3}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-studio"
      className="relative w-full min-h-screen py-24 px-6 sm:px-16 bg-[#050505] flex flex-col justify-center overflow-hidden"
    >
      {/* Section Header with First Word 100% Opacity & Hover Interaction */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
        <InteractiveHeading
          as="h2"
          firstWord="Sequential"
          middleText="storyboards rendered in continuous motion."
          isIlluminated={isIlluminated}
          className="font-outfit text-3xl sm:text-5xl md:text-6xl font-light text-[#f3f3f3] tracking-tight"
        />
        <p className="font-inter text-base sm:text-lg text-[#9a9a9e] max-w-2xl mx-auto font-normal leading-relaxed">
          Dynamic visual narratives rendered across independent manga reels.
        </p>
      </div>

      {/* Independent Three Columns - Perfectly Square Corners (rounded-none) & Coordinated Assembly */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-center justify-center my-auto">
        {/* Column 1: Left Column (Slides gently from left) */}
        <div
          className="relative overflow-hidden h-[480px] sm:h-[560px] border border-white/15 bg-black rounded-none shadow-2xl transition-all duration-700 ease-out will-change-transform"
          style={{
            transform: isAssembled ? 'translate3d(0, 0, 0)' : 'translate3d(-40px, 0, 0)',
            opacity: isAssembled ? 1 : 0,
          }}
        >
          <div ref={scrollRef1} className="will-change-transform flex flex-col gap-0 p-0">
            {[...panelSet1, ...panelSet1].map((panel, idx) => (
              <div
                key={`${panel.id}-${idx}`}
                className="relative aspect-[6/10] w-full border-b border-white/10 bg-black p-0 group overflow-hidden rounded-none"
              >
                <img
                  src={panel.image}
                  alt={panel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-500 rounded-none block"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#050505]/90 backdrop-blur-sm px-3 py-2 border-t border-white/10 flex justify-between items-center text-[11px]">
                  <span className="font-outfit text-white font-medium">{panel.title}</span>
                  <span className="font-inter text-[#E6A800]">{panel.chapter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Center Column (Drops softly from above) */}
        <div
          className="relative overflow-hidden h-[540px] sm:h-[640px] border border-white/20 bg-black shadow-2xl z-10 rounded-none transition-all duration-700 ease-out delay-100 will-change-transform"
          style={{
            transform: isAssembled ? 'translate3d(0, 0, 0)' : 'translate3d(0, -40px, 0)',
            opacity: isAssembled ? 1 : 0,
          }}
        >
          <div ref={scrollRef2} className="will-change-transform flex flex-col gap-0 p-0">
            {[...panelSet2, ...panelSet2].map((panel, idx) => (
              <div
                key={`${panel.id}-${idx}`}
                className="relative aspect-[6/12] w-full border-b border-white/10 bg-black p-0 group overflow-hidden rounded-none"
              >
                <img
                  src={panel.image}
                  alt={panel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-130 brightness-95 group-hover:grayscale-0 transition-all duration-500 rounded-none block"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-sm px-3 py-2 border-t border-white/10 flex justify-between items-center text-[11px]">
                  <span className="font-outfit text-white font-medium">{panel.title}</span>
                  <span className="font-inter text-[#E6A800] font-semibold">{panel.chapter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Right Column (Slides gently from right) */}
        <div
          className="relative overflow-hidden h-[480px] sm:h-[560px] border border-white/15 bg-black rounded-none shadow-2xl transition-all duration-700 ease-out delay-200 will-change-transform"
          style={{
            transform: isAssembled ? 'translate3d(0, 0, 0)' : 'translate3d(40px, 0, 0)',
            opacity: isAssembled ? 1 : 0,
          }}
        >
          <div ref={scrollRef3} className="will-change-transform flex flex-col gap-0 p-0">
            {[...panelSet3, ...panelSet3].map((panel, idx) => (
              <div
                key={`${panel.id}-${idx}`}
                className="relative aspect-[6/10] w-full border-b border-white/10 bg-black p-0 group overflow-hidden rounded-none"
              >
                <img
                  src={panel.image}
                  alt={panel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-500 rounded-none block"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#050505]/90 backdrop-blur-sm px-3 py-2 border-t border-white/10 flex justify-between items-center text-[11px]">
                  <span className="font-outfit text-white font-medium">{panel.title}</span>
                  <span className="font-inter text-[#E6A800]">{panel.chapter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

