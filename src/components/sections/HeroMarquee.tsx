const phrases = [
  'ASTROLOGY GUIDES THE CHOICE',
  'GEMOLOGY REVEALS THE STONE',
  'YOU DECIDE HOW TO WEAR IT',
];

export function HeroMarquee() {
  // Repeat items 4 times to ensure seamless infinite looping on all screen sizes up to 4K
  const repeatedPhrases = [...phrases, ...phrases, ...phrases, ...phrases];

  const content = repeatedPhrases.map((phrase, index) => (
    <span className="hero-marquee-item" key={`${phrase}-${index}`}>
      <span className="hero-marquee-text">{phrase}</span>
      <span className="hero-marquee-star" aria-hidden="true">✦</span>
    </span>
  ));

  return (
    <div className="hero-marquee" aria-label="Astrolaabh philosophy">
      <div className="hero-marquee-track">{content}{content}</div>
    </div>
  );
}

export default HeroMarquee;
