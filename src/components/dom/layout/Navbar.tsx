import { useState, useEffect } from 'react';
import { ArrowRight, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCreativeStore } from '../../../store/useCreativeStore';
import { useCartStore } from '../../../store/useCartStore';
import { useSoundEffects } from '../../../hooks/useSoundEffects';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleCart = useCreativeStore((s) => s.toggleCart);
  const items = useCartStore((s) => s.items);
  const { playHover, playClick } = useSoundEffects();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    playClick();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    ['Gemstones', 'gemstone-collection'],
    ['Consultation', 'appointment'],
    ['Designs', 'gallery'],
    ['Efficacy', 'ways-to-wear'],
    ['Our Story', 'narrative'],
  ];

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/96 backdrop-blur-md border-b border-[#E8E1D5] shadow-[0_4px_20px_rgba(24,21,18,0.06)] py-3 sm:py-3.5'
          : 'bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#E8E1D5]/60 py-4 sm:py-5'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between">
        {/* Brand Logo & Heritage Mark */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#hero"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-[#E2D8C8] text-[#181512] transition-all whitespace-nowrap shadow-[0_2px_8px_rgba(24,21,18,0.04)]"
            onMouseEnter={playHover}
            onClick={() => scrollToSection('hero')}
          >
            {/* Stylized Golden Vedic Lotus Mark */}
            <svg
              viewBox="0 0 40 32"
              className="w-6 h-5 sm:w-7 sm:h-6 text-[#9E773A] fill-current flex-shrink-0"
              aria-hidden="true"
            >
              <path
                d="M20 2C18 7 13 13 6 16C12 18 16 23 17 30C19 25 21 25 23 30C24 23 28 18 34 16C27 13 22 7 20 2Z"
                opacity="0.95"
              />
              <path
                d="M20 7C22 13 27 18 33 20C28 22 25 26 24 31C21 28 19 28 16 31C15 26 12 22 7 20C13 18 18 13 20 7Z"
                opacity="0.65"
              />
              <circle cx="20" cy="18" r="2.5" fill="#181512" />
            </svg>
            <span className="font-serif text-sm sm:text-base tracking-[0.18em] font-medium text-[#181512] whitespace-nowrap">
              ASTRO LAABH
            </span>
          </a>

          {/* Luxury Vedic Guarantee Badge (matching reference art) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EDE2]/80 border border-[#E5DCD0] text-[11px] font-serif tracking-[0.14em] uppercase text-[#73634F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E773A]" />
            <span>Sacred Vedic Gemstones</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-7 xl:gap-9 lg:flex">
          {links.map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="font-serif text-[12.5px] xl:text-[13px] font-medium tracking-[0.16em] uppercase text-[#332C24] transition-colors hover:text-[#9E773A] whitespace-nowrap py-1 relative group"
              onMouseEnter={playHover}
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#9E773A] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <button
            aria-label="Search gemstones"
            className="hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#E0D7C8] bg-white/70 text-[#29251F] hover:bg-white hover:border-[#9E773A] transition-all shadow-[0_2px_8px_rgba(24,21,18,0.03)] sm:flex"
            onClick={playClick}
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            aria-label="Shopping bag"
            onClick={() => {
              playClick();
              toggleCart();
            }}
            className="relative hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#E0D7C8] bg-white/70 text-[#29251F] hover:bg-white hover:border-[#9E773A] transition-all shadow-[0_2px_8px_rgba(24,21,18,0.03)] sm:flex"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#9E773A] text-[9px] text-white font-medium shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => scrollToSection('appointment')}
            className="consult-button hidden items-center gap-3 rounded-full bg-[#EAD4B0] hover:bg-[#E0C69C] py-2 pl-5 pr-2 shadow-sm transition-all sm:flex group border border-[#D8BC8E]"
          >
            <span className="font-serif text-[13px] font-medium text-[#241B10] tracking-wide">
              Consult an Astrologer
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#241B10] text-[#EAD4B0] transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-[#E0D7C8] bg-white/80 text-[#29251F] lg:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <nav className="absolute left-4 right-4 top-[64px] rounded-2xl border border-[#E5DDD0] bg-[#FAF8F5]/98 p-5 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="flex flex-col divide-y divide-[#EFEAE1]">
            {links.map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="w-full py-3.5 text-left font-serif text-[15px] font-medium text-[#2C251D] hover:text-[#9E773A] transition-colors flex items-center justify-between"
              >
                <span>{label}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-40" />
              </button>
            ))}
          </div>

          <div className="pt-4 mt-2">
            <button
              onClick={() => scrollToSection('appointment')}
              className="w-full py-3 px-4 rounded-xl bg-[#EAD4B0] text-[#241B10] font-serif text-sm font-medium flex items-center justify-center gap-2"
            >
              <span>Consult an Astrologer</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
