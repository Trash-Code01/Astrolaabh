import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import story1 from '../../assets/story1.webp';
import story2 from '../../assets/story2.webp';
import story3 from '../../assets/story3.webp';
import story4 from '../../assets/story4.webp';
import vedicArchDesign from '../../assets/vedic_arch_3.png';
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
    imageStyle: 'w-[88%] max-w-[230px] drop-shadow-[0_16px_28px_rgba(24,21,18,0.12)]',
  },
  {
    number: '२',
    sanskrit: 'रूप',
    title: 'The story becomes a shape',
    description: 'That meaning is drawn into the form of the piece.',
    image: story2,
    alt: 'Raw natural crystal stone emerging from sacred Himalayan rock',
    imageStyle: 'w-[75%] max-w-[200px] drop-shadow-[0_18px_30px_rgba(24,21,18,0.14)]',
  },
  {
    number: '३',
    sanskrit: 'रत्न',
    title: 'Your stone sits at its heart',
    description: 'Chosen for your chart, never just for its look.',
    image: story3,
    alt: 'Precision cut faceted gemstone with master jeweler tools',
    imageStyle: 'w-[78%] max-w-[210px] drop-shadow-[0_18px_30px_rgba(24,21,18,0.14)]',
  },
  {
    number: '४',
    sanskrit: 'आशीर्वाद',
    title: 'A blessing stays hidden',
    description: 'A small detail only you will know is there.',
    image: story4,
    alt: 'Handcrafted Astrolaabh gold ring with secret Vedic lotus blessing',
    imageStyle: 'w-[78%] max-w-[210px] drop-shadow-[0_20px_32px_rgba(24,21,18,0.15)]',
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
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
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

        {/* 4 Story Stations — Clean open layout (cards removed!) */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 items-stretch">

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
              {/* Visual Showcase Stage — No card boxes! */}
              <div className="relative w-full aspect-[280/350] flex flex-col justify-end items-center p-2 z-10">
                
                {/* Sacred Vedic Floral Arch Alcove — Elegantly framing each artifact */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-1 sm:p-2"
                  aria-hidden="true"
                >
                  <img
                    src={vedicArchDesign}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none select-none opacity-85 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_4px_16px_rgba(24,21,18,0.04)]"
                    loading="lazy"
                    draggable={false}
                  />
                </div>

                {/* Floating Element Showcase Container */}
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

              {/* Story Metadata & Editorial Narrative Below */}
              <div className="w-full pt-4 flex flex-col items-center">
                {/* Devanagari Numeral Badge & Sanskrit Root */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full border border-[#DCD5C9] group-hover:border-[#181512] bg-[#FAF8F5] group-hover:bg-[#181512] text-[#8C6D37] group-hover:text-white text-xs font-serif flex items-center justify-center transition-all duration-300">
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
