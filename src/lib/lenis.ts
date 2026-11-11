import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function createLenis(): Lenis {
  return new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: true,
    touchMultiplier: 1.15,
  });
}

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  const resolved = typeof target === 'string' ? document.getElementById(target) : target;
  if (resolved == null) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(resolved, { offset, duration: 1.15 });
    return;
  }

  if (typeof resolved === 'number') {
    window.scrollTo({ top: resolved, behavior: 'smooth' });
    return;
  }

  resolved.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
