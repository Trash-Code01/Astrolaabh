import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Compass, Gem, Heart, MessageCircle, ShieldCheck, Sparkles, Sun, X } from 'lucide-react';
import { gemstones } from '../../lib/gemstones';
import './find-gem.css';


const intentions = [
  { name: 'Career & purpose', sub: 'A clearer path forward', icon: Compass, color: '#d8a642' },
  { name: 'Love & connection', sub: 'Space for deeper harmony', icon: Heart, color: '#d795aa' },
  { name: 'Clarity & growth', sub: 'Return to your inner compass', icon: Sun, color: '#5fa991' },
  { name: 'Just exploring', sub: 'Let curiosity lead the way', icon: Gem, color: '#8e99cf' },
];
const forms = ['A ring', 'A pendant', 'A loose gemstone', 'Help me decide'];
const stages = ['Your intention', 'Birth details', 'Your preferences', 'Your discovery'];
const illustrativeGems: Record<string, string> = { 'Career & purpose': 'yellow-sapphire', 'Love & connection': 'ruby', 'Clarity & growth': 'emerald', 'Just exploring': 'blue-sapphire' };
const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

function WearIcon({ index }: { index: number }) {
  const props = { size: 30, strokeWidth: 1.5, 'aria-hidden': true as const };
  if (index === 2) return <Gem {...props} />;
  if (index === 3) return <Compass {...props} />;
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {index === 0 ? <>
        <path d="M10.5 12a9 9 0 1 0 11 0" />
        <path d="M11.5 15a6 6 0 1 0 9 0" />
        <path d="m9 7 3.5-4h7L23 7l-7 7Z M9 7h14 M12.5 3 16 14 19.5 3" />
      </> : <>
        <path d="M5 3c0 8 3.5 12 9 14 M27 3c0 8-3.5 12-9 14" />
        <ellipse cx="16" cy="17" rx="2" ry="3" />
        <path d="m16 20 5 5-5 5-5-5Z M16 23v4" />
      </>}
    </svg>
  );
}

