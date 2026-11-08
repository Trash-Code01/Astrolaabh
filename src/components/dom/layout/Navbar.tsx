import { useState } from 'react';
import { ArrowRight, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { AudioController } from '../ui/AudioController';
import { useCreativeStore } from '../../../store/useCreativeStore';
import { useCartStore } from '../../../store/useCartStore';
import { useSoundEffects } from '../../../hooks/useSoundEffects';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleCart = useCreativeStore((s) => s.toggleCart);
  const items = useCartStore((s) => s.items);
  const { playHover, playClick } = useSoundEffects();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const scrollToSection = (id: string) => {
    playClick();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    ['Gemstones', 'narrative'],
    ['Consultation', 'craftsmanship'],
    ['Designs', 'specs'],
    ['Efficacy', 'tech'],
    ['Our Story', 'cta'],
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-6 sm:px-12 lg:px-16 py-5 sm:py-6 pointer-events-none">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Brand Logo matching Concept Art */}
        <a
          href="#hero"
          className="pointer-events-auto flex items-center gap-3 text-[#1e1913] hover:opacity-90 transition-opacity"
          onMouseEnter={playHover}
        >
          {/* Stylized Golden Vedic Lotus Mark */}
          <svg viewBox="0 0 40 32" className="w-8 h-7 text-[#b58a44] fill-current" aria-hidden="true">
            <path
              d="M20 2C18 7 13 13 6 16C12 18 16 23 17 30C19 25 21 25 23 30C24 23 28 18 34 16C27 13 22 7 20 2Z"
              opacity="0.9"
            />
            <path
              d="M20 7C22 13 27 18 33 20C28 22 25 26 24 31C21 28 19 28 16 31C15 26 12 22 7 20C13 18 18 13 20 7Z"
              opacity="0.5"
            />
            <circle cx="20" cy="18" r="2.5" fill="#f8e5bd" />
          </svg>
          <span className="font-serif text-lg tracking-[0.16em] font-medium text-[#1e1913] sm:text-xl">
            ASTRO LAABH
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="pointer-events-auto hidden items-center gap-9 lg:flex">
          {links.map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="font-serif text-[15px] font-normal text-[#383129] transition-colors hover:text-[#9b7337]"
              onMouseEnter={playHover}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3.5">
          <button
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#382f23]/20 bg-white/40 text-[#29251f] hover:bg-white/70 transition-all backdrop-blur-sm sm:flex"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Shopping bag"
            onClick={() => {
              playClick();
              toggleCart();
            }}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-[#382f23]/20 bg-white/40 text-[#29251f] hover:bg-white/70 transition-all backdrop-blur-sm sm:flex"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#80632e] text-[9px] text-white font-medium">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => scrollToSection('craftsmanship')}
            className="consult-button hidden items-center gap-3.5 rounded-full bg-[#f3dbb3] hover:bg-[#ebd0a2] py-2 pl-6 pr-2 shadow-sm transition-all sm:flex group border border-[#dfc394]"
          >
            <span className="font-serif text-[14px] font-medium text-[#2d2214] tracking-wide">
              Consult an Astrologer
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2d2214] text-[#f8e5bd] transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
          <div className="hidden sm:block">
            <AudioController />
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-white/60 lg:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="pointer-events-auto absolute left-4 right-4 top-[72px] rounded-2xl border border-white/60 bg-[#f5edda]/95 p-4 shadow-xl backdrop-blur-md lg:hidden">
          {links.map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="block w-full rounded-xl px-4 py-3 text-left font-serif text-[#302b24] hover:bg-white/50"
            >
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
