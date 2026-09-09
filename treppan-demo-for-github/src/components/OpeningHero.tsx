import React from 'react';

export const OpeningHero: React.FC = () => {
  return (
    <section
      id="top-opening-hero"
      aria-label="Treppan Botanical Opening"
      className="relative w-full h-screen min-h-screen overflow-hidden pointer-events-none select-none"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transform scale-[1.02]"
      >
        <source src="/assets/treppan_fragrance_botanical.mp4" type="video/mp4" />
      </video>
    </section>
  );
};

export default OpeningHero;
