import React, { useEffect } from 'react';
import { FragranceProduct } from '../types/fragrance';
import { PRODUCTS } from '../data/products';
import { X, MessageSquare, Sparkles, Droplets, Wind } from 'lucide-react';

interface ProductDetailModalProps {
  product: FragranceProduct | null;
  onClose: () => void;
  onSelectProduct: (product: FragranceProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleWhatsAppEnquiry = () => {
    const message = encodeURIComponent(
      `Hello Treppan Fragrance, I would like to enquire about ${product.name} (${product.volume}).`
    );
    window.open(`https://wa.me/96599995353?text=${message}`, '_blank');
  };

  // Get 3 related products
  const related = (product.relatedIds || [])
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is FragranceProduct => Boolean(p))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Backdrop click dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative theme-bg-card w-full max-w-4xl rounded-md shadow-2xl border theme-border-gold overflow-hidden z-10 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full theme-bg-card/90 border theme-border flex items-center justify-center theme-text-primary hover:bg-[#141416] hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Product Showcase Visual */}
          <div className="md:col-span-5 theme-bg-secondary p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r theme-border relative">
            
            {/* Top Badges */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-xs bg-[#6A0D18] text-white">
                {product.badge}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs theme-bg-card text-[#87692A] border theme-border-gold font-semibold">
                {product.volume}
              </span>
            </div>

            {/* Bottle Image */}
            <div className="relative w-full aspect-square flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Aviation / Quality Seal */}
            <div className="mt-6 w-full p-3 rounded-xs theme-bg-card border theme-border text-center space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-[#87692A] text-[11px] font-serif uppercase tracking-wider font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{product.interactiveBadge}</span>
              </div>
              <p className="text-[10px] theme-text-muted font-sans">
                Formulated & Bottled in the State of Kuwait
              </p>
            </div>

          </div>

          {/* Right Column: Olfactory Architecture & Story */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 theme-bg-card">
            
            {/* Title Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.22em] text-[#87692A] font-sans font-semibold">
                  {product.subCategory}
                </span>
                <span className="font-arabic text-sm theme-text-muted">
                  {product.arabicName}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold theme-text-primary mt-1">
                {product.name}
              </h2>
              <p className="text-xs theme-text-muted font-sans italic mt-0.5">
                "{product.subtitle}"
              </p>
            </div>

            {/* Description */}
            <p className="text-sm theme-text-secondary leading-relaxed font-light">
              {product.description}
            </p>

            {/* The Olfactory Pyramid */}
            <div className="p-4 rounded-xs theme-bg-secondary border theme-border space-y-3">
              <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-[0.2em] theme-text-primary font-bold border-b theme-border pb-2">
                <Wind className="w-4 h-4 text-[#C5A059]" />
                <span>The Olfactory Pyramid</span>
              </div>

              {/* Top Notes */}
              <div className="text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#87692A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Top Notes</span>
                </div>
                <p className="theme-text-secondary pl-3 leading-relaxed font-normal">
                  {product.olfactoryPyramid.topNotes}
                </p>
              </div>

              {/* Heart Notes */}
              <div className="text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#6A0D18]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6A0D18]" />
                  <span>Heart Notes</span>
                </div>
                <p className="theme-text-secondary pl-3 leading-relaxed font-normal">
                  {product.olfactoryPyramid.heartNotes}
                </p>
              </div>

              {/* Base Notes */}
              <div className="text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-semibold theme-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#87692A]" />
                  <span>Base Notes</span>
                </div>
                <p className="theme-text-secondary pl-3 leading-relaxed font-normal">
                  {product.olfactoryPyramid.baseNotes}
                </p>
              </div>
            </div>

            {/* Formulation & Wear Experience */}
            <div className="space-y-2">
              <h4 className="font-serif text-xs uppercase tracking-widest theme-text-primary font-bold flex items-center space-x-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Molecular Formulation & Sillage</span>
              </h4>
              <p className="text-xs theme-text-secondary leading-relaxed font-light">
                {product.formulationStory}
              </p>
            </div>

            {/* VIP WhatsApp Enquiry Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleWhatsAppEnquiry}
                className="w-full py-4 bg-[#141416] hover:bg-[#87692A] text-[#FAF9F6] text-xs font-serif uppercase tracking-[0.22em] font-semibold transition-all duration-300 rounded-xs shadow-md flex items-center justify-center space-x-2.5 group"
              >
                <MessageSquare className="w-4 h-4 text-[#DFC27D] group-hover:scale-110 transition-transform" />
                <span>VIP Concierge Enquiry via WhatsApp</span>
              </button>
              <p className="text-[10px] theme-text-muted text-center mt-2">
                Complimentary consultation with Kuwait master perfumers. No commitment required.
              </p>
            </div>

            {/* Related Recommendations */}
            {related.length > 0 && (
              <div className="pt-4 border-t theme-border">
                <div className="text-[10px] uppercase tracking-widest font-serif font-bold theme-text-muted mb-3">
                  Complementary Royal Creations:
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {related.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectProduct(rel)}
                      className="p-2 rounded-xs theme-bg-secondary border theme-border hover:border-[#C5A059] text-left transition-all group"
                    >
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-12 object-contain mb-1"
                      />
                      <p className="font-serif text-[10px] font-bold theme-text-primary group-hover:text-[#87692A] truncate">
                        {rel.name}
                      </p>
                      <p className="text-[9px] theme-text-muted truncate">
                        {rel.subCategory.split('•')[0]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
