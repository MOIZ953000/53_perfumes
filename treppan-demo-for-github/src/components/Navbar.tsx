import React, { useState, useEffect } from 'react';
import { Menu, X, Plane, ShoppingBag } from 'lucide-react';
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

interface NavbarProps {
  onOpenEnquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 15);

      // Dynamically detect if navbar is floating over dark background content
      const editorialStage = document.getElementById('editorial-scroll-stage');
      const footer = document.querySelector('footer');
      const navCenterY = 40;

      let dark = false;
      if (document.documentElement.classList.contains('dark')) {
        dark = true;
      } else {
        if (editorialStage) {
          const rect = editorialStage.getBoundingClientRect();
          if (rect.top <= navCenterY && rect.bottom >= navCenterY) {
            dark = true;
          }
        }
        if (!dark && footer) {
          const rect = footer.getBoundingClientRect();
          if (rect.top <= navCenterY && rect.bottom >= navCenterY) {
            dark = true;
          }
        }
      }
      setIsDarkBg(dark);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Treppan Fragrance, I would like to enquire about your royal collections.");
    window.open(`https://wa.me/96599995353?text=${message}`, '_blank');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md lg:backdrop-blur-lg border-b ${isDarkBg
          ? 'bg-[#121214]/60 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.35)]'
          : isScrolled
            ? 'bg-white/65 border-white/30 shadow-[0_4px_25px_rgba(0,0,0,0.04)]'
            : 'bg-white/20 border-white/20'
          }`}
        style={{
          WebkitBackdropFilter: 'blur(16px)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Left: Navigation Links */}
            <div
              className={`hidden lg:flex items-center space-x-8 text-xs tracking-[0.22em] uppercase font-sans font-semibold transition-colors duration-300 ${isDarkBg ? 'text-white' : 'text-[#141416]'
                }`}
            >
              <a
                href="/collections"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/collections');
                }}
                className={`transition-colors relative py-1 group ${isDarkBg ? 'hover:text-[#DFC27D]' : 'hover:text-[#87692A]'
                  }`}
              >
                <span>Collection</span>
                <span
                  className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${isDarkBg ? 'bg-[#DFC27D]' : 'bg-[#C5A059]'
                    }`}
                ></span>
              </a>
              <a
                href="#jazeera"
                className={`transition-colors relative py-1 group flex items-center space-x-1.5 ${isDarkBg ? 'hover:text-[#DFC27D]' : 'hover:text-[#87692A]'
                  }`}
              >
                <Plane
                  className={`w-3.5 h-3.5 transition-colors ${isDarkBg ? 'text-[#DFC27D]' : 'text-[#87692A]'
                    }`}
                />
                <span>Jazeera Edition</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isDarkBg ? 'bg-[#DFC27D]' : 'bg-[#6A0D18]'
                    }`}
                ></span>
              </a>
            </div>

            {/* Center: Brand Logo & Title */}
            <a href="#" className="flex items-center space-x-3 text-center group py-2">
              <img
                src="/assets/treppan_official_logo.png"
                alt="Treppan Fragrance"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
              />
              <div className="flex flex-col text-left">
                <div className="flex items-baseline space-x-1.5">
                  <span
                    className={`font-serif text-lg sm:text-xl font-bold tracking-[0.25em] uppercase transition-colors duration-300 ${isDarkBg ? 'text-white' : 'text-[#141416]'
                      }`}
                  >
                    TREPPAN
                  </span>
                  <span
                    className={`font-serif text-xs sm:text-sm font-semibold pl-1.5 border-l transition-colors duration-300 ${isDarkBg ? 'text-[#DFC27D] border-white/20' : 'text-[#87692A] border-[#C5A059]/40'
                      }`}
                  >
                    53
                  </span>
                </div>
                <span
                  className={`text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.45em] font-medium transition-colors duration-300 ${isDarkBg ? 'text-white/70' : 'text-[#737380]'
                    }`}
                >
                  Haute Parfumerie • Kuwait
                </span>
              </div>
            </a>

            {/* Right: VIP Concierge Enquiry, Cart Button & Mobile Toggle */}
            <div className="flex items-center gap-4 sm:gap-6 pr-1 sm:pr-2 lg:pr-3">
              {/* VIP Enquire Button */}
              <button
                type="button"
                onClick={openWhatsApp}
                className={`inline-flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 text-[11px] sm:text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all duration-300 rounded-xs shadow-sm group flex-shrink-0 cursor-pointer ${isDarkBg
                  ? 'bg-white/15 text-white hover:bg-[#DFC27D] hover:text-[#141416] border border-white/20 hover:border-transparent'
                  : 'bg-[#141416] text-[#FAF9F6] hover:bg-[#87692A]'
                  }`}
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
                className={`relative bg-transparent border-0 shadow-none outline-none p-1 sm:p-1.5 flex items-center justify-center cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95 flex-shrink-0 ${isDarkBg
                  ? 'text-white'
                  : 'text-neutral-900'
                  }`}
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
                {totalItems > 0 && (
                  <span
                    key={totalItems}
                    className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#6B1724] text-white text-[10px] font-semibold rounded-full flex items-center justify-center leading-none shadow-sm transition-transform duration-300 scale-100 animate-in zoom-in-75 pointer-events-none"
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 transition-colors cursor-pointer ${isDarkBg ? 'text-white hover:text-[#DFC27D]' : 'text-[#141416] hover:text-[#C5A059]'
                  }`}
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden backdrop-blur-xl border-b px-6 py-6 space-y-4 shadow-2xl animate-fadeIn ${isDarkBg
              ? 'bg-[#121214]/95 border-white/10 text-white'
              : 'bg-white/95 border-black/5 text-[#141416]'
              }`}
          >
            <div className="flex flex-col space-y-3 text-xs tracking-[0.22em] uppercase font-sans font-semibold">
              <a
                href="/collections"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate('/collections');
                }}
                className={`py-2 border-b transition-colors ${isDarkBg
                  ? 'border-white/10 hover:text-[#DFC27D]'
                  : 'border-[#EBE8DF] hover:text-[#87692A]'
                  }`}
              >
                Collection
              </a>
              <a
                href="#jazeera"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b transition-colors flex items-center justify-between ${isDarkBg
                  ? 'border-white/10 hover:text-[#DFC27D]'
                  : 'border-[#EBE8DF] hover:text-[#87692A]'
                  }`}
              >
                <span>Jazeera Airways Edition</span>
                <span
                  className={`w-2 h-2 rounded-full ${isDarkBg ? 'bg-[#DFC27D]' : 'bg-[#6A0D18]'
                    }`}
                ></span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className={`py-2 border-b transition-colors flex items-center justify-between text-left cursor-pointer ${isDarkBg
                  ? 'border-white/10 hover:text-[#DFC27D]'
                  : 'border-[#EBE8DF] hover:text-[#87692A]'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shopping Bag</span>
                </span>
                {totalItems > 0 && (
                  <span className="min-w-[17px] h-[17px] px-1 rounded-full bg-[#6B1724] text-white text-[10px] font-semibold flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Synchronized Slide-over Luxury Cart Drawer */}
      <CartDrawer />
    </>
  );
};

export default Navbar;

