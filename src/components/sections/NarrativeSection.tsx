import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import story1 from '../../assets/story1.webp';
import story2 from '../../assets/story2.webp';
import story3 from '../../assets/story3.webp';
import story4 from '../../assets/story4.webp';
import { useCreativeStore } from '../../store/useCreativeStore';
import { ScrollTrigger } from '../../lib/gsap';

interface StoryItem {
  number: string;
  sanskrit: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imageStyle?: string;
  archType: 'ogee' | 'scallop' | 'floral' | 'cusp';
}

const stories: StoryItem[] = [
  {
    number: '१',
    sanskrit: 'कथा',
    title: 'It begins with a story',
    description: 'Every design starts from a moment in scripture.',
    image: story1,
    alt: 'Ancient open Vedic scripture with sacred radiant gemstones',
    imageStyle: 'w-[90%] max-w-[240px] drop-shadow-[0_16px_28px_rgba(24,21,18,0.12)]',
    archType: 'ogee',
  },
  {
    number: '२',
    sanskrit: 'रूप',
    title: 'The story becomes a shape',
    description: 'That meaning is drawn into the form of the piece.',
    image: story2,
    alt: 'Raw natural crystal stone emerging from sacred Himalayan rock',
    imageStyle: 'w-[78%] max-w-[210px] drop-shadow-[0_18px_30px_rgba(24,21,18,0.14)]',
    archType: 'scallop',
  },
  {
    number: '३',
    sanskrit: 'रत्न',
    title: 'Your stone sits at its heart',
    description: 'Chosen for your chart, never just for its look.',
    image: story3,
    alt: 'Precision cut faceted gemstone with master jeweler tools',
    imageStyle: 'w-[82%] max-w-[220px] drop-shadow-[0_18px_30px_rgba(24,21,18,0.14)]',
    archType: 'floral',
  },
  {
    number: '४',
    sanskrit: 'आशीर्वाद',
    title: 'A blessing stays hidden',
    description: 'A small detail only you will know is there.',
    image: story4,
    alt: 'Handcrafted Astrolaabh gold ring with secret Vedic lotus blessing',
    imageStyle: 'w-[82%] max-w-[220px] drop-shadow-[0_20px_32px_rgba(24,21,18,0.15)]',
    archType: 'cusp',
  },
];

