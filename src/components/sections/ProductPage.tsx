import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, Check, Heart, Menu, ShieldCheck, ShoppingBag, Sparkles, Star, X } from 'lucide-react';
import rubyCutout from '../../assets/ruby.png';
import rubyPortrait from '../../assets/rubyinfo.png';

const lots = [
  { weight: '3.25', tone: 'Light crimson', lot: '0981', price: '₹1,69,000' },
  { weight: '4.46', tone: 'Pigeon blood', lot: '1034', price: '₹2,31,920' },
  { weight: '5.25', tone: 'Pigeon blood', lot: '1087', price: '₹2,73,000' },
  { weight: '6.10', tone: 'Deep pigeon', lot: '1140', price: '₹3,17,200' },
];

const journey = [
  { number: '01', title: 'Chosen at source', detail: 'Mogok Valley, Burma. Selected for colour, then recorded by parcel before it moves.', mark: 'MOGOK · MYANMAR' },
  { number: '02', title: 'Cut to keep its fire', detail: 'A Jaipur lapidary shapes the stone to bring out its natural depth and brilliance.', mark: 'JAIPUR · INDIA' },
  { number: '03', title: 'Verified, in writing', detail: 'An accredited gem lab confirms natural ruby, origin and treatment. Your report is yours to keep.', mark: 'LAB CERTIFIED' },
  { number: '04', title: 'Prepared for you', detail: 'A guided consultation comes first. If it is right for you, we energise it at your chosen muhurat.', mark: 'MADE PERSONAL' },
];

