import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function createLenis(): Lenis {
  return new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.15,
  });
}

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

/** Clear smooth-scroll momentum as well as the browser's scroll position. */
export function resetPageScroll() {
  lenisInstance?.resize();
  lenisInstance?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  const resolved = typeof target === 'string' ? document.getElementById(target) : target;
  if (resolved == null) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(resolved, { offset, duration: 1.15 });
    return;
  }

  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  if (typeof resolved === 'number') {
    window.scrollTo({ top: resolved, behavior });
    return;
  }

  window.scrollTo({ top: resolved.getBoundingClientRect().top + window.scrollY + offset, behavior });
}
