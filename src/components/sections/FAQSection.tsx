import { useState } from 'react';
import { ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { scrollToTarget } from '../../lib/lenis';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I know which gemstone is astrologically correct for me?',
    answer: 'In Vedic astrology, gemstones must only be chosen based on your Lagna (Ascendant), Moon sign, and ongoing planetary periods (Mahadasha/Antardasha). Wearing a stone for a malefic planet can cause adverse effects. Our master astrologers review your exact birth details (date, time, and place) to recommend the exact stone, weight (rati/carat), and metal required for your chart.',
  },
  {
    question: 'Are all gemstones sold by Astro Laabh 100% natural and certified?',
    answer: 'Yes, without exception. Every single gemstone in our vault is 100% natural, untreated, and unheated. Each stone is accompanied by an individual certificate from premier independent gemological testing laboratories (such as GIA, IGI, or authorized government-recognized labs) verifying its natural origin, carats, cut, and color.',
  },
  {
    question: 'What is Vedic Pran Pratishtha (Energization), and is it performed before dispatch?',
    answer: 'Pran Pratishtha is the sacred Vedic consecration ceremony where the gemstone is purified with Panchamrit and energized with thousands of planetary Beej Mantra chants. Astro Laabh conducts this ceremony on an auspicious planetary day and Muhurat calibrated to your name and birth star (Nakshatra) before securely dispatching your jewel.',
  },
  {
    question: 'Which hand, finger, and metal should I wear my gemstone in?',
    answer: 'Each planetary stone corresponds to a specific finger and metal. For example, Ruby (Sun) is typically set in gold and worn on the ring finger, while Emerald (Mercury) is worn on the little finger. When your order is crafted, our astrologers provide a personalized wearing instruction card indicating the exact metal, finger, day of the week, and auspicious hour to put it on.',
  },
  {
    question: 'What if I do not know my exact birth time for an astrologer consultation?',
    answer: 'If you lack an exact birth time, our Vedic astrologers utilize Prashna Kundali (Horary astrology based on the moment of your query), combined with palmistry markings and major life event verification, to accurately determine your beneficial planetary gemstones.',
  },
  {
    question: 'What is your return and lifetime authenticity guarantee?',
    answer: 'Astro Laabh provides a lifetime authenticity guarantee that your gemstone is completely natural and genuine as certified. We also offer a 14-day inspection window from the date of delivery for loose gemstones, allowing you to have the stone independently verified by any accredited laboratory.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className="faq-luxury-section" aria-labelledby="faq-heading">
      <div className="faq-container">
        <header className="faq-header">
          <p className="faq-eyebrow">
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-[#B8860B]" />
            CLARITY & WISDOM
            <Sparkles className="w-3.5 h-3.5 inline ml-1.5 text-[#B8860B]" />
          </p>
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          <p className="faq-subheading">
            Everything you need to know about authentic Vedic gemstones, consecration, and personalized consultations.
          </p>
        </header>

        <div className="faq-accordion" role="region" aria-label="Frequently Asked Questions">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className={`faq-icon-wrapper ${isOpen ? 'is-open' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-[#9C691E]" />
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className="faq-answer-collapse"
                  style={{
                    maxHeight: isOpen ? '280px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions helper box */}
        <div className="faq-help-card">
          <div className="faq-help-info">
            <h3>Have a specific question about your chart?</h3>
            <p>Our dedicated gemologists and Vedic astrologers are available to assist you personally.</p>
          </div>
          <div className="faq-help-actions">
            <button
              type="button"
              className="faq-help-btn"
              onClick={() => scrollToTarget('appointment')}
            >
              <MessageCircle className="w-4 h-4 mr-1.5 inline" />
              Book Astrologer Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
