import { useEffect, useRef } from 'react';
import { worldEngine, WorldMode } from '../theme/themeEngine';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export function SporesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let isUpside = worldEngine.isUpsideDown();
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lightningCounter = 0;
    let lightningFlash = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    function initParticles() {
      if (!canvas) return;
      const count = isUpside ? 180 : 55;
      particles = [];
      const upsideColors = ['#ff2a2a', '#ff5500', '#ff0033', '#ffa500', '#880000'];
      const hawkinsColors = ['#a090c0', '#c8b8e8', '#e2d8f0', '#7b68ee'];

      for (let i = 0; i < count; i++) {
        const colors = isUpside ? upsideColors : hawkinsColors;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isUpside ? 1.4 : 0.6),
          vy: isUpside ? -(Math.random() * 1.5 + 0.4) : (Math.random() - 0.5) * 0.4,
          radius: Math.random() * (isUpside ? 2.8 : 1.6) + 0.6,
          alpha: Math.random() * 0.7 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }
    initParticles();

    const unsubscribe = worldEngine.subscribe((mode: WorldMode) => {
      isUpside = mode === 'upsidedown';
      initParticles();
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random lightning flash in Upside Down mode
      if (isUpside) {
        lightningCounter++;
        if (lightningCounter > 260 && Math.random() < 0.03) {
          lightningFlash = 0.25;
          lightningCounter = 0;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(255, 30, 0, ${lightningFlash})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          lightningFlash -= 0.02;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slight mouse swirl interaction
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += (dx / dist) * 1.5;
          p.y += (dy / dist) * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isUpside) {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      unsubscribe();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />
      <div className="flashlight-spotlight" />
    </>
  );
}
