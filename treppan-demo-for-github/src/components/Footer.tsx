import React from 'react';
import { MapPin, ShieldCheck, Plane } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="theme-bg-secondary theme-text-primary border-t theme-border pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b theme-border">
          
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/treppan_official_logo.png"
                alt="Treppan Fragrance Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-serif text-xl font-bold tracking-[0.25em] theme-text-primary uppercase">
                    TREPPAN
                  </span>
                  <span className="font-serif text-sm font-semibold text-[#87692A] border-l border-[#C5A059]/40 pl-1.5">
                    53
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-[0.4em] theme-text-muted font-medium">
                  The Royal Kuwaiti House of Fragrance
                </p>
              </div>
            </div>

            <p className="text-xs theme-text-secondary leading-relaxed font-light max-w-sm">
              Pioneers of 100% alcohol-free Aqua Parfums, pure vintage Dehenal Oud, and authentic Himalayan Kasturi attars. Crafted in the State of Kuwait for royalty and connoisseurs.
            </p>

            <div className="pt-2 flex items-center space-x-4 text-xs font-serif uppercase tracking-wider font-semibold text-[#87692A]">
              <div className="flex items-center space-x-1.5">
                <Plane className="w-3.5 h-3.5 text-[#87692A]" />
                <span>Jazeera Airways In-Flight</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#87692A]" />
                <span>0.0% Alcohol</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.2em] theme-text-primary">
              Collections
            </h4>
            <ul className="space-y-2 text-xs theme-text-secondary font-sans">
              <li>
                <a href="#collection" className="hover:text-[#87692A] transition-colors">
                  Aqua Parfums (Alcohol-Free)
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#87692A] transition-colors">
                  Pure Dehenal Oud Oils
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#87692A] transition-colors">
                  Himalayan Kasturi Musk
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#87692A] transition-colors">
                  Royal Presentation Coffrets
                </a>
              </li>
              <li>
                <a href="#jazeera" className="hover:text-[#87692A] transition-colors flex items-center space-x-1">
                  <span>Jazeera Airways Editions</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Olfactory Heritage */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.2em] theme-text-primary">
              Haute Maison
            </h4>
            <ul className="space-y-2 text-xs theme-text-secondary font-sans">
              <li>
                <a href="#jazeera" className="hover:text-[#87692A] transition-colors">
                  The Royal Flight Story
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: VIP Concierge & Kuwait Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.2em] theme-text-primary">
              Private Concierge
            </h4>
            <div className="space-y-2.5 text-xs theme-text-secondary font-sans">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#87692A] mt-0.5 flex-shrink-0" />
                <span>Kuwait City, State of Kuwait</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-3.5 h-3.5 text-[#87692A] fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <a
                  href="https://www.instagram.com/treppan_fragrance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#87692A] transition-colors"
                >
                  @treppan_fragrance
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-3.5 h-3.5 text-[#87692A] fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.44 0-2.84-.37-4.08-1.09l-.29-.17-3.04.8.81-2.96-.19-.3c-.78-1.26-1.2-2.73-1.2-4.51 0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                </svg>
                <a
                  href="https://wa.me/96599995353"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#87692A] transition-colors"
                >
                  WhatsApp VIP Hotline
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] theme-text-muted font-sans gap-4">
          <p>
            © {new Date().getFullYear()} Treppan Fragrance (Treppan 53). All rights reserved. The Royal Kuwaiti House of Fragrance.
          </p>
          <div className="flex items-center space-x-6">
            <span className="hover:theme-text-primary cursor-pointer">Bespoke Inquiries</span>
            <span className="hover:theme-text-primary cursor-pointer">Aviation Allocations</span>
            <span className="text-[#87692A] font-serif uppercase tracking-widest font-semibold">
              Kuwait • GCC • Global
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
