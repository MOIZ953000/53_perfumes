import React from 'react';
import { PRODUCTS } from '../data/products';
import { FragranceProduct } from '../types/fragrance';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: FragranceProduct) => void;
  onExploreFullCollection: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onExploreFullCollection,
}) => {
  // Display ONLY the first 4 products on the homepage section
  const displayedProducts = PRODUCTS.slice(0, 4);

  return (
    <section id="collection" className="py-20 sm:py-28 theme-bg-primary border-t theme-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full theme-bg-secondary border theme-border-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#87692A] font-bold font-sans">
              Royal Olfactory Curation
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold theme-text-primary tracking-tight">
            The Haute <span className="italic font-normal text-[#87692A]">Collections</span>
          </h2>

          <p className="theme-text-secondary text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
            100% alcohol-free Aqua Parfums, 40-year vintage aged Dehenal Oud, and authentic Himalayan Kasturi attars crafted for royalty.
          </p>
        </div>

        {/* 4 Products Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>

        {/* Centered Luxury Button: EXPLORE FULL COLLECTION */}
        <div className="mt-14 sm:mt-18 flex justify-center">
          <button
            type="button"
            onClick={onExploreFullCollection}
            className="group relative inline-flex items-center space-x-3 px-8 sm:px-10 py-4 bg-[#141416] hover:bg-[#87692A] text-[#FAF9F6] border border-[#87692A]/60 hover:border-[#87692A] text-xs font-serif uppercase tracking-[0.25em] font-semibold rounded-xs shadow-md hover:shadow-gold-glow transition-all duration-300 cursor-pointer"
            aria-label="Explore Full Collection"
          >
            <span>Explore Full Collection</span>
            <ArrowRight className="w-4 h-4 text-[#DFC27D] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
          </button>
        </div>

      </div>
    </section>
  );
};

