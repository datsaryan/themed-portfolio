import type { Caption } from '../choreography';

const COPY: Record<Caption, { line: string; sub: string } | null> = {
  connect: { line: 'Connecting to the Spider-Net…', sub: '// earth-1610 · loading portfolio' },
  rescue: { line: 'Web-slinging…', sub: '// closing the distance' },
  catch: { line: 'Got her.', sub: '// connection established' },
  miss: null, // the impact speaks for itself; the failure card follows
};

/** Comic narration box. `key` re-triggers its pop-in whenever the line changes. */
export function LoadingState({ caption }: { caption: Caption }) {
  const c = COPY[caption];
  if (!c) return null;
  return (
    <div className="boot-hud" key={caption}>
      <div className="boot-caption">{c.line}</div>
      <div className="boot-sub">{c.sub}</div>
    </div>
  );
}
