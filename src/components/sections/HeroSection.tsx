import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BadgeCheck, Flower2, Play, ShieldCheck, Sparkles, X, Compass } from 'lucide-react';
import sanctuaryBg from '../../assets/sanctuary_bg.jpg';
import stonePortal from '../../assets/stone_portal.png';
import ruby from '../../assets/ruby.png';
import emerald from '../../assets/emerald.png';
import sapphire from '../../assets/sapphire.png';
import gold from '../../assets/gold.png';
import diamond from '../../assets/diamond.png';
import pearl from '../../assets/pearl.png';
import { useCreativeStore } from '../../store/useCreativeStore';

export interface GemstoneInfo {
  id: 'ruby' | 'emerald' | 'sapphire' | 'gold' | 'pearl' | 'diamond';
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
  coords: { left: string; top: string; size: number; zIndex: number };
  scrollVector: { dx: number; dy: number; scale: number };
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
    description: 'The King of Gemstones. Untreated Pigeon Blood hue that harnesses the solar life-force for authority, courage, and magnetic presence.',
    colorName: 'Pigeon Blood Crimson',
    accentHex: '#ff2a5f',
    image: ruby,
    coords: { left: '50%', top: '48%', size: 104, zIndex: 30 },
    scrollVector: { dx: 0, dy: -25, scale: 1.18 },
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
    description: 'Vibrant verdant crystal channeling mercurial intelligence, business acumen, and harmonious communication.',
    colorName: 'Lush Botanical Green',
    accentHex: '#00e575',
    image: emerald,
    coords: { left: '33%', top: '27%', size: 76, zIndex: 25 },
    scrollVector: { dx: -70, dy: -45, scale: 1.1 },
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
    description: 'Velvety cornflower blue gem that awakens profound discernment, unwavering patience, and spiritual protection.',
    colorName: 'Royal Cornflower Blue',
    accentHex: '#2575fc',
    image: sapphire,
    coords: { left: '26%', top: '64%', size: 72, zIndex: 24 },
    scrollVector: { dx: -85, dy: 55, scale: 1.08 },
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
    image: gold,
    coords: { left: '72%', top: '32%', size: 74, zIndex: 26 },
    scrollVector: { dx: 75, dy: -40, scale: 1.12 },
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
    image: pearl,
    coords: { left: '71%', top: '68%', size: 68, zIndex: 25 },
    scrollVector: { dx: 80, dy: 50, scale: 1.06 },
  },
  {
    id: 'diamond',
    name: 'Solitaire Diamond',
    sanskritName: 'हीरा',
    planet: 'शुक्र',
    planetEn: 'Shukra (Venus)',
    zodiac: 'Taurus & Libra',
    energy: 'Beauty, Artistic Grace & Harmonic Luxury',
    carat: '2.70 Carats (VVS1)',
    origin: 'Golconda Heritage',
    description: 'Flawless brilliant crystal carrying the harmonic aesthetic energy of Venus, inspiring creative genius and enduring romance.',
    colorName: 'D-Flawless Pure Ice',
    accentHex: '#d8f0ff',
    image: diamond,
    coords: { left: '63%', top: '15%', size: 66, zIndex: 24 },
    scrollVector: { dx: 60, dy: -70, scale: 1.08 },
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useCreativeStore((s) => s.setCurrentSection);
  const [activeStone, setActiveStone] = useState<GemstoneInfo | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Smooth scroll listener for GPU-driven interactive depth parallax
  useEffect(() => {
    let animId: number | null = null;
    const handleScroll = () => {
      if (animId !== null) return;
      animId = requestAnimationFrame(() => {
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const progress = Math.max(0, Math.min(1, -rect.top / (viewportHeight * 0.9)));
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

  // Subtle pointer tracking for tactile interactive depth tilt
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

  const handleSelectStone = (stone: GemstoneInfo) => {
    if (activeStone?.id === stone.id) {
      setActiveStone(null);
    } else {
      setActiveStone(stone);
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="astrology-hero relative isolate min-h-[920px] lg:min-h-screen w-full overflow-hidden text-[#17140f] select-none"
    >
      {/* 
        LAYER 1: Panoramic Sanctuary Dawn Lake Landscape
        - Real high-resolution dawn landscape with morning light, lotus flowers and temple pavilion
        - Parallax depth on scroll and subtle mouse tilt
      */}
      <div
        className="sanctuary-bg-layer absolute inset-0 w-full h-full pointer-events-none transform will-change-transform"
        style={{
          backgroundImage: `url(${sanctuaryBg})`,
          backgroundPosition: 'center 45%',
          backgroundSize: 'cover',
          transform: `translate3d(${mouseOffset.x * 6}px, ${scrollProgress * 65 + mouseOffset.y * 6}px, 0) scale(${1.03 + scrollProgress * 0.04})`,
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
        }}
      />

      {/* Atmospheric Dawn Warmth & Sunbeam Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fbf4e6]/30 via-transparent to-[#1a2e26]/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(255,230,170,0.35)_0%,transparent_65%)] pointer-events-none" />

      {/* 
        LAYER 2 & 3: Sacred Carved Stone Portal & Interactive Astrological Constellation Stage
        - Placed in center-right where lake water meets the sunlit sky
      */}
      <div className="portal-constellation-stage absolute inset-y-0 right-0 w-full lg:w-[58%] flex items-center justify-center pointer-events-none pt-12 sm:pt-6">
        <div
          className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[540px] md:h-[540px] lg:w-[600px] lg:h-[600px] will-change-transform"
          style={{
            transform: `translate3d(${mouseOffset.x * 12}px, ${scrollProgress * 105 + mouseOffset.y * 10}px, 0) perspective(1200px) rotateX(${mouseOffset.y * -4}deg) rotateY(${mouseOffset.x * 4}deg)`,
            transition: 'transform 0.18s cubic-bezier(0.2, 0, 0.2, 1)',
          }}
        >
          {/* 
            LAYER 2: Independent Carved Stone Torus Ring & Pedestal
            - Carved lunar phases, hollow aperture showing landscape behind
          */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={stonePortal}
              alt="Sacred Vedic Carved Stone Portal"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(50,30,10,0.32)] select-none [mask-image:linear-gradient(to_bottom,black_86%,transparent_99%)]"
            />
          </div>

          {/* 
            LAYER 3: Luminous Golden Celestial Light Orbits
            - Dynamic glowing SVG ellipses with animated shimmer
          */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible filter drop-shadow-[0_0_8px_rgba(255,215,130,0.6)]"
            viewBox="0 0 600 600"
          >
            <defs>
              <linearGradient id="orbitGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe4a0" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#d9a84e" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#fff8e1" stopOpacity="0.9" />
              </linearGradient>
              <radialGradient id="sunburstGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffeed1" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#e5a93b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Central Solar Radiance */}
            <circle cx="300" cy="290" r="140" fill="url(#sunburstGlow)" />

            {/* Dynamic Elliptical Orbital Tracks */}
            <ellipse
              cx="300"
              cy="290"
              rx="180"
              ry="82"
              fill="none"
              stroke="url(#orbitGold)"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              transform={`rotate(-14 300 290) scale(${1 + scrollProgress * 0.12})`}
              className="opacity-80"
            />
            <ellipse
              cx="300"
              cy="290"
              rx="235"
              ry="108"
              fill="none"
              stroke="url(#orbitGold)"
              strokeWidth="1.25"
              transform={`rotate(18 300 290) scale(${1 + scrollProgress * 0.16})`}
              className="opacity-70"
            />
            <ellipse
              cx="300"
              cy="290"
              rx="275"
              ry="135"
              fill="none"
              stroke="url(#orbitGold)"
              strokeWidth="1"
              strokeDasharray="12 4"
              transform={`rotate(-24 300 290) scale(${1 + scrollProgress * 0.2})`}
              className="opacity-60"
            />
          </svg>

          {/* 
            LAYER 4: Floating Authentic High-End Gemstones
            - Real isolated gemstone PNGs with interactive hover and inspection
            - Scroll-responsive expansion
          */}
          {GEMSTONES.map((gem) => {
            const isSelected = activeStone?.id === gem.id;
            const scrollDx = gem.scrollVector.dx * scrollProgress;
            const scrollDy = gem.scrollVector.dy * scrollProgress;
            const scrollScale = 1 + (gem.scrollVector.scale - 1) * scrollProgress;

            return (
              <motion.div
                key={gem.id}
                onClick={() => handleSelectStone(gem)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group"
                style={{
                  left: gem.coords.left,
                  top: gem.coords.top,
                  zIndex: isSelected ? 50 : gem.coords.zIndex,
                  transform: `translate3d(calc(-50% + ${scrollDx}px), calc(-50% + ${scrollDy}px), 0) scale(${scrollScale})`,
                }}
                whileHover={{ scale: 1.16, transition: { duration: 0.25, ease: 'easeOut' } }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Luminous Gemstone Glow */}
                <div
                  className="absolute inset-0 rounded-full blur-md transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundColor: gem.accentHex,
                    opacity: isSelected ? 0.65 : 0.25,
                    transform: 'scale(1.2)',
                  }}
                />

                {/* Gemstone Image */}
                <div
                  className="relative flex items-center justify-center transition-all duration-300"
                  style={{
                    width: `${gem.coords.size}px`,
                    height: `${gem.coords.size}px`,
                    filter: isSelected
                      ? `drop-shadow(0 0 20px ${gem.accentHex}) drop-shadow(0 12px 18px rgba(0,0,0,0.45))`
                      : 'drop-shadow(0 10px 14px rgba(45,30,10,0.35))',
                  }}
                >
                  <img
                    src={gem.image}
                    alt={`${gem.name} Vedic Gemstone`}
                    className="w-full h-full object-contain select-none pointer-events-none transform transition-transform group-hover:rotate-3"
                  />
                </div>

                {/* Quick Identification Tooltip Tag */}
                <div
                  className={`absolute -bottom-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full border text-[9px] font-serif tracking-widest uppercase whitespace-nowrap shadow-sm backdrop-blur-md transition-all duration-200 pointer-events-none ${
                    isSelected
                      ? 'bg-amber-950/85 text-amber-200 border-amber-400/60 opacity-100'
                      : 'bg-white/80 text-[#253229] border-white/60 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <span>{gem.sanskritName} · {gem.name.split(' ')[0]}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 
        LAYER 5: Content & Editorial Typography (Left Column)
      */}
      <div className="hero-inner relative z-30 mx-auto flex min-h-[820px] max-w-[1380px] items-center px-5 pb-32 pt-28 sm:px-10 lg:px-[8%] lg:pb-36">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="hero-copy relative z-30 w-full lg:w-[46%]"
          style={{
            transform: `translate3d(0, ${scrollProgress * -40}px, 0)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.4),
          }}
        >
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#aa8b58]/40 bg-[#fffaf0]/75 px-3.5 py-1 text-[10px] font-medium tracking-[0.28em] text-[#554c3e] backdrop-blur-md sm:text-xs">
            <span className="text-[#aa8b58]">✦</span>
            <span>ANCIENT WISDOM</span>
            <span className="text-[#aa8b58]">✦</span>
            <span>MODERN GUIDANCE</span>
          </div>

          {/* Luxury Editorial Heading */}
          <h1 className="hero-title font-serif text-[3.4rem] leading-[0.92] tracking-[-0.035em] text-[#1c1813] sm:text-[4.8rem] lg:text-[4.75rem] xl:text-[5.2rem]">
            Gemstones
            <br />
            That <em className="font-serif italic font-normal text-[#8c672b]">Align</em>
            <br />
            <span className="text-[#1c1813]">With You</span>
          </h1>

          <div className="hero-title-flourish my-4 w-32 border-b border-[#aa8b58]/40" aria-hidden="true" />

          <p className="max-w-[440px] font-serif text-sm sm:text-base leading-relaxed text-[#423a2f]/90 italic">
            Rare untreated gemstones hand-selected through Vedic astrology to balance your planetary energies and awaken harmony.
          </p>

          {/* Action CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              onClick={() => scrollTo('ways-to-wear')}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1e342b] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#fbf5e8] shadow-lg hover:bg-[#15251f] hover:shadow-xl transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => scrollTo('appointment')}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#aa8b58]/60 bg-[#fffaf0]/85 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#304d43] backdrop-blur-md hover:bg-white hover:border-[#aa8b58] transition-all"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#304d43] text-[#fffaf0]">
                <Play className="h-2.5 w-2.5 fill-current" />
              </span>
              <span>Consult Astrologer</span>
            </button>
          </div>

          {/* Interactive Gemstone Quick-Selector Dock */}
          <div className="mt-8 pt-4 border-t border-[#304d43]/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-[#5d584f] uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#aa8b58]" /> Inspect Planetary Gemstone:
              </span>
              {activeStone && (
                <button
                  onClick={() => setActiveStone(null)}
                  className="text-[10px] text-[#8c672b] hover:underline flex items-center gap-1 font-serif"
                >
                  <X className="w-3 h-3" /> Clear Selection
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {GEMSTONES.map((gem) => {
                const isSelected = activeStone?.id === gem.id;
                return (
                  <button
                    key={gem.id}
                    onClick={() => handleSelectStone(gem)}
                    className={`px-3 py-1 rounded-full text-xs font-serif transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1e342b] text-[#fbf5e8] shadow-md border border-[#aa8b58]'
                        : 'bg-[#fffaf0]/80 text-[#304d43] hover:bg-white border border-[#304d43]/15'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: gem.accentHex }} />
                    <span>{gem.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 
        LAYER 6: Interactive Awwwards-style Gemstone Detail Floating Sheet
        - Opens seamlessly in center-right / right side when a stone is clicked
      */}
      <AnimatePresence>
        {activeStone && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed lg:absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 lg:right-12 z-50 max-w-[390px] w-[calc(100%-32px)] rounded-3xl border border-[#aa8b58]/50 bg-[#fffdf9]/95 p-6 shadow-[0_24px_50px_rgba(30,20,10,0.25)] backdrop-blur-xl pointer-events-auto"
          >
            {/* Header with Close */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#aa8b58] uppercase">
                  Vedic Navratna · {activeStone.planetEn}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1a2922] mt-0.5 flex items-center gap-2">
                  <span>{activeStone.name}</span>
                  <span className="text-sm font-normal text-[#aa8b58]">({activeStone.sanskritName})</span>
                </h3>
              </div>
              <button
                onClick={() => setActiveStone(null)}
                className="p-1 rounded-full text-[#6b6255] hover:bg-[#aa8b58]/15 hover:text-black transition-colors"
                title="Close Inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gemstone Spec Tags */}
            <div className="grid grid-cols-2 gap-2 mt-3.5 py-3 border-y border-[#aa8b58]/20 text-xs font-serif">
              <div>
                <span className="text-[10px] text-[#786e60] uppercase block">Zodiac Alignment</span>
                <strong className="text-[#1a2922] font-medium">{activeStone.zodiac}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#786e60] uppercase block">Carat &amp; Cut</span>
                <strong className="text-[#1a2922] font-medium">{activeStone.carat}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#786e60] uppercase block">Primary Energy</span>
                <strong className="text-[#1a2922] font-medium">{activeStone.energy.split(',')[0]}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#786e60] uppercase block">Geographic Origin</span>
                <strong className="text-[#1a2922] font-medium">{activeStone.origin}</strong>
              </div>
            </div>

            <p className="mt-3 text-xs font-serif leading-relaxed text-[#4b4337] italic">
              "{activeStone.description}"
            </p>

            {/* CTAs */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => scrollTo('appointment')}
                className="flex-1 rounded-full bg-[#1e342b] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[#fbf5e8] shadow-md hover:bg-[#12231c] transition-all flex items-center justify-center gap-2"
              >
                <span>Consult for this Stone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollTo('ways-to-wear')}
                className="px-4 py-2.5 rounded-full border border-[#aa8b58]/80 text-[#1e342b] text-xs font-semibold uppercase tracking-wider hover:bg-[#aa8b58]/15 transition-all"
              >
                Designs
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        LAYER 7: Vedic Trust & Certification Bar
      */}
      <div className="absolute inset-x-5 sm:inset-x-10 lg:inset-x-[9%] bottom-4 sm:bottom-6 z-30">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="trust-bar flex flex-wrap items-center justify-around gap-4 rounded-full border border-white/60 bg-[#5b5143]/45 px-6 py-3.5 text-[#fffaf0] backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-serif">
            <Flower2 className="w-4 h-4 text-[#f6d998]" />
            <span>Vedic Guidance</span>
          </div>
          <i className="hidden sm:block h-5 w-px bg-white/30" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-serif">
            <Sparkles className="w-4 h-4 text-[#f6d998]" />
            <span>Authentic Gems</span>
          </div>
          <i className="hidden sm:block h-5 w-px bg-white/30" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-serif">
            <ShieldCheck className="w-4 h-4 text-[#f6d998]" />
            <span>Certified &amp; Trusted</span>
          </div>
          <i className="hidden sm:block h-5 w-px bg-white/30" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-serif">
            <BadgeCheck className="w-4 h-4 text-[#f6d998]" />
            <span>Personalized for You</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
