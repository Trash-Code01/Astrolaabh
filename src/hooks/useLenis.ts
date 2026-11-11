import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { createLenis, setLenisInstance } from '../lib/lenis';
import { useCreativeStore } from '../store/useCreativeStore';

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollProgress = useCreativeStore((s) => s.setScrollProgress);

  useEffect(() => {
    const lenis = createLenis();
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', (e: { progress: number }) => {
      ScrollTrigger.update();
      setScrollProgress(e.progress);
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [setScrollProgress]);

  const scrollTo = (target: string | HTMLElement | number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.4 });
    }
  };

  return { lenis: lenisRef.current, scrollTo };
}
