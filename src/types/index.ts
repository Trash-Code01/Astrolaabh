export interface Colorway {
  id: string;
  name: string;
  hex: string;
  finish: 'matte' | 'gloss' | 'metallic' | 'iridescent';
  roughness: number;
  metalness: number;
  emissiveColor: string;
}

export interface ProductSpec {
  label: string;
  value: string;
  detail: string;
}

export interface Product {
  id: string;
  name: string;
  edition: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  colorways: Colorway[];
  specs: ProductSpec[];
  features: string[];
  gemstoneId?: string;
  metalId?: string;
  jewelryForm?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: Colorway;
  quantity: number;
}

export type SceneSection = 'hero' | 'narrative' | 'craftsmanship' | 'specs' | 'cta';

export interface CameraWaypoint {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
