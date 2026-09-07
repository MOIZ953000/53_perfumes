import React from 'react';
import { Plane, ShieldCheck, Sparkles, Clock, Check, Gem } from 'lucide-react';

export const JazeeraHeritage: React.FC = () => {
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

  return (
    <section id="jazeera" className="py-20 sm:py-28 theme-bg-primary border-t theme-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story & Aviation Engineering */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Aviation Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#6A0D18] text-[#FAF9F6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFC27D]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold font-serif">
                Official Jazeera Airways In-Flight Feature
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold theme-text-primary tracking-tight leading-tight">
              Crafted for <span className="italic font-normal text-[#87692A]">30,000 Feet</span> <br />
              and Beyond
            </h2>

            {/* Story copy */}
            <p className="theme-text-secondary text-base sm:text-lg leading-relaxed font-light">
              Selected as the premier Kuwaiti fragrance house aboard <strong className="theme-text-primary font-semibold">Jazeera Airways</strong>. High-altitude flight dries the skin—traditional alcohol perfumes evaporate aggressively and irritate cabin air.
            </p>

            {/* 3 Pillars of Aviation Performance */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start space-x-3.5 p-4 rounded-xs theme-bg-card border theme-border shadow-2xs">
                <div className="w-6 h-6 rounded-full theme-bg-secondary flex items-center justify-center text-[#87692A] flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold theme-text-primary uppercase tracking-wider">
                    Pressurized Cabin Longevity
                  </h4>
                  <p className="text-xs theme-text-secondary font-sans mt-0.5 leading-relaxed">
                    Water-lipid nano-clusters fuse directly with the skin mantle for continuous sillage from departure in Kuwait to touchdown in London.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-xs theme-bg-card border theme-border shadow-2xs">
                <div className="w-6 h-6 rounded-full theme-bg-secondary flex items-center justify-center text-[#87692A] flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold theme-text-primary uppercase tracking-wider">
                    0.0% Alcohol Clean Air Formulation
                  </h4>
                  <p className="text-xs theme-text-secondary font-sans mt-0.5 leading-relaxed">
                    Zero synthetic ethanol or harsh denaturants, safeguarding pristine cabin air quality for sensitive passengers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-xs theme-bg-card border theme-border shadow-2xs">
                <div className="w-6 h-6 rounded-full theme-bg-secondary flex items-center justify-center text-[#87692A] flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold theme-text-primary uppercase tracking-wider">
                    Exclusive In-Flight Allocations
                  </h4>
                  <p className="text-xs theme-text-secondary font-sans mt-0.5 leading-relaxed">
                    Dedicated flacon allocations of Treppan 53 Royal Oud Noir available aboard select Jazeera flagship aircraft.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Magazine Spread Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg rounded-md overflow-hidden border theme-border-gold shadow-pedestal theme-bg-card group">
              
              {/* Magazine Header Bar */}
              <div className="bg-[#141416] text-[#FAF9F6] flex items-center justify-between px-5 py-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#6A0D18]" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-serif font-bold text-[#DFC27D]">
                    JAZEERA AIRWAYS • J-LUXE
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400">
                  ISSUE 53 • FEATURE
                </span>
              </div>

              {/* Spread Visual */}
              <div className="relative aspect-[16/11] theme-bg-secondary overflow-hidden p-6 flex items-center justify-center">
                <img
                  src="/assets/treppan_musk_box.jpg"
                  alt="Treppan Fragrance Jazeera Airways Editorial Spread"
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Editorial Quote Overlay */}
                <div className="absolute bottom-4 left-4 right-4 theme-bg-card/95 backdrop-blur-md p-4 rounded-xs border theme-border shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center space-x-1.5 text-[#87692A]">
                      <Gem className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="text-[9px] font-serif uppercase tracking-[0.2em] font-bold">
                        Royal In-Flight Selection
                      </span>
                    </div>
                    <span className="text-[8px] font-serif uppercase tracking-widest px-2 py-0.5 rounded-xs bg-[#6A0D18] text-white font-bold">
                      Aviation Certified
                    </span>
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold theme-text-primary">
                    "The Kuwaiti Perfumery Conquering Sky-High Horizons"
                  </h4>
                </div>
              </div>

              {/* Spread Footer Strip */}
              <div className="px-5 py-3 theme-bg-secondary border-t theme-border flex flex-wrap items-center justify-between text-xs theme-text-secondary font-medium gap-2">
                <span className="flex items-center space-x-1.5 text-[11px]">
                  <Plane className="w-3.5 h-3.5 text-[#87692A]" />
                  <span>Kuwait • Dubai • Riyadh • London • Istanbul</span>
                </span>
                <span className="font-serif tracking-widest text-[#87692A] text-[10px] uppercase font-bold">
                  Fleet Exclusive
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Aviation Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-12 border-t theme-border">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="p-5 rounded-xs theme-bg-card border theme-border text-center space-y-1.5 shadow-2xs">
                <Icon className="w-5 h-5 text-[#C5A059] mx-auto" />
                <div className="font-serif text-2xl sm:text-3xl font-bold theme-text-primary">
                  {m.value}
                </div>
                <div className="font-serif text-xs font-bold text-[#87692A] uppercase tracking-wider">
                  {m.label}
                </div>
                <p className="text-[10px] theme-text-muted font-sans">
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
