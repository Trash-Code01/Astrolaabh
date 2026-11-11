import blueSapphire from '../assets/sapphire.webp';
import diamond from '../assets/diamond.webp';
import emerald from '../assets/emerald.webp';
import pearl from '../assets/pearl.webp';
import ruby from '../assets/ruby.webp';
import yellowSapphire from '../assets/gold.webp';
import redCoral from '../assets/moonga.webp';
import hessonite from '../assets/gomed.webp';
import catsEye from '../assets/lehsunia.webp';

export interface Gemstone {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  description: string;
  origin: string;
  planet: string;
  benefits: [string, string, string, string];
  price: string;
  image: string;
  orbitImage: string;
}

export const gemstones: Gemstone[] = [
  {
    id: 'ruby',
    name: 'Ruby',
    hindiName: 'माणिक · Manik',
    tagline: 'The Gem of Vitality',
    description: 'A powerful gemstone of the Sun, Ruby awakens leadership, confidence and life force, helping you shine with clarity and purpose.',
    origin: 'Burma, Mozambique',
    planet: 'Sun (Surya)',
    benefits: ['Leadership', 'Recognition', 'Decisiveness', 'Vitality'],
    price: '₹18,000',
    image: ruby,
    orbitImage: ruby,
  },
  {
    id: 'blue-sapphire',
    name: 'Blue Sapphire',
    hindiName: 'नीलम · Neelam',
    tagline: 'The Gem of Discipline',
    description: 'Traditionally associated with Saturn, Blue Sapphire represents discipline, focus and protection through life’s changes.',
    origin: 'Sri Lanka, Kashmir, Burma',
    planet: 'Saturn (Shani)',
    benefits: ['Discipline', 'Good fortune', 'New openings', 'Protection'],
    price: '₹22,000',
    image: blueSapphire,
    orbitImage: blueSapphire,
  },
  {
    id: 'emerald',
    name: 'Emerald',
    hindiName: 'पन्ना · Panna',
    tagline: 'The Gem of Clarity',
    description: 'Linked with Mercury, Emerald is treasured for its association with intellect, communication and creative expression.',
    origin: 'Zambia, Colombia',
    planet: 'Mercury (Budh)',
    benefits: ['Intellect', 'Communication', 'Creativity', 'Business'],
    price: '₹16,000',
    image: emerald,
    orbitImage: emerald,
  },
  {
    id: 'yellow-sapphire',
    name: 'Yellow Sapphire',
    hindiName: 'पुखराज · Pukhraj',
    tagline: 'The Gem of Prosperity',
    description: 'A golden stone associated with Jupiter, Yellow Sapphire is traditionally linked with wisdom, prosperity and meaningful growth.',
    origin: 'Ceylon (Sri Lanka)',
    planet: 'Jupiter (Guru)',
    benefits: ['Prosperity', 'Wisdom', 'Career growth', 'Marriage'],
    price: '₹14,000',
    image: yellowSapphire,
    orbitImage: yellowSapphire,
  },
  {
    id: 'pearl',
    name: 'Pearl',
    hindiName: 'मोती · Moti',
    tagline: 'The Gem of Serenity',
    description: 'With its soft lustre, Pearl is traditionally associated with the Moon and a sense of calm, balance and clarity.',
    origin: 'Japan, South Sea',
    planet: 'Moon (Chandra)',
    benefits: ['Calm', 'Emotional balance', 'Sleep', 'Clarity'],
    price: '₹6,000',
    image: pearl,
    orbitImage: pearl,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    hindiName: 'हीरा · Heera',
    tagline: 'The Gem of Refinement',
    description: 'Traditionally associated with Venus, Diamond is treasured for its brilliance and its symbolism of love, harmony and refinement.',
    origin: 'Origin varies by stone',
    planet: 'Venus (Shukra)',
    benefits: ['Love', 'Harmony', 'Beauty', 'Refinement'],
    price: 'Price on request',
    image: diamond,
    orbitImage: diamond,
  },
  {
    id: 'red-coral', name: 'Red Coral', hindiName: 'मूंगा · Moonga', tagline: 'The Gem of Courage',
    description: 'Traditionally associated with Mars, Red Coral is valued for its warm vermilion colour and symbolism of courage, resolve and vitality.',
    origin: 'Origin varies by stone', planet: 'Mars (Mangal)', benefits: ['Courage', 'Resolve', 'Energy', 'Confidence'],
    price: 'Price on request', image: redCoral, orbitImage: redCoral,
  },
  {
    id: 'hessonite', name: 'Hessonite', hindiName: 'गोमेद · Gomed', tagline: 'The Gem of Perspective',
    description: 'A honey-toned garnet traditionally associated with Rahu, Hessonite represents perspective, grounding and a considered approach to change.',
    origin: 'Origin varies by stone', planet: 'Rahu', benefits: ['Perspective', 'Grounding', 'Focus', 'Clarity'],
    price: 'Price on request', image: hessonite, orbitImage: hessonite,
  },
  {
    id: 'cats-eye', name: "Cat's Eye", hindiName: 'लहसुनिया · Lehsunia', tagline: 'The Gem of Insight',
    description: 'Known for its luminous moving band of light, chrysoberyl Cat’s Eye is traditionally associated with Ketu and the symbolism of insight and reflection.',
    origin: 'Origin varies by stone', planet: 'Ketu', benefits: ['Insight', 'Reflection', 'Awareness', 'Focus'],
    price: 'Price on request', image: catsEye, orbitImage: catsEye,
  },
];
