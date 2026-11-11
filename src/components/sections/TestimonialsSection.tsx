import { useEffect, useRef, useState, useMemo } from 'react';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';

interface Review {
  quote: string;
  name: string;
  location: string;
  stone: string;
  category: 'wealth' | 'focus' | 'peace' | 'all';
  rating: number;
}

const allReviews: Review[] = [
  {
    quote: 'The Blue Sapphire felt deeply personal. Within weeks of wearing it after my Vedic chart reading, I felt a calm mental clarity in my business decisions.',
    name: 'Ananya Mehta',
    location: 'Mumbai',
    stone: 'Neelam · Blue Sapphire',
    category: 'focus',
    rating: 5,
  },
  {
    quote: 'Every detail felt thoughtful. The astrologer consultation was elegant, unhurried, and genuinely insightful. The Ruby ring is an heirloom.',
    name: 'Leena Kapoor',
    location: 'New Delhi',
    stone: 'Manik · Burmese Ruby',
    category: 'wealth',
    rating: 5,
  },
  {
    quote: 'A meaningful Emerald that I wear every day. Chosen with genuine Vedic care and certified authenticity that gives complete peace of mind.',
    name: 'Sara Rahman',
    location: 'Dubai',
    stone: 'Panna · Zambian Emerald',
    category: 'wealth',
    rating: 5,
  },
  {
    quote: 'The astrologer pointed out planetary aspects no one had ever explained to me before. My Yellow Sapphire arrived consecrated and radiant.',
    name: 'Mira Shah',
    location: 'London',
    stone: 'Pukhraj · Ceylon Yellow Sapphire',
    category: 'focus',
    rating: 5,
  },
  {
    quote: 'Beautifully crafted gold bezel, deeply considered gemstone selection. Astro Laabh is in a league of its own for luxury spiritual fine jewellery.',
    name: 'Ishita Rao',
    location: 'Bangalore',
    stone: 'Heera · Natural Diamond',
    category: 'peace',
    rating: 5,
  },
  {
    quote: 'The South Sea Pearl brought a wonderful sense of emotional serenity during a demanding career transition. Truly exceptional guidance.',
    name: 'Amelia Grant',
    location: 'Sydney',
    stone: 'Moti · Natural Basra Pearl',
    category: 'peace',
    rating: 5,
  },
  {
    quote: 'Astrolaabh made the entire consultation feel serene and wonderfully considered. The certificate of origin and energy consecration are authentic.',
    name: 'Devika Sethi',
    location: 'Singapore',
    stone: 'Panna · Colombian Emerald',
    category: 'wealth',
    rating: 5,
  },
  {
    quote: 'The most beautiful balance of ancient Vedic astrological precision and modern, understated jewellery design. I receive compliments constantly.',
    name: 'Rhea Malhotra',
    location: 'Jaipur',
    stone: 'Manik · Old Mine Ruby',
    category: 'focus',
    rating: 5,
  },
  {
    quote: 'From the private kundali reading to the final handcrafted gold ring, the experience was transcendent. Highly recommended for authentic seekers.',
    name: 'Noor Ahmed',
    location: 'Doha',
    stone: 'Neelam · Kashmir Sapphire',
    category: 'peace',
    rating: 5,
  },
  {
    quote: 'I received a piece that feels timeless, distinctive and truly mine. Wearing my consecrated Yellow Sapphire has been an anchor of good fortune.',
    name: 'Clara Bennett',
    location: 'New York',
    stone: 'Pukhraj · Untreated Sapphire',
    category: 'wealth',
    rating: 5,
  },
  {
    quote: 'Their understanding of planetary alignment and sacred craftsmanship is reflected in every angle of the cut. Simply peerless quality.',
    name: 'Tara Iyer',
    location: 'Chennai',
    stone: 'Moonga · Red Coral',
    category: 'focus',
    rating: 5,
  },
  {
    quote: 'Quiet luxury, sincere astrologer guidance, and an authentic unheated gemstone that will stay in my family for generations.',
    name: 'Elena Rossi',
    location: 'Milan',
    stone: 'Moti · Natural Pearl',
    category: 'peace',
    rating: 5,
  },
];

