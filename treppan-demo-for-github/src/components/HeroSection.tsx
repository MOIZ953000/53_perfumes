import React, { useState } from 'react';
import { ArrowRight, MessageSquare, Sparkles, ChevronDown, Info } from 'lucide-react';
import { HERO_BOTTLES, PRODUCTS } from '../data/products';
import { FragranceProduct } from '../types/fragrance';

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
      className="relative min-h-[90vh] lg:min-h-screen theme-bg-primary overflow-hidden flex flex-col justify-between"
    >
      {/* 1. High-Res Luxury Silk & Golden Ribbon Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/treppan_silk_bg.jpg"
          alt="Treppan Royal White Silk and Gold Ribbon Backdrop"
          className="w-full h-full object-cover object-right lg:object-center select-none opacity-95"
        />

        {/* Soft Vignette & Editorial Readability Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/70 to-[#FAF9F6]/20" />

        {/* Top and bottom subtle bleed fades */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--bg-primary)] to-transparent" />
      </div>

      {/* 2. Ambient Lighting & Caustics Accent */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-[#DFC27D]/25 rounded-full blur-[150px] opacity-70" />
        <div className="absolute top-1/2 -left-32 w-[600px] h-[600px] bg-[#6A0D18]/10 rounded-full blur-[160px] opacity-60" />
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(var(--text-primary)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 my-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & High-Converting CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Royal Tag & Arabic Calligraphy — one quiet eyebrow line
                instead of a bordered pill stacked above a second line */}
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#87692A] uppercase font-sans">
                Treppan • Kuwait • Est. 53
              </span>
              <span className="font-arabic text-lg sm:text-xl text-[#87692A]/70 tracking-wide">
                عِطْرٌ وُلِدَ مِنَ المَاءِ
              </span>
            </div>

            {/* Giant Editorial Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight theme-text-primary leading-[1.04]">
                Clean scent, <br />
                <span className="text-gold-gradient font-medium italic">unforgettable trail.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="theme-text-secondary text-base sm:text-lg md:text-xl font-light tracking-wide max-w-xl leading-relaxed">
              100% alcohol-free aqua parfums with a clean touch and an unmistakable trail.
            </p>

            {/* Catchy Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={scrollToCollection}
                className="px-8 py-4 bg-[#141416] text-[#FAF9F6] hover:bg-[#87692A] text-xs font-serif uppercase tracking-[0.22em] font-semibold transition-all duration-300 rounded-xs shadow-lg flex items-center justify-center space-x-3 group"
              >
                <span>Discover Treppan</span>
                <ArrowRight className="w-4 h-4 ml-1 text-[#DFC27D] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={openWhatsApp}
                className="px-2 py-4 bg-transparent theme-text-secondary hover:text-[#87692A] text-xs font-serif uppercase tracking-[0.2em] font-medium transition-colors text-center flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>WhatsApp Enquire</span>
              </button>
            </div>

            {/* Interactive Flacon Selector Chips — name only; full notes
                already live in the floating card on the visual side */}
            <div className="pt-5 border-t theme-border">
              <div className="flex items-center gap-2.5 max-w-md">
                {HERO_BOTTLES.map((bottle, idx) => (
                  <button
                    key={bottle.id}
                    onClick={() => setActiveBottleIndex(idx)}
                    className={`px-4 py-2.5 rounded-xs font-serif text-xs transition-all border ${
                      activeBottleIndex === idx
                        ? 'theme-bg-card border-[#C5A059] text-[#87692A] font-semibold shadow-gold-glow'
                        : 'border-transparent theme-text-muted hover:theme-text-primary'
                    }`}
                  >
                    {bottle.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Clean Catchy Banner Visual Stage (Seamless, No Nested Box!) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* Seamless Stage with the 3 Treppan Bottles on Travertine & Caustics */}
            <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/12] flex items-center justify-center group">
              
              {/* Subtle Backglow Halo */}
              <div className="absolute inset-0 bg-radial from-[#DFC27D]/30 via-transparent to-transparent rounded-full blur-[70px] pointer-events-none scale-95 group-hover:scale-105 transition-transform duration-700" />

              {/* Clean, transparent bottle cutout — no baked-in backdrop,
                  so it sits directly on the section's own background
                  instead of visibly blending two different textures. */}
              <img
                src="/assets/treppan_bottles_trio_clean.png"
                alt="Treppan Fragrance Signature Trio"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.20)] transform group-hover:scale-[1.03] transition-transform duration-700 ease-out cursor-pointer"
                onClick={() => onSelectProduct(matchedProduct)}
              />

              {/* Floating Active Flacon Card Overlay — one note, no
                  redundant badge, so it can't overflow/truncate mid-word */}
              <div
                onClick={() => onSelectProduct(matchedProduct)}
                className="absolute bottom-2 inset-x-2 sm:inset-x-6 z-20 theme-bg-card/95 backdrop-blur-md px-4 py-3 rounded-xs border theme-border-gold shadow-xl flex items-center justify-between gap-3 cursor-pointer hover:border-[#87692A] transition-all animate-fadeIn"
              >
                <div className="flex items-center space-x-3 truncate">
                  <Sparkles className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-serif font-bold text-xs sm:text-sm theme-text-primary">
                      {activeBottle.name}
                    </span>
                    <span className="text-[10px] sm:text-xs theme-text-muted font-sans ml-2">
                      {activeBottle.accords.split(',')[0]}
                    </span>
                  </div>
                </div>

                <Info className="w-4 h-4 text-[#87692A] flex-shrink-0" />
              </div>

            </div>

            {/* Under-banner trust note */}
            <div className="mt-4 flex items-center space-x-2 text-[10px] sm:text-[11px] theme-text-muted font-sans">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span>Ultrasonic Micro-Emulsion • Handcrafted in the State of Kuwait</span>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Sub-Nav Strip */}
      <div className="w-full border-t theme-border theme-bg-primary/90 px-4 sm:px-8 py-3.5 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] tracking-[0.25em] uppercase font-sans theme-text-muted font-medium">
          <a
            href="#collection"
            className="flex items-center space-x-1.5 hover:theme-text-primary transition-colors"
          >
            <span>Explore Collection</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
          <span className="tracking-[0.3em] font-serif text-[#87692A] font-semibold">
            01 / WATER-BORN LUXURY • ALCOHOL-FREE
          </span>
        </div>
      </div>
    </section>
  );
};
