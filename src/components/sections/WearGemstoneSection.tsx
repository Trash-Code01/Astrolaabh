import braceletSmall from '../../assets/optimized/m4-small.webp';
import ringSmall from '../../assets/optimized/m3-small.webp';
import necklaceSmall from '../../assets/optimized/m2-small.webp';
import earringsSmall from '../../assets/optimized/m1-small.webp';
import { useEffect, useRef, useState } from 'react';
import earrings from '../../assets/optimized/m1.webp';
import necklace from '../../assets/optimized/m2.webp';
import ring from '../../assets/optimized/m3.webp';
import bracelet from '../../assets/optimized/m4.webp';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { scrollToTarget } from '../../lib/lenis';

const SLIDES = 5;

function SlideMeta({ index }: { index: string }) {
  return (
    <div className="lb-meta">
      <div className="lb-controls">
        <span className="lb-pill" aria-hidden="true" />
        <button type="button" data-lb-go="-1" aria-label="Previous composition">‹</button>
        <button type="button" data-lb-go="1" aria-label="Next composition">›</button>
      </div>
      <div className="lb-number">
        <strong><i>*</i>{index}</strong>
        <div className="lb-number-tags">
          <span>Wear</span>
          <span>Style</span>
          <span>Intention</span>
        </div>
      </div>
    </div>
  );
}

function LookCta({ children, target = 'gemstone-showcase' }: { children: string; target?: string }) {
  return (
    <button type="button" className="lb-cta" data-lb-target={target}>
      {children} <span aria-hidden="true">→</span>
    </button>
  );
}

