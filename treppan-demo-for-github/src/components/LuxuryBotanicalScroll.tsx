import React, { useEffect, useRef, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { FragranceProduct } from '../types/fragrance';
import { ChevronDown } from 'lucide-react';

interface LuxuryBotanicalScrollProps {
  onSelectProduct: (product: FragranceProduct) => void;
}

// Real GLB models, each rendered live via <model-viewer> and auto-spinning
// on its own vertical axis inside the orbit.
const ORBIT_BOTTLES = [
  {
    id: 'trp-fragrance-1',
    src: '/assets/treppan-fragrance-1.glb',
    title: 'Treppan Fragrance 1',
    arabic: 'رويال عود نوار ٥٣',
    category: 'Jazeera Airways Flagship Edition',
    accords: '30-Yr Assam Oud • Taif Rose • Amber',
    desc: 'Micro-emulsified spring water carrier with 24-hour velvet sillage.',
    product: PRODUCTS[0]
  },
  {
    id: 'trp-fragrance-2',
    src: '/assets/treppan-fragrance-2.glb',
    title: 'Treppan Fragrance 2',
    arabic: 'روثليس اكوا بارفان',
    category: 'Executive Power • 0.0% Alcohol',
    accords: 'Blood Orange • Tuscan Leather • Birch',
    desc: 'Intense zero-ethanol projection that commands royal presence.',
    product: PRODUCTS[1]
  },
  {
    id: 'trp-fragrance-3',
    src: '/assets/treppan-fragrance-3.glb',
    title: 'Treppan Fragrance 3',
    arabic: 'بلو دي اكوا بارفان',
    category: 'Marine Aristocracy • Pure Blue',
    accords: 'Grey Ambergris • Sea Salt • Lotus',
    desc: 'Crystalline oceanic hydration formulated for high Arabian heat.',
    product: PRODUCTS[2]
  }
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function track(p: number, stops: number[], values: number[]) {
  if (p <= stops[0]) return values[0];
  const n = stops.length;
  if (p >= stops[n - 1]) return values[n - 1];
  for (let i = 0; i < n - 1; i++) {
    if (p >= stops[i] && p <= stops[i + 1]) {
      const t = (p - stops[i]) / (stops[i + 1] - stops[i]);
      return lerp(values[i], values[i + 1], t);
    }
  }
  return values[n - 1];
}

export const LuxuryBotanicalScroll: React.FC<LuxuryBotanicalScrollProps> = ({ onSelectProduct }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<HTMLDivElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const overlayCenterRef = useRef<HTMLDivElement>(null);
  const overlayTrRef = useRef<HTMLDivElement>(null);
  const overlayBlRef = useRef<HTMLDivElement>(null);
  const overlayBrRef = useRef<HTMLDivElement>(null);

  const itemsRef = useRef<
    {
      wrap: HTMLDivElement;
      counter: HTMLDivElement;
      label: HTMLDivElement;
      offset: number;
      entry: (typeof ORBIT_BOTTLES)[0];
    }[]
  >([]);

  const [activeFocalItem, setActiveFocalItem] = useState<(typeof ORBIT_BOTTLES)[0]>(ORBIT_BOTTLES[0]);

  useEffect(() => {
    const TARGET_RADIUS = 650;
    const BASE = 800;
    const FOCAL = 50;

    let orbitProgress = 0;
    let prevScroll = 0;
    let lastTime = 0;
    let animationFrameId: number;

    const rotationEl = rotationRef.current;
    if (!rotationEl) return;

    // Clear previous dynamic items
    rotationEl.innerHTML = '';
    itemsRef.current = [];

    // Construct orbit bottle elements matching the luxury-botanical skill
    ORBIT_BOTTLES.forEach((entry, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'absolute left-1/2 top-1/2 select-none cursor-pointer';
      wrap.style.willChange = 'transform';

      const counter = document.createElement('div');
      counter.style.width = '100%';
      counter.style.height = '100%';
      counter.style.position = 'relative';

      // Real GLB bottle, auto-spinning on its own vertical axis, floating
      // with no ground shadow/pedestal.
      const model = document.createElement('model-viewer');
      model.setAttribute('src', entry.src);
      model.setAttribute('alt', entry.title);
      model.setAttribute('loading', 'eager');
      model.setAttribute('reveal', 'auto');
      model.setAttribute('auto-rotate', '');
      model.setAttribute('rotation-per-second', '35deg');
      model.setAttribute('disable-zoom', '');
      model.setAttribute('interaction-prompt', 'none');
      model.setAttribute('shadow-intensity', '0');
      model.setAttribute('exposure', '1.1');
      model.setAttribute('camera-orbit', '0deg 78deg 105%');
      model.className = 'w-full h-full pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)]';
      counter.appendChild(model);

      // Orbit label on active bottle
      const label = document.createElement('div');
      label.className =
        'absolute left-[110%] top-1/2 -translate-y-1/2 w-[320px] text-left pointer-events-none transition-opacity duration-300 hidden md:block';
      label.innerHTML = `
        <div class="bg-white/95 backdrop-blur-md p-4 rounded border border-[#C5A059]/40 shadow-xl">
          <span class="text-[9px] font-mono uppercase tracking-[0.2em] text-[#87692A] font-bold block mb-1">
            ${entry.category}
          </span>
          <h4 class="font-serif text-lg font-bold text-[#141416] leading-tight">
            ${entry.title}
          </h4>
          <p class="font-arabic text-xs text-neutral-500 mb-2">
            ${entry.arabic}
          </p>
          <p class="text-[11px] text-neutral-700 leading-relaxed font-sans mb-3">
            ${entry.desc}
          </p>
          <div class="inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider font-serif font-bold text-[#87692A]">
            <span>Click Flacon to Inspect Notes →</span>
          </div>
        </div>
      `;
      counter.appendChild(label);

      wrap.appendChild(counter);

      // Handle click to inspect
      wrap.addEventListener('click', () => {
        onSelectProduct(entry.product);
      });

      rotationEl.appendChild(wrap);

      itemsRef.current.push({
        wrap,
        counter,
        label,
        offset: (i / ORBIT_BOTTLES.length) * 100,
        entry
      });
    });

    const getStageProgress = () => {
      if (!stageRef.current) return 0;
      const rect = stageRef.current.getBoundingClientRect();
      const total = stageRef.current.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp01(-rect.top / total);
    };

    const renderFrame = (currentTime: number) => {
      const delta = lastTime ? (currentTime - lastTime) / 1000 : 0;
      lastTime = currentTime;

      const p = getStageProgress();

      // 1. Hero Chrome Opacity (fade out early 0 -> 0.08)
      const hint = track(p, [0, 0.03, 0.08], [1, 1, 0]);
      if (scrollHintRef.current) scrollHintRef.current.style.opacity = String(hint);
      if (heroLogoRef.current) heroLogoRef.current.style.opacity = String(hint);
      if (heroHeaderRef.current) heroHeaderRef.current.style.opacity = String(hint);

      // 2. Soft Radial Bloom Reveal (0 -> 55% by p=0.08, holds until scroll
      // ends) — a heavily feathered mask instead of a hard clip-path edge,
      // so it reads as a light bloom expanding rather than a geometric
      // "camera iris" cutout against the video.
      const r = track(p, [0, 0.08, 0.95, 1], [0, 58, 58, 100]);
      if (revealRef.current) {
        const maskGradient = `radial-gradient(ellipse ${r}% ${r}% at 50% 50%, black 0%, black 45%, transparent 100%)`;
        revealRef.current.style.maskImage = maskGradient;
        revealRef.current.style.webkitMaskImage = maskGradient;
      }

      // 3. Overlays Fade across scroll stops
      const oStops = [0.03, 0.08, 0.15, 0.22, 0.85, 0.95, 1];
      const op = track(p, oStops, [0, 1, 1, 0, 0, 1, 1]);
      const bl = track(p, oStops, [15, 0, 0, 15, 15, 0, 0]);
      const ty = track(p, oStops, [20, 0, 0, 20, 20, 0, 0]);

      if (overlayCenterRef.current) {
        overlayCenterRef.current.style.opacity = String(op);
        overlayCenterRef.current.style.filter = `blur(${bl}px)`;
      }

      [overlayTrRef.current, overlayBlRef.current, overlayBrRef.current].forEach((el) => {
        if (el) {
          el.style.opacity = String(op);
          el.style.filter = `blur(${bl}px)`;
          el.style.transform = `translateY(${ty}px)`;
        }
      });

      // 4. Orbit Carousel Motion System
      const stops = [0.15, 0.25, 0.85, 0.95, 1];
      const itemSize = track(p, stops, [103.5, 414, 414, 103.5, 103.5]); // +15%
      const rx = track(p, stops, [330, TARGET_RADIUS, TARGET_RADIUS, 330, 330]);
      const ry = track(p, stops, [140, TARGET_RADIUS, TARGET_RADIUS, 140, 140]);
      const rot = track(p, stops, [-15, 0, 0, -15, -15]);
      const tx = track(p, stops, [0, -(TARGET_RADIUS + 160), -(TARGET_RADIUS + 160), 0, 0]);
      const focus = track(p, stops, [0, 1, 1, 0, 0]);

      if (rotationEl) {
        rotationEl.style.transform = `rotate(${rot}deg) translateX(${tx}px)`;
      }

      // Advance carousel scrub
      const scrollDelta = p - prevScroll;
      prevScroll = p;
      let frameSpeed = 0;
      if (p > 0.15 && p < 0.88) {
        // One full revolution (100 units) across the active scroll span,
        // instead of ~1.6 rounds.
        frameSpeed = scrollDelta * 137;
      } else {
        frameSpeed = delta * 2.5; // gentle idle rotation
      }
      orbitProgress += frameSpeed;

      const frameW = rotationEl.parentElement?.clientWidth || BASE;
      const scale = frameW / BASE;
      const cx = BASE / 2;
      const cy = BASE / 2;

      let closestItem = itemsRef.current[0];
      let minDistance = 999;

      for (let i = 0; i < itemsRef.current.length; i++) {
        const it = itemsRef.current[i];
        const pos = (((orbitProgress + it.offset) % 100) + 100) % 100;

        const ang = (pos / 100) * Math.PI * 2;
        const ex = cx - rx * Math.cos(ang);
        const ey = cy + ry * Math.sin(ang);

        // Cosine falloff near focal point (50)
        let dist = Math.abs(pos - FOCAL);
        if (dist > 50) dist = 100 - dist;

        if (dist < minDistance) {
          minDistance = dist;
          closestItem = it;
        }

        let targetScale = 0.4;
        if (dist < 20) {
          const ratio = dist / 20;
          targetScale = 0.4 + ((Math.cos(ratio * Math.PI) + 1) / 2) * 0.6;
        }
        const itemScale = 1 - focus * (1 - targetScale);

        const px = (ex - cx) * scale;
        const py = (ey - cy) * scale;
        const sz = itemSize * scale;

        it.wrap.style.width = `${sz}px`;
        it.wrap.style.height = `${sz}px`;
        it.wrap.style.transform = `translate(-50%, -50%) translate(${px}px, ${py}px) scale(${itemScale})`;
        it.wrap.style.zIndex = String(Math.round(itemScale * 100));
        it.counter.style.transform = `rotate(${-rot}deg)`;
        it.label.style.opacity = dist < 8 ? String(focus) : '0';
      }

      if (closestItem && closestItem.entry) {
        setActiveFocalItem(closestItem.entry);
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onSelectProduct]);

  const scrollToMaison = () => {
    const el = document.getElementById('maison-hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={stageRef} className="relative w-full h-[450vh] bg-[#0A0A0C]">

      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden text-white flex items-center justify-center">

        {/* Background Ambient Luxury Canvas / Video Simulation */}
        <div className="absolute inset-0 z-0 bg-[#0E0E12] overflow-hidden">
          <div className="absolute inset-0 bg-radial from-[#C5A059]/15 via-[#141416]/90 to-[#0A0A0C] opacity-80" />
          <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-[#87692A]/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-[#6A0D18]/15 rounded-full blur-[140px]" />

          {/* Ambient background: real Treppan-branded botanical video. */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen pointer-events-none"
          >
            <source src="/assets/treppan_fragrance_botanical.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Chrome: Top Left Brand Logo (Fades early on scroll) */}
        <div
          ref={heroLogoRef}
          className="absolute z-10 top-8 sm:top-14 left-6 sm:left-14 flex items-center space-x-3 text-left transition-opacity pointer-events-none"
        >
          <img
            src="/assets/treppan_official_logo.png"
            alt="Treppan Fragrance"
            className="h-12 w-auto object-contain filter invert drop-shadow-md"
          />
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white uppercase">
              TREPPAN 53
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#DFC27D] font-sans">
              Haute Parfumerie • Kuwait
            </span>
          </div>
        </div>

        {/* Hero Chrome: Top Right Status */}
        <div
          ref={heroHeaderRef}
          className="absolute z-10 top-8 sm:top-14 right-6 sm:right-14 hidden sm:flex items-center space-x-2 text-right transition-opacity pointer-events-none"
        >
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-neutral-300">
            Alcohol-Free Botanical Sillage
          </span>
        </div>

        {/* Hero Chrome: Scroll Hint at Bottom Center */}
        <div
          ref={scrollHintRef}
          className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-center space-y-2 select-none pointer-events-none transition-opacity"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-serif text-[#DFC27D]">
            Scroll to enter the collection
          </span>
          <div className="w-5 h-8 rounded-full border border-[#C5A059]/40 flex items-start justify-center p-1">
            <div className="w-1.5 h-2 bg-[#C5A059] rounded-full animate-bounce" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE SIGNATURE SOFT-BLOOM REVEAL LAYER */}
        {/* ========================================================================= */}
        <div
          ref={revealRef}
          className="absolute z-20 flex items-center justify-center overflow-hidden w-[150vw] h-[150vh] -left-[25vw] -top-[25vh] -rotate-[15deg] pointer-events-none"
          style={{
            maskImage: 'radial-gradient(ellipse 0% 0% at 50% 50%, black 0%, black 45%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 0% 0% at 50% 50%, black 0%, black 45%, transparent 100%)',
            willChange: 'mask-image'
          }}
        >
          {/* Pure Alabaster / White Reveal Surface */}
          <div className="absolute inset-0 bg-[#FAF9F6]" />

          {/* Counter-rotated Inner Container that hosts the Orbit Carousel */}
          <div className="relative w-screen h-screen rotate-[15deg] flex items-center justify-center pointer-events-auto">

            {/* Orbit Frame (1:1 aspect ratio centered) */}
            <div className="relative w-[90vw] max-w-[1200px] aspect-square">
              <div
                ref={rotationRef}
                className="absolute inset-0 origin-center"
                style={{ willChange: 'transform' }}
              />
            </div>

            {/* Overlays on the White Surface (Fade in as the reveal expands) */}
            <div className="absolute inset-0 z-30 pointer-events-none">

              {/* Center Brand Title */}
              <div
                ref={overlayCenterRef}
                className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none"
              >
                <span className="font-arabic text-xl sm:text-2xl text-[#87692A] block mb-1">
                  عِطْرٌ وُلِدَ مِنَ المَاءِ
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-[0.2em] text-[#141416] uppercase">
                  TREPPAN 53
                </h2>
                <p className="font-serif text-xs sm:text-sm uppercase tracking-[0.4em] text-neutral-500 mt-1">
                  The Royal Kuwaiti House of Fragrance
                </p>
              </div>

              {/* Top Right Tag */}
              <div
                ref={overlayTrRef}
                className="absolute top-10 sm:top-14 right-8 sm:right-14 text-right hidden sm:block"
              >
                <div className="text-[10px] font-mono text-[#87692A] uppercase tracking-widest font-bold">
                  EST. 53 • KUWAIT
                </div>
                <div className="text-xs font-serif text-[#141416] tracking-wider uppercase font-semibold">
                  100% Alcohol-Free Aqua Parfums
                </div>
              </div>

              {/* Bottom Left: Orbit Bottle Details on Mobile */}
              <div
                ref={overlayBlRef}
                className="absolute bottom-12 left-6 sm:left-14 max-w-xs text-left"
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#87692A] font-bold block mb-1">
                  Featured Flacon:
                </span>
                <div className="font-serif text-sm sm:text-base font-bold text-[#141416]">
                  {activeFocalItem.title}
                </div>
                <div className="text-xs text-neutral-600 font-sans mt-0.5">
                  {activeFocalItem.accords}
                </div>
              </div>

              {/* Bottom Right: Scroll to Home Maison CTA */}
              <div
                ref={overlayBrRef}
                className="absolute bottom-12 right-6 sm:right-14 flex items-center space-x-3 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={scrollToMaison}
                  className="px-6 py-3 bg-[#141416] hover:bg-[#87692A] text-white text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all duration-300 rounded-xs shadow-lg flex items-center space-x-2 group"
                >
                  <span>Enter Maison</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#DFC27D] group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
