import React from 'react';
import { Plane, Sparkles, ShieldCheck } from 'lucide-react';

export const TopAnnouncement: React.FC = () => {
  return (
    <div className="bg-[#141416] text-[#FAF9F6] text-[10px] sm:text-[11px] font-sans tracking-[0.22em] uppercase py-2.5 px-4 border-b border-[#C5A059]/30 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 text-center">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="font-medium text-[#F4F2EC]">100% Alcohol-Free Aqua Parfum</span>
        </div>
        <span className="text-[#C5A059] opacity-40 hidden sm:inline">•</span>
        <div className="hidden sm:flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="font-medium text-[#F4F2EC]">The Royal Kuwaiti House of Fragrance • Est. 53</span>
        </div>
        <span className="text-[#C5A059] opacity-40 hidden md:inline">•</span>
        <div className="hidden md:flex items-center space-x-2">
          <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[#DFC27D] font-semibold">Featured Onboard Jazeera Airways</span>
        </div>
      </div>
    </div>
  );
};