export function WearGemstoneSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [compact, setCompact] = useState(() => matchMedia('(max-width: 900px), (pointer: coarse), (prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(max-width: 900px), (pointer: coarse), (prefers-reduced-motion: reduce)');
    const change = () => setCompact(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>('.lb-slide'));

    const applyWidths = () => {
      const width = section.clientWidth || window.innerWidth;
      slides.forEach((slide) => {
        slide.style.width = `${width}px`;
        slide.style.minWidth = `${width}px`;
        slide.style.maxWidth = `${width}px`;
        slide.style.flex = `0 0 ${width}px`;
        slide.style.flexShrink = '0';
      });
      if (track) {
        track.style.width = `${width * slides.length}px`;
        track.style.display = 'flex';
        track.style.flexWrap = 'nowrap';
      }
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onClick = (event: MouseEvent) => {
      const origin = event.target as HTMLElement | null;
      const jump = origin?.closest<HTMLElement>('[data-lb-jump]');
      const dir = origin?.closest<HTMLElement>('[data-lb-go]');
      const link = origin?.closest<HTMLElement>('[data-lb-target]');
      if (!jump && !dir && !link) return;

      if (link?.dataset.lbTarget) {
        scrollToTarget(link.dataset.lbTarget);
        return;
      }

      const trigger = ScrollTrigger.getById('wear-lookbook');
      const count = slides.length;
      if (!trigger) {
        const viewportCenter = window.innerHeight / 2;
        const current = slides.reduce((closest, slide, index) => {
          const distance = Math.abs(slide.getBoundingClientRect().top + slide.offsetHeight / 2 - viewportCenter);
          const closestDistance = Math.abs(
            slides[closest].getBoundingClientRect().top + slides[closest].offsetHeight / 2 - viewportCenter,
          );
          return distance < closestDistance ? index : closest;
        }, 0);
        const requested = jump ? Number(jump.dataset.lbJump) : current + Number(dir?.dataset.lbGo || 0);
        const index = Math.min(count - 1, Math.max(0, requested));
        slides[index]?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
        return;
      }

      const step = (trigger.end - trigger.start) / Math.max(1, count - 1);
      const current = Math.round(trigger.progress * (count - 1));
      const requested = jump ? Number(jump.dataset.lbJump) : current + Number(dir?.dataset.lbGo || 0);
      const index = Math.min(count - 1, Math.max(0, requested));
      scrollToTarget(trigger.start + index * step);
    };

    section.addEventListener('click', onClick);

    if (compact) {
      track.removeAttribute('style');
      slides.forEach(slide => slide.removeAttribute('style'));
      section.dataset.slide = '1';
      return () => section.removeEventListener('click', onClick);
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
          end: () => `+=${Math.max(section.clientWidth, track.scrollWidth - section.clientWidth)}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => document.body.classList.toggle('lb-engaged', self.isActive),
          onUpdate: (self) => {
            section.style.setProperty('--lb-p', self.progress.toFixed(4));
            const index = Math.min(SLIDES - 1, Math.max(0, Math.round(self.progress * (SLIDES - 1))));
            const label = String(index + 1);
            if (section.dataset.slide !== label) {
              section.dataset.slide = label;
              section.querySelectorAll<HTMLElement>('[data-n]').forEach((button) => {
                button.setAttribute('aria-current', button.dataset.n === label ? 'true' : 'false');
              });
            }
          },
        },
      });

      section.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = Number(el.dataset.parallax) || 24;
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
      section.removeEventListener('click', onClick);
      ScrollTrigger.removeEventListener('refreshInit', onRefresh);
      document.body.classList.remove('lb-engaged');
      ctx.revert();
    };
  }, [compact]);

  return (
    <section
      ref={sectionRef}
      id="ways-to-wear"
      className={`lb${compact ? ' lb-native' : ''}`}
      data-slide="1"
      aria-label="How to wear gemstones"
    >
      <div className="lb-viewport">
        <div ref={trackRef} className="lb-track">
          <article className="lb-slide is-earrings" aria-label="Earrings">
            <figure className="lb-photo lb-photo-earrings" data-parallax="42">
              <img loading="lazy" decoding="async" src={earrings} srcSet={`${earringsSmall} 640w, ${earrings} 1280w`} sizes="(max-width: 900px) 100vw, 55vw" alt="Close-up of an emerald and diamond earring worn on the ear" />
            </figure>
            <div className="lb-shape lb-shape-earrings" aria-hidden="true" />
            <div className="lb-seal" aria-hidden="true">
              <svg viewBox="0 0 80 90">
                <polygon points="40,3 76,24 76,66 40,87 4,66 4,24" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
              <span>The<br />Edit</span>
            </div>
            <div className="lb-copy lb-copy-earrings" data-parallax="-26">
              <p className="lb-kicker"><span>The</span><span>Gemstone</span><span>Edit</span></p>
              <h2 className="lb-title">Earrings</h2>
              <p className="lb-body">A subtle way to let your gemstone become part of your everyday expression.</p>
              <LookCta>Discover Earrings</LookCta>
            </div>
            <SlideMeta index="01" />
          </article>

          <article className="lb-slide is-rings" aria-label="Rings">
            <div className="lb-shape lb-shape-rings" aria-hidden="true" />
            <div className="lb-copy lb-copy-rings" data-parallax="-18">
              <span className="lb-rule" aria-hidden="true" />
              <h2 className="lb-subhead">Let the stone speak</h2>
              <p className="lb-body">A gemstone ring keeps its meaning close, quietly becoming part of your everyday ritual.</p>
            </div>
            <figure className="lb-photo lb-photo-rings-detail" data-parallax="20">
              <img loading="lazy" decoding="async" src={ring} srcSet={`${ringSmall} 640w, ${ring} 1280w`} sizes="(max-width: 900px) 100vw, 55vw" alt="Sapphire ring worn on the hand, resting against ivory fabric" />
            </figure>
            <p className="lb-vertical">Rings</p>
            <figure className="lb-photo lb-photo-rings" data-parallax="34">
              <img loading="lazy" decoding="async" src={ring} srcSet={`${ringSmall} 640w, ${ring} 1280w`} sizes="(max-width: 900px) 100vw, 55vw" alt="Close-up of a blue sapphire ring on an elegant hand" />
            </figure>
            <SlideMeta index="02" />
          </article>

          <article className="lb-slide is-necklaces" aria-label="Necklaces">
            <div className="lb-shape lb-shape-neck-a" aria-hidden="true" />
            <div className="lb-shape lb-shape-neck-b" aria-hidden="true" />
            <h2 className="lb-display" data-parallax="-18">
              <span>Neck</span>
              <span>laces</span>
            </h2>
            <p className="lb-aside">Worn</p>
            <figure className="lb-photo lb-photo-neck" data-parallax="28">
              <img loading="lazy" decoding="async" src={necklace} srcSet={`${necklaceSmall} 640w, ${necklace} 1280w`} sizes="(max-width: 900px) 100vw, 55vw" alt="Ruby and diamond necklace worn at the collarbone with an ivory neckline" />
            </figure>
            <div className="lb-copy lb-copy-neck">
              <h3 className="lb-subhead">Wear your intention close</h3>
              <p className="lb-body">A necklace brings the gemstone close to the heart, where intention becomes part of the ritual.</p>
              <LookCta>Explore the Look</LookCta>
            </div>
            <SlideMeta index="03" />
          </article>

          <article className="lb-slide is-bracelets" aria-label="Bracelets">
            <div className="lb-shape lb-shape-bracelets" aria-hidden="true" />
            <h2 className="lb-display lb-display-bracelets" data-parallax="-22">Bracelets</h2>
            <figure className="lb-photo lb-photo-bracelets" data-parallax="30">
              <img loading="lazy" decoding="async" src={bracelet} srcSet={`${braceletSmall} 640w, ${bracelet} 1280w`} sizes="(max-width: 900px) 100vw, 55vw" alt="Yellow sapphire bracelet worn on the wrist against ivory satin" />
            </figure>
            <div className="lb-copy lb-copy-bracelets">
              <h3 className="lb-subhead">Carry it with you</h3>
              <p className="lb-body">A bracelet turns the gemstone into something you can carry with you throughout the day.</p>
              <LookCta>Discover Bracelets</LookCta>
            </div>
            <SlideMeta index="04" />
          </article>

          <article className="lb-slide is-yours" aria-label="Personal style">
            <div className="lb-shape lb-shape-yours" aria-hidden="true" />
            <h2 className="lb-display lb-display-yours" data-parallax="-16">
              <span>Your stone</span>
              <span>Your way</span>
            </h2>
            <figure className="lb-photo lb-photo-yours-a" data-parallax="18">
              <img loading="lazy" decoding="async" src={bracelet} srcSet={`${braceletSmall} 640w, ${bracelet} 1280w`} sizes="(max-width: 900px) 100vw, 55vw" alt="A gemstone bracelet styled on the wrist" />
            </figure>
            <figure className="lb-photo lb-photo-yours-b" data-parallax="26">
              <img loading="lazy" decoding="async" src={necklace} srcSet={`${necklaceSmall} 640w, ${necklace} 1280w`} sizes="(max-width: 900px) 100vw, 55vw" alt="A gemstone necklace styled at the neck" />
            </figure>
            <div className="lb-copy lb-copy-yours">
              <p className="lb-body">There is no single way to wear a gemstone. Find the form that feels naturally yours.</p>
              <LookCta>Explore Gemstones</LookCta>
            </div>
            <SlideMeta index="05" />
          </article>
        </div>

        <nav className="lb-meter" aria-label="Lookbook progress">
          {['01', '02', '03', '04', '05'].map((label, index) => (
            <span className="lb-meter-step" key={label}>
              {index > 0 && <i className="lb-dash" style={{ '--i': index - 1 } as React.CSSProperties} />}
              <button type="button" data-n={index + 1} data-lb-jump={index} aria-current={index === 0 ? 'true' : 'false'} aria-label={`Composition ${label}`}>
                {label}
              </button>
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default WearGemstoneSection;
