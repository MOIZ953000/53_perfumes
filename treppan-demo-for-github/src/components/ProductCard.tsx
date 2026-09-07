import React from 'react';
import { FragranceProduct } from '../types/fragrance';
import { Sparkles, MessageSquare, Compass } from 'lucide-react';

interface ProductCardProps {
  product: FragranceProduct;
  onSelect: (product: FragranceProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const handleEnquire = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hello Treppan Fragrance, I would like to enquire about ${product.name} (${product.volume}).`
    );
    window.open(`https://wa.me/96599995353?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative theme-bg-card rounded-md border theme-border hover:border-[#C5A059] shadow-sm hover:shadow-pedestal transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden theme-bg-secondary p-6 flex items-center justify-center">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          <span className="text-[9px] font-serif uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-xs bg-[#6A0D18] text-[#FAF9F6]">
            {product.badge}
          </span>
          {product.category === 'aqua-parfum' && (
            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-xs theme-bg-card/90 theme-text-primary border theme-border">
              0.0% Alcohol
            </span>
          )}
        </div>

        {/* In-Flight Exclusive Indicator */}
        {product.isHero && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center space-x-1 text-[8px] uppercase tracking-widest font-serif font-bold px-2 py-0.5 rounded-xs theme-bg-secondary text-[#87692A] border theme-border-gold">
              <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
              <span>Jazeera</span>
            </span>
          </div>
        )}

        {/* Product Photograph */}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-[85%] max-w-[85%] object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Hover Quick Action Drawer */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 py-2.5 bg-[#141416] hover:bg-[#87692A] text-white text-[11px] font-serif uppercase tracking-[0.18em] font-semibold rounded-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#DFC27D]" />
            <span>Discover Notes</span>
          </button>
        </div>
      </div>

      {/* Product Content & Typography */}
      <div className="p-5 flex flex-col flex-1 justify-between theme-bg-card border-t theme-border">
        <div>
          {/* Subtitle & Arabic Name */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#87692A]">
              {product.subCategory}
            </span>
            <span className="font-arabic text-xs theme-text-muted font-normal">
              {product.arabicName}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold theme-text-primary group-hover:text-[#87692A] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Key Olfactory Accords Preview */}
          <p className="text-xs theme-text-secondary font-sans mt-2 line-clamp-2 leading-relaxed">
            {product.topNotes.split(',')[0]} • {product.heartNotes.split(',')[0]} • {product.baseNotes.split(',')[0]}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.accordTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] px-2 py-0.5 rounded-xs theme-bg-secondary theme-text-secondary border theme-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Volume & Direct Enquire CTA */}
        <div className="mt-4 pt-3 border-t theme-border flex items-center justify-between text-xs">
          <span className="theme-text-muted font-sans text-[11px]">
            {product.volume}
          </span>

          <button
            type="button"
            onClick={handleEnquire}
            className="inline-flex items-center space-x-1 text-[#87692A] hover:theme-text-primary font-serif uppercase tracking-wider text-[11px] font-bold transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
