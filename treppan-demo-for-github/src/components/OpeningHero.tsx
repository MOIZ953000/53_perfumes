import React, { useEffect, useRef, useState } from 'react';

export const OpeningHero: React.FC = () => {
  // Layering state: outgoing video stays at opacity 1 underneath (z-index: 1),
  // while incoming video fades in over it from 0 to 1 (z-index: 2).
  const [baseVideo, setBaseVideo] = useState<'A' | 'B'>('A');
  const [fadingInVideo, setFadingInVideo] = useState<'A' | 'B' | null>(null);

  const baseVideoRef = useRef<'A' | 'B'>('A');
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  useEffect(() => {
    baseVideoRef.current = baseVideo;
  }, [baseVideo]);

  useEffect(() => {
    // Start initial playback on primary track A
    if (videoRefA.current) {
      videoRefA.current.play().catch(() => {});
    }

    const CROSSFADE_DURATION = 1.2; // 1.2s smooth opacity fade-in
    let animationFrameId: number;

    const monitorPlayback = () => {
      const currentBase = baseVideoRef.current;
      const currentVideo = currentBase === 'A' ? videoRefA.current : videoRefB.current;
      const nextVideo = currentBase === 'A' ? videoRefB.current : videoRefA.current;

      if (currentVideo && nextVideo && currentVideo.duration) {
        const duration = currentVideo.duration;
        // Trigger threshold: ~13.5s for 15s video, or duration - 1.2s
        const triggerTime = duration >= 14.5 ? 13.5 : Math.max(0.5, duration - CROSSFADE_DURATION);

        if (currentVideo.currentTime >= triggerTime && !isTransitioningRef.current) {
          isTransitioningRef.current = true;
          const incomingTrack = currentBase === 'A' ? 'B' : 'A';

          // 1. Prepare and play incoming video from start
          nextVideo.currentTime = 0;
          const playPromise = nextVideo.play();

          const startFadeIn = () => {
            // 2. Animate incoming video opacity from 0 to 1 over 1.2s at z-index: 2
            // Outgoing video STAYS at opacity: 1 at z-index: 1 underneath!
            setFadingInVideo(incomingTrack);

            // 3. Once incoming video reaches opacity 1 (after 1200ms), instantly swap z-indexes
            setTimeout(() => {
              baseVideoRef.current = incomingTrack;
              setBaseVideo(incomingTrack);
              setFadingInVideo(null);

              // Reset previous video behind the now 100% opaque incoming video
              if (currentVideo) {
                currentVideo.currentTime = 0;
                if (!currentVideo.paused) {
                  currentVideo.pause();
                }
              }
              isTransitioningRef.current = false;
            }, CROSSFADE_DURATION * 1000);
          };

          if (playPromise !== undefined) {
            playPromise.then(startFadeIn).catch(() => {
              nextVideo.muted = true;
              nextVideo.play().then(startFadeIn).catch(() => {
                isTransitioningRef.current = false;
              });
            });
          } else {
            startFadeIn();
          }
        }
      }

      animationFrameId = requestAnimationFrame(monitorPlayback);
    };

    animationFrameId = requestAnimationFrame(monitorPlayback);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Compute exact styles: zero blur, pure opacity blend, no white background exposure
  const getVideoAStyle = (): React.CSSProperties => {
    if (fadingInVideo === 'A') {
      // Video A is incoming over Video B
      return {
        opacity: 1,
        zIndex: 2,
        transition: 'opacity 1.2s ease-in-out',
        filter: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        willChange: 'opacity',
      };
    }
    if (baseVideo === 'A') {
      // Video A is playing base (always 100% opaque underneath)
      return {
        opacity: 1,
        zIndex: 1,
        transition: 'none',
        filter: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      };
    }
    // Video A is idle behind Video B
    return {
      opacity: 0,
      zIndex: 0,
      transition: 'none',
      filter: 'none',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
    };
  };

  const getVideoBStyle = (): React.CSSProperties => {
    if (fadingInVideo === 'B') {
      // Video B is incoming over Video A
      return {
        opacity: 1,
        zIndex: 2,
        transition: 'opacity 1.2s ease-in-out',
        filter: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        willChange: 'opacity',
      };
    }
    if (baseVideo === 'B') {
      // Video B is playing base (always 100% opaque underneath)
      return {
        opacity: 1,
        zIndex: 1,
        transition: 'none',
        filter: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      };
    }
    // Video B is idle behind Video A
    return {
      opacity: 0,
      zIndex: 0,
      transition: 'none',
      filter: 'none',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
    };
  };

  return (
    <section
      id="top-opening-hero"
      aria-label="Treppan Botanical Opening"
      className="relative w-full h-screen min-h-screen overflow-hidden pointer-events-none select-none bg-[#1c1815]"
      style={{
        backgroundColor: '#1c1815',
        filter: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }}
    >
      {/* Video Track A */}
      <video
        ref={videoRefA}
        src="/assets/TREPPAN53.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transform scale-[1.02]"
        style={getVideoAStyle()}
      >
        <source src="/assets/TREPPAN53.mp4" type="video/mp4" />
      </video>

      {/* Video Track B */}
      <video
        ref={videoRefB}
        src="/assets/TREPPAN53.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transform scale-[1.02]"
        style={getVideoBStyle()}
      >
        <source src="/assets/TREPPAN53.mp4" type="video/mp4" />
      </video>
    </section>
  );
};

export default OpeningHero;
