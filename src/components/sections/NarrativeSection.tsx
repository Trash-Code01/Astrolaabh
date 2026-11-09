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
}

const stories: StoryItem[] = [
  {
    number: '१',
    sanskrit: 'कथा',
    title: 'It begins with a story',
    description: 'Every design starts from a moment in scripture.',
    image: story1,
    alt: 'Ancient open Vedic scripture with sacred radiant gemstones',
    imageStyle: 'w-[90%] max-w-[240px] drop-shadow-[0_16px_24px_rgba(24,21,18,0.12)]',
  },
  {
    number: '२',
    sanskrit: 'रूप',
    title: 'The story becomes a shape',
    description: 'That meaning is drawn into the form of the piece.',
    image: story2,
    alt: 'Raw natural crystal stone emerging from sacred Himalayan rock',
    imageStyle: 'w-[78%] max-w-[210px] drop-shadow-[0_18px_28px_rgba(24,21,18,0.14)]',
  },
  {
    number: '३',
    sanskrit: 'रत्न',
    title: 'Your stone sits at its heart',
    description: 'Chosen for your chart, never just for its look.',
    image: story3,
    alt: 'Precision cut faceted gemstone with master jeweler tools',
    imageStyle: 'w-[82%] max-w-[220px] drop-shadow-[0_18px_28px_rgba(24,21,18,0.14)]',
  },
  {
    number: '४',
    sanskrit: 'आशीर्वाद',
    title: 'A blessing stays hidden',
    description: 'A small detail only you will know is there.',
    image: story4,
    alt: 'Handcrafted Astrolaabh gold ring with secret Vedic lotus blessing',
    imageStyle: 'w-[82%] max-w-[220px] drop-shadow-[0_20px_30px_rgba(24,21,18,0.15)]',
  },
];

