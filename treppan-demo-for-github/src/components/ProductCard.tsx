import React, { useState } from 'react';
import { FragranceProduct } from '../types/fragrance';
import { Eye, ShoppingBag, Check, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: FragranceProduct;
  onSelect: (product: FragranceProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(product);
  };

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative h-full flex flex-col justify-between theme-bg-card rounded-xs border theme-border hover:theme-border-gold transition-all duration-300 overflow-hidden cursor-pointer shadow-xs hover:shadow-gold-glow hover:-translate-y-1 select-none"
    >
      {/* Bottle Presentation Container: Warm Luxury Alabaster Backdrop */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-[#F4F2EC] to-[#EBE8DF] p-6 sm:p-8 flex items-center justify-center transition-colors duration-500">
        
        {/* Soft Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.65)_0%,transparent_70%)] pointer-events-none" />

        {/* Badge & Category */}
        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
          <span className="text-[9px] uppercase tracking-widest font-serif font-bold px-2 py-0.5 rounded-xs bg-[#141416] text-[#FAF9F6]">
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

        {/* Perfume Bottle Photograph */}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)] transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Quick View & Actions Drawer (Kept Intact) */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2 z-20">
          <button
            type="button"
            onClick={handleQuickView}
            className="flex-1 py-2.5 px-3 bg-[#141416] hover:bg-[#87692A] text-white text-[11px] font-serif uppercase tracking-[0.18em] font-semibold rounded-xs shadow-md transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            aria-label={`Discover ${product.name}`}
          >
            <Eye className="w-3.5 h-3.5 text-[#DFC27D]" />
            <span>Discover Notes</span>
          </button>

          <button
            type="button"
            onClick={handleAddToBag}
            className={`p-2.5 border rounded-xs text-[10px] font-serif uppercase tracking-wider transition-all duration-300 flex items-center justify-center shadow-md cursor-pointer ${
              isAdded
                ? 'bg-[#C5A059] text-[#141416] border-[#C5A059]'
                : 'bg-white hover:bg-[#FAF9F6] text-[#87692A] border-[#EBE8DF]'
            }`}
            title={isAdded ? 'Added to Bag' : 'Add to Bag'}
            aria-label={`Add ${product.name} to bag`}
          >
            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Minimal Product Info Box: ONLY Product Name & Price */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between theme-bg-card border-t theme-border">
        {/* Product Name in elegant serif font */}
        <h3 className="font-serif text-base sm:text-lg font-bold theme-text-primary group-hover:text-[#87692A] transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Price Only */}
        <div className="mt-3 pt-2.5 border-t theme-border flex items-baseline space-x-1.5">
          <span className="font-serif text-base sm:text-lg font-bold theme-text-primary">
            {product.price ? product.price.toFixed(3) : '45.000'}
          </span>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#87692A]">
            KWD
          </span>
        </div>
      </div>
    </div>
  );
};
