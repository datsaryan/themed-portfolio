import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <>
      {/* CRT Scanline & Phosphor Raster Overlay */}
      <div className="crt-overlay" aria-hidden="true" />
      {/* Analog 1980s Film Grain Overlay */}
      <div className="film-grain" aria-hidden="true" />
    </>
  );
};
