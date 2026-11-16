import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { resetPageScroll } from './lib/lenis';
import { useLenis } from './hooks/useLenis';
import { AtelierArrival } from './components/recommendation/AtelierArrival';
const HomePage = lazy(() => import('./HomePage'));
const ProductPage = lazy(() => import('./components/sections/ProductPage').then(module => ({ default: module.ProductPage })));
const CheckoutPage = lazy(() => import('./components/sections/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const CartPage = lazy(() => import('./components/sections/CartPage').then(module => ({ default: module.CartPage })));

const FindGemPage = lazy(() => import('./components/sections/FindGemPage'));

type RouteReadiness = (home: boolean) => void;

export function App({ onReady, onSceneReady }: { onReady?: RouteReadiness; onSceneReady: () => void }) {
  useLenis();
  const [route, setRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/checkout') return 'checkout';
      if (window.location.pathname === '/cart') return 'cart';
      if (/^\/find-gem\/?$/.test(window.location.pathname) || window.location.hash === '#find-gem') return 'find-gem';
      const productPath = window.location.pathname.match(/^\/product\/?([^/]*)/);
      if (productPath) return productPath[1] || 'ruby';
      if (window.location.hash.startsWith('#product')) return window.location.hash.slice('#product'.length).replace(/^\//, '') || 'ruby';
    }
    return 'home';
  });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.pathname === '/checkout') { setRoute('checkout'); return; }
      if (window.location.pathname === '/cart') { setRoute('cart'); return; }
      if (/^\/find-gem\/?$/.test(window.location.pathname) || window.location.hash === '#find-gem') { setRoute('find-gem'); return; }
      const productPath = window.location.pathname.match(/^\/product\/?([^/]*)/);
      if (productPath) setRoute(productPath[1] || 'ruby');
      else if (window.location.hash.startsWith('#product')) setRoute(window.location.hash.slice('#product'.length).replace(/^\//, '') || 'ruby');
      else setRoute('home');
    };
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    resetPageScroll();
    // Repeat after the destination layout and old scroll triggers have settled.
    const frame = requestAnimationFrame(resetPageScroll);
    return () => cancelAnimationFrame(frame);
  }, [route]);

  useEffect(() => {
    if (!onReady) return;
    let active = true;
    const ready = () => { if (active) { active = false; onReady(route === 'home'); } };
    // This effect commits after the destination's lazy module and CSS arrive.
    // A failed optional image must not leave the page behind the loader.
    const deadline = window.setTimeout(ready, 15000);
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      const top = target ? target.getBoundingClientRect().top : 0;
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('[data-route-content] img')).filter(image => {
        const box = image.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && box.bottom > top && box.top < top + innerHeight && box.right > 0 && box.left < innerWidth;
      });
      for (const image of images) image.loading = 'eager';
      void Promise.allSettled([document.fonts.load('400 16px Manrope'), ...images.map(image => image.decode())])
        .then(() => { clearTimeout(deadline); ready(); });
    });
    return () => { active = false; clearTimeout(deadline); cancelAnimationFrame(frame); };
  }, [route, onReady]);

  if (route === 'find-gem') return <FindGemPage />;
  if (route === 'checkout') return <CheckoutPage />;
  if (route === 'cart') return <CartPage />;

  if (route !== 'home') {
    return <ProductPage key={route} gemstoneId={route} />;
  }

  return <HomePage onSceneReady={onSceneReady} />;
}

export default function AppWithSuspense() {
  const [showOpening, setShowOpening] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [includeVisit] = useState(() => location.pathname === '/' && (!location.hash || location.hash === '#hero') && window.scrollY < 4);
  const [filmEnded, setFilmEnded] = useState(false);
  const [homeRoute, setHomeRoute] = useState<boolean | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const finishFilm = useCallback(() => setFilmEnded(true), []);
  const finishScene = useCallback(() => setSceneReady(true), []);
  const assetsReady = homeRoute !== null && (!homeRoute || !includeVisit || reduceMotion || sceneReady);

  useEffect(() => {
    if (!showOpening) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => setReduceMotion(preference.matches);
    preference.addEventListener('change', changed);
    return () => preference.removeEventListener('change', changed);
  }, [showOpening]);

  useEffect(() => {
    if (!showOpening || (!filmEnded && !reduceMotion) || homeRoute === null) return;
    if (assetsReady) { setShowOpening(false); return; }
    // The responsive envelope still is ready. If the GPU or mesh stalls,
    // reveal that usable scene and let WebGL take over when it finishes.
    const deadline = window.setTimeout(() => setShowOpening(false), 8000);
    return () => clearTimeout(deadline);
  }, [assetsReady, homeRoute, filmEnded, reduceMotion, showOpening]);

  return (
    <>
      <div data-route-content style={{ display: 'contents' }} ref={element => { if (element) element.inert = showOpening; }}>
        <Suspense fallback={null}><App onReady={showOpening ? setHomeRoute : undefined} onSceneReady={finishScene} /></Suspense>
      </div>
      {showOpening && (reduceMotion
        ? <div className="arrival-loading" role="status" aria-label="Loading Astro Laabh"><img src="/story/logo-opening.webp" alt="" /></div>
        : <AtelierArrival includeVisit={includeVisit} onFinish={finishFilm} assetsReady={assetsReady} waiting={filmEnded && !assetsReady} />)}
    </>
  );
}
