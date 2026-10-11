import { useEffect, useState } from 'react';

const LINES = ['CONNECTING TO THE SPIDER-NET…', 'WEB-SLINGING…', 'TRACKING FREEFALL TRAJECTORY…'];

/** Cross-fading caption + small HUD line. Purely presentational; the parent decides whether it's mounted. */
export function LoadingState({ compact = false }: { compact?: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % LINES.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={`ps-caption-wrap ${compact ? 'ps-caption-compact' : ''}`}>
      <div className="ps-caption" key={i}>{LINES[i]}</div>
      <div className="ps-hud">// aryan singh — full stack engineer</div>
    </div>
  );
}
