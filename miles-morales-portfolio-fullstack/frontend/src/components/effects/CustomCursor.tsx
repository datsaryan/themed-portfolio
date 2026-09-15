import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, [role="button"], input, textarea, .comic-border, .interactive-target');
        setIsHovered(!!interactive);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Center Reticle Point */}
      <div
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 ease-out ${
          isHovered
            ? 'w-10 h-10 border-2 border-spider bg-spider/20 shadow-spider-glow'
            : isClicked
            ? 'w-4 h-4 bg-venom-purple scale-125'
            : 'w-3 h-3 bg-spider'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isClicked ? 0.8 : 1})`,
        }}
      >
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Crosshairs */}
            <div className="w-full h-[1px] bg-spider/80" />
            <div className="absolute h-full w-[1px] bg-spider/80" />
          </div>
        )}
      </div>

      {/* Spider HUD Target Ring */}
      {isHovered && (
        <div
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-dashed border-venom-purple/70 rounded-full animate-spin transition-transform duration-150 ease-out"
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            animationDuration: '6s',
          }}
        />
      )}
    </div>
  );
};
