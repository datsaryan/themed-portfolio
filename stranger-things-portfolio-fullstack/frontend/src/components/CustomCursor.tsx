import { useEffect, useState } from 'react';
import { worldEngine, WorldMode } from '../theme/themeEngine';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isUpside, setIsUpside] = useState(worldEngine.isUpsideDown());

  useEffect(() => {
    // Only activate on pointer fine devices (desktops)
    const media = window.matchMedia('(pointer: fine)');
    if (!media.matches) return;

    const unsubWorld = worldEngine.subscribe((mode: WorldMode) => {
      setIsUpside(mode === 'upsidedown');
    });

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      unsubWorld();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[99999] transition-transform duration-75"
      style={{
        transform: `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0)`
      }}
    >
      <div
        className={`w-8 h-8 rounded-full border border-dashed transition-colors duration-300 ${
          isUpside
            ? 'border-red-500 shadow-[0_0_12px_rgba(255,0,0,0.8)]'
            : 'border-red-600/70 shadow-[0_0_10px_rgba(255,50,50,0.5)]'
        } flex items-center justify-center`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isUpside ? 'bg-red-400' : 'bg-red-500'
          }`}
        />
      </div>
    </div>
  );
}
