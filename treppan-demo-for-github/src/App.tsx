import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { OpeningHero } from './components/OpeningHero';
import { EditorialBottleScroll } from './components/EditorialBottleScroll';
import { ProductCatalog } from './components/ProductCatalog';
import { FullCollectionsPage } from './components/FullCollectionsPage';
import { ProductDetail } from './components/ProductDetail';
import { JazeeraHeritage } from './components/JazeeraHeritage';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FragranceProduct } from './types/fragrance';
import { CartProvider } from './context/CartContext';
import { navigate, setRouterNavigate } from './utils/navigation';
import { ErrorPage } from './pages/ErrorPage';
import { ErrorBoundary } from './components/ErrorBoundary';

const NavigationBridge: React.FC = () => {
  const routerNav = useNavigate();
  useEffect(() => {
    setRouterNavigate((to, opts) => {
      routerNav(to, opts);
    });
    return () => {
      setRouterNavigate(null);
    };
  }, [routerNav]);
  return null;
};

const MainApp: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<FragranceProduct | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'collections' | 'product'>('home');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const location = useLocation();

  const scrollToSection4 = () => {
    const tryScroll = (attempts = 0) => {
      const section4 = document.getElementById('collections') || document.getElementById('collection');
      if (section4) {
        const navHeight = 80;
        const rect = section4.getBoundingClientRect();
        const targetY = window.pageYOffset + rect.top - navHeight;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });
      } else if (attempts < 25) {
        setTimeout(() => tryScroll(attempts + 1), 60);
      }
    };

    requestAnimationFrame(() => {
      setTimeout(() => tryScroll(0), 50);
    });
  };

  const handleRouteSync = useCallback(() => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    const state = window.history.state;

    // Detect /product/:id or #product/:id or #/product/:id
    const hashProductMatch = hash.match(/^#\/?product\/([^/?#]+)/);
    const pathProductMatch = path.match(/^\/product\/([^/?#]+)/);

    if (hashProductMatch) {
      setActiveProductId(hashProductMatch[1]);
      setCurrentView('product');
    } else if (pathProductMatch) {
      setActiveProductId(pathProductMatch[1]);
      setCurrentView('product');
    } else if (path === '/collections' || path.endsWith('/collections') || hash === '#/collections') {
      setCurrentView('collections');
      setActiveProductId(null);
    } else {
      setCurrentView('home');
      setActiveProductId(null);

      // Smooth-scroll down to Section 4 without stopping at the top hero section
      if (hash === '#collections' || hash === '#collection' || state?.scrollTo === 'collections') {
        scrollToSection4();
      }
    }
  }, []);

  useEffect(() => {
    handleRouteSync();
    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, [handleRouteSync, location]);

  const navigateToProduct = (productOrId: FragranceProduct | string) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
    navigate(`/product/${id}`);
    setActiveProductId(id);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCollections = () => {
    navigate('/collections');
    setCurrentView('collections');
    setActiveProductId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToHome = () => {
    navigate('/#collections', { state: { scrollTo: 'collections' } });
  };

  const handleOpenEnquiry = () => {
    const text = encodeURIComponent("Hello Treppan Fragrance, I would like to enquire about your royal creations.");
    window.open(`https://wa.me/96599995353?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary flex flex-col">
      {currentView === 'home' && (
        <>
          {/* Glassmorphic Navigation */}
          <Navbar onOpenEnquiry={handleOpenEnquiry} />

          {/* Main Experience Body */}
          <main className="flex-1">
            {/* Section 1 (Top Opening): Smooth Flowing Botanical Flower Video - UNTOUCHED */}
            <OpeningHero />

            {/* Section 2 (Scroll Showcase): 3D Bottle Scroll Animation - UNTOUCHED */}
            <EditorialBottleScroll onSelectProduct={(p) => setSelectedProduct(p)} />

            {/* Section 4: Collections Catalog (Redesigned Haute Showcase with Hover Flip Grid) */}
            <ProductCatalog
              onSelectProduct={(p) => navigateToProduct(p)}
              onExploreFullCollection={navigateToCollections}
            />

            {/* Section 5: Jazeera Airways In-Flight Heritage & Aviation Editorial */}
            <JazeeraHeritage onSelectProduct={(id) => navigateToProduct(id)} />

            {/* Section 6: Stay in the Collection (Newsletter) */}
            <NewsletterSection />
          </main>
        </>
      )}

      {currentView === 'collections' && (
        /* Dedicated Full Collections Page View */
        <FullCollectionsPage
          onBackToHome={navigateToHome}
          onSelectProduct={(p) => navigateToProduct(p)}
        />
      )}

      {currentView === 'product' && (
        /* Dedicated Product Detail Page View */
        <>
          <Navbar onOpenEnquiry={handleOpenEnquiry} />
          <main className="flex-1">
            <ProductDetail
              productId={activeProductId}
              onReturnToCollections={navigateToCollections}
              onSelectProduct={(p) => navigateToProduct(p)}
            />
          </main>
        </>
      )}

      {/* Grand Imperial Footer */}
      <Footer />

      {/* Deep-Dive Olfactory Pyramid Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <CartProvider>
        <BrowserRouter>
          <NavigationBridge />
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/collections" element={<MainApp />} />
            <Route path="/product/:id" element={<MainApp />} />
            <Route path="/404" element={<ErrorPage code={404} />} />
            <Route path="/403" element={<ErrorPage code={403} />} />
            <Route path="/500" element={<ErrorPage code={500} />} />
            <Route path="/503" element={<ErrorPage code={503} />} />
            <Route path="*" element={<ErrorPage code={404} />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ErrorBoundary>
  );
};

export default App;
