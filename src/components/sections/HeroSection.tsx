import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BadgeCheck, Flower2, Play, ShieldCheck, Sparkles, X } from 'lucide-react';
import rubyImg from '../../assets/ruby.png';
import emeraldImg from '../../assets/emerald.png';
import sapphireImg from '../../assets/sapphire.png';
import diamondImg from '../../assets/diamond.png';
import goldImg from '../../assets/gold.png';
import pearlImg from '../../assets/pearl.png';
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
  // Normalized percentage coordinates relative to the 1024x576 scene plate
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
    fx: 0.619,
    fy: 0.472,
    size: 105,
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
    fx: 0.481,
    fy: 0.389,
    size: 65,
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
    fx: 0.466,
    fy: 0.563,
    size: 65,
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
    fx: 0.733,
    fy: 0.310,
    size: 68,
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
    fx: 0.819,
    fy: 0.421,
    size: 72,
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
    fx: 0.749,
    fy: 0.564,
    size: 70,
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredStone, setHoveredStone] = useState<GemstoneInfo | null>(null);
  const [activeStone, setActiveStone] = useState<GemstoneInfo | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Responsive image dimensions matching object-cover math
  const [bounds, setBounds] = useState({ width: 1440, height: 810, left: 0, top: 0, scale: 1 });

  const updateBounds = useCallback(() => {
    if (!sectionRef.current) return;
    const w = sectionRef.current.clientWidth;
    const h = sectionRef.current.clientHeight;
    const imgAspect = 1024 / 576; // 16:9
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
      scale: renderW / 1024,
    });
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds, { passive: true });
    return () => window.removeEventListener('resize', updateBounds);
  }, [updateBounds]);

  // Smooth scroll listener for GPU-driven interactive depth parallax
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

  // Subtle pointer tracking for tactile 3D perspective depth tilt
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const normY = (clientY / innerHeight - 0.5) * 2; // -1 to 1
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
      className="astrology-hero relative isolate min-h-[760px] h-screen w-full overflow-hidden text-[#17140f] select-none"
      style={{
        perspective: '1200px',
      }}
    >
      {/* 
        3D Perspective Viewport wrapper:
        Provides subtle camera pitch & yaw tilt that reacts to cursor position in true 3D space,
        making the scene feel authentically 3D rendered without flat left-to-right layer sliding.
      */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `rotateX(${-mouseOffset.y * 1.4}deg) rotateY(${mouseOffset.x * 1.6}deg)`,
          transition: 'transform 0.22s cubic-bezier(0.2, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 
          LAYER 1: Dedicated HTML5 Canvas with Seamlessly Blended 3D Video & Radiant Lighting Engine
          - Draws the full panoramic Himalayan dawn landscape
          - Draws the rotating gemstones & glowing orbits video with a soft feather mask
          - Draws volumetric dawn sunbeams, godrays, solar ruby flares, and gem specular starbursts
        */}
        <HeroPortalCanvas
          scrollProgress={scrollProgress}
          mouseOffset={mouseOffset}
          hoveredGemId={hoveredStone?.id}
        />

        {/* Luminous Warm Dawn Ambient Glow - Zero Murky Green/Gray Dullness */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff9ec]/20 via-transparent to-[#ffe6be]/22 pointer-events-none z-15" />
      </div>

      {/* 
        LAYER 2: Interactive Gemstone Hit Targets & Tooltips
        - Mathematically locked to the stone portal on the right
        - Hovering reveals the authentic prismatic gleam and Vedic insights tooltip
        - Zero scale jumping or cartoonish zooming in/out
      */}
      <div
        className="absolute pointer-events-none z-25"
        style={{
          left: `${bounds.left}px`,
          top: `${bounds.top}px`,
          width: `${bounds.width}px`,
          height: `${bounds.height}px`,
          transform: `translate3d(0, ${scrollProgress * 30}px, 0)`,
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
                onMouseEnter={() => setHoveredStone(gem)}
                onMouseLeave={() => setHoveredStone(null)}
                onClick={() => setActiveStone(gem)}
                title={gem.name}
              >
                {/* Authentic Ethereal Refraction Gleam on Hover - NO ZOOM / NO SCALE JUMP */}
                <div
                  className="absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${gem.accentHex}55 0%, transparent 70%)`,
                    opacity: isHovered ? 0.85 : 0,
                    filter: 'blur(6px)',
                  }}
                />

                {/* Subtle Central Prismatic Sparkle on Hover */}
                <div
                  className="w-full h-full rounded-full transition-opacity duration-250 flex items-center justify-center pointer-events-none"
                  style={{
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: '#ffffff',
                      boxShadow: `0 0 12px 3px ${gem.accentHex}, 0 0 20px 6px #ffffff99`,
                    }}
                  />
                </div>

                {/* Elegant Hover Tooltip - Smooth Fade without Scale Bounce */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
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
        LAYER 3: Foreground Editorial & Hero Content
        - Left column text matching the reference concept art 1:1
        - Bottom floating glassmorphic trust bar
      */}
      <div className="relative z-30 h-full w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-between pt-32 pb-8 sm:pb-10 pointer-events-none">
        {/* Left Editorial Copy matching Concept Art 1:1 */}
        <div
          className="max-w-xl lg:w-[48%] pt-6 lg:pt-10 pointer-events-auto transition-transform duration-200"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 60}px, 0)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.4),
          }}
        >
          {/* Eyebrow Subtitle */}
          <p className="flex items-center gap-3 text-[11px] sm:text-xs font-serif font-medium uppercase tracking-[0.35em] text-[#554b3d] mb-6">
            <span>ANCIENT WISDOM</span>
            <span className="text-[#a47b39] text-sm leading-none">✦</span>
            <span>MODERN GUIDANCE</span>
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-[4rem] sm:text-[4.8rem] lg:text-[5.4rem] xl:text-[6rem] font-normal leading-[0.96] tracking-[-0.03em] text-[#1c1813]">
            Gemstones
            <br />
            That{' '}
            <span className="italic font-serif font-light text-[#b88c4a] drop-shadow-[0_2px_12px_rgba(184,140,74,0.2)]">
              Align
            </span>
            <br />
            With You
          </h1>

          {/* Delicate Star Hairline Flourish */}
          <div className="flex items-center gap-3 my-7 w-48 text-[#a8864f]">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#a8864f] to-transparent opacity-70" />
            <span className="text-xs">✦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-[#a8864f] to-transparent opacity-70" />
          </div>

          {/* Interactive CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-6">
            {/* Primary Amber-Gold Button */}
            <button
              onClick={() => scrollTo('narrative')}
              className="group h-[52px] px-8 rounded-full bg-gradient-to-b from-[#a67c3b] via-[#926829] to-[#73501a] hover:from-[#b58a44] hover:to-[#825a20] text-[#fffdf7] font-serif text-[15px] tracking-wide shadow-[0_8px_24px_rgba(113,79,25,0.38)] hover:shadow-[0_12px_32px_rgba(113,79,25,0.5)] transition-all duration-300 flex items-center gap-3.5 active:scale-98 border border-[#e5c387]/40"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Secondary Frosted Glass Play Button */}
            <button
              onClick={() => scrollTo('craftsmanship')}
              className="group flex items-center gap-3.5 text-[#241e16] font-serif text-[15px] hover:text-[#8f6727] transition-colors"
            >
              <span className="w-11 h-11 rounded-full border-[1.5px] border-[#382f23]/70 group-hover:border-[#8f6727] flex items-center justify-center bg-white/40 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/60">
                <Play className="w-3.5 h-3.5 fill-[#241e16] text-[#241e16] ml-0.5 group-hover:fill-[#8f6727] group-hover:text-[#8f6727] transition-colors" />
              </span>
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* Floating Glassmorphic Trust Bar matching Concept Art 1:1 */}
        <div
          className="w-full flex justify-center pb-2 pointer-events-auto transition-transform duration-200"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 25}px, 0)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.8),
          }}
        >
          <div className="flex flex-wrap items-center justify-between w-full max-w-4xl px-8 sm:px-12 py-3.5 rounded-full bg-[#fdfaf5]/40 backdrop-blur-xl border border-white/70 shadow-[0_12px_40px_rgba(50,35,15,0.08)] text-[#2d261e] font-serif text-xs sm:text-[14px] tracking-wide">
            <div className="flex items-center gap-3">
              <Flower2 className="w-4 h-4 text-[#a37c44]" />
              <span>Vedic Guidance</span>
            </div>
            <div className="hidden sm:block h-4 w-[1px] bg-[#382f23]/20" />
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#a37c44]" />
              <span>Authentic Gems</span>
            </div>
            <div className="hidden sm:block h-4 w-[1px] bg-[#382f23]/20" />
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#a37c44]" />
              <span>Certified &amp; Trusted</span>
            </div>
            <div className="hidden sm:block h-4 w-[1px] bg-[#382f23]/20" />
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-4 h-4 text-[#a37c44]" />
              <span>Personalized for You</span>
            </div>
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
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
