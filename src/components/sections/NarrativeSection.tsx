import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import story1 from '../../assets/story1.webp';
import story2 from '../../assets/story2.webp';
import story3 from '../../assets/story3.webp';
import story4 from '../../assets/story4.webp';
import door1 from '../../assets/optimized/door1.webp';
import door2 from '../../assets/optimized/door2.webp';

import { useCreativeStore } from '../../store/useCreativeStore';
import { ScrollTrigger } from '../../lib/gsap';

const stories = [
  {
    image: story1,
    door: door1,
    number: '01',
    title: '01 — The Vision',
    description: "The astrologer's knowledge and the idea behind AstroLaabh.",
  },
  {
    image: story2,
    door: door2,
    number: '02',
    title: '02 — The Selection',
    description: 'The individuality of natural gemstones and the care behind choosing them.',
  },
  {
    image: story3,
    door: door1,
    number: '03',
    title: '03 — The Craft',
    description: 'The transformation from a gemstone into something wearable and personal.',
  },
  {
    image: story4,
    door: door2,
    number: '04',
    title: '04 — The Connection',
    description: "The moment the gemstone becomes part of the customer's own story.",
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
    <section id="narrative" ref={sectionRef} className="story-section relative z-10 w-full overflow-hidden">
      <motion.div
        className="story-header"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="story-brand">
          <svg className="story-lotus" viewBox="0 0 150 50" aria-hidden="true">
            <path d="M75 47C61 39 59 23 75 4c16 19 14 35 0 43ZM75 47C58 42 48 29 50 12c17 2 25 14 25 35ZM75 47c17-5 27-18 25-35-17 2-25 14-25 35ZM75 47C56 46 40 38 34 24c17-4 32 7 41 23ZM75 47c19-1 35-9 41-23-17-4-32 7-41 23Z" />
          </svg>
          <img src="/astrolaabh-logo.png" alt="" />
        </div>
        <p className="story-eyebrow">THE ASTROLAABH STORY</p>
        <h2>From an Astrologer’s Vision to <em>Your Hands</em>.</h2>
        <p className="story-subtitle">
          Born from a desire to take traditional wisdom beyond the consultation, AstroLaabh brings together thoughtful gemstone selection, timeless craftsmanship, and a personal connection to every piece.
        </p>
        <div className="story-divider" aria-hidden="true"><span /><i /><span /></div>
      </motion.div>

      <div className="story-gallery">
        {stories.map((story, index) => (
          <motion.article
            className="story-item"
            key={story.number}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`story-niche story-niche-${index + 1}`}>
              <div className={`story-door-visual story-door-visual-${index + 1}`}>
                <img className="story-door" src={story.door} alt="" aria-hidden="true" />
                <div className="story-door-interior">
                  <img src={story.image} alt={`${story.title}: ${story.description}`} loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
            <span className="story-stage-number">{story.number}</span>
            <h3>{story.title}</h3>
            <p>{story.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default NarrativeSection;
