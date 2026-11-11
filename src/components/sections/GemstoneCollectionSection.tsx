import { gemstones as gemstoneData, type Gemstone } from '../../lib/gemstones';
import { navigateToProduct } from '../../lib/navigation';

const collectionOrder = ['yellow-sapphire', 'blue-sapphire', 'ruby', 'emerald', 'pearl', 'diamond', 'red-coral', 'hessonite', 'cats-eye'];
const collectionEntries = collectionOrder.map(id => gemstoneData.find(gem => gem.id === id)!);

const gemstonesById = new Map(gemstoneData.map((gemstone) => [gemstone.id, gemstone]));

function getGemstone(id: Gemstone['id']): Gemstone {
  const gemstone = gemstonesById.get(id);
  if (!gemstone) throw new Error(`Missing gemstone data for "${id}"`);
  return gemstone;
}

function GemstoneCard({ entry }: { entry: (typeof collectionEntries)[number] }) {
  const gemstone = getGemstone(entry.id);


  return (
    <article
      className="collection-card"
      role="link"
      tabIndex={0}
      aria-label={`Open ${gemstone.name} product page`}
      onClick={() => navigateToProduct(gemstone.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigateToProduct(gemstone.id);
        }
      }}
    >
      <img
        className="collection-card-image"
        src={gemstone.image}
        alt={gemstone.name}
        width="88"
        height="88"
        loading="lazy"
        decoding="async"
      />
      <header className="collection-card-heading">
        <h3>{gemstone.name}</h3>
        <p>{gemstone.hindiName}</p>
      </header>

      <dl className="collection-card-meta">
        <div><dt>Origin : </dt><dd>{entry.origin}</dd></div>
        <div><dt>Planet : </dt><dd>{entry.planet}</dd></div>
      </dl>

      <div className="collection-card-benefits">
        <h4>Worn for</h4>
        <ul>
          {entry.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
        </ul>
      </div>

      <div className="collection-card-footer">
        <p>{entry.price !== 'Price on request' && <span>from </span>}<strong>{entry.price}</strong></p>
        <span className="collection-card-view">
          View <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
}

export function GemstoneCollectionSection() {
  return (
    <section id="gemstone-collection" className="gemstone-collection" aria-labelledby="gemstone-collection-heading">
      <header className="collection-heading">
        <p className="collection-eyebrow">The Navaratna Collection</p>
        <h2 id="gemstone-collection-heading">What Each Stone <em>is Worn For.</em></h2>
        <p className="collection-description">
          Nine celestial gemstones, each with a unique energy, purpose and planetary connection.
          <span>Discover their meaning, benefits, origin and the aspects of life they support.</span>
        </p>
      </header>

      <div className="collection-grid">
        {collectionEntries.map((entry, index) => (
          <GemstoneCard entry={entry} key={`${entry.id}-${index}`} />
        ))}
      </div>

      <a className="collection-all-link" href="#appointment">
        <span aria-hidden="true" />
        <span className="collection-all-label">
          View All Stones <span className="collection-all-arrow" aria-hidden="true">→</span>
        </span>
        <span aria-hidden="true" />
      </a>
    </section>
  );
}

export default GemstoneCollectionSection;
