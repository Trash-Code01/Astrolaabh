import { FLAGSHIP_PRODUCT } from './constants';
import type { Gemstone } from './gemstones';

export const settingForms = ['Ring', 'Necklace', 'Bracelet'] as const;
export type SettingForm = typeof settingForms[number];
export const forms: string[] = ['Loose stone', ...settingForms];
export const metals = [
  { id: 'yellow-gold', name: '18k Yellow gold', short: '18K GOLD', color: '#d6ad58' },
  { id: 'silver', name: '925 Sterling silver', short: '925 SILVER', color: '#aeb8c0' },
];

export function configuredGemstone(gemstone: Gemstone, selectedMetal: (typeof metals)[number], form: string) {
  const colorway = {
    id: selectedMetal.id,
    name: `${selectedMetal.name} · ${form}`,
    hex: selectedMetal.color,
    finish: 'metallic' as const,
    roughness: 0.24,
    metalness: 0.88,
    emissiveColor: selectedMetal.color,
  };
  const price = Number(gemstone.price.replace(/[^0-9]/g, '')) || 0;
  const product = {
    ...FLAGSHIP_PRODUCT,
    id: `gemstone-${gemstone.id}-${selectedMetal.id}-${form.toLowerCase()}`,
    name: `${gemstone.name} · ${form}`,
    edition: 'HANDCRAFTED TO ORDER',
    tagline: gemstone.tagline,
    description: gemstone.description,
    price,
    currency: 'INR',
    colorways: [colorway],
    specs: [
      { label: 'GEMSTONE', value: gemstone.name, detail: gemstone.origin },
      { label: 'SETTING', value: form, detail: selectedMetal.name },
    ],
    features: gemstone.benefits,
    gemstoneId: gemstone.id,
    metalId: selectedMetal.id,
    jewelryForm: form,
  };

  return { product, colorway };
}
