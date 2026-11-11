import ruby from '../assets/optimized/jewelry/ruby-settings.webp';
import blueSapphire from '../assets/optimized/jewelry/blue-sapphire-settings.webp';
import emerald from '../assets/optimized/jewelry/emerald-settings.webp';
import pearl from '../assets/optimized/jewelry/pearl-settings.webp';
import diamond from '../assets/optimized/jewelry/diamond-settings.webp';
import redCoral from '../assets/optimized/jewelry/red-coral-settings.webp';
import hessonite from '../assets/optimized/jewelry/hessonite-settings.webp';
import catsEye from '../assets/optimized/jewelry/cats-eye-settings.webp';
import yellowGold from '../assets/optimized/yellow-sapphire-gold-jewelry.webp';
import yellowSilver from '../assets/optimized/yellow-sapphire-silver-jewelry.webp';

const sheets: Record<string, string> = {
  ruby, 'blue-sapphire': blueSapphire, emerald, pearl, diamond,
  'red-coral': redCoral, hessonite, 'cats-eye': catsEye,
};

/** Each new sheet has ring / necklace / bracelet columns, gold / silver rows. */
export function getJewelryAsset(gemstoneId: string, metalId: string, form: string) {
  const x = form === 'Necklace' ? '50%' : form === 'Bracelet' ? '100%' : '0%';
  if (gemstoneId === 'yellow-sapphire') {
    return { backgroundImage: `url(${metalId === 'silver' ? yellowSilver : yellowGold})`, backgroundPosition: `${x} 0%`, backgroundSize: '300% 100%' };
  }
  return { backgroundImage: `url(${sheets[gemstoneId]})`, backgroundPosition: `${x} ${metalId === 'silver' ? '100%' : '0%'}`, backgroundSize: '300% 200%' };
}
