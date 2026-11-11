import { useState } from 'react';
import { ArrowRight, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { AudioController } from '../ui/AudioController';
import { useCreativeStore } from '../../../store/useCreativeStore';
import { useCartStore } from '../../../store/useCartStore';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { scrollToTarget } from '../../../lib/lenis';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleCart = useCreativeStore((s) => s.toggleCart);
  const items = useCartStore((s) => s.items);
  const { playHover, playClick } = useSoundEffects();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const scrollToSection = (id: string) => {
    playClick();
    setMenuOpen(false);
    scrollToTarget(id);
  };

  const links = [
    ['Gemstones', 'gemstone-collection'], ['Consultation', 'craftsmanship'],
    ['Designs', 'specs'], ['Efficacy', 'tech'], ['Our Story', 'cta'],
  ];

  return (
    <header className="site-navbar fixed left-0 top-0 z-50 flex w-full items-center justify-between px-5 py-5 text-[#242019] sm:px-9 lg:px-12 lg:py-6 pointer-events-none">
      <a href="#hero" className="pointer-events-auto flex items-center gap-3 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.25)]" onMouseEnter={playHover}>
        <span className="lotus-mark" aria-hidden="true">❀</span>
        <span className="font-serif text-lg tracking-[0.12em] sm:text-xl">ASTRO LAABH</span>
      </a>

      <nav className="pointer-events-auto hidden items-center gap-8 lg:flex">
        {links.map(([label, id]) => (
          <button key={id} onClick={() => scrollToSection(id)} className="font-serif text-[15px] text-[#37312a] transition-colors hover:text-[#8b682d]" onMouseEnter={playHover}>{label}</button>
        ))}
      </nav>

      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <button aria-label="Search" className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#29251f] backdrop-blur-sm sm:flex"><Search className="h-5 w-5" /></button>
        <button aria-label="Shopping bag" onClick={() => { playClick(); toggleCart(); }} className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/30 backdrop-blur-sm sm:flex">
          <ShoppingBag className="h-5 w-5" />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#80632e] text-[9px] text-white">{cartCount}</span>}
        </button>
        <button onClick={() => scrollToSection('craftsmanship')} className="consult-button hidden items-center gap-3 rounded-full border border-white/70 bg-white/45 py-1 pl-5 pr-1 backdrop-blur-md sm:flex">
          <span className="font-serif text-sm text-[#302c26]">Consult an Astrologer</span><span className="grid h-9 w-9 place-items-center rounded-full bg-[#45351c] text-white"><ArrowRight className="h-4 w-4" /></span>
        </button>
        <AudioController />
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/60 lg:hidden" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>

      {menuOpen && (
        <nav className="pointer-events-auto absolute left-4 right-4 top-[72px] rounded-2xl border border-white/60 bg-[#f5edda]/95 p-4 shadow-xl backdrop-blur-md lg:hidden">
          {links.map(([label, id]) => <button key={id} onClick={() => scrollToSection(id)} className="block w-full rounded-xl px-4 py-3 text-left font-serif text-[#302b24] hover:bg-white/50">{label}</button>)}
        </nav>
      )}
    </header>
  );
}
