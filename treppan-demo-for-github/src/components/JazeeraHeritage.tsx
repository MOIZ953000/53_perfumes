import React from 'react';
import { Plane, ShieldCheck, Sparkles, Clock } from 'lucide-react';

interface JazeeraHeritageProps {
  onSelectProduct?: (productId: string) => void;
}

export const JazeeraHeritage: React.FC<JazeeraHeritageProps> = ({ onSelectProduct }) => {
  const metrics = [
    {
      value: '35+',
      label: 'International Routes',
      sub: 'Exclusive in-flight service across GCC & Europe',
      icon: Plane
    },
    {
      value: '0.0%',
      label: 'Alcohol Clean Air Formula',
      sub: 'Certified non-drying pressurized cabin safe',
      icon: ShieldCheck
    },
    {
      value: '100%',
      label: 'Rare Artisanal Distillate',
      sub: 'Aged Assam & Kalakassi wild agarwood',
      icon: Sparkles
    },
    {
      value: '24h+',
      label: 'Skin Lipid Retention',
      sub: 'Direct dermal binding without evaporation',
      icon: Clock
    }
  ];

  const handleProductClick = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectProduct) {
      onSelectProduct(productId);
    } else {
      window.location.hash = `product/${productId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="jazeera" className="py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#EAE5DE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Focused High-Impact Editorial Statement (Zero Clutter) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Top Badge: Rich Deep Crimson/Burgundy Capsule */}
            <div className="inline-block bg-[#5A121A] text-[#FDFBF7] border border-[#8A2532] px-4 py-1 rounded-full text-[11px] tracking-[0.2em] font-medium uppercase shadow-xs">
              • OFFICIAL JAZEERA AIRWAYS IN-FLIGHT FEATURE •
            </div>

            {/* Main Headline: Editorial Serif Typography */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-neutral-900 tracking-tight leading-tight">
              JAZEERA AIRWAYS
              <br />
              SKY-HIGH EXCLUSIVES.
            </h2>

            {/* Balanced Editorial Sub-headline */}
            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed font-light max-w-md">
              Handcrafted exclusively for Jazeera Airways flagship passengers. Pure oil extractions formulated to linger beautifully in pressurized cabin environments.
            </p>

            {/* Minimalist Highlight Lines (Clean Inline Bullets) */}
            <div className="space-y-2.5 pt-2 text-neutral-700 text-sm font-sans">
              <div className="flex items-center space-x-2.5">
                <span className="text-[#87692A] text-xs">✦</span>
                <span>Pure concentrated oil extractions with 24-hour persistence</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="text-[#87692A] text-xs">✦</span>
                <span>Zero evaporation in high-altitude aircraft air</span>
              </div>
            </div>

          </div>

          {/* Right Column: Asymmetric 3-Product Editorial Showcase */}
          <div className="lg:col-span-7 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 w-full items-stretch">
              
              {/* Left / Tall Slot: silky musk.png (tall portrait aspect ratio ~9:16) */}
              <div className="sm:col-span-7 flex flex-col">
                <a
                  href="/product/silky-musk"
                  onClick={(e) => handleProductClick('silky-musk', e)}
                  className="group relative block w-full flex-1 aspect-[9/14] sm:aspect-auto min-h-[440px] sm:min-h-[540px] md:min-h-[580px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 bg-[#EDE8E0] border border-[#EAE5DE] cursor-pointer"
                  aria-label="Silky Musk - Click for details"
                >
                  <img
                    src="/assets/silky musk.png"
                    alt="Silky Musk"
                    className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Floating Glassmorphic Hover Pill */}
                  <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none px-3 z-10">
                    <span className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] tracking-[0.2em] font-medium uppercase px-4 py-2 rounded-full shadow-lg border border-neutral-200/60 inline-flex items-center gap-2 whitespace-nowrap select-none">
                      CLICK FOR DETAILS →
                    </span>
                  </div>
                </a>
              </div>

              {/* Right / Stacked Slots: 2 square/rectangular boxes stacked vertically */}
              <div className="sm:col-span-5 grid grid-cols-1 sm:grid-rows-2 gap-4 sm:gap-5">
                
                {/* Top Slot: oud maliki.png */}
                <a
                  href="/product/oud-maliki"
                  onClick={(e) => handleProductClick('oud-maliki', e)}
                  className="group relative block w-full aspect-square sm:aspect-auto min-h-[210px] sm:min-h-[258px] md:min-h-[278px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 bg-[#EDE8E0] border border-[#EAE5DE] cursor-pointer"
                  aria-label="Oud Maliki - Click for details"
                >
                  <img
                    src="/assets/oud maliki.png"
                    alt="Oud Maliki"
                    className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Floating Glassmorphic Hover Pill */}
                  <div className="absolute inset-x-0 bottom-5 flex justify-center pointer-events-none px-3 z-10">
                    <span className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] tracking-[0.2em] font-medium uppercase px-4 py-2 rounded-full shadow-lg border border-neutral-200/60 inline-flex items-center gap-2 whitespace-nowrap select-none">
                      CLICK FOR DETAILS →
                    </span>
                  </div>
                </a>

                {/* Bottom Slot: oud jabar.png */}
                <a
                  href="/product/oud-jabar"
                  onClick={(e) => handleProductClick('oud-jabar', e)}
                  className="group relative block w-full aspect-square sm:aspect-auto min-h-[210px] sm:min-h-[258px] md:min-h-[278px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 bg-[#EDE8E0] border border-[#EAE5DE] cursor-pointer"
                  aria-label="Oud Jabar - Click for details"
                >
                  <img
                    src="/assets/oud jabar.png"
                    alt="Oud Jabar"
                    className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Floating Glassmorphic Hover Pill */}
                  <div className="absolute inset-x-0 bottom-5 flex justify-center pointer-events-none px-3 z-10">
                    <span className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] tracking-[0.2em] font-medium uppercase px-4 py-2 rounded-full shadow-lg border border-neutral-200/60 inline-flex items-center gap-2 whitespace-nowrap select-none">
                      CLICK FOR DETAILS →
                    </span>
                  </div>
                </a>

              </div>

            </div>
          </div>

        </div>

        {/* Aviation Metrics Strip: Cream & Obsidian Luxury Contrast */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-20 pt-12 border-t border-[#EAE5DE]">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-xl bg-white/80 backdrop-blur-xs border border-[#EAE5DE] text-center space-y-2 shadow-xs hover:shadow-md transition-shadow"
              >
                <Icon className="w-5 h-5 text-[#87692A] mx-auto" />
                <div className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                  {m.value}
                </div>
                <div className="font-serif text-xs font-bold text-[#87692A] uppercase tracking-wider">
                  {m.label}
                </div>
                <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                  {m.sub}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default JazeeraHeritage;