export function ProductPage() {
  const [selectedLot, setSelectedLot] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [showNotice, setShowNotice] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 0.34], [0, -70]);
  const storyGlow = useTransform(scrollYProgress, [0.1, 0.5], [0.2, 0.75]);
  const current = lots[selectedLot];

  useEffect(() => {
    if (!showNotice) return;
    const timer = window.setTimeout(() => setShowNotice(false), 3200);
    return () => window.clearTimeout(timer);
  }, [showNotice]);

  const addToBag = () => {
    setBagCount((count) => count + 1);
    setShowNotice(true);
  };

  return (
    <main className="pdp-shell">
      <div className="pdp-progress" aria-hidden="true"><motion.span style={{ scaleX: scrollYProgress, transformOrigin: '0%' }} /></div>
      <header className="pdp-header">
        <button className="pdp-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
        <a className="pdp-wordmark" href="#top" aria-label="Astro Laabh home"><span>ASTRO</span><span>LAABH</span><i>✦</i></a>
        <nav className={`pdp-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#details" onClick={() => setMenuOpen(false)}>THE STONE</a>
          <a href="#journey" onClick={() => setMenuOpen(false)}>OUR PROMISE</a>
          <a href="#ritual" onClick={() => setMenuOpen(false)}>VEDIC WISDOM</a>
        </nav>
        <button className="pdp-bag" aria-label={`Shopping bag, ${bagCount} items`} onClick={() => setShowNotice(true)}><ShoppingBag size={17} /><span>BAG</span><b>{String(bagCount).padStart(2, '0')}</b></button>
      </header>

      <div className="pdp-crumb"><a href="#top">GEMSTONES</a><span>/</span><a href="#details">THE NAVARATNA</a><span>/</span><b>MANIK</b></div>

      <section id="top" className="pdp-product">
        <div className="pdp-gallery">
          <div className="pdp-gallery-top"><span>ONE OF ONE</span><button onClick={() => setSaved(!saved)} aria-label={saved ? 'Remove from saved items' : 'Save this stone'} className={saved ? 'is-saved' : ''}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button></div>
          <motion.div className={`pdp-visual ${activeImage === 1 ? 'show-studio' : ''}`} style={{ y: imageY }}>
            <div className="pdp-orbit pdp-orbit-one" /><div className="pdp-orbit pdp-orbit-two" />
            <div className="pdp-visual-grain" />
            <div className="pdp-side-note"><span>THE SUN STONE</span><i>✳</i><span>EST. IN MEANING</span></div>
            <motion.img key={activeImage} initial={{ opacity: 0, scale: .94, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .7, ease: [.2,.7,.2,1] }} src={activeImage === 0 ? rubyCutout : rubyPortrait} alt="Natural pigeon blood ruby, Manik" />
            <div className="pdp-gem-caption"><span>01 / 04</span><span>BURMA · NATURAL RUBY</span></div>
            <div className="pdp-view-pill"><span className="pdp-live-dot" /> STONE 1034 · 4.46 RATTI</div>
          </motion.div>
          <div className="pdp-thumbnails" aria-label="Stone images">
            {[0,1,2,3].map((image) => <button className={activeImage === image ? 'active' : ''} key={image} onClick={() => setActiveImage(image)} aria-label={`View image ${image + 1}`}>
              {image === 1 ? <img src={rubyPortrait} alt="" /> : <img src={rubyCutout} alt="" style={{ filter: image === 2 ? 'hue-rotate(10deg)' : image === 3 ? 'brightness(.78)' : undefined }} />}
              {image === 2 && <span>DETAIL</span>}{image === 3 && <span>IN HAND</span>}
            </button>)}
            <span className="pdp-thumbs-hint">A closer look <ArrowRight size={13} /></span>
          </div>
        </div>

        <div className="pdp-buy" id="details">
          <div className="pdp-eyebrow"><span className="pdp-starline">✳</span> THE SUN · SURYA <span className="pdp-starline">✳</span></div>
          <h1>Manik<span className="pdp-devanagari">माणिक</span></h1>
          <div className="pdp-subtitle">THE BURMESE RUBY <span>·</span> 4.46 RATTI <span>·</span> PIGEON BLOOD</div>
          <div className="pdp-rating"><span className="pdp-stars"><Star /><Star /><Star /><Star /><Star /></span><span>4.9 / 5</span><i /> <span>142 stone stories</span></div>
          <div className="pdp-price-row"><strong>{current.price}</strong><span>Inclusive of all taxes</span><span className="pdp-stock"><i /> ONE STONE AVAILABLE</span></div>
          <p className="pdp-description">A rare, vivid red from the Mogok Valley. Chosen for its living colour, traced to its origin and offered with the care a stone of the Sun deserves.</p>

          <div className="pdp-rule" />
          <div className="pdp-field-heading"><span>Choose your stone</span><button onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}>HOW WE VERIFY <ArrowRight size={13} /></button></div>
          <div className="pdp-weight-options" role="radiogroup" aria-label="Ruby weight">
            {lots.map((lot, index) => <button key={lot.lot} role="radio" aria-checked={selectedLot === index} onClick={() => setSelectedLot(index)} className={`pdp-weight-card ${selectedLot === index ? 'selected' : ''}`}>
              <span className="pdp-weight-check">{selectedLot === index ? <Check size={11} /> : null}</span>
              <strong>{lot.weight}<small> ratti</small></strong><span>{lot.tone}</span><em>LOT AL·MNK·{lot.lot}</em>
            </button>)}
          </div>
          <div className="pdp-selected-lot"><span><i /> Photograph of your exact stone</span><span>LOT AL·MNK·{current.lot}</span></div>

          <button className="pdp-add-button" onClick={addToBag}><span>ADD TO BAG</span><span>{current.price}</span><ArrowRight size={18} /></button>
          <button className="pdp-consult-link" onClick={() => document.getElementById('ritual')?.scrollIntoView({ behavior: 'smooth' })}>A reading comes first <ArrowRight size={14} /></button>
          <div className="pdp-assurances"><span><ShieldCheck size={16} /> LAB CERTIFIED</span><i /><span><Sparkles size={16} /> NATURAL · UNHEATED</span><i /><span>INSURED DELIVERY</span></div>
          <div className="pdp-bottom-hint"><ArrowDown size={14} /> <span>DISCOVER THE STORY BEHIND YOUR STONE</span></div>
        </div>
      </section>

      <section className="pdp-story" id="ritual">
        <motion.div className="pdp-story-aura" style={{ opacity: storyGlow }} />
        <div className="pdp-story-top"><span>01 — THE MEANING</span><span>RUBY · THE STONE OF SURYA</span></div>
        <div className="pdp-story-content">
          <div className="pdp-story-image"><img src={rubyPortrait} alt="Ruby glowing within a golden halo" /><span>माणिक्य</span></div>
          <div className="pdp-story-copy"><div className="pdp-eyebrow">WORN WITH INTENTION <span className="pdp-starline">✳</span></div><h2>For the light<br />you <em>carry.</em></h2><p>In Vedic tradition, Manik is associated with Surya—the Sun, source of vitality and steady purpose. For centuries it has been chosen as a symbol of leadership, courage and inner radiance.</p><p className="pdp-note">A gemstone is a personal choice. We always recommend speaking with a trusted astrologer before wearing one.</p><div className="pdp-mantra"><span>BEEJ MANTRA · RECITED DURING ENERGISATION</span><strong>ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः</strong><i>Om Hraam Hreem Hraum Sah Suryaya Namah</i></div></div>
        </div>
        <div className="pdp-story-footer"><span>WORN FOR <b>LEADERSHIP · VITALITY · RECOGNITION</b></span><span>TRADITIONALLY WORN SUNDAY AT SUNRISE</span></div>
      </section>

      <section className="pdp-journey" id="journey">
        <div className="pdp-journey-header"><div><div className="pdp-eyebrow">MINE TO HAND <span className="pdp-starline">✳</span></div><h2>Every stone has<br />a <em>name at every step.</em></h2></div><p>From the moment it leaves the earth to the moment it reaches you, your Manik travels with a record you can trust.</p></div>
        <div className="pdp-journey-grid">{journey.map((step, index) => <motion.article key={step.number} className="pdp-journey-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ delay: index * .1, duration: .6 }}>
          <div className="pdp-step-head"><span>{step.number}</span><i>✳</i></div><div className="pdp-step-line" /><div className="pdp-step-mark">{step.mark}</div><h3>{step.title}</h3><p>{step.detail}</p>
        </motion.article>)}</div>
        <div className="pdp-certificate"><div className="pdp-cert-icon"><ShieldCheck /></div><div><span>THE ASTROLAABH PROMISE</span><strong>Two certificates. Yours for life.</strong><p>Gem lab report · Astrological Effectiveness Certificate · Energisation recording</p></div><button onClick={() => setShowNotice(true)}>WHAT'S INCLUDED <ArrowRight size={14} /></button></div>
      </section>

      <footer className="pdp-footer"><a className="pdp-wordmark" href="#top"><span>ASTRO</span><span>LAABH</span><i>✦</i></a><p>MEANINGFUL GEMSTONES FOR A BRIGHTER YOU</p><a href="#top" className="pdp-backtop">BACK TO THE STONE <ArrowLeft size={14} /></a></footer>

      <AnimatePresence>{showNotice && <motion.div className="pdp-toast" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}><span className="pdp-toast-icon"><Check size={16} /></span><div><strong>{bagCount ? 'A stone is waiting for you.' : 'Here for your questions.'}</strong><span>{bagCount ? `Manik · ${current.weight} ratti · ${current.price}` : 'Your astrologer can help you choose with confidence.'}</span></div><button onClick={() => setShowNotice(false)} aria-label="Dismiss"><X size={16} /></button></motion.div>}</AnimatePresence>
    </main>
  );
}

export default ProductPage;
