import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { FragranceProduct } from '../types/fragrance';
import { ProductCard } from './ProductCard';
import { ArrowLeft, Search, Droplets, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';
import { navigate } from '../utils/navigation';

// Official WhatsApp Icon SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.44 0-2.84-.37-4.08-1.09l-.29-.17-3.04.8.81-2.96-.19-.3c-.78-1.26-1.2-2.73-1.2-4.51 0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
  </svg>
);

interface FullCollectionsPageProps {
  onBackToHome: () => void;
  onSelectProduct: (product: FragranceProduct) => void;
}

export const FullCollectionsPage: React.FC<FullCollectionsPageProps> = ({
  onBackToHome,
  onSelectProduct,
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Scroll to top when collections page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Full collection catalog
  const allProducts = PRODUCTS;

  const mainCollectionProducts = useMemo(() => {
    return allProducts.filter(
      (product) =>
        product.category !== "Jazeera Airways Edition" &&
        !["silky-musk", "oud-maliki", "oud-jabar"].includes(product.id)
    );
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mainCollectionProducts;

    return mainCollectionProducts.filter((product) => {
      const matchesSearch =
        (product.title && product.title.toLowerCase().includes(q)) ||
        (product.name && product.name.toLowerCase().includes(q)) ||
        (product.notes && product.notes.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q)) ||
        (product.description && product.description.toLowerCase().includes(q));

      return matchesSearch;
    });
  }, [mainCollectionProducts, searchQuery]);

  const sortedProducts = useMemo(() => {
    let list = [...filteredProducts] as (FragranceProduct & { isBestSeller?: boolean })[];
    switch (sortBy) {
      case "price-low":
        return list.sort((a, b) => {
          const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price).replace(/[^0-9.]/g, ""));
          const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price).replace(/[^0-9.]/g, ""));
          return priceA - priceB;
        });
      case "price-high":
        return list.sort((a, b) => {
          const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price).replace(/[^0-9.]/g, ""));
          const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price).replace(/[^0-9.]/g, ""));
          return priceB - priceA;
        });
      case "alpha-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "alpha-desc":
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case "bestselling":
        return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      case "recommended":
      default:
        return list; // Preserves curated catalog order
    }
  }, [filteredProducts, sortBy]);

  const handleReturnToSection4 = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/#collections', { state: { scrollTo: 'collections' } });
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Treppan Fragrance, I would like to enquire about your complete collection.");
    window.open(`https://wa.me/96599995353?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 flex flex-col">
      {/* 1. Clean "Back to Home" / Return Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF8F5]/90 border-b border-neutral-200/60 shadow-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Left: Back to Home Button */}
            <button
              onClick={handleReturnToSection4}
              className="inline-flex items-center space-x-2 text-neutral-900 hover:text-[#B8860B] transition-colors font-medium text-xs tracking-[0.2em] uppercase py-2 group cursor-pointer"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-900 group-hover:text-[#B8860B] group-hover:-translate-x-1 transition-all" />
              <span>Back to Home</span>
            </button>

            {/* Center: Brand Identity */}
            <button
              onClick={handleReturnToSection4}
              className="flex items-center space-x-2.5 sm:space-x-3 text-center group py-2 cursor-pointer"
              aria-label="Treppan 53 Home"
            >
              <div className="p-1 rounded-sm border border-[#C5A059]/30 bg-white/60 flex items-center justify-center shadow-xs">
                <img
                  src="/assets/treppan_official_logo.png"
                  alt="Treppan Fragrance"
                  className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-serif text-base sm:text-lg font-bold tracking-[0.25em] uppercase text-neutral-950">
                    TREPPAN
                  </span>
                  <span className="font-serif text-xs sm:text-sm font-semibold pl-1.5 border-l text-[#87692A] border-[#C5A059]/40">
                    53
                  </span>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.45em] font-medium text-neutral-600">
                  Haute Parfumerie • Kuwait
                </span>
              </div>
            </button>

            {/* Right: VIP Enquiry & Cart Button */}
            <div className="flex items-center gap-4 sm:gap-6 pr-1 sm:pr-2 lg:pr-3">
              <button
                type="button"
                onClick={openWhatsApp}
                className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-serif uppercase tracking-[0.2em] font-semibold bg-[#141416] text-[#FAF9F6] hover:bg-[#87692A] rounded-xs shadow-sm group flex-shrink-0 transition-all duration-300 cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">VIP Enquire</span>
                <span className="sm:hidden">Enquire</span>
              </button>

              {/* Luxury Transparent Icon-Only Cart Button with Themed Count Badge */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Bag"
                className="relative bg-transparent border-0 shadow-none outline-none p-1 sm:p-1.5 flex items-center justify-center cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95 flex-shrink-0 text-neutral-900"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.6] text-neutral-900" />
                {totalItems > 0 && (
                  <span
                    key={totalItems}
                    className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#5A121A] text-white text-[10px] font-semibold rounded-full flex items-center justify-center leading-none shadow-sm transition-transform duration-300 scale-100 animate-in zoom-in-75 pointer-events-none"
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Intro Banner: Synchronized Haute Curation */}
          <div className="text-center space-y-3.5 max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#C5A059]/40 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#87692A] font-bold font-sans">
                Royal Olfactory Curation
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
            </div>

            <h1 className="font-serif font-normal text-neutral-900 text-4xl sm:text-5xl md:text-6xl tracking-tight">
              The Haute <span className="italic font-normal text-[#87692A]">Collections</span>
            </h1>

            <p className="text-neutral-600 font-sans max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
              100% alcohol-free Aqua Parfums, 40-year vintage aged Dehenal Oud, and authentic Himalayan Kasturi attars crafted for royalty.
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

          {/* Luxury Editorial Sort Dropdown UI */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium">
              SHOWING {sortedProducts.length} OF {mainCollectionProducts.length} ROYAL CREATIONS
            </p>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <label htmlFor="sort-select" className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-600">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#FAF8F5] border border-neutral-300 hover:border-neutral-900 focus:border-[#C5A059] text-neutral-900 text-xs tracking-wider uppercase pl-3.5 pr-8 py-2 rounded-md outline-none cursor-pointer transition-all font-medium shadow-sm"
                >
                  <option value="recommended">Recommended</option>
                  <option value="bestselling">Best selling</option>
                  <option value="alpha-asc">Alphabetically, A-Z</option>
                  <option value="alpha-desc">Alphabetically, Z-A</option>
                  <option value="price-low">Price: Low to high</option>
                  <option value="price-high">Price: High to low</option>
                </select>
                <svg
                  className="w-3.5 h-3.5 text-neutral-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* All 28 Products Responsive Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch">
              {sortedProducts.map((product) => (
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
                onClick={() => setSearchQuery('')}
                className="mt-3 px-5 py-2 text-xs font-serif uppercase tracking-wider bg-[#141416] text-[#FAF9F6] hover:bg-[#87692A] rounded-xs transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Bottom Return CTA */}
          <div className="mt-16 pt-10 border-t theme-border text-center">
            <button
              onClick={handleReturnToSection4}
              className="inline-flex items-center space-x-2 text-xs font-serif uppercase tracking-[0.2em] font-semibold text-[#87692A] hover:theme-text-primary transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Return to Homepage Experience</span>
            </button>
          </div>

        </div>
      </main>

      {/* Synchronized Slide-over Luxury Cart Drawer */}
      <CartDrawer />
    </div>
  );
};
