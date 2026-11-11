import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCreativeStore } from '../../../store/useCreativeStore';
import { useCartStore } from '../../../store/useCartStore';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { formatPrice } from '../../../lib/utils';
import { navigateToCheckout } from '../../../lib/navigation';

export function CartDrawer() {
  const isCartOpen = useCreativeStore((s) => s.isCartOpen);
  const setIsCartOpen = useCreativeStore((s) => s.setIsCartOpen);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const { playClick, playHover } = useSoundEffects();

  const handleClose = () => {
    playClick();
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-card border-l border-white/10 z-[101] flex flex-col justify-between shadow-2xl p-6 sm:p-8"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <h3 className="font-display text-sm tracking-wider uppercase font-bold text-white">
                  BAG MANIFEST
                </h3>
                <span className="font-mono text-xs text-zinc-500">
                  [{items.reduce((acc, i) => acc + i.quantity, 0)}]
                </span>
              </div>
              <button
                onClick={handleClose}
                onMouseEnter={playHover}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
                  <Sparkles className="w-8 h-8 mb-3 text-zinc-600" />
                  <p className="font-mono text-sm tracking-widest uppercase">YOUR BAG IS EMPTY</p>
                  <p className="text-xs text-zinc-600 mt-1 max-w-[200px]">
                    Configure your bespoke edition in the 3D studio below.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor.id}`}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {/* Swatch preview */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 shadow-inner"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.selectedColor.emissiveColor }}
                        />
                      </div>

                      <div>
                        <h4 className="font-sans font-semibold text-sm text-white">
                          {item.product.name}
                        </h4>
                        <p className="font-mono text-xs text-brand-accent">
                          {item.selectedColor.name}
                        </p>
                        <p className="font-mono text-xs text-zinc-400 mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Qty & Remove */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center glass-pill rounded-lg overflow-hidden font-mono text-xs">
                        <button
                          onClick={() => {
                            playClick();
                            updateQuantity(item.product.id, item.selectedColor.id, -1);
                          }}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-white">{item.quantity}</span>
                        <button
                          onClick={() => {
                            playClick();
                            updateQuantity(item.product.id, item.selectedColor.id, 1);
                          }}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          playClick();
                          removeItem(item.product.id, item.selectedColor.id);
                        }}
                        className="text-zinc-500 hover:text-brand-neon transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-zinc-400">ESTIMATED TOTAL</span>
                <span className="font-bold text-white text-base">
                  {formatPrice(getSubtotal())}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                <span>INCLUDES INSURED AEROSPACE COURIER FREIGHT & 3YR WARRANTY</span>
              </div>

              <button
                disabled={items.length === 0}
                onClick={() => {
                  playClick();
                  if (items.length > 0) {
                    setIsCartOpen(false);
                    navigateToCheckout();
                  }
                }}
                className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  items.length === 0
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-brand-accent text-black hover:bg-white shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                }`}
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
