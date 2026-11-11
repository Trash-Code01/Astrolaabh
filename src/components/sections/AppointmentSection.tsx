import { FormEvent, useMemo, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Phone, Video, MessageSquare, Sparkles, Clock, Calendar, ShieldCheck, Compass } from 'lucide-react';

const purposes = ['Career & Business', 'Wealth & Prosperity', 'Marriage & Relationships', 'Health & Vitality', 'Mental Peace & Focus', 'Planetary Dasha Remedies', 'Spiritual Awakening', 'General Kundali Review'];
const gemstones = ['Burmese Ruby (Sun)', 'Zambian Emerald (Mercury)', 'Kashmir Sapphire (Saturn)', 'Basra Pearl (Moon)', 'Ceylon Yellow Sapphire (Jupiter)', 'Red Coral (Mars)', 'Hessonite (Rahu)', 'Cat’s Eye (Ketu)', 'Undecided · Need Astrologer Advice'];
const times = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'];

const callTypes = [
  { id: 'phone', label: 'Phone Call', icon: Phone, desc: 'Direct 1-on-1 private audio guidance' },
  { id: 'video', label: 'Video Call', icon: Video, desc: 'Live screen sharing of your Vedic Kundali' },
  { id: 'whatsapp', label: 'WhatsApp Call', icon: MessageSquare, desc: 'Seamless global audio/video session' },
];

const callDurations = [
  { id: '15', label: '15 Mins', title: 'Gemstone Alignment', badge: 'Popular' },
  { id: '30', label: '30 Mins', title: 'Comprehensive Kundali', badge: 'In-Depth' },
  { id: '45', label: '45 Mins', title: 'Family & Life Dasha', badge: 'Complete' },
];

function monthLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function AppointmentSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Scroll-linked interactive transforms
  const rotateWheel = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const bannerScale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.96, 1, 1, 0.98]);
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.15], [0.6, 1]);

  const [callType, setCallType] = useState('video');
  const [duration, setDuration] = useState('30');

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(['Career & Business']);
  const [gemstone, setGemstone] = useState('Undecided · Need Astrologer Advice');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const days = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const first = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    return [...Array.from({ length: first }, () => null), ...Array.from({ length: count }, (_, i) => new Date(year, month, i + 1))];
  }, [viewMonth]);

  const togglePurpose = (purpose: string) => setSelectedPurposes((current) => current.includes(purpose) ? current.filter((item) => item !== purpose) : [...current, purpose]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    if (!String(form.get('name') || '').trim()) nextErrors.name = 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(String(form.get('email') || ''))) nextErrors.email = 'Please enter a valid email address.';
    if (!String(form.get('phone') || '').trim()) nextErrors.phone = 'Please enter your phone number.';
    if (!form.get('birthDate')) nextErrors.birthDate = 'Please select your date of birth.';
    if (!form.get('birthTime')) nextErrors.birthTime = 'Please select your time of birth.';
    if (!String(form.get('birthPlace') || '').trim()) nextErrors.birthPlace = 'Please enter your place of birth.';
    if (!selectedDate) nextErrors.appointmentDate = 'Please select an appointment date.';
    if (!selectedTime) nextErrors.appointmentTime = 'Please select an available time.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
  };

  const scrollToBookingForm = () => {
    const formEl = document.getElementById('consultation-booking-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (submitted && selectedDate) {
    return (
      <section id="appointment" className="appointment-section" aria-labelledby="appointment-heading">
        <div className="appointment-confirmation">
          <div className="appointment-confirmation-icon"><Check /></div>
          <p>ASTROLAABH · SACRED CONSULTATION</p>
          <h2>Your Astrologer Call is Confirmed</h2>
          <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <strong>{selectedTime} · {callTypes.find(c => c.id === callType)?.label} ({duration} Mins)</strong>
          <p>Our senior Vedic astrologer will connect with you at the scheduled auspicious time with your birth chart prepared.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} id="appointment" className="appointment-section" aria-labelledby="appointment-heading">
      {/* 1. SCROLL-BASED INTERACTIVE HERO BANNER: BOOK ASTROLOGER CALL */}
      <motion.div 
        className="astrologer-call-banner"
        style={{ scale: bannerScale, opacity: bannerOpacity }}
      >
        <div className="call-banner-celestial-bg" aria-hidden="true">
          <motion.div 
            className="celestial-zodiac-ring"
            style={{ rotate: rotateWheel }}
          />
          <div className="celestial-glow-spot" />
        </div>

        <div className="call-banner-content">
          <div className="call-banner-badge-strip">
            <span className="live-astrologer-pill">
              <span className="live-pulse-dot" />
              Master Vedic Astrologers Available
            </span>
            <span className="confidential-pill">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[#9C691E]" />
              100% Private & Vedic Grounded
            </span>
          </div>

          <h2 id="appointment-heading" className="call-banner-title">
            Book a 1-on-1 Call with a Master Astrologer
          </h2>

          <p className="call-banner-subtitle">
            Uncover the celestial geometry of your birth chart. Get personalized planetary prescriptions, unhurried guidance, and exact gemstone specifications before you invest.
          </p>

          {/* Interactive Call Selector Bar */}
          <div className="call-interactive-bar">
            {/* Call Type Toggle */}
            <div className="call-type-group">
              <span className="call-group-label">Select Call Mode:</span>
              <div className="call-type-chips">
                {callTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = callType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      className={`call-type-chip ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setCallType(type.id)}
                    >
                      <Icon className="w-4 h-4 mr-2 inline" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Selector */}
            <div className="call-duration-group">
              <span className="call-group-label">Select Session Length:</span>
              <div className="call-duration-chips">
                {callDurations.map((dur) => {
                  const isSelected = duration === dur.id;
                  return (
                    <button
                      key={dur.id}
                      type="button"
                      className={`call-dur-chip ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setDuration(dur.id)}
                    >
                      <span className="dur-badge">{dur.badge}</span>
                      <strong>{dur.label}</strong>
                      <span className="dur-title">{dur.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Trigger */}
            <div className="call-banner-action-wrap">
              <button
                type="button"
                className="call-schedule-btn"
                onClick={scrollToBookingForm}
              >
                <Calendar className="w-4 h-4 mr-2 inline" />
                Select Date & Enter Birth Details
              </button>
              <p className="call-action-note">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-[#9C691E]" />
                Next available consultation slot: <strong>Tomorrow, 11:30 AM</strong>
              </p>
            </div>
          </div>

          {/* 3 Interactive Highlight Pillars */}
          <div className="call-highlight-grid">
            <div className="call-highlight-card">
              <div className="call-highlight-icon"><Compass className="w-5 h-5 text-[#9C691E]" /></div>
              <h4>Kundali & Lagna Analysis</h4>
              <p>Thorough examination of your 12 planetary houses and ongoing Mahadasha period.</p>
            </div>

            <div className="call-highlight-card">
              <div className="call-highlight-icon"><Sparkles className="w-5 h-5 text-[#9C691E]" /></div>
              <h4>Precise Gemstone Prescription</h4>
              <p>Exact carat weight, planetary metal (gold/silver), and auspicious wearing finger.</p>
            </div>

            <div className="call-highlight-card">
              <div className="call-highlight-icon"><ShieldCheck className="w-5 h-5 text-[#9C691E]" /></div>
              <h4>Muhurat & Consecration Protocol</h4>
              <p>Auspicious astrological day, hora, and Vedic mantra chants for initial activation.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. THE CONSULTATION BOOKING FORM */}
      <div id="consultation-booking-form" className="appointment-layout">
        <aside className="appointment-introduction">
          <span className="appointment-intro-label">STEP 02 · COMPLETE YOUR DETAILS</span>
          <h3>Personalized Vedic Consultation</h3>
          <p>Provide your accurate birth coordinates so our astrologer can cast and analyze your Kundali prior to the call.</p>
          
          <div className="appointment-call-summary">
            <div className="summary-item">
              <span>Selected Mode:</span>
              <strong>{callTypes.find(c => c.id === callType)?.label}</strong>
            </div>
            <div className="summary-item">
              <span>Session Length:</span>
              <strong>{duration} Minutes</strong>
            </div>
            <div className="summary-item">
              <span>Consultation Fee:</span>
              <strong className="summary-price">Complimentary with Gemstone</strong>
            </div>
          </div>

          <ul className="appointment-benefit-list">
            <li><Check className="w-4 h-4 text-[#9C691E] inline mr-2" /> Personalized 1-on-1 astrologer consultation</li>
            <li><Check className="w-4 h-4 text-[#9C691E] inline mr-2" /> Certified natural unheated gemstone recommendation</li>
            <li><Check className="w-4 h-4 text-[#9C691E] inline mr-2" /> Auspicious Muhurat and energization protocol</li>
            <li><Check className="w-4 h-4 text-[#9C691E] inline mr-2" /> Comprehensive post-call written report</li>
          </ul>
        </aside>

        <form className="appointment-form" onSubmit={submit} noValidate>
          <fieldset className="appointment-form-section">
            <h3>Personal Information</h3>
            <div className="appointment-field-grid">
              <label>
                Full Name *
                <input name="name" type="text" placeholder="Your full name" required />
                {errors.name && <small>{errors.name}</small>}
              </label>

              <label>
                Email Address *
                <input name="email" type="email" placeholder="you@example.com" required />
                {errors.email && <small>{errors.email}</small>}
              </label>

              <label>
                WhatsApp / Phone Number *
                <input name="phone" type="tel" placeholder="+91 98765 43210" required />
                {errors.phone && <small>{errors.phone}</small>}
              </label>
            </div>
          </fieldset>

          <fieldset className="appointment-form-section">
            <h3>Birth Coordinates (For Chart Casting)</h3>
            <div className="appointment-field-grid">
              <label>
                Date of Birth *
                <input name="birthDate" type="date" required />
                {errors.birthDate && <small>{errors.birthDate}</small>}
              </label>

              <label>
                Exact Time of Birth *
                <input name="birthTime" type="time" required />
                {errors.birthTime && <small>{errors.birthTime}</small>}
              </label>

              <label>
                Place of Birth (City, State, Country) *
                <input name="birthPlace" type="text" placeholder="e.g. Mumbai, Maharashtra, India" required />
                {errors.birthPlace && <small>{errors.birthPlace}</small>}
              </label>
            </div>
          </fieldset>

          <fieldset className="appointment-choice-section">
            <legend>What area of life would you like guidance on?</legend>
            <div className="appointment-options">
              {purposes.map((purpose) => (
                <button
                  type="button"
                  key={purpose}
                  className={selectedPurposes.includes(purpose) ? 'selected' : ''}
                  onClick={() => togglePurpose(purpose)}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="appointment-choice-section">
            <legend>Specific Gemstone in Mind (Optional)</legend>
            <div className="appointment-options">
              {gemstones.map((gem) => (
                <button
                  type="button"
                  key={gem}
                  className={gemstone === gem ? 'selected' : ''}
                  onClick={() => setGemstone(gem)}
                >
                  {gem}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="appointment-schedule">
            <h3>Select Date & Auspicious Time</h3>
            <div className="appointment-calendar">
              <div className="appointment-calendar-header">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                >
                  <ChevronLeft />
                </button>
                <strong>{monthLabel(viewMonth)}</strong>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                >
                  <ChevronRight />
                </button>
              </div>

              <div className="appointment-weekdays">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d}>{d}</span>)}
              </div>

              <div className="appointment-days">
                {days.map((date, index) => {
                  if (!date) return <span key={`empty-${index}`} />;
                  const isPast = date < today;
                  const isSelected = selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      disabled={isPast}
                      className={isSelected ? 'selected' : ''}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
              {errors.appointmentDate && <small>{errors.appointmentDate}</small>}
            </div>

            <div className="appointment-times">
              <span>Available Auspicious Hours</span>
              {times.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={selectedTime === time ? 'selected' : ''}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
              {errors.appointmentTime && <small>{errors.appointmentTime}</small>}
            </div>
          </div>

          <label className="appointment-notes">
            Special Notes or Questions for the Astrologer (Optional)
            <textarea name="notes" placeholder="Share any specific life situation or questions you want addressed during your call..." />
          </label>

          <button type="submit" className="appointment-submit">
            Confirm & Reserve Astrologer Call
          </button>
        </form>
      </div>
    </section>
  );
}

export default AppointmentSection;
