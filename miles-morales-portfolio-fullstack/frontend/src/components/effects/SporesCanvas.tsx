import React, { useEffect, useRef } from 'react';
import { WorldMode } from '../../types/portfolio';

interface SporesCanvasProps {
  world: WorldMode;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  baseAlpha: number;
}

export const SporesCanvas: React.FC<SporesCanvasProps> = ({ world }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = world === 'upsidedown' ? 70 : 30;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * (world === 'upsidedown' ? 2.5 : 1.5) + 0.5,
        vx: (Math.random() - 0.5) * (world === 'upsidedown' ? 0.6 : 0.2),
        vy: world === 'upsidedown' ? -(Math.random() * 0.7 + 0.2) : (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        decay: Math.random() * 0.005 + 0.002,
        baseAlpha: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const color =
        world === 'upsidedown'
          ? 'rgba(198, 42, 60, '
          : 'rgba(238, 232, 220, ';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Upside down float upwards
        if (world === 'upsidedown') {
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        } else {
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [world]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};
