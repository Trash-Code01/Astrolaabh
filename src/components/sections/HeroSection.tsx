import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BadgeCheck, Flower2, Play, ShieldCheck, Sparkles, X, Compass, ExternalLink } from 'lucide-react';
import sanctuaryBg from '../../assets/sanctuary_bg.jpg';
import rubyImg from '../../assets/ruby.png';
import emeraldImg from '../../assets/emerald.png';
import sapphireImg from '../../assets/sapphire.png';
import diamondImg from '../../assets/diamond.png';
import goldImg from '../../assets/gold.png';
import pearlImg from '../../assets/pearl.png';
import { useCreativeStore } from '../../store/useCreativeStore';

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
  // Normalized percentage coordinates within the 3D video viewport
  vx: number;
  vy: number;
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
    vx: 0.465,
    vy: 0.495,
    size: 96,
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
    vx: 0.285,
    vy: 0.383,
    size: 58,
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
    vx: 0.255,
    vy: 0.622,
    size: 58,
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
    vx: 0.635,
    vy: 0.261,
    size: 60,
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
    vx: 0.720,
    vy: 0.438,
    size: 66,
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
    vx: 0.625,
    vy: 0.652,
    size: 62,
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hoveredStone, setHoveredStone] = useState<GemstoneInfo | null>(null);
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

  // Three.js-style 3D camera viewport tilt on pointer move
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
    >
      {/* 
        LAYER 1: Panoramic Dawn Himalayan Sanctuary Lake Background
        - Open pristine lake with morning mountain sunlight and temple pavilion
        - Smooth subtle parallax on mouse move and scroll
      */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transform will-change-transform"
        style={{
          backgroundImage: `url(${sanctuaryBg})`,
          backgroundPosition: 'center 40%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          transform: `translate3d(${mouseOffset.x * 4}px, ${scrollProgress * 35 + mouseOffset.y * 4}px, 0) scale(${1.02 + scrollProgress * 0.03})`,
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
        }}
      />

      {/* Atmospheric Dawn Warmth & Sunbeam Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#fbf4e6]/30 via-transparent to-[#1a2e26]/18 pointer-events-none" />

      {/* 
        LAYER 2: Interactive 3D Video Viewport (Rendered like an authentic Three.js 3D Scene)
        - Seamless feathering around the elliptical borders
        - 3D perspective camera tracking mouse with tactile depth
        - Parallax depth on user scroll
      */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[62%] flex items-center justify-center pointer-events-none pt-12 sm:pt-4">
        <div
          className="relative w-[360px] h-[280px] sm:w-[520px] sm:h-[400px] md:w-[620px] md:h-[460px] lg:w-[720px] lg:h-[520px] xl:w-[820px] xl:h-[580px] will-change-transform flex items-center justify-center"
          style={{
            perspective: '1300px',
            transform: `translate3d(${mouseOffset.x * 12}px, ${scrollProgress * 65 + mouseOffset.y * 10}px, 0)`,
            transition: 'transform 0.18s cubic-bezier(0.2, 0, 0.2, 1)',
          }}
        >
          {/* Inner 3D Tilt Stage with WebGL / Three.js Feel */}
          <div
            className="relative w-full h-full flex items-center justify-center pointer-events-auto transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${mouseOffset.y * -5}deg) rotateY(${mouseOffset.x * 6}deg) scale(${1 + scrollProgress * 0.05})`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Luminous Golden Ambient Glow Halo behind the 3D element */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#e5a842]/20 via-[#ffd68a]/30 to-transparent blur-3xl pointer-events-none" />

            {/* 
              The 3D Element Video Viewport
              - Smooth elliptical feathering merging into the lake and dawn sky
              - Hardware-accelerated 60 FPS playback
            */}
            <div
              className="relative w-full h-full overflow-hidden filter drop-shadow-[0_20px_45px_rgba(50,30,10,0.28)]"
              style={{
                maskImage: 'radial-gradient(ellipse 52% 50% at 48% 50%, black 35%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.2) 75%, transparent 92%)',
                WebkitMaskImage: 'radial-gradient(ellipse 52% 50% at 48% 50%, black 35%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.2) 75%, transparent 92%)',
              }}
            >
              <video
                ref={videoRef}
                src="/hero_gemstones.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{
                  filter: 'contrast(1.03) saturate(1.06) brightness(1.01)',
                }}
              />
            </div>

            {/* 
              Interactive Gemstone Hit Targets & Tooltips overlaid on the 3D video!
              Provides real interactive hover/click response with Vedic wisdom cards
            */}
            <div className="absolute inset-0 w-full h-full pointer-events-auto">
              {GEMSTONES.map((gem) => {
                const isHovered = hoveredStone?.id === gem.id;
                return (
                  <div
                    key={gem.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                    style={{
                      left: `${gem.vx * 100}%`,
                      top: `${gem.vy * 100}%`,
                      width: `${gem.size}px`,
                      height: `${gem.size}px`,
                    }}
                    onMouseEnter={() => setHoveredStone(gem)}
                    onMouseLeave={() => setHoveredStone(null)}
                    onClick={() => setActiveStone(gem)}
                    title={gem.name}
                  >
                    {/* Hover Radiant Bloom Halo */}
                    <div
                      className="absolute inset-0 rounded-full transition-all duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${gem.accentHex} 0%, transparent 70%)`,
                        opacity: isHovered ? 0.65 : 0,
                        transform: isHovered ? 'scale(1.75)' : 'scale(0.8)',
                        filter: 'blur(8px)',
                      }}
                    />

                    {/* Subtle Pulsing Hit Reticle on Hover */}
                    <div
                      className="w-full h-full rounded-full border transition-all duration-300"
                      style={{
                        borderColor: isHovered ? `${gem.accentHex}bb` : 'transparent',
                        boxShadow: isHovered ? `0 0 18px ${gem.accentHex}99` : 'none',
                        transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                      }}
                    />

                    {/* Elegant Hover Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.92 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-1/2 -top-20 -translate-x-1/2 pointer-events-none z-50 whitespace-nowrap"
                        >
                          <div className="px-3.5 py-2 rounded-xl bg-[#1e1913]/92 backdrop-blur-md border border-[#dfbe82]/40 shadow-[0_12px_32px_rgba(0,0,0,0.35)] text-center">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium tracking-wider text-[#d4af37]">
                              <span className="font-serif">{gem.sanskritName}</span>
                              <span>✦</span>
                              <span className="uppercase text-[9px] tracking-widest">{gem.planetEn}</span>
                            </div>
                            <div className="text-xs font-semibold text-[#fcf8f0] font-serif mt-0.5">
                              {gem.name}
                            </div>
                          </div>
                          <div className="w-2 h-2 rotate-45 bg-[#1e1913]/92 border-r border-b border-[#dfbe82]/40 mx-auto -mt-1" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 
        LAYER 3: Foreground Editorial & Hero Content
        - Left column text matching the reference concept art 1:1
        - Bottom floating glassmorphic trust bar
      */}
      <div className="relative z-30 h-full w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-between pt-28 pb-10 pointer-events-none">
        {/* Left Editorial Copy */}
        <div
          className="max-w-xl lg:w-[46%] pt-4 lg:pt-8 pointer-events-auto transition-transform duration-200"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 60}px, 0)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.4),
          }}
        >
          {/* Eyebrow Subtitle */}
          <p className="flex items-center gap-2.5 text-[11px] sm:text-xs font-medium uppercase tracking-[0.32em] text-[#544d41] mb-5">
            <span>ANCIENT WISDOM</span>
            <span className="text-[#a47b39] text-sm leading-none">✦</span>
            <span>MODERN GUIDANCE</span>
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-[3.6rem] sm:text-[4.6rem] lg:text-[5.1rem] xl:text-[5.6rem] leading-[0.93] tracking-[-0.035em] text-[#1a1611]">
            Gemstones
            <br />
            That{' '}
            <span className="italic font-serif font-normal text-[#9b7337] drop-shadow-[0_2px_12px_rgba(155,115,55,0.22)]">
              Align
            </span>
            <br />
            With You
          </h1>

          {/* Delicate Star Hairline Flourish */}
          <div className="flex items-center gap-3 my-6 w-52 text-[#a8864f]">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#a8864f] to-transparent opacity-80" />
            <span className="text-sm font-sans">✦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-[#a8864f] to-transparent opacity-80" />
          </div>

          {/* Interactive CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-6">
            {/* Primary Amber-Gold Button */}
            <button
              onClick={() => scrollTo('narrative')}
              className="group h-[50px] px-8 rounded-full bg-gradient-to-b from-[#a47b39] via-[#8f6727] to-[#714f19] hover:from-[#b38842] hover:to-[#7e581e] text-[#fffdf7] font-serif text-[15px] tracking-wide shadow-[0_8px_24px_rgba(113,79,25,0.35)] hover:shadow-[0_12px_32px_rgba(113,79,25,0.48)] transition-all duration-300 flex items-center gap-3.5 active:scale-98"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Secondary Frosted Glass Play Button */}
            <button
              onClick={() => scrollTo('craftsmanship')}
              className="group flex items-center gap-3.5 text-[#241e16] font-serif text-[15px] hover:text-[#8f6727] transition-colors"
            >
              <span className="w-11 h-11 rounded-full border-[1.5px] border-[#382f23]/70 group-hover:border-[#8f6727] flex items-center justify-center bg-white/35 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/60">
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
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-7 px-5 sm:px-9 py-3 rounded-full bg-[#fdf9f2]/45 backdrop-blur-md border border-white/70 shadow-[0_10px_35px_rgba(50,35,15,0.08)] text-[#2d261e] font-serif text-xs sm:text-[13px] tracking-wide">
            <div className="flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-[#a37c44]" />
              <span>Vedic Guidance</span>
            </div>
            <div className="hidden sm:block h-3.5 w-[1px] bg-[#382f23]/25" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#a37c44]" />
              <span>Authentic Gems</span>
            </div>
            <div className="hidden sm:block h-3.5 w-[1px] bg-[#382f23]/25" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#a37c44]" />
              <span>Certified &amp; Trusted</span>
            </div>
            <div className="hidden sm:block h-3.5 w-[1px] bg-[#382f23]/25" />
            <div className="flex items-center gap-2">
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
                  <div className="text-sm font-medium tracking-widest text-[#9b7337] uppercase">
                    {activeStone.sanskritName} ✦ {activeStone.planetEn}
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#1a1611]">{activeStone.name}</h3>
                  <p className="text-xs text-[#6e6556] mt-0.5">Origin: {activeStone.origin}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-sm leading-relaxed text-[#423a2f] font-serif">{activeStone.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#dfd5c2]">
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
