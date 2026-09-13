import React, { useEffect, useRef } from 'react';
import { sound } from '../../audio/soundEngine';

interface SpideyWebOverlayProps {
  originX?: number;
  originY?: number;
  onClose: () => void;
  children: React.ReactNode;
  accentColor?: string;
}

export const SpideyWebOverlay: React.FC<SpideyWebOverlayProps> = ({
  originX,
  originY,
  onClose,
  children,
  accentColor = '#e62429',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    sound.playThwip();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let progress = 0;
    const startTime = performance.now();
    const duration = 400; // ms for web launch

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const startX = originX ?? window.innerWidth / 2;
    const startY = originY ?? window.innerHeight / 2;
    const targetCenterX = window.innerWidth / 2;
    const targetCenterY = window.innerHeight / 2;

    // Precalculate radial spokes to corners and edges
    const spokes = [
      { x: 0, y: 0 },
      { x: window.innerWidth * 0.25, y: 0 },
      { x: window.innerWidth * 0.5, y: 0 },
      { x: window.innerWidth * 0.75, y: 0 },
      { x: window.innerWidth, y: 0 },
      { x: window.innerWidth, y: window.innerHeight * 0.3 },
      { x: window.innerWidth, y: window.innerHeight * 0.6 },
      { x: window.innerWidth, y: window.innerHeight },
      { x: window.innerWidth * 0.75, y: window.innerHeight },
      { x: window.innerWidth * 0.5, y: window.innerHeight },
      { x: window.innerWidth * 0.25, y: window.innerHeight },
      { x: 0, y: window.innerHeight },
      { x: 0, y: window.innerHeight * 0.6 },
      { x: 0, y: window.innerHeight * 0.3 },
    ];

    const rings = 6;

    const render = (time: number) => {
      const elapsed = time - startTime;
      progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark translucent backdrop with slight halftone
      ctx.fillStyle = `rgba(7, 8, 11, ${0.85 * ease})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = startX + (targetCenterX - startX) * ease;
      const cy = startY + (targetCenterY - startY) * ease;

      // 1. Draw Radial Spokes
      ctx.lineWidth = 1.5;
      spokes.forEach((pt, i) => {
        const destX = cx + (pt.x - cx) * ease;
        const destY = cy + (pt.y - cy) * ease;

        ctx.strokeStyle = i % 2 === 0 ? 'rgba(240, 240, 245, 0.45)' : 'rgba(230, 36, 41, 0.35)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(destX, destY);
        ctx.stroke();
      });

      // 2. Draw Concentric Web Arcs
      for (let r = 1; r <= rings; r++) {
        const ringProgress = Math.max(0, Math.min(1, (ease * (rings + 1) - r)));
        if (ringProgress <= 0) continue;

        const radiusFactor = (r / rings);

        ctx.beginPath();
        ctx.lineWidth = r === rings ? 2 : 1;
        ctx.strokeStyle = r % 2 === 0 ? 'rgba(245, 245, 255, 0.4)' : `${accentColor}55`;

        spokes.forEach((pt, idx) => {
          const px = cx + (pt.x - cx) * radiusFactor * ringProgress;
          const py = cy + (pt.y - cy) * radiusFactor * ringProgress;

          if (idx === 0) {
            ctx.moveTo(px, py);
          } else {
            // Slight inward sag for realistic spiderweb tensile curve
            const prevPt = spokes[idx - 1];
            const prevPx = cx + (prevPt.x - cx) * radiusFactor * ringProgress;
            const prevPy = cy + (prevPt.y - cy) * radiusFactor * ringProgress;

            const midX = (prevPx + px) / 2;
            const midY = (prevPy + py) / 2;
            const sagFactor = 0.88;
            const ctrlX = cx + (midX - cx) * sagFactor;
            const ctrlY = cy + (midY - cy) * sagFactor;

            ctx.quadraticCurveTo(ctrlX, ctrlY, px, py);
          }
        });

        // Close the loop
        const firstPt = spokes[0];
        const lastPt = spokes[spokes.length - 1];
        const p1x = cx + (firstPt.x - cx) * radiusFactor * ringProgress;
        const p1y = cy + (firstPt.y - cy) * radiusFactor * ringProgress;
        const p2x = cx + (lastPt.x - cx) * radiusFactor * ringProgress;
        const p2y = cy + (lastPt.y - cy) * radiusFactor * ringProgress;
        const midX = (p2x + p1x) / 2;
        const midY = (p2y + p1y) / 2;
        ctx.quadraticCurveTo(cx + (midX - cx) * 0.88, cy + (midY - cy) * 0.88, p1x, p1y);
        ctx.stroke();
      }

      if (progress < 1) {
        animFrame = requestAnimationFrame(render);
      }
    };

    animFrame = requestAnimationFrame(render);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animFrame);
    };
  }, [originX, originY, onClose, accentColor]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Canvas for dynamic procedural spider web */}
      <canvas
        ref={canvasRef}
        onClick={() => {
          sound.playClick();
          onClose();
        }}
        className="absolute inset-0 w-full h-full cursor-pointer pointer-events-auto"
      />

      {/* Comic THWIP! burst tag in top right */}
      <div className="absolute top-6 right-8 md:top-10 md:right-16 pointer-events-none z-50 select-none animate-bounce">
        <div className="bg-spider text-white font-comic text-2xl md:text-3xl px-4 py-1.5 rotate-12 shadow-comic-black border-2 border-white tracking-widest uppercase">
          THWIP!
        </div>
      </div>

      {/* Modal Container slung in the web */}
      <div className="relative z-50 w-full max-w-3xl my-auto animate-web-burst pointer-events-auto">
        {children}
      </div>
    </div>
  );
};
