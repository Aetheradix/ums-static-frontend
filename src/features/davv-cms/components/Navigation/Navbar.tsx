import { ChevronDown, LogIn, Menu, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/data';

const MenuIcon = ({ icon: Icon }: { icon: any }) => {
  if (!Icon) return null;
  return <Icon className="w-4 h-4 shrink-0" />;
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as any;
      let scrollPos = 0;
      if (target === document || target === window || !target) {
        scrollPos =
          window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
      } else {
        scrollPos = (target as HTMLElement).scrollTop || 0;
      }
      setScrolled(scrollPos > 10);
    };

    // Use capture: true to intercept all scroll events (since scroll doesn't bubble)
    window.addEventListener('scroll', handleScroll, true);

    // Initial check
    const initialPos =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    setScrolled(initialPos > 10);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 transition-all duration-350 select-none border-b border-slate-200/50"
        style={{
          backgroundColor: scrolled
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgb(255, 255, 255)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          className={`max-w-[1400px] mx-auto px-3 sm:px-6 flex justify-between items-center transition-all duration-350 ${
            scrolled ? 'py-1.5 sm:py-2.5' : 'py-2 sm:py-3.5'
          }`}
        >
          {/* Brand Logo & Titles */}
          <a
            href="/davv"
            className="flex items-center gap-2 sm:gap-3.5 shrink-0 min-w-0"
          >
            <img
              src="/DAVV_Logo.png"
              alt="Devi Ahilya Vishwavidyalaya Logo"
              className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
            />
            <img
              src="/davv-cms/crousel/Devi-ahilya.png"
              alt="Devi Ahilya"
              className="hidden sm:block w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain rounded-full"
            />
            <div className="text-left">
              <h1 className="font-display font-black text-[#002147] text-[9px] xs:text-xs sm:text-sm md:text-lg leading-tight uppercase tracking-tight">
                Devi Ahilya
              </h1>
              <h2 className="font-display font-bold text-[#002147] text-[7.5px] xs:text-[10px] sm:text-xs md:text-sm leading-none uppercase tracking-wider block">
                Vishwavidyalaya, Indore
              </h2>
              <p className="text-slate-500 font-hindi text-[7px] xs:text-[9px] md:text-[10px] leading-tight mt-0.5 sm:mt-1 tracking-wide hidden xs:block">
                धियो यो नः प्रचोदयात्
              </p>
            </div>
          </a>

          {/* Desktop Menu links */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {NAV_LINKS.map(link => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-bold text-navy/90 hover:text-blue transition-colors rounded-lg hover:bg-slate-50">
                  {link.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                {activeDropdown === link.label &&
                  link.megaMenu &&
                  link.columns && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl shadow-xl p-5 z-50 animate-fadeIn w-[620px]">
                      <div
                        className="grid gap-6"
                        style={{
                          gridTemplateColumns: `repeat(${link.columns.length}, 1fr)`,
                        }}
                      >
                        {link.columns.map(col => (
                          <div key={col.title}>
                            <h3 className="text-[#F2A900] font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              {col.title}
                            </h3>
                            <ul className="space-y-0.5">
                              {col.items.map(item => (
                                <li key={item.label}>
                                  <a
                                    href={item.href}
                                    className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-slate-700 hover:text-white hover:bg-blue rounded-lg transition-all group/item"
                                  >
                                    {item.icon && (
                                      <span className="text-slate-400 group-hover/item:text-white transition-colors duration-150">
                                        <MenuIcon icon={item.icon} />
                                      </span>
                                    )}
                                    {item.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
            <a
              href="#"
              className="px-3 py-2 text-xs xl:text-sm font-bold text-navy/90 hover:text-blue transition-colors"
            >
              Contact Us
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 rounded-full bg-slate-100 text-navy flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            {/* Access Portal Button */}
            <Link
              to="/davv/access-portal"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#002147] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue hover:scale-105 transition-all shadow-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Access Portal</span>
            </Link>
            <Link
              to="/davv/access-portal"
              className="sm:hidden w-10 h-10 rounded-xl bg-[#002147] text-white flex items-center justify-center hover:bg-blue hover:scale-105 transition-all shadow-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden w-10 h-10 rounded-full bg-slate-100 text-navy flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar with smooth slide-down animation */}
        <div
          className={`border-t border-slate-200 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
            searchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-2xl mx-auto px-4 py-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                console.log('Search:', searchQuery);
              }}
              className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/10 transition-all"
            >
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Results, Notices, Courses..."
                className="w-full bg-transparent outline-none text-navy text-sm md:text-base py-1"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-navy p-1 rounded-lg hover:bg-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Sidebar — fixed, z-50, rendered outside <header> to avoid stacking context issues */}
      {mobileMenuOpen && (
        <>
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={closeMobile}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 overflow-y-auto p-5 space-y-2 animate-slideInRight">
            {/* Header with close */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <img
                  src="/DAVV_Logo.png"
                  alt="DAVV"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-xs text-[#002147] uppercase leading-tight">
                  DAVV, Indore
                </span>
              </div>
              <button
                onClick={closeMobile}
                className="w-8 h-8 rounded-lg bg-slate-100 text-navy flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            {NAV_LINKS.map(link => (
              <div key={link.label} className="border-b border-slate-100 pb-2">
                <button
                  onClick={() => toggleDropdown(link.label)}
                  className="w-full flex justify-between items-center py-2 text-sm font-bold text-navy text-left"
                >
                  {link.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                  />
                </button>

                {activeDropdown === link.label &&
                  link.megaMenu &&
                  link.columns && (
                    <div className="pl-4 mt-2 space-y-3 bg-slate-50/50 rounded-lg p-3">
                      {link.columns.map(col => (
                        <div key={col.title}>
                          <h4 className="text-[#F2A900] font-bold text-xs uppercase tracking-wider mb-1.5">
                            {col.title}
                          </h4>
                          <div className="space-y-0.5">
                            {col.items.map(item => (
                              <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-2 py-1.5 px-2 text-xs font-semibold text-slate-600 hover:text-blue rounded-md transition-all"
                              >
                                {item.icon && (
                                  <span className="shrink-0 text-slate-400">
                                    <MenuIcon icon={item.icon} />
                                  </span>
                                )}
                                {item.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
            <a
              href="#"
              className="block py-2.5 text-sm font-bold text-navy border-b border-slate-100"
            >
              Contact Us
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-[#002147] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Access Portal</span>
            </a>
          </div>
        </>
      )}
    </>
  );
}
