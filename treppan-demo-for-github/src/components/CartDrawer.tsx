import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
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

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    totalItems,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  // Escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  const handleExploreCreations = () => {
    setIsCartOpen(false);
    navigate('/collections');
  };

  const openVIPCheckout = () => {
    const itemsList = cartItems
      .map((item) => `• ${item.quantity}x ${item.title} (${item.size}) - ${item.price}`)
      .join('\n');

    const formattedSubtotal = `${subtotal.toFixed(3)} KWD`;
    const message = encodeURIComponent(
      `Hello Treppan Fragrance VIP Concierge, I wish to proceed with my royal order:\n\n${itemsList}\n\nTotal Subtotal: ${formattedSubtotal}\nDelivery: Complimentary Kuwait & GCC\n\nPlease confirm availability and concierge dispatch details.`
    );
    window.open(`https://wa.me/96599995353?text=${message}`, '_blank');
  };

  const openVIPEnquiry = () => {
    const message = encodeURIComponent(
      "Hello Treppan Fragrance, I would like to consult with your VIP Concierge regarding my olfactory selection."
    );
    window.open(`https://wa.me/96599995353?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Slide-over Cart Drawer Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] transition-opacity duration-300 animate-fadeIn"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Luxury Cart Drawer */}
      <aside
        aria-label="Shopping Bag Drawer"
        aria-modal="true"
        role="dialog"
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#FAF8F5] text-[#141416] z-[101] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-[#E5E0D5] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBE8DF] bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-serif text-sm sm:text-base font-bold tracking-[0.22em] uppercase text-[#141416]">
                Shopping Bag
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#141416]/5 text-[#737380] font-semibold">
                ({totalItems})
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#87692A] font-semibold mt-0.5">
              Haute Parfumerie Treasury
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
            className="p-2 rounded-full hover:bg-black/5 text-[#737380] hover:text-[#141416] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Switch between Items List and Empty State */}
        {cartItems.length > 0 ? (
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EBE8DF]/80">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="py-4 flex gap-4 items-start group">
                {/* Product Thumbnail */}
                <div className="relative w-20 h-24 sm:w-22 sm:h-28 bg-white/90 rounded-xs border border-[#E5E0D5] p-2 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#141416] leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-neutral-400 hover:text-[#6A0D18] p-1 transition-colors cursor-pointer"
                        aria-label={`Remove ${item.title} from bag`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#87692A] bg-[#DFC27D]/15 border border-[#C5A059]/30 px-2 py-0.5 rounded-xs">
                        {item.size}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#737380] font-sans">
                        Haute Flacon
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-[#EBE8DF]">
                    <div className="flex items-center border border-[#141416]/20 rounded-xs bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-semibold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-xs sm:text-sm font-semibold text-[#141416]">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Bag Row */}
            <div className="pt-3 pb-1 flex justify-end">
              <button
                type="button"
                onClick={clearCart}
                className="text-[10px] uppercase tracking-[0.2em] text-[#737380] hover:text-[#6A0D18] transition-colors cursor-pointer font-sans"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>
        ) : (
          /* Drawer Body: Luxury Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
            <div className="w-20 h-20 rounded-full border border-[#C5A059]/40 bg-[#DFC27D]/10 flex items-center justify-center text-[#87692A] mb-6 shadow-inner">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#87692A] mb-2 font-sans">
              TREPPAN 53 • KUWAIT
            </p>

            <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-[0.18em] text-[#141416] mb-3">
              YOUR BAG IS CURRENTLY EMPTY
            </h3>

            <p className="text-xs sm:text-sm text-[#737380] font-light leading-relaxed max-w-xs mb-8">
              Experience the royal olfactory journey. Explore our exclusive haute parfumerie creations handcrafted in Kuwait with rare notes.
            </p>

            <button
              type="button"
              onClick={handleExploreCreations}
              className="group inline-flex items-center justify-center space-x-2.5 w-full max-w-xs py-3.5 px-6 text-xs font-serif uppercase tracking-[0.22em] font-semibold bg-[#141416] text-[#FAF9F6] hover:bg-[#87692A] transition-all duration-300 rounded-xs shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>EXPLORE CREATIONS</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-300" />
            </button>
          </div>
        )}

        {/* Drawer Footer */}
        <div className="p-6 border-t border-[#EBE8DF] bg-[#F7F4EE]/90 space-y-3">
          {cartItems.length > 0 && (
            <div className="space-y-2 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif uppercase tracking-[0.2em] font-bold text-[#141416]">
                  Subtotal
                </span>
                <span className="font-serif text-base font-bold text-[#141416]">
                  {subtotal.toFixed(3)} KWD
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#737380] uppercase tracking-wider font-light">
                <span>Complimentary Royal Delivery</span>
                <span className="font-medium text-[#87692A]">Included (Kuwait & GCC)</span>
              </div>

              {/* Direct VIP Checkout Button */}
              <button
                type="button"
                onClick={openVIPCheckout}
                className="w-full mt-2 py-3.5 px-5 bg-[#141416] hover:bg-[#87692A] text-[#FAF9F6] text-xs font-serif uppercase tracking-[0.22em] font-semibold rounded-xs shadow-md transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>PROCEED TO VIP CHECKOUT</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {cartItems.length === 0 && (
            <div className="flex items-center justify-between text-[11px] text-[#737380] uppercase tracking-wider font-light">
              <span>Complimentary Royal Delivery</span>
              <span className="font-medium text-[#141416]">Kuwait & GCC</span>
            </div>
          )}

          <button
            type="button"
            onClick={openVIPEnquiry}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 text-[11px] font-serif uppercase tracking-[0.18em] text-[#141416] border border-[#141416]/20 hover:border-[#141416] hover:bg-white rounded-xs transition-colors cursor-pointer"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Consult VIP Concierge</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
