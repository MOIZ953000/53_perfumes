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
  // Display the first 4 creations on the Section 4 showcase
  const displayedProducts = PRODUCTS.slice(0, 4);

  return (
    <section id="collections" className="py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#EAE6DE] relative transition-colors duration-300 scroll-mt-20">
      <span id="collection" className="sr-only" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Haute Perfumerie Elegance */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#C5A059]/40 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#87692A] font-bold font-sans">
              Royal Olfactory Curation
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
          </div>

          <h2 className="font-serif font-normal text-neutral-900 text-4xl sm:text-5xl md:text-6xl tracking-tight">
            The Haute <span className="italic font-normal text-[#87692A]">Collections</span>
          </h2>

          <p className="text-neutral-600 font-sans max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
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
            className="group relative inline-flex items-center space-x-3 px-8 sm:px-10 py-4 bg-[#141416] hover:bg-[#87692A] text-[#FAF9F6] border border-[#87692A]/50 hover:border-[#87692A] text-xs font-serif uppercase tracking-[0.25em] font-semibold rounded-xs shadow-md hover:shadow-[0_10px_25px_-5px_rgba(135,105,42,0.4)] transition-all duration-300 cursor-pointer"
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
export default ProductCatalog;