/* Pure Mathematical SVG Vector Vedic Arches — Crisp on 4K, animates with ink-stroke drawing on hover */
function VedicAlcoveArch({ type }: { type: 'ogee' | 'scallop' | 'floral' | 'cusp' }) {
  if (type === 'ogee') {
    // Arch 1: Stepped Ogee Arch with Celestial Star Finial
    return (
      <svg
        viewBox="0 0 280 370"
        fill="none"
        stroke="#181512"
        className="w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        {/* Resting Faint Hairline Outline */}
        <path
          d="M 28 360 L 28 185 C 28 125 52 82 96 60 C 122 48 135 36 140 20 C 145 36 158 48 184 60 C 228 82 252 125 252 185 L 252 360"
          stroke="rgba(24, 21, 18, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {/* Dynamic Animated Vector Stroke on Hover */}
        <path
          className="arch-vector-stroke"
          d="M 28 360 L 28 185 C 28 125 52 82 96 60 C 122 48 135 36 140 20 C 145 36 158 48 184 60 C 228 82 252 125 252 185 L 252 360"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Contour */}
        <path
          className="arch-vector-flourish"
          d="M 38 360 L 38 190 C 38 138 60 98 100 78 C 122 68 134 56 140 42 C 146 56 158 68 180 78 C 220 98 242 138 242 190 L 242 360"
          strokeWidth="0.85"
          strokeOpacity="0.5"
          strokeDasharray="2 3"
        />

        {/* Apex 4-Pointed Star Finial */}
        <g className="arch-vector-flourish" transform="translate(140, 18)">
          <path d="M 0 -14 L 3 -3 L 14 0 L 3 3 L 0 14 L -3 3 L -14 0 L -3 -3 Z" fill="#181512" stroke="none" />
          <circle cx="0" cy="0" r="2" fill="#FAF8F5" stroke="none" />
        </g>

        {/* Base Plinths */}
        <path d="M 18 360 L 38 360 M 242 360 L 262 360" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }

  if (type === 'scallop') {
    // Arch 2: Sacred Multi-Foil Scalloped Arch with Blooming Lotus Crest
    return (
      <svg
        viewBox="0 0 280 370"
        fill="none"
        stroke="#181512"
        className="w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        {/* Resting Faint Hairline Outline */}
        <path
          d="M 28 360 L 28 200 C 28 175 38 160 56 148 C 46 130 50 110 68 96 C 62 76 76 58 98 52 C 100 34 118 24 140 18 C 162 24 180 34 182 52 C 204 58 218 76 212 96 C 230 110 234 130 224 148 C 242 160 252 175 252 200 L 252 360"
          stroke="rgba(24, 21, 18, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {/* Dynamic Animated Vector Stroke on Hover */}
        <path
          className="arch-vector-stroke"
          d="M 28 360 L 28 200 C 28 175 38 160 56 148 C 46 130 50 110 68 96 C 62 76 76 58 98 52 C 100 34 118 24 140 18 C 162 24 180 34 182 52 C 204 58 218 76 212 96 C 230 110 234 130 224 148 C 242 160 252 175 252 200 L 252 360"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Apex Lotus Flower Crest */}
        <g className="arch-vector-flourish" transform="translate(140, 18)">
          {/* Central Petal */}
          <path d="M 0 0 C -3 -8 -3 -15 0 -22 C 3 -15 3 -8 0 0 Z" fill="#181512" stroke="none" />
          {/* Flanking Petals */}
          <path d="M 0 0 C -8 -6 -12 -12 -10 -18 C -4 -16 -1 -8 0 0 Z" fill="#181512" stroke="none" />
          <path d="M 0 0 C 8 -6 12 -12 10 -18 C 4 -16 1 -8 0 0 Z" fill="#181512" stroke="none" />
          {/* Crown Bindu Pearl */}
          <circle cx="0" cy="-26" r="2.5" fill="#181512" stroke="none" />
        </g>

        {/* Base Plinths */}
        <path d="M 18 360 L 38 360 M 242 360 L 262 360" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }

  if (type === 'floral') {
    // Arch 3: Pointed Temple Arch with Climbing Floral Vines & Blooming 5-Petal Flowers
    return (
      <svg
        viewBox="0 0 280 370"
        fill="none"
        stroke="#181512"
        className="w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        {/* Resting Faint Hairline Outline */}
        <path
          d="M 28 360 L 28 180 C 28 115 56 72 108 48 C 126 38 136 28 140 16 C 144 28 154 38 172 48 C 224 72 252 115 252 180 L 252 360"
          stroke="rgba(24, 21, 18, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {/* Dynamic Animated Vector Stroke on Hover */}
        <path
          className="arch-vector-stroke"
          d="M 28 360 L 28 180 C 28 115 56 72 108 48 C 126 38 136 28 140 16 C 144 28 154 38 172 48 C 224 72 252 115 252 180 L 252 360"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Climbing Floral Vines along Arch Curvature */}
        <g className="arch-vector-flourish" strokeWidth="1" strokeLinecap="round">
          {/* Left Tendrils */}
          <path d="M 42 165 C 48 135 60 105 88 80 C 108 62 124 46 136 26" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 52 135 C 44 125 46 115 56 122" />
          <path d="M 76 96 C 70 86 74 76 84 84" />
          {/* Left Blooming Five-Petal Flower */}
          <g transform="translate(62, 116)">
            <circle cx="0" cy="0" r="3" fill="#181512" />
            <circle cx="0" cy="-6" r="2" fill="#181512" opacity="0.75" />
            <circle cx="6" cy="-2" r="2" fill="#181512" opacity="0.75" />
            <circle cx="4" cy="5" r="2" fill="#181512" opacity="0.75" />
            <circle cx="-4" cy="5" r="2" fill="#181512" opacity="0.75" />
            <circle cx="-6" cy="-2" r="2" fill="#181512" opacity="0.75" />
          </g>

          {/* Right Tendrils */}
          <path d="M 238 165 C 232 135 220 105 192 80 C 172 62 156 46 144 26" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 228 135 C 236 125 234 115 224 122" />
          <path d="M 204 96 C 210 86 206 76 196 84" />
          {/* Right Blooming Five-Petal Flower */}
          <g transform="translate(218, 116)">
            <circle cx="0" cy="0" r="3" fill="#181512" />
            <circle cx="0" cy="-6" r="2" fill="#181512" opacity="0.75" />
            <circle cx="6" cy="-2" r="2" fill="#181512" opacity="0.75" />
            <circle cx="4" cy="5" r="2" fill="#181512" opacity="0.75" />
            <circle cx="-4" cy="5" r="2" fill="#181512" opacity="0.75" />
            <circle cx="-6" cy="-2" r="2" fill="#181512" opacity="0.75" />
          </g>
        </g>

        {/* Apex Lotus Finial */}
        <g className="arch-vector-flourish" transform="translate(140, 16)">
          <path d="M 0 0 C -3 -6 -3 -12 0 -18 C 3 -12 3 -6 0 0 Z" fill="#181512" stroke="none" />
          <path d="M 0 0 C -7 -5 -10 -10 -8 -15 C -3 -13 0 -6 0 0 Z" fill="#181512" stroke="none" />
          <path d="M 0 0 C 7 -5 10 -10 8 -15 C 3 -13 0 -6 0 0 Z" fill="#181512" stroke="none" />
          <circle cx="0" cy="-21" r="2" fill="#181512" stroke="none" />
        </g>

        {/* Base Plinths */}
        <path d="M 18 360 L 38 360 M 242 360 L 262 360" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }

  // Arch 4: Cusped Arch with Climbing Leaf Tendrils and Lotus Crest
  return (
    <svg
      viewBox="0 0 280 370"
      fill="none"
      stroke="#181512"
      className="w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Resting Faint Hairline Outline */}
      <path
        d="M 28 360 L 28 190 C 28 155 40 135 60 120 C 50 100 62 78 86 66 C 88 46 112 32 140 20 C 168 32 192 46 194 66 C 218 78 230 100 220 120 C 240 135 252 155 252 190 L 252 360"
        stroke="rgba(24, 21, 18, 0.12)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* Dynamic Animated Vector Stroke on Hover */}
      <path
        className="arch-vector-stroke"
        d="M 28 360 L 28 190 C 28 155 40 135 60 120 C 50 100 62 78 86 66 C 88 46 112 32 140 20 C 168 32 192 46 194 66 C 218 78 230 100 220 120 C 240 135 252 155 252 190 L 252 360"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Climbing Leaf Tendrils along Cusps */}
      <g className="arch-vector-flourish" strokeWidth="1" strokeLinecap="round">
        <path d="M 56 140 C 64 132 72 136 70 144" />
        <path d="M 80 88 C 88 80 96 84 94 92" />
        <path d="M 224 140 C 216 132 208 136 210 144" />
        <path d="M 200 88 C 192 80 184 84 186 92" />
      </g>

      {/* Apex Lotus Finial */}
      <g className="arch-vector-flourish" transform="translate(140, 20)">
        <path d="M 0 0 C -3 -7 -3 -13 0 -19 C 3 -13 3 -7 0 0 Z" fill="#181512" stroke="none" />
        <path d="M 0 0 C -7 -5 -11 -10 -9 -15 C -4 -13 -1 -7 0 0 Z" fill="#181512" stroke="none" />
        <path d="M 0 0 C 7 -5 11 -10 9 -15 C 4 -13 1 -7 0 0 Z" fill="#181512" stroke="none" />
        <circle cx="0" cy="-23" r="2.2" fill="#181512" stroke="none" />
      </g>

      {/* Base Plinths */}
      <path d="M 18 360 L 38 360 M 242 360 L 262 360" strokeWidth="1.5" strokeOpacity="0.4" />
    </svg>
  );
}

