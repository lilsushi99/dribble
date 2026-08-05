import React from 'react';

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
  const Component = as;

  // Base opacity/brightness style for scroll entrance reveal
  const scrollStyle = {
    opacity: isIlluminated ? 1 : 0.35,
    filter: isIlluminated ? 'brightness(1)' : 'brightness(0.35)',
    transition: 'opacity 1s ease-out, filter 1s ease-out',
  };

  const wordColor = isLight ? 'text-black' : 'text-white';

  return (
    <Component className={`cursor-default ${className}`} style={scrollStyle}>
      {/* First Word - Always 100% Opacity */}
      {firstWord && (
        <span className={`inline-block font-normal ${wordColor}`}>
          {firstWord}&nbsp;
        </span>
      )}

      {/* Middle Text */}
      {middleText && (
        <span className={`inline-block ${wordColor}`}>
          {middleText}&nbsp;
        </span>
      )}

      {/* Yellow Accent - Stays #E6A800 constant */}
      {yellowText && (
        <span className="text-[#E6A800] inline-block font-normal">
          {yellowText}
        </span>
      )}

      {/* Tail Text */}
      {tailText && (
        <span className={`inline-block ${wordColor}`}>
          &nbsp;{tailText}
        </span>
      )}
    </Component>
  );
}

