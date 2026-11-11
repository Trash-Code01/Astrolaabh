type Review = {
  quote: string;
  name: string;
  location: string;
  image: string;
};

const reviews = [
  {
    quote: 'The stone feels deeply personal. From the consultation to the final piece, everything felt thoughtful and beautifully considered.',
    name: 'Ananya Mehta',
    location: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'I loved how intentional the entire experience felt. The gemstone was beautifully chosen and presented with such quiet elegance.',
    name: 'Rhea Malhotra',
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'The consultation gave me clarity without ever feeling overwhelming. My gemstone now feels like something truly meaningful to wear.',
    name: 'Aarav Sharma',
    location: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'Beautiful craftsmanship, thoughtful guidance and a gemstone that feels completely my own. The experience was exceptional.',
    name: 'Meera Kapoor',
    location: 'Pune',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'Everything from the selection to the final presentation felt refined and personal. It was much more than simply buying a gemstone.',
    name: 'Sara Rahman',
    location: 'Dubai',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'The meaning behind my stone made the experience special. I wear it every day and it feels like a quiet reminder of my intention.',
    name: 'Ishita Verma',
    location: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'The entire process was calm, elegant and incredibly personal. I finally found a gemstone that felt right for me.',
    name: 'Noor Ahmed',
    location: 'Doha',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'A timeless piece with a beautiful story behind it. The attention to detail is visible in every part of the experience.',
    name: 'Clara Bennett',
    location: 'New York',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="testimonial-card">
      <span className="testimonial-detail" aria-hidden="true">✦</span>
      <p className="testimonial-quote">“{review.quote}”</p>
      <div className="testimonial-person">
        <img
          className="testimonial-avatar"
          src={review.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div>
          <h3>{review.name}</h3>
          <p>{review.location}</p>
        </div>
      </div>
    </article>
  );
}

function ReviewTrack({ items, direction }: { items: Review[]; direction: 'down' | 'up' }) {
  return (
    <div className={`testimonial-track-window testimonial-track-${direction}`}>
      <div className="testimonial-track">
        {[0, 1].map((copy) => (
          <div className="testimonial-track-set" key={copy} aria-hidden={copy === 1}>
            {items.map((review) => <ReviewCard review={review} key={review.name} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="testimonials-section" aria-labelledby="testimonials-heading">
      <div className="testimonials-editorial-layout">
        <div className="testimonial-lane testimonial-lane-left" aria-label="Client reviews">
          <ReviewTrack items={reviews.slice(0, 4)} direction="down" />
        </div>

        <header className="testimonials-heading">
          <p><span aria-hidden="true" />Client Stories<span aria-hidden="true" /></p>
          <h2 id="testimonials-heading">What people are saying</h2>
          <span>Real experiences from people who found their stone with Astro Laabh.</span>
          <div className="testimonial-heading-mark" aria-hidden="true"><i />✦<i /></div>
          <p className="testimonial-brand-mark">Astro Laabh · Fine Gemstones</p>
        </header>

        <div className="testimonial-lane testimonial-lane-right" aria-label="More client reviews">
          <ReviewTrack items={reviews.slice(4)} direction="up" />
        </div>

        <div className="testimonial-lane testimonial-lane-mobile" aria-label="Client reviews">
          <ReviewTrack items={reviews} direction="up" />
        </div>
      </div>
    </section>
  );
}
