import React, { useEffect, useRef, useState } from 'react';

/**
 * Spider cursor.
 *
 * - A small spider follows the pointer and turns to face the direction it is
 *   moving. Its legs scurry while the mouse moves and settle when it stops.
 * - It NEVER changes when you move over buttons, links, cards, inputs, etc.
 *   (no hover ring, no crosshair, no colour swap). Only a tiny press-squash on
 *   click, so clicking still feels responsive.
 * - The native cursor stays hidden everywhere via the existing rule in
 *   index.css (`cursor: none !important` on fine pointers).
 * - Sits above the boot cinematic (z-index 10000/10001), so you always have a
 *   cursor, even during the intro.
 * - Position/rotation are written straight to the DOM in one rAF loop, so
 *   mouse movement never triggers a React re-render.
 */

const STYLES = `
@keyframes spider-leg-a { 0%,100% { transform: rotate(-9deg); } 50% { transform: rotate(9deg); } }
@keyframes spider-leg-b { 0%,100% { transform: rotate(9deg); } 50% { transform: rotate(-9deg); } }
.spider-cursor-legs .leg { transform-box: view-box; }
.spider-cursor-legs.moving .leg-a { animation: spider-leg-a 0.22s ease-in-out infinite; }
.spider-cursor-legs.moving .leg-b { animation: spider-leg-b 0.22s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .spider-cursor-legs.moving .leg-a,
  .spider-cursor-legs.moving .leg-b { animation: none; }
}
`;

// One side's four legs: [attach x, attach y, knee x, knee y, foot x, foot y]
// (viewBox 0 0 40 40, spider faces UP, body centred on 20,20). The other side
// is the mirror image (x -> 40 - x).
const LEGS: Array<[number, number, number, number, number, number]> = [
  [23, 16, 31, 8, 35, 4],
  [24, 19, 33, 15, 37, 12],
  [24, 22, 33, 26, 37, 30],
  [23, 25, 30, 32, 33, 37],
];

const mirror = (x: number) => 40 - x;

const SpiderSvg: React.FC<{ legsRef: React.RefObject<SVGGElement> }> = ({ legsRef }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.55))' }}
    aria-hidden="true"
  >
    <g ref={legsRef} className="spider-cursor-legs" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {LEGS.map(([ax, ay, kx, ky, fx, fy], i) => {
        const cls = i % 2 === 0 ? 'leg leg-a' : 'leg leg-b';
        const clsMirror = i % 2 === 0 ? 'leg leg-b' : 'leg leg-a';
        return (
          <React.Fragment key={i}>
            {/* right leg: dark outline + red inner stroke for a comic look */}
            <g className={cls} style={{ transformOrigin: `${ax}px ${ay}px` }}>
              <polyline points={`${ax},${ay} ${kx},${ky} ${fx},${fy}`} stroke="#0a0a10" strokeWidth="3.2" />
              <polyline points={`${ax},${ay} ${kx},${ky} ${fx},${fy}`} stroke="#e62429" strokeWidth="1.5" />
            </g>
            {/* left leg: mirrored, opposite phase so the gait alternates */}
            <g className={clsMirror} style={{ transformOrigin: `${mirror(ax)}px ${ay}px` }}>
              <polyline
                points={`${mirror(ax)},${ay} ${mirror(kx)},${ky} ${mirror(fx)},${fy}`}
                stroke="#0a0a10"
                strokeWidth="3.2"
              />
              <polyline
                points={`${mirror(ax)},${ay} ${mirror(kx)},${ky} ${mirror(fx)},${fy}`}
                stroke="#e62429"
                strokeWidth="1.5"
              />
            </g>
          </React.Fragment>
        );
      })}
    </g>

    {/* abdomen */}
    <ellipse cx="20" cy="25" rx="5.6" ry="7.2" fill="#0a0a10" stroke="#e62429" strokeWidth="1.2" />
    {/* red hourglass marking */}
    <path d="M17.2 21.6 L22.8 21.6 L20.9 25 L22.8 28.4 L17.2 28.4 L19.1 25 Z" fill="#e62429" />
    {/* head */}
    <circle cx="20" cy="15.5" r="4.4" fill="#0a0a10" stroke="#e62429" strokeWidth="1.2" />
    {/* eyes */}
    <ellipse cx="18.3" cy="14.4" rx="1.1" ry="1.5" fill="#fff" transform="rotate(-18 18.3 14.4)" />
    <ellipse cx="21.7" cy="14.4" rx="1.1" ry="1.5" fill="#fff" transform="rotate(18 21.7 14.4)" />
  </svg>
);

