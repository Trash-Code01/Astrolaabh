import { brandLogo } from '../../../lib/brand';
import { navigateToProduct } from '../../../lib/navigation';
import { ArrowRight } from 'lucide-react';

import footerIllustration from '../../../assets/optimized/footer-water.webp';
import { LiquidDistortionImage } from '../../animations/LiquidDistortionImage';

const exploreLinks = ['Gemstones', 'Ways to Wear', 'Our Story', 'Consultation', 'Journal'];
const gemstoneLinks = ['Ruby', 'Emerald', 'Blue Sapphire', 'Yellow Sapphire', 'Pearl', 'Red Coral', 'Hessonite', 'Cat\'s Eye'];
const supportLinks = ['FAQs', 'Gemstone Guide', 'Shipping & Delivery', 'Care Guide', 'Contact Us'];
const exploreTargets: Record<string, string> = { Gemstones: 'gemstone-collection', 'Ways to Wear': 'ways-to-wear', 'Our Story': 'narrative', Consultation: 'appointment', Journal: 'narrative' };
const supportTargets: Record<string, string> = { FAQs: 'faqs', 'Gemstone Guide': 'gemstone-collection', 'Shipping & Delivery': 'faqs', 'Care Guide': 'ways-to-wear', 'Contact Us': 'appointment' };
const gemstoneSlugs: Record<string, string> = { Ruby: 'ruby', Emerald: 'emerald', 'Blue Sapphire': 'blue-sapphire', 'Yellow Sapphire': 'yellow-sapphire', Pearl: 'pearl', 'Red Coral': 'red-coral', Hessonite: 'hessonite', "Cat's Eye": 'cats-eye' };

export function Footer({ productPage = false }: { productPage?: boolean }) {
  const sectionHref = (id: string) => id === 'appointment' ? '/find-gem#consultation' : productPage ? `/#${id}` : `#${id}`;
  const gemstoneHref = (name: string) => productPage ? `/product/${gemstoneSlugs[name]}` : `/#product/${gemstoneSlugs[name]}`;
  return (
    <footer className="brand-footer relative z-20 overflow-hidden bg-mist pb-0 pt-16 text-ink md:pt-20">
      <div className="relative z-10 w-full box-border px-[clamp(40px,7vw,110px)]">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] xl:gap-x-[clamp(28px,4vw,80px)]">
          <div className="max-w-[360px] min-w-0">
            <div aria-hidden="true" className="mb-[18px] inline-grid h-[34px] w-[34px] place-items-center rounded-full border border-champagne/80 text-[13px] text-champagne">✦</div>
            <h2 className="m-0 font-sans text-[clamp(30px,2.7vw,42px)] font-normal tracking-[0.12em] text-sand"><img src={brandLogo} alt="Astro Laabh" className="h-[1.2em] w-auto" /></h2>
            <p className="mt-[18px] font-sans text-base italic leading-6 text-ink">Where ancient wisdom meets the language of gemstones.</p>
            <p className="mt-[12px] max-w-[320px] font-sans text-[13px] leading-[1.7] text-ink/75">
              Discover gemstones chosen with intention, guided by Vedic wisdom and crafted for a more meaningful everyday.
            </p>
            <div className="mt-5 flex flex-col gap-1.5 font-sans text-[11px] tracking-[0.08em] text-ink/70">
              <span>hello@astrolaabh.com</span>
              <span>+91 00000 00000</span>
              <span>India</span>
            </div>
          </div>

          <nav className="min-w-0" aria-label="Explore footer links">
            <h3 className="mb-[18px] font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink">EXPLORE</h3>
            <ul className="m-0 list-none space-y-[11px] p-0">
              {exploreLinks.map((link) => (
                <li key={link}>
                  <a href={sectionHref(exploreTargets[link])} className="group relative text-[12px] tracking-[0.04em] text-ink/85 transition-colors duration-250 hover:text-subdued">
                    <span className="after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-champagne/80 after:transition-transform after:duration-250 group-hover:after:scale-x-100">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="min-w-0" aria-label="Gemstones footer links">
            <h3 className="mb-[18px] font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink">GEMSTONES</h3>
            <ul className="m-0 list-none space-y-[11px] p-0">
              {gemstoneLinks.map((link) => (
                <li key={link}>
                  <a href={gemstoneHref(link)} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); navigateToProduct(gemstoneSlugs[link]); } }} className="group relative text-[12px] tracking-[0.04em] text-ink/85 transition-colors duration-250 hover:text-subdued">
                    <span className="after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-champagne/80 after:transition-transform after:duration-250 group-hover:after:scale-x-100">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="min-w-0" aria-label="Support footer links">
            <h3 className="mb-[18px] font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink">SUPPORT</h3>
            <ul className="m-0 list-none space-y-[11px] p-0">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a href={sectionHref(supportTargets[link])} className="group relative text-[12px] tracking-[0.04em] text-ink/85 transition-colors duration-250 hover:text-subdued">
                    <span className="after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-champagne/80 after:transition-transform after:duration-250 group-hover:after:scale-x-100">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-full min-w-0 justify-self-end xl:max-w-[360px]">
            <span className="mb-[12px] block font-sans text-[9px] uppercase tracking-[0.2em] text-subdued">STAY CONNECTED</span>
            <h3 className="m-0 font-sans text-[clamp(26px,2vw,34px)] font-normal leading-[1.15] text-ink">Receive the wisdom behind the stone.</h3>
            <p className="mt-[12px] font-sans text-[13px] leading-[1.7] text-ink/75">
              Occasional notes on gemstones, Vedic traditions and thoughtful ways to wear them.
            </p>

            <form onSubmit={(event) => event.preventDefault()} className="mt-[18px]">
              <label className="flex h-[52px] items-center gap-[10px] rounded-full border border-champagne/65 bg-white/5 px-[14px]">
                <span className="sr-only">Email address</span>
                <input type="email" placeholder="Your email address" className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14px] text-ink outline-none placeholder:text-ink/50" />
                <button type="submit" aria-label="Subscribe" className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full bg-champagne text-mist transition-colors duration-200 hover:bg-forest">
                  <ArrowRight className="h-[18px] w-[18px]" />
                </button>
              </label>
            </form>
          </div>
        </div>

        <div className="mt-[42px] flex flex-col items-center justify-between gap-3 border-t border-sage/10 pb-[18px] pt-[18px] font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-subdued sm:flex-row">
          <span>FROM EARTH • THROUGH WISDOM • TO INTENTION</span>
          <span className="text-ink/65">Crafted with care by <span className="font-semibold tracking-[0.24em] text-subdued">DEVACIA</span></span>
        </div>
      </div>

      <div className="relative left-1/2 mt-4 aspect-[3/1] w-screen max-w-none -translate-x-1/2 overflow-hidden leading-none" aria-hidden="true">
        <LiquidDistortionImage imageUrl={footerIllustration} alt="" strength={0.052} radius={0.52} className="w-full h-full" />
      </div>
    </footer>
  );
}
