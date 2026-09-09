import React, { useEffect, useRef, useCallback } from 'react';
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
    name: 'AQUA DE',
    concentration: 'Aqua Parfum by Treppan',
    accords: 'Deep Aquatic • Clean Citrus • Pure Mineral',
    tagline: 'Own the freshness. Feel the power.',
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
  const ambientHaloRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  // Compute card opacity and Y translation for each bottle chapter (100% crisp, zero blur)
  const computeCardState = useCallback((p: number, index: number) => {
    let opacity = 0;
    let translateY = 20;

    if (index === 0) {
      // Chapter 1 (0% to 33%)
      if (p <= 0.08) {
        const t = clamp01(p / 0.08);
        opacity = t;
        translateY = lerp(20, 0, t);
      } else if (p <= 0.22) {
        opacity = 1;
        translateY = 0;
      } else if (p <= 0.32) {
        const t = clamp01((p - 0.22) / 0.10);
        opacity = 1 - t;
        translateY = lerp(0, -20, t);
      }
    } else if (index === 1) {
      // Chapter 2 (33% to 66%)
      if (p >= 0.30 && p <= 0.42) {
        const t = clamp01((p - 0.30) / 0.12);
        opacity = t;
        translateY = lerp(20, 0, t);
      } else if (p > 0.42 && p <= 0.56) {
        opacity = 1;
        translateY = 0;
      } else if (p > 0.56 && p <= 0.67) {
        const t = clamp01((p - 0.56) / 0.11);
        opacity = 1 - t;
        translateY = lerp(0, -20, t);
      }
    } else if (index === 2) {
      // Chapter 3 (66% to 100%)
      if (p >= 0.64 && p <= 0.76) {
        const t = clamp01((p - 0.64) / 0.12);
        opacity = t;
        translateY = lerp(20, 0, t);
      } else if (p > 0.76 && p <= 0.92) {
        opacity = 1;
        translateY = 0;
      } else if (p > 0.92) {
        // Cleanly fade out Chapter 3 card from 92% to 100% into Maison showcase section
        const t = clamp01((p - 0.92) / 0.08);
        opacity = lerp(1, 0, t);
        translateY = lerp(0, -24, t);
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

      // Update Floating Editorial Story Cards directly (100% crisp, zero blur)
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const { opacity, translateY } = computeCardState(lerpedProgress, idx);
        cardEl.style.opacity = String(opacity);
        cardEl.style.transform = `translateY(${translateY}px)`;
        cardEl.style.filter = 'none';
        cardEl.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
      });

      // Cleanly fade out 3D canvas into next section between 94% and 100%
      if (canvasWrapperRef.current) {
        if (lerpedProgress > 0.94) {
          const tFade = clamp01((lerpedProgress - 0.94) / 0.06);
          canvasWrapperRef.current.style.opacity = String(lerp(1, 0, tFade));
          canvasWrapperRef.current.style.transform = `scale(${lerp(1, 0.96, tFade)}) translateY(${lerp(0, -20, tFade)}px)`;
        } else {
          canvasWrapperRef.current.style.opacity = '1';
          canvasWrapperRef.current.style.transform = 'scale(1) translateY(0px)';
        }
      }

      // Update active chapter state for ambient color
      let activeChap = 0;
      if (lerpedProgress >= 0.66) activeChap = 2;
      else if (lerpedProgress >= 0.33) activeChap = 1;

      if (activeChap !== lastChapter) {
        lastChapter = activeChap;
      }

      // Update ambient halo background glow color
      if (ambientHaloRef.current) {
        const colors = [
          'rgba(223, 194, 125, 0.18)', // ONLY YOU (warm gold)
          'rgba(56, 130, 214, 0.20)',  // AQUA DE (sapphire oceanic)
          'rgba(197, 160, 89, 0.22)'   // BLVGARI AQUA (champagne amber)
        ];
        ambientHaloRef.current.style.background = `radial-gradient(ellipse at 50% 50%, ${colors[activeChap]} 0%, transparent 68%)`;
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
      className="relative w-full h-[380vh] bg-[#09090B] text-white select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Viewport Pinned / Sticky Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* 1. Dynamic Luxury Ambient Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            ref={ambientHaloRef}
            className="absolute inset-0 transition-all duration-1000 opacity-90"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(223, 194, 125, 0.18) 0%, transparent 68%)'
            }}
          />
          {/* Subtle noise/grid texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
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

        {/* 3. Compact Synchronized Floating Story Cards (Minimal, Crisp, Zero Blur) */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {CHAPTERS.map((chap, idx) => (
            <div
              key={chap.id}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className={`absolute w-[90vw] sm:w-[380px] lg:w-[430px] p-7 sm:p-8 rounded-2xl bg-[#121214]/95 border border-[#C5A059]/30 shadow-[0_15px_40px_rgba(0,0,0,0.7)] select-none pointer-events-none transition-colors duration-500 ${
                chap.side === 'left'
                  ? 'left-4 sm:left-8 lg:left-12 xl:left-16 bottom-14 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2'
                  : 'right-4 sm:right-8 lg:right-12 xl:right-16 bottom-14 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2'
              }`}
              style={{
                opacity: idx === 0 ? 1 : 0,
                transform: 'translateY(20px)',
                filter: 'none'
              }}
            >
              {/* Bottle Number & Name */}
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.16em] text-white uppercase leading-snug mb-2">
                <span style={{ color: chap.accentColor }}>{chap.bottleNumber}</span>
                <span className="text-white/30 mx-2 font-light">/</span>
                <span>{chap.name}</span>
              </h3>

              {/* Concentration line */}
              <p className="text-sm sm:text-base font-sans tracking-[0.18em] uppercase text-[#DFC27D] font-medium mb-4">
                {chap.concentration}
              </p>

              {/* Minimal Accent Divider with generous breathing room */}
              <div className="w-10 h-[1px] bg-white/15 my-4" />

              {/* 3-Word Accord */}
              <p className="text-base sm:text-lg font-serif tracking-wider text-neutral-200 font-medium mb-2">
                {chap.accords}
              </p>

              {/* Short Single-Sentence Tagline */}
              <p className="text-base sm:text-lg font-serif italic text-neutral-400 font-light leading-relaxed">
                "{chap.tagline}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EditorialBottleScroll;
