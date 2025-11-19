import React, { useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  maxTiltDeg?: number; // maximum degrees to tilt on each axis
  perspective?: number; // perspective in px
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTiltDeg = 10,
  perspective = 1000,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    // Map to tilt angles, keep layout size unchanged (no scale)
    const rotateY = (px - 0.5) * (maxTiltDeg * 2); // left(-) to right(+)
    const rotateX = -(py - 0.5) * (maxTiltDeg * 2); // top(+) to bottom(-)

    inner.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const reset = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <div
        ref={innerRef}
        className="w-full h-full will-change-transform transition-transform duration-150 [transform-style:preserve-3d]"
        style={{ transform: `perspective(${perspective}px)` }}
      >
        {children}
      </div>
    </div>
  );
};
