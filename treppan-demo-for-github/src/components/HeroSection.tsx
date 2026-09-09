import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChevronDown, Info } from 'lucide-react';
import { HERO_BOTTLES, PRODUCTS } from '../data/products';
import { FragranceProduct } from '../types/fragrance';

// Official WhatsApp Icon SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.44 0-2.84-.37-4.08-1.09l-.29-.17-3.04.8.81-2.96-.19-.3c-.78-1.26-1.2-2.73-1.2-4.51 0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
  </svg>
);

interface HeroSectionProps {
  onSelectProduct: (product: FragranceProduct) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectProduct }) => {
  const [activeBottleIndex, setActiveBottleIndex] = useState(1); // Default HERO gold bottle

  const activeBottle = HERO_BOTTLES[activeBottleIndex];
  const matchedProduct = PRODUCTS.find((p) => p.id === activeBottle.productId) || PRODUCTS[0];

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Treppan Fragrance, I would like to enquire about ${activeBottle.name}.`
    );
    window.open(`https://wa.me/96599995353?text=${text}`, '_blank');
  };

  return (
    <section
      id="maison-hero"
      className="relative min-h-[90vh] lg:min-h-screen bg-gradient-to-b from-[#0B1220] via-[#0E1830] to-[#0A0F1C] text-[#F7F4EE] overflow-hidden flex flex-col justify-between"
    >
      {/* 1. Deep Navy & Gold Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse at 72% 45%, rgba(223, 194, 125, 0.16) 0%, rgba(10, 15, 28, 0) 65%)'
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 10% 90%, rgba(37, 99, 235, 0.10) 0%, rgba(10, 15, 28, 0) 55%)'
          }}
        />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#DFC27D_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 my-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & High-Converting CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Royal Tag & Arabic Calligraphy */}
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFC27D] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#DFC27D] uppercase font-sans">
                Treppan • Kuwait • Est. 53
              </span>
              <span className="font-arabic text-lg sm:text-xl text-[#DFC27D]/70 tracking-wide">
                عِطْرٌ وُلِدَ مِنَ المَاءِ
              </span>
            </div>

            {/* Giant Editorial Headline */}
            <div className="space-y-2 overflow-visible">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-[#F7F4EE] leading-[1.04] uppercase">
                BORN FROM <br />
                WATER. <br />
                <span
                  className="font-medium italic inline-block pr-3 tracking-normal"
                  style={{
                    background: 'linear-gradient(135deg, #F5E1A4 0%, #DFC27D 40%, #C5A059 70%, #8A6A2C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  <span className="inline-block pr-2.5">MADE TO</span>{' '}
                  <span className="inline-block">LINGER.</span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-[#B7BAC6] text-base sm:text-lg md:text-xl font-light tracking-wide max-w-xl leading-relaxed">
              100% alcohol-free aqua parfums with a clean touch and an unmistakable trail.
            </p>

            {/* Catchy Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={scrollToCollection}
                className="px-8 py-4 bg-gradient-to-r from-[#DFC27D] to-[#C5A059] text-[#141416] hover:from-[#EBD59B] hover:to-[#D4AE6C] text-xs font-serif uppercase tracking-[0.22em] font-semibold transition-all duration-300 rounded-xs shadow-lg flex items-center justify-center space-x-3 group cursor-pointer"
              >
                <span>Discover Treppan</span>
                <ArrowRight className="w-4 h-4 ml-1 text-[#141416] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={openWhatsApp}
                className="px-6 py-4 bg-transparent text-[#F7F4EE] border border-[#DFC27D]/30 hover:border-[#25D366] hover:text-[#25D366] text-xs font-serif uppercase tracking-[0.2em] font-medium transition-colors text-center flex items-center justify-center space-x-2.5 cursor-pointer rounded-xs group"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span>WhatsApp Enquire</span>
              </button>
            </div>

            {/* Interactive Flacon Selector Tabs */}
            <div className="pt-5 border-t border-[#DFC27D]/20">
              <div className="flex flex-wrap items-center gap-2.5 max-w-md">
                {HERO_BOTTLES.map((bottle, idx) => {
                  const tabLabel =
                    idx === 0
                      ? 'TREPPAN BLACK'
                      : idx === 1
                      ? 'TREPPAN HERO'
                      : 'TREPPAN AQUA DE';
                  return (
                    <button
                      key={bottle.id}
                      onClick={() => setActiveBottleIndex(idx)}
                      className={`px-4 sm:px-5 py-2.5 rounded-xs font-serif text-xs uppercase tracking-[0.16em] transition-all border cursor-pointer ${
                        activeBottleIndex === idx
                          ? 'bg-white/10 border-[#DFC27D] text-[#DFC27D] font-bold shadow-sm'
                          : 'bg-white/[0.03] border-white/10 text-[#8E92A3] hover:text-[#F7F4EE] hover:border-white/25'
                      }`}
                    >
                      {tabLabel}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Clean Signature Flacons Presentation */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* Seamless Stage: Signature Trio on Dark Navy & Gold Nugget Backdrop */}
            <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/12] flex items-center justify-center group">

              {/* Photographic trio on its own navy/gold set, framed as a luxury plate */}
              <img
                src="/assets/treppan_trio_navy_gold.png"
                alt="Treppan Fragrance Signature Trio"
                className="relative z-10 w-full h-full object-cover rounded-md shadow-[0_25px_60px_rgba(0,0,0,0.45)] ring-1 ring-[#DFC27D]/20 transform group-hover:scale-[1.02] transition-transform duration-700 ease-out cursor-pointer"
                onClick={() => onSelectProduct(matchedProduct)}
              />

              {/* Floating Active Flacon Card Overlay (Zero Blur, Crisp Card) */}
              <div
                onClick={() => onSelectProduct(matchedProduct)}
                className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-20 bg-white/95 px-4 py-3 rounded-xs border border-[#C5A059]/40 shadow-lg flex items-center justify-between gap-3 cursor-pointer hover:border-[#87692A] transition-all animate-fadeIn"
              >
                <div className="flex items-center space-x-3 truncate">
                  <Sparkles className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#141416]">
                      {activeBottleIndex === 0
                        ? 'TREPPAN BLACK'
                        : activeBottleIndex === 1
                        ? 'TREPPAN HERO'
                        : 'TREPPAN AQUA DE'}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#737380] font-sans ml-2">
                      {activeBottle.accords.split(',')[0]}
                    </span>
                  </div>
                </div>

                <Info className="w-4 h-4 text-[#87692A] flex-shrink-0" />
              </div>

            </div>

            {/* Under-banner trust note */}
            <div className="mt-4 flex items-center space-x-2 text-[10px] sm:text-[11px] text-[#8E92A3] font-sans">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span>Ultrasonic Micro-Emulsion • Handcrafted in the State of Kuwait</span>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Sub-Nav Strip */}
      <div className="w-full border-t border-[#DFC27D]/15 bg-[#0A0F1C]/90 px-4 sm:px-8 py-3.5 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] tracking-[0.25em] uppercase font-sans text-[#8E92A3] font-medium">
          <a
            href="#editorial-scroll-stage"
            className="flex items-center space-x-1.5 hover:text-[#F7F4EE] transition-colors cursor-pointer"
          >
            <span>Explore Collection</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#DFC27D]" />
          </a>
          <span className="tracking-[0.3em] font-serif text-[#DFC27D] font-semibold">
            01 / WATER-BORN LUXURY • ALCOHOL-FREE
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
