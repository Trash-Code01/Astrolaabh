import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { createLenis, setLenisInstance, scrollToTarget } from '../lib/lenis';

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const preference = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let dispose: (() => void) | undefined;
    const setup = () => {
      dispose?.();
      dispose = undefined;
      if (!preference.matches) return;
      const lenis = createLenis();
      lenisRef.current = lenis;
      setLenisInstance(lenis);

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on('scroll', () => {
        ScrollTrigger.update();
      });

      const updateTicker = (time: number) => {
        if (!document.hidden) lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);

      dispose = () => {
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
        lenisRef.current = null;
        setLenisInstance(null);
      };
    };
    setup();
    preference.addEventListener('change', setup);
    return () => { dispose?.(); preference.removeEventListener('change', setup); };
  }, []);

  const scrollTo = (target: string | HTMLElement | number) => {
    scrollToTarget(target);
  };

  return { lenis: lenisRef.current, scrollTo };
}
