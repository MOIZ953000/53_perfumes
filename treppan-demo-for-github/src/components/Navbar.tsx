import React, { useState, useEffect } from 'react';
import { Menu, X, MessageSquare, Plane } from 'lucide-react';

interface NavbarProps {
  onOpenEnquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Treppan Fragrance, I would like to enquire about your royal collections.");
    window.open(`https://wa.me/96599995353?text=${message}`, '_blank');
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'theme-bg-primary/95 backdrop-blur-md shadow-sm border-b theme-border'
          : 'theme-bg-primary/85 backdrop-blur-sm border-b theme-border/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.22em] uppercase font-sans font-medium theme-text-primary">
            <a href="#collection" className="hover:text-[#87692A] transition-colors relative py-1 group">
              <span>Collection</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C5A059] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#jazeera" className="hover:text-[#87692A] transition-colors relative py-1 group flex items-center space-x-1.5">
              <Plane className="w-3.5 h-3.5 text-[#87692A]" />
              <span>Jazeera Edition</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6A0D18]"></span>
            </a>
          </div>

          {/* Center: Brand Logo & Title */}
          <a href="#" className="flex items-center space-x-3 text-center group py-2">
            <img
              src="/assets/treppan_official_logo.png"
              alt="Treppan Fragrance"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.25em] theme-text-primary uppercase">
                  TREPPAN
                </span>
                <span className="font-serif text-xs sm:text-sm font-semibold text-[#87692A] border-l theme-border-gold pl-1.5">
                  53
                </span>
              </div>
              <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.45em] theme-text-muted font-medium">
                Haute Parfumerie • Kuwait
              </span>
            </div>
          </a>

          {/* Right: WhatsApp VIP Enquiry */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">

            {/* WhatsApp VIP Concierge Enquiry CTA */}
            <button
              onClick={openWhatsApp}
              className="inline-flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 bg-[#141416] text-[#FAF9F6] hover:bg-[#87692A] text-[11px] sm:text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all duration-300 rounded-xs shadow-2xs group flex-shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#DFC27D] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">VIP Enquire</span>
              <span className="sm:hidden">Enquire</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 theme-text-primary hover:text-[#C5A059] transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden theme-bg-primary border-b theme-border px-6 py-6 space-y-4 shadow-editorial animate-fadeIn">
          <div className="flex flex-col space-y-3 text-xs tracking-[0.22em] uppercase font-sans font-medium theme-text-primary">
            <a
              href="#collection"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b theme-border hover:text-[#87692A] transition-colors"
            >
              Collection
            </a>
            <a
              href="#jazeera"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b theme-border hover:text-[#87692A] transition-colors flex items-center justify-between"
            >
              <span>Jazeera Airways Edition</span>
              <span className="w-2 h-2 rounded-full bg-[#6A0D18]"></span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
