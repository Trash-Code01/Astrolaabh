import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import doorway from "../../assets/door'.webp";
import stone from '../../assets/stone.webp';
import { gemstones, type Gemstone } from '../../lib/gemstones';
import { scrollToTarget } from '../../lib/lenis';

export const gemstoneThemes: Record<string, {
  color: string;
  glow: string;
  aura: string;
  trackColor: string;
  badgeBg: string;
  borderGlow: string;
  bgWash: string;
}> = {
  'ruby': {
    color: '#D81B43',
    glow: 'rgba(216, 27, 67, 0.60)',
    aura: 'radial-gradient(circle, rgba(224, 35, 78, 0.70) 0%, rgba(216, 27, 67, 0.30) 45%, transparent 72%)',
    trackColor: '#E0234E',
    badgeBg: '#FFF0F3',
    borderGlow: 'rgba(216, 27, 67, 0.45)',
    bgWash: 'radial-gradient(ellipse at 75% 48%, rgba(254, 205, 215, 0.45) 0%, rgba(247, 240, 229, 0.6) 50%, #f7f0e5 75%)',
  },
  'blue-sapphire': {
    color: '#1E56A0',
    glow: 'rgba(37, 99, 235, 0.60)',
    aura: 'radial-gradient(circle, rgba(37, 99, 235, 0.70) 0%, rgba(30, 86, 160, 0.30) 45%, transparent 72%)',
    trackColor: '#2563EB',
    badgeBg: '#F0F6FF',
    borderGlow: 'rgba(37, 99, 235, 0.45)',
    bgWash: 'radial-gradient(ellipse at 75% 48%, rgba(191, 219, 254, 0.45) 0%, rgba(247, 240, 229, 0.6) 50%, #f7f0e5 75%)',
  },
  'emerald': {
    color: '#0D8253',
    glow: 'rgba(16, 185, 129, 0.60)',
    aura: 'radial-gradient(circle, rgba(16, 185, 129, 0.70) 0%, rgba(13, 130, 83, 0.30) 45%, transparent 72%)',
    trackColor: '#10B981',
    badgeBg: '#ECFDF5',
    borderGlow: 'rgba(16, 185, 129, 0.45)',
    bgWash: 'radial-gradient(ellipse at 75% 48%, rgba(167, 243, 208, 0.45) 0%, rgba(247, 240, 229, 0.6) 50%, #f7f0e5 75%)',
  },
  'yellow-sapphire': {
    color: '#D49419',
    glow: 'rgba(245, 158, 11, 0.60)',
    aura: 'radial-gradient(circle, rgba(245, 158, 11, 0.72) 0%, rgba(212, 148, 25, 0.32) 45%, transparent 72%)',
    trackColor: '#F59E0B',
    badgeBg: '#FFFBEB',
    borderGlow: 'rgba(245, 158, 11, 0.45)',
    bgWash: 'radial-gradient(ellipse at 75% 48%, rgba(254, 240, 138, 0.45) 0%, rgba(247, 240, 229, 0.6) 50%, #f7f0e5 75%)',
  },
  'pearl': {
    color: '#9C8870',
    glow: 'rgba(215, 200, 180, 0.65)',
    aura: 'radial-gradient(circle, rgba(245, 235, 220, 0.88) 0%, rgba(220, 205, 185, 0.38) 45%, transparent 72%)',
    trackColor: '#C4B59D',
    badgeBg: '#FAF7F2',
    borderGlow: 'rgba(196, 181, 157, 0.45)',
    bgWash: 'radial-gradient(ellipse at 75% 48%, rgba(254, 243, 225, 0.65) 0%, rgba(247, 240, 229, 0.6) 50%, #f7f0e5 75%)',
  },
  'diamond': {
    color: '#2563EB',
    glow: 'rgba(96, 165, 250, 0.65)',
    aura: 'radial-gradient(circle, rgba(147, 197, 253, 0.78) 0%, rgba(96, 165, 250, 0.32) 45%, transparent 72%)',
    trackColor: '#60A5FA',
    badgeBg: '#F0F9FF',
    borderGlow: 'rgba(96, 165, 250, 0.45)',
    bgWash: 'radial-gradient(ellipse at 75% 48%, rgba(219, 234, 254, 0.50) 0%, rgba(247, 240, 229, 0.6) 50%, #f7f0e5 75%)',
  },
};