const categories = [
  { id: 'all', label: 'All Testimonials' },
  { id: 'wealth', label: 'Wealth & Prosperity' },
  { id: 'focus', label: 'Clarity & Discipline' },
  { id: 'peace', label: 'Peace & Serenity' },
] as const;

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'wealth' | 'focus' | 'peace'>('all');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      rootMargin: '120px 0px',
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const filteredReviews = useMemo(() => {
    if (activeCategory === 'all') return allReviews;
    return allReviews.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  const row1 = useMemo(() => {
    const list = filteredReviews.slice(0, Math.ceil(filteredReviews.length / 2));
    return list.length < 4 ? [...list, ...list, ...list] : [...list, ...list];
  }, [filteredReviews]);

  const row2 = useMemo(() => {
    const list = filteredReviews.slice(Math.ceil(filteredReviews.length / 2));
    return list.length < 4 ? [...list, ...list, ...list] : [...list, ...list];
  }, [filteredReviews]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`testimonials-section${isInView ? ' is-visible' : ''}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="testimonials-ambient-glow" aria-hidden="true" />

      <header className="testimonials-heading">
        <p className="testimonials-eyebrow">
          <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-[#B8860B]" />
          VOICES OF ASTROLAABH
          <Sparkles className="w-3.5 h-3.5 inline ml-1.5 text-[#B8860B]" />
        </p>
        <h2 id="testimonials-heading">What People Are Saying</h2>
        <span className="testimonials-subheading">
          Real experiences from patrons who discovered their authentic planetary gemstone through our Vedic consultations.
        </span>

        {/* Interactive Category Filter Pills */}
        <div className="testimonials-filter-bar" role="tablist" aria-label="Review categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`testimonials-filter-pill ${activeCategory === cat.id ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat.id as any)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <div className="testimonial-rows">
        {/* Row 1: Marquee Right to Left */}
        <div className="testimonial-marquee" aria-label="Client reviews row 1">
          <div className="testimonial-marquee-track testimonial-marquee-left">
            {row1.map((review, i) => (
              <article
                key={`r1-${review.name}-${i}`}
                className="testimonial-luxury-card"
              >
                <div className="testimonial-card-header">
                  <div className="testimonial-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(review.rating)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="testimonial-verified-badge">
                    <ShieldCheck className="w-3 h-3 text-[#B8860B]" />
                    Verified Patron
                  </span>
                </div>

                <p className="testimonial-quote">“{review.quote}”</p>

                <div className="testimonial-stone-tag">
                  <span>✦ {review.stone}</span>
                </div>

                <div className="testimonial-person">
                  <div className="testimonial-avatar" aria-hidden="true">
                    {review.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3>{review.name}</h3>
                    <p>{review.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Row 2: Marquee Left to Right */}
        <div className="testimonial-marquee" aria-label="Client reviews row 2">
          <div className="testimonial-marquee-track testimonial-marquee-right">
            {row2.map((review, i) => (
              <article
                key={`r2-${review.name}-${i}`}
                className="testimonial-luxury-card"
              >
                <div className="testimonial-card-header">
                  <div className="testimonial-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(review.rating)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="testimonial-verified-badge">
                    <ShieldCheck className="w-3 h-3 text-[#B8860B]" />
                    Verified Patron
                  </span>
                </div>

                <p className="testimonial-quote">“{review.quote}”</p>

                <div className="testimonial-stone-tag">
                  <span>✦ {review.stone}</span>
                </div>

                <div className="testimonial-person">
                  <div className="testimonial-avatar" aria-hidden="true">
                    {review.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3>{review.name}</h3>
                    <p>{review.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
