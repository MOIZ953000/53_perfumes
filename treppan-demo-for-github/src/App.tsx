import React, { useState } from 'react';
import { TopAnnouncement } from './components/TopAnnouncement';
import { Navbar } from './components/Navbar';
import { LuxuryBotanicalScroll } from './components/LuxuryBotanicalScroll';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { JazeeraHeritage } from './components/JazeeraHeritage';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FragranceProduct } from './types/fragrance';

const MainApp: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<FragranceProduct | null>(null);

  const handleOpenEnquiry = () => {
    const text = encodeURIComponent("Hello Treppan Fragrance, I would like to enquire about your royal creations.");
    window.open(`https://wa.me/96599995353?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary flex flex-col">
      {/* 1. Top Announcement Bar */}
      <TopAnnouncement />

      {/* 2. Glassmorphic Navigation */}
      <Navbar onOpenEnquiry={handleOpenEnquiry} />

      {/* Main Experience Body */}
      <main className="flex-1">
        {/* 3. The Signature Luxury Botanical Scroll Stage */}
        <LuxuryBotanicalScroll onSelectProduct={(p) => setSelectedProduct(p)} />

        {/* 4. Catchy Luxury Hero Banner (Seamless Full-Bleed Stage) */}
        <HeroSection onSelectProduct={(p) => setSelectedProduct(p)} />

        {/* 5. Filterable Haute Parfumerie Catalog (Zero Pricing) */}
        <ProductCatalog onSelectProduct={(p) => setSelectedProduct(p)} />

        {/* 6. Jazeera Airways In-Flight Heritage & Aviation Editorial */}
        <JazeeraHeritage />

        {/* 9. Stay in the Collection (Newsletter) */}
        <NewsletterSection />
      </main>

      {/* 10. Grand Imperial Footer */}
      <Footer />

      {/* 11. Deep-Dive Olfactory Pyramid Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return <MainApp />;
};

export default App;
