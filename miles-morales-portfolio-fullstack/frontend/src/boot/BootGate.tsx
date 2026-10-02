import { Component, lazy, startTransition, Suspense, useCallback, useState } from 'react';
import type { ReactNode } from 'react';

// The cinematic ships as its own lazy chunk (components, SVG art, CSS), so it
// never competes with the main bundle. The pre-React splash in index.html
// covers the gap while it downloads.
const CinematicLoader = lazy(() => import('./CinematicLoader'));

interface BoundaryProps { onFail: () => void; children: ReactNode; }

/** If the chunk fails to load or the cinematic throws, the site must still open. */
class LoaderBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) {
    console.warn('[boot] cinematic unavailable, opening the portfolio directly', err);
    this.props.onFail();
  }
  render() { return this.state.failed ? null : this.props.children; }
}

export function BootGate({ children }: { children: ReactNode }) {
  const [appMounted, setAppMounted] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const mountApp = useCallback(() => startTransition(() => setAppMounted(true)), []);
  const finish = useCallback(() => setLoaderDone(true), []);
  const bail = useCallback(() => { setAppMounted(true); setLoaderDone(true); }, []);

  return (
    <>
      {appMounted && children}
      {!loaderDone && (
        <LoaderBoundary onFail={bail}>
          <Suspense fallback={null}>
            <CinematicLoader onAppNeeded={mountApp} onDone={finish} appMounted={appMounted} />
          </Suspense>
        </LoaderBoundary>
      )}
    </>
  );
}
