import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SeamlessVideoBackgroundProps {
  src?: string;
  crossfadeDuration?: number; // In seconds (default: 0.8s)
  className?: string;
  overlayClassName?: string;
  variant?: 'centered' | 'split' | 'none';
  children?: React.ReactNode;
}

/**
 * SeamlessVideoBackground
 *
 * Implements a dual-video alternating crossfade mechanism to eliminate loop restart
 * stutter and frame drops in HTML5 video backgrounds.
 *
 * Features:
 * - Alternating Video A / Video B playback.
 * - 0.8s opacity crossfade buffer triggered right before loop restart.
 * - Complete fallback attributes: autoplay, muted, loop, playsinline, preload="auto".
 * - Multi-layered soft radial vignette and amber caustics (avoiding flat black tint).
 * - Bulletproof event fallbacks (timeupdate, onEnded, visibilitychange).
 */
export const SeamlessVideoBackground: React.FC<SeamlessVideoBackgroundProps> = ({
  src = '/assets/treppan_fragrance_botanical.mp4',
  crossfadeDuration = 0.8, // 800ms buffer as requested
  className = '',
  overlayClassName = '',
  variant = 'centered',
  children
}) => {
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  // 'A' or 'B' indicates which video element is currently the primary visible player
  const [activeVideo, setActiveVideo] = useState<'A' | 'B'>('A');
  const isTransitioningRef = useRef(false);

  // Start video playback safely with autoplay policy error handling
  const safePlay = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Silently handle autoplay prevention or browser pause
      });
    }
  }, []);

  // Crossfade trigger
  const triggerCrossfade = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const outgoing = activeVideo === 'A' ? videoRefA.current : videoRefB.current;
    const incoming = activeVideo === 'A' ? videoRefB.current : videoRefA.current;
    const nextActive = activeVideo === 'A' ? 'B' : 'A';

    if (incoming) {
      incoming.currentTime = 0;
      safePlay(incoming);
    }

    // Switch active state to trigger CSS opacity crossfade
    setActiveVideo(nextActive);

    // After crossfade duration completes, pause outgoing video and reset
    setTimeout(() => {
      if (outgoing) {
        outgoing.pause();
        outgoing.currentTime = 0;
      }
      isTransitioningRef.current = false;
    }, crossfadeDuration * 1000);
  }, [activeVideo, crossfadeDuration, safePlay]);

  // Monitor video progress to trigger crossfade before loop restart
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.duration || isNaN(video.duration)) return;

    const timeLeft = video.duration - video.currentTime;
    if (timeLeft <= crossfadeDuration && !isTransitioningRef.current) {
      triggerCrossfade();
    }
  };

  // Fallback in case timeupdate ticks jump past the window
  const handleEnded = () => {
    if (!isTransitioningRef.current) {
      triggerCrossfade();
    }
  };

  // Initial playback setup and tab visibility synchronization
  useEffect(() => {
    const videoA = videoRefA.current;
    const videoB = videoRefB.current;

    if (videoA) {
      videoA.currentTime = 0;
      safePlay(videoA);
    }

    if (videoB) {
      videoB.currentTime = 0;
      videoB.pause();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentPrimary = activeVideo === 'A' ? videoA : videoB;
        if (currentPrimary && currentPrimary.paused) {
          safePlay(currentPrimary);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeVideo, safePlay]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Video A */}
      <video
        ref={videoRefA}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onTimeUpdate={activeVideo === 'A' ? handleTimeUpdate : undefined}
        onEnded={activeVideo === 'A' ? handleEnded : undefined}
        className={`absolute inset-0 w-full h-full object-cover transform scale-[1.02] will-change-[opacity] ${
          activeVideo === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
        style={{
          transition: `opacity ${crossfadeDuration}s cubic-bezier(0.4, 0, 0.2, 1)`
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Video B */}
      <video
        ref={videoRefB}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onTimeUpdate={activeVideo === 'B' ? handleTimeUpdate : undefined}
        onEnded={activeVideo === 'B' ? handleEnded : undefined}
        className={`absolute inset-0 w-full h-full object-cover transform scale-[1.02] will-change-[opacity] ${
          activeVideo === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
        style={{
          transition: `opacity ${crossfadeDuration}s cubic-bezier(0.4, 0, 0.2, 1)`
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Multi-Layered Soft Warm Luxury Scrim & Caustics */}
      {variant === 'split' ? (
        /* 1. Editorial Readability Gradient: ensures text on left is crystal clear while flowers shine on right */
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#FAF9F6]/95 via-[#FAF9F6]/60 to-transparent pointer-events-none" />
      ) : variant === 'centered' ? (
        /* Balanced Centered Presentation Scrim: soft ambient halo letting flowers blow across the entire stage */
        <>
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#FAF9F6]/75 via-[#FAF9F6]/35 to-[#FAF9F6]/85 pointer-events-none" />
          <div
            className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-multiply"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(223, 194, 125, 0.25) 0%, rgba(197, 160, 89, 0.10) 45%, transparent 75%)'
            }}
          />
        </>
      ) : null}

      {/* Top and Bottom Soft Ivory Bleed Fades for Seamless Section Transition (omitted when variant is 'none') */}
      {variant !== 'none' && (
        <>
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FAF9F6] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/70 to-transparent z-20 pointer-events-none" />
        </>
      )}

      {/* Optional custom overlay layer */}
      {overlayClassName && <div className={`absolute inset-0 z-20 ${overlayClassName}`} />}

      {/* Children passed to background container */}
      {children}
    </div>
  );
};
