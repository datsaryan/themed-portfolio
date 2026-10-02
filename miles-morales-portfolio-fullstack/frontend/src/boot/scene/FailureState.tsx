import { useEffect, useRef } from 'react';

interface Props {
  onRetry: () => void;
  onEnter: () => void;
}

// The portfolio ships with complete static content, so entering without the
// backend is a genuinely working option, not a dead end.
export function FailureState({ onRetry, onEnter }: Props) {
  const retryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    retryRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="boot-fail" role="alert" aria-labelledby="boot-fail-title" aria-describedby="boot-fail-desc">
      <div className="boot-fail-kicker">// the spider-net is down</div>
      <h2 className="boot-fail-title" id="boot-fail-title">The web connection failed.</h2>
      <p className="boot-fail-desc" id="boot-fail-desc">Something went wrong while loading the portfolio.</p>
      <div className="boot-fail-actions">
        <button ref={retryRef} type="button" className="boot-btn" onClick={onRetry}>[ Try again ]</button>
        <button type="button" className="boot-btn boot-btn-ghost" onClick={onEnter}>[ Enter portfolio anyway ]</button>
      </div>
    </div>
  );
}
