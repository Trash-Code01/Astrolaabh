import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLenis } from './hooks/useLenis';
import { Navbar } from './components/dom/layout/Navbar';
import { Footer } from './components/dom/layout/Footer';
import { Preloader } from './components/dom/ui/Preloader';
import { CartDrawer } from './components/dom/ui/CartDrawer';
import { HeroSection } from './components/sections/HeroSection';
import { HeroMarquee } from './components/sections/HeroMarquee';

const NarrativeSection = lazy(() => import('./components/sections/NarrativeSection').then((module) => ({ default: module.NarrativeSection })));
const GemstoneShowcaseSection = lazy(() => import('./components/sections/GemstoneShowcaseSection'));
const GallerySection = lazy(() => import('./components/sections/GallerySection').then((module) => ({ default: module.GallerySection })));
const WearGemstoneSection = lazy(() => import('./components/sections/WearGemstoneSection'));
const AppointmentSection = lazy(() => import('./components/sections/AppointmentSection').then((module) => ({ default: module.AppointmentSection })));
const TestimonialsSection = lazy(() => import('./components/sections/TestimonialsSection').then((module) => ({ default: module.TestimonialsSection })));

function LazyMount({ children, minHeight, className }: { children: ReactNode; minHeight?: string; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: '250px 0px' });

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className} style={{ minHeight }}>
      {shouldLoad ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
}

export function App() {
  useLenis();

  return (
    <div className="relative min-h-screen bg-brand-dark text-white selection:bg-brand-accent selection:text-black">
      {/* Sacred AstroLaabh Water & Gold Chakra Preloader */}
      <Preloader />

      {/* Navigation Header */}
      <Navbar />

      {/* Interactive Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Main Luxury Storytelling & Gemstone Flow */}
      <main className="relative z-10">
        <HeroSection />
        <HeroMarquee />
        <LazyMount minHeight="760px"><NarrativeSection /></LazyMount>
        <LazyMount minHeight="760px"><GemstoneShowcaseSection /></LazyMount>
        <LazyMount minHeight="760px"><GallerySection /></LazyMount>
        <LazyMount minHeight="100vh" className="bg-[#f6f1e7]"><WearGemstoneSection /></LazyMount>
        <LazyMount minHeight="800px"><AppointmentSection /></LazyMount>
        <LazyMount minHeight="850px"><TestimonialsSection /></LazyMount>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
