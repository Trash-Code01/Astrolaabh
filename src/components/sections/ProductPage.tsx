import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, Check, Heart, ShieldCheck, Sparkles, Star, X } from 'lucide-react';
import { Navbar } from '../dom/layout/Navbar';
import { Footer } from '../dom/layout/Footer';
import rubyPortrait from '../../assets/optimized/rubyinfo.webp';
import blueSapphirePortrait from '../../assets/optimized/bluesapphireinfo.webp';
import emeraldPortrait from '../../assets/optimized/emeraldinfo.webp';
import pearlPortrait from '../../assets/optimized/pearlinfo.webp';
import yellowSapphirePortrait from '../../assets/optimized/goldeninfo.webp';
import metalMaterials from '../../assets/optimized/metal-materials.webp';
import { getJewelryAsset } from '../../lib/jewelryAssets';
import { gemstones, type Gemstone } from '../../lib/gemstones';
import { FLAGSHIP_PRODUCT } from '../../lib/constants';
import { useCartStore } from '../../store/useCartStore';
import { navigateToCart } from '../../lib/navigation';

const forms = ['Loose stone', 'Ring', 'Necklace', 'Bracelet'];
const metals = [
  { id: 'yellow-gold', name: '18k Yellow gold', short: '18K GOLD', color: '#d6ad58' },
  { id: 'silver', name: '925 Sterling silver', short: '925 SILVER', color: '#aeb8c0' },
];
const mantras: Record<string, [string, string]> = {
  ruby: ['ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', 'Om Hraam Hreem Hraum Sah Suryaya Namah'],
  'blue-sapphire': ['ॐ शं शनैश्चराय नमः', 'Om Sham Shanaishcharaya Namah'],
  emerald: ['ॐ बुं बुधाय नमः', 'Om Bum Budhaya Namah'],
  'yellow-sapphire': ['ॐ बृं बृहस्पतये नमः', 'Om Brim Brihaspataye Namah'],
  pearl: ['ॐ सों सोमाय नमः', 'Om Som Somaya Namah'],
  diamond: ['ॐ शुं शुक्राय नमः', 'Om Shum Shukraya Namah'],
};

const journey = (gemstone: Gemstone) => [
  { number: '01', title: 'Chosen at source', detail: `${gemstone.origin}. Selected for its natural character and traced before it moves.`, mark: gemstone.origin.toUpperCase() },
  { number: '02', title: 'Cut to reveal its fire', detail: `A skilled lapidary brings out the colour and brilliance unique to this ${gemstone.name.toLowerCase()}.`, mark: 'MADE BY HAND' },
  { number: '03', title: 'Verified, in writing', detail: 'An accredited gem lab confirms your stone. Its report is yours to keep and verify.', mark: 'LAB CERTIFIED' },
  { number: '04', title: 'Prepared for you', detail: 'A guided consultation comes first. If the stone is right for you, we prepare it with care.', mark: 'MADE PERSONAL' },
];