export function GemstoneShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerReset, setTimerReset] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const activeGemstone = gemstones[activeIndex] || gemstones[0];
  const currentTheme = gemstoneThemes[activeGemstone.id] || gemstoneThemes['ruby'];

  // Symmetrical celestial arc coordinates for all 6 gemstones
  const orbitSlots = useMemo(() => gemstones.map((gemstone, index) => {
    const angle = Math.PI + (Math.PI * index) / (gemstones.length - 1);
    return {
      gemstone,
      index,
      x: 50 + 40 * Math.cos(angle),
      y: 40 + 40 * Math.sin(angle),
    };
  }), []);

  const selectGemstone = useCallback((index: number) => {
    setActiveIndex(index);
    setTimerReset((value) => value + 1);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      rootMargin: '100px 0px',
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Automated 4-second sequence loop as requested
  useEffect(() => {
    if (!isInView || document.hidden) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % gemstones.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isInView, timerReset]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) setIsInView(false);
      else if (sectionRef.current) {
        const bounds = sectionRef.current.getBoundingClientRect();
        setIsInView(bounds.bottom > 0 && bounds.top < window.innerHeight);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleGemstoneRequest = (event: Event) => {
      const requestedId = (event as CustomEvent<string>).detail;
      const requestedIndex = gemstones.findIndex((gemstone) => gemstone.id === requestedId);
      if (requestedIndex >= 0) selectGemstone(requestedIndex);
    };

    window.addEventListener('astrolaabh:select-gemstone', handleGemstoneRequest);
    return () => window.removeEventListener('astrolaabh:select-gemstone', handleGemstoneRequest);
  }, [selectGemstone]);

  const handleViewStone = () => {
    window.dispatchEvent(new CustomEvent<Gemstone>('astrolaabh:consult-gemstone', { detail: activeGemstone }));
    scrollToTarget('appointment');
  };

  // Active path progress percentage along the arc
  const arcProgressPercent = (activeIndex / (gemstones.length - 1)) * 100;

  return (
    <section
      ref={sectionRef}
      id="gemstone-showcase"
      className={`gemstone-showcase${isInView ? ' is-visible' : ''}`}
      aria-label="Interactive gemstone showcase"
      style={{ background: '#f7f0e5' }}
    >
      <div className="showcase-information" aria-live="polite">
        <p className="showcase-eyebrow">The Pancharatna Collection</p>
        <div className="showcase-copy" key={activeGemstone.id}>
          <h2 style={{ color: '#2C1F14' }}>{activeGemstone.name}</h2>
          <p className="showcase-hindi" style={{ color: currentTheme.color }}>{activeGemstone.hindiName}</p>
          <p className="showcase-tagline">{activeGemstone.tagline}<span aria-hidden="true"> ✦</span></p>
          <p className="showcase-description">{activeGemstone.description}</p>

          <dl className="showcase-details">
            <div>
              <dt><span aria-hidden="true">⌖</span> Origin</dt>
              <dd>{activeGemstone.origin}</dd>
            </div>
            <div>
              <dt><span aria-hidden="true">◉</span> Planet</dt>
              <dd>{activeGemstone.planet}</dd>
            </div>
          </dl>

          <div
            className="showcase-benefits"
            style={{
              borderColor: currentTheme.borderGlow,
              transition: 'border-color 0.8s ease',
            }}
          >
            <h3
              style={{
                borderColor: currentTheme.borderGlow,
                color: currentTheme.color,
                transition: 'all 0.8s ease',
              }}
            >
              Worn for
            </h3>
            <ul>
              {activeGemstone.benefits.map((benefit, index) => (
                <li key={benefit}>
                  <span aria-hidden="true" style={{ color: currentTheme.color }}>
                    {index === 0 ? '♕' : index === 1 ? '✧' : index === 2 ? 'ϟ' : '❀'}
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="showcase-purchase">
            <p><span>from</span> <strong>{activeGemstone.price}</strong></p>
            <button
              type="button"
              onClick={handleViewStone}
              style={{
                background: currentTheme.color,
                borderColor: currentTheme.color,
                boxShadow: `0 6px 18px ${currentTheme.glow}`,
                transition: 'all 0.4s ease',
              }}
            >
              View Stone <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="showcase-stage" aria-label={`${activeGemstone.name} gemstone display`}>
        {/* Orbit Arc with all 6 stones — thumbnails only, no colored lines here */}
        <div className="showcase-orbit" role="group" aria-label="Choose a gemstone">
          <svg className="showcase-orbit-line" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
            {/* Base neutral guide line only */}
            <path
              d="M 10 40 A 40 40 0 0 1 90 40"
              className="showcase-orbit-base"
            />
          </svg>

          {/* All stones rendered on the orbit at all times */}
          {orbitSlots.map(({ gemstone, index, x, y }) => {
            const isActive = index === activeIndex;
            const stoneTheme = gemstoneThemes[gemstone.id] || gemstoneThemes['ruby'];

            return (
              <button
                className={`showcase-orbit-item ${isActive ? 'is-active' : ''}`}
                type="button"
                key={gemstone.id}
                aria-label={`Select ${gemstone.name}`}
                aria-pressed={isActive}
                style={{
                  left: `${x}%`,
                  top: `${(y / 50) * 100}%`,
                }}
                onClick={() => selectGemstone(index)}
              >
                <div
                  className="showcase-orbit-thumb-wrapper"
                  style={{
                    borderColor: isActive ? stoneTheme.color : '#d6b77f',
                    boxShadow: isActive
                      ? `0 0 0 3.5px ${stoneTheme.glow}, 0 6px 20px ${stoneTheme.glow}`
                      : '0 3px 8px rgba(84, 57, 26, .12)',
                    background: isActive ? stoneTheme.badgeBg : '#fffaf1',
                    transform: isActive ? 'scale(1.22)' : 'scale(1)',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <img src={gemstone.orbitImage} alt="" />
                </div>
                <span
                  style={{
                    color: isActive ? stoneTheme.color : '#33281e',
                    fontWeight: isActive ? 600 : 400,
                    transform: isActive ? 'translateX(-50%) scale(1.08)' : 'translateX(-50%)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {gemstone.name}
                </span>
              </button>
            );
          })}
        </div>

        <img className="showcase-doorway" src={doorway} alt="" />
        
        {/* Floating Gemstone Display inside Arch Chamber */}
        <div className="showcase-gem-slot">
          {/* Dynamic circular chamber aura inside the doorway arch in active stone color */}
          <div
            className="showcase-chamber-aura"
            style={{
              background: currentTheme.aura,
              boxShadow: `0 0 75px 25px ${currentTheme.glow}`,
              transition: 'background 0.8s ease, box-shadow 0.8s ease',
            }}
            aria-hidden="true"
          />
          {/* Colored glowing ring drawn INSIDE the arch circle — this is the animated ring */}
          <svg
            className="showcase-ring-glow"
            viewBox="0 0 100 100"
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '-18%',
              width: '136%',
              height: '136%',
              zIndex: 2,
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            {/* Base ring */}
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="rgba(164,112,42,0.25)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            {/* Animated colored glow ring — full circle always lit */}
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              style={{
                stroke: currentTheme.trackColor,
                filter: `drop-shadow(0 0 10px ${currentTheme.glow}) drop-shadow(0 0 20px ${currentTheme.glow})`,
                transition: 'stroke 0.8s ease, filter 0.8s ease',
              }}
            />
            {/* White progress trace — rotates around the ring with each gem advance */}
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - arcProgressPercent}
              style={{
                stroke: '#FFFFFF',
                filter: `drop-shadow(0 0 12px ${currentTheme.glow})`,
                transformOrigin: '50% 50%',
                transform: 'rotate(-90deg)',
                transition: 'stroke-dashoffset 0.9s cubic-bezier(0.34,1.2,0.64,1)',
              }}
            />
          </svg>
          <div className="showcase-gem-arrive" key={activeGemstone.id} style={{ position: 'relative', zIndex: 4 }}>
            <img
              className="showcase-main-gem"
              src={activeGemstone.image}
              alt={activeGemstone.name}
              decoding="async"
            />
          </div>
        </div>
        
        <img className="showcase-stone" src={stone} alt="" />
        
        {/* Pagination & Manual Navigation */}
        <div className="showcase-pagination" aria-label="Gemstone selection controls">
          <button
            type="button"
            aria-label="Previous gemstone"
            onClick={() => selectGemstone((activeIndex + gemstones.length - 1) % gemstones.length)}
          >
            ‹
          </button>
          <span>
            {String(activeIndex + 1).padStart(2, '0')} <i style={{ background: currentTheme.color }} /> {String(gemstones.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            aria-label="Next gemstone"
            onClick={() => selectGemstone((activeIndex + 1) % gemstones.length)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

export default GemstoneShowcaseSection;
