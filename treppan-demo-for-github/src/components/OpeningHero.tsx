import React from 'react';
import { SeamlessVideoBackground } from './SeamlessVideoBackground';

export const OpeningHero: React.FC = () => {
  return (
    <section
      id="top-opening-hero"
      aria-label="Treppan Botanical Opening"
      className="relative w-full h-screen min-h-screen overflow-hidden pointer-events-none select-none"
    >
      {/* Seamless Looping Botanical Flower Video Background - 100% Sharp, Clean & Uncluttered */}
      <SeamlessVideoBackground
        src="/assets/treppan_fragrance_botanical.mp4"
        variant="none"
      />
    </section>
  );
};

export default OpeningHero;
