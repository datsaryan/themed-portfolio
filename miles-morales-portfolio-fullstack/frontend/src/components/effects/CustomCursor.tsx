import React, { useEffect, useState } from 'react';
import { WorldMode } from '../../types/portfolio';

interface CustomCursorProps {
  world: WorldMode;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ world }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
    >
      <div
        className={`w-6 h-6 rounded-full border border-dashed transition-all duration-150 flex items-center justify-center ${
          clicked ? 'scale-75 border-hawkins-amber' : 'scale-100'
        } ${world === 'upsidedown' ? 'border-hawkins-red shadow-upside-glow' : 'border-hawkins-amber shadow-amber-glow'}`}
      >
        <div
          className={`w-1 h-1 rounded-full ${
            world === 'upsidedown' ? 'bg-hawkins-red' : 'bg-hawkins-amber'
          }`}
        />
      </div>
    </div>
  );
};
