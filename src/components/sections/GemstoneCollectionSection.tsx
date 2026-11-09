import { gemstones as gemstoneData, type Gemstone } from '../../lib/gemstones';

const gemstones = [
  gemstoneData[3],
  gemstoneData[1],
  gemstoneData[0],
  gemstoneData[2],
  gemstoneData[3],
  gemstoneData[1],
  gemstoneData[0],
  gemstoneData[2],
  gemstoneData[3],
];

function GemstoneCard({ gemstone }: { gemstone: Gemstone }) {
  return (
    <article className="collection-card">
      <div className="collection-card-image">
        <img src={gemstone.image} alt={gemstone.name} loading="lazy" decoding="async" />
        <span aria-hidden="true" />
      </div>
      <div className="collection-card-content">
        <header className="collection-card-heading">
          <h3>{gemstone.name}</h3>
          <p>{gemstone.hindiName}</p>
        </header>

        <dl className="collection-card-meta">
          <div><dt>Origin</dt><dd>{gemstone.origin}</dd></div>
          <div><dt>Planet</dt><dd>{gemstone.planet}</dd></div>
        </dl>

        <div className="collection-card-benefits">
          <h4>Worn for</h4>
          <ul>
            {gemstone.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </div>

        <div className="collection-card-footer">
          <p><span>from</span> <strong>{gemstone.price}</strong></p>
          <a
            href="#gemstone-showcase"
            aria-label={`View ${gemstone.name}`}
            onClick={() => window.dispatchEvent(new CustomEvent<string>('astrolaabh:select-gemstone', { detail: gemstone.id }))}
          >
            View <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function GemstoneCollectionSection() {
  return (
    <section id="gemstone-collection" className="gemstone-collection" aria-labelledby="gemstone-collection-heading">
      <header className="collection-heading">
        <p className="collection-eyebrow">Graha Ratna · The Nine</p>
        <h2 id="gemstone-collection-heading">What Each Stone Is Worn For</h2>
        <p className="collection-description">
          Nine sacred gemstones, nine planetary energies.
          <span>Discover their origin, ruling planet, and the unique benefits they bring.</span>
        </p>
        <div className="collection-divider" aria-hidden="true"><span /><i /><span /></div>
      </header>

      <div className="collection-grid">
        {gemstones.map((gemstone, index) => <GemstoneCard gemstone={gemstone} key={`${gemstone.name}-${index}`} />)}
      </div>

      <a className="collection-all-link" href="#appointment">View all stones <span aria-hidden="true">→</span></a>
    </section>
  );
}

export default GemstoneCollectionSection;
