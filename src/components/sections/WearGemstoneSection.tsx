import { useEffect, useRef, useState } from 'react';
import earrings from '../../assets/m1.png';
import necklace from '../../assets/m2.png';
import ring from '../../assets/m3.png';
import bracelet from '../../assets/m4.png';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { scrollToTarget } from '../../lib/lenis';

const SLIDES = 5;

export function WearGemstoneSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const numberTrackRef = useRef<HTMLDivElement>(null);
  const pillDotRef = useRef<HTMLSpanElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const currentSlideRef = useRef(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = (targetIndex: number) => {
    const trigger = ScrollTrigger.getById('wear-lookbook');
    const section = sectionRef.current;
    if (!trigger || !section) return;

    const clamped = Math.min(SLIDES - 1, Math.max(0, targetIndex));
    const step = (trigger.end - trigger.start) / Math.max(1, SLIDES - 1);
    const targetScroll = trigger.start + clamped * step;
    scrollToTarget(targetScroll);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>('.lb-slide'));

    const applyWidths = () => {
      const width = section.clientWidth;
      slides.forEach((slide) => {
        slide.style.width = `${width}px`;
        slide.style.flexBasis = `${width}px`;
      });
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      section.dataset.slide = '1';
      return;
    }

    applyWidths();

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - section.clientWidth),
        ease: 'none',
        scrollTrigger: {
          id: 'wear-lookbook',
          trigger: section,
          start: 'top top',
          end: () => `+=${section.clientWidth * (SLIDES - 0.8)}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (SLIDES - 1),
            duration: { min: 0.28, max: 0.65 },
            delay: 0.06,
            ease: 'power2.out',
          },
          onToggle: (self) => document.body.classList.toggle('lb-engaged', self.isActive),
          onUpdate: (self) => {
            const p = self.progress;

            // 1. Direct bottom progress line fill
            if (progressFillRef.current) {
              progressFillRef.current.style.transform = `scaleX(${p})`;
            }

            // 2. Mouse scroll indicator fade
            if (scrollIndicatorRef.current) {
              scrollIndicatorRef.current.style.opacity = String(Math.max(0, 1 - p * 6));
            }

            // 3. Lookbook step meter dashes
            const meterDashes = section.querySelectorAll<HTMLElement>('.lb-dash-fill');
            meterDashes.forEach((dash, idx) => {
              const dashProgress = Math.max(0, Math.min(1, p * (SLIDES - 1) - idx));
              dash.style.transform = `scaleX(${dashProgress})`;
            });

            // 4. Slide index calculation
            const rawIdx = p * (SLIDES - 1);
            const slideIdx = Math.min(SLIDES - 1, Math.max(0, Math.round(rawIdx)));

            if (currentSlideRef.current !== slideIdx) {
              currentSlideRef.current = slideIdx;
              setActiveSlide(slideIdx);
            }

            // 5. Number reel track translation
            if (numberTrackRef.current) {
              numberTrackRef.current.style.transform = `translateY(-${slideIdx * 20}%)`;
            }

            // 6. Pill dot translation
            if (pillDotRef.current) {
              pillDotRef.current.style.transform = `translateX(${slideIdx * 12}px)`;
            }

            // 7. Meter button active states
            section.querySelectorAll<HTMLElement>('.lb-meter-num').forEach((btn, idx) => {
              const isActive = idx === slideIdx;
              btn.classList.toggle('is-active', isActive);
              btn.setAttribute('aria-current', isActive ? 'true' : 'false');
            });

            // 8. Arrow buttons state
            if (prevBtnRef.current) prevBtnRef.current.disabled = slideIdx === 0;
            if (nextBtnRef.current) nextBtnRef.current.disabled = slideIdx === SLIDES - 1;

            section.dataset.slide = String(slideIdx + 1);
          },
        },
      });

      // Layered horizontal parallax on designated elements
      section.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = Number(el.dataset.parallax) || 28;
        const slide = el.closest('.lb-slide');
        if (!slide) return;
        gsap.fromTo(el, { x: amount }, {
          x: -amount,
          ease: 'none',
          scrollTrigger: {
            trigger: slide,
            containerAnimation: tween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        });
      });
    }, section);

    const onRefresh = () => applyWidths();
    ScrollTrigger.addEventListener('refreshInit', onRefresh);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh);
      ScrollTrigger.removeEventListener('refreshInit', onRefresh);
      document.body.classList.remove('lb-engaged');
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ways-to-wear"
      className="lb"
      data-slide="1"
      aria-label="How to wear gemstones"
    >
      <div className="lb-viewport">
        {/* Pinned Top Editorial Nav Header (Matching reference video) */}
        <header className="lb-nav" aria-label="Editorial navigation">
          <div className="lb-brand">
            <span className="lb-brand-mark" aria-hidden="true">✦</span>
            <span>ASTRO LAABH</span>
          </div>
          <nav className="lb-nav-links" aria-label="Editorial categories">
            <button type="button" className="is-active" onClick={() => goToSlide(0)}>Editorial</button>
            <button type="button" onClick={() => scrollToTarget('gemstones')}>Collections</button>
            <button type="button" onClick={() => scrollToTarget('our-story')}>Vedic Craft</button>
            <button type="button" onClick={() => scrollToTarget('consultation')}>The Ritual</button>
          </nav>
          <div className="lb-nav-action">
            <button type="button" onClick={() => scrollToTarget('consultation')} aria-label="Consult master astrologer">
              <span>Consult Astrologer</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </header>

        {/* Horizontal Sliding Track */}
        <div ref={trackRef} className="lb-track">
          {/* SLIDE 1: EARRINGS (Reference: "THE LITTLE VANITY") */}
          <article className="lb-slide is-earrings" aria-label="Earrings">
            <figure className="lb-photo lb-photo-earrings" data-parallax="40">
              <img src={earrings} alt="Close-up of an emerald and diamond earring worn on the ear" />
            </figure>
            <div className="lb-shape lb-shape-earrings" data-parallax="-30" aria-hidden="true" />
            <div className="lb-seal" aria-hidden="true">
              <svg viewBox="0 0 80 90">
                <polygon points="40,3 76,24 76,66 40,87 4,66 4,24" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
              <span>The<br />Edit</span>
            </div>
            <div className="lb-copy lb-copy-earrings" data-parallax="-24">
              <p className="lb-kicker"><span>The</span><span>Gemstone</span><span>Edit</span></p>
              <h2 className="lb-title">Earrings</h2>
              <p className="lb-body">A subtle way to let your gemstone become part of your everyday expression.</p>
              <button type="button" className="lb-cta" onClick={() => scrollToTarget('gemstone-showcase')}>
                Discover Earrings <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>

          {/* SLIDE 2: RINGS (Reference: "WEEK IN FASHION / EDITORIAL") */}
          <article className="lb-slide is-rings" aria-label="Rings">
            <div className="lb-copy lb-copy-rings" data-parallax="-20">
              <span className="lb-rule" aria-hidden="true" />
              <h2 className="lb-subhead">Let the stone speak</h2>
              <p className="lb-body">A gemstone ring keeps its meaning close, quietly becoming part of your everyday ritual.</p>
            </div>
            <figure className="lb-photo lb-photo-rings-detail" data-parallax="16">
              <img src={ring} alt="Sapphire ring worn on the hand, resting against ivory fabric" />
            </figure>
            <div className="lb-shape lb-shape-rings" data-parallax="-15" aria-hidden="true" />
            <p className="lb-vertical" data-parallax="-30">Rings</p>
            <figure className="lb-photo lb-photo-rings" data-parallax="34">
              <img src={ring} alt="Close-up of a blue sapphire ring on an elegant hand" />
            </figure>
          </article>

          {/* SLIDE 3: NECKLACES (Reference: "UNLEASH YOUR SENSUALITY") */}
          <article className="lb-slide is-necklaces" aria-label="Necklaces">
            <div className="lb-shape lb-shape-neck-a" data-parallax="25" aria-hidden="true" />
            <div className="lb-shape lb-shape-neck-b" data-parallax="-25" aria-hidden="true" />
            <h2 className="lb-display" data-parallax="-22">
              <span>Neck</span>
              <span>laces</span>
            </h2>
            <p className="lb-aside" data-parallax="-15">Worn at heart</p>
            <figure className="lb-photo lb-photo-neck" data-parallax="32">
              <img src={necklace} alt="Ruby and diamond necklace worn at the collarbone with an ivory neckline" />
            </figure>
            <div className="lb-copy lb-copy-neck" data-parallax="-18">
              <h3 className="lb-subhead">Wear your intention close</h3>
              <p className="lb-body">A necklace brings the gemstone close to the heart, where intention becomes part of the ritual.</p>
              <button type="button" className="lb-cta" onClick={() => scrollToTarget('gemstone-showcase')}>
                Explore the Look <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>

          {/* SLIDE 4: BRACELETS (Reference: "BE YOUR OWN MUSE") */}
          <article className="lb-slide is-bracelets" aria-label="Bracelets">
            <div className="lb-shape lb-shape-bracelets" data-parallax="-25" aria-hidden="true" />
            <figure className="lb-photo lb-photo-bracelets" data-parallax="30">
              <img src={bracelet} alt="Yellow sapphire bracelet worn on the wrist against ivory satin" />
            </figure>
            <h2 className="lb-display lb-display-bracelets" data-parallax="-24">Bracelets</h2>
            <div className="lb-copy lb-copy-bracelets" data-parallax="-16">
              <h3 className="lb-subhead">Carry it with you</h3>
              <p className="lb-body">A bracelet turns the gemstone into something you can carry with you throughout the day.</p>
              <button type="button" className="lb-cta" onClick={() => scrollToTarget('gemstone-showcase')}>
                Discover Bracelets <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>

          {/* SLIDE 5: YOUR STONE YOUR WAY & REWIND (Reference: "DON'T HIDE YOURSELF / REWIND") */}
          <article className="lb-slide is-yours" aria-label="Personal style">
            <div className="lb-shape lb-shape-yours" data-parallax="-25" aria-hidden="true" />
            <h2 className="lb-display lb-display-yours" data-parallax="-20">
              <span>Your stone</span>
              <span>Your way</span>
            </h2>

            {/* Rotating Sacred Seal Stamp (Matching spinning badge in reference video frame 018) */}
            <div className="lb-stamp" data-parallax="12" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="lb-stamp-svg">
                <path
                  id="stampPath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text>
                  <textPath href="#stampPath" startOffset="0%">
                    ✦ SACRED VEDIC ATELIER ✦ ASTRO LAABH ✦
                  </textPath>
                </text>
              </svg>
              <span className="lb-stamp-center">✦</span>
            </div>

            <figure className="lb-photo lb-photo-yours-a" data-parallax="20">
              <img src={bracelet} alt="A gemstone bracelet styled on the wrist" />
            </figure>
            <figure className="lb-photo lb-photo-yours-b" data-parallax="32">
              <img src={necklace} alt="A gemstone necklace styled at the neck" />
            </figure>

            <div className="lb-copy lb-copy-yours" data-parallax="-16">
              <p className="lb-body">There is no single way to wear a gemstone. Find the form that feels naturally yours.</p>
              <button type="button" className="lb-cta" onClick={() => scrollToTarget('gemstones')}>
                Explore All Gemstones <span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Circular Rewind Button (Matching reference video frame 028) */}
            <button
              type="button"
              className="lb-rewind-btn"
              onClick={() => goToSlide(0)}
              aria-label="Rewind to first slide"
            >
              <span className="lb-rewind-circle">
                <span className="lb-rewind-arrow" aria-hidden="true">←</span>
                <span className="lb-rewind-label">REWIND</span>
              </span>
            </button>
          </article>
        </div>

        {/* Pinned Bottom-Left Mouse Scroll Indicator (Matching reference video frame 001) */}
        <div ref={scrollIndicatorRef} className="lb-scroll-indicator" aria-hidden="true">
          <div className="lb-mouse-icon">
            <span className="lb-mouse-wheel" />
          </div>
          <span className="lb-scroll-text">Scroll to explore</span>
          <span className="lb-scroll-line" />
        </div>

        {/* Pinned Bottom-Center Lookbook Step Meter */}
        <nav className="lb-meter" aria-label="Lookbook progress">
          {['01', '02', '03', '04', '05'].map((label, index) => (
            <span className="lb-meter-step" key={label}>
              {index > 0 && (
                <span className="lb-dash">
                  <span className="lb-dash-fill" />
                </span>
              )}
              <button
                type="button"
                className={`lb-meter-num ${activeSlide === index ? 'is-active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-current={activeSlide === index ? 'true' : 'false'}
                aria-label={`Slide ${label}`}
              >
                {label}
              </button>
            </span>
          ))}
        </nav>

        {/* Pinned Bottom-Right Slide Controls with Mechanical Rolling Digit Counter */}
        <aside className="lb-meta" aria-label="Slide controls">
          <div className="lb-controls">
            <button
              type="button"
              className="lb-pill-btn"
              aria-label={`Current slide ${activeSlide + 1} of ${SLIDES}`}
              onClick={() => goToSlide((activeSlide + 1) % SLIDES)}
            >
              <span ref={pillDotRef} className="lb-pill-dot" />
            </button>
            <button
              ref={prevBtnRef}
              type="button"
              className="lb-arrow-btn"
              onClick={() => goToSlide(activeSlide - 1)}
              disabled={activeSlide === 0}
              aria-label="Previous composition"
            >
              ‹
            </button>
            <button
              ref={nextBtnRef}
              type="button"
              className="lb-arrow-btn"
              onClick={() => goToSlide(activeSlide + 1)}
              disabled={activeSlide === SLIDES - 1}
              aria-label="Next composition"
            >
              ›
            </button>
          </div>

          <div className="lb-number" aria-live="polite">
            <div className="lb-number-row">
              <i className="lb-number-star" aria-hidden="true">*</i>
              <div className="lb-number-reel" aria-label={`Slide ${activeSlide + 1} of 5`}>
                <div ref={numberTrackRef} className="lb-number-track">
                  {['01', '02', '03', '04', '05'].map((num) => (
                    <span key={num} className="lb-number-val">{num}</span>
                  ))}
                </div>
              </div>
            </div>
            <small className="lb-number-tags">
              <span>Wear</span>
              <span>Style</span>
              <span>Intention</span>
            </small>
          </div>
        </aside>

        {/* Pinned Edge-to-Edge Bottom Progress Line (Matching reference video) */}
        <div className="lb-progress-bar" aria-hidden="true">
          <div ref={progressFillRef} className="lb-progress-fill" />
        </div>
      </div>
    </section>
  );
}

export default WearGemstoneSection;
