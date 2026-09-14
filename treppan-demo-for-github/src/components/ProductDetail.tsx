import React, { useState, useEffect } from 'react';
import { FragranceProduct } from '../types/fragrance';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { ArrowLeft, ShoppingBag, Zap, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product?: FragranceProduct | null;
  productId?: string | null;
  onReturnToCollections: () => void;
  onSelectProduct: (product: FragranceProduct) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product: initialProduct,
  productId,
  onReturnToCollections,
  onSelectProduct,
}) => {
  const { addToCart, setIsCartOpen } = useCart();

  // Resolve product ID/slug from props or URL
  const getRouteId = (): string | undefined => {
    if (productId) return productId;
    if (typeof window !== 'undefined') {
      const hashMatch = window.location.hash.match(/^#\/?product\/([^/?#]+)/);
      if (hashMatch) return hashMatch[1];
      const pathMatch = window.location.pathname.match(/^\/product\/([^/?#]+)/);
      if (pathMatch) return pathMatch[1];
    }
    return undefined;
  };

  const id = getRouteId();
  const products = PRODUCTS;

  // Find product from props or id matching product.id or slugified product.title
  const matchedProduct = id
    ? products.find(
        (p) =>
          p.id.toLowerCase() === id?.toLowerCase() ||
          p.id.toLowerCase() === id?.toLowerCase().replace(/^trp-/, '') ||
          p.title.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase() ||
          p.name.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase()
      )
    : null;

  const currentProduct = initialProduct || matchedProduct || products[0];

  const displayName = currentProduct.title || currentProduct.name;

  // Gallery images list: render all available image numbers in product.images (primary, secondary, and extra numbered images)
  const galleryImages =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : [currentProduct.image, currentProduct.hoverImage].filter(Boolean);

  // Active view image
  const [activeImage, setActiveImage] = useState<string>(
    (currentProduct.images && currentProduct.images[0]) || currentProduct.image
  );

  // Size selection
  const availableSizes =
    currentProduct.sizes && currentProduct.sizes.length > 0
      ? currentProduct.sizes
      : ['50 ML', '100 ML'];
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0]);

  // Cart feedback state
  const [isAddedToBag, setIsAddedToBag] = useState<boolean>(false);

  // Sync active image and size when currentProduct changes
  useEffect(() => {
    setActiveImage((currentProduct.images && currentProduct.images[0]) || currentProduct.image);
    if (currentProduct.sizes && currentProduct.sizes.length > 0) {
      setSelectedSize(currentProduct.sizes[0]);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentProduct]);

  // Handle Add to Bag action
  const handleAddToBag = () => {
    addToCart(currentProduct, selectedSize);
    setIsCartOpen(false);
    setIsAddedToBag(true);
    setTimeout(() => {
      setIsAddedToBag(false);
    }, 1500);
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    addToCart(currentProduct, selectedSize);
    setIsCartOpen(true);
  };

  // Handle Return action cleanly
  const handleReturn = () => {
    if (onReturnToCollections) {
      onReturnToCollections();
    } else {
      window.location.hash = '#collections';
    }
  };

  // 3-4 Recommended Creations ("YOU MAY ALSO LIKE")
  const recommendedProducts = PRODUCTS.filter((p) => p.id !== currentProduct.id).slice(0, 4);

  // Format price
  const formattedPrice =
    currentProduct.price.includes('KD') || currentProduct.price.includes('KWD')
      ? currentProduct.price
      : `${currentProduct.price} KD`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* 1. Top Navigation: Luxury "← RETURN TO COLLECTIONS" button */}
        <nav aria-label="Breadcrumb" className="mb-8 sm:mb-12">
          <button
            type="button"
            onClick={handleReturn}
            className="text-neutral-700 hover:text-neutral-950 transition-colors inline-flex items-center gap-2 py-2.5 px-4 text-xs font-serif uppercase tracking-[0.22em] group cursor-pointer rounded-xs"
            aria-label="Return to Collections"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="relative inline-block pb-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#B8860B] after:transition-all after:duration-300 after:ease-out group-hover:after:w-full">
              RETURN TO COLLECTIONS
            </span>
          </button>
        </nav>

        {/* 2. Two-Column Layout (Desktop) / Stacked (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Column: Unconstrained seamless image canvas & multi-image thumbnail bar */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Main Stage Image Wrapper */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square bg-transparent overflow-hidden flex items-center justify-center">
              {galleryImages.map((imgSrc, idx) => {
                const isSelected = activeImage === imgSrc;
                return (
                  <img
                    key={imgSrc}
                    src={imgSrc}
                    alt={`${displayName} - View ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-[400ms] ease-out select-none ${
                      isSelected
                        ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                        : 'opacity-0 scale-[1.03] z-0 pointer-events-none'
                    }`}
                  />
                );
              })}
            </div>

            {/* Gallery Thumbnail Selector / Active Thumbnail Feedback */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 overflow-x-auto max-w-full pb-2 no-scrollbar">
                {galleryImages.map((imgSrc, idx) => {
                  const isSelected = activeImage === imgSrc;
                  return (
                    <button
                      key={imgSrc}
                      type="button"
                      onClick={() => setActiveImage(imgSrc)}
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 p-1.5 rounded-xs border transition-all duration-300 bg-white/70 overflow-hidden flex items-center justify-center cursor-pointer group shrink-0 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#B8860B] after:transition-all after:duration-300 after:ease-out ${
                        isSelected
                          ? 'border-neutral-900 ring-1 ring-neutral-900 opacity-100 after:w-full'
                          : 'border-neutral-300/80 opacity-60 hover:opacity-100 transition-opacity after:w-0 hover:after:w-full'
                      }`}
                      title={`${displayName} - View ${idx + 1}`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${displayName} View ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Minimal & Conversion-focused */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8 pt-2 sm:pt-4">

            {/* Category / Subtitle Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.25em] text-[#8B7355] border border-[#D4AF37]/30 bg-[#F4EFE6] px-3 py-1 rounded-xs">
                {currentProduct.category}
              </span>
            </div>

            {/* Product Title (Deep obsidian serif) */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900 leading-[1.15]">
                {displayName}
              </h1>
              {currentProduct.subtitle && (
                <p className="text-xs sm:text-sm font-sans tracking-[0.18em] text-[#87692A] uppercase font-semibold mt-2">
                  {currentProduct.subtitle}
                </p>
              )}

              {/* Price (Crisp dark gold/charcoal text-neutral-900 font-medium) */}
              <div className="mt-4 flex items-baseline space-x-2">
                <span className="font-serif text-2xl sm:text-3xl font-medium text-neutral-900 tracking-wide">
                  {formattedPrice}
                </span>
              </div>
            </div>

            {/* Discreet gold/taupe accent line */}
            <div className="w-16 h-[1.5px] bg-[#C5A059]/50" />

            {/* Size Selector pills with active state highlight */}
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold text-neutral-700 block">
                Select Size / Presentation
              </span>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 text-xs font-serif uppercase tracking-[0.2em] rounded-xs transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 text-[#FAF8F5] border border-neutral-900 shadow-sm font-semibold'
                          : 'bg-transparent border border-neutral-300 text-neutral-800 hover:border-neutral-900'
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unified Product Description */}
            <div className="space-y-2">
              <p className="text-neutral-700 text-sm md:text-base leading-relaxed font-sans max-w-xl">
                {currentProduct.description}
              </p>
            </div>

            {/* Action Buttons: ADD TO BAG & BUY NOW */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* 1. "ADD TO BAG" (Refined dark border with luxury hover) */}
              <button
                type="button"
                onClick={handleAddToBag}
                className="flex-1 py-4 px-6 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 font-serif uppercase tracking-[0.22em] text-xs font-semibold rounded-xs flex items-center justify-center space-x-2 cursor-pointer"
                aria-label="Add product to bag"
              >
                {isAddedToBag ? (
                  <>
                    <Check className="w-4 h-4 text-[#87692A]" />
                    <span>ADDED TO BAG ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>

              {/* 2. "BUY NOW" (Solid obsidian button with VIP gold hover) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 bg-neutral-900 text-[#FAF8F5] hover:bg-[#87692A] hover:border-[#87692A] border border-neutral-900 transition-all duration-300 ease-out font-serif uppercase tracking-[0.22em] text-xs font-semibold rounded-xs shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                aria-label="Buy product now"
              >
                <Zap className="w-4 h-4 text-[#DFC27D]" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Haute Parfumerie Guarantee / Feature Pills */}
            <div className="pt-4 border-t border-neutral-300/60 grid grid-cols-2 gap-4 text-[11px] font-sans">
              <div className="flex items-center space-x-2 text-neutral-600 border border-neutral-300/60 rounded-xs py-2 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
                <span>Authentic Master Distillation</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-600 border border-neutral-300/60 rounded-xs py-2 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
                <span>24-Hour Enduring Sillage</span>
              </div>
            </div>

          </div>

        </div>

        {/* 3. Bottom Section: "YOU MAY ALSO LIKE" / Recommended Creations row */}
        <section className="mt-24 sm:mt-32 pt-14 border-t border-neutral-200 bg-[#FAF8F5]">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-[10px] uppercase font-sans font-bold tracking-[0.25em] text-[#8B7355]">
              Haute Recommendations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight mt-1 text-neutral-900">
              You May Also Like
            </h2>
            <div className="w-10 h-[1.5px] bg-[#C5A059]/40 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {recommendedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ProductDetail;
