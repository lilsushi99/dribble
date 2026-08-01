import React, { useState } from 'react';

const DEFAULT_WORDS = [
  'Storyboard',
  'Character Design',
  'Comic Art',
  'Visual Development',
  'Concept Art',
  'Manga',
  'Sequential Art',
  'Illustration',
  'World Building',
  'Narrative Design',
  'Digital Painting',
  'Environment Design',
  'Creative Direction',
  'Graphic Storytelling',
  'Editorial Illustration',
  'Visual Identity',
  'Motion Graphics',
  'Brand Design',
  'Typography',
  'Animation',
];

const ACCENT_COLORS = [
  '#FFD700', // Vibrant Yellow
  '#0097FF', // Electric Blue
  '#10B981', // Emerald Green
  '#A855F7', // Bright Purple
  '#F97316', // Bright Orange
  '#EC4899', // Vivid Pink
  '#06B6D4', // Cyan
  '#E6A800', // Gold Accent
];

interface MarqueeSectionProps {
  words?: string[];
  speed?: number; // seconds
}

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({
  words = DEFAULT_WORDS,
  speed = 35,
}) => {
  // Split words into two sets for the two ribbons
  const midIndex = Math.ceil(words.length / 2);
  const row1Words = words.slice(0, midIndex);
  const row2Words = words.slice(midIndex);

  // Repeat word arrays to ensure seamless loop
  const list1 = [...row1Words, ...row1Words, ...row1Words, ...row1Words];
  const list2 = [...row2Words, ...row2Words, ...row2Words, ...row2Words];

  const [hoveredIdxRow1, setHoveredIdxRow1] = useState<number | null>(null);
  const [hoveredIdxRow2, setHoveredIdxRow2] = useState<number | null>(null);

  return (
    <section className="relative w-full py-16 bg-[#050505] overflow-hidden select-none border-y border-white/5">
      <div className="relative max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4 py-6">
        {/* Layer Two Ribbon (Top Layer, +3deg rotation, moves right -> left) */}
        <div className="w-full overflow-hidden transform rotate-2 z-10 py-3 bg-[#0a0a0d]/90 backdrop-blur-md border-y border-white/10 shadow-xl">
          <div
            className="marquee-track animate-marquee-left flex items-center whitespace-nowrap"
            style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
          >
            {list2.map((word, idx) => {
              const color = ACCENT_COLORS[idx % ACCENT_COLORS.length];
              const isHovered = hoveredIdxRow2 === idx;
              return (
                <div
                  key={`r2-${word}-${idx}`}
                  onMouseEnter={() => setHoveredIdxRow2(idx)}
                  onMouseLeave={() => setHoveredIdxRow2(null)}
                  className="inline-flex items-center px-6 cursor-pointer group transition-all duration-300"
                >
                  <span
                    className="font-outfit text-xl sm:text-2xl md:text-3xl font-medium tracking-tight uppercase transition-colors duration-300"
                    style={{
                      color: isHovered ? color : '#FFFFFF',
                      textShadow: isHovered ? `0 0 20px ${color}60` : 'none',
                    }}
                  >
                    {word}
                  </span>
                  <span className="ml-8 text-white/30 text-xs font-mono">✦</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Layer One Ribbon (Bottom Layer, -3deg rotation, moves left -> right, secondary muted gray) */}
        <div className="w-full overflow-hidden transform -rotate-2 z-0 py-3 bg-[#08080a]/80 backdrop-blur-md border-y border-white/10 shadow-xl -mt-6">
          <div
            className="marquee-track animate-marquee-right flex items-center whitespace-nowrap"
            style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
          >
            {list1.map((word, idx) => {
              return (
                <div
                  key={`r1-${word}-${idx}`}
                  className="inline-flex items-center px-6 cursor-pointer group transition-all duration-300"
                >
                  <span className="font-outfit text-xl sm:text-2xl md:text-3xl font-medium tracking-tight uppercase text-[#888890]">
                    {word}
                  </span>
                  <span className="ml-8 text-white/15 text-xs font-mono">✦</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
