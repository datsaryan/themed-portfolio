import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
      <AlertTriangle className="w-12 h-12 text-spider" />
      <h1 className="font-display text-5xl sm:text-6xl text-headline uppercase tracking-tight">
        404 // SIGNAL LOST
      </h1>
      <p className="font-mono text-sm text-subtext max-w-md">
        This node doesn&apos;t exist on Earth-1610&apos;s network. Sling back to base.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-spider hover:bg-spider-bright text-white font-mono text-xs uppercase font-bold tracking-widest transition-colors shadow-comic-black"
      >
        RETURN HOME
      </Link>
    </div>
  );
};

export default NotFoundPage;
