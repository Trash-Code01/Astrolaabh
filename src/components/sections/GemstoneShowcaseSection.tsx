import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import doorway from "../../assets/door'.webp";
import stone from '../../assets/stone.webp';
import { gemstones, type Gemstone } from '../../lib/gemstones';
import { scrollToTarget } from '../../lib/lenis';

const orbitPositions = ['ruby', 'blue-sapphire', 'emerald', 'yellow-sapphire', 'pearl', 'diamond'];

// Thin arc line color per gem
const gemLineColor: Record<string, string> = {
  'ruby':           '#D81B43',
  'blue-sapphire':  '#1E56A0',
  'emerald':        '#0D8253',
  'yellow-sapphire':'#D49419',
  'pearl':          '#C4B59D',
  'diamond':        '#60A5FA',
};

export function GemstoneShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerReset, setTimerReset] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const activeGemstone = gemstones[activeIndex];
  const activeLineColor = gemLineColor[activeGemstone.id] ?? 'rgba(164,112,42,0.78)';

  const orbitSlots = useMemo(() => gemstones.map((gemstone, index) => {
    const angle = Math.PI + (Math.PI * index) / (gemstones.length - 1);
    return {
      gemstone,
      index,
      x: 50 + 40 * Math.cos(angle),
      y: 40 + 40 * Math.sin(angle),
    };
  }), []);

  const inactiveOrbit = useMemo(
    () => orbitSlots.filter(({ index }) => index !== activeIndex),
    [activeIndex, orbitSlots],
  );

  const selectGemstone = useCallback((index: number) => {
    setActiveIndex(index);
    setTimerReset((value) => value + 1);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle every 4 seconds through all 6 gems
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

  return (
    <section ref={sectionRef} id="gemstone-showcase" className={`gemstone-showcase${isInView ? ' is-visible' : ''}`} aria-label="Interactive gemstone showcase">
      <div className="showcase-information" aria-live="polite">
        <p className="showcase-eyebrow">The Pancharatna Collection</p>
        <div className="showcase-copy" key={activeGemstone.id}>
          <h2>{activeGemstone.name}</h2>
          <p className="showcase-hindi">{activeGemstone.hindiName}</p>
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

          <div className="showcase-benefits">
            <h3>Worn for</h3>
            <ul>
              {activeGemstone.benefits.map((benefit, index) => (
                <li key={benefit}><span aria-hidden="true">{index === 0 ? '♕' : index === 1 ? '✧' : index === 2 ? 'ϟ' : '❀'}</span>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="showcase-purchase">
            <p><span>from</span> <strong>{activeGemstone.price}</strong></p>
            <button type="button" onClick={handleViewStone}>View Stone <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>

      <div className="showcase-stage" aria-label={`${activeGemstone.name} gemstone display`}>
        <div className="showcase-orbit" role="group" aria-label="Choose a gemstone">
          <svg className="showcase-orbit-line" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M 10 40 A 40 40 0 0 1 90 40"
              style={{
                stroke: activeLineColor,
                transition: 'stroke 0.7s ease',
              }}
            />
          </svg>
          {inactiveOrbit.map(({ gemstone, index, x, y }) => (
            <button
              className={`showcase-orbit-item showcase-orbit-${orbitPositions[index]}`}
              type="button"
              key={gemstone.id}
              aria-label={`Select ${gemstone.name}`}
              aria-pressed={false}
              style={{ left: `${x}%`, top: `${(y / 50) * 100}%` }}
              onClick={() => selectGemstone(index)}
            >
              <img src={gemstone.orbitImage} alt="" />
              <span>{gemstone.name}</span>
            </button>
          ))}
        </div>

        <img className="showcase-doorway" src={doorway} alt="" />
        <div className="showcase-gem-slot">
          <div className="showcase-gem-arrive" key={activeGemstone.id}>
            <img
              className="showcase-main-gem"
              src={activeGemstone.image}
              alt={activeGemstone.name}
              decoding="async"
            />
          </div>
        </div>
        <img className="showcase-stone" src={stone} alt="" />
        <div className="showcase-pagination" aria-label="Gemstone selection controls">
          <button type="button" aria-label="Previous gemstone" onClick={() => selectGemstone((activeIndex + gemstones.length - 1) % gemstones.length)}>‹</button>
          <span>{String(activeIndex + 1).padStart(2, '0')} <i /> {String(gemstones.length).padStart(2, '0')}</span>
          <button type="button" aria-label="Next gemstone" onClick={() => selectGemstone((activeIndex + 1) % gemstones.length)}>›</button>
        </div>
      </div>
    </section>
  );
}

export default GemstoneShowcaseSection;
