import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Plus, Minus, ShieldCheck, Gem, Compass } from 'lucide-react';
import { scrollToTarget } from '../../lib/lenis';

interface FAQItem {
  id: string;
  category: 'astrology' | 'certification' | 'rituals';
  categoryLabel: string;
  question: string;
  answer: string;
  highlight?: string;
}

const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'astrology',
    categoryLabel: 'Vedic Astrology',
    question: 'How do I know which gemstone is astrologically correct for me?',
    answer: 'In authentic Vedic astrology, gemstones must only be prescribed based on your Lagna (Ascendant), Moon sign, and current planetary periods (Mahadasha/Antardasha). Wearing a stone for a malefic planet can cause adverse effects. Our master astrologers review your exact birth details (date, time, and place) to recommend the exact stone, weight (rati/carat), and metal required for your chart.',
    highlight: 'Personalized based on Lagna & Mahadasha',
  },
  {
    id: 'faq-2',
    category: 'certification',
    categoryLabel: 'Certification',
    question: 'Are all gemstones sold by Astro Laabh 100% natural and certified?',
    answer: 'Yes, without exception. Every single gemstone in our vault is 100% natural, untreated, and unheated. Each stone is accompanied by an individual certificate from premier independent gemological testing laboratories (such as GIA, IGI, or authorized government-recognized labs) verifying its natural origin, carats, cut, and color.',
    highlight: '100% Untreated & Unheated Guarantee',
  },
  {
    id: 'faq-3',
    category: 'rituals',
    categoryLabel: 'Sacred Rituals',
    question: 'What is Vedic Pran Pratishtha (Energization), and is it performed before dispatch?',
    answer: 'Pran Pratishtha is the sacred Vedic consecration ceremony where the gemstone is purified with Panchamrit and energized with thousands of planetary Beej Mantra chants. Astro Laabh conducts this ceremony on an auspicious planetary day and Muhurat calibrated to your name and birth star (Nakshatra) before securely dispatching your jewel.',
    highlight: 'Customized to your Nakshatra & Name',
  },
  {
    id: 'faq-4',
    category: 'rituals',
    categoryLabel: 'Wearing Protocol',
    question: 'Which hand, finger, and metal should I wear my gemstone in?',
    answer: 'Each planetary stone corresponds to a specific finger and metal. For example, Ruby (Sun) is typically set in gold and worn on the ring finger, while Emerald (Mercury) is worn on the little finger in gold or panchdhatu. When your order is crafted, our astrologers provide a personalized wearing instruction card indicating the exact metal, finger, day of the week, and auspicious hour to put it on.',
    highlight: 'Complete Wearing Guide Included',
  },
  {
    id: 'faq-5',
    category: 'astrology',
    categoryLabel: 'Consultations',
    question: 'What if I do not know my exact birth time for an astrologer consultation?',
    answer: 'If you lack an exact birth time, our Vedic astrologers utilize Prashna Kundali (Horary astrology based on the moment of your query), combined with palmistry markings and major life event verification, to accurately determine your beneficial planetary gemstones.',
    highlight: 'Prashna Kundali & Palmistry Available',
  },
  {
    id: 'faq-6',
    category: 'certification',
    categoryLabel: 'Guarantee',
    question: 'What is your return and lifetime authenticity guarantee?',
    answer: 'Astro Laabh provides an unconditional lifetime authenticity guarantee that your gemstone is completely natural and genuine as certified. We also offer a 14-day inspection window from the date of delivery for loose gemstones, allowing you to have the stone independently verified by any accredited gem lab.',
    highlight: '14-Day Inspection & Lifetime Guarantee',
  },
];

const categories = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'astrology', label: 'Vedic Astrology', icon: Compass },
  { id: 'certification', label: 'Lab Certification', icon: Gem },
  { id: 'rituals', label: 'Wearing & Consecration', icon: ShieldCheck },
];

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter((f) => f.category === activeCategory);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="faq-redesign-section" aria-labelledby="faq-title">
      <div className="faq-ambient-glow" aria-hidden="true" />

      <div className="faq-layout-container">
        {/* Left Sticky Editorial Column */}
        <div className="faq-editorial-column">
          <div className="faq-sticky-box">
            <span className="faq-badge">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#9C691E]" />
              CLARITY & SACRED WISDOM
            </span>
            <h2 id="faq-title">Frequently Asked Questions</h2>
            <p className="faq-editorial-desc">
              Everything you need to know about authentic Vedic gemstones, independent laboratory certifications, and consecrated wearing rituals.
            </p>

            {/* Category Filter Pills */}
            <div className="faq-category-nav" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`faq-cat-pill ${activeCategory === cat.id ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Contact Box */}
            <div className="faq-concierge-card">
              <div className="faq-concierge-header">
                <span className="faq-concierge-dot" />
                <h4>Senior Astrologer On Call</h4>
              </div>
              <p>Need clarity on your kundali or a specific gemstone? Speak directly with our master astrologer.</p>
              <button
                type="button"
                className="faq-concierge-btn"
                onClick={() => scrollToTarget('appointment')}
              >
                <MessageCircle className="w-3.5 h-3.5 inline mr-1.5" />
                Book Astrologer Call
              </button>
            </div>
          </div>
        </div>

        {/* Right Accordion Column */}
        <div className="faq-items-column">
          <div className="faq-accordion-list">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              const numberStr = String(index + 1).padStart(2, '0');

              return (
                <motion.article
                  key={faq.id}
                  className={`faq-card ${isOpen ? 'is-open' : ''}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-body-${faq.id}`}
                  >
                    <div className="faq-trigger-left">
                      <span className="faq-number">{numberStr}</span>
                      <div className="faq-question-wrap">
                        <span className="faq-mini-tag">{faq.categoryLabel}</span>
                        <h3 className="faq-question-text">{faq.question}</h3>
                      </div>
                    </div>

                    <div className="faq-icon-indicator" aria-hidden="true">
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.28, ease: [0.2, 0.9, 0.3, 1] }}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-[#9C691E]" />
                        ) : (
                          <Plus className="w-4 h-4 text-[#6E5A44]" />
                        )}
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-body-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: 'auto', 
                          opacity: 1,
                          transition: {
                            height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.25, delay: 0.08 }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: { duration: 0.28, ease: [0.7, 0, 0.84, 0] },
                            opacity: { duration: 0.15 }
                          }
                        }}
                        className="faq-collapse-body"
                      >
                        <div className="faq-body-content">
                          <p>{faq.answer}</p>
                          {faq.highlight && (
                            <div className="faq-highlight-pill">
                              <Sparkles className="w-3 h-3 text-[#9C691E]" />
                              <span>{faq.highlight}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
