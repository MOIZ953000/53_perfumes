import React, { useEffect, useRef, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { FragranceProduct } from '../types/fragrance';
import { ThreeBottleCanvas } from './ThreeBottleCanvas';
import { BottleSceneController } from '../types/threeScene';

interface EditorialBottleScrollProps {
  onSelectProduct?: (product: FragranceProduct) => void;
}

interface FlaconChapter {
  id: string;
  bottleNumber: string;
  name: string;
  concentration: string;
  accords: string;
  tagline: string;
  accentColor: string;
  side: 'left' | 'right';
}

const CHAPTERS: FlaconChapter[] = [
  {
    id: 'chap-only-you',
    bottleNumber: '01',
    name: 'ONLY YOU',
    concentration: 'Aqua Parfum by Treppan 53',
    accords: 'Fresh • Bold • Unforgettable',
    tagline: 'For the one who leaves a lasting impression.',
    accentColor: '#DFC27D',
    side: 'left'
  },
  {
    id: 'chap-aqua-de',
    bottleNumber: '02',
    name: 'GLORIOUS',
    concentration: 'AQUA PARFUM BY TREPPAN',
    accords: 'BERGAMOT • SAGE • VETIVER • CEDARWOOD',
    tagline: 'A MAJESTIC FUSION OF CRISP BERGAMOT, AROMATIC SAGE, AND TIMELESS CEDARWOOD.',
    accentColor: '#60A5FA',
    side: 'right'
  },
  {
    id: 'chap-blvgari-aqua',
    bottleNumber: '03',
    name: 'BLVGARI AQUA',
    concentration: 'Aqua Parfum • Best Seller',
    accords: 'Oceanic Woods • Mandarin • Crisp Amber',
    tagline: 'Pure marine freshness handcrafted in Kuwait.',
    accentColor: '#C5A059',
    side: 'left'
  }
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const EditorialBottleScroll: React.FC<EditorialBottleScrollProps> = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const threeControllerRef = useRef<BottleSceneController | null>(null);

  // Card DOM element references for direct 60-120fps styling without React re-rendering overhead
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introHeadlineRef = useRef<HTMLDivElement | null>(null);
  const ambientHaloRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const transitionBarRef = useRef<HTMLDivElement | null>(null);

  // Compute card opacity and Y translation for each bottle chapter (100% crisp, zero blur)
  const computeCardState = useCallback((p: number, index: number) => {
    let opacity = 0;
    let translateY = 20;

    if (index === 0) {
      // Chapter 1 - ONLY YOU
      // Hands over smoothly as the introductory headline dissolves around 0.18-0.20
      if (p < 0.18) {
        opacity = 0;
        translateY = 20;
      } else if (p <= 0.26) {
        const t = clamp01((p - 0.18) / 0.08);
        opacity = t;
        translateY = lerp(20, 0, t);
      } else if (p <= 0.34) {
        // Extended settled dwell phase
        opacity = 1;
        translateY = 0;
      } else if (p <= 0.40) {
        // Smooth unhurried exit
        const t = clamp01((p - 0.34) / 0.06);
        opacity = 1 - t;
        translateY = lerp(0, -20, t);
      }
    } else if (index === 1) {
      // Chapter 2 (38% to 72%) - GLORIOUS
      // Glides in smoothly and holds center stage cleanly, shifted upward (-70px) to center with bottle
      const yOffset = -70;
      if (p < 0.38) {
        opacity = 0;
        translateY = 20 + yOffset;
      } else if (p <= 0.48) {
        const t = clamp01((p - 0.38) / 0.10);
        opacity = t;
        translateY = lerp(20 + yOffset, yOffset, t);
      } else if (p <= 0.64) {
        // Extended settled dwell phase - holds center stage cleanly
        opacity = 1;
        translateY = yOffset;
      } else if (p <= 0.72) {
        // Smooth unhurried exit
        const t = clamp01((p - 0.64) / 0.08);
        opacity = 1 - t;
        translateY = lerp(yOffset, -20 + yOffset, t);
      } else {
        opacity = 0;
        translateY = -20 + yOffset;
      }
    } else if (index === 2) {
      // Chapter 3 (68% to 100%) - BLVGARI AQUA
      // Glides into place with controlled ease, then LOCKED at opacity 1 through final scroll
      const yOffset = -100;
      if (p >= 0.68 && p <= 0.80) {
        const t = clamp01((p - 0.68) / 0.12);
        opacity = t;
        translateY = lerp(20 + yOffset, yOffset, t);
      } else if (p > 0.80) {
        // LOCKED at opacity 1 through 100% - NO FADE OUT OR SLIDE AWAY
        opacity = 1;
        translateY = yOffset;
      }
    }

    return { opacity, translateY };
  }, []);

  // Main smooth RAF lerp scroll driver (Friction factor ~0.088 for buttery velocity damping)
  useEffect(() => {
    let animationFrameId: number;
    let lerpedProgress = 0;
    const friction = 0.088;
    let lastChapter = 0;

    const getStageProgress = () => {
      if (!stageRef.current) return 0;
      const rect = stageRef.current.getBoundingClientRect();
      const total = stageRef.current.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp01(-rect.top / total);
    };

    const renderLoop = () => {
      const targetProgress = getStageProgress();

      // Smooth damping / lerping on scroll velocity
      lerpedProgress += (targetProgress - lerpedProgress) * friction;

      // Bind to Three.js 3D viewport
      if (threeControllerRef.current?.setScrollProgress) {
        threeControllerRef.current.setScrollProgress(lerpedProgress);
      }

      // Update Introductory Scroll-Linked Headline (0% -> 15% fade & translate -30px, >15% hidden)
      if (introHeadlineRef.current) {
        let headlineOpacity = 1;
        let headlineTranslateY = 0;

        if (lerpedProgress <= 0.02) {
          headlineOpacity = 1;
          headlineTranslateY = 0;
        } else if (lerpedProgress <= 0.15) {
          const t = clamp01((lerpedProgress - 0.02) / 0.13);
          headlineOpacity = 1 - t;
          headlineTranslateY = lerp(0, -30, t);
        } else {
          headlineOpacity = 0;
          headlineTranslateY = -30;
        }

        introHeadlineRef.current.style.opacity = String(headlineOpacity);
        introHeadlineRef.current.style.transform = `translateY(${headlineTranslateY}px)`;
        introHeadlineRef.current.style.visibility = headlineOpacity <= 0 ? 'hidden' : 'visible';
        introHeadlineRef.current.style.pointerEvents = 'none';
      }

      // Update Floating Editorial Story Cards directly (100% crisp, zero blur)
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const { opacity, translateY } = computeCardState(lerpedProgress, idx);
        cardEl.style.opacity = String(opacity);
        cardEl.style.transform = `translateY(${translateY}px)`;
        cardEl.style.filter = 'none';
        cardEl.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
      });

      // Keep 3D canvas locked at full opacity and scale through the final frame (no blank gap into Section 3)
      if (canvasWrapperRef.current) {
        canvasWrapperRef.current.style.opacity = '1';
        canvasWrapperRef.current.style.transform = 'scale(1) translateY(0px)';
      }

      // Update Bottom Transition Divider Bar (Appears cleanly as 3rd bottle settles: ~0.80 -> 0.90)
      if (transitionBarRef.current) {
        let barOpacity = 0;
        let barTranslateY = 16;

        if (lerpedProgress <= 0.80) {
          barOpacity = 0;
          barTranslateY = 16;
        } else if (lerpedProgress <= 0.90) {
          const t = clamp01((lerpedProgress - 0.80) / 0.10);
          barOpacity = t;
          barTranslateY = lerp(16, 0, t);
        } else {
          barOpacity = 1;
          barTranslateY = 0;
        }

        transitionBarRef.current.style.opacity = String(barOpacity);
        transitionBarRef.current.style.transform = `translateY(${barTranslateY}px)`;
        transitionBarRef.current.style.visibility = barOpacity <= 0 ? 'hidden' : 'visible';
        transitionBarRef.current.style.pointerEvents = barOpacity > 0.4 ? 'auto' : 'none';
      }

      // Update active chapter state for ambient color
      let activeChap = 0;
      if (lerpedProgress >= 0.68) activeChap = 2;
      else if (lerpedProgress >= 0.34) activeChap = 1;

      if (activeChap !== lastChapter) {
        lastChapter = activeChap;
      }

      // Update ambient halo background glow color on cream canvas
      if (ambientHaloRef.current) {
        const colors = [
          'rgba(223, 194, 125, 0.12)', // ONLY YOU (warm champagne)
          'rgba(96, 165, 250, 0.08)',  // AQUA DE (sapphire oceanic tint)
          'rgba(197, 160, 89, 0.12)'   // BLVGARI AQUA (warm amber gold)
        ];
        ambientHaloRef.current.style.background = `radial-gradient(ellipse at 50% 50%, ${colors[activeChap]} 0%, transparent 65%)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [computeCardState]);

  return (
    <section
      ref={stageRef}
      id="editorial-scroll-stage"
      className="relative w-full h-[500vh] bg-[#FAF8F5] text-neutral-900 select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Viewport Pinned / Sticky Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* 1. Dynamic Luxury Ambient Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-[#FAF8F5]">
          <div
            ref={ambientHaloRef}
            className="absolute inset-0 transition-all duration-1000 opacity-60"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(223, 194, 125, 0.12) 0%, transparent 65%)'
            }}
          />
          {/* Subtle warm gold grid texture */}
          <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#b8860b_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* 2. The Pinned Three.js 3D Viewport Canvas */}
        <div
          ref={canvasWrapperRef}
          className="absolute inset-0 z-10 flex items-center justify-center transition-transform duration-75"
        >
          <ThreeBottleCanvas
            ref={threeControllerRef}
            mode="scroll"
            className="w-full h-full"
            autoRotate={false}
            interactive={true}
            showControlsOverlay={false}
          />
        </div>

        {/* 3. Introductory Scroll-Linked Headline Overlay (0% to 15%) */}
        <div
          ref={introHeadlineRef}
          className="absolute inset-0 z-30 pointer-events-none will-change-transform pt-28 md:pt-36"
          style={{
            opacity: 1,
            transform: 'translateY(0px)'
          }}
        >
          {/* Top Tag: Positioned upward near top boundary (left-aligned with container grid) */}
          <div className="absolute top-6 sm:top-7 md:top-8 left-6 sm:left-10 md:left-14 lg:left-20 xl:left-24 flex items-center gap-2 sm:gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] flex-shrink-0" />
            <span className="text-xs tracking-[0.25em] font-medium text-neutral-600 uppercase font-sans">
              TREPPAN • KUWAIT • EST. 53 • <span className="font-arabic text-sm sm:text-base normal-case tracking-wide">عِطْرٌ وُلِدَ مِنَ المَاءِ</span>
            </span>
          </div>

          {/* Main Headline: Centered directly above the bottle with generous vertical clearance */}
          <div className="flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-center max-w-5xl mx-auto space-y-1 sm:space-y-2 overflow-visible">
              <span className="block font-serif font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#0E1E38] leading-[1.05] uppercase">
                BORN FROM WATER.
              </span>
              <span className="block font-serif italic font-normal text-[#C5A059] text-4xl sm:text-5xl md:text-6xl leading-[1.05] pr-3 overflow-visible">
                <span className="inline-block pr-2">MADE TO</span>{' '}
                <span className="inline-block">LINGER.</span>
              </span>
            </h2>
          </div>
        </div>

        {/* 4. Synchronized Floating Story Cards (Luxury Glassmorphism on Signature Cream) */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {CHAPTERS.map((chap, idx) => {
            const isProduct2 = idx === 1;
            const isProduct3 = idx === 2;
            return (
              <div
                key={chap.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className={`absolute w-[90vw] sm:w-[380px] lg:w-[430px] p-6 sm:p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-[#D4AF37]/25 shadow-[0_12px_32px_rgba(0,0,0,0.06)] select-none pointer-events-none transition-colors duration-500 ${chap.side === 'left'
                    ? `left-4 sm:left-8 lg:left-12 xl:left-16 ${isProduct3 ? 'bottom-28' : 'bottom-14'} sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2`
                    : `right-4 sm:right-8 lg:right-12 xl:right-16 ${isProduct2 ? 'bottom-28' : 'bottom-14'} sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2`
                  }`}
                style={{
                  opacity: 0,
                  transform: isProduct3 ? 'translateY(-100px)' : isProduct2 ? 'translateY(-50px)' : 'translateY(20px)',
                  filter: 'none'
                }}
              >
                {/* Bottle Number & Name */}
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.16em] text-neutral-900 uppercase leading-snug mb-2">
                  <span className="text-[#B8860B]">{chap.bottleNumber}</span>
                  <span className="text-neutral-300 mx-2 font-light">/</span>
                  <span>{chap.name}</span>
                </h3>

                {/* Sub-badge / Concentration line */}
                <p className="text-xs font-sans tracking-[0.2em] uppercase text-[#B8860B] font-semibold mb-4">
                  {chap.concentration}
                </p>

                {/* Minimal Accent Divider with generous breathing room */}
                <div className="w-10 h-[1px] bg-[#B8860B]/25 my-4" />

                {/* 3-Word Accord */}
                <p className="text-base sm:text-lg font-serif tracking-wider text-neutral-800 font-medium mb-2">
                  {chap.accords}
                </p>

                {/* Short Single-Sentence Tagline */}
                <p className="text-base sm:text-lg font-serif italic text-neutral-600 font-light leading-relaxed">
                  "{chap.tagline}"
                </p>
              </div>
            );
          })}
        </div>

        {/* 5. Architectural Transition Footer Divider Bar (End of Section 2 -> Section 4 Collections) */}
        <div
          ref={transitionBarRef}
          className="absolute bottom-0 left-0 right-0 z-30 w-full border-t border-[#E8E4DC] bg-[#FAF8F5] will-change-transform"
          style={{
            opacity: 0,
            transform: 'translateY(16px)',
            visibility: 'hidden',
            pointerEvents: 'none'
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('collection') || document.getElementById('collections');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center space-x-1.5 text-[10px] tracking-[0.25em] uppercase font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer group"
            >
              <span>Explore Collection</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-900 transition-transform group-hover:translate-y-0.5 duration-200" />
            </a>
            <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-neutral-500">
              WATER-BORN LUXURY • ALCOHOL-FREE
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EditorialBottleScroll;