function JewelleryVisual({ form, metal, image, gemstoneId, gemstoneName, previewZoom = false }: { form: string; metal: (typeof metals)[number] | null; image: string; gemstoneId: string; gemstoneName: string; previewZoom?: boolean }) {
  return (
    <div className={`pdp-model pdp-model-${form.toLowerCase().replace(' ', '-')}`}>
      {metal ? <motion.div
        className="pdp-jewelry-photo"
        role="img"
        aria-label={`${gemstoneName} ${form.toLowerCase()} in ${metal.name}`}
        style={getJewelryAsset(gemstoneId, metal.id, form)}
        initial={{ opacity: 0, scale: .96 }}
        animate={{ opacity: 1, scale: previewZoom ? 1.05 : 1 }}
        transition={{ duration: .4 }}
      /> : <motion.img className="pdp-jewel-stone" src={image} alt={gemstoneName}
        style={{ left: '50%', x: '-50%' }} animate={{ y: ['-54%', '-46%', '-54%'] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />}
    </div>
  );
}
const legacyGemIds: Record<string, string> = { moonga: 'red-coral', gomed: 'hessonite', lehsunia: 'cats-eye' };
const storyImages: Record<string, string> = { ruby: rubyPortrait, 'blue-sapphire': blueSapphirePortrait, emerald: emeraldPortrait, pearl: pearlPortrait, 'yellow-sapphire': yellowSapphirePortrait };
export function ProductPage({ gemstoneId = 'ruby' }: { gemstoneId?: string }) {
  const gemstone = gemstones.find((item) => item.id === (legacyGemIds[gemstoneId] || gemstoneId)) ?? gemstones[0];
  const [selectedForm, setSelectedForm] = useState<number | null>(null);
  const [hoveredForm, setHoveredForm] = useState<number | null>(null);
  const [selectedMetalId, setSelectedMetalId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(2);
  const [saved, setSaved] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 0.34], [0, -70]);
  const storyGlow = useTransform(scrollYProgress, [0.1, 0.5], [0.2, 0.75]);
  const selectedMetal = metals.find((metal) => metal.id === selectedMetalId) ?? null;
  const displayForm = activeStep === 3 && selectedMetal ? forms[hoveredForm ?? selectedForm ?? 1] : 'Loose stone';
  const secondaryImage = storyImages[gemstone.id] || gemstone.image;
  const sanskritName = gemstone.hindiName.split('·')[0].trim();
  const planetName = gemstone.planet.split(' ')[0].toUpperCase();
  const [mantra, transliteration] = mantras[gemstone.id] ?? ['', ''];

  useEffect(() => {
    document.title = `${gemstone.name} — AstroLaabh`;
  }, [gemstone.name]);

  useEffect(() => {
    if (!showNotice) return;
    const timer = window.setTimeout(() => setShowNotice(false), 3200);
    return () => window.clearTimeout(timer);
  }, [showNotice]);

  const buyNow = () => {
    if (!selectedMetal || selectedForm === null) return;

    const form = forms[selectedForm];
    const colorway = {
      id: selectedMetal.id,
      name: `${selectedMetal.name} · ${form}`,
      hex: selectedMetal.color,
      finish: 'metallic' as const,
      roughness: 0.24,
      metalness: 0.88,
      emissiveColor: selectedMetal.color,
    };
    const price = Number(gemstone.price.replace(/[^0-9]/g, '')) || 0;
    const product = {
      ...FLAGSHIP_PRODUCT,
      id: `gemstone-${gemstone.id}-${selectedMetal.id}-${form.toLowerCase()}`,
      name: `${gemstone.name} · ${form}`,
      edition: 'HANDCRAFTED TO ORDER',
      tagline: gemstone.tagline,
      description: gemstone.description,
      price,
      currency: 'INR',
      colorways: [colorway],
      specs: [
        { label: 'GEMSTONE', value: gemstone.name, detail: gemstone.origin },
        { label: 'SETTING', value: form, detail: selectedMetal.name },
      ],
      features: gemstone.benefits,
      gemstoneId: gemstone.id,
      metalId: selectedMetal.id,
      jewelryForm: form,
    };

    addItem(product, colorway, 1);
    navigateToCart();
  };

  return (
    <div className="pdp-shell" style={{ '--pdp-stone': gemstone.id === 'ruby' ? '#8a1828' : gemstone.id === 'blue-sapphire' ? '#1d4582' : gemstone.id === 'emerald' ? '#1c6749' : gemstone.id === 'yellow-sapphire' ? '#9a6f1b' : gemstone.id === 'pearl' ? '#9b8970' : '#546987' } as CSSProperties}>
      <div className="pdp-progress" aria-hidden="true"><motion.span style={{ scaleX: scrollYProgress, transformOrigin: '0%' }} /></div>
      <Navbar productPage />

      <main>
      <div className="pdp-crumb"><a href="/#gemstone-collection">GEMSTONES</a><span>/</span><a href="/#gemstone-collection">THE NAVARATNA</a><span>/</span><b>{gemstone.name.toUpperCase()}</b></div>

      <section id="top" className="pdp-product">
        <div className="pdp-gallery">
          <div className="pdp-gallery-top"><span>THE {gemstone.name.toUpperCase()} COLLECTION</span><button onClick={() => setSaved(!saved)} aria-label={saved ? 'Remove from saved items' : 'Save this stone'} className={saved ? 'is-saved' : ''}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button></div>
          <motion.div className="pdp-visual" style={{ y: imageY, background: 'linear-gradient(145deg, #f8f4eb 0%, #eee8da 100%)' }}>
            <div className="pdp-side-note"><span>{planetName} STONE</span><i>✳</i><span>HAND FINISHED</span></div>
            <AnimatePresence mode="wait"><JewelleryVisual key={`${gemstone.id}-${selectedMetalId}-${displayForm}`} form={displayForm} metal={activeStep === 3 ? selectedMetal : null} image={gemstone.image} gemstoneId={gemstone.id} gemstoneName={gemstone.name} previewZoom={hoveredForm !== null} /></AnimatePresence>
            <div className="pdp-gem-caption"><span>ATELIER · 01</span><span>{gemstone.origin.toUpperCase()} · NATURAL {gemstone.name.toUpperCase()}</span></div>
          </motion.div>
          <p className="pdp-design-note">Illustrative setting preview · Final stone and design confirmed with your order</p><div className="pdp-stage-caption"><span>NATURAL · CERTIFIED</span><span>01 — {gemstone.name.toUpperCase()}</span><span>HANDCRAFTED TO ORDER</span></div>
        </div>

        <div className="pdp-buy" id="details">
          <div className="pdp-eyebrow"><span className="pdp-starline">✳</span> {gemstone.planet.toUpperCase()} <span className="pdp-starline">✳</span></div>
          <h1>{gemstone.hindiName.split('·')[1]?.trim() ?? gemstone.name}<span className="pdp-devanagari">{sanskritName}</span></h1>
          <div className="pdp-subtitle">{gemstone.name.toUpperCase()} <span>·</span> {gemstone.planet.toUpperCase()} <span>·</span> {gemstone.origin.toUpperCase()}</div>
          <div className="pdp-rating"><span className="pdp-stars"><Star /><Star /><Star /><Star /><Star /></span><span>4.9 / 5</span><i /> <span>142 stone stories</span></div>
          <div className="pdp-price-row"><strong>{gemstone.price === 'Price on request' ? gemstone.price : `From ${gemstone.price}`}</strong><span>{gemstone.price === 'Price on request' ? 'Speak with our gemstone team' : 'Inclusive of all taxes'}</span><span className="pdp-stock"><i /> AVAILABLE TO DISCOVER</span></div>
          <p className="pdp-description">{gemstone.description}</p>

          <div className="pdp-rule" />
          <div className="pdp-config-heading"><div><span>YOUR PIECE, YOUR WAY</span><strong>Choose a setting</strong></div><span>STEP {activeStep} OF 3</span></div>
          <div className="pdp-config-progress" aria-label={`Step ${activeStep} of 3`}>
            <button className="is-complete" onClick={() => setActiveStep(2)}><i><Check size={11} /></i><span>01 <b>GEM</b></span></button><span className="pdp-config-line is-complete" />
            <button className={activeStep === 2 ? 'is-current' : 'is-complete'} onClick={() => setActiveStep(2)}><i>{activeStep > 2 ? <Check size={11} /> : '02'}</i><span>02 <b>METAL</b></span></button><span className={`pdp-config-line ${selectedMetal ? 'is-complete' : ''}`} />
            <button className={activeStep === 3 ? 'is-current' : ''} onClick={() => selectedMetal && setActiveStep(3)} disabled={!selectedMetal}><i>03</i><span>03 <b>FORM</b></span></button>
          </div>

          {activeStep === 2 ? <div className="pdp-config-panel" key="metal-step">
            <div className="pdp-field-heading"><span>Select your metal</span><span className="pdp-field-note">RESPONSIBLY SOURCED</span></div>
            <div className="pdp-metal-options" role="radiogroup" aria-label="Choose your metal">
              {metals.map((metal) => <button key={metal.id} role="radio" aria-checked={selectedMetalId === metal.id} onClick={() => setSelectedMetalId(metal.id)} className={`pdp-metal-card ${selectedMetalId === metal.id ? 'selected' : ''}`}>
                <span className="pdp-metal-photo" aria-hidden="true" style={{ backgroundImage: `url(${metalMaterials})`, backgroundPosition: metal.id === 'silver' ? 'right center' : 'left center' }} />
                <span><strong>{metal.name}</strong><small>{metal.short}</small></span>
                <i>{selectedMetalId === metal.id && <Check size={11} />}</i>
              </button>)}
            </div>
            <div className="pdp-config-foot"><span>{selectedMetal ? `${selectedMetal.name} selected · ${gemstone.name} set by hand` : 'Choose the metal for your setting'}</span><button className="pdp-next-button" disabled={!selectedMetal} onClick={() => setActiveStep(3)}>CHOOSE A FORM <ArrowRight size={15} /></button></div>
          </div> : <div className="pdp-config-panel" key="form-step">
            <div className="pdp-field-heading"><span>Select your form</span><button className="pdp-back-button" onClick={() => setActiveStep(2)}><ArrowLeft size={13} /> CHANGE METAL</button></div>
            <div className="pdp-form-options" role="radiogroup" aria-label="Choose your jewelry form">
              {forms.slice(1).map((form) => {
                const index = forms.indexOf(form);
                const previewStyle = getJewelryAsset(gemstone.id, selectedMetal!.id, form);
                return <button key={form} role="radio" aria-checked={selectedForm === index} onClick={() => setSelectedForm(index)} onMouseEnter={() => setHoveredForm(index)} onMouseLeave={() => setHoveredForm(null)} onFocus={() => setHoveredForm(index)} onBlur={() => setHoveredForm(null)} className={`pdp-form-card ${selectedForm === index ? 'selected' : ''}`}><span className="pdp-form-photo" aria-hidden="true" style={previewStyle} /><span>{form}</span><i>{selectedForm === index && <Check size={11} />}</i></button>;
              })}
            </div>
            <div className="pdp-config-foot"><span>{selectedForm === null ? 'Choose the silhouette for your piece' : `${forms[selectedForm]} · ${selectedMetal?.name}`}</span><button className="pdp-next-button" disabled={selectedForm === null} onClick={buyNow}>ADD TO BAG <ArrowRight size={15} /></button></div>
          </div>}
          <button className="pdp-consult-link" onClick={() => document.getElementById('ritual')?.scrollIntoView({ behavior: 'smooth' })}>A reading comes first <ArrowRight size={14} /></button>
          <div className="pdp-assurances"><span><ShieldCheck size={16} /> LAB CERTIFIED</span><i /><span><Sparkles size={16} /> NATURAL · UNHEATED</span><i /><span>INSURED DELIVERY</span></div>
          <div className="pdp-bottom-hint"><ArrowDown size={14} /> <span>DISCOVER THE STORY BEHIND YOUR STONE</span></div>
        </div>
      </section>

      <section className="pdp-story" id="ritual">
        <motion.div className="pdp-story-aura" style={{ opacity: storyGlow }} />
        <div className="pdp-story-top"><span>01 — THE MEANING</span><span>{gemstone.name.toUpperCase()} · {gemstone.planet.toUpperCase()}</span></div>
        <div className="pdp-story-content">
          <div className="pdp-story-image"><img loading="lazy" decoding="async" src={secondaryImage} alt={`${gemstone.name} gemstone`} /><span>{sanskritName}</span></div>
          <div className="pdp-story-copy"><div className="pdp-eyebrow">WORN WITH INTENTION <span className="pdp-starline">✳</span></div><h2>{gemstone.tagline.replace(/^The Gem of /i, 'The gift of ')}.</h2><p>{gemstone.description}</p><p className="pdp-note">A gemstone is a personal choice. We always recommend speaking with a trusted astrologer before wearing one.</p>{mantra && <div className="pdp-mantra"><span>BEEJ MANTRA · RECITED DURING ENERGISATION</span><strong>{mantra}</strong><i>{transliteration}</i></div>}</div>
        </div>
        <div className="pdp-story-footer"><span>WORN FOR <b>{gemstone.benefits.join(' · ').toUpperCase()}</b></span><span>CHOSEN WITH PERSONAL GUIDANCE</span></div>
      </section>

      <section className="pdp-journey" id="journey">
        <div className="pdp-journey-header"><div><div className="pdp-eyebrow">MINE TO HAND <span className="pdp-starline">✳</span></div><h2>Every stone has<br />a <em>name at every step.</em></h2></div><p>From {gemstone.origin} to your hands, your {gemstone.name} travels with a record you can trust.</p></div>
        <div className="pdp-journey-grid">{journey(gemstone).map((step, index) => <motion.article key={step.number} className="pdp-journey-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ delay: index * .1, duration: .6 }}>
          <div className="pdp-step-head"><span>{step.number}</span><i>✳</i></div><div className="pdp-step-line" /><div className="pdp-step-mark">{step.mark}</div><h3>{step.title}</h3><p>{step.detail}</p>
        </motion.article>)}</div>
        <div className="pdp-certificate"><div className="pdp-cert-icon"><ShieldCheck /></div><div><span>THE ASTROLAABH PROMISE</span><strong>Two certificates. Yours for life.</strong><p>Gem lab report · Astrological Effectiveness Certificate · Energisation recording</p></div><button onClick={() => setShowNotice(true)}>WHAT'S INCLUDED <ArrowRight size={14} /></button></div>
      </section>
      </main>

      <Footer productPage />

      <AnimatePresence>{showNotice && <motion.div className="pdp-toast" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}><span className="pdp-toast-icon"><Check size={16} /></span><div><strong>Here for your questions.</strong><span>Your astrologer can help you choose with confidence.</span></div><button onClick={() => setShowNotice(false)} aria-label="Dismiss"><X size={16} /></button></motion.div>}</AnimatePresence>
    </div>
  );
}

export default ProductPage;
