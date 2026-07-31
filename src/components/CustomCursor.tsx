import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch desktop environments
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animationFrame: number;
    const animateFollower = () => {
      setFollowerPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18, // Clean smooth spring inertia
          y: prev.y + dy * 0.18,
        };
      });
      animationFrame = requestAnimationFrame(animateFollower);
    };

    animationFrame = requestAnimationFrame(animateFollower);

    // Detect hoverable clickable elements for physical feedback
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive-cursor')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementHover);
      cancelAnimationFrame(animationFrame);
    };
  }, [position.x, position.y, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Center Point */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0) scale(${isHovered ? 0 : 1})`,
        }}
      />
      {/* Liquid Kinetic Follower Ring - Clean hairline without blur or glow */}
      <div
        className="fixed top-0 left-0 border border-white/40 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out"
        style={{
          width: isHovered ? '48px' : '28px',
          height: isHovered ? '48px' : '28px',
          transform: `translate3d(${followerPos.x - (isHovered ? 24 : 14)}px, ${
            followerPos.y - (isHovered ? 24 : 14)
          }px, 0)`,
          borderColor: isHovered ? 'rgba(197, 168, 128, 0.7)' : 'rgba(255, 255, 255, 0.3)',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
        }}
      />
    </>
  );
}
