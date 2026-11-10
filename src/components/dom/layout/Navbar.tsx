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

const gemstoneCategories = [
  {
    title: 'Sacred Navaratna',
    desc: 'The 9 Vedic celestial gemstones aligned with planetary energies',
    tag: 'Planetary Vedic',
  },
  {
    title: 'Natural Rough Crystals',
    desc: 'Untreated earth stones radiating pure mineral resonance',
    tag: 'Uncut & Raw',
  },
  {
    title: 'Master-Cut Faceted Jewels',
    desc: 'Astrologically calibrated facets for maximum light refraction',
    tag: 'Certified Authentic',
  },
  {
    title: 'Bespoke Sacred Jewelry',
    desc: 'Handcrafted gold rings and amulets with secret lotus blessings',
    tag: 'Custom Crafted',
  },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gemstonesDropdownOpen, setGemstonesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleCart = useCreativeStore((s) => s.toggleCart);
  const items = useCartStore((s) => s.items);
  const { playHover, playClick } = useSoundEffects();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // Scroll detection and active section observation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 24);

      // Determine active section based on scroll offset
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
      const navOffset = isScrolled ? 72 : 84;
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
    }, 180);
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-[#FAF8F5]/94 backdrop-blur-xl border-b border-[#E8E1D5]/80 shadow-[0_4px_24px_rgba(24,21,18,0.05)] py-3 sm:py-3.5'
            : 'bg-gradient-to-b from-black/25 via-black/5 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between">
          
          {/* Left Brand Identity: Iconic Vedic Lotus Emblem & Typography */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#hero"
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full transition-all duration-300 select-none shadow-sm ${
                isScrolled
                  ? 'bg-white/80 hover:bg-white border border-[#E2D8C8] text-[#181512]'
                  : 'bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/40 text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]'
              }`}
              onMouseEnter={playHover}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
            >
              {/* Sacred Stylized Lotus Star Glyph */}
              <svg
                viewBox="0 0 40 32"
                className={`w-6 h-5 sm:w-7 sm:h-6 flex-shrink-0 transition-colors duration-300 ${
                  isScrolled ? 'text-[#9E773A] fill-current' : 'text-[#F5D799] fill-current drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
                }`}
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
                <circle cx="20" cy="18" r="2.5" fill={isScrolled ? '#181512' : '#FFFFFF'} />
              </svg>

              <span
                className={`font-serif text-sm sm:text-base tracking-[0.2em] font-medium whitespace-nowrap transition-colors duration-300 ${
                  isScrolled ? 'text-[#181512]' : 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                }`}
              >
                ASTRO LAABH
              </span>
            </a>

            {/* Subtle Luxury Guarantee Badge */}
            <div
              className={`hidden xl:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-serif tracking-[0.15em] uppercase transition-all duration-300 ${
                isScrolled
                  ? 'bg-[#F3EDE2]/80 border border-[#E5DCD0] text-[#73634F]'
                  : 'bg-white/15 backdrop-blur-sm border border-white/30 text-white/90 shadow-sm'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E773A]" />
              <span>Sacred Vedic Gemstones</span>
            </div>
          </div>

          {/* Center Navigation Links with Dropdown & Active Scroll Highlighting */}
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
                      className={`font-serif text-[13px] tracking-[0.16em] uppercase transition-colors whitespace-nowrap py-1.5 flex items-center gap-1.5 group select-none ${
                        isScrolled
                          ? isActive
                            ? 'text-[#9E773A] font-semibold'
                            : 'text-[#2C241C] hover:text-[#9E773A] font-normal'
                          : 'text-[#2E251D] hover:text-[#9E773A] font-normal'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 group-hover:rotate-180 group-hover:opacity-100 ${
                          gemstonesDropdownOpen ? 'rotate-180 text-[#9E773A]' : ''
                        }`}
                      />
                      {/* Active indicator underline */}
                      <span
                        className={`absolute bottom-0 left-0 h-[1.5px] bg-[#9E773A] transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </button>

                    {/* Luxury Gemstones Mega-Dropdown Popover Card */}
                    {gemstonesDropdownOpen && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-[#E8E1D5] bg-[#FAF8F5]/98 shadow-[0_16px_40px_rgba(24,21,18,0.12)] backdrop-blur-2xl p-4 transition-all duration-200 z-50"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="px-3 pt-2 pb-2.5 border-b border-[#EFE8DC] flex items-center justify-between">
                          <span className="font-serif text-[11px] tracking-[0.2em] uppercase text-[#8C6D37] font-semibold">
                            Sacred Vedic Catalog
                          </span>
                          <span className="text-[11px] text-[#8A8177] font-serif">
                            Certified 100% Natural
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5 py-2">
                          {gemstoneCategories.map((cat) => (
                            <button
                              key={cat.title}
                              onClick={() => scrollToSection('gemstone-collection')}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-white/80 transition-all group flex items-start justify-between"
                            >
                              <div className="pr-2">
                                <div className="font-serif text-[13.5px] font-medium text-[#181512] group-hover:text-[#9E773A] transition-colors flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3 text-[#9E773A] opacity-70 group-hover:opacity-100" />
                                  <span>{cat.title}</span>
                                </div>
                                <p className="font-sans text-[11.5px] text-[#6E6459] leading-snug mt-0.5">
                                  {cat.desc}
                                </p>
                              </div>
                              <span className="text-[9.5px] tracking-wider uppercase font-serif text-[#8C6D37] bg-[#F2EBDE] px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5">
                                {cat.tag}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#EFE8DC]">
                          <button
                            onClick={() => scrollToSection('gemstone-collection')}
                            className="w-full py-2 px-3 rounded-lg bg-[#F0E5D3] hover:bg-[#EADBC4] text-[#221A10] font-serif text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span>Explore Full Gemstone Collection</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
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
                  className={`font-serif text-[13px] tracking-[0.16em] uppercase transition-colors whitespace-nowrap py-1.5 relative group select-none ${
                    isScrolled
                      ? isActive
                        ? 'text-[#9E773A] font-semibold'
                        : 'text-[#2C241C] hover:text-[#9E773A] font-normal'
                      : 'text-[#2E251D] hover:text-[#9E773A] font-normal'
                  }`}
                  onMouseEnter={playHover}
                >
                  <span>{link.label}</span>
                  {/* Underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-[#9E773A] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Search, Cart Drawer, Consultation CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Search Icon Button */}
            <button
              aria-label="Search gemstones and consultations"
              onClick={() => {
                playClick();
                setSearchOpen(true);
              }}
              className={`hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all duration-300 shadow-sm ${
                isScrolled
                  ? 'border border-[#E0D7C8] bg-white/70 hover:bg-white text-[#29251F] hover:border-[#9E773A]'
                  : 'border border-[#2D241B]/20 bg-white/40 hover:bg-white/70 backdrop-blur-sm text-[#2D241B]'
              }`}
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
              className={`relative hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all duration-300 shadow-sm ${
                isScrolled
                  ? 'border border-[#E0D7C8] bg-white/70 hover:bg-white text-[#29251F] hover:border-[#9E773A]'
                  : 'border border-[#2D241B]/20 bg-white/40 hover:bg-white/70 backdrop-blur-sm text-[#2D241B]'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#9E773A] text-[9px] text-white font-medium shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Signature "Consult an Astrologer" Luxury Gold Pill Button */}
            <button
              onClick={() => scrollToSection('appointment')}
              className="consult-button hidden sm:flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F0DEC2] via-[#EAD4B0] to-[#E2C79E] hover:from-[#EAD4B0] hover:to-[#D8BC8E] py-2 pl-5 pr-2 shadow-sm transition-all duration-300 group border border-[#D5BB8E]"
            >
              <span className="font-serif text-[13px] font-medium text-[#221910] tracking-wide">
                Consult an Astrologer
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#221910] text-[#EAD4B0] transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>

            {/* Mobile Navigation Toggle Button */}
            <button
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors lg:hidden ${
                isScrolled
                  ? 'border border-[#E0D7C8] bg-white/80 text-[#29251F]'
                  : 'border border-white/50 bg-white/40 backdrop-blur-sm text-[#221910]'
              }`}
              aria-label="Toggle navigation menu"
              onClick={() => {
                playClick();
                setMenuOpen((open) => !open);
              }}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4 text-inherit" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <nav className="absolute left-4 right-4 top-[64px] rounded-2xl border border-[#E5DDD0] bg-[#FAF8F5]/98 p-5 shadow-2xl backdrop-blur-xl lg:hidden animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col divide-y divide-[#EFEAE1]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="w-full py-3.5 text-left font-serif text-[15px] font-medium text-[#2C251D] hover:text-[#9E773A] transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                </button>
              ))}
            </div>

            <div className="pt-4 mt-2 space-y-2.5">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  toggleCart();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E0D7C8] bg-white text-[#29251F] font-serif text-xs font-medium flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>View Sacred Bag ({cartCount})</span>
              </button>

              <button
                onClick={() => scrollToSection('appointment')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F0DEC2] to-[#E2C79E] text-[#221910] font-serif text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Consult an Astrologer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Luxury Interactive Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-start justify-center pt-24 px-4 sm:px-6">
          <div className="w-full max-w-2xl rounded-2xl border border-[#E5DDD0] bg-[#FAF8F5] shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DC]">
              <div className="flex items-center gap-2.5">
                <Search className="w-5 h-5 text-[#9E773A]" />
                <span className="font-serif text-sm uppercase tracking-[0.16em] text-[#8C6D37] font-semibold">
                  AstroLaabh Vedic Gemstone Finder
                </span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="w-8 h-8 rounded-full border border-[#E0D7C8] flex items-center justify-center hover:bg-black/5 text-[#5A5147]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4">
              <input
                type="text"
                autoFocus
                placeholder="Search natural gemstones, birthstones, astrological charts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#DFD6C7] rounded-xl px-4 py-3 font-serif text-base text-[#181512] placeholder-[#8A8177] focus:outline-none focus:border-[#9E773A] shadow-inner"
              />
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-serif tracking-wider uppercase text-[#8A8177] block mb-2">
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
                    className="px-3 py-1.5 rounded-full border border-[#E5DCD0] bg-white hover:border-[#9E773A] hover:bg-[#FAF4EB] text-xs font-serif text-[#332B22] transition-colors"
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
