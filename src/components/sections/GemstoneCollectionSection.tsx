import { gemstones as gemstoneData, type Gemstone } from '../../lib/gemstones';

const collectionEntries: Array<{
  id: Gemstone['id'];
  origin: string;
  planet: string;
  benefits: string[];
  price: string;
}> = [
  { id: 'yellow-sapphire', origin: 'Ceylon (Sri Lanka)', planet: 'Jupiter (Guru)', benefits: ['Prosperity', 'Wisdom', 'Career growth', 'Marriage'], price: '₹14,000' },
  { id: 'blue-sapphire', origin: 'Sri Lanka, Kashmir', planet: 'Saturn (Shani)', benefits: ['Discipline', 'Focus', 'Progress', 'Stability'], price: '₹22,000' },
  { id: 'ruby', origin: 'Burma, Mozambique', planet: 'Sun (Surya)', benefits: ['Leadership', 'Recognition', 'Decisiveness', 'Vitality'], price: '₹18,000' },
  { id: 'emerald', origin: 'Zambia, Colombia', planet: 'Mercury (Budh)', benefits: ['Intellect', 'Communication', 'Knowledge', 'Creativity'], price: '₹16,000' },
  { id: 'pearl', origin: 'Japan, South Sea', planet: 'Moon (Chandra)', benefits: ['Calmness', 'Emotional balance', 'Peace', 'Clarity'], price: '₹6,000' },
  { id: 'yellow-sapphire', origin: 'Ceylon (Sri Lanka)', planet: 'Jupiter (Guru)', benefits: ['Prosperity', 'Wisdom', 'Career growth', 'Marriage'], price: '₹14,000' },
  { id: 'blue-sapphire', origin: 'Sri Lanka, Kashmir', planet: 'Saturn (Shani)', benefits: ['Discipline', 'Focus', 'Progress', 'Stability'], price: '₹22,000' },
  { id: 'ruby', origin: 'Burma, Mozambique', planet: 'Sun (Surya)', benefits: ['Leadership', 'Recognition', 'Decisiveness', 'Vitality'], price: '₹18,000' },
  { id: 'emerald', origin: 'Zambia, Colombia', planet: 'Mercury (Budh)', benefits: ['Intellect', 'Communication', 'Knowledge', 'Creativity'], price: '₹16,000' },
];

const gemstonesById = new Map(gemstoneData.map((gemstone) => [gemstone.id, gemstone]));

function getGemstone(id: Gemstone['id']): Gemstone {
  const gemstone = gemstonesById.get(id);
  if (!gemstone) throw new Error(`Missing gemstone data for "${id}"`);
  return gemstone;
}

function GemstoneCard({ entry }: { entry: (typeof collectionEntries)[number] }) {
  const gemstone = getGemstone(entry.id);

  return (
    <article className="collection-card">
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
        <p><span>from</span> <strong>{entry.price}</strong></p>
        <a
          href="#gemstone-showcase"
          aria-label={`View ${gemstone.name}`}
          onClick={() => window.dispatchEvent(new CustomEvent<string>('astrolaabh:select-gemstone', { detail: gemstone.id }))}
        >
          View <span aria-hidden="true">→</span>
        </a>
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
