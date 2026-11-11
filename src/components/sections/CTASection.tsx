import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Check, X, Phone, Video, Calendar, Clock } from 'lucide-react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { scrollToTarget } from '../../lib/lenis';

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chakraRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callMode, setCallMode] = useState<'video' | 'phone'>('video');
  const [sessionLen, setSessionLen] = useState<'15' | '30' | '45'>('30');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const chakra = chakraRef.current;
    const header = headerRef.current;
    const actions = actionsRef.current;

    if (!section || !chakra) return;

    const ctx = gsap.context(() => {
      // 1. Subtle parallax scale on enter
      gsap.fromTo(
        chakra,
        { scale: 0.9, y: 30, opacity: 0.9 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        }
      );

      // 2. Extra scroll rotation scrub
      gsap.to(chakra, {
        rotate: 90,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // 3. Header reveal
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
            },
          }
        );
      }

      // 4. Actions reveal
      if (actions) {
        gsap.fromTo(
          actions,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleBookClick = () => {
    window.location.hash = 'consultation';
  };

  const handleExploreClick = () => {
    scrollToTarget('gemstone-showcase');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
    }, 2200);
  };

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      className="relative w-full overflow-hidden bg-[#FAF7F2] text-[#2C1F14] py-14 md:py-20 flex flex-col items-center justify-center min-h-[85vh]"
      aria-labelledby="final-cta-heading"
    >
      {/* Soft Ambient Radial Warmth */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.03) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* Decorative Hairline Orbit Rings */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none" aria-hidden="true">
        <div className="w-[520px] h-[520px] rounded-full border border-[#D4AF37]/20 border-dashed animate-spin-slow" />
        <div className="w-[720px] h-[720px] rounded-full border border-[#D4AF37]/15 absolute" />
        <div className="w-[920px] h-[920px] rounded-full border border-[#9C691E]/10 absolute border-dotted" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6 md:gap-7">
        {/* Top Header */}
        <header ref={headerRef} className="max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] uppercase text-[#9C691E] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Your Celestial Alignment Awaits</span>
            <Sparkles className="w-3.5 h-3.5" />
          </p>

          <h2
            id="final-cta-heading"
            className="text-4xl sm:text-5xl md:text-5xl font-normal leading-[1.1] text-[#2C1F14] tracking-tight font-serif"
          >
            Find Your Destined Gemstone
          </h2>

          <p className="mt-3 text-sm md:text-base text-[#6E5A44] leading-relaxed font-serif max-w-xl mx-auto">
            Every soul vibrates with a distinct planetary frequency. Speak with our master Vedic astrologers for exact Kundali analysis, or explore our sacred energized collections.
          </p>
        </header>

        {/* Centerpiece 3D Astro Chakra */}
        <div className="relative my-1">
          {/* Subtle 3D perspective container */}
          <div
            className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-76 md:h-76 grid place-items-center"
            style={{ perspective: '1000px' }}
          >
            {/* The 3D Chakra Wheel */}
            <div
              ref={chakraRef}
              className="w-full h-full rounded-full transition-transform duration-700 ease-out"
              style={{
                filter: 'drop-shadow(0 20px 45px rgba(156,105,30,0.28)) drop-shadow(0 4px 12px rgba(44,31,20,0.12))',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/astro-chakra-3d-gold.png"
                alt="Sacred Vedic 3D Chakra"
                className="w-full h-full object-contain select-none pointer-events-none animate-spin-slow"
                loading="lazy"
              />
            </div>

            {/* Glowing Golden Core */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#FFFDF9] to-[#F5ECE0] border border-[#D4AF37] shadow-[0_4px_16px_rgba(156,105,30,0.25)] grid place-items-center pointer-events-none z-10"
              aria-hidden="true"
            >
              <span className="text-[#9C691E] text-xl font-serif">✦</span>
            </div>
          </div>
        </div>

        {/* CTA Actions Group */}
        <div ref={actionsRef} className="w-full flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Primary Astrologer Call Button */}
            <button
              type="button"
              onClick={handleBookClick}
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#2C1F14] text-[#FAF7F2] text-xs md:text-sm font-semibold tracking-[0.14em] uppercase font-serif border border-[#9C691E] shadow-[0_8px_24px_rgba(44,31,20,0.18)] hover:bg-[#9C691E] hover:text-white hover:border-[#D4AF37] hover:shadow-[0_12px_32px_rgba(156,105,30,0.3)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Schedule Astrologer Call</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Secondary Explore Collection Button */}
            <button
              type="button"
              onClick={handleExploreClick}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FAF7F2] text-[#382A1D] text-xs md:text-sm font-semibold tracking-[0.12em] uppercase font-serif border border-[#DFCBB4] hover:bg-[#F0E8DC] hover:border-[#9C691E] hover:text-[#2C1F14] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <Compass className="w-4 h-4 text-[#9C691E]" />
              <span>Explore Collection</span>
            </button>
          </div>

          {/* Subtext */}
          <p className="text-xs text-[#8A7663] font-serif tracking-wide">
            ✦ Complimentary 15-minute consultation included with every sacred gemstone acquisition
          </p>

          {/* Luxury Trust Strip */}
          <div className="w-full max-w-2xl pt-4 border-t border-[#9C691E]/20 flex flex-wrap items-center justify-center gap-5 md:gap-8 text-xs text-[#6E5A44] font-serif">
            <div className="flex items-center gap-2">
              <span className="text-[#9C691E]">✦</span>
              <span>100% Certified Natural & Untreated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9C691E]">✦</span>
              <span>Vedic Pran Pratishtha Consecration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9C691E]">✦</span>
              <span>Exact Kundali & Lagna Diagnosis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9C691E]">✦</span>
              <span>Lifetime Authenticity Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Quick Astrologer Booking Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF7F2] text-[#2C1F14] rounded-2xl border border-[#DFD5C2] shadow-2xl p-6 md:p-8"
            style={{
              background: 'radial-gradient(circle at 50% 10%, #FFFDF9 0%, #FAF7F2 80%)',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6E5A44] hover:bg-[#F0E8DC] hover:text-[#2C1F14] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#EBF7EE] text-[#2E7D32] grid place-items-center mb-2">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif text-[#2C1F14]">Consultation Requested</h3>
                <p className="text-sm text-[#6E5A44] max-w-xs font-serif">
                  Our Vedic coordinator will connect with you via WhatsApp within 2 hours to confirm your auspicious slot.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9C691E] mb-1">
                    ✦ Vedic Guidance & Astrological Prescription
                  </p>
                  <h3 id="modal-title" className="text-2xl font-serif font-normal text-[#2C1F14]">
                    Book a 1-on-1 Astrologer Call
                  </h3>
                  <p className="text-xs text-[#6E5A44] font-serif mt-1">
                    Private Kundali diagnosis and gemstone prescription with our senior Vedic masters.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Call Mode Switcher */}
                  <div className="flex gap-2 p-1 bg-[#F0E8DC] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCallMode('video')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-serif font-semibold transition-all ${
                        callMode === 'video'
                          ? 'bg-[#2C1F14] text-white shadow-sm'
                          : 'text-[#6E5A44] hover:text-[#2C1F14]'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCallMode('phone')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-serif font-semibold transition-all ${
                        callMode === 'phone'
                          ? 'bg-[#2C1F14] text-white shadow-sm'
                          : 'text-[#6E5A44] hover:text-[#2C1F14]'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone / WhatsApp</span>
                    </button>
                  </div>

                  {/* Session Duration */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '15', label: '15 Mins', tag: 'Gemstone' },
                      { id: '30', label: '30 Mins', tag: 'Kundali' },
                      { id: '45', label: '45 Mins', tag: 'Full Life' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSessionLen(item.id as any)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          sessionLen === item.id
                            ? 'border-[#9C691E] bg-[#FFFDF9] shadow-sm'
                            : 'border-[#E2D8C7] bg-[#FAF7F2]/60 hover:border-[#9C691E]/60'
                        }`}
                      >
                        <div className="text-xs font-serif font-bold text-[#2C1F14]">{item.label}</div>
                        <div className="text-[10px] text-[#8A7663]">{item.tag}</div>
                      </button>
                    ))}
                  </div>

                  {/* Name and Phone */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E2D8C7] bg-[#FFFDF9] text-xs font-serif text-[#2C1F14] placeholder:text-[#9F8F7E] focus:outline-none focus:border-[#9C691E]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp Number (+91 ...)"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#E2D8C7] bg-[#FFFDF9] text-xs font-serif text-[#2C1F14] placeholder:text-[#9F8F7E] focus:outline-none focus:border-[#9C691E]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Date of Birth (Optional)"
                        className="px-4 py-2 rounded-lg border border-[#E2D8C7] bg-[#FFFDF9] text-xs font-serif text-[#2C1F14] placeholder:text-[#9F8F7E] focus:outline-none focus:border-[#9C691E]"
                      />
                      <input
                        type="text"
                        placeholder="Time of Birth (Optional)"
                        className="px-4 py-2 rounded-lg border border-[#E2D8C7] bg-[#FFFDF9] text-xs font-serif text-[#2C1F14] placeholder:text-[#9F8F7E] focus:outline-none focus:border-[#9C691E]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-full bg-[#2C1F14] text-[#FAF7F2] text-xs font-semibold uppercase tracking-[0.12em] font-serif border border-[#9C691E] shadow-md hover:bg-[#9C691E] hover:text-white transition-all cursor-pointer"
                  >
                    Confirm Consultation Request →
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10.5px] text-[#8A7663] pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#9C691E]" />
                    <span>100% Confidential • Verified Astrologers</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CTASection;
