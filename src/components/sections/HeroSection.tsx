import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BadgeCheck, Flower2, ShieldCheck, Sparkles, X } from 'lucide-react';
import rubyImg from '../../assets/optimized/ruby.webp';
import emeraldImg from '../../assets/optimized/emerald.webp';
import sapphireImg from '../../assets/optimized/sapphire.webp';
import diamondImg from '../../assets/optimized/diamond.webp';
import goldImg from '../../assets/optimized/gold.webp';
import pearlImg from '../../assets/optimized/pearl.webp';
import { HeroPortalCanvas } from '../canvas/HeroPortalCanvas';

export interface GemstoneInfo {
  id: 'ruby' | 'emerald' | 'sapphire' | 'diamond' | 'gold' | 'pearl';
  name: string;
  sanskritName: string;
  planet: string;
  planetEn: string;
  zodiac: string;
  energy: string;
  carat: string;
  origin: string;
  description: string;
  colorName: string;
  accentHex: string;
  image: string;
  fx: number;
  fy: number;
  size: number;
}

const GEMSTONES: GemstoneInfo[] = [
  {
    id: 'ruby',
    name: 'Burmese Ruby',
    sanskritName: 'माणिक्य',
    planet: 'सूर्य',
    planetEn: 'Surya (Sun)',
    zodiac: 'Leo (Simha)',
    energy: 'Vitality, Leadership & Inner Radiance',
    carat: '4.15 Carats',
    origin: 'Mogok, Myanmar',
    description: 'The King of Gemstones. Untreated Pigeon Blood crimson hue that harnesses the solar life-force for sovereign authority, courage, and magnetic radiance.',
    colorName: 'Pigeon Blood Crimson',
    accentHex: '#ff1f5a',
    image: rubyImg,
    fx: 0.6552,
    fy: 0.5046,
    size: 85,
  },
  {
    id: 'emerald',
    name: 'Colombian Emerald',
    sanskritName: 'मरकत',
    planet: 'बुध',
    planetEn: 'Budha (Mercury)',
    zodiac: 'Gemini & Virgo',
    energy: 'Intellect, Eloquence & Abundance',
    carat: '3.60 Carats',
    origin: 'Muzo Valley, Colombia',
    description: 'Vibrant verdant crystal channeling mercurial intelligence, sharp business acumen, and harmonious communication.',
    colorName: 'Lush Botanical Green',
    accentHex: '#00e575',
    image: emeraldImg,
    fx: 0.5360,
    fy: 0.4333,
    size: 50,
  },
  {
    id: 'sapphire',
    name: 'Kashmir Blue Sapphire',
    sanskritName: 'नीलम',
    planet: 'शनि',
    planetEn: 'Shani (Saturn)',
    zodiac: 'Capricorn & Aquarius',
    energy: 'Focus, Discipline & Karmic Elevation',
    carat: '4.80 Carats',
    origin: 'Padder Valley, Kashmir',
    description: 'Velvety cornflower blue gem that awakens profound discernment, unwavering patience, and spiritual protection against karmic obstacles.',
    colorName: 'Royal Cornflower Blue',
    accentHex: '#2575fc',
    image: sapphireImg,
    fx: 0.5285,
    fy: 0.5733,
    size: 50,
  },
  {
    id: 'diamond',
    name: 'Solitaire Diamond',
    sanskritName: 'हीरा',
    planet: 'शुक्र',
    planetEn: 'Shukra (Venus)',
    zodiac: 'Taurus & Libra',
    energy: 'Artistic Grace & Harmonious Luxury',
    carat: '2.70 Carats (VVS1)',
    origin: 'Golconda Heritage',
    description: 'Flawless brilliant crystal carrying the harmonic aesthetic energy of Venus, inspiring creative genius, magnetic allure, and prosperity.',
    colorName: 'D-Flawless Pure Ice',
    accentHex: '#d8f0ff',
    image: diamondImg,
    fx: 0.7610,
    fy: 0.3533,
    size: 52,
  },
  {
    id: 'gold',
    name: 'Yellow Sapphire',
    sanskritName: 'पुखराज',
    planet: 'बृहस्पति',
    planetEn: 'Guru (Jupiter)',
    zodiac: 'Sagittarius & Pisces',
    energy: 'Wisdom, Prosperity & Spiritual Grace',
    carat: '5.25 Carats',
    origin: 'Ceylon, Sri Lanka',
    description: 'Golden radiant crystal known as Pushparagam, channeling divine wisdom, educational mastery, and sovereign abundance.',
    colorName: 'Warm Canary Gold',
    accentHex: '#ffaa00',
    image: goldImg,
    fx: 0.8191,
    fy: 0.4633,
    size: 55,
  },
  {
    id: 'pearl',
    name: 'South Sea Pearl',
    sanskritName: 'मुक्ता',
    planet: 'चन्द्र',
    planetEn: 'Chandra (Moon)',
    zodiac: 'Cancer (Karka)',
    energy: 'Serenity, Emotional Intuition & Peace',
    carat: '11.4 mm',
    origin: 'South Sea, Australia',
    description: 'Naturally formed spherical pearl with deep iridescent orient, soothing emotional turbulence and cultivating tranquil clarity.',
    colorName: 'Lustrous Champagne White',
    accentHex: '#fff3db',
    image: pearlImg,
    fx: 0.7553,
    fy: 0.5900,
    size: 52,
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredStone, setHoveredStone] = useState<GemstoneInfo | null>(null);
  const [activeStone, setActiveStone] = useState<GemstoneInfo | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Responsive image dimensions matching 16:9 aspect ratio
  const [bounds, setBounds] = useState({ width: 1440, height: 810, left: 0, top: 0, scale: 1 });

  const updateBounds = useCallback(() => {
    if (!sectionRef.current) return;
    const w = sectionRef.current.clientWidth;
    const h = sectionRef.current.clientHeight;
    const imgAspect = 1376 / 768;
    const containerAspect = w / h;

    let renderW: number;
    let renderH: number;
    let left: number;
    let top: number;

    if (containerAspect > imgAspect) {
      renderW = w;
      renderH = w / imgAspect;
      left = 0;
      top = (h - renderH) / 2;
    } else {
      renderH = h;
      renderW = h * imgAspect;
      top = 0;
      left = (w - renderW) / 2;
    }

    setBounds({
      width: renderW,
      height: renderH,
      left,
      top,
      scale: renderW / 1376,
    });
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds, { passive: true });
    return () => window.removeEventListener('resize', updateBounds);
  }, [updateBounds]);

  // Smooth scroll listener
  useEffect(() => {
    let animId: number | null = null;
    const handleScroll = () => {
      if (animId !== null) return;
      animId = requestAnimationFrame(() => {
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const progress = Math.max(0, Math.min(1, -rect.top / (viewportHeight * 0.95)));
          setScrollProgress(progress);
        }
        animId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animId !== null) cancelAnimationFrame(animId);
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;
    setMouseOffset({ x: normX, y: normY });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="astrology-hero relative isolate min-h-[560px] h-screen w-full overflow-hidden text-[#17140f] select-none"
    >
      {/* 
        LAYER 1: Dedicated HTML5 Canvas with Seamlessly Blended 3D Video
        - Draws the full panoramic Himalayan dawn landscape
        - Draws the rotating gemstones & glowing orbits video with soft cosine feathering
        - Solidly anchored with zero flat horizontal sliding
      */}
      <HeroPortalCanvas
        scrollProgress={scrollProgress}
        mouseOffset={mouseOffset}
        hoveredGemId={hoveredStone?.id}
      />
      <div aria-hidden="true" className="hero-warmth absolute inset-0 z-10 pointer-events-none" />

      {/* 
        LAYER 2: Interactive Gemstone Hit Targets & Tooltips
        - Mathematically locked to the stone portal on the right
        - Pure opacity transitions: NO zoom-in/out scale jumping
      */}
      <div
        className="hero-hit-targets absolute pointer-events-none z-20"
        style={{
          left: `${bounds.left}px`,
          top: `${bounds.top}px`,
          width: `${bounds.width}px`,
          height: `${bounds.height}px`,
          transform: `translate3d(0, ${scrollProgress * 25}px, 0)`,
        }}
      >
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          {GEMSTONES.map((gem) => {
            const isHovered = hoveredStone?.id === gem.id;
            const posX = gem.fx * bounds.width;
            const posY = gem.fy * bounds.height;
            const size = gem.size * bounds.scale;

            return (
              <div
                key={gem.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                style={{
                  left: `${posX}px`,
                  top: `${posY}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                onPointerEnter={() => setHoveredStone(gem)}
                onPointerLeave={() => setHoveredStone(null)}
                onMouseEnter={() => setHoveredStone(gem)}
                onMouseLeave={() => setHoveredStone(null)}
                onClick={() => setActiveStone(gem)}
                title={gem.name}
              >
                {/* Subtle Refractive Bloom - NO SCALE ZOOM */}
                <div
                  className="absolute inset-0 rounded-full transition-opacity duration-200 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${gem.accentHex}45 0%, transparent 70%)`,
                    opacity: isHovered ? 0.75 : 0,
                    filter: 'blur(8px)',
                  }}
                />

                {/* Subtle Center Sparkle Point */}
                <div
                  className="w-full h-full rounded-full transition-opacity duration-200 flex items-center justify-center pointer-events-none"
                  style={{
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: '#ffffff',
                      boxShadow: `0 0 10px 3px ${gem.accentHex}, 0 0 18px 5px #ffffff88`,
                    }}
                  />
                </div>

                {/* Tooltip without scale bounce */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute left-1/2 -top-20 -translate-x-1/2 pointer-events-none z-50 whitespace-nowrap"
                    >
                      <div className="px-3.5 py-2 rounded-xl bg-[#1e1913]/94 backdrop-blur-md border border-[#dfbe82]/40 shadow-[0_12px_32px_rgba(0,0,0,0.35)] text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium tracking-wider text-[#d4af37]">
                          <span className="font-serif">{gem.sanskritName}</span>
                          <span>✦</span>
                          <span className="uppercase text-[9px] tracking-widest">{gem.planetEn}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#fcf8f0] font-serif mt-0.5">
                          {gem.name}
                        </div>
                      </div>
                      <div className="w-2 h-2 rotate-45 bg-[#1e1913]/94 border-r border-b border-[#dfbe82]/40 mx-auto -mt-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        LAYER 3: Foreground Editorial Hero Content - Centered & Balanced
      */}
      <div className="hero-editorial relative z-30 h-full w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center pt-8 pb-16 pointer-events-none">
        <div
          className="hero-editorial-copy max-w-md sm:max-w-lg lg:max-w-[46%] pointer-events-auto transition-transform duration-200"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 50}px, 0)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.5),
          }}
        >
          {/* Eyebrow Subtitle */}
          <p className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-serif font-medium uppercase tracking-[0.32em] text-[#554b3d] mb-3 sm:mb-4">
            <span>ANCIENT WISDOM</span>
            <span className="text-[#a47b39] text-xs leading-none">✦</span>
            <span>MODERN GUIDANCE</span>
          </p>

          {/* Main Headline matching Reference Concept Art */}
          <h1 className="font-serif text-[2.5rem] sm:text-[3.3rem] lg:text-[4.0rem] xl:text-[4.4rem] font-normal leading-[0.96] tracking-[-0.035em] text-[#20190f] drop-shadow-[0_1px_1px_rgba(255,252,244,0.75)]">
            Every stone
            <br />
            has a{' '}
            <span className="italic font-serif font-light text-[#805a22]">
              story.
            </span>
            <br />
            Find yours.
          </h1>

          {/* Delicate Star Hairline Flourish */}
          <div className="flex items-center gap-3 my-3 sm:my-4 w-40 text-[#8a642c]">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#a8864f] to-transparent opacity-70" />
            <span className="text-xs">✦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-[#a8864f] to-transparent opacity-70" />
          </div>

          <p className="max-w-[430px] text-[14px] sm:text-[16px] leading-[1.5] text-[#21180f] font-medium font-serif drop-shadow-[0_1px_1px_rgba(255,252,244,0.9)]">
            Formed by the earth. Chosen with Vedic wisdom. Worn in your own way.
          </p>

          {/* Interactive CTA Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Primary Amber-Gold Button */}
            <button
              onClick={() => scrollTo('gemstone-collection')}
              className="group h-[48px] px-6 sm:px-7 rounded-full bg-[#332319] hover:bg-[#4a3320] text-[#fffaf0] font-serif text-[13px] sm:text-[14px] tracking-wide shadow-[0_8px_22px_rgba(42,29,16,0.3)] hover:shadow-[0_11px_28px_rgba(42,29,16,0.38)] transition-all duration-300 flex items-center gap-2.5 active:scale-98 border border-[#d6b577]/80"
            >
              <span>Explore gemstones</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Secondary guidance action */}
            <button
              onClick={() => { window.location.hash = 'find-gem'; }}
              className="group h-[48px] flex items-center gap-2.5 rounded-full border border-[#805b2a] bg-[#fbf4e8]/95 px-5 text-[#24190f] font-serif font-semibold text-[13px] sm:text-[14px] shadow-[0_6px_18px_rgba(57,39,17,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf1] hover:shadow-[0_9px_22px_rgba(57,39,17,0.25)]"
            >
              <span className="w-8 h-8 rounded-full border border-[#8f6727]/60 flex items-center justify-center bg-[#f1e2c6] transition-transform duration-300 group-hover:scale-105">
                <Sparkles className="w-4 h-4 text-[#8f6727]" />
              </span>
              <span>Find your gem</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        LAYER 4: Floating Glassmorphic Trust Bar ALWAYS Visible above Bottom Edge
      */}
      <div className="hero-trust absolute bottom-3 sm:bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-auto">
        <div className="flex flex-wrap items-center justify-between w-full max-w-3xl lg:max-w-4xl px-6 sm:px-10 py-2.5 sm:py-3 rounded-full bg-[#f6ead6]/90 border border-white/80 shadow-[0_10px_35px_rgba(45,30,10,0.12)] text-[#2d2419] font-serif text-[12px] sm:text-[13px] tracking-wide transition-all">
          <div className="flex items-center gap-2.5">
            <Flower2 className="w-4 h-4 text-[#a67c3b]" />
            <span className="font-medium">Vedic Guidance</span>
          </div>
          <div className="hidden sm:block h-3.5 w-[1px] bg-[#5c4a35]/20" />
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#a67c3b]" />
            <span className="font-medium">Authentic Gems</span>
          </div>
          <div className="hidden sm:block h-3.5 w-[1px] bg-[#5c4a35]/20" />
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#a67c3b]" />
            <span className="font-medium">Certified &amp; Trusted</span>
          </div>
          <div className="hidden sm:block h-3.5 w-[1px] bg-[#5c4a35]/20" />
          <div className="flex items-center gap-2.5">
            <BadgeCheck className="w-4 h-4 text-[#a67c3b]" />
            <span className="font-medium">Personalized for You</span>
          </div>
        </div>
      </div>

      {/* Gemstone Modal Dialog for Clicked Stones */}
      <AnimatePresence>
        {activeStone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto"
            onClick={() => setActiveStone(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-[#fdfaf5] border border-[#d9ba7d]/50 p-6 sm:p-8 shadow-2xl text-[#241e16]"
            >
              <button
                onClick={() => setActiveStone(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#eee4d0]/60 hover:bg-[#eee4d0] text-[#544d41] transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-5">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center p-2"
                  style={{ background: `radial-gradient(circle, ${activeStone.accentHex}22 0%, transparent 70%)` }}
                >
                  <img src={activeStone.image} alt={activeStone.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-sm font-medium tracking-widest text-[#9b7337] uppercase font-serif">
                    {activeStone.sanskritName} ✦ {activeStone.planetEn}
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#1a1611]">{activeStone.name}</h3>
                  <p className="text-xs text-[#6e6556] mt-0.5">Origin: {activeStone.origin}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-sm leading-relaxed text-[#423a2f] font-serif">{activeStone.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#dfd5c2] font-serif">
                  <div>
                    <span className="text-[#7c7263]">Energy:</span>{' '}
                    <strong className="text-[#2b241a] font-medium">{activeStone.energy}</strong>
                  </div>
                  <div>
                    <span className="text-[#7c7263]">Zodiac:</span>{' '}
                    <strong className="text-[#2b241a] font-medium">{activeStone.zodiac}</strong>
                  </div>
                  <div>
                    <span className="text-[#7c7263]">Specimen:</span>{' '}
                    <strong className="text-[#2b241a] font-medium">{activeStone.carat}</strong>
                  </div>
                  <div>
                    <span className="text-[#7c7263]">Shade:</span>{' '}
                    <strong className="text-[#2b241a] font-medium">{activeStone.colorName}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setActiveStone(null);
                    scrollTo('craftsmanship');
                  }}
                  className="flex-1 py-3 rounded-full bg-gradient-to-b from-[#a47b39] to-[#714f19] hover:from-[#b38842] hover:to-[#7e581e] text-white font-serif text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Book Astro Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default HeroSection;
