import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { FragranceCategory, FragranceProduct } from '../types/fragrance';
import { ProductCard } from './ProductCard';
import { Search, Droplets } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: FragranceProduct) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<FragranceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === '' ||
      product.name.toLowerCase().includes(query) ||
      product.arabicName.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.topNotes.toLowerCase().includes(query) ||
      product.heartNotes.toLowerCase().includes(query) ||
      product.baseNotes.toLowerCase().includes(query) ||
      product.accordTags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="collection" className="py-20 sm:py-28 theme-bg-primary border-t theme-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full theme-bg-secondary border theme-border-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#87692A] font-bold font-sans">
              Royal Olfactory Curation
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold theme-text-primary tracking-tight">
            The Haute <span className="italic font-normal text-[#87692A]">Collections</span>
          </h2>

          <p className="theme-text-secondary text-sm sm:text-base font-light leading-relaxed">
            Distilled without synthetic ethanol. Explore water-born Aqua Parfums, wild 40-year Dehenal Oud, and authentic Himalayan Kasturi deer musk.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 mb-8 border-b theme-border">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-start">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as FragranceCategory)}
                className={`px-4 py-2 rounded-xs text-xs font-serif uppercase tracking-[0.16em] transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-[#141416] text-[#FAF9F6] shadow-sm font-semibold'
                    : 'theme-bg-card theme-text-secondary hover:theme-text-primary hover:theme-bg-secondary border theme-border'
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1.5 text-[10px] opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, oud, musk..."
              className="w-full theme-bg-card border theme-border focus:border-[#C5A059] rounded-xs px-9 py-2 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-hidden transition-colors font-sans"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:theme-text-primary text-xs"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 theme-bg-card rounded-xs border theme-border">
            <Droplets className="w-8 h-8 text-[#C5A059] mx-auto opacity-50" />
            <h3 className="font-serif text-lg theme-text-primary">No Fragrance Found</h3>
            <p className="text-xs theme-text-muted max-w-sm mx-auto">
              We couldn't find any creations matching "{searchQuery}". Try searching for ingredients like "Oud", "Taif Rose", or "Musk".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-serif uppercase tracking-wider text-[#87692A] underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