export const CustomCursor: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const legsRef = useRef<SVGGElement>(null);
  const rafRef = useRef<number | null>(null);

  const posRef = useRef({ x: -100, y: -100 });
  const lastPosRef = useRef({ x: -100, y: -100 });
  const angleRef = useRef(0); // degrees, 0 = facing up
  const speedRef = useRef(0);
  const lastMoveRef = useRef(0);
  const clickedRef = useRef(false);
  const lastWrapperCss = useRef('');
  const lastRotorCss = useRef('');

  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches
  );

  useEffect(() => {
    const fineQuery = window.matchMedia('(pointer: fine)');
    setIsTouch(!fineQuery.matches);
    const onPointerQueryChange = () => setIsTouch(!fineQuery.matches);
    fineQuery.addEventListener('change', onPointerQueryChange);

    const onTouchStart = () => {
      setIsTouch(true);
      setIsVisible(false);
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      lastMoveRef.current = performance.now();
      setIsVisible(true);
    };
    const onMouseDown = () => { clickedRef.current = true; };
    const onMouseUp = () => { clickedRef.current = false; };
    const onDocMouseOut = (e: MouseEvent) => { if (!e.relatedTarget) setIsVisible(false); };
    const onDocMouseOver = () => setIsVisible(true);
    const onBlur = () => { clickedRef.current = false; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseout', onDocMouseOut);
    document.addEventListener('mouseover', onDocMouseOver);
    window.addEventListener('blur', onBlur);

    const tick = () => {
      const pos = posRef.current;
      const last = lastPosRef.current;
      const dx = pos.x - last.x;
      const dy = pos.y - last.y;
      const dist = Math.hypot(dx, dy);
      lastPosRef.current = { x: pos.x, y: pos.y };

      // Smoothed speed (px/frame) drives the leg animation.
      speedRef.current = speedRef.current * 0.8 + dist * 0.2;

      // Only turn when actually travelling — avoids jitter from tiny moves
      // and keeps the spider facing its last direction when it stops.
      if (dist > 1.5) {
        const target = (Math.atan2(dx, -dy) * 180) / Math.PI;
        let diff = target - angleRef.current;
        diff = ((diff + 540) % 360) - 180; // shortest way round
        angleRef.current += diff * 0.22;
      }

      const wrapper = wrapperRef.current;
      if (!wrapper) lastWrapperCss.current = ''; // node is recreated when the cursor re-appears
      if (wrapper) {
        const css = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        if (css !== lastWrapperCss.current) { lastWrapperCss.current = css; wrapper.style.transform = css; }
      }

      const rotor = rotorRef.current;
      if (!rotor) lastRotorCss.current = '';
      if (rotor) {
        const scale = clickedRef.current ? 0.82 : 1;
        const css = `translate(-50%, -50%) rotate(${angleRef.current.toFixed(1)}deg) scale(${scale})`;
        if (css !== lastRotorCss.current) { lastRotorCss.current = css; rotor.style.transform = css; }
      }

      const legs = legsRef.current;
      if (legs) {
        const moving = speedRef.current > 0.35 && performance.now() - lastMoveRef.current < 140;
        legs.classList.toggle('moving', moving);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      fineQuery.removeEventListener('change', onPointerQueryChange);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseout', onDocMouseOut);
      document.removeEventListener('mouseover', onDocMouseOver);
      window.removeEventListener('blur', onBlur);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (isTouch || !isVisible) return null;

  return (
    // z-index is above the boot cinematic (10000) and its reveal overlay (10001)
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 10002 }}>
      <style>{STYLES}</style>
      <div ref={wrapperRef} className="fixed top-0 left-0 will-change-transform">
        <div
          ref={rotorRef}
          className="absolute top-0 left-0 will-change-transform"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <SpiderSvg legsRef={legsRef} />
        </div>
      </div>
    </div>
  );
};
