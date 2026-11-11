import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../../../store/useCartStore';
import { navigateToCart, navigateToProduct } from '../../../lib/navigation';
import { useSoundEffects } from '../../../hooks/useSoundEffects';

// Real authentic Vedic gemstones for navigation and menu
import blueSapphire from '../../../assets/sapphire.webp';
import diamond from '../../../assets/diamond.webp';
import emerald from '../../../assets/emerald.webp';
import pearl from '../../../assets/pearl.webp';
import ruby from '../../../assets/ruby.webp';
import yellowSapphire from '../../../assets/gold.webp';
import moonga from '../../../assets/moonga.webp';
import gomed from '../../../assets/gomed.webp';
import lehsunia from '../../../assets/lehsunia.webp';

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

const productNavLinks: NavLinkItem[] = [
  { label: 'Gemstones', id: 'gemstone-collection', hasDropdown: true },
  { label: 'The Stone', id: 'details' },
  { label: 'Our Promise', id: 'journey' },
  { label: 'Vedic Wisdom', id: 'ritual' },
];

interface NavaratnaGem {
  id: string;
  name: string;
  eng: string;
  planet: string;
  color: string;
  image: string;
  badge?: string;
}

const navaratnaGems: NavaratnaGem[] = [
  { id: 'yellow-sapphire', name: 'Pukhraj', eng: 'Yellow Sapphire', planet: 'Jupiter', color: '#D4A338', image: yellowSapphire, badge: 'TOP' },
  { id: 'blue-sapphire', name: 'Neelam', eng: 'Blue Sapphire', planet: 'Saturn', color: '#254E9B', image: blueSapphire },
  { id: 'ruby', name: 'Manik', eng: 'Ruby', planet: 'Sun', color: '#C02636', image: ruby },
  { id: 'emerald', name: 'Panna', eng: 'Emerald', planet: 'Mercury', color: '#1B8A5A', image: emerald },
  { id: 'diamond', name: 'Heera', eng: 'Diamond', planet: 'Venus', color: '#7EA2C7', image: diamond },
  { id: 'red-coral', name: 'Moonga', eng: 'Red Coral', planet: 'Mars', color: '#C23D2E', image: moonga },
  { id: 'pearl', name: 'Moti', eng: 'Pearl', planet: 'Moon', color: '#E8E2D2', image: pearl },
  { id: 'hessonite', name: 'Gomed', eng: 'Hessonite', planet: 'Rahu', color: '#A85A2A', image: gomed },
  { id: 'cats-eye', name: 'Lehsunia', eng: "Cat's Eye", planet: 'Ketu', color: '#8A9E38', image: lehsunia },
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

export function Navbar({ productPage = false, bagCountOverride, onBagClick }: { productPage?: boolean; bagCountOverride?: number; onBagClick?: () => void }) {
  const menuRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gemstonesDropdownOpen, setGemstonesDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navItemRef = useRef<HTMLDivElement | null>(null);

  const items = useCartStore((s) => s.items);
  const { playHover, playClick } = useSoundEffects();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const visibleCartCount = bagCountOverride ?? cartCount;
  const visibleNavLinks = productPage ? productNavLinks : navLinks;

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const menu = menuRef.current;
    menu?.querySelector<HTMLElement>('button, a')?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); return; }
      if (event.key !== 'Tab' || !menu) return;
      const controls = Array.from(menu.querySelectorAll<HTMLElement>('button, a[href], input'));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const desktop = matchMedia('(min-width: 1280px)');
    const resize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', resize);
    document.addEventListener('keydown', keyboard);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', keyboard);
      desktop.removeEventListener('change', resize);
      menuToggleRef.current?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        navItemRef.current &&
        !navItemRef.current.contains(target)
      ) {
        setGemstonesDropdownOpen(false);
      }
    };
    if (gemstonesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [gemstonesDropdownOpen]);

  // Active section observation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = productPage ? ['details', 'journey', 'ritual'] : ['hero', 'narrative', 'gemstone-collection', 'gallery', 'ways-to-wear', 'appointment'];
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
  }, [productPage]);

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

    if (id === 'find-gem') { window.location.assign('/#find-gem'); return; }
    if (id === 'appointment') { window.location.assign('/find-gem#consultation'); return; }
    const el = document.getElementById(id);
    if (!el) { window.location.assign('/#' + id); return; }
    if (el) {
      const navOffset = 76;
      const targetPosition = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  const openGemstone = (id: string) => {
    playClick(); setMenuOpen(false); setSearchOpen(false); setGemstonesDropdownOpen(false); navigateToProduct(id);
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
      <header className="site-navbar fixed left-0 top-0 z-50 w-full bg-[#FAF8F5] border-b border-[#E2D8C8] shadow-[0_2px_16px_rgba(24,21,18,0.06)] transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 h-[72px] sm:h-[78px] flex items-center justify-between">
          
          {/* Brand Logo (Official Gold Master Logo) */}
          <div className="flex items-center">
            <a
              href={productPage ? '/' : '#hero'}
              className="flex items-center select-none transition-transform duration-300 hover:scale-[1.02]"
              onMouseEnter={playHover}
              onClick={(e) => {
                e.preventDefault();
                if (productPage) { window.location.href = '/'; return; }
                scrollToSection('hero');
              }}
              aria-label="ASTROLAABH - Vedic Gemstones"
            >
              <img
                src="/astrolaabh-logo.png"
                alt="ASTROLAABH"
                className="h-9 sm:h-10 lg:h-11 w-auto object-contain select-none filter drop-shadow-sm"
              />
            </a>
          </div>

          {/* Center Navigation Links with Dropdown */}
          <nav className="hidden xl:flex items-center gap-7 xl:gap-9 relative">
            {visibleNavLinks.map((link) => {
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
                      onClick={(e) => {
                        e.preventDefault();
                        playClick();
                        setGemstonesDropdownOpen(true);
                      }}
                      aria-expanded={gemstonesDropdownOpen}
                      className={`font-serif text-[13px] xl:text-[13.5px] tracking-[0.18em] uppercase transition-colors whitespace-nowrap py-2 flex items-center gap-2 group select-none ${
                        isActive
                          ? 'text-[#9E773A] font-bold'
                          : 'text-[#181512] hover:text-[#9E773A] font-semibold'
                      }`}
                    >
                      {/* Very small authentic real gemstone in navbar */}
                      <span className="relative flex items-center justify-center w-3.5 h-3.5 flex-shrink-0">
                        <img
                          src={ruby}
                          alt=""
                          aria-hidden="true"
                          className="w-3.5 h-3.5 object-contain filter drop-shadow-[0_1px_2px_rgba(216,27,67,0.35)] transition-transform duration-300 group-hover:scale-125"
                        />
                      </span>
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
                        ref={dropdownRef}
                        className="fixed left-1/2 -translate-x-1/2 top-[72px] sm:top-[76px] w-[95vw] max-w-[1180px] bg-[#FAF8F5] border border-[#DFD6C7] shadow-[0_24px_60px_rgba(24,21,18,0.18)] rounded-2xl p-6 sm:p-8 z-50 animate-in fade-in slide-in-from-top-2 duration-150 before:absolute before:-top-3 before:left-0 before:w-full before:h-3"
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
                                  A few thoughtful questions to begin your personal gemstone journey.
                                </p>
                              </div>
                              <button
                                onClick={() => scrollToSection('find-gem')}
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
                                  onClick={() => openGemstone(gem.id)}
                                  className="p-2.5 rounded-xl hover:bg-[#F3EDE2] border border-transparent hover:border-[#E0D7C8] transition-all flex items-center justify-between text-left group"
                                >
                                  <div className="flex items-center gap-2.5">
                                    {/* Real authentic gemstone thumbnail in luxury micro-bezel */}
                                    <div className="w-6 h-6 rounded-md bg-[#FAF8F5] border border-[#E4DCCF] flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm group-hover:border-[#9E773A] transition-colors">
                                      <img
                                        src={gem.image}
                                        alt={gem.name}
                                        className="w-4.5 h-4.5 max-h-5 object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-125"
                                      />
                                    </div>
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
                                    onClick={() => openGemstone(navaratnaGems.find(gem => gem.name.toUpperCase() === item.stone)!.id)}
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
                onBagClick ? onBagClick() : navigateToCart();
              }}
              className="relative h-10 w-10 rounded-full border border-[#DFD6C7] bg-[#F5EDE1] hover:bg-[#ECE1D0] text-[#181512] transition-all flex items-center justify-center shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              {visibleCartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#181512] text-[9px] text-[#EAD4B0] font-bold shadow-sm">
                  {visibleCartCount}
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
              className="grid h-10 w-10 place-items-center rounded-full border border-[#DFD6C7] bg-[#F5EDE1] text-[#181512] xl:hidden"
              ref={menuToggleRef}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
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
          <nav ref={menuRef} id="mobile-navigation" aria-label="Mobile navigation" data-lenis-prevent className="mobile-navigation absolute left-4 right-4 top-[78px] rounded-2xl border border-[#DFD6C7] bg-[#FAF8F5] p-6 shadow-2xl xl:hidden">
            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><span>Explore AstroLaabh</span><X size={20} /></button>
            <div className="flex flex-col divide-y divide-[#EFEAE1]">
              {visibleNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="w-full py-4 text-left font-serif text-[16px] font-bold text-[#181512] hover:text-[#9E773A] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    {link.hasDropdown && (
                      <img
                        src={ruby}
                        alt=""
                        aria-hidden="true"
                        className="w-4 h-4 object-contain filter drop-shadow-[0_1px_2px_rgba(216,27,67,0.35)]"
                      />
                    )}
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </div>

            <div className="pt-4 mt-2 space-y-3">
              <div className="grid grid-cols-3 gap-2" aria-label="Gemstone product pages">
                {navaratnaGems.map(gem => <button key={gem.id} onClick={() => openGemstone(gem.id)} className="flex flex-col items-center gap-2 rounded-lg border border-[#DFD6C7] p-2 text-xs text-[#332C24]"><img src={gem.image} alt="" className="h-6 w-6 object-contain" />{gem.name}</button>)}
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onBagClick ? onBagClick() : navigateToCart();
                }}
                className="w-full py-3 px-4 rounded-xl border border-[#DFD6C7] bg-[#F5EDE1] text-[#181512] font-serif text-sm font-bold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>View Sacred Bag ({visibleCartCount})</span>
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
                      const gem = navaratnaGems.find(item => tag.startsWith(item.eng));
                      if (gem) openGemstone(gem.id);
                      else scrollToSection('appointment');
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
