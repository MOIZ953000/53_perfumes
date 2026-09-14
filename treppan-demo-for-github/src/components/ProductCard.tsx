import React from 'react';
import { FragranceProduct } from '../types/fragrance';

interface ProductCardProps {
  product: FragranceProduct;
  onSelect: (product: FragranceProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(product);
  };

  const displayName = product.title || product.name;
  const primaryImage = product.images?.[0] || product.image;
  const secondaryImage = product.images?.[1] || product.hoverImage || primaryImage;

  // Format price display nicely if it includes KD or KWD or bare
  const formattedPrice = product.price.includes('KD') || product.price.includes('KWD')
    ? product.price
    : `${product.price} KD`;

  return (
    <a
      href={`#product/${product.id}`}
      onClick={handleClick}
      className="group relative flex flex-col justify-between bg-transparent border-0 border-none shadow-none cursor-pointer select-none block text-center outline-none"
      aria-label={`View details for ${displayName}`}
    >
      {/* 2:3 Aspect Ratio Container with Complete Bottle Visibility & Seamless Transparent Background */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-transparent rounded-none group flex items-center justify-center">
        <img
          src={primaryImage}
          alt={displayName}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out group-hover:opacity-0"
          loading="lazy"
        />
        <img
          src={secondaryImage}
          alt={`${displayName} Alternate View`}
          className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
          loading="lazy"
        />
      </div>

      {/* Clean Bottom Metadata: Product Name & Price directly below the image */}
      <div className="pt-4 pb-2 px-1 flex flex-col items-center text-center bg-transparent border-0 border-none shadow-none">
        <h3 className="font-serif text-base sm:text-lg font-normal text-neutral-900 leading-snug line-clamp-1">
          <span className="relative inline-block pb-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#B8860B] after:transition-all after:duration-300 after:ease-out group-hover:after:w-full hover:after:w-full">
            {displayName}
          </span>
        </h3>
        <p className="font-serif text-sm sm:text-base font-medium text-neutral-800 tracking-wide mt-1.5">
          {formattedPrice}
        </p>
      </div>
    </a>
  );
};

export default ProductCard;
