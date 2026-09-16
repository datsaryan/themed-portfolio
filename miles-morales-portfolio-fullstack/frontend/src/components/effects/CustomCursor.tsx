import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);
  const lastHoveredRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches
  );

  useEffect(() => {
    const fineQuery = window.matchMedia('(pointer: fine)');
    setIsTouch(!fineQuery.matches);

    // Hybrid devices (touchscreen laptops) can report a fine pointer but
    // still get real touch input mid-session — a real tap there shouldn't
    // leave a phantom reticle stuck on screen.
    const onPointerQueryChange = () => setIsTouch(!fineQuery.matches);
    fineQuery.addEventListener('change', onPointerQueryChange);

    const onTouchStart = () => {
      setIsTouch(true);
      setIsVisible(false);
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    // Position updates never touch React state — they write straight onto
    // the DOM node via a ref + a dedicated rAF loop below. Driving position
    // through setState meant a full re-render on every single pixel of
    // mouse movement, competing with the page's other rAF-driven effects
    // (ScrollWebFall, the hanging Spider-Man's spring physics) for the same
    // frame — that fight was the source of the stutter/lag people were
    // seeing. Hover/click state changes far less often, so those stay as
    // React state (only updated when they actually flip, not every move).
    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const hovered = !!target?.closest(
        'a, button, [role="button"], input, textarea, .comic-border, .interactive-target'
      );
      if (hovered !== lastHoveredRef.current) {
        lastHoveredRef.current = hovered;
        setIsHovered(hovered);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    // `mouseleave`/`mouseenter` on `document` were the other bug: those
    // events don't bubble, and several browsers never dispatch them on
    // `document` at all — that's what let the reticle get stuck hidden
    // after the pointer left the window, or stuck invisible after it came
    // back. `mouseout`/`mouseover` DO bubble; checking `relatedTarget` is
    // the standard cross-browser way to tell "pointer left/entered the
    // page" apart from "pointer crossed an element boundary inside it".
    const onDocMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setIsVisible(false);
    };
    const onDocMouseOver = () => setIsVisible(true);

    // If the mouse button is released outside the window (dragging out to
    // another app, or a native file/print dialog stealing focus), `mouseup`
    // never fires and the reticle gets stuck in its "clicked" pose — reset
    // on blur as a safety net.
    const onBlur = () => setIsClicked(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseout', onDocMouseOut);
    document.addEventListener('mouseover', onDocMouseOver);
    window.addEventListener('blur', onBlur);

    const tick = () => {
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
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
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/*
        POSITION WRAPPER — the only element that sets a translate3d for
        cursor position, updated imperatively by the rAF loop above rather
        than through React state/props, and it never has a CSS transition on
        `transform`. Everything below anchors off this with plain 0,0 + its
        own transform, so position tracking never lags or fights with any
        child's own transform (rotation, centering, scale).
      */}
      <div ref={wrapperRef} className="fixed top-0 left-0 will-change-transform">
        {/* Center Reticle Point — centering + click-scale live in ONE
            inline transform so nothing silently overwrites the other. */}
        <div
          className={`rounded-full transition-[width,height,background-color,border-color,box-shadow] duration-150 ease-out ${
            isHovered
              ? 'w-10 h-10 border-2 border-spider bg-spider/20 shadow-spider-glow'
              : isClicked
              ? 'w-4 h-4 bg-venom-purple'
              : 'w-3 h-3 bg-spider'
          }`}
          style={{
            transform: `translate(-50%, -50%) scale(${isClicked ? 0.8 : 1})`,
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

        {/* Spider HUD Target Ring — centered by its OWN transform (a
            sibling of the spin animation, not the same element), so
            animate-spin's rotate keyframes never collide with a position
            or centering transform. */}
        {isHovered && (
          <div
            className="absolute top-0 left-0 w-16 h-16"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="w-full h-full border border-dashed border-venom-purple/70 rounded-full animate-spin"
              style={{ animationDuration: '6s' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
