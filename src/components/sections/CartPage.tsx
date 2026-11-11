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
    <div className="min-h-screen bg-[#F7F3EA] text-[#292319]">
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-80px)] max-w-[1240px] px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        <a href="/#gemstone-collection" className="inline-flex items-center gap-2 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.15em] text-[#8d7958] transition hover:text-[#34251b]"><ArrowLeft size={14} /> Continue exploring</a>
        <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#dfd5c3] pb-6">
          <div>
            <p className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.22em] text-[#a77b35]">Your selection, gathered</p>
            <h1 className="mt-2 font-serif text-5xl font-normal tracking-[-.045em] sm:text-6xl">Your bag<span className="ml-3 align-middle font-['Outfit',sans-serif] text-sm tracking-normal text-[#95866f]">({quantity})</span></h1>
          </div>
          <span className="mb-2 flex items-center gap-2 font-['Outfit',sans-serif] text-[9px] uppercase tracking-[.16em] text-[#7f735e]"><ShieldCheck size={15} className="text-[#a77b35]" /> Hand-finished to order</span>
        </div>

        {items.length === 0 ? (
          <section className="mx-auto flex max-w-xl flex-col items-center py-24 text-center sm:py-32">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-[#dfd2b9] bg-[#f0e9db] text-[#a77b35]"><ShoppingBag size={24} /></span>
            <p className="mt-7 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.22em] text-[#a77b35]">A little space for something meaningful</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Your bag is waiting for a stone.</h2>
            <p className="mt-3 max-w-md font-serif leading-7 text-[#756a58]">Explore the Navaratna collection, choose your metal and form, and your piece will be gathered here.</p>
            <a href="/#gemstone-collection" className="mt-7 inline-flex h-12 items-center gap-3 bg-[#34251b] px-6 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.15em] text-[#fffaf0] transition hover:bg-[#4d3825]">Explore gemstones <ArrowRight size={15} /></a>
          </section>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
            <section aria-label="Items in your bag" className="divide-y divide-[#e3d9c7] border-y border-[#e3d9c7]">
              {items.map(({ product, selectedColor, quantity: itemQuantity }) => {
                const jewelryStyle: CSSProperties = product.gemstoneId && product.metalId && product.jewelryForm
                  ? getJewelryAsset(product.gemstoneId, product.metalId, product.jewelryForm)
                  : { background: `radial-gradient(circle at 35% 30%, #fff9df, ${selectedColor.hex} 50%, #9a7740)` };
                return (
                  <article key={`${product.id}-${selectedColor.id}`} className="grid gap-5 py-6 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-center sm:gap-7 sm:py-8">
                    <div className="relative aspect-square overflow-hidden border border-[#e5dac6] bg-[#f0eadd]">
                      <div aria-label={`${product.name} preview`} role="img" className="absolute inset-0 bg-center bg-no-repeat transition-transform duration-500 hover:scale-105" style={{ ...jewelryStyle, backgroundSize: product.gemstoneId === 'yellow-sapphire' ? '300% 100%' : product.gemstoneId ? '300% 200%' : 'cover' }} />
                      <span className="absolute bottom-2 left-2 bg-[#f8f4eb]/90 px-2 py-1 font-['Outfit',sans-serif] text-[8px] uppercase tracking-[.12em] text-[#78684c]">Made to order</span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-['Outfit',sans-serif] text-[9px] uppercase tracking-[.16em] text-[#a77b35]">{product.edition}</p>
                      <h2 className="mt-2 font-serif text-2xl sm:text-3xl">{product.name}</h2>
                      <p className="mt-1 font-serif text-sm text-[#756a58]">{selectedColor.name}</p>
                      <p className="mt-4 max-w-lg font-serif text-sm leading-6 text-[#817560]">{product.description}</p>
                      <button onClick={() => removeItem(product.id, selectedColor.id)} className="mt-4 inline-flex items-center gap-2 font-['Outfit',sans-serif] text-[9px] uppercase tracking-[.13em] text-[#8e8069] transition hover:text-[#6e392b]"><Trash2 size={13} /> Remove</button>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                      <div className="flex h-9 items-center border border-[#ded3c0]">
                        <button aria-label={`Decrease quantity of ${product.name}`} onClick={() => updateQuantity(product.id, selectedColor.id, -1)} className="grid h-9 w-9 place-items-center text-[#625744] transition hover:bg-[#eee6d8]"><Minus size={13} /></button>
                        <span className="w-8 text-center font-['Outfit',sans-serif] text-xs">{itemQuantity}</span>
                        <button aria-label={`Increase quantity of ${product.name}`} onClick={() => updateQuantity(product.id, selectedColor.id, 1)} className="grid h-9 w-9 place-items-center text-[#625744] transition hover:bg-[#eee6d8]"><Plus size={13} /></button>
                      </div>
                      <strong className="font-serif text-lg font-normal">{formatPrice(product.price * itemQuantity, product.currency)}</strong>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit border border-[#ded3c0] bg-[#fbf9f4] p-5 sm:p-7 lg:sticky lg:top-28">
              <p className="font-['Outfit',sans-serif] text-[9px] uppercase tracking-[.2em] text-[#a77b35]">A considered order</p>
              <h2 className="mt-2 font-serif text-2xl">Order summary</h2>
              <div className="mt-6 space-y-4 border-y border-[#e8dfd0] py-5 font-['Outfit',sans-serif] text-xs text-[#756a58]">
                <div className="flex justify-between"><span>Pieces</span><span>{quantity}</span></div>
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span></div>
                <div className="flex justify-between"><span>Insured delivery</span><span className="text-[#63704f]">Complimentary</span></div>
                <div className="flex justify-between border-t border-[#e8dfd0] pt-4 text-sm font-semibold text-[#30271d]"><span>Total</span><span>{formatPrice(subtotal, currency)}</span></div>
              </div>
              <button onClick={navigateToCheckout} className="mt-6 flex h-12 w-full items-center justify-center gap-3 bg-[#34251b] px-5 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.17em] text-[#fffaf0] transition hover:bg-[#4d3825]">Buy now <ArrowRight size={15} /></button>
              <p className="mt-4 flex items-start gap-2 font-serif text-xs leading-5 text-[#82765f]"><Sparkles size={14} className="mt-0.5 shrink-0 text-[#a77b35]" /> A gemstone specialist will confirm your piece and delivery before payment.</p>
            </aside>
          </div>
        )}
      </main>
      <Footer productPage />
    </div>
  );
}

export default CartPage;
