import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLenis } from './hooks/useLenis';
import { Navbar } from './components/dom/layout/Navbar';
import { Footer } from './components/dom/layout/Footer';
import { Preloader } from './components/dom/ui/Preloader';
import { CartDrawer } from './components/dom/ui/CartDrawer';
import { HeroSection } from './components/sections/HeroSection';
import { HeroMarquee } from './components/sections/HeroMarquee';

const NarrativeSection = lazy(() => import('./components/sections/NarrativeSection').then((module) => ({ default: module.NarrativeSection })));
const GemstoneCollectionSection = lazy(() => import('./components/sections/GemstoneCollectionSection'));
const GemstoneShowcaseSection = lazy(() => import('./components/sections/GemstoneShowcaseSection'));
const GallerySection = lazy(() => import('./components/sections/GallerySection').then((module) => ({ default: module.GallerySection })));
const WearGemstoneSection = lazy(() => import('./components/sections/WearGemstoneSection'));
const TestimonialsSection = lazy(() => import('./components/sections/TestimonialsSection').then((module) => ({ default: module.TestimonialsSection })));
const AppointmentSection = lazy(() => import('./components/sections/AppointmentSection').then((module) => ({ default: module.AppointmentSection })));
const CTASection = lazy(() => import('./components/sections/CTASection'));
const FAQSection = lazy(() => import('./components/sections/FAQSection'));

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
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#2C1F14] selection:bg-[#D4AF37] selection:text-black">
      {/* Sacred AstroLaabh Water & Gold Chakra Preloader */}
      <Preloader />

      {/* Navigation Header */}
      <Navbar />

      {/* Interactive Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Main Luxury Storytelling & Gemstone Flow */}
      <main className="relative z-10">
        {/* 1. Hero Section (Landing Page - 2 CTA Buttons) */}
        <HeroSection />

        {/* 2. Scrolling Text Marquee */}
        <HeroMarquee />

        {/* 3. Brand Story (How AstroLaabh Brings the Gems) */}
        <LazyMount minHeight="760px"><NarrativeSection /></LazyMount>

        {/* 4. Explore Navaratna Collection */}
        <LazyMount minHeight="1000px"><GemstoneCollectionSection /></LazyMount>

        {/* 5. Explore Our Collection (Pancharatna Gemstone Showcase) */}
        <LazyMount minHeight="760px"><GemstoneShowcaseSection /></LazyMount>

        {/* 6. Image Gallery (Gemstones & Fine Jewellery) */}
        <LazyMount minHeight="760px"><GallerySection /></LazyMount>

        {/* 7. How You Can Wear Gemstones (Editorial Sequence) */}
        <LazyMount minHeight="100vh" className="bg-[#f6f1e7]"><WearGemstoneSection /></LazyMount>

        {/* 8. Customer Reviews & Testimonials (Themed with interactive animation) */}
        <LazyMount minHeight="850px"><TestimonialsSection /></LazyMount>

        {/* 9. Book an Appointment (Astrologer Consultation) */}
        <LazyMount minHeight="850px"><AppointmentSection /></LazyMount>

        {/* 10. Final CTA Section (Find Your Gemstone / Explore Collection) */}
        <LazyMount minHeight="650px"><CTASection /></LazyMount>

        {/* 11. Frequently Asked Questions (FAQs) */}
        <LazyMount minHeight="750px"><FAQSection /></LazyMount>
      </main>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}

export default App;
