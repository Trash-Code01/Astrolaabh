import { create } from 'zustand';
import { Colorway, SceneSection } from '../types';
import { FLAGSHIP_PRODUCT } from '../lib/constants';

interface CreativeState {
  // Navigation & 3D camera
  currentSection: SceneSection;
  setCurrentSection: (section: SceneSection) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  // Product 3D Configuration
  activeColorway: Colorway;
  setActiveColorway: (colorway: Colorway) => void;
  explodedProgress: number; // 0 (assembled) to 1 (fully exploded view)
  setExplodedProgress: (progress: number) => void;
  isAutoRotating: boolean;
  setIsAutoRotating: (rotating: boolean) => void;

  // Sound & Audio
  isAudioMuted: boolean;
  toggleAudio: () => void;
  setIsAudioMuted: (muted: boolean) => void;

  // UI Interactive States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;

  // Custom Cursor
  cursorText: string;
  cursorVariant: 'default' | 'pointer' | 'drag' | 'view' | 'color';
  setCursorState: (text: string, variant?: 'default' | 'pointer' | 'drag' | 'view' | 'color') => void;
  resetCursor: () => void;

  // Preloader
  isLoading: boolean;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
  finishLoading: () => void;
}

export const useCreativeStore = create<CreativeState>((set) => ({
  currentSection: 'hero',
  setCurrentSection: (section) => set({ currentSection: section }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  activeColorway: FLAGSHIP_PRODUCT.colorways[0],
  setActiveColorway: (colorway) => set({ activeColorway: colorway }),
  explodedProgress: 0,
  setExplodedProgress: (progress) => set({ explodedProgress: progress }),
  isAutoRotating: true,
  setIsAutoRotating: (rotating) => set({ isAutoRotating: rotating }),

  isAudioMuted: true, // Default muted for browser autoplay policy compliance
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setIsAudioMuted: (muted) => set({ isAudioMuted: muted }),

  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  cursorText: '',
  cursorVariant: 'default',
  setCursorState: (text, variant = 'pointer') => set({ cursorText: text, cursorVariant: variant }),
  resetCursor: () => set({ cursorText: '', cursorVariant: 'default' }),

  isLoading: true,
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  finishLoading: () => set({ isLoading: false, loadingProgress: 100 }),
}));

(window as any).__creativeStore = useCreativeStore;
