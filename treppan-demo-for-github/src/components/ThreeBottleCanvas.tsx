import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  BottleSceneController,
  PERFUME_BOTTLE_ASSETS
} from '../types/threeScene';
import {
  preloadAllPerfumeModels,
  NormalizedModelResult
} from '../utils/threeModelLoader';
import { Rotate3d, Sparkles } from 'lucide-react';

export interface ThreeBottleCanvasProps {
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  autoRotate?: boolean;
  autoRotateSpeed?: number; // radians per second
  interactive?: boolean;
  className?: string;
  onLoaded?: () => void;
  onProgress?: (progress: number) => void;
  showControlsOverlay?: boolean;
  // Step 4 scroll choreography props:
  mode?: 'interactive' | 'scroll';
  scrollProgress?: number; // 0.0 to 1.0
  onChapterChange?: (chapterIndex: number) => void;
}

// Precision easing helpers for luxury choreography
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const easeInQuad = (t: number) => t * t;

export const ThreeBottleCanvas = forwardRef<BottleSceneController, ThreeBottleCanvasProps>(
  (
    {
      activeIndex = 0,
      onActiveIndexChange,
      autoRotate = true,
      autoRotateSpeed = 0.35,
      interactive = true,
      className = '',
      onLoaded,
      onProgress,
      showControlsOverlay = true,
      mode = 'interactive',
      scrollProgress = 0,
      onChapterChange
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Loading and progress states
    const [isLoading, setIsLoading] = useState(true);
    const [loadPercent, setLoadPercent] = useState(0);
    const [currentBottleIndex, setCurrentBottleIndex] = useState(activeIndex);

    // Three.js internal references
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const masterContainerRef = useRef<THREE.Group | null>(null);
    const flaconGroupsRef = useRef<THREE.Group[]>([]);
    const loadedModelsRef = useRef<NormalizedModelResult[]>([]);
    const animationFrameIdRef = useRef<number | null>(null);

    // Studio lighting references for choreographed light sweeps
    const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
    const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
    const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
    const shadowMeshRef = useRef<THREE.Mesh | null>(null);

    // Scroll progress & chapter tracking
    const scrollProgressRef = useRef<number>(scrollProgress);
    const currentChapterRef = useRef<number>(0);
    const modeRef = useRef<'interactive' | 'scroll'>(mode);
    modeRef.current = mode;

    // Transform overrides for interactive mode
    const customRotationRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
    const customPositionRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
    const customScaleRef = useRef<number>(1);
    const isProgrammaticOverrideRef = useRef<boolean>(false);

    // Specular light sweep & grazing caustics flare references (Step 5 polish)
    const specularSweepLightRef = useRef<THREE.PointLight | null>(null);
    const flareSpriteRef = useRef<THREE.Sprite | null>(null);

    // Mouse & Gyroscope parallax depth layer refs (±0.12 units)
    const parallaxTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const parallaxCurrentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const baseCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.28, 5.6));

    // Drag interaction tracking (springy touch/nudge)
    const isPointerDownRef = useRef(false);
    const previousPointerPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const pointerDeltaRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    /**
     * Apply mathematical 3D choreography across the 3 flacons
     */
    const applyScrollChoreography = useCallback((progress: number) => {
      const p = clamp01(progress);
      scrollProgressRef.current = p;

      const groups = flaconGroupsRef.current;
      if (groups.length < 3) return;

      const g0 = groups[0]; // Flacon 1: Royal Oud Noir
      const g1 = groups[1]; // Flacon 2: Ruthless Aqua
      const g2 = groups[2]; // Flacon 3: Bleu De Aqua

      const keyLight = keyLightRef.current;
      const rimLight = rimLightRef.current;
      const fillLight = fillLightRef.current;
      const shadow = shadowMeshRef.current;
      const container = containerRef.current;

      // Responsive layout and scaling metrics
      const containerWidth = container?.clientWidth || window.innerWidth;
      const isPhone = containerWidth < 640;
      const isMobile = containerWidth < 768;
      const mobileFactor = isMobile ? 0.84 : 1.0;

      // Vertical center offset (elevate slightly on mobile phones so bottle doesn't clash with bottom card)
      const yCenter = isPhone ? 0.22 : 0;

      // Responsive lateral shift per product (asymmetric side-shifting):
      // - Product 01 ("ONLY YOU"): Textbox on LEFT -> shift bottle RIGHT (+1.46)
      // - Product 02 ("GLORIOUS"): Textbox on RIGHT -> shift bottle LEFT (-1.46)
      // - Product 03 ("BLVGARI AQUA"): Textbox on LEFT -> shift bottle RIGHT (+1.46)
      // Scaled smoothly for tablet, and centered on mobile phones to prevent viewport edge clipping
      let lateralShift = 1.46;
      if (isPhone) {
        lateralShift = 0;
      } else if (containerWidth < 768) {
        lateralShift = 0.85;
      } else if (containerWidth < 1024) {
        lateralShift = 1.18;
      } else if (containerWidth < 1280) {
        lateralShift = 1.35;
      } else {
        lateralShift = 1.46;
      }

      // Increased active bottle scale (~25% to 35% larger impactful presence)
      const activeScale = 1.16;   // ~35% scale increase from baseline 0.86
      const activeScale3 = 1.20;  // ~33% scale increase from baseline 0.90

      // Refined Camera trajectory closer to bottles for crisp, impactful presence
      let baseCamX = 0;
      let baseCamY = 0.28 + yCenter * 0.5;
      let baseCamZ = isMobile ? 6.3 : 5.4;

      if (p <= 0.34) {
        // Chapter 1: intimate macro -> stately frontal
        const t1 = clamp01(p / 0.34);
        const e1 = easeInOutCubic(t1);
        baseCamX = lerp(0.02, 0.0, e1);
        baseCamY = lerp(0.24 + yCenter * 0.5, 0.28 + yCenter * 0.5, e1);
        baseCamZ = lerp(isMobile ? 6.0 : 5.2, isMobile ? 6.3 : 5.4, e1);
      } else if (p <= 0.68) {
        // Chapter 2: dynamic 3/4 sculptural viewpoint
        const t2 = clamp01((p - 0.34) / 0.34);
        const e2 = easeInOutCubic(t2);
        baseCamX = lerp(0.0, 0.06, e2);
        baseCamY = lerp(0.28 + yCenter * 0.5, 0.32 + yCenter * 0.5, e2);
        baseCamZ = lerp(isMobile ? 6.3 : 5.4, isMobile ? 6.5 : 5.6, e2);
      } else {
        // Chapter 3: elevated majestic hero vantage point
        const t3 = clamp01((p - 0.68) / 0.32);
        const e3 = easeInOutCubic(t3);
        baseCamX = lerp(0.06, -0.02, e3);
        baseCamY = lerp(0.32 + yCenter * 0.5, 0.36 + yCenter * 0.5, e3);
        baseCamZ = lerp(isMobile ? 6.5 : 5.6, isMobile ? 6.2 : 5.3, e3);
      }
      baseCameraPosRef.current.set(baseCamX, baseCamY, baseCamZ);

      // Add subtle interactive pointer nudge if user is dragging
      const nudgeX = pointerDeltaRotationRef.current.x * 0.5;
      const nudgeY = pointerDeltaRotationRef.current.y * 0.5;

      // =========================================================================
      // CHAPTER 1: 0% – 38% (ONLY YOU)
      // Emerges centered under headline (0% -> 12%), then smoothly glides
      // into the open right zone (+lateralShift: +1.2 to +1.8) as Card 01 appears on LEFT
      // =========================================================================
      if (p <= 0.38) {
        g0.visible = true;

        if (p <= 0.12) {
          // Subtle centered emergence sitting below the centered headline
          const tZoom = clamp01(p / 0.12);
          const eZoom = easeInOutCubic(tZoom);

          g0.position.set(
            0,
            lerp(-0.55 + yCenter, yCenter, eZoom),
            lerp(0.25, 0, eZoom)
          );
          g0.scale.setScalar(lerp(activeScale * 0.9, activeScale, eZoom) * mobileFactor);
          g0.rotation.set(
            lerp(0.06, 0.02, eZoom) + nudgeX,
            lerp(Math.PI * 1.92, Math.PI * 2, eZoom) + nudgeY,
            lerp(0.03, 0, eZoom)
          );
        } else if (p <= 0.24) {
          // Smooth fluid transition from center (0) to RIGHT (+lateralShift) as left card fades in
          const tShift = clamp01((p - 0.12) / 0.12);
          const eShift = easeInOutCubic(tShift);
          const posX = lerp(0, +lateralShift, eShift);

          g0.position.set(
            posX,
            yCenter + Math.sin(p * 14) * 0.01,
            0
          );
          g0.scale.setScalar(activeScale * mobileFactor);
          g0.rotation.set(
            0.02 + nudgeX,
            Math.PI * 2 + (p - 0.12) * 0.35 + nudgeY,
            0
          );
        } else if (p <= 0.32) {
          // Extended settled dwell phase: holds right stage alongside Story Card 01 on the left
          g0.position.set(+lateralShift, yCenter + Math.sin(p * 14) * 0.01, 0);
          g0.scale.setScalar(activeScale * mobileFactor);
          g0.rotation.set(
            0.02 + nudgeX,
            Math.PI * 2 + (p - 0.12) * 0.35 + nudgeY,
            0
          );
        } else {
          // Unhurried exit transition (0.32 -> 0.38) gliding into right background depth
          const tExit = clamp01((p - 0.32) / 0.06);
          const eExit = easeInQuad(tExit);

          g0.position.set(
            lerp(+lateralShift, +lateralShift + 2.4, eExit),
            lerp(yCenter, yCenter - 0.2, eExit),
            lerp(0, -2.6, eExit)
          );
          g0.scale.setScalar(lerp(activeScale, 0.30, eExit) * mobileFactor);
          g0.rotation.set(
            0.02 + nudgeX,
            Math.PI * 2 + 0.05 + eExit * Math.PI * 2.2 + nudgeY,
            lerp(0, -0.15, eExit)
          );
        }
      } else {
        g0.visible = false;
      }

      // =========================================================================
      // CHAPTER 2: 30% – 72% (GLORIOUS)
      // Swoops in from depth into the open LEFT zone (-lateralShift: -1.2 to -1.8)
      // as Card 02 sits on the RIGHT
      // =========================================================================
      if (p >= 0.30 && p <= 0.72) {
        g1.visible = true;

        if (p < 0.44) {
          // Orbit/glide in smoothly from left depth to -lateralShift
          const tIn = clamp01((p - 0.30) / 0.14);
          const eIn = easeOutQuad(tIn);

          g1.position.set(
            lerp(-lateralShift - 2.5, -lateralShift, eIn),
            lerp(-0.35 + yCenter, yCenter, eIn),
            lerp(-2.8, 0, eIn)
          );
          g1.scale.setScalar(lerp(0.30, activeScale, eIn) * mobileFactor);
          g1.rotation.set(
            lerp(0.24, 0.06, eIn) + nudgeX,
            lerp(Math.PI * 1.6, 0.15, eIn) + nudgeY,
            lerp(0.12, 0, eIn)
          );
        } else if (p <= 0.64) {
          // Extended settled dwell phase: holds left stage cleanly opposite right textbox
          const breath = Math.sin((p - 0.44) * 22) * 0.02;
          g1.position.set(-lateralShift, breath + yCenter, 0);
          g1.scale.setScalar(activeScale * mobileFactor);
          g1.rotation.set(
            0.06 + Math.cos((p - 0.44) * 18) * 0.01 + nudgeX,
            0.15 + (p - 0.44) * 0.45 + nudgeY,
            0
          );
        } else {
          // Unhurried exit transition (0.64 -> 0.72) gliding away into left depth
          const tExit2 = clamp01((p - 0.64) / 0.08);
          const eExit2 = easeInQuad(tExit2);

          g1.position.set(
            lerp(-lateralShift, -lateralShift - 2.5, eExit2),
            lerp(yCenter, yCenter - 0.2, eExit2),
            lerp(0, -2.5, eExit2)
          );
          g1.scale.setScalar(lerp(activeScale, 0.30, eExit2) * mobileFactor);
          g1.rotation.set(
            lerp(0.06, -0.15, eExit2) + nudgeX,
            lerp(0.25, Math.PI * 1.5, eExit2) + nudgeY,
            0
          );
        }

        // Lighting choreography: catches rim light across gold & amber facets
        if (rimLight) {
          const rimT = clamp01((p - 0.38) / 0.24);
          const rimFactor = Math.sin(rimT * Math.PI);
          rimLight.intensity = lerp(2.8, 4.8, rimFactor);
          rimLight.position.set(
            lerp(-3.5, -2.2, rimFactor),
            lerp(2.8, 3.6, rimFactor),
            -3.5
          );
        }
      } else {
        g1.visible = false;
      }

      // =========================================================================
      // CHAPTER 3: 64% – 100% (BLVGARI AQUA)
      // Glides into open RIGHT zone (+lateralShift: +1.2 to +1.8) opposite Card 03 on the LEFT,
      // then LOCKED in place through 100%
      // =========================================================================
      if (p >= 0.64) {
        g2.visible = true;

        if (p < 0.80) {
          // Unhurried controlled glide into right focus (easeOutQuad)
          const tIn3 = clamp01((p - 0.64) / 0.16);
          const eIn3 = easeOutQuad(tIn3);

          g2.position.set(
            lerp(+lateralShift + 2.5, +lateralShift, eIn3),
            lerp(+2.4 + yCenter, 0.04 + yCenter, eIn3),
            lerp(-2.8, 0, eIn3)
          );
          g2.scale.setScalar(lerp(0.30, activeScale3, eIn3) * mobileFactor);
          g2.rotation.set(
            lerp(0.26, 0.04, eIn3) + nudgeX,
            lerp(-Math.PI * 1.4, 0.1, eIn3) + nudgeY,
            0
          );
        } else {
          // Elevated hero presentation: LOCKED at right stage (+lateralShift), fully visible through 100%
          const breath3 = Math.sin((p - 0.80) * 16) * 0.012;
          g2.position.set(+lateralShift, 0.04 + breath3 + yCenter, 0);
          g2.scale.setScalar(activeScale3 * mobileFactor);
          g2.rotation.set(
            0.04 + Math.sin((p - 0.80) * 12) * 0.008 + nudgeX,
            0.1 + (p - 0.80) * 0.45 + nudgeY,
            0
          );
        }

        // Celebratory light sweep across cobalt glass & metallic crest
        const sweepT = clamp01((p - 0.70) / 0.30);
        if (keyLight) {
          keyLight.position.x = lerp(-4.0, +4.5, sweepT);
          keyLight.intensity = lerp(2.6, 3.8, Math.sin(sweepT * Math.PI));
        }
        if (fillLight) {
          fillLight.intensity = lerp(1.4, 2.0, Math.sin(sweepT * Math.PI));
        }
      } else {
        g2.visible = false;
      }

      // Ground contact shadow follow
      if (shadow) {
        let activePos = 0;
        if (p <= 0.35) activePos = g0.position.x;
        else if (p <= 0.68) activePos = g1.position.x;
        else activePos = g2.position.x;
        shadow.position.x = activePos;
        shadow.position.y = -1.45 + yCenter;
        shadow.scale.setScalar(1.25 * (activeScale / 0.86));
      }

      // =========================================================================
      // 3D LIGHT SWEEP & SHIMMER INTERACTION
      // Grazing specular caustics pass across bottle facets at chapter pauses (~18%, ~54%, ~88%)
      // =========================================================================
      const pausePoints = [0.18, 0.54, 0.88];
      let maxPauseFactor = 0;
      let closestPauseIndex = 0;

      pausePoints.forEach((pauseP, idx) => {
        const dist = Math.abs(p - pauseP);
        if (dist < 0.075) {
          // Smooth sinusoidal bell curve: peaks at 1.0, 0 at boundaries
          const factor = Math.cos((dist / 0.075) * (Math.PI / 2));
          if (factor > maxPauseFactor) {
            maxPauseFactor = factor;
            closestPauseIndex = idx;
          }
        }
      });

      // Update grazing specular sweep light
      const specularLight = specularSweepLightRef.current;
      const flareSprite = flareSpriteRef.current;

      if (specularLight) {
        if (maxPauseFactor > 0.005) {
          specularLight.intensity = maxPauseFactor * 5.4;
          const currentPauseP = pausePoints[closestPauseIndex];
          const sweepProgress = (p - currentPauseP) / 0.075; // -1 to +1
          const activeBottleX = closestPauseIndex === 0 ? g0.position.x : (closestPauseIndex === 1 ? g1.position.x : g2.position.x);
          specularLight.position.set(activeBottleX + sweepProgress * 1.8, 0.55 + yCenter, 2.0);

          // Color nuance: warm gold shimmer for Oud Noir & Ruthless, sapphire-gold for Bleu De Aqua
          if (closestPauseIndex === 2) {
            specularLight.color.setHex(0xa6d4ff);
          } else {
            specularLight.color.setHex(0xffe298);
          }
        } else {
          specularLight.intensity = 0;
        }
      }

      // Update optical flare sprite positioned at the golden collar / flacon shoulder
      if (flareSprite) {
        if (maxPauseFactor > 0.01) {
          flareSprite.visible = true;
          (flareSprite.material as THREE.SpriteMaterial).opacity = maxPauseFactor * 0.92;
          const shoulderX = closestPauseIndex === 1 ? -0.20 : 0.20;
          const activeBottleX = closestPauseIndex === 0 ? g0.position.x : (closestPauseIndex === 1 ? g1.position.x : g2.position.x);
          flareSprite.position.set(activeBottleX + shoulderX, 0.62 + yCenter, 0.45);
        } else {
          flareSprite.visible = false;
        }
      }

      // Chapter notification
      let newChapter = 0;
      if (p >= 0.68) newChapter = 2;
      else if (p >= 0.34) newChapter = 1;

      if (newChapter !== currentChapterRef.current) {
        currentChapterRef.current = newChapter;
        setCurrentBottleIndex(newChapter);
        if (onChapterChange) {
          onChapterChange(newChapter);
        }
        if (onActiveIndexChange) {
          onActiveIndexChange(newChapter);
        }
      }
    }, [onChapterChange, onActiveIndexChange]);

    // Expose controller methods via forwardRef
    useImperativeHandle(
      ref,
      (): BottleSceneController => ({
        setActiveBottle: (index: number) => {
          switchBottle(index);
        },
        setRotation: (x: number, y: number, z: number) => {
          isProgrammaticOverrideRef.current = true;
          customRotationRef.current = { x, y, z };
          if (masterContainerRef.current) {
            masterContainerRef.current.rotation.set(x, y, z);
          }
        },
        setPosition: (x: number, y: number, z: number) => {
          isProgrammaticOverrideRef.current = true;
          customPositionRef.current = { x, y, z };
          if (masterContainerRef.current) {
            masterContainerRef.current.position.set(x, y, z);
          }
        },
        setScale: (scale: number) => {
          isProgrammaticOverrideRef.current = true;
          customScaleRef.current = scale;
          if (masterContainerRef.current) {
            masterContainerRef.current.scale.setScalar(scale);
          }
        },
        setExposure: (val: number) => {
          if (rendererRef.current) {
            rendererRef.current.toneMappingExposure = val;
          }
        },
        getActiveBottleIndex: () => currentBottleIndex,
        triggerSpin: (durationSeconds = 1.2) => {
          if (flaconGroupsRef.current[currentBottleIndex]) {
            const activeGroup = flaconGroupsRef.current[currentBottleIndex];
            const startY = activeGroup.rotation.y;
            const targetY = startY + Math.PI * 2;
            const startTime = performance.now();
            const duration = durationSeconds * 1000;

            const spinAnim = (now: number) => {
              const elapsed = now - startTime;
              const t = Math.min(1, elapsed / duration);
              const ease = 1 - Math.pow(1 - t, 3);
              activeGroup.rotation.y = startY + (targetY - startY) * ease;
              if (t < 1) {
                requestAnimationFrame(spinAnim);
              }
            };
            requestAnimationFrame(spinAnim);
          }
        },
        resetTransform: () => {
          isProgrammaticOverrideRef.current = false;
          customRotationRef.current = { x: 0, y: 0, z: 0 };
          customPositionRef.current = { x: 0, y: 0, z: 0 };
          customScaleRef.current = 1;
          pointerDeltaRotationRef.current = { x: 0, y: 0 };
          if (masterContainerRef.current) {
            masterContainerRef.current.position.set(0, 0, 0);
            masterContainerRef.current.rotation.set(0, 0, 0);
            masterContainerRef.current.scale.setScalar(1);
          }
        },
        setScrollProgress: (progress: number) => {
          applyScrollChoreography(progress);
        },
        getScene: () => sceneRef.current,
        getCamera: () => cameraRef.current
      }),
      [currentBottleIndex, applyScrollChoreography]
    );

    // Switch displayed model in interactive mode
    const switchBottle = (newIndex: number) => {
      const safeIndex = Math.max(0, Math.min(newIndex, PERFUME_BOTTLE_ASSETS.length - 1));
      setCurrentBottleIndex(safeIndex);
      if (onActiveIndexChange) {
        onActiveIndexChange(safeIndex);
      }

      if (modeRef.current === 'interactive') {
        const groups = flaconGroupsRef.current;
        groups.forEach((grp, idx) => {
          if (grp) {
            grp.visible = idx === safeIndex;
            if (idx === safeIndex) {
              grp.position.set(0, 0, 0);
              grp.rotation.set(0, 0, 0);
              // Subtle pop flourish
              grp.scale.setScalar(0.92);
              const startTime = performance.now();
              const popAnim = (time: number) => {
                const elapsed = (time - startTime) / 320;
                if (elapsed < 1) {
                  const s = 0.92 + 0.08 * Math.sin((elapsed * Math.PI) / 2);
                  grp.scale.setScalar(s);
                  requestAnimationFrame(popAnim);
                } else {
                  grp.scale.setScalar(1);
                }
              };
              requestAnimationFrame(popAnim);
            }
          }
        });
      }
    };

    // Keep activeIndex prop in sync in interactive mode
    useEffect(() => {
      if (mode === 'interactive' && activeIndex !== currentBottleIndex && flaconGroupsRef.current.length > 0) {
        switchBottle(activeIndex);
      }
    }, [activeIndex, mode]);

    // Keep scrollProgress prop in sync in scroll mode
    useEffect(() => {
      if (mode === 'scroll') {
        applyScrollChoreography(scrollProgress);
      }
    }, [scrollProgress, mode, applyScrollChoreography]);

    // Main Three.js setup
    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      let isDestroyed = false;
      const width = container.clientWidth || 500;
      const height = container.clientHeight || 500;

      // 1. Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // 2. Camera: 40 deg FOV, ideal for flacon proportions with comfortable breathing room
      const isMobile = width < 768;
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0.28, isMobile ? 6.3 : 5.4);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // 3. WebGL Renderer with ACES Tone Mapping
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        });
      } catch (err) {
        console.warn('WebGLRenderer context initialization notice:', err);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // 4. Studio Environment for Physical Materials
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      const roomEnv = new RoomEnvironment();
      scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
      roomEnv.dispose();

      // 5. PBR Studio Lighting Rig calibrated for signature cream canvas
      const ambientLight = new THREE.AmbientLight(0xfffbf2, 0.95);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfffcf6, 2.6);
      keyLight.position.set(3.5, 4.5, 3.8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0001;
      scene.add(keyLight);
      keyLightRef.current = keyLight;

      const rimLight = new THREE.DirectionalLight(0xdfc27d, 2.8);
      rimLight.position.set(-3.5, 2.8, -3.5);
      scene.add(rimLight);
      rimLightRef.current = rimLight;

      const fillLight = new THREE.DirectionalLight(0xf5f8ff, 1.4);
      fillLight.position.set(-3.0, 1.2, 2.8);
      scene.add(fillLight);
      fillLightRef.current = fillLight;

      // Specular light sweep pass for chapter pause shimmer
      const specularSweepLight = new THREE.PointLight(0xffe298, 0, 8, 1.8);
      specularSweepLight.position.set(0, 0.55, 2.0);
      scene.add(specularSweepLight);
      specularSweepLightRef.current = specularSweepLight;

      // Optical flare sprite for golden collar & glass facet glint
      const flareCanvas = document.createElement('canvas');
      flareCanvas.width = 128;
      flareCanvas.height = 128;
      const flareCtx = flareCanvas.getContext('2d');
      if (flareCtx) {
        const grad = flareCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.12, 'rgba(255, 238, 190, 0.95)');
        grad.addColorStop(0.35, 'rgba(223, 194, 125, 0.45)');
        grad.addColorStop(0.65, 'rgba(197, 160, 89, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        flareCtx.fillStyle = grad;
        flareCtx.fillRect(0, 0, 128, 128);
      }
      const flareTexture = new THREE.CanvasTexture(flareCanvas);
      const flareMat = new THREE.SpriteMaterial({
        map: flareTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const flareSprite = new THREE.Sprite(flareMat);
      flareSprite.scale.set(0.65, 0.65, 1);
      flareSprite.visible = false;
      scene.add(flareSprite);
      flareSpriteRef.current = flareSprite;

      // 6. Ground Contact Shadow Disc (gentle, realistic studio contact shadow on cream)
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const ctx = shadowCanvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 115);
        gradient.addColorStop(0, 'rgba(40, 32, 22, 0.28)');       // Gentle contact shadow directly under base
        gradient.addColorStop(0.35, 'rgba(55, 45, 32, 0.14)');    // Soft realistic penumbra
        gradient.addColorStop(0.70, 'rgba(180, 150, 100, 0.04)'); // Subtle warm dispersion
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.65,
        depthWrite: false
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -1.45;
      scene.add(shadowMesh);
      shadowMeshRef.current = shadowMesh;

      // 7. Master Container
      const masterContainer = new THREE.Group();
      masterContainer.name = 'MasterContainer';
      scene.add(masterContainer);
      masterContainerRef.current = masterContainer;

      // 8. Preload and normalize all 3 GLB models asynchronously
      setIsLoading(true);
      preloadAllPerfumeModels((progress) => {
        if (!isDestroyed) {
          setLoadPercent(progress);
          if (onProgress) onProgress(progress);
        }
      })
        .then((results) => {
          if (isDestroyed) return;
          loadedModelsRef.current = results;
          setIsLoading(false);

          // Mount each bottle in its own dedicated pivot group
          const groups: THREE.Group[] = [];
          results.forEach((res, index) => {
            const bottleGroup = new THREE.Group();
            bottleGroup.name = `FlaconGroup_${res.asset.id}`;
            bottleGroup.add(res.group.clone(true));

            if (modeRef.current === 'interactive') {
              bottleGroup.visible = index === activeIndex;
            } else {
              // In scroll mode, start initial state
              bottleGroup.visible = index === 0;
            }
            masterContainer.add(bottleGroup);
            groups.push(bottleGroup);
          });
          flaconGroupsRef.current = groups;

          // Initial choreography application
          if (modeRef.current === 'scroll') {
            applyScrollChoreography(scrollProgressRef.current);
          }

          if (onLoaded) onLoaded();
        })
        .catch((err) => {
          console.error('Error loading perfume 3D models:', err);
          setIsLoading(false);
        });

      // 9. Resize Observer with Aspect Ratio preservation & Retina DPI clamp
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          if (modeRef.current === 'scroll') {
            applyScrollChoreography(scrollProgressRef.current);
          }
        }
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // Mouse & Gyroscope Parallax Listeners (±0.12 units in X/Y)
      const handleMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        parallaxTargetRef.current.x = Math.max(-1.2, Math.min(1.2, nx)) * 0.12;
        parallaxTargetRef.current.y = -Math.max(-1.2, Math.min(1.2, ny)) * 0.12;
      };

      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          const gx = Math.max(-1, Math.min(1, e.gamma / 22));
          const gy = Math.max(-1, Math.min(1, (e.beta - 40) / 25));
          parallaxTargetRef.current.x = gx * 0.12;
          parallaxTargetRef.current.y = -gy * 0.12;
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      }

      // 10. Animation Render Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        // Parallax smooth damping interpolation (±0.12 units)
        parallaxCurrentRef.current.x += (parallaxTargetRef.current.x - parallaxCurrentRef.current.x) * 0.05;
        parallaxCurrentRef.current.y += (parallaxTargetRef.current.y - parallaxCurrentRef.current.y) * 0.05;

        // Apply eased camera position with parallax depth
        if (camera) {
          camera.position.x = baseCameraPosRef.current.x + parallaxCurrentRef.current.x;
          camera.position.y = baseCameraPosRef.current.y + parallaxCurrentRef.current.y;
          camera.position.z = baseCameraPosRef.current.z;
          const lookY = 0.06 + (containerRef.current && containerRef.current.clientWidth < 640 ? 0.22 : 0);
          camera.lookAt(0, lookY, 0);
        }

        // Shimmer twinkle on active optical flare sprite
        if (flareSpriteRef.current && flareSpriteRef.current.visible) {
          const flarePulse = 0.58 + 0.16 * Math.sin(elapsed * 4.2);
          flareSpriteRef.current.scale.set(flarePulse, flarePulse, 1);
        }

        if (modeRef.current === 'interactive') {
          // Interactive auto-rotation when user is not manually rotating
          if (!isProgrammaticOverrideRef.current && masterContainer) {
            if (autoRotate && !isPointerDownRef.current) {
              pointerDeltaRotationRef.current.y += autoRotateSpeed * delta;
            }
            masterContainer.rotation.y = pointerDeltaRotationRef.current.y;
            masterContainer.rotation.x = pointerDeltaRotationRef.current.x;
            masterContainer.position.y = Math.sin(elapsed * 1.4) * 0.04;
            shadowMesh.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.03);
          }
        } else {
          // In scroll mode: spring back pointer nudge smoothly
          if (!isPointerDownRef.current) {
            pointerDeltaRotationRef.current.x *= 0.92;
            pointerDeltaRotationRef.current.y *= 0.92;
          }
          // Re-apply choreography to account for pointer nudge spring-back
          if (
            Math.abs(pointerDeltaRotationRef.current.x) > 0.001 ||
            Math.abs(pointerDeltaRotationRef.current.y) > 0.001
          ) {
            applyScrollChoreography(scrollProgressRef.current);
          }
        }

        renderer.render(scene, camera);
      };

      animate();

      // Deep WebGL Resource Cleanup to prevent memory/context leaks
      return () => {
        isDestroyed = true;
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        resizeObserver.disconnect();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('deviceorientation', handleOrientation);

        // Deep scene traversal and disposal
        scene.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            const mesh = object as THREE.Mesh;
            if (mesh.geometry) {
              mesh.geometry.dispose();
            }
            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((mat) => {
                Object.keys(mat).forEach((key) => {
                  const val = (mat as unknown as Record<string, unknown>)[key];
                  if (val && typeof val === 'object' && 'isTexture' in val) {
                    (val as THREE.Texture).dispose();
                  }
                });
                mat.dispose();
              });
            }
          }
        });

        if (scene.environment) {
          scene.environment.dispose();
        }
        pmremGenerator.dispose();
        shadowTexture.dispose();
        shadowGeo.dispose();
        shadowMat.dispose();
        flareTexture.dispose();
        flareMat.dispose();
        renderer.dispose();
      };
    }, []);

    // Pointer / Mouse interaction for 360 inspection & springy scroll nudge
    const handlePointerDown = (e: React.PointerEvent) => {
      if (!interactive) return;
      isPointerDownRef.current = true;
      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch (err) {
        // Safe ignore
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!interactive || !isPointerDownRef.current) return;
      const deltaX = e.clientX - previousPointerPositionRef.current.x;
      const deltaY = e.clientY - previousPointerPositionRef.current.y;

      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };

      if (modeRef.current === 'interactive') {
        pointerDeltaRotationRef.current.y += deltaX * 0.008;
        pointerDeltaRotationRef.current.x = Math.max(
          -0.35,
          Math.min(0.35, pointerDeltaRotationRef.current.x + deltaY * 0.005)
        );
      } else {
        // Subtle springy interactive drag in scroll mode
        pointerDeltaRotationRef.current.y += deltaX * 0.004;
        pointerDeltaRotationRef.current.x = Math.max(
          -0.2,
          Math.min(0.2, pointerDeltaRotationRef.current.x + deltaY * 0.003)
        );
        applyScrollChoreography(scrollProgressRef.current);
      }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!interactive) return;
      isPointerDownRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Safe ignore
      }
    };

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}
      >
        {/* Subtle Ambient Studio Halo on Cream Canvas */}
        {mode === 'scroll' && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-40"
            style={{
              background: `radial-gradient(circle at 50% 52%, ${
                currentBottleIndex === 0
                  ? 'rgba(212, 175, 55, 0.12)'
                  : currentBottleIndex === 1
                  ? 'rgba(96, 165, 250, 0.08)'
                  : 'rgba(197, 160, 89, 0.12)'
              } 0%, transparent 65%)`
            }}
          />
        )}

        {/* The Three.js WebGL Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative z-10 w-full h-full block cursor-grab active:cursor-grabbing transition-opacity duration-700 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ touchAction: mode === 'scroll' ? 'pan-y' : 'none' }}
        />

        {/* Lightweight Luxury Gold Shimmer Skeleton & Progress Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#FAF9F6]/90 transition-opacity duration-500">
            {/* Silhouette flacon outline */}
            <div className="relative w-36 h-60 rounded-t-3xl rounded-b-xl border-2 border-[#C5A059]/30 overflow-hidden flex flex-col items-center shadow-inner">
              <div className="w-14 h-12 bg-gradient-to-b from-[#C5A059]/30 to-[#87692A]/20 rounded-t-md mb-2 border-b border-[#C5A059]/30" />
              <div className="flex-1 w-full bg-gradient-to-b from-white/40 via-[#DFC27D]/10 to-[#C5A059]/20 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </div>
            </div>

            {/* Progress Text & Subtle Gold Bar */}
            <div className="mt-6 flex flex-col items-center space-y-2.5 max-w-xs text-center">
              <div className="flex items-center space-x-2 text-[#87692A] text-xs font-serif tracking-[0.2em] uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                <span>Loading 3D Flacons ({loadPercent}%)</span>
              </div>

              <div className="w-48 h-1 bg-[#141416]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#87692A] via-[#C5A059] to-[#DFC27D] transition-all duration-300 rounded-full"
                  style={{ width: `${loadPercent}%` }}
                />
              </div>

              <p className="text-[10px] text-neutral-500 font-sans tracking-wide">
                Calibrating PBR glass transmission & reflections
              </p>
            </div>
          </div>
        )}

        {/* Minimal Controls Overlay (shown only in interactive mode when enabled) */}
        {showControlsOverlay && mode === 'interactive' && !isLoading && (
          <div className="absolute top-3 inset-x-3 sm:inset-x-5 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-[#C5A059]/40 shadow-xs text-[9px] sm:text-[10px] uppercase font-serif tracking-[0.18em] text-[#87692A] pointer-events-auto">
              <Rotate3d className="w-3 h-3 text-[#C5A059]" />
              <span className="hidden sm:inline">360° Drag to Inspect</span>
              <span className="sm:hidden">360° 3D</span>
            </div>

            <div className="flex items-center space-x-1.5 pointer-events-auto">
              {PERFUME_BOTTLE_ASSETS.map((asset, idx) => (
                <button
                  key={asset.id}
                  onClick={() => switchBottle(idx)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-serif uppercase tracking-wider transition-all duration-300 border ${
                    currentBottleIndex === idx
                      ? 'bg-[#141416] text-[#FAF9F6] border-[#C5A059] shadow-sm font-semibold scale-105'
                      : 'bg-white/80 text-neutral-600 border-neutral-200/80 hover:border-[#C5A059]/60 hover:text-black'
                  }`}
                  title={asset.name}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ThreeBottleCanvas.displayName = 'ThreeBottleCanvas';