export function NarrativeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useCreativeStore((s) => s.setCurrentSection);

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setCurrentSection('narrative'),
      onEnterBack: () => setCurrentSection('narrative'),
    });
    return () => trigger.kill();
  }, [setCurrentSection]);

  return (
    <section
      id="narrative"
      ref={sectionRef}
      className="relative z-10 w-full overflow-hidden bg-[#FAF8F5] text-[#181512] py-28 md:py-36 px-4 sm:px-6 lg:px-12 border-y border-[#EBE5DC]"
      style={{
        background: 'radial-gradient(ellipse at 50% 16%, #FFFFFF 0%, #FAF8F5 65%, #F4EFE9 100%)',
      }}
    >
      {/* Delicate Architectural Background Watermark */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #181512 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle Vedic Eyebrow */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full bg-white/80 border border-[#E5DFD5] shadow-[0_2px_8px_rgba(24,21,18,0.03)] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E773A]" />
            <span className="text-[11px] font-sans tracking-[0.28em] text-[#786D61] uppercase font-medium">
              Vedic Craft & Philosophy
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E773A]" />
          </div>

          {/* Editorial Headline with Italic Serif Accent */}
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#181512] font-normal tracking-tight leading-[1.12] mb-5">
            Every piece carries a <em className="italic font-serif font-normal text-[#9E773A]">meaning</em>.
          </h2>

          {/* Subtitle */}
          <p className="font-serif text-lg sm:text-xl text-[#5C554E] max-w-xl mx-auto leading-relaxed">
            Before we draw a single line, we decide what the piece should remind you of.
          </p>
        </motion.div>

        {/* GRAND CONTINUOUS ARCHITECTURAL VEDIC CANOPY FRIEZE — Spans across the full 4-column space */}
        <div className="hidden lg:block relative w-full mb-6 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1200 44" className="w-full h-9 text-[#181512]" fill="none">
            {/* Grand Continuous Horizontal Frieze Beams */}
            <line x1="30" y1="22" x2="1170" y2="22" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <line x1="50" y1="18" x2="1150" y2="18" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.35" />
            <line x1="50" y1="26" x2="1150" y2="26" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.35" />

            {/* Central Royal Vedic Lotus Medallion */}
            <g transform="translate(600, 22)">
              <circle cx="0" cy="0" r="16" fill="#FAF8F5" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
              <circle cx="0" cy="0" r="12" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />
              <path d="M0 -9 C-2 -4 -2 -2 0 0 C2 -2 2 -4 0 -9 Z" fill="#181512" opacity="0.8" />
              <path d="M0 9 C-2 4 -2 2 0 0 C2 2 2 4 0 9 Z" fill="#181512" opacity="0.8" />
              <path d="M-9 0 C-4 -2 -2 -2 0 0 C-2 2 -4 2 -9 0 Z" fill="#181512" opacity="0.8" />
              <path d="M9 0 C4 -2 2 -2 0 0 C2 2 4 2 9 0 Z" fill="#181512" opacity="0.8" />
              <circle cx="0" cy="0" r="2.5" fill="#9E773A" />
            </g>

            {/* Architectural Column Axis Markers above each of the 4 stations */}
            <g transform="translate(160, 22)">
              <polygon points="0,-5 4,0 0,5 -4,0" fill="#9E773A" opacity="0.85" />
            </g>
            <g transform="translate(450, 22)">
              <polygon points="0,-5 4,0 0,5 -4,0" fill="#9E773A" opacity="0.85" />
            </g>
            <g transform="translate(750, 22)">
              <polygon points="0,-5 4,0 0,5 -4,0" fill="#9E773A" opacity="0.85" />
            </g>
            <g transform="translate(1040, 22)">
              <polygon points="0,-5 4,0 0,5 -4,0" fill="#9E773A" opacity="0.85" />
            </g>
          </svg>
        </div>

        {/* 4 Architectural Luxury Sanctuary Alcoves */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch">
          {/* Continuous Horizontal Journey Axis Line uniting all cards */}
          <div
            className="hidden lg:block absolute left-[5%] right-[5%] top-[200px] h-[1px] border-t border-dashed border-[#DFD7CB] pointer-events-none z-0"
            aria-hidden="true"
          />

          {stories.map((story, index) => (
            <motion.article
              key={story.title}
              className="group relative flex flex-col items-center text-center cursor-pointer select-none"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.85,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Grand Architectural Niche Panel */}
              <div className="relative w-full aspect-[280/360] rounded-2xl bg-white/70 group-hover:bg-white/95 border border-[#E8E1D5] group-hover:border-[#181512]/35 shadow-[0_4px_20px_rgba(24,21,18,0.02)] group-hover:shadow-[0_20px_45px_rgba(24,21,18,0.08)] transition-all duration-500 ease-out overflow-hidden flex flex-col justify-end p-4 sm:p-5 z-10">
                
                {/* PURE MATHEMATICAL VECTOR VEDIC ARCH — Ink-stroke animation draws on hover */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none p-3.5 sm:p-4 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <VedicAlcoveArch type={story.archType} />
                </div>

                {/* Floating Element Showcase Container ("hover the elements upside down") */}
                <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-end pb-3">
                  {/* Floating Object Image */}
                  <div className="story-floating-element w-full flex items-center justify-center">
                    <img
                      src={story.image}
                      alt={story.alt}
                      className={`object-contain transition-transform duration-500 select-none pointer-events-none ${story.imageStyle}`}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Dynamic Soft Levitation Shadow underneath */}
                  <div
                    className="w-32 h-3.5 mx-auto rounded-full bg-black/20 blur-md transition-all duration-500 ease-out group-hover:w-44 group-hover:h-4 group-hover:bg-black/12 group-hover:blur-xl group-hover:scale-110 mt-1 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Card Metadata & Editorial Story Info Below Arch */}
              <div className="w-full pt-5 flex flex-col items-center">
                {/* Devanagari Numeral Badge & Sanskrit Root */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full border border-[#DCD5C9] group-hover:border-[#181512] bg-[#FAF8F5] group-hover:bg-[#181512] text-[#8C6D37] group-hover:text-white text-xs font-serif flex items-center justify-center transition-all duration-400">
                    {story.number}
                  </span>
                  <span className="text-[12px] font-serif tracking-[0.22em] text-[#8C6D37] uppercase font-semibold">
                    {story.sanskrit}
                  </span>
                </div>

                {/* Stage English Title */}
                <h3 className="font-serif text-xl sm:text-2xl text-[#181512] font-normal tracking-tight leading-snug mb-2 group-hover:text-[#9E773A] transition-colors duration-300">
                  {story.title}
                </h3>

                {/* Stage Editorial Description */}
                <p className="font-sans text-sm text-[#635B53] leading-relaxed max-w-[240px]">
                  {story.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NarrativeSection;
