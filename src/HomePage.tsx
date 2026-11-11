import { useEffect } from 'react';
import { scrollToTarget } from './lib/lenis';
import { ScrollTrigger } from './lib/gsap';
import { Navbar } from './components/dom/layout/Navbar';
import { Footer } from './components/dom/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { HeroMarquee } from './components/sections/HeroMarquee';
import { NarrativeSection } from './components/sections/NarrativeSection';
import GemstoneCollectionSection from './components/sections/GemstoneCollectionSection';
import GemstoneShowcaseSection from './components/sections/GemstoneShowcaseSection';
import { GallerySection } from './components/sections/GallerySection';
import { WearGemstoneSection } from './components/sections/WearGemstoneSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import CTASection from './components/sections/CTASection';
import FAQSection from './components/sections/FAQSection';


export default function HomePage() {
  useEffect(() => {
    let settled = 0;
    const frame = requestAnimationFrame(() => {
      settled = requestAnimationFrame(() => {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target) { ScrollTrigger.refresh(); scrollToTarget(target, -78); }
      });
    });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(settled); };
  }, []);
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#2C1F14] selection:bg-[#D4AF37] selection:text-black">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Luxury Storytelling & Gemstone Flow */}
      <main className="relative z-10">
        {/* 1. Hero Section (Landing Page - 2 CTA Buttons) */}
        <HeroSection />

        {/* 2. Scrolling Text Marquee */}
        <HeroMarquee />

        {/* 3. Brand Story (How AstroLaabh Brings the Gems) */}
        <NarrativeSection />

        {/* 4. Explore Navaratna Collection */}
        <GemstoneCollectionSection />

        {/* 5. Explore Our Collection (Pancharatna Gemstone Showcase) */}
        <GemstoneShowcaseSection />

        {/* 6. Image Gallery (Gemstones & Fine Jewellery) */}
        <GallerySection />

        {/* 7. How You Can Wear Gemstones (Editorial Sequence) */}
        <WearGemstoneSection />

        {/* 8. Customer Reviews & Testimonials (Themed with interactive animation) */}
        <TestimonialsSection />

        {/* 9. Final Full-Page Chakra CTA Section */}
        <CTASection />

        {/* 11. Frequently Asked Questions (Redesigned 2-Column Luxury Layout & Spring Animations) */}
        <FAQSection />
      </main>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
