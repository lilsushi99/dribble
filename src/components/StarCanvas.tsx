import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  speedX: number;
  speedY: number;
  pulseSpeed: number;
  pulseAngle: number;
  shimmerScale: number;
}

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Create subtle tiny white star dots
    const starCount = 130;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const baseOpacity = Math.random() * 0.55 + 0.25;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.6, // Tiny precise circular dots (0.6px to 2.0px)
        opacity: baseOpacity,
        baseOpacity,
        speedX: (Math.random() - 0.5) * 0.28, // Smooth alive drift
        speedY: (Math.random() - 0.48) * 0.32, // Smooth upward/lateral float
        pulseSpeed: Math.random() * 0.018 + 0.008,
        pulseAngle: Math.random() * Math.PI * 2,
        shimmerScale: Math.random() * 0.15 + 0.05,
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        // Delta-time scaled position update for ultra-smooth FPS independence
        star.x += star.speedX * dt * 60;
        star.y += star.speedY * dt * 60;

        // Wrap around boundaries smoothly
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Elegant brightness shimmer variation
        star.pulseAngle += star.pulseSpeed * dt * 60;
        const shimmerFactor = Math.sin(star.pulseAngle);
        star.opacity = star.baseOpacity + shimmerFactor * 0.28;
        if (star.opacity < 0.12) star.opacity = 0.12;
        if (star.opacity > 0.92) star.opacity = 0.92;

        const currentSize = star.size * (1 + shimmerFactor * star.shimmerScale);

        // Draw star dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Subtle radiance core for larger stars
        if (star.size > 1.3) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, currentSize * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.15})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
