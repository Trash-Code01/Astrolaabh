import model1 from '../../assets/model1.webp';
import model2 from '../../assets/model2.webp';
import model3 from '../../assets/model3.webp';
import model4 from '../../assets/model4.webp';
import ruby from '../../assets/ruby.webp';
import sapphire from '../../assets/sapphire.webp';
import diamond from '../../assets/diamond.webp';
import gold from '../../assets/gold.webp';

export function GallerySection() {
  return (
    <section id="gallery" className="gemstone-gallery" aria-label="Gemstone editorial gallery">
      <div className="gemstone-lookbook" aria-label="The gemstone collection">
        <header className="lookbook-heading">
          <p>THE GEMSTONE COLLECTION</p>
          <h2>Precious by Nature</h2>
        </header>
        <div className="lookbook-composition">
          <figure className="lookbook-image lookbook-image-main">
            <img src={model3} alt="Editorial gemstone portrait" loading="lazy" decoding="async" />
            <figcaption>DISCOVER YOUR STONE<i aria-hidden="true" /></figcaption>
          </figure>
          <figure className="lookbook-image lookbook-image-top">
            <img src={model1} alt="Model wearing a gemstone ring" loading="lazy" decoding="async" />
            <figcaption>CRAFTED WITH MEANING<i aria-hidden="true" /></figcaption>
          </figure>
          <div className="lookbook-story">
            <span>01</span>
            <p>Chosen for beauty, energy and lasting meaning.</p>
          </div>
          <figure className="lookbook-image lookbook-image-bottom">
            <img src={model4} alt="Fine gemstone editorial portrait" loading="lazy" decoding="async" />
          </figure>
        </div>
      </div>
      <div className="gallery-panels">
        <figure className="gallery-panel gallery-panel-left">
          <img src={model1} alt="Model wearing an emerald gemstone" loading="lazy" decoding="async" />
          <figcaption>
            <span>DISCOVER</span>
            <span>YOUR STONE</span>
            <i aria-hidden="true" />
          </figcaption>
        </figure>
        <figure className="gallery-panel gallery-panel-right">
          <img src={model2} alt="Emerald gemstone in nature" loading="lazy" decoding="async" />
          <figcaption>
            <span>FIND YOUR</span>
            <span>ALIGNMENT</span>
            <i aria-hidden="true" />
          </figcaption>
        </figure>
      </div>

      <div className="gemstone-story">
        <div className="gemstone-story-heading">
          <i aria-hidden="true" />
          <div>
            <h2>EXPLORE THE WORLD OF GEMSTONES</h2>
            <p>Stories, stones and traditions behind every recommendation.</p>
          </div>
          <i aria-hidden="true" />
        </div>
        <div className="gemstone-strip" aria-label="Featured gemstones">
          <div><img src={ruby} alt="Ruby gemstone" /></div>
          <div><img src={sapphire} alt="Sapphire gemstone" /></div>
          <div><img src={diamond} alt="Diamond gemstone" /></div>
          <div><img src={gold} alt="Gold gemstone" /></div>
        </div>
      </div>
    </section>
  );
}
