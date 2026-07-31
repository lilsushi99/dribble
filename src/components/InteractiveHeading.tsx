import { useState } from 'react';

interface InteractiveHeadingProps {
  firstWord: string;
  middleText?: string;
  yellowText?: string;
  tailText?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  isLight?: boolean;
  isIlluminated?: boolean;
}

export default function InteractiveHeading({
  firstWord,
  middleText = '',
  yellowText = '',
  tailText = '',
  className = '',
  as = 'h2',
  isLight = false,
  isIlluminated = true,
}: InteractiveHeadingProps) {
  const [isHovered, setIsHovered] = useState(false);

  const Component = as;

  // Base opacity/brightness style for scroll entrance reveal
  const scrollStyle = {
    opacity: isIlluminated ? 1 : 0.35,
    filter: isIlluminated ? 'brightness(1)' : 'brightness(0.35)',
  };

  // Color & opacity classes
  const firstWordColor = isLight ? 'text-black' : 'text-white';
  const remainingColor = isLight
    ? isHovered ? 'text-black opacity-100' : 'text-black/60 opacity-60'
    : isHovered ? 'text-white opacity-100' : 'text-white/65 opacity-65';

  return (
    <Component
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`cursor-default ${className}`}
      style={scrollStyle}
    >
      {/* First Word - Always 100% Opacity */}
      <span className={`inline-block font-normal ${firstWordColor} transition-colors duration-500`}>
        {firstWord}&nbsp;
      </span>

      {/* Middle Text - 60-70% default, 100% on hover */}
      {middleText && (
        <span className={`inline-block transition-all duration-500 ease-out ${remainingColor}`}>
          {middleText}&nbsp;
        </span>
      )}

      {/* Yellow Accent - Stays #E6A800 constant */}
      {yellowText && (
        <span className="text-[#E6A800] inline-block font-normal">
          {yellowText}
        </span>
      )}

      {/* Tail Text - 60-70% default, 100% on hover */}
      {tailText && (
        <span className={`inline-block transition-all duration-500 ease-out ${remainingColor}`}>
          &nbsp;{tailText}
        </span>
      )}
    </Component>
  );
}
