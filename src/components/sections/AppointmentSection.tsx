import { FormEvent, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

const purposes = ['Career', 'Wealth', 'Relationships', 'Health', 'Mental Peace', 'Protection', 'Spiritual Growth', 'General Guidance'];
const gemstones = ['Ruby', 'Emerald', 'Sapphire', 'Pearl', 'Yellow Sapphire', 'Red Coral', 'Hessonite', 'Cat’s Eye', 'Not Sure'];
const times = ['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
const benefits = ['Personalized gemstone guidance', 'Vedic birth-chart recommendation', 'Authentic gemstone selection', 'Wearing and care guidance', 'Consultation with an expert'];

function monthLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function AppointmentSection() {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [gemstone, setGemstone] = useState('');
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

  const dateKey = (date: Date) => date.toLocaleDateString('en-CA');

  if (submitted && selectedDate) {
    return (
      <section id="appointment" className="appointment-section" aria-labelledby="appointment-heading">
        <div className="appointment-confirmation">
          <div className="appointment-confirmation-icon"><Check /></div>
          <p>ASTROLAABH · CONSULTATION</p>
          <h2>Your consultation is booked.</h2>
          <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <strong>{selectedTime}</strong>
          <p>We look forward to guiding you toward the gemstone that aligns with your journey.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="appointment" className="appointment-section" aria-labelledby="appointment-heading">
      <header className="appointment-heading">
        <p>ASTROLAABH CONSULTATIONS</p>
        <h2 id="appointment-heading">Book Your Gemstone Consultation</h2>
        <span>Share your details and preferences so we can guide you toward the right gemstone for your journey.</span>
      </header>

      <div className="appointment-layout">
        <aside className="appointment-introduction">
          <span className="appointment-intro-label">01 · YOUR GUIDANCE</span>
          <h3>Personalized Guidance</h3>
          <p>The consultation helps us understand your intention, birth details, gemstone preferences and requirements with care.</p>
          <ul>{benefits.map((benefit) => <li key={benefit}><Check />{benefit}</li>)}</ul>
        </aside>

        <form className="appointment-form" onSubmit={submit} noValidate>
          <div className="appointment-form-section">
            <h3>Personal Details</h3>
            <div className="appointment-field-grid">
              <label>Full Name<input name="name" autoComplete="name" placeholder="Your full name" /><small>{errors.name}</small></label>
              <label>Email Address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" /><small>{errors.email}</small></label>
              <label>Phone Number<input name="phone" type="tel" autoComplete="tel" placeholder="+1 000 000 0000" /><small>{errors.phone}</small></label>
            </div>
          </div>

          <div className="appointment-form-section">
            <h3>Birth Details</h3>
            <div className="appointment-field-grid">
              <label>Date of Birth<input name="birthDate" type="date" /><small>{errors.birthDate}</small></label>
              <label>Time of Birth<input name="birthTime" type="time" /><small>{errors.birthTime}</small></label>
              <label>Place of Birth<input name="birthPlace" autoComplete="off" placeholder="City, country" /><small>{errors.birthPlace}</small></label>
            </div>
          </div>

          <fieldset className="appointment-form-section appointment-choice-section">
            <legend>What are you seeking guidance for?</legend>
            <div className="appointment-options">{purposes.map((purpose) => <button type="button" className={selectedPurposes.includes(purpose) ? 'selected' : ''} onClick={() => togglePurpose(purpose)} key={purpose}>{purpose}</button>)}</div>
          </fieldset>

          <fieldset className="appointment-form-section appointment-choice-section">
            <legend>Do you already have a gemstone in mind?</legend>
            <div className="appointment-options">{gemstones.map((item) => <button type="button" className={gemstone === item ? 'selected' : ''} onClick={() => setGemstone(item)} key={item}>{item}</button>)}</div>
          </fieldset>

          <div className="appointment-form-section appointment-schedule">
            <h3>Select Your Appointment</h3>
            <div className="appointment-calendar">
              <div className="appointment-calendar-header"><button type="button" aria-label="Previous month" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}><ChevronLeft /></button><strong>{monthLabel(viewMonth)}</strong><button type="button" aria-label="Next month" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}><ChevronRight /></button></div>
              <div className="appointment-weekdays">{['S','M','T','W','T','F','S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
              <div className="appointment-days">
                {days.map((day, index) => day ? (
                  <button type="button" key={dateKey(day)} disabled={day < today} className={selectedDate && dateKey(selectedDate) === dateKey(day) ? 'selected' : ''} onClick={() => { setSelectedDate(day); setSelectedTime(''); }}>{day.getDate()}</button>
                ) : <span key={`empty-${index}`} />)}
              </div>
              <small>{errors.appointmentDate}</small>
            </div>
            <div className="appointment-times"><span>Available Time</span>{times.map((time) => <button type="button" key={time} className={selectedTime === time ? 'selected' : ''} disabled={!selectedDate} onClick={() => setSelectedTime(time)}>{time}</button>)}<small>{errors.appointmentTime}</small></div>
          </div>

          <label className="appointment-notes">Anything else you'd like us to know?<textarea rows={4} placeholder="Tell us about your goals, concerns, or gemstone preferences..." /></label>
          <button className="appointment-submit" type="submit">Book My Consultation</button>
        </form>
      </div>
    </section>
  );
}