/* Topmost Sacred Geometry Overlays — Rendered in crisp BLACK (#181512) ONLY on hover */
function TopmostGeometry({ index }: { index: number }) {
  if (index === 0) {
    // Card 1: Vedic lotus bloom with radiating celestial meridian sunburst lines
    return (
      <svg
        className="w-full h-full"
        viewBox="0 0 280 340"
        fill="none"
        stroke="#181512"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Central Vertical Plumb Line */}
        <line x1="140" y1="20" x2="140" y2="240" strokeDasharray="3 3" opacity="0.6" />
        {/* Top Sunburst / Star Asterisk */}
        <path d="M140 18 L140 32 M133 25 L147 25 M135 20 L145 30 M145 20 L135 30" strokeWidth="1.3" />
        
        {/* Celestial Radial Meridian Rays */}
        <g opacity="0.85">
          <line x1="140" y1="110" x2="140" y2="46" />
          <line x1="140" y1="110" x2="185" y2="58" />
          <line x1="140" y1="110" x2="218" y2="92" />
          <line x1="140" y1="110" x2="95" y2="58" />
          <line x1="140" y1="110" x2="62" y2="92" />
          <line x1="140" y1="110" x2="52" y2="135" />
          <line x1="140" y1="110" x2="228" y2="135" />
        </g>

        {/* Concentric Guide Arcs */}
        <circle cx="140" cy="110" r="32" strokeDasharray="2 3" opacity="0.55" />
        <circle cx="140" cy="110" r="64" strokeDasharray="3 4" opacity="0.45" />
        <circle cx="140" cy="110" r="88" strokeDasharray="1 5" opacity="0.35" />

        {/* Sacred Blooming Lotus Rosette at Upper Meridian */}
        <g strokeWidth="1.2">
          {/* Central Petal */}
          <path d="M140 68 C135 84 135 96 140 110 C145 96 145 84 140 68 Z" />
          {/* Flanking Petals */}
          <path d="M140 110 C128 98 120 86 122 75 C129 78 136 90 140 110 Z" />
          <path d="M140 110 C152 98 160 86 158 75 C151 78 144 90 140 110 Z" />
          {/* Outer Whispering Petals */}
          <path d="M140 110 C118 106 106 98 108 90 C118 90 128 98 140 110 Z" />
          <path d="M140 110 C162 106 174 98 172 90 C162 90 152 98 140 110 Z" />
          {/* Base Calyx Cup */}
          <path d="M126 112 C134 116 146 116 154 112" />
        </g>

        {/* Astrolabe Degree Nodes */}
        <circle cx="140" cy="46" r="2.5" fill="#181512" />
        <circle cx="185" cy="58" r="2" fill="#181512" />
        <circle cx="95" cy="58" r="2" fill="#181512" />
        <circle cx="218" cy="92" r="2" fill="#181512" />
        <circle cx="62" cy="92" r="2" fill="#181512" />
      </svg>
    );
  }

  if (index === 1) {
    // Card 2: Golden ratio sacred petal mandala & architectural alignment lines
    return (
      <svg
        className="w-full h-full"
        viewBox="0 0 280 340"
        fill="none"
        stroke="#181512"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Vertical Symmetry Plumb Axis */}
        <line x1="140" y1="24" x2="140" y2="250" strokeDasharray="3 3" opacity="0.6" />
        {/* Diamond Finials */}
        <polygon points="140,20 143,26 140,32 137,26" fill="#181512" />
        <polygon points="140,190 143,196 140,202 137,196" fill="#181512" />

        {/* Concentric Golden-Ratio Coordinate Circles */}
        <circle cx="140" cy="115" r="42" opacity="0.45" />
        <circle cx="140" cy="115" r="72" strokeDasharray="3 4" opacity="0.4" />
        <circle cx="140" cy="115" r="98" strokeDasharray="1 4" opacity="0.3" />

        {/* Horizontal Alignment Guideline with Dimension Ticks */}
        <line x1="45" y1="115" x2="235" y2="115" strokeDasharray="4 4" opacity="0.5" />
        <line x1="45" y1="110" x2="45" y2="120" opacity="0.7" />
        <line x1="235" y1="110" x2="235" y2="120" opacity="0.7" />

        {/* Sacred Flame / Lotus Geometry Contour */}
        <g strokeWidth="1.2">
          {/* Inner Flame Lotus */}
          <path d="M140 48 C128 72 124 94 140 125 C156 94 152 72 140 48 Z" />
          {/* Secondary Volute Curves */}
          <path d="M140 125 C118 108 104 88 112 72 C124 74 132 94 140 125 Z" />
          <path d="M140 125 C162 108 176 88 168 72 C156 74 148 94 140 125 Z" />
          {/* Outer Crest Flourish */}
          <path d="M140 125 C98 122 84 102 90 92 C104 90 122 104 140 125 Z" />
          <path d="M140 125 C182 122 196 102 190 92 C176 90 158 104 140 125 Z" />
          {/* Base Lotus Root Pedestal */}
          <path d="M120 135 C132 140 148 140 160 135" />
          <path d="M128 142 C136 146 144 146 152 142" />
        </g>

        {/* Cardinal Astrological Ticks */}
        <circle cx="140" cy="48" r="2.5" fill="#181512" />
        <circle cx="112" cy="72" r="2" fill="#181512" />
        <circle cx="168" cy="72" r="2" fill="#181512" />
        <circle cx="90" cy="92" r="2" fill="#181512" />
        <circle cx="190" cy="92" r="2" fill="#181512" />
      </svg>
    );
  }

  if (index === 2) {
    // Card 3: Master gemologist coordinate grid, millimeter crosshairs, & cushion facet blueprint
    return (
      <svg
        className="w-full h-full"
        viewBox="0 0 280 340"
        fill="none"
        stroke="#181512"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Orthogonal Gemological Calibration Grid */}
        <g strokeDasharray="3 4" opacity="0.38">
          <line x1="60" y1="35" x2="60" y2="230" />
          <line x1="100" y1="35" x2="100" y2="230" />
          <line x1="140" y1="30" x2="140" y2="245" />
          <line x1="180" y1="35" x2="180" y2="230" />
          <line x1="220" y1="35" x2="220" y2="230" />
          <line x1="40" y1="60" x2="240" y2="60" />
          <line x1="40" y1="100" x2="240" y2="100" />
          <line x1="40" y1="140" x2="240" y2="140" />
          <line x1="40" y1="180" x2="240" y2="180" />
        </g>

        {/* Master Cushion-Cut Facet Wireframe Diagram */}
        <g strokeWidth="1.25">
          {/* Table Octagon */}
          <polygon points="122,82 158,82 174,98 174,134 158,150 122,150 106,134 106,98" opacity="0.9" />
          {/* Outer Girdle Soft Square */}
          <rect x="90" y="66" width="100" height="100" rx="18" opacity="0.75" />
          {/* Star & Kite Facet Rays */}
          <line x1="122" y1="82" x2="108" y2="72" />
          <line x1="158" y1="82" x2="172" y2="72" />
          <line x1="174" y1="98" x2="184" y2="88" />
          <line x1="174" y1="134" x2="184" y2="144" />
          <line x1="158" y1="150" x2="172" y2="160" />
          <line x1="122" y1="150" x2="108" y2="160" />
          <line x1="106" y1="134" x2="96" y2="144" />
          <line x1="106" y1="98" x2="96" y2="88" />
          {/* Culet Center Point */}
          <circle cx="140" cy="116" r="2.5" fill="#181512" />
        </g>

        {/* Precision Optical Reticle Target in Upper Right */}
        <g transform="translate(195, 65)">
          <circle cx="0" cy="0" r="26" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="16" strokeDasharray="2 3" opacity="0.6" />
          <line x1="-32" y1="0" x2="32" y2="0" strokeWidth="0.9" opacity="0.7" />
          <line x1="0" y1="-32" x2="0" y2="32" strokeWidth="0.9" opacity="0.7" />
          <circle cx="0" cy="0" r="2" fill="#181512" />
          <text x="8" y="-18" fontSize="7" fontFamily="monospace" fill="#181512" letterSpacing="0.5">10x MAG</text>
        </g>

        {/* Dimension Angle Callouts */}
        <path d="M72 152 A 28 28 0 0 1 88 168" strokeDasharray="2 2" opacity="0.7" />
        <text x="60" y="174" fontSize="8" fontFamily="monospace" fill="#181512" opacity="0.85">42.5°</text>
      </svg>
    );
  }

  // Card 4: Concentric orbital rings, Vesica Piscis arcs, & blessing circular loupe with lotus yantra
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 280 340"
      fill="none"
      stroke="#181512"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Central Axis & Orbital Ellipses */}
      <ellipse cx="140" cy="120" rx="90" ry="38" strokeDasharray="3 4" opacity="0.4" />
      <ellipse cx="140" cy="120" rx="65" ry="78" strokeDasharray="2 4" opacity="0.35" />
      <line x1="140" y1="20" x2="140" y2="240" strokeDasharray="3 3" opacity="0.5" />

      {/* Topmost Inset Blessing Circular Callout Loupe */}
      <g transform="translate(196, 74)">
        {/* Loupe Outer Ring & Glass Rim */}
        <circle cx="0" cy="0" r="32" strokeWidth="1.3" />
        <circle cx="0" cy="0" r="28" strokeDasharray="2 2" opacity="0.55" />
        
        {/* Sacred 8-Petaled Secret Lotus Yantra Inscription (Vedic Blessing) */}
        <g strokeWidth="1.1">
          {/* Cardinal Petals */}
          <path d="M0 -18 C-3 -10 -3 -6 0 0 C3 -6 3 -10 0 -18 Z" />
          <path d="M0 18 C-3 10 -3 6 0 0 C3 6 3 10 0 18 Z" />
          <path d="M-18 0 C-10 -3 -6 -3 0 0 C-6 3 -10 3 -18 0 Z" />
          <path d="M18 0 C10 -3 6 -3 0 0 C6 3 10 3 18 0 Z" />
          {/* Diagonal Petals */}
          <path d="M-12 -12 C-8 -4 -4 -4 0 0 C-4 -8 -4 -8 -12 -12 Z" />
          <path d="M12 12 C8 4 4 4 0 0 C4 8 4 8 12 12 Z" />
          <path d="M12 -12 C8 -4 4 -4 0 0 C4 -8 4 -8 12 -12 Z" />
          <path d="M-12 12 C-8 4 -4 4 0 0 C-4 8 -4 8 -12 12 Z" />
          {/* Inner Bindu Center */}
          <circle cx="0" cy="0" r="2.2" fill="#181512" />
        </g>

        {/* Cardinal Alignment Ticks */}
        <line x1="0" y1="-32" x2="0" y2="-28" strokeWidth="1.5" />
        <line x1="0" y1="28" x2="0" y2="32" strokeWidth="1.5" />
        <line x1="-32" y1="0" x2="-28" y2="0" strokeWidth="1.5" />
        <line x1="28" y1="0" x2="32" y2="0" strokeWidth="1.5" />
      </g>

      {/* Loupe Pointer Indicator Leader Line pointing down to ring inner band */}
      <path d="M172 96 L148 132 L132 142" strokeDasharray="3 3" opacity="0.75" />
      <circle cx="132" cy="142" r="2.5" fill="#181512" />
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
      className="relative z-10 w-full overflow-hidden bg-[#FAF8F5] text-[#181512] py-28 md:py-36 px-4 sm:px-6 lg:px-8 border-y border-[#EBE5DC]"
      style={{
        background: 'radial-gradient(ellipse at 50% 18%, #FFFFFF 0%, #FAF8F5 65%, #F4EFE9 100%)',
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
          className="text-center max-w-3xl mx-auto mb-20 md:mb-24"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle Vedic Eyebrow */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full bg-white/70 border border-[#E5DFD5] shadow-[0_2px_8px_rgba(24,21,18,0.03)] mb-5">
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

        {/* 4 Architectural Luxury Arched Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch">
          {/* Continuous Horizontal Journey Hairline uniting cards */}
          <div
            className="hidden lg:block absolute left-[12%] right-[12%] top-[190px] h-[1px] border-t border-dashed border-[#DFD7CB] pointer-events-none z-0"
            aria-hidden="true"
          />

          {stories.map((story, index) => (
            <motion.article
              key={story.title}
              className="group relative flex flex-col items-center text-center cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.85,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Arched Architectural Visual Stage */}
              <div className="relative w-full aspect-[280/350] rounded-t-[140px] rounded-b-2xl bg-white/80 border border-[#E8E1D5] group-hover:border-[#181512]/35 shadow-[0_6px_24px_rgba(24,21,18,0.03)] group-hover:shadow-[0_22px_45px_rgba(24,21,18,0.09)] transition-all duration-500 ease-out overflow-hidden flex flex-col justify-end p-5 z-10">
                {/* Traditional Vedic Arched Alcove Hairline Inner Outline */}
                <svg
                  className="pointer-events-none absolute inset-0 w-full h-full text-[#DFD7CB] group-hover:text-[#181512]/30 transition-colors duration-500"
                  viewBox="0 0 280 350"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 28 344 L 28 140 C 28 85, 60 55, 110 40 C 128 34, 136 28, 140 16 C 144 28, 152 34, 170 40 C 220 55, 252 85, 252 140 L 252 344"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                </svg>

                {/* TOPMOST SACRED GEOMETRY LAYER — Revealed in crisp BLACK (#181512) ONLY on hover */}
                <div
                  className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-500 ease-out"
                  aria-hidden="true"
                >
                  <TopmostGeometry index={index} />
                </div>

                {/* Floating Element Showcase Container ("hover the elements upside down") */}
                <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-end pb-3">
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
                    className="w-32 h-3.5 mx-auto rounded-full bg-black/25 blur-md transition-all duration-500 ease-out group-hover:w-44 group-hover:h-4 group-hover:bg-black/14 group-hover:blur-xl group-hover:scale-110 mt-1 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Card Metadata & Editorial Story Info Below Arch */}
              <div className="w-full pt-6 flex flex-col items-center">
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
