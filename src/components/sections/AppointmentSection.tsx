import { useEffect, useRef, useState, type FormEvent } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { Sparkles, ArrowRight, ShieldCheck, Phone, Video, Calendar, Clock, Check, X, Compass } from 'lucide-react';

export function AppointmentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callMode, setCallMode] = useState<'video' | 'phone'>('video');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    const title = titleRef.current;
    const btn = btnRef.current;

    if (!section || !card) return;

    const ctx = gsap.context(() => {
      // 1. Scroll-driven Parallax and Card Expansion
      gsap.fromTo(
        card,
        {
          y: 60,
          scale: 0.94,
          opacity: 0.85,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'center center',
            scrub: 1,
          },
        }
      );

      // 2. Celestial Astrological Dial Continuous Scrub Rotation
      if (ring) {
        gsap.fromTo(
          ring,
          { rotate: -30 },
          {
            rotate: 90,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        );
      }

      // 3. Ambient Golden Light Pulse
      if (glow) {
        gsap.to(glow, {
          scale: 1.25,
          opacity: 0.75,
          repeat: -1,
          yoyo: true,
          duration: 4,
          ease: 'sine.inOut',
        });
      }

      // 4. Subtle Button Magnetic/Hover Shimmer
      if (btn) {
        gsap.to(btn, {
          boxShadow: '0 8px 32px rgba(184, 134, 11, 0.35)',
          repeat: -1,
          yoyo: true,
          duration: 2.2,
          ease: 'sine.inOut',
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitted(false);
    }, 3200);
  };

  return (
    <section
      ref={sectionRef}
      id="appointment"
      className="astrologer-banner-section"
      aria-labelledby="astrologer-banner-heading"
    >
      <div className="astrologer-banner-wrapper">
        <div ref={cardRef} className="astrologer-banner-card">
          {/* Ambient Glow */}
          <div ref={glowRef} className="astrologer-banner-glow" aria-hidden="true" />

          {/* GSAP Scroll-Rotated Celestial Astrological Dial */}
          <div className="astrologer-celestial-canvas" aria-hidden="true">
            <svg
              ref={ringRef}
              viewBox="0 0 500 500"
              className="astrologer-celestial-svg"
            >
              <circle cx="250" cy="250" r="230" fill="none" stroke="#C5A880" strokeWidth="1" strokeDasharray="4 6" opacity="0.35" />
              <circle cx="250" cy="250" r="195" fill="none" stroke="#9C691E" strokeWidth="1.2" opacity="0.45" />
              <circle cx="250" cy="250" r="150" fill="none" stroke="#C5A880" strokeWidth="1" strokeDasharray="8 8" opacity="0.4" />
              <circle cx="250" cy="250" r="100" fill="none" stroke="#9C691E" strokeWidth="0.8" opacity="0.5" />
              
              {/* 12 Celestial Zodiac Markers */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 250 + 195 * Math.cos(angle);
                const y1 = 250 + 195 * Math.sin(angle);
                const x2 = 250 + 230 * Math.cos(angle);
                const y2 = 250 + 230 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#9C691E"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                );
              })}
              
              {/* Diamond Center Emblem */}
              <polygon points="250,225 275,250 250,275 225,250" fill="none" stroke="#9C691E" strokeWidth="1.5" opacity="0.6" />
            </svg>
          </div>

          {/* Banner Main Editorial Content */}
          <div className="astrologer-banner-inner">
            <div className="astrologer-banner-eyebrow-wrap">
              <span className="astrologer-banner-badge">
                <Sparkles className="w-3.5 h-3.5 text-[#9C691E]" />
                VEDIC GUIDANCE & CONSULTATION
              </span>
              <span className="astrologer-live-indicator">
                <span className="live-status-dot" />
                Senior Astrologers Available Today
              </span>
            </div>

            <h2 ref={titleRef} id="astrologer-banner-heading" className="astrologer-banner-title">
              Unsure which gemstone is destined for you? <br />
              <span>Speak with our <em>Master Astrologer</em>.</span>
            </h2>

            <p className="astrologer-banner-desc">
              Every celestial jewel carries a distinct planetary resonance. Reserve a private 1-on-1 consultation to analyze your Kundali, current Mahadasha, and receive an authentic prescription before you acquire.
            </p>

            {/* 3 Value Pillars */}
            <div className="astrologer-pillars-strip">
              <div className="astrologer-pillar-item">
                <Compass className="w-4 h-4 text-[#9C691E]" />
                <span>Exact Kundali & Lagna Diagnosis</span>
              </div>
              <div className="astrologer-pillar-item">
                <Sparkles className="w-4 h-4 text-[#9C691E]" />
                <span>Precise Carat, Auspicious Metal & Finger</span>
              </div>
              <div className="astrologer-pillar-item">
                <ShieldCheck className="w-4 h-4 text-[#9C691E]" />
                <span>100% Confidential · Video or Phone</span>
              </div>
            </div>

            {/* Action Area */}
            <div className="astrologer-banner-actions">
              <button
                ref={btnRef}
                type="button"
                className="astrologer-book-btn"
                onClick={() => setIsModalOpen(true)}
              >
                <span>Schedule a 1-on-1 Astrologer Call</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <span className="astrologer-reassurance-note">
                <Check className="w-4 h-4 text-[#27AE60]" />
                Complimentary consultation with every sacred gemstone acquisition
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Quick-Booking Modal */}
      {isModalOpen && (
        <div className="astrologer-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="astrologer-modal-window"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-consultation-title"
          >
            <button
              type="button"
              className="astrologer-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close consultation modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="astrologer-modal-success">
                <div className="success-icon-wrap">
                  <Check className="w-8 h-8 text-[#9C691E]" />
                </div>
                <h3>Your Call is Reserved</h3>
                <p>
                  Our senior Vedic astrologer has received your appointment request. You will receive a WhatsApp and email confirmation with meeting coordinates shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="astrologer-modal-form">
                <div className="modal-form-header">
                  <span className="modal-eyebrow">1-ON-1 VEDIC CONSULTATION</span>
                  <h3 id="modal-consultation-title">Book Your Astrologer Call</h3>
                  <p>Share your details so our astrologer can prepare your Janam Kundali prior to the call.</p>
                </div>

                {/* Call Mode Selector */}
                <div className="modal-mode-toggle">
                  <button
                    type="button"
                    className={`mode-btn ${callMode === 'video' ? 'is-active' : ''}`}
                    onClick={() => setCallMode('video')}
                  >
                    <Video className="w-4 h-4 mr-2" /> Video Call (Screen Share)
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${callMode === 'phone' ? 'is-active' : ''}`}
                    onClick={() => setCallMode('phone')}
                  >
                    <Phone className="w-4 h-4 mr-2" /> Phone Call
                  </button>
                </div>

                <div className="modal-field-group">
                  <label>
                    Your Full Name *
                    <input type="text" placeholder="e.g. Aditi Sharma" required />
                  </label>

                  <label>
                    Phone / WhatsApp Number *
                    <input type="tel" placeholder="+91 98765 43210" required />
                  </label>

                  <div className="modal-field-row">
                    <label>
                      Date of Birth *
                      <input type="date" required />
                    </label>

                    <label>
                      Exact Time of Birth *
                      <input type="time" required />
                    </label>
                  </div>

                  <label>
                    Place of Birth (City, State) *
                    <input type="text" placeholder="e.g. New Delhi, India" required />
                  </label>
                </div>

                <div className="modal-schedule-hint">
                  <Clock className="w-4 h-4 text-[#9C691E]" />
                  <span>Next available slot: <strong>Tomorrow, 11:30 AM (Vedic Muhurat)</strong></span>
                </div>

                <button type="submit" className="modal-submit-btn">
                  Confirm & Reserve Astrologer Call
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default AppointmentSection;
