import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useCreativeStore } from '../../../store/useCreativeStore';
import { useCartStore } from '../../../store/useCartStore';
import { useSoundEffects } from '../../../hooks/useSoundEffects';

interface NavLinkItem {
  label: string;
  id: string;
  hasDropdown?: boolean;
}

const navLinks: NavLinkItem[] = [
  { label: 'Gemstones', id: 'gemstone-collection', hasDropdown: true },
  { label: 'Consultation', id: 'appointment' },
  { label: 'Designs', id: 'gallery' },
  { label: 'Efficacy', id: 'ways-to-wear' },
  { label: 'Our Story', id: 'narrative' },
];

const navaratnaGems = [
  { name: 'Pukhraj', eng: 'Yellow Sapphire', planet: 'Jupiter', color: '#D4A338', badge: 'TOP' },
  { name: 'Neelam', eng: 'Blue Sapphire', planet: 'Saturn', color: '#254E9B' },
  { name: 'Manik', eng: 'Ruby', planet: 'Sun', color: '#C02636' },
  { name: 'Panna', eng: 'Emerald', planet: 'Mercury', color: '#1B8A5A' },
  { name: 'Heera', eng: 'Diamond', planet: 'Venus', color: '#7EA2C7' },
  { name: 'Moonga', eng: 'Red Coral', planet: 'Mars', color: '#C23D2E' },
  { name: 'Moti', eng: 'Pearl', planet: 'Moon', color: '#E8E2D2' },
  { name: 'Gomed', eng: 'Hessonite', planet: 'Rahu', color: '#A85A2A' },
  { name: 'Lehsunia', eng: "Cat's Eye", planet: 'Ketu', color: '#8A9E38' },
];

const intentList = [
  { goal: 'Wealth & fortune', stone: 'PUKHRAJ' },
  { goal: 'Marriage & harmony', stone: 'MOTI' },
  { goal: 'Wisdom & learning', stone: 'PANNA' },
  { goal: 'Authority & confidence', stone: 'MANIK' },
  { goal: 'Health & vitality', stone: 'MOONGA' },
  { goal: 'Career acceleration', stone: 'NEELAM' },
];

