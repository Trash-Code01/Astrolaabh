import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Flower2, Play, ShieldCheck, Sparkles } from 'lucide-react';
import heroBackground from '../../assets/herobg.webp';
import ruby from '../../assets/ruby.webp';
import emerald from '../../assets/emerald.webp';
import sapphire from '../../assets/sapphire.webp';
import diamond from '../../assets/diamond.webp';
import gold from '../../assets/gold.webp';
import { useCreativeStore } from '../../store/useCreativeStore';
import { ScrollTrigger } from '../../lib/gsap';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setCurrentSection = useCreativeStore((s) => s.setCurrentSection);

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setCurrentSection('hero'),
      onEnterBack: () => setCurrentSection('hero'),
    });
    return () => trigger.kill();
  }, [setCurrentSection]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="astrology-hero relative isolate w-full overflow-hidden text-[#17140f]"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="hero-warmth" />
      <div className="hero-inner relative z-10 mx-auto flex min-h-[720px] max-w-[1380px] items-center px-5 pb-24 pt-28 sm:px-10 lg:px-[9%] lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="hero-copy relative z-30 w-full lg:w-[43%]"
        >
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em] text-[#5d584f] sm:text-xs">
            Ancient wisdom <span className="mx-2 text-[#aa8b58]">✦</span> Modern guidance
          </p>
          <h1 className="hero-title text-[3.35rem] leading-[0.91] tracking-[-0.035em] sm:text-[4.8rem] lg:text-[4.65rem] xl:text-[5rem]">
            Gemstones
            <br />
            That <em>Align</em>
            <br />
            <span>With You</span>
          </h1>
          <div className="hero-title-flourish" aria-hidden="true"><span>✦</span></div>
          <div className="mt-7 flex flex-wrap items-center gap-5 sm:mt-8">
            <button className="hero-primary" onClick={() => scrollTo('gemstone-collection')}>
              Explore Collection <ArrowRight className="h-4 w-4" />
            </button>
            <button className="hero-secondary" onClick={() => scrollTo('narrative')}>
              <span className="hero-play"><Play className="h-4 w-4 fill-current" /></span>
              How It Works
            </button>
          </div>
        </motion.div>

        <div className="gemstone-universe" aria-label="Astrological gemstone constellation">
          <div className="celestial-wheel" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="orbit orbit-four" />
          <div className="gem gem-ruby"><img src={ruby} alt="Ruby gemstone" decoding="async" /></div>
          <svg className="layered-orbits" viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="400" cy="250" rx="165" ry="62" transform="rotate(-8 400 250)" />
            <ellipse cx="400" cy="250" rx="235" ry="88" transform="rotate(14 400 250)" />
            <ellipse cx="400" cy="250" rx="300" ry="112" transform="rotate(-18 400 250)" />
            <ellipse cx="400" cy="250" rx="360" ry="145" transform="rotate(22 400 250)" />
          </svg>
          <div className="satellite-route route-emerald">
            <img src={emerald} alt="Emerald gemstone" decoding="async" />
          </div>
          <div className="satellite-route route-sapphire">
            <img src={sapphire} alt="Sapphire gemstone" decoding="async" />
          </div>
          <div className="satellite-route route-gold">
            <img src={gold} alt="Yellow gemstone" decoding="async" />
          </div>
          <div className="satellite-route route-diamond">
            <img src={diamond} alt="Diamond gemstone" decoding="async" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="trust-bar"
        >
          <div><Flower2 /><span>Vedic Guidance</span></div>
          <i />
          <div><Sparkles /><span>Authentic Gems</span></div>
          <i />
          <div><ShieldCheck /><span>Certified &amp; Trusted</span></div>
          <i />
          <div><BadgeCheck /><span>Personalized for You</span></div>
        </motion.div>
      </div>
    </section>
  );
}
