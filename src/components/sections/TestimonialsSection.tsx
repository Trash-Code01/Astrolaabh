const firstRow = [
  { quote: 'The gemstone felt deeply personal — beautifully chosen and presented with quiet confidence.', name: 'Ananya Mehta', location: 'Mumbai', color: 'sage' },
  { quote: 'Every detail felt thoughtful. My consultation was elegant, calm and genuinely insightful.', name: 'Leena Kapoor', location: 'Delhi', color: 'ivory' },
  { quote: 'A meaningful piece that I now wear every day, chosen with care and true understanding.', name: 'Sara Rahman', location: 'Dubai', color: 'rose' },
  { quote: 'The guidance was warm, refined and completely aligned with what I was seeking.', name: 'Mira Shah', location: 'London', color: 'sage' },
  { quote: 'Beautifully crafted, deeply considered and unlike any jewellery experience I have known.', name: 'Ishita Rao', location: 'Bangalore', color: 'ivory' },
  { quote: 'My gemstone carries both elegance and intention. I treasure it beyond measure.', name: 'Amelia Grant', location: 'Sydney', color: 'rose' },
];

const secondRow = [
  { quote: 'Astrolaabh made the entire process feel personal, serene and wonderfully considered.', name: 'Devika Sethi', location: 'Singapore', color: 'ivory' },
  { quote: 'The most beautiful balance of ancient wisdom and modern, understated design.', name: 'Rhea Malhotra', location: 'Jaipur', color: 'rose' },
  { quote: 'From the consultation to the final piece, the experience was exceptional in every way.', name: 'Noor Ahmed', location: 'Doha', color: 'sage' },
  { quote: 'I received a piece that feels timeless, distinctive and truly mine.', name: 'Clara Bennett', location: 'New York', color: 'ivory' },
  { quote: 'Their understanding of meaning and beauty is reflected in every detail.', name: 'Tara Iyer', location: 'Chennai', color: 'rose' },
  { quote: 'Quiet luxury, sincere guidance and a gemstone I will cherish for years.', name: 'Elena Rossi', location: 'Milan', color: 'sage' },
];

function MarqueeRow({ reviews, direction }: { reviews: typeof firstRow; direction: 'left' | 'right' }) {
  const cards = (
    <div className="testimonial-marquee-set">
      {reviews.map((review) => (
        <article className={`testimonial-card testimonial-card-${review.color}`} key={review.name}>
          <p className="testimonial-quote">“{review.quote}”</p>
          <div className="testimonial-person">
            <div className="testimonial-avatar" aria-hidden="true" />
            <div>
              <h3>{review.name}</h3>
              <p>{review.location}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="testimonial-marquee" aria-label="Client testimonials">
      <div className={`testimonial-marquee-track testimonial-marquee-${direction}`}>
        {cards}
        {cards}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="testimonials-section" aria-labelledby="testimonials-heading">
      <header className="testimonials-heading">
        <p>Client Stories</p>
        <h2 id="testimonials-heading">What people are saying?</h2>
        <span>Real experiences from people who found their stone with Astro Laabh.</span>
      </header>

      <div className="testimonial-rows">
        <MarqueeRow reviews={firstRow} direction="right" />
        <MarqueeRow reviews={secondRow} direction="left" />
      </div>
    </section>
  );
}

export default TestimonialsSection;