const rashis = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gemstonesDropdownOpen, setGemstonesDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleCart = useCreativeStore((s) => s.toggleCart);
  const items = useCartStore((s) => s.items);
  const { playHover, playClick } = useSoundEffects();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Active section observation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = ['hero', 'narrative', 'gemstone-collection', 'gallery', 'ways-to-wear', 'appointment'];
      const scrollPosition = scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut: Escape closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
        setGemstonesDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    playClick();
    setMenuOpen(false);
    setSearchOpen(false);
    setGemstonesDropdownOpen(false);

    const el = document.getElementById(id);
    if (el) {
      const navOffset = 76;
      const targetPosition = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    playHover();
    setGemstonesDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setGemstonesDropdownOpen(false);
    }, 220);
  };

  return (
    <>
      {/* SOLID, HIGH-CONTRAST LUXURY HEADER — 100% VISIBLE ON EVERY PIXEL */}
      <header className="fixed left-0 top-0 z-50 w-full bg-[#FAF8F5] border-b border-[#E2D8C8] shadow-[0_2px_16px_rgba(24,21,18,0.06)] transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 h-[72px] sm:h-[78px] flex items-center justify-between">
          
          {/* Brand Logo & Authority Badge */}
          <div className="flex items-center gap-3.5 sm:gap-5">
            <a
              href="#hero"
              className="flex items-center gap-2.5 select-none transition-transform duration-300 hover:scale-[1.01]"
              onMouseEnter={playHover}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
            >
              {/* Golden Sacred Lotus Mark */}
              <svg
                viewBox="0 0 40 32"
                className="w-7 h-6 sm:w-8 sm:h-7 text-[#9E773A] fill-current flex-shrink-0"
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

              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl lg:text-[22px] tracking-[0.24em] font-bold text-[#181512] uppercase leading-tight">
                  ASTRO LAABH
                </span>
                <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.28em] text-[#8C6D37] uppercase font-medium leading-none mt-0.5">
                  Sacred Vedic Gemstones
                </span>
              </div>
            </a>

            {/* AstroLaabh Guarantee Badge (matching reference art) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EDE2] border border-[#DFD6C7] text-[11px] font-serif tracking-[0.14em] uppercase text-[#6B5A45] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E773A]" />
              <span>AstroLaabh Guarantee · Authentic Certified Gems</span>
            </div>
          </div>

          {/* Center Navigation Links with Dropdown */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 relative">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.id}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className={`font-serif text-[13px] xl:text-[13.5px] tracking-[0.18em] uppercase transition-colors whitespace-nowrap py-2 flex items-center gap-1.5 group select-none ${
                        isActive
                          ? 'text-[#9E773A] font-bold'
                          : 'text-[#181512] hover:text-[#9E773A] font-semibold'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#181512] transition-transform duration-300 group-hover:rotate-180 group-hover:text-[#9E773A] ${
                          gemstonesDropdownOpen ? 'rotate-180 text-[#9E773A]' : ''
                        }`}
                      />
                      {/* Active indicator underline */}
                      <span
                        className={`absolute bottom-0 left-0 h-[2px] bg-[#9E773A] transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </button>

                    {/* SOLID OPAQUE LUXURY MEGA-DROPDOWN — ZERO BACKGROUND BLEED */}
                    {gemstonesDropdownOpen && (
                      <div
                        className="fixed left-1/2 -translate-x-1/2 top-[76px] w-[95vw] max-w-[1180px] bg-[#FAF8F5] border border-[#DFD6C7] shadow-[0_24px_60px_rgba(24,21,18,0.18)] rounded-2xl p-6 sm:p-8 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                          
                          {/* Column 1: Featured Quick Assessment Cards */}
                          <div className="lg:col-span-3 space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-[#F5EDE1] to-[#EBE0CF] border border-[#DDD3C2] flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#8C6D37] font-bold">
                                  Free · AI-Kundli Scored
                                </span>
                                <h4 className="font-serif text-base font-bold text-[#181512] mt-1 mb-1">
                                  Check My Stone
                                </h4>
                                <p className="font-sans text-xs text-[#5C5349] leading-relaxed">
                                  Seven questions, one precise astrological match for your chart.
                                </p>
                              </div>
                              <button
                                onClick={() => scrollToSection('gemstone-collection')}
                                className="mt-4 font-serif text-xs font-bold text-[#8C6D37] hover:text-[#181512] flex items-center gap-1.5 transition-colors"
                              >
                                <span>Start free assessment</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="p-4 rounded-xl bg-[#F0E7D8] border border-[#DDD3C2] flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#8C6D37] font-bold">
                                  1-on-1 Astrologer Reading
                                </span>
                                <h4 className="font-serif text-base font-bold text-[#181512] mt-1 mb-1">
                                  Book a Consultation
                                </h4>
                                <p className="font-sans text-xs text-[#5C5349] leading-relaxed">
                                  A real Vedic reading with certified masters before you choose a stone.
                                </p>
                              </div>
                              <button
                                onClick={() => scrollToSection('appointment')}
                                className="mt-4 font-serif text-xs font-bold text-[#8C6D37] hover:text-[#181512] flex items-center gap-1.5 transition-colors"
                              >
                                <span>Book consultation</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Column 2: The 9 Navaratna Gems */}
                          <div className="lg:col-span-6 border-x border-[#EAE2D5] px-6">
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE2D5]">
                              <span className="font-serif text-xs font-bold uppercase tracking-[0.22em] text-[#181512]">
                                THE NAVARATNA · Nine Planetary Gems
                              </span>
                              <span className="text-[11px] font-serif text-[#8C6D37] font-medium">
                                100% Certified Untreated
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {navaratnaGems.map((gem) => (
                                <button
                                  key={gem.name}
                                  onClick={() => scrollToSection('gemstone-collection')}
                                  className="p-2.5 rounded-xl hover:bg-[#F3EDE2] border border-transparent hover:border-[#E0D7C8] transition-all flex items-center justify-between text-left group"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span
                                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                                      style={{ backgroundColor: gem.color }}
                                    />
                                    <div>
                                      <div className="font-serif text-[14px] font-bold text-[#181512] group-hover:text-[#9E773A] transition-colors flex items-center gap-2">
                                        <span>{gem.name}</span>
                                        {gem.badge && (
                                          <span className="text-[9px] bg-[#EAD4B0] text-[#181512] px-1.5 py-0.2 rounded font-sans font-bold">
                                            {gem.badge}
                                          </span>
                                        )}
                                      </div>
                                      <div className="font-sans text-[11px] text-[#635B53]">
                                        {gem.eng} · {gem.planet}
                                      </div>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-[#181512] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ))}
                            </div>

                            <div className="pt-4 mt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                              <span className="text-[11px] font-serif uppercase tracking-wider text-[#8C6D37] font-semibold">
                                UPARATNA (Substitutes): Amethyst, Citrine, Moonstone, Opal
                              </span>
                              <button
                                onClick={() => scrollToSection('gemstone-collection')}
                                className="font-serif text-xs font-bold text-[#181512] hover:text-[#9E773A] flex items-center gap-1.5 transition-colors"
                              >
                                <span>Explore all stones</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Column 3: Shop by Intent & By Your Rashi */}
                          <div className="lg:col-span-3 space-y-5">
                            <div>
                              <span className="font-serif text-xs font-bold uppercase tracking-[0.22em] text-[#181512] block mb-3">
                                SHOP BY INTENT
                              </span>
                              <div className="space-y-2">
                                {intentList.map((item) => (
                                  <button
                                    key={item.goal}
                                    onClick={() => scrollToSection('gemstone-collection')}
                                    className="w-full text-left flex items-center justify-between text-xs py-1 group"
                                  >
                                    <span className="font-serif text-[#332C24] group-hover:text-[#9E773A] font-medium">
                                      {item.goal}
                                    </span>
                                    <span className="text-[10px] font-serif font-bold text-[#8C6D37] tracking-wider uppercase bg-[#F3EDE2] px-2 py-0.5 rounded">
                                      {item.stone}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-[#EAE2D5]">
                              <span className="font-serif text-xs font-bold uppercase tracking-[0.22em] text-[#181512] block mb-2">
                                BY YOUR RASHI (ZODIAC)
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {rashis.map((rashi) => (
                                  <button
                                    key={rashi}
                                    onClick={() => scrollToSection('gemstone-collection')}
                                    className="px-2.5 py-1 rounded bg-[#F3EDE2] hover:bg-[#EAD4B0] text-[11px] font-serif text-[#181512] font-semibold transition-colors"
                                  >
                                    {rashi}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`font-serif text-[13px] xl:text-[13.5px] tracking-[0.18em] uppercase transition-colors whitespace-nowrap py-2 relative group select-none ${
                    isActive
                      ? 'text-[#9E773A] font-bold'
                      : 'text-[#181512] hover:text-[#9E773A] font-semibold'
                  }`}
                  onMouseEnter={playHover}
                >
                  <span>{link.label}</span>
                  {/* Underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#9E773A] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Action Suite: Search, Bag, and High-End Consultation CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Search Icon Button */}
            <button
              aria-label="Search gemstones and consultations"
              onClick={() => {
                playClick();
                setSearchOpen(true);
              }}
              className="h-10 w-10 rounded-full border border-[#DFD6C7] bg-[#F5EDE1] hover:bg-[#ECE1D0] text-[#181512] transition-all flex items-center justify-center shadow-sm"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Shopping Bag Button with Live Cart Counter */}
            <button
              aria-label="Open sacred shopping bag"
              onClick={() => {
                playClick();
                toggleCart();
              }}
              className="relative h-10 w-10 rounded-full border border-[#DFD6C7] bg-[#F5EDE1] hover:bg-[#ECE1D0] text-[#181512] transition-all flex items-center justify-center shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#181512] text-[9px] text-[#EAD4B0] font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* High-Contrast "Consult an Astrologer" Gold Pill Button */}
            <button
              onClick={() => scrollToSection('appointment')}
              className="consult-button hidden sm:flex items-center gap-3 rounded-full bg-[#EAD4B0] hover:bg-[#DECA9E] py-2.5 pl-6 pr-2.5 shadow-sm transition-all duration-300 group border border-[#D5BB8E]"
            >
              <span className="font-serif text-[12.5px] font-bold text-[#181512] tracking-wider uppercase">
                Talk to an Astrologer
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#181512] text-[#EAD4B0] transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>

            {/* Mobile Navigation Toggle Button */}
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-[#DFD6C7] bg-[#F5EDE1] text-[#181512] lg:hidden"
              aria-label="Toggle navigation menu"
              onClick={() => {
                playClick();
                setMenuOpen((open) => !open);
              }}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <nav className="absolute left-4 right-4 top-[78px] rounded-2xl border border-[#DFD6C7] bg-[#FAF8F5] p-6 shadow-2xl lg:hidden">
            <div className="flex flex-col divide-y divide-[#EFEAE1]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="w-full py-4 text-left font-serif text-[16px] font-bold text-[#181512] hover:text-[#9E773A] transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </div>

            <div className="pt-4 mt-2 space-y-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  toggleCart();
                }}
                className="w-full py-3 px-4 rounded-xl border border-[#DFD6C7] bg-[#F5EDE1] text-[#181512] font-serif text-sm font-bold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>View Sacred Bag ({cartCount})</span>
              </button>

              <button
                onClick={() => scrollToSection('appointment')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#EAD4B0] text-[#181512] font-serif text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Talk to an Astrologer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Luxury Interactive Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4 sm:px-6">
          <div className="w-full max-w-2xl rounded-2xl border border-[#DFD6C7] bg-[#FAF8F5] shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D5]">
              <div className="flex items-center gap-2.5">
                <Search className="w-5 h-5 text-[#9E773A]" />
                <span className="font-serif text-sm uppercase tracking-[0.2em] text-[#181512] font-bold">
                  AstroLaabh Vedic Gemstone Finder
                </span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="w-8 h-8 rounded-full border border-[#DFD6C7] bg-[#F5EDE1] flex items-center justify-center hover:bg-[#ECE1D0] text-[#181512]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5">
              <input
                type="text"
                autoFocus
                placeholder="Search natural gemstones, birthstones, astrological charts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#DFD6C7] rounded-xl px-4 py-3.5 font-serif text-base text-[#181512] placeholder-[#7A7167] focus:outline-none focus:border-[#9E773A] shadow-inner font-medium"
              />
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-serif tracking-wider uppercase text-[#8C6D37] block mb-2.5 font-bold">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Yellow Sapphire (Pukhraj)',
                  'Ruby (Manik)',
                  'Emerald (Panna)',
                  'Blue Sapphire (Neelam)',
                  'Pearl (Moti)',
                  'Vedic Horoscope Consultation',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      scrollToSection('gemstone-collection');
                    }}
                    className="px-3.5 py-1.5 rounded-full border border-[#DFD6C7] bg-[#F5EDE1] hover:border-[#9E773A] hover:bg-[#EAD4B0] text-xs font-serif text-[#181512] font-semibold transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
