import m1 from '../../assets/m1.png';
import m2 from '../../assets/m2.png';
import m3 from '../../assets/m3.png';
import m4 from '../../assets/m4.png';
import j1 from '../../assets/j1.png';
import j2 from '../../assets/j2.png';
import j3 from '../../assets/j3.png';
import j4 from '../../assets/j4.png';

const featuredImages = [
  { image: m1, alt: 'Emerald and diamond earrings', label: 'Earrings' },
  { image: m2, alt: 'Ruby and gold necklace', label: 'Necklaces' },
  { image: m3, alt: 'Blue sapphire and diamond ring', label: 'Rings' },
  { image: m4, alt: 'Yellow sapphire and gold bracelet', label: 'Bracelets' },
];

const jewelleryPieces = [
  { image: j1, alt: 'Pearl and gold earrings', name: 'Earrings', detail: 'Pearl · Gold' },
  { image: j2, alt: 'Ruby and gold ring', name: 'Ring', detail: 'Ruby · Gold' },
  { image: j3, alt: 'Blue sapphire necklace', name: 'Necklace', detail: 'Blue Sapphire · Gold' },
  { image: j4, alt: 'Emerald and gold bracelet', name: 'Bracelet', detail: 'Emerald · Gold' },
];

export function GallerySection() {
  return (
    <section id="gallery" className="gemstone-gallery" aria-labelledby="gallery-heading">
      <header className="gallery-heading">
        <p>CAN YOU WEAR</p>
        <h2 id="gallery-heading">Gemstones?</h2>
        <span>Yes. Gemstones can be worn in many beautiful and meaningful ways.</span>
      </header>

      <div className="gallery-featured-grid">
        {featuredImages.map((item) => (
          <a className="gallery-featured-item" href="#gemstone-collection" aria-label={`Explore ${item.label}`} key={item.label}>
            <div className="gallery-featured-image">
              <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
              <span className="gallery-featured-copy">
                <span className="gallery-featured-label">{item.label}</span>
                <span className="gallery-featured-action">Explore <span aria-hidden="true">→</span></span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <section className="gallery-featured-styles" aria-labelledby="gallery-featured-heading">
        <header className="gallery-featured-heading">
          <h3 id="gallery-featured-heading">Featured Styles</h3>
          <a href="#gemstone-collection">View All <span aria-hidden="true">→</span></a>
        </header>
        <div className="gallery-jewellery-grid" aria-label="Featured jewellery">
          {jewelleryPieces.map((piece) => (
            <article className="gallery-jewellery-item" key={piece.name}>
              <div className="gallery-jewellery-image">
                <img src={piece.image} alt={piece.alt} loading="lazy" decoding="async" />
              </div>
              <h4>{piece.name}</h4>
              <p>{piece.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default GallerySection;
