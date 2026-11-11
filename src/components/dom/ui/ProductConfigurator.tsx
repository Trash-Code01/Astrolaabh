import { motion } from 'framer-motion';
import { Layers, RotateCcw, ShoppingBag } from 'lucide-react';
import { useCreativeStore } from '../../../store/useCreativeStore';
import { useCartStore } from '../../../store/useCartStore';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { FLAGSHIP_PRODUCT } from '../../../lib/constants';
import { formatPrice } from '../../../lib/utils';
import confetti from 'canvas-confetti';
import { navigateToCart } from '../../../lib/navigation';

export function ProductConfigurator() {
  const activeColorway = useCreativeStore((s) => s.activeColorway);
  const setActiveColorway = useCreativeStore((s) => s.setActiveColorway);
  const explodedProgress = useCreativeStore((s) => s.explodedProgress);
  const setExplodedProgress = useCreativeStore((s) => s.setExplodedProgress);
  const isAutoRotating = useCreativeStore((s) => s.isAutoRotating);
  const setIsAutoRotating = useCreativeStore((s) => s.setIsAutoRotating);

  const addItem = useCartStore((s) => s.addItem);
  const { playHover, playClick, playColorSwitch, playCartAdd } = useSoundEffects();

  const handleColorSelect = (colorway: typeof activeColorway) => {
    playColorSwitch();
    setActiveColorway(colorway);
  };

  const handleToggleExploded = () => {
    playClick();
    setExplodedProgress(explodedProgress > 0.5 ? 0 : 1);
  };

  const handleAddToCart = () => {
    playCartAdd();
    addItem(FLAGSHIP_PRODUCT, activeColorway, 1);
    navigateToCart();

    // Subtle luxury particle burst
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 },
        colors: [activeColorway.hex, activeColorway.emissiveColor, '#ffffff'],
      });
    } catch {
      // Ignored
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl"
    >
      <div className="glass-panel p-2.5 sm:p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl shadow-black/80">
        {/* Left: Colorway Picker */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            {FLAGSHIP_PRODUCT.colorways.map((cw) => {
              const isActive = activeColorway.id === cw.id;
              return (
                <button
                  key={cw.id}
                  onClick={() => handleColorSelect(cw)}
                  onMouseEnter={playHover}
                  className={`relative w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center ${
                    isActive ? 'scale-110 ring-2 ring-brand-accent shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: cw.hex }}
                  title={cw.name}
                >
                  {isActive && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cw.emissiveColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <span className="font-mono text-xs text-zinc-400 tracking-wider hidden md:inline">
            {activeColorway.name}
          </span>
        </div>

        {/* Center: Controls (Exploded View & Rotation) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={handleToggleExploded}
            onMouseEnter={playHover}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              explodedProgress > 0.5
                ? 'bg-brand-accent text-black font-semibold shadow-[0_0_15px_#00f0ff]'
                : 'glass-pill text-zinc-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="tracking-wide">
              {explodedProgress > 0.5 ? 'ASSEMBLE' : 'EXPLODED VIEW'}
            </span>
          </button>

          <button
            onClick={() => {
              playClick();
              setIsAutoRotating(!isAutoRotating);
            }}
            onMouseEnter={playHover}
            className={`p-2 rounded-xl transition-all ${
              isAutoRotating ? 'glass-pill text-brand-accent' : 'glass-pill text-zinc-500'
            }`}
            title="Toggle Continuous Rotation"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>

        {/* Right: Quick Buy Button */}
        <button
          onClick={handleAddToCart}
          onMouseEnter={playHover}
          className="w-full sm:w-auto bg-white text-black hover:bg-brand-accent transition-all duration-300 font-mono text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg tracking-wider"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ORDER // {formatPrice(FLAGSHIP_PRODUCT.price)}</span>
        </button>
      </div>
    </motion.div>
  );
}