export default function FindGemPage() {
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState('');
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [unknown, setUnknown] = useState(false);
  const [wear, setWear] = useState('');
  const [budget, setBudget] = useState('No preference');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [example, setExample] = useState(false);
  const [consult, setConsult] = useState(window.location.hash === '#consultation');
  const heading = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const displayGem = gemstones.find(g => g.id === (illustrativeGems[intent] || 'yellow-sapphire'))!;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  useEffect(() => { document.title = 'Find My Gem · A personal Vedic journey | AstroLaabh'; return () => { document.title = 'AstroLaabh | Vedic Gemstones'; }; }, []);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [step]);
  useEffect(() => { if (consult) dialog.current?.showModal(); else dialog.current?.close(); }, [consult]);
  useEffect(() => {
    const open = () => setConsult(true);
    window.addEventListener('open-gem-consultation', open);
    const onHash = () => { if (window.location.hash === '#consultation') open(); };
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('open-gem-consultation', open); window.removeEventListener('hashchange', onHash); };
  }, []);

  function next(e: FormEvent) {
    e.preventDefault();
    if (step === 0 && !intent) { setError('Choose the intention that feels closest to you.'); return; }
    if (step === 1 && (!dob || dob > today || !place.trim() || (!unknown && !time))) { setError('Add a valid birth date, birthplace, and birth time — or select “I don’t know”.'); return; }
    if (step === 2 && !wear) { setError('Choose a form, or select “Help me decide”.'); return; }
    setError(''); setStep(Math.min(step + 1, 3));
  }

  const summary = `Hello AstroLaabh,\nI'd like to speak with an astrologer about choosing a gemstone.\n\nName: ${name || 'Not provided'}\nIntention: ${intent || 'To discuss'}\nBirth date: ${dob || 'To discuss'}\nBirth time: ${unknown ? 'Unknown' : time || 'To discuss'}\nBirthplace: ${place || 'To discuss'}\nPreferred form: ${wear || 'To discuss'}\nBudget: ${budget}\n\nPlease let me know your consultation availability and fees.`;

  return <div className="fg-page">
    <header className="fg-header">
      <a href="/" aria-label="AstroLaabh home"><img src="/astrolaabh-logo.png" alt="AstroLaabh" /></a>
      <nav aria-label="Discovery navigation"><a href="/#gemstone-collection">The collection</a><span>Find my gem</span></nav>
      <button className="fg-header-talk" onClick={() => setConsult(true)}><MessageCircle size={15} /><span>Talk to an astrologer</span><ArrowRight size={14} /></button>
    </header>

    <main>
      <div className="fg-breadcrumb"><a href="/">Home</a><ChevronRight size={11} /><span>Your gemstone journey</span><span className="fg-breadcrumb-right">ROOTED IN JYOTISH · GUIDED BY YOU</span></div>
      <div className="fg-intro"><span className="fg-eyebrow">✦ THE STONE IS PERSONAL. SO IS THE JOURNEY.</span><h1>A little about you.<br className="fg-mobile-break" /> <em>A gem with meaning.</em></h1><p>You don’t need to know your gemstone yet. Let’s begin with your story.</p></div>

      <section className="fg-discovery" aria-label="Gemstone discovery">
        <aside className="fg-story">
          <div className="fg-story-top"><span>THE ART OF ALIGNMENT</span><span>ज्योतिष</span></div>
          <div className="fg-orbit">
            <svg className="fg-zodiac" viewBox="0 0 500 500" aria-hidden="true">
              <circle cx="250" cy="250" r="236" /><circle cx="250" cy="250" r="227" strokeDasharray="1 7" /><circle cx="250" cy="250" r="213" /><circle cx="250" cy="250" r="172" /><circle cx="250" cy="250" r="163" strokeDasharray="2 6" />
              {signs.map((sign, i) => { const a = i * Math.PI / 6; return <g key={sign}><line x1={250 + 173 * Math.cos(a)} y1={250 + 173 * Math.sin(a)} x2={250 + 212 * Math.cos(a)} y2={250 + 212 * Math.sin(a)} /><text x={250 + 193 * Math.cos(a + Math.PI / 12)} y={257 + 193 * Math.sin(a + Math.PI / 12)}>{sign + '\uFE0E'}</text></g>; })}
              <path d="M250 112 370 320H130Z M250 388 130 180H370Z" opacity=".35" />
            </svg>
            <div className="fg-crystal" onPointerMove={e => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--gem-x', `${(e.clientX - rect.left - rect.width / 2) * .08}px`); e.currentTarget.style.setProperty('--gem-y', `${(e.clientY - rect.top - rect.height / 2) * .08}px`); }} onPointerLeave={e => { e.currentTarget.style.setProperty('--gem-x', '0px'); e.currentTarget.style.setProperty('--gem-y', '0px'); }}><img key={displayGem.id} className="fg-gem-image" src={displayGem.image} alt={`${displayGem.name} — gemstone illustration`} draggable={false} /></div>
            <span className="fg-orbit-star fg-star-one">✦</span><span className="fg-orbit-star fg-star-two">✧</span>
          </div>
          <span className="fg-drag-hint">✧ A LITTLE LIGHT. A LITTLE WONDER.</span>
          <div className="fg-story-copy"><span className="fg-eyebrow">AS ABOVE, SO WITHIN</span><h2>Some things are<br /><em>meant for you.</em></h2><p>In Vedic tradition, a gemstone’s meaning begins with the person who wears it. Your story comes first.</p></div>
          <div className="fg-story-bottom"><span>✧ Thoughtful guidance</span><span>✧ No pressure to purchase</span></div>
        </aside>

        <div className="fg-form-side">
          <div className="fg-form-top"><span>YOUR PERSONAL DISCOVERY</span><span>0{step + 1} <i>/ 04</i></span></div>
          <div className="fg-progress" aria-label={`Step ${step + 1} of 4: ${stages[step]}`}>{stages.map((label, i) => <button key={label} disabled={i > step} onClick={() => { setStep(i); setError(''); }} aria-label={label} aria-current={step === i ? 'step' : undefined} className={i <= step ? 'is-active' : ''}><span /></button>)}</div>
          <form onSubmit={next} className="fg-form">
            <div className="fg-step" key={step}>
              <span className="fg-eyebrow">{['01 — YOUR INTENTION', '02 — YOUR BIRTH STORY', '03 — MAKE IT YOURS', '04 — YOUR NEXT CHAPTER'][step]}</span>
              <h2 ref={heading} tabIndex={-1}>{['What brings you\nhere today?', 'Your story begins\nwith the stars.', 'How will you\nwear your story?', name ? `${name}, your journey\nhas begun.` : 'A thoughtful beginning.\nA personal next step.'][step]}</h2>
              <p className="fg-step-description">{['There is no right answer. Just choose what feels most like you.', 'These details prepare your profile for an astrologer’s Kundli review.', 'Choose what feels natural. Your setting and budget don’t determine your astrological match.', 'Your profile is ready. A personal chart interpretation comes before a gemstone recommendation.'][step]}</p>
              {step === 0 && <><div className="fg-choices" role="group" aria-label="Your intention">{intentions.map(({ name: label, sub, icon: Icon }) => <button type="button" key={label} className={`fg-choice ${intent === label ? 'selected' : ''}`} aria-pressed={intent === label} onClick={() => { setIntent(label); setError(''); }}><Icon size={23} strokeWidth={1.3} /><span className="fg-choice-check">{intent === label && <Check size={10} />}</span><strong>{label}</strong><small>{sub}</small></button>)}</div><div className="fg-gentle-note"><Sparkles size={15} /><span>A small first step. A more meaningful discovery.</span></div></>}
              {step === 1 && <><div className="fg-fields"><label>Date of birth<input type="date" value={dob} max={today} min="1900-01-01" required onChange={e => setDob(e.target.value)} onInput={e => setDob(e.currentTarget.value)} autoComplete="bday" /></label><label>Time of birth<input type="time" value={time} disabled={unknown} required={!unknown} onChange={e => setTime(e.target.value)} onInput={e => setTime(e.currentTarget.value)} /></label><label className="fg-wide">Birthplace<input value={place} required maxLength={120} placeholder="City, state, country" onChange={e => setPlace(e.target.value)} /></label></div><label className="fg-checkbox"><input type="checkbox" checked={unknown} onChange={e => setUnknown(e.target.checked)} />I don’t know my exact birth time</label><p className="fg-note">{unknown ? 'That’s okay. An astrologer can explain the limits of a reading without an exact birth time.' : 'Birth time helps an astrologer understand the Ascendant and houses in your chart.'}</p></>}
              {step === 2 && <><div className="fg-choices fg-wear" role="group" aria-label="Preferred gemstone form">{forms.map((form, i) => <button className={`fg-choice ${wear === form ? 'selected' : ''}`} type="button" key={form} aria-pressed={wear === form} onClick={() => { setWear(form); setError(''); }}><span className="fg-wear-icon"><WearIcon index={i} /></span><strong>{form}</strong><span className="fg-choice-check">{wear === form && <Check size={10} />}</span></button>)}</div><div className="fg-fields"><label>First name <small>(optional)</small><input value={name} maxLength={40} onChange={e => setName(e.target.value)} placeholder="How may we address you?" autoComplete="given-name" /></label><label>Preferred budget<select value={budget} onChange={e => setBudget(e.target.value)}>{['No preference', 'Under ₹15,000', '₹15,000–₹40,000', '₹40,000–₹1,00,000', '₹1,00,000+'].map(b => <option key={b}>{b}</option>)}</select></label></div></>}
              {step === 3 && <><dl className="fg-review">{[['Your intention', intent], ['Birth date', dob ? new Date(`${dob}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''], ['Time & place', `${unknown ? 'Time unknown' : time} · ${place}`], ['Your preference', `${wear} · ${budget}`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="fg-note"><ShieldCheck size={17} />Your details stay on this page unless you choose to include them in a consultation email. No chart has been calculated.</p></>}
            </div>
            {error && <p className="fg-error" role="alert">{error}</p>}
            <div className="fg-actions"><button className="fg-back" type="button" onClick={() => { if (step) { setStep(step - 1); setError(''); } else { setExample(true); window.setTimeout(() => document.getElementById('gem-example')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); } }}>{step ? <><ArrowLeft size={14} /> Back</> : <>See an example <ChevronRight size={13} /></>}</button>{step < 3 ? <button className="fg-primary" type="submit">{step === 2 ? 'Review my discovery' : 'Continue'}<ArrowRight size={16} /></button> : <button type="button" className="fg-primary" onClick={() => setConsult(true)}>Discuss my profile<ArrowRight size={16} /></button>}</div>
            <div className="fg-form-footer"><ShieldCheck size={12} /><span>Private by design</span><i>·</i><span>About 2 minutes</span></div>
          </form>
        </div>
      </section>

      <section className="fg-consult-strip"><div className="fg-consult-symbol"><MessageCircle size={25} strokeWidth={1.2} /></div><div><span className="fg-eyebrow">PREFER A HUMAN CONVERSATION?</span><h3>You don’t have to figure it out alone.</h3><p>Skip the questions. Begin with a conversation with an astrologer.</p></div><button onClick={() => setConsult(true)}>Talk to an astrologer <ArrowRight size={17} /></button></section>

      <section className="fg-example" id="gem-example"><button className="fg-example-toggle" onClick={() => setExample(!example)} aria-expanded={example}><span><span className="fg-eyebrow">A LITTLE CLARITY BEFORE YOU BEGIN</span><strong>What could your gemstone journey look like?</strong></span><span className="fg-plus">{example ? '−' : '+'}</span></button>{example && <div className="fg-example-content"><div><span className="fg-eyebrow">ILLUSTRATIVE EXAMPLE · NOT YOUR RESULT</span><h3>From a question<br />to a considered choice.</h3><p>Imagine someone seeking clarity in their work. They share their birth details; an astrologer reviews their chart and discusses whether any gemstone is appropriate.</p><p>If Emerald is suggested after that review, they can explore its origin, choose a metal and setting, and create their piece.</p><a className="fg-text-link" href="/#product/emerald">Explore the Emerald example <ArrowRight size={15} /></a></div><div className="fg-example-stone"><img src={gemstones.find(g => g.id === 'emerald')!.image} alt="Emerald gemstone example" /><span>PANNA · EMERALD</span><small>Traditionally associated with Mercury</small></div></div>}</section>
      <div className="fg-bottom-line"><span>YOUR INTENTION</span><i>✧</i><span>YOUR CHART</span><i>✧</i><span>YOUR GUIDANCE</span><i>✧</i><span>YOUR GEM</span></div>
    </main>
    <footer className="fg-footer"><a href="/">ASTROLAABH</a><span>Ancient wisdom. A personal journey.</span><a href="/#gemstone-collection">Explore all gemstones <ArrowRight size={13} /></a></footer>

    <dialog ref={dialog} className="fg-dialog" aria-label="Talk to an astrologer" onCancel={() => setConsult(false)} onClick={e => { if (e.target === e.currentTarget) setConsult(false); }}>
      <div className="fg-dialog-inner"><button className="fg-close" aria-label="Close consultation" onClick={() => setConsult(false)}><X size={20} /></button><span className="fg-eyebrow">A CONVERSATION COMES FIRST</span><MessageCircle className="fg-dialog-icon" size={36} strokeWidth={1} /><h2>Let’s find your<br /><em>way forward.</em></h2><p>Contact the AstroLaabh team to arrange a personal consultation. Ask about availability, fees, and the details needed for your chart.</p><a className="fg-primary" href={`mailto:hello@astrolaabh.com?subject=${encodeURIComponent('Personal gemstone consultation')}&body=${encodeURIComponent(summary)}`}>Prepare consultation email <ArrowRight size={16} /></a><small>This opens your email app with {intent ? 'your discovery details' : 'a consultation request'}. Review and send it when you’re ready. A booking is confirmed only by the team.</small><a className="fg-email" href="mailto:hello@astrolaabh.com">hello@astrolaabh.com</a></div>
    </dialog>
  </div>;
}
