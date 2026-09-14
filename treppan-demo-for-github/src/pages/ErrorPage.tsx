import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigate as appNavigate } from '../utils/navigation';

export type ErrorStatusCode = 404 | 403 | 500 | 503;

interface ErrorPageProps {
  code?: ErrorStatusCode | number;
}

interface ErrorConfig {
  badge: string;
  codeStr: string;
  heading: string;
  subtitle: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ code = 404 }) => {
  let routerNavigate: ReturnType<typeof useNavigate> | null = null;
  try {
    // Attempt to use react-router navigate if within Router context
    routerNavigate = useNavigate();
  } catch {
    routerNavigate = null;
  }

  const handleGoHome = () => {
    if (routerNavigate) {
      routerNavigate('/');
    } else {
      appNavigate('/');
    }
  };

  const handleGoCollections = () => {
    if (routerNavigate) {
      routerNavigate('/collections');
    } else {
      appNavigate('/collections');
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  // Determine configuration based on error code
  const configs: Record<ErrorStatusCode, ErrorConfig> = {
    404: {
      badge: '• OLFACTORY SANCTUARY •',
      codeStr: '404',
      heading: 'ESSENCE NOT FOUND',
      subtitle: '“The page or creation you seek has evaporated into the ether, leaving only memory behind.”',
      primaryAction: {
        label: 'RETURN TO THE MAISON',
        onClick: handleGoHome,
      },
      secondaryAction: {
        label: 'EXPLORE HAUTE COLLECTIONS →',
        onClick: handleGoCollections,
      },
    },
    403: {
      badge: '• PRIVATE SANCTUM •',
      codeStr: '403',
      heading: 'ACCESS RESTRICTED',
      subtitle: '“This alcove is reserved exclusively for the royal treasury and private concierge members.”',
      primaryAction: {
        label: 'RETURN TO SAFETY',
        onClick: handleGoHome,
      },
    },
    500: {
      badge: '• DISTILLATION INTERRUPTED •',
      codeStr: '500',
      heading: 'TEMPORARY COMPOSITION DISRUPTION',
      subtitle: '“Our master perfumers are currently recalibrating the formulation. Please refresh momentarily.”',
      primaryAction: {
        label: 'RELOAD EXPERIENCE',
        onClick: handleReload,
      },
      secondaryAction: {
        label: 'RETURN HOME',
        onClick: handleGoHome,
      },
    },
    503: {
      badge: '• PRIVATE BLEND IN PROGRESS •',
      codeStr: '503',
      heading: 'MAISON UNDER CURATION',
      subtitle: '“Our royal boutique is undergoing brief private maintenance to prepare upcoming vintage editions.”',
      primaryAction: {
        label: 'REFRESH STATUS',
        onClick: handleReload,
      },
    },
  };

  const normalizedCode: ErrorStatusCode =
    code === 403 || code === 500 || code === 503 ? code : 404;

  const currentConfig = configs[normalizedCode];

  return (
    <div className="relative h-screen h-[100dvh] max-h-screen overflow-hidden w-full bg-[#FAF8F5] text-[#0E1E38] flex flex-col justify-between items-center py-6 sm:py-8 px-4 selection:bg-[#6A0D18] selection:text-[#FAF8F5]">
      {/* Ambient Luxury Glow Effects */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[120px] opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.18) 0%, rgba(250, 248, 245, 0) 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-10 w-[450px] h-[450px] rounded-full blur-[100px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(14, 30, 56, 0.08) 0%, rgba(250, 248, 245, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Top Brand Bar: Official Crest & Title */}
      <header className="relative z-10 flex flex-col items-center text-center">
        <button
          onClick={handleGoHome}
          className="group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
          aria-label="Treppan Haute Parfumerie Home"
        >
          <img
            src="/assets/treppan_official_logo.png"
            alt="Treppan Royal Crest"
            className="h-11 sm:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(197,160,89,0.2)]"
          />
          <div className="mt-1.5 sm:mt-2 flex items-center space-x-2">
            <span className="font-serif text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#0E1E38]">
              TREPPAN
            </span>
            <span className="text-[11px] text-[#C5A059] font-serif font-semibold tracking-widest pl-1.5 border-l border-[#C5A059]/40">
              53
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-sans font-medium tracking-[0.32em] text-[#87692A] uppercase mt-0.5 opacity-90">
            HAUTE PARFUMERIE • KUWAIT
          </span>
        </button>
      </header>

      {/* Main Luxury Frame & Content Card */}
      <main className="relative z-10 my-auto w-full max-w-xl">
        <div className="relative py-8 px-6 sm:py-10 sm:px-12 my-auto bg-[#FAF8F5]/85 backdrop-blur-md rounded-2xl border border-[#C5A059]/30 shadow-[0_20px_60px_-15px_rgba(197,160,89,0.14),0_10px_30px_-10px_rgba(14,30,56,0.05)] text-center transition-all duration-300">
          
          {/* Hairline Inner Framing Accents */}
          <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#C5A059]/15" />
          
          {/* Decorative Corner Flourishes */}
          <div className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/50" />
          <div className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#C5A059]/50" />
          <div className="pointer-events-none absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#C5A059]/50" />
          <div className="pointer-events-none absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/50" />

          {/* Luxury Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#C5A059]/40 shadow-[0_2px_10px_rgba(197,160,89,0.12)] mb-3">
            <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.26em] text-[#87692A] uppercase">
              {currentConfig.badge}
            </span>
          </div>

          {/* Large Code with Soft Antique Gold Gradient */}
          <div className="relative my-2 sm:my-3 select-none">
            <span
              className="block font-serif text-6xl sm:text-7xl md:text-8xl font-light tracking-[0.12em] leading-none bg-gradient-to-b from-[#DFC27D] via-[#C5A059] to-[#87692A] bg-clip-text text-transparent drop-shadow-sm"
              style={{
                textShadow: '0 8px 25px rgba(197, 160, 89, 0.22)',
              }}
            >
              {currentConfig.codeStr}
            </span>
          </div>

          {/* Delicate Hairline Gold Divider with Centered Diamond */}
          <div className="flex items-center justify-center space-x-3 my-2 sm:my-2.5">
            <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
            <span className="text-[#C5A059] text-[10px] font-serif leading-none">✦</span>
            <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-[0.18em] text-[#0E1E38] uppercase mt-1 mb-2">
            {currentConfig.heading}
          </h1>

          {/* Editorial Subtitle */}
          <p className="font-cormorant italic text-[#0E1E38]/85 max-w-md mx-auto text-xs sm:text-sm my-3 sm:my-4 leading-relaxed font-medium">
            {currentConfig.subtitle}
          </p>

          {/* Interactive Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Primary Action Button */}
            <button
              onClick={currentConfig.primaryAction.onClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 rounded-none bg-[#0E1E38] text-[#FAF8F5] text-[11px] font-sans font-semibold tracking-[0.22em] uppercase transition-all duration-300 hover:bg-[#1A2E4E] hover:shadow-[0_8px_25px_rgba(14,30,56,0.25)] hover:scale-[1.02] border border-[#C5A059]/50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
            >
              <span>{currentConfig.primaryAction.label}</span>
            </button>

            {/* Secondary Action Link / Button (if present) */}
            {currentConfig.secondaryAction && (
              <button
                onClick={currentConfig.secondaryAction.onClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-none bg-transparent text-[#0E1E38] hover:text-[#87692A] text-[11px] font-sans font-semibold tracking-[0.22em] uppercase transition-all duration-300 border border-[#C5A059]/60 hover:border-[#87692A] hover:bg-[#F4F2EC]/60 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
              >
                <span>{currentConfig.secondaryAction.label}</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Pinned Footer Copyright Bar */}
      <footer className="relative z-10 text-center pb-2">
        <p className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
          TREPPAN 53 ROYAL PERFUMERY • ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export const NotFoundPage: React.FC = () => <ErrorPage code={404} />;
export const ForbiddenPage: React.FC = () => <ErrorPage code={403} />;
export const ServerErrorPage: React.FC = () => <ErrorPage code={500} />;
export const ServiceUnavailablePage: React.FC = () => <ErrorPage code={503} />;

export default ErrorPage;
