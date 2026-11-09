import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import story1 from '../../assets/story1.webp';
import story2 from '../../assets/story2.webp';
import story3 from '../../assets/story3.webp';
import story4 from '../../assets/story4.webp';
import { useCreativeStore } from '../../store/useCreativeStore';
import { ScrollTrigger } from '../../lib/gsap';

const stories = [
  { image: story1, number: 'STORY 01', title: 'उद्गम', description: 'Born in the heart of the Earth.', icon: 'mountain' },
  { image: story2, number: 'STORY 02', title: 'शोधन', description: 'Purified to reveal its true radiance.', icon: 'gem' },
  { image: story3, number: 'STORY 03', title: 'संस्कार', description: 'Energized through ancient Vedic rituals.', icon: 'lotus' },
  { image: story4, number: 'STORY 04', title: 'संगति', description: 'Chosen to align with your intent.', icon: 'energy' },
];

function StoryIcon({ type }: { type: string }) {
  if (type === 'gem') {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 24 18 12h28l10 12-24 29L8 24Zm0 0h48M18 12l14 41 14-41M18 12l14 12 14-12M32 24 24 24l8 29 8-29Z" /></svg>;
  }
  if (type === 'lotus') {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 51C20 45 13 37 12 27c8 0 15 4 20 13-4-13-2-23 0-29 7 8 9 18 6 29 5-9 12-13 20-13-1 10-8 18-26 24ZM12 51h40" /></svg>;
  }
  if (type === 'energy') {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 7v50M7 32h50M14 14l36 36M50 14 14 50M32 18l14 14-14 14-14-14 14-14Z" /></svg>;
  }
  return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="m5 47 14-19 8 8 9-18 23 29M19 28l7-8 5 16M36 18l8-7 7 16" /></svg>;
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
    <section id="narrative" ref={sectionRef} className="story-section relative z-10 w-full overflow-hidden">
      <div className="story-pattern" aria-hidden="true" />
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
        <p className="story-eyebrow">THE GEMSTONE STORY</p>
        <h2>A Journey from <em>Earth to Energy</em></h2>
        <p className="story-subtitle">From nature’s depths to a piece that aligns with you.</p>
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
            <div className="story-niche">
              <svg className="story-arch" viewBox="0 0 300 370" role="img" aria-label={`Gemstone story stage ${index + 1}`}>
                <defs>
                  <path id={`story-clip-${index}`} d="M150 18C160 42 178 50 205 60C252 80 268 111 268 148V344H32V148C32 111 48 80 95 60C122 50 140 42 150 18Z" />
                  <clipPath id={`story-image-clip-${index}`}>
                    <use href={`#story-clip-${index}`} />
                  </clipPath>
                  <radialGradient id={`story-alcove-${index}`} cx="50%" cy="42%" r="68%">
                    <stop offset="0%" stopColor="#FFE8A8" />
                    <stop offset="58%" stopColor="#E9B85F" />
                    <stop offset="100%" stopColor="#D89A38" />
                  </radialGradient>
                </defs>
                <path className="story-arch-fill" d="M150 18C160 42 178 50 205 60C252 80 268 111 268 148V344H32V148C32 111 48 80 95 60C122 50 140 42 150 18Z" fill={`url(#story-alcove-${index})`} />
                <image
                  className="story-arch-image"
                  href={story.image}
                  x="48"
                  y="47"
                  width="204"
                  height="232"
                  preserveAspectRatio="xMidYMid meet"
                  transform="translate(12 15) scale(.92)"
                  clipPath={`url(#story-image-clip-${index})`}
                />
                <path className="story-arch-outer" d="M150 18C160 42 178 50 205 60C252 80 268 111 268 148V344H32V148C32 111 48 80 95 60C122 50 140 42 150 18Z" />
                <path className="story-arch-inner" d="M150 35C158 55 176 63 200 72C241 88 253 115 253 149V328H47V149C47 115 59 88 100 72C124 63 142 55 150 35Z" />
              </svg>
              <span className="story-platform" aria-hidden="true" />
            </div>
            <div className="story-stage-icon"><StoryIcon type={story.icon} /></div>
            <span className="story-stage-number">{story.number}</span>
            <h3>{story.title}</h3>
            <p>{story.description}</p>
          </motion.article>
        ))}
      </div>
      <div className="story-bottom-wave" aria-hidden="true" />
    </section>
  );
}
