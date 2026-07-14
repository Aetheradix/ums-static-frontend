import { ChevronDown, LogIn, Menu, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../shared/context/useLanguage';
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
  const isDark = false;

  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as any;
      const isMainElement =
        target === document ||
        target === document.documentElement ||
        target === document.body ||
        target.id === 'main-cms-scroll-container';

      if (!isMainElement) return;

      const scrollTop = target.scrollTop || window.scrollY;
      if (scrollTop > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(prev => (prev === label ? null : label));
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/80 transition duration-300 ${
          scrolled
            ? 'shadow-md shadow-slate-100/50 dark:shadow-slate-900/50'
            : ''
        }`}
        style={{
          backgroundColor: isDark
            ? scrolled
              ? 'rgba(15, 23, 42, 0.85)'
              : 'rgba(15, 23, 42, 0.9)'
            : scrolled
              ? 'rgba(255, 255, 255, 0.85)'
              : undefined,
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          className={`w-full px-4 sm:px-8 md:px-12 flex justify-between items-center transition-all duration-350 ${
            scrolled ? 'py-1.5 sm:py-2.5' : 'py-2 sm:py-3.5'
          }`}
        >
          {/* Brand Logo & Titles */}
          <Link
            to="/davv"
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
              <h1 className="font-display font-black text-[#002147] dark:text-white text-[9px] xs:text-xs sm:text-sm md:text-lg leading-tight uppercase tracking-tight">
                {t('Devi Ahilya')}
              </h1>
              <h2 className="font-display font-bold text-[#002147] dark:text-white text-[7.5px] xs:text-[10px] sm:text-xs md:text-sm leading-none uppercase tracking-wider block">
                {t('Vishwavidyalaya, Indore')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-hindi text-[7px] xs:text-[9px] md:text-[10px] leading-tight mt-0.5 sm:mt-1 tracking-wide hidden xs:block">
                धियो यो नः प्रचोदयात्
              </p>
            </div>
          </Link>

          {/* Desktop Menu links */}
          <nav className="hidden xl:flex items-center gap-1">
            <Link
              to="/davv"
              className="flex items-center px-3 py-2 text-xs xl:text-sm font-bold text-[#002147] dark:text-white hover:text-blue dark:hover:text-blue hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer mr-1"
              title="Home"
            >
              <span>{t('Home')}</span>
            </Link>

            {NAV_LINKS.map(link => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-bold text-navy/90 dark:text-white/90 hover:text-blue dark:hover:text-blue transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                  {t(link.label)}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                {activeDropdown === link.label &&
                  link.megaMenu &&
                  link.columns && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl dark:shadow-slate-900/50 p-5 z-50 animate-fadeIn w-[620px]">
                      <div
                        className="grid gap-6"
                        style={{
                          gridTemplateColumns: `repeat(${link.columns.length}, 1fr)`,
                        }}
                      >
                        {link.columns.map(col => (
                          <div key={col.title}>
                            <h3 className="text-[#F2A900] font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              {t(col.title)}
                            </h3>
                            <ul className="space-y-0.5">
                              {col.items.map(item => (
                                <li key={item.label}>
                                  <a
                                    href={item.href}
                                    className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-white hover:bg-blue dark:hover:bg-blue rounded-lg transition-all group/item"
                                  >
                                    {item.icon && (
                                      <span className="text-slate-400 dark:text-slate-500 group-hover/item:text-white transition-colors duration-150">
                                        <MenuIcon icon={item.icon} />
                                      </span>
                                    )}
                                    {t(item.label)}
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
              className="px-3 py-2 text-xs xl:text-sm font-bold text-navy/90 dark:text-white/90 hover:text-blue dark:hover:text-blue transition-colors"
            >
              {t('Contact Us')}
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-navy dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {/* Access Portal Button */}
            <Link
              to="/davv/access-portal"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#002147] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue hover:scale-105 transition-all shadow-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('Access Portal')}</span>
            </Link>
            <Link
              to="/davv/access-portal"
              className="sm:hidden w-8 h-8 rounded-lg bg-[#002147] text-white flex items-center justify-center hover:bg-blue hover:scale-105 transition-all shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-navy dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Bar — appears directly below the navbar */}
      {searchOpen && (
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50">
          <div className="w-full px-4 sm:px-8 md:px-12 py-3 sm:py-4">
            <div className="flex items-center gap-3 max-w-4xl mx-auto border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-800 shadow-sm focus-within:border-blue focus-within:ring-1 focus-within:ring-blue/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('Search courses, departments, services...')}
                className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
            onClick={closeMobile}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-900/80 z-50 overflow-y-auto p-5 space-y-2 animate-slideInRight">
            {/* Header with close */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <img
                  src="/DAVV_Logo.png"
                  alt="DAVV"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-xs text-[#002147] dark:text-white uppercase leading-tight">
                  DAVV, Indore
                </span>
              </div>
              <button
                onClick={closeMobile}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-navy dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <Link
              to="/davv"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center py-2.5 text-sm font-bold text-navy dark:text-white border-b border-slate-100 dark:border-slate-700"
            >
              <span>{t('Home')}</span>
            </Link>

            {NAV_LINKS.map(link => (
              <div
                key={link.label}
                className="border-b border-slate-100 dark:border-slate-700 pb-2"
              >
                <button
                  onClick={() => toggleDropdown(link.label)}
                  className="w-full flex justify-between items-center py-2 text-sm font-bold text-navy dark:text-white text-left"
                >
                  {t(link.label)}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                  />
                </button>

                {activeDropdown === link.label &&
                  link.megaMenu &&
                  link.columns && (
                    <div className="pl-4 mt-2 space-y-3 bg-slate-50/50 dark:bg-slate-700/50 rounded-lg p-3">
                      {link.columns.map(col => (
                        <div key={col.title}>
                          <h4 className="text-[#F2A900] font-bold text-xs uppercase tracking-wider mb-1.5">
                            {t(col.title)}
                          </h4>
                          <div className="space-y-0.5">
                            {col.items.map(item => (
                              <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-2 py-1.5 px-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue dark:hover:text-blue rounded-md transition-all"
                              >
                                {item.icon && (
                                  <span className="shrink-0 text-slate-400 dark:text-slate-500">
                                    <MenuIcon icon={item.icon} />
                                  </span>
                                )}
                                {t(item.label)}
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
              className="block py-2.5 text-sm font-bold text-navy dark:text-white border-b border-slate-100 dark:border-slate-700"
            >
              {t('Contact Us')}
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-[#002147] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('Access Portal')}</span>
            </a>
          </div>
        </>
      )}
    </>
  );
}
