import { useEffect, useRef } from 'react';
import m4Small from '../../assets/optimized/m4-small.webp';
import m3Small from '../../assets/optimized/m3-clean-small.webp';
import m2Small from '../../assets/optimized/m2-small.webp';
import m1Small from '../../assets/optimized/m1-small.webp';
import m1 from '../../assets/optimized/m1.webp';
import m2 from '../../assets/optimized/m2.webp';
import m3 from '../../assets/optimized/m3-clean.webp';
import m4 from '../../assets/optimized/m4.webp';
import j1 from '../../assets/optimized/j1.webp';
import j2 from '../../assets/optimized/j2.webp';
import j3 from '../../assets/optimized/j3.webp';
import j4 from '../../assets/optimized/j4.webp';
import { LiquidDistortionImage } from '../animations/LiquidDistortionImage';
import { gsap, ScrollTrigger } from '../../lib/gsap';

const featuredImages = [
  { image: m1, small: m1Small, alt: 'Emerald and diamond earrings', label: 'Earrings' },
  { image: m2, small: m2Small, alt: 'Ruby and gold necklace', label: 'Necklaces' },
  { image: m3, small: m3Small, alt: 'Blue sapphire and diamond ring', label: 'Rings' },
  { image: m4, small: m4Small, alt: 'Yellow sapphire and gold bracelet', label: 'Bracelets' },
];

const jewelleryPieces = [
  { image: j1, alt: 'Pearl and gold earrings', name: 'Earrings', detail: 'Pearl · Gold' },
  { image: j2, alt: 'Ruby and gold ring', name: 'Ring', detail: 'Ruby · Gold' },
  { image: j3, alt: 'Blue sapphire necklace', name: 'Necklace', detail: 'Blue Sapphire · Gold' },
  { image: j4, alt: 'Emerald and gold bracelet', name: 'Bracelet', detail: 'Emerald · Gold' },
];

export function GallerySection() {
  const headerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const questionRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const mantraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const mantraItems = mantraRef.current ? Array.from(mantraRef.current.children) : [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 16, letterSpacing: '0.42em' },
          { opacity: 1, y: 0, letterSpacing: '0.32em', duration: 0.75, ease: 'power2.out' }
        );
      }

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
          '-=0.45'
        );
      }

      if (questionRef.current) {
        tl.fromTo(
          questionRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
          '-=0.45'
        );
      }

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
          '-=0.45'
        );
      }

      if (mantraItems.length > 0) {
        tl.fromTo(
          mantraItems,
          { opacity: 0, y: 16, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.12, ease: 'back.out(1.5)' },
          '-=0.4'
        );
      }
    }, header);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" className="gemstone-gallery" aria-labelledby="gallery-heading">
      <header ref={headerRef} className="gallery-heading">
        <p ref={eyebrowRef} className="gallery-heading-eyebrow">THE ART OF WEARING GEMSTONES</p>
        <h2 id="gallery-heading" ref={titleRef} className="gallery-heading-title">
          <span>Ancient Stones. </span>
          <em>Modern Expressions.</em>
        </h2>
        <p ref={questionRef} className="gallery-heading-question">
          Who says tradition can't be a statement of style?
        </p>
        <p ref={descRef} className="gallery-heading-desc">
          From delicate everyday jewellery to bold, contemporary designs, discover how timeless gemstones can become part of your personal style.
        </p>
        <div ref={mantraRef} className="gallery-heading-mantra" aria-label="Wear philosophy">
          <span className="gallery-mantra-item">
            <span className="gallery-mantra-dot" aria-hidden="true" />
            Wear the beauty.
          </span>
          <span className="gallery-mantra-item">
            <span className="gallery-mantra-dot" aria-hidden="true" />
            Carry the meaning.
          </span>
          <span className="gallery-mantra-item">
            <span className="gallery-mantra-dot" aria-hidden="true" />
            Make it yours.
          </span>
        </div>
      </header>

      <div className="gallery-featured-grid">
        {featuredImages.map((item) => (
          <a className="gallery-featured-item group" href="#ways-to-wear" aria-label={`Explore ${item.label}`} key={item.label}>
            <div className="gallery-featured-image">
              <LiquidDistortionImage
                imageUrl={item.image}
                srcSet={`${item.small} 640w, ${item.image} 1280w`}
                sizes="(max-width: 767px) 100vw, 50vw"
                alt={item.alt}
                className="w-full h-full"
              />
              <span className="gallery-featured-copy">
                <span className="gallery-featured-label">{item.label}</span>
                <span className="gallery-featured-action">Explore <span aria-hidden="true">→</span></span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <section className="gallery-featured-styles" aria-labelledby="gallery-featured-heading">
        <header className="gallery-featured-heading">
          <h3 id="gallery-featured-heading">Featured Styles</h3>
          <a href="#gemstone-collection">View All <span aria-hidden="true">→</span></a>
        </header>
        <div className="gallery-jewellery-grid" aria-label="Featured jewellery">
          {jewelleryPieces.map((piece) => (
            <article className="gallery-jewellery-item" key={piece.name}>
              <div className="gallery-jewellery-image">
                <img src={piece.image} alt={piece.alt} loading="lazy" decoding="async" />
              </div>
              <h4>{piece.name}</h4>
              <p>{piece.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default GallerySection;
