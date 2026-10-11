import type { LoadFailure } from '../../data/useResumeData';

const REASON: Record<LoadFailure['kind'], string> = {
  timeout: 'The signal timed out mid-swing.',
  network: "Couldn't reach the backend — it may be offline.",
  http: 'The backend responded with an error.',
  invalid: 'The backend sent back something unreadable.',
  aborted: 'The connection was interrupted.',
  unknown: 'Something unexpected happened.'
};

export function FailureState({
  failure, canEnterAnyway, onRetry, onEnterAnyway,
}: {
  failure: LoadFailure | null;
  canEnterAnyway: boolean;
  onRetry: () => void;
  onEnterAnyway: () => void;
}) {
  const detail = failure ? REASON[failure.kind] : REASON.unknown;
  return (
    <div className="ps-fail-panel" role="alert">
      <div className="ps-fail-title">THE WEB CONNECTION FAILED</div>
      <div className="ps-fail-desc">
        Something went wrong while loading the portfolio.
        <br />
        <span className="ps-fail-detail">
          {detail}
          {failure?.status ? ` (HTTP ${failure.status})` : ''}
        </span>
      </div>
      <div className="ps-fail-actions">
        <button className="ps-btn ps-btn-primary" type="button" onClick={onRetry}>
          Try Again
        </button>
        {canEnterAnyway && (
          <button className="ps-btn ps-btn-ghost" type="button" onClick={onEnterAnyway}>
            Enter Portfolio Anyway
          </button>
        )}
      </div>
    </div>
  );
}
