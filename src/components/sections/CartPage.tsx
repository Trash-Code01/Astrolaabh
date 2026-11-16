import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import { Navbar } from '../dom/layout/Navbar';
import { Footer } from '../dom/layout/Footer';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/utils';
import { getJewelryAsset } from '../../lib/jewelryAssets';
import { navigateToCheckout } from '../../lib/navigation';

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const quantity = items.reduce((count, item) => count + item.quantity, 0);
  const currency = items[0]?.product.currency ?? 'INR';

  return (
    <div className="brand-shopping min-h-screen bg-sand text-ink">
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-80px)] max-w-[1240px] px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        <a href="/#gemstone-collection" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[.15em] text-subdued transition hover:text-ink"><ArrowLeft size={14} /> Continue exploring</a>
        <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-b border-pearl pb-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[.22em] text-subdued">Your selection, gathered</p>
            <h1 className="mt-2 font-sans text-5xl font-normal tracking-[-.045em] sm:text-6xl">Your bag<span className="ml-3 align-middle font-sans text-sm tracking-normal text-subdued">({quantity})</span></h1>
          </div>
          <span className="mb-2 flex items-center gap-2 font-sans text-[9px] uppercase tracking-[.16em] text-subdued"><ShieldCheck size={15} className="text-subdued" /> Hand-finished to order</span>
        </div>

        {items.length === 0 ? (
          <section className="mx-auto flex max-w-xl flex-col items-center py-24 text-center sm:py-32">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-pearl bg-sand text-subdued"><ShoppingBag size={24} /></span>
            <p className="mt-7 font-sans text-[10px] uppercase tracking-[.22em] text-subdued">A little space for something meaningful</p>
            <h2 className="mt-3 font-sans text-3xl sm:text-4xl">Your bag is waiting for a stone.</h2>
            <p className="mt-3 max-w-md font-sans leading-7 text-subdued">Explore the Navaratna collection, choose your metal and form, and your piece will be gathered here.</p>
            <a href="/#gemstone-collection" className="mt-7 inline-flex h-12 items-center gap-3 bg-ink px-6 font-sans text-[10px] uppercase tracking-[.15em] text-mist transition hover:bg-ink">Explore gemstones <ArrowRight size={15} /></a>
          </section>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
            <section aria-label="Items in your bag" className="divide-y divide-pearl border-y border-pearl">
              {items.map(({ product, selectedColor, quantity: itemQuantity }) => {
                const jewelryStyle: CSSProperties = product.gemstoneId && product.metalId && product.jewelryForm
                  ? getJewelryAsset(product.gemstoneId, product.metalId, product.jewelryForm)
                  : { background: `radial-gradient(circle at 35% 30%, #fff9df, ${selectedColor.hex} 50%, #9a7740)` };
                return (
                  <article key={`${product.id}-${selectedColor.id}`} className="grid gap-5 py-6 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-center sm:gap-7 sm:py-8">
                    <div className="relative aspect-square overflow-hidden border border-pearl bg-mist">
                      <div aria-label={`${product.name} preview`} role="img" className="absolute inset-0 bg-center bg-no-repeat transition-transform duration-500 hover:scale-105" style={jewelryStyle} />
                      <span className="absolute bottom-2 left-2 bg-mist/90 px-2 py-1 font-sans text-[8px] uppercase tracking-[.12em] text-subdued">Made to order</span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-sans text-[9px] uppercase tracking-[.16em] text-subdued">{product.edition}</p>
                      <h2 className="mt-2 font-sans text-2xl sm:text-3xl">{product.name}</h2>
                      <p className="mt-1 font-sans text-sm text-subdued">{selectedColor.name}</p>
                      <p className="mt-4 max-w-lg font-sans text-sm leading-6 text-subdued">{product.description}</p>
                      <button onClick={() => removeItem(product.id, selectedColor.id)} className="mt-4 inline-flex items-center gap-2 font-sans text-[9px] uppercase tracking-[.13em] text-subdued transition hover:text-subdued"><Trash2 size={13} /> Remove</button>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                      <div className="flex h-9 items-center border border-pearl">
                        <button aria-label={`Decrease quantity of ${product.name}`} onClick={() => updateQuantity(product.id, selectedColor.id, -1)} className="grid h-9 w-9 place-items-center text-subdued transition hover:bg-sand"><Minus size={13} /></button>
                        <span className="w-8 text-center font-sans text-xs">{itemQuantity}</span>
                        <button aria-label={`Increase quantity of ${product.name}`} onClick={() => updateQuantity(product.id, selectedColor.id, 1)} className="grid h-9 w-9 place-items-center text-subdued transition hover:bg-sand"><Plus size={13} /></button>
                      </div>
                      <strong className="font-sans text-lg font-normal">{formatPrice(product.price * itemQuantity, product.currency)}</strong>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit border border-pearl bg-white p-5 sm:p-7 lg:sticky lg:top-28">
              <p className="font-sans text-[9px] uppercase tracking-[.2em] text-subdued">A considered order</p>
              <h2 className="mt-2 font-sans text-2xl">Order summary</h2>
              <div className="mt-6 space-y-4 border-y border-pearl py-5 font-sans text-xs text-subdued">
                <div className="flex justify-between"><span>Pieces</span><span>{quantity}</span></div>
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span></div>
                <div className="flex justify-between"><span>Insured delivery</span><span className="text-subdued">Complimentary</span></div>
                <div className="flex justify-between border-t border-pearl pt-4 text-sm font-semibold text-ink"><span>Total</span><span>{formatPrice(subtotal, currency)}</span></div>
              </div>
              <button onClick={navigateToCheckout} className="mt-6 flex h-12 w-full items-center justify-center gap-3 bg-ink px-5 font-sans text-[10px] uppercase tracking-[.17em] text-mist transition hover:bg-ink">Buy now <ArrowRight size={15} /></button>
              <p className="mt-4 flex items-start gap-2 font-sans text-xs leading-5 text-subdued"><Sparkles size={14} className="mt-0.5 shrink-0 text-subdued" /> A gemstone specialist will confirm your piece and delivery before payment.</p>
            </aside>
          </div>
        )}
      </main>
      <Footer productPage />
    </div>
  );
}

export default CartPage;
