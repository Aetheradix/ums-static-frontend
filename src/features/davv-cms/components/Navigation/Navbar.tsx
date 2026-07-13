import { useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../constants/data';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="bg-white text-navy border-b border-slate-200 sticky top-0 z-40 shadow-xs select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
        {/* Brand Logo & Titles */}
        <a href="/davv" className="flex items-center gap-3.5 group shrink-0">
          <img
            src="/DAVV_Logo.png"
            alt="Devi Ahilya Vishwavidyalaya Logo"
            className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:rotate-12 transition-transform duration-300"
          />
          <div className="text-left">
            <h1 className="font-display font-black text-[#002147] text-sm xs:text-base md:text-lg leading-tight uppercase tracking-tight">
              Devi Ahilya
            </h1>
            <h2 className="font-display font-bold text-[#002147] text-xs xs:text-sm leading-none uppercase tracking-wider">
              Vishwavidyalaya, Indore
            </h2>
            <p className="text-slate-500 font-hindi text-[9px] xs:text-[10px] leading-tight mt-1 tracking-wide">
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

              {/* Dropdown Card */}
              {activeDropdown === link.label && (
                <div className="absolute top-full left-0 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-50 animate-fadeIn">
                  {link.items.map(subItem => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue hover:bg-slate-50 rounded-xl transition-all"
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="#"
            className="px-3 py-2 text-xs xl:text-sm font-bold text-navy/90 hover:text-blue transition-colors"
          >
            Downloads
          </a>
          <a
            href="#"
            className="px-3 py-2 text-xs xl:text-sm font-bold text-navy/90 hover:text-blue transition-colors"
          >
            Contact Us
          </a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button className="w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center hover:bg-blue hover:scale-105 transition-all shadow-sm">
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-10 h-10 rounded-full bg-slate-100 text-navy flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white p-4 space-y-2 animate-slideDown shadow-inner">
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

              {activeDropdown === link.label && (
                <div className="pl-4 space-y-1.5 mt-1 bg-slate-50/50 rounded-xl p-2">
                  {link.items.map(subItem => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      className="block py-1.5 text-xs font-bold text-slate-600 hover:text-blue"
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="#"
            className="block py-2.5 text-sm font-bold text-navy border-b border-slate-100"
          >
            Downloads
          </a>
          <a href="#" className="block py-2.5 text-sm font-bold text-navy">
            Contact Us
          </a>
        </div>
      )}
    </header>
  );
}
