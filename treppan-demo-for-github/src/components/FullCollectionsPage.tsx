import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { FragranceCategory, FragranceProduct } from '../types/fragrance';
import { ProductCard } from './ProductCard';
import { ArrowLeft, Search, Droplets, Sparkles } from 'lucide-react';

interface FullCollectionsPageProps {
  onBackToHome: () => void;
  onSelectProduct: (product: FragranceProduct) => void;
}

export const FullCollectionsPage: React.FC<FullCollectionsPageProps> = ({
  onBackToHome,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FragranceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top when collections page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.arabicName.toLowerCase().includes(query) ||
      (product.conciseNotes && product.conciseNotes.toLowerCase().includes(query)) ||
      (product.concentrationVolume && product.concentrationVolume.toLowerCase().includes(query)) ||
      product.topNotes.toLowerCase().includes(query) ||
      product.heartNotes.toLowerCase().includes(query) ||
      product.baseNotes.toLowerCase().includes(query) ||
      product.accordTags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Treppan Fragrance, I would like to enquire about your complete collection.");
    window.open(`https://wa.me/96599995353?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary flex flex-col">
      {/* 1. Clean "Back to Home" / Return Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#121214]/80 border-b theme-border shadow-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Back to Home Button */}
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-2 text-xs font-serif uppercase tracking-[0.2em] font-bold text-[#141416] dark:text-white hover:text-[#87692A] dark:hover:text-[#DFC27D] transition-colors py-2 group cursor-pointer"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 text-[#87692A] dark:text-[#DFC27D] group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            {/* Center: Brand Identity */}
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2.5 sm:space-x-3 text-center group py-2 cursor-pointer"
              aria-label="Treppan 53 Home"
            >
              <img
                src="/assets/treppan_official_logo.png"
                alt="Treppan Fragrance"
                className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col text-left">
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-serif text-base sm:text-lg font-bold tracking-[0.25em] uppercase text-[#141416] dark:text-white">
                    TREPPAN
                  </span>
                  <span className="font-serif text-xs sm:text-sm font-semibold pl-1.5 border-l text-[#87692A] border-[#C5A059]/40">
                    53
                  </span>
                </div>
                <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.4em] font-medium text-[#737380] dark:text-white/70">
                  Full Catalog • 12 Creations
                </span>
              </div>
            </button>

            {/* Right: VIP Enquiry */}
            <button
              onClick={openWhatsApp}
              className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 text-[11px] font-serif uppercase tracking-[0.2em] font-semibold bg-[#141416] text-[#FAF9F6] hover:bg-[#87692A] rounded-xs shadow-sm transition-all duration-300 cursor-pointer"
            >
              <span>VIP Enquire</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Intro Banner */}
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full theme-bg-secondary border theme-border-gold">
              <Sparkles className="w-3 h-3 text-[#87692A]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#87692A] font-bold font-sans">
                Haute Parfumerie Treasury
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold theme-text-primary tracking-tight">
              The Royal <span className="italic font-normal text-[#87692A]">Collections</span>
            </h1>

            <p className="theme-text-secondary text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
              Explore all 12 royal alcohol-free Aqua Parfums, 40-year vintage aged Dehenal Oud, and authentic Himalayan Kasturi attars formulated for discerning connoisseurs.
            </p>
          </div>

          {/* Search Bar at Top */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by fragrance name, oud, notes, or accords..."
                className="w-full theme-bg-secondary border theme-border focus:border-[#87692A] rounded-xs pl-11 pr-10 py-3.5 text-sm theme-text-primary placeholder:theme-text-muted focus:outline-hidden transition-colors font-sans shadow-xs"
              />
              <Search className="w-4 h-4 text-[#87692A] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 theme-text-muted hover:theme-text-primary text-sm cursor-pointer p-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* All Category Filter Pills */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2 px-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as FragranceCategory)}
                    className={`px-4 py-2.5 rounded-xs text-xs font-serif uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                      isActive
                        ? 'bg-[#141416] text-[#FAF9F6] font-semibold border border-[#141416] dark:bg-[#FAF9F6] dark:text-[#141416]'
                        : 'theme-bg-secondary theme-text-secondary hover:theme-text-primary border theme-border hover:border-[#87692A]/50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] font-sans ${isActive ? 'text-[#DFC27D] dark:text-[#87692A]' : 'theme-text-muted'}`}>
                      ({cat.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count Banner */}
          <div className="flex items-center justify-between pb-4 mb-8 border-b theme-border text-xs theme-text-muted font-serif uppercase tracking-wider">
            <span>
              Showing {filteredProducts.length} of {PRODUCTS.length} Royal Creations
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[#87692A] hover:underline cursor-pointer"
              >
                Clear Category Filter
              </button>
            )}
          </div>

          {/* All 12 Products Responsive Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 theme-bg-secondary rounded-xs border theme-border max-w-md mx-auto">
              <Droplets className="w-10 h-10 text-[#C5A059] mx-auto opacity-70" />
              <h3 className="font-serif text-lg theme-text-primary">No Fragrances Found</h3>
              <p className="text-xs theme-text-secondary max-w-xs mx-auto font-light leading-relaxed">
                We couldn't find any creations matching your search. Try resetting filters or searching for notes like "Assam Oud", "Taif Rose", or "Kasturi Musk".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-5 py-2 text-xs font-serif uppercase tracking-wider bg-[#141416] text-[#FAF9F6] hover:bg-[#87692A] rounded-xs transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Bottom Return CTA */}
          <div className="mt-16 pt-10 border-t theme-border text-center">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-2 text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#87692A] hover:theme-text-primary transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Return to Homepage Experience</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};
