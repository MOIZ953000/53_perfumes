import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { FragranceProduct } from '../types/fragrance';

interface HeroSectionProps {
  onSelectProduct?: (product: FragranceProduct) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectProduct }) => {
  return (
    <section
      id="maison-hero"
      className="relative bg-[#FAF8F5] overflow-hidden flex flex-col justify-between transition-colors duration-300"
    >
      <div className="items-center min-h-[70vh] py-16 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
        {/* Left Column: Heading Only */}
        <div className="space-y-6 sm:space-y-8 text-left">
          {/* Top Tag */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] flex-shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#87692A] uppercase font-sans">
              Treppan • Kuwait • Est. 53
            </span>
            <span className="text-[#87692A]/40">•</span>
            <span className="font-arabic text-base sm:text-lg text-[#87692A] tracking-wide">
              عِطْرٌ وُلِدَ مِنَ المَاءِ
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2 overflow-visible">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-[#0E1E38] leading-[1.04] uppercase">
              BORN FROM <br />
              WATER. <br />
              <span
                className="font-medium italic inline-block tracking-normal pr-2 text-[#B8860B]"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #C5A059 40%, #B8860B 80%, #8A6A2C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                <span className="inline-block pr-2">MADE TO</span>{' '}
                <span className="inline-block">LINGER.</span>
              </span>
            </h1>
          </div>
        </div>

        {/* Right Column: Expanded High-Resolution Showcase Image Only */}
        <div className="flex items-center justify-center w-full">
          <div className="w-full max-w-2xl lg:max-w-3xl h-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(14,30,56,0.12)] border border-[#EAE6DE] group">
            <img
              src="/assets/treppan_trio_navy_gold.png"
              alt="Treppan Fragrance Signature Trio"
              className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out cursor-pointer"
              onClick={() => {
                const heroProduct = PRODUCTS.find((p) => p.id === 'treppan-hero') || PRODUCTS[0];
                onSelectProduct?.(heroProduct);
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Sub-Nav Strip */}
      <div className="w-full border-t border-[#EAE6DE] bg-[#FAF8F5] px-4 sm:px-8 py-3.5 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] tracking-[0.25em] uppercase font-sans text-[#141416] font-medium">
          <a
            href="#editorial-scroll-stage"
            className="flex items-center space-x-1.5 text-[#141416] hover:text-[#87692A] transition-colors cursor-pointer"
          >
            <span className="font-semibold">Explore Collection</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#87692A]" />
          </a>
          <span className="tracking-[0.3em] font-serif text-[#141416] font-semibold">
            WATER-BORN LUXURY • ALCOHOL-FREE
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
