import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { resetPageScroll } from './lib/lenis';
import { useLenis } from './hooks/useLenis';
const HomePage = lazy(() => import('./HomePage'));
const ProductPage = lazy(() => import('./components/sections/ProductPage').then(module => ({ default: module.ProductPage })));
const CheckoutPage = lazy(() => import('./components/sections/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const CartPage = lazy(() => import('./components/sections/CartPage').then(module => ({ default: module.CartPage })));

const FindGemPage = lazy(() => import('./components/sections/FindGemPage'));

export function App() {
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

  if (route === 'find-gem') return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5f0e6' }} />}><FindGemPage /></Suspense>;
  if (route === 'checkout') return <CheckoutPage />;
  if (route === 'cart') return <CartPage />;

  if (route !== 'home') {
    return <ProductPage key={route} gemstoneId={route} />;
  }

  return <HomePage />;
}

export default function AppWithSuspense() {
  return <Suspense fallback={<div className="route-loading" role="status">Opening your stone journey…</div>}><App /></Suspense>;
}
