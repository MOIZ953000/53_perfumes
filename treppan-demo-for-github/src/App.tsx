import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OpeningHero } from './components/OpeningHero';
import { EditorialBottleScroll } from './components/EditorialBottleScroll';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { FullCollectionsPage } from './components/FullCollectionsPage';
import { JazeeraHeritage } from './components/JazeeraHeritage';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FragranceProduct } from './types/fragrance';

const MainApp: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<FragranceProduct | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'collections'>('home');

  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash === '#collections' || hash === '#/collections') {
        setCurrentView('collections');
      } else {
        setCurrentView('home');
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const navigateToCollections = () => {
    window.location.hash = 'collections';
    setCurrentView('collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = () => {
    const text = encodeURIComponent("Hello Treppan Fragrance, I would like to enquire about your royal creations.");
    window.open(`https://wa.me/96599995353?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary flex flex-col">
      {currentView === 'home' ? (
        <>
          {/* Glassmorphic Navigation */}
          <Navbar onOpenEnquiry={handleOpenEnquiry} />

          {/* Main Experience Body */}
          <main className="flex-1">
            {/* Section 1 (Top Opening): Smooth Flowing Botanical Flower Video */}
            <OpeningHero />

            {/* Section 2 (Scroll Showcase): 3D Bottle Scroll Animation */}
            <EditorialBottleScroll onSelectProduct={(p) => setSelectedProduct(p)} />

            {/* Section 3 (Trio Flacon Section): Original Hero/Maison showcase with the 3 bottles standing together */}
            <HeroSection onSelectProduct={(p) => setSelectedProduct(p)} />

            {/* Section 4: Collections Catalog (Homepage Simplified: First 4 products + Explore Full Collection CTA) */}
            <ProductCatalog
              onSelectProduct={(p) => setSelectedProduct(p)}
              onExploreFullCollection={navigateToCollections}
            />

            {/* Section 5: Jazeera Airways In-Flight Heritage & Aviation Editorial */}
            <JazeeraHeritage />

            {/* Section 6: Stay in the Collection (Newsletter) */}
            <NewsletterSection />
          </main>
        </>
      ) : (
        /* Dedicated Full Collections Page View */
        <FullCollectionsPage
          onBackToHome={navigateToHome}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

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

