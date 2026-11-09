import { useEffect, useRef } from 'react';
import model1 from '../../assets/model1.webp';
import model2 from '../../assets/model2.webp';
import model3 from '../../assets/model3.webp';
import model4 from '../../assets/model4.webp';
import ruby from '../../assets/ruby.webp';
import sapphire from '../../assets/sapphire.webp';
import gold from '../../assets/gold.webp';
import emerald from '../../assets/emerald.webp';
import { gsap, ScrollTrigger } from '../../lib/gsap';

const panels = [
  {
    number: '01',
    model: model1,
    gemstone: gold,
    title: 'GOLD PENDANT',
    caption: 'A GOLD GEMSTONE',
    style: 'The Pendant',
    copy: 'A golden gemstone pendant carries quiet warmth close to the heart, bringing personal intention into every day.',
  },
  {
    number: '02',
    model: model2,
    gemstone: ruby,
    title: 'RUBY BRACELET',
    caption: 'A RUBY, IN MOTION',
    style: 'The Bracelet',
    copy: 'A Ruby bracelet adds elegant warmth to the wrist, celebrating vitality, confidence and enduring personal meaning.',
  },
  {
    number: '03',
    model: model3,
    gemstone: sapphire,
    title: 'SAPPHIRE EARRINGS',
    caption: 'SAPPHIRE, FRAMING LIGHT',
    style: 'The Earrings',
    copy: 'Sapphire earrings frame the face with serene blue beauty, expressing clarity, wisdom and understated elegance.',
  },
  {
    number: '04',
    model: model4,
    gemstone: emerald,
    title: 'EMERALD NECKLACE',
    caption: 'AN EMERALD, AT THE HEART',
    style: 'The Necklace',
    copy: 'An Emerald necklace rests with natural grace, symbolising renewal, harmony and a meaningful connection to the heart.',
  },
];

export function WearGemstoneSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Use clean GSAP context with GPU-accelerated horizontal pin
    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="ways-to-wear" className="wear-scroll-section" aria-label="Ways to wear your gemstone">
      <div className="wear-scroll-sticky">
        <div ref={trackRef} className="wear-panels-track">
          {panels.map((panel, index) => (
            <article key={panel.number} className={`wear-panel wear-panel-${index + 1}`}>
              <header className="wear-panel-heading">
                <p className="wear-panel-kicker">ASTROLAABH · {panel.number}</p>
                <h1>{panel.title}</h1>
              </header>

              <div className="wear-panel-product wear-panel-product-left">
                <div className="wear-product-upper">
                  <span>WORN AS</span>
                  <strong>{panel.style}</strong>
                  <small>{panel.caption}</small>
                </div>
                <div className="wear-product-image"><img src={panel.gemstone} alt={`${panel.caption} gemstone`} loading="lazy" decoding="async" /></div>
              </div>

              <figure className="wear-panel-model">
                <img src={panel.model} alt={`${panel.style} gemstone editorial portrait`} loading="lazy" decoding="async" />
              </figure>

              <div className="wear-panel-product wear-panel-product-right">
                <div className="wear-product-upper">
                  <span>CHOSEN FOR</span>
                  <strong>Meaning</strong>
                  <small>Beauty · Energy<br />Lasting Value</small>
                </div>
                <div className="wear-product-image"><img src={panel.gemstone} alt="" aria-hidden="true" loading="lazy" decoding="async" /></div>
              </div>

              <p className="wear-panel-description">{panel.copy}</p>
              <p className="wear-panel-progress">{panel.number} <span>/ 04</span></p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WearGemstoneSection;
