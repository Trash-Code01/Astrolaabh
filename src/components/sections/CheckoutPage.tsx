import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/utils';

export function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState('secure-link');
  const [submitted, setSubmitted] = useState(false);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const currency = items[0]?.product.currency ?? 'USD';

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) return;
    setSubmitted(true);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#292319]">
      <header className="sticky top-0 z-30 border-b border-[#e6ddcc] bg-[#faf8f3]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <a href="/" aria-label="AstroLaabh home" className="flex items-center">
            <img src="/astrolaabh-logo.png" alt="AstroLaabh" className="h-9 w-auto object-contain" />
          </a>
          <div className="hidden items-center gap-2 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.2em] text-[#72654f] sm:flex">
            <LockKeyhole className="h-3.5 w-3.5 text-[#a77b35]" /> Secure checkout
          </div>
          <a href="/" className="flex items-center gap-2 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.12em] text-[#77684f] transition-colors hover:text-[#a77b35]">
            <ArrowLeft className="h-3.5 w-3.5" /> Continue shopping
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1240px] gap-10 px-5 py-9 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-16">
        <section>
          <a href="/cart" className="mb-7 inline-flex items-center gap-2 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.14em] text-[#8c7958] hover:text-[#4a3921]">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to your bag
          </a>
          <p className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.22em] text-[#a77b35]">A thoughtful final step</p>
          <h1 className="mt-2 font-serif text-5xl font-normal tracking-[-.04em] text-[#292319] sm:text-6xl">Checkout</h1>
          <p className="mt-3 max-w-[570px] font-serif text-base leading-7 text-[#716651]">Share where to reach you. Our gemstone team will confirm your selection and arrange a secure payment for your piece.</p>

          {submitted ? (
            <div className="mt-9 border border-[#d9c9a8] bg-[#fcfaf5] p-7 sm:p-9">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e9efdf] text-[#54704a]"><Check className="h-5 w-5" /></span>
              <p className="mt-5 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.2em] text-[#98713a]">Request received</p>
              <h2 className="mt-2 font-serif text-3xl text-[#2a241a]">Your stone journey is underway.</h2>
              <p className="mt-3 max-w-[520px] font-serif leading-7 text-[#716651]">An AstroLaabh specialist will be in touch to verify the details, answer your questions and share a secure payment link.</p>
              <a href="/" className="mt-7 inline-flex h-11 items-center gap-2 bg-[#34251b] px-5 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.14em] text-[#fffaf0] hover:bg-[#4d3825]">Return to AstroLaabh <ArrowRight className="h-4 w-4" /></a>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-9 border border-[#e2d8c5] bg-[#fcfaf5] p-7 sm:p-9">
              <Sparkles className="h-6 w-6 text-[#a77b35]" />
              <h2 className="mt-4 font-serif text-3xl">Your bag is waiting for a stone.</h2>
              <p className="mt-2 font-serif leading-6 text-[#716651]">Explore the collection and add a piece to begin your checkout.</p>
              <a href="/#gemstone-collection" className="mt-6 inline-flex h-11 items-center gap-2 bg-[#34251b] px-5 font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.14em] text-[#fffaf0] hover:bg-[#4d3825]">Explore gemstones <ArrowRight className="h-4 w-4" /></a>
            </div>
          ) : (
            <form onSubmit={submitOrder} className="mt-8 space-y-8">
              <fieldset className="space-y-4">
                <legend className="mb-4 font-serif text-2xl">Contact details</legend>
                <label className="block font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.1em] text-[#716651]">Email address<input required type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 h-12 w-full border border-[#ded4c1] bg-[#fcfaf5] px-4 font-serif text-base normal-case tracking-normal text-[#292319] outline-none transition focus:border-[#a77b35]" /></label>
                <label className="flex items-center gap-2 font-serif text-sm text-[#716651]"><input type="checkbox" className="accent-[#9d7438]" /> Send me occasional notes on gemstones and Vedic wisdom.</label>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="mb-4 font-serif text-2xl">Delivery address</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.1em] text-[#716651]">First name<input required autoComplete="given-name" className="checkout-input" /></label>
                  <label className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.1em] text-[#716651]">Last name<input required autoComplete="family-name" className="checkout-input" /></label>
                </div>
                <label className="block font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.1em] text-[#716651]">Address<input required autoComplete="street-address" placeholder="Street and house number" className="checkout-input" /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.1em] text-[#716651]">City<input required autoComplete="address-level2" className="checkout-input" /></label>
                  <label className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.1em] text-[#716651]">Postal code<input required autoComplete="postal-code" className="checkout-input" /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.1em] text-[#716651]">Country / region<select required defaultValue="India" autoComplete="country-name" className="checkout-input"><option>India</option><option>United States</option><option>United Kingdom</option><option>Other</option></select></label>
                  <label className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.1em] text-[#716651]">Phone<input required type="tel" autoComplete="tel" className="checkout-input" /></label>
                </div>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="mb-4 font-serif text-2xl">Payment preference</legend>
                {[
                  ['secure-link', 'Secure payment link', 'We’ll send a verified link after your stone is confirmed.'],
                  ['upi', 'UPI on confirmation', 'Complete payment from your preferred UPI app.'],
                  ['consult', 'Speak with a specialist', 'Arrange a call before confirming your order.'],
                ].map(([id, label, detail]) => <label key={id} className={`flex cursor-pointer gap-3 border p-4 transition ${paymentMethod === id ? 'border-[#a77b35] bg-[#fbf7ec]' : 'border-[#e2d8c5] bg-[#fcfaf5]'}`}><input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="mt-1 accent-[#9d7438]" /><span><strong className="block font-serif text-base font-medium text-[#342a1d]">{label}</strong><small className="mt-1 block font-serif text-sm leading-5 text-[#796d58]">{detail}</small></span></label>)}
              </fieldset>

              <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 bg-[#34251b] px-5 font-['Outfit',sans-serif] text-[10px] font-medium uppercase tracking-[.16em] text-[#fffaf0] transition hover:bg-[#4d3825] sm:w-auto sm:min-w-[230px]">Request order confirmation <ArrowRight className="h-4 w-4" /></button>
              <p className="flex items-center gap-2 font-['Outfit',sans-serif] text-[9px] uppercase tracking-[.12em] text-[#8a7b62]"><ShieldCheck className="h-4 w-4 text-[#9b7c48]" /> Your details are handled with care.</p>
            </form>
          )}
        </section>

        <aside className="h-fit border border-[#e0d6c4] bg-[#fcfaf5] p-5 sm:p-7 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-[#e9e0d1] pb-4">
            <h2 className="font-serif text-2xl">Your order</h2>
            <span className="font-['Outfit',sans-serif] text-[10px] uppercase tracking-[.12em] text-[#88795f]">{quantity} {quantity === 1 ? 'piece' : 'pieces'}</span>
          </div>
          {items.length ? <div className="divide-y divide-[#eee6d9]">{items.map((item) => <div key={`${item.product.id}-${item.selectedColor.id}`} className="flex gap-3 py-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center border border-[#e6dcc8] bg-[#f5f0e5]"><span className="h-5 w-5 rounded-full" style={{ background: `radial-gradient(circle at 32% 28%, #fff8d9, ${item.selectedColor.hex} 58%, #59452d)` }} /></div>
            <div className="min-w-0 flex-1"><p className="font-serif text-base text-[#342a1d]">{item.product.name}</p><p className="mt-0.5 font-['Outfit',sans-serif] text-[9px] uppercase tracking-[.1em] text-[#88795f]">{item.selectedColor.name} · Qty {item.quantity}</p></div>
            <strong className="font-serif text-sm font-medium text-[#342a1d]">{formatPrice(item.product.price * item.quantity, item.product.currency)}</strong>
          </div>)}</div> : <p className="py-5 font-serif text-sm text-[#88795f]">Your selected pieces will appear here.</p>}
          <div className="space-y-3 border-t border-[#e9e0d1] pt-4 font-['Outfit',sans-serif] text-[11px] text-[#766951]">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span></div>
            <div className="flex justify-between"><span>Insured delivery</span><span className="text-[#667753]">Complimentary</span></div>
            <div className="flex justify-between border-t border-[#e9e0d1] pt-4 text-sm font-semibold text-[#30271d]"><span>Total</span><span>{formatPrice(subtotal, currency)}</span></div>
            <p className="pt-1 font-serif text-xs leading-5 text-[#8a7b62]">A gemstone specialist will confirm availability and delivery before payment.</p>
          </div>
        </aside>
      </main>
      <footer className="border-t border-[#e6ddcc] py-6 text-center font-['Outfit',sans-serif] text-[9px] uppercase tracking-[.16em] text-[#8a7b62]">AstroLaabh · Meaningful gemstones, chosen with care</footer>
    </div>
  );
}

export default CheckoutPage;
