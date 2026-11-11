import { ArrowRight, Compass, Sparkles, UserCheck, Shield, Gem, Award } from 'lucide-react';
import { scrollToTarget } from '../../lib/lenis';

export function CTASection() {
  const handleConsult = () => {
    scrollToTarget('appointment');
  };

  const handleExplore = () => {
    scrollToTarget('gemstone-showcase');
  };

  return (
    <section id="final-cta" className="final-cta-section" aria-labelledby="final-cta-heading">
      <div className="final-cta-ambient" aria-hidden="true" />

      <div className="final-cta-container">
        <header className="final-cta-header">
          <p className="final-cta-eyebrow">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#B8860B]" />
            YOUR CELESTIAL ALIGNMENT AWAITS
            <Sparkles className="w-3.5 h-3.5 inline ml-1 text-[#B8860B]" />
          </p>
          <h2 id="final-cta-heading">Find Your Destined Gemstone</h2>
          <p className="final-cta-description">
            Whether seeking prosperity, mental clarity, or divine planetary protection, take the next step on your Vedic journey with Astro Laabh.
          </p>
        </header>

        {/* Dual Luxury Action Cards */}
        <div className="final-cta-cards">
          {/* Card 1: Explore Collection */}
          <div className="final-cta-card final-cta-card-collection">
            <div className="final-cta-card-icon" aria-hidden="true">
              <Gem className="w-6 h-6 text-[#9C691E]" />
            </div>
            <span className="final-cta-card-tag">SACRED CATALOG</span>
            <h3>Explore the Collection</h3>
            <p>
              Discover certified natural Navaratna gemstones, untreated master-cut jewels, and bespoke sacred gold rings crafted for planetary resonance.
            </p>
            <ul className="final-cta-feature-list">
              <li><Award className="w-4 h-4 text-[#B8860B]" /> 100% Certified Natural & Untreated</li>
              <li><Shield className="w-4 h-4 text-[#B8860B]" /> Consecrated via Vedic Pran Pratishtha</li>
            </ul>
            <button
              type="button"
              className="final-cta-btn final-cta-btn-primary"
              onClick={handleExplore}
            >
              Explore Full Collection <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Consult Astrologer */}
          <div className="final-cta-card final-cta-card-consultation">
            <div className="final-cta-card-icon" aria-hidden="true">
              <Compass className="w-6 h-6 text-[#9C691E]" />
            </div>
            <span className="final-cta-card-tag">ONE-ON-ONE GUIDANCE</span>
            <h3>Consult a Vedic Astrologer</h3>
            <p>
              Unsure which stone aligns with your current planetary dasha? Reserve a private consultation with our master astrologers for kundali analysis.
            </p>
            <ul className="final-cta-feature-list">
              <li><UserCheck className="w-4 h-4 text-[#B8860B]" /> Exact Birth-Chart Planetary Diagnosis</li>
              <li><Sparkles className="w-4 h-4 text-[#B8860B]" /> Precise Wearing Protocol & Muhurat</li>
            </ul>
            <button
              type="button"
              className="final-cta-btn final-cta-btn-secondary"
              onClick={handleConsult}
            >
              Book Astrologer Appointment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="final-cta-trust-bar">
          <div className="final-cta-trust-item">
            <span className="final-cta-trust-emblem">✦</span>
            <span>Government & Independent Lab Certified</span>
          </div>
          <div className="final-cta-trust-item">
            <span className="final-cta-trust-emblem">✦</span>
            <span>Vedic Energization Included</span>
          </div>
          <div className="final-cta-trust-item">
            <span className="final-cta-trust-emblem">✦</span>
            <span>Insured Worldwide Delivery</span>
          </div>
          <div className="final-cta-trust-item">
            <span className="final-cta-trust-emblem">✦</span>
            <span>Lifetime Authenticity Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
