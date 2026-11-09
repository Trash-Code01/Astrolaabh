import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import story1 from '../../assets/story1.webp';
import story2 from '../../assets/story2.webp';
import story3 from '../../assets/story3.webp';
import story4 from '../../assets/story4.webp';
import vedicArch1 from '../../assets/vedic_arch_1.png';
import vedicArch2 from '../../assets/vedic_arch_2.png';
import vedicArch3 from '../../assets/vedic_arch_3.png';
import vedicArch4 from '../../assets/vedic_arch_4.png';
import { useCreativeStore } from '../../store/useCreativeStore';
import { ScrollTrigger } from '../../lib/gsap';

interface StoryItem {
  number: string;
  sanskrit: string;
  title: string;
  description: string;
  image: string;
  arch: string;
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
    arch: vedicArch1,
    alt: 'Ancient open Vedic scripture with sacred radiant gemstones',
    imageStyle: 'w-[88%] max-w-[240px] drop-shadow-[0_16px_24px_rgba(24,21,18,0.12)]',
  },
  {
    number: '२',
    sanskrit: 'रूप',
    title: 'The story becomes a shape',
    description: 'That meaning is drawn into the form of the piece.',
    image: story2,
    arch: vedicArch2,
    alt: 'Raw natural crystal stone emerging from sacred Himalayan rock',
    imageStyle: 'w-[76%] max-w-[210px] drop-shadow-[0_18px_28px_rgba(24,21,18,0.14)]',
  },
  {
    number: '३',
    sanskrit: 'रत्न',
    title: 'Your stone sits at its heart',
    description: 'Chosen for your chart, never just for its look.',
    image: story3,
    arch: vedicArch3,
    alt: 'Precision cut faceted gemstone with master jeweler tools',
    imageStyle: 'w-[80%] max-w-[220px] drop-shadow-[0_18px_28px_rgba(24,21,18,0.14)]',
  },
  {
    number: '४',
    sanskrit: 'आशीर्वाद',
    title: 'A blessing stays hidden',
    description: 'A small detail only you will know is there.',
    image: story4,
    arch: vedicArch4,
    alt: 'Handcrafted Astrolaabh gold ring with secret Vedic lotus blessing',
    imageStyle: 'w-[80%] max-w-[220px] drop-shadow-[0_20px_30px_rgba(24,21,18,0.15)]',
  },
];

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

        {/* 4 Architectural Story Stages */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 items-stretch">
          {/* Continuous Horizontal Journey Hairline uniting cards */}
          <div
            className="hidden lg:block absolute left-[8%] right-[8%] top-[240px] h-[1px] border-t border-dashed border-[#DFD7CB] pointer-events-none z-0"
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
              {/* Pure Editorial Visual Stage — Existing heavy arch container removed! */}
              <div className="relative w-full aspect-[280/380] flex flex-col justify-end items-center p-2 z-10">
                
                {/* MAIN SKETCH ARCH DESIGN ON HOVER — Lines come and form the design as the main architectural portal */}
                <div
                  className="vedic-arch-canvas absolute inset-0 z-10 pointer-events-none flex items-center justify-center p-2"
                  aria-hidden="true"
                >
                  <img
                    src={story.arch}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none select-none filter contrast-125 drop-shadow-[0_4px_16px_rgba(24,21,18,0.06)]"
                    loading="lazy"
                    draggable={false}
                  />
                  {/* Leading edge line-draw tracer spark that sweeps upward with the drawing front */}
                  <div className="arch-tracer-line absolute inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#181512]/65 to-transparent pointer-events-none z-20 opacity-0" />
                </div>

                {/* Floating Element Showcase Container ("hover the elements upside down") */}
                <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-end pb-4">
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
              <div className="w-full pt-4 flex flex-col items-center">
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
