import { useState, useEffect } from 'react';
import { Moon, ExternalLink, Globe } from 'lucide-react';
import { TOPBAR_LINKS } from '../../constants/data';
import { useLanguage } from '../../../../shared/context/useLanguage';

export default function Topbar() {
  const [fontSize, setFontSizeState] = useState<'small' | 'normal' | 'large'>(
    'normal'
  );

  const { language, toggleLanguage, t } = useLanguage();
  const isHindi = language === 'hi';

  useEffect(() => {
    const saved = localStorage.getItem('davv-cms-font-size') as
      | 'small'
      | 'normal'
      | 'large'
      | null;
    if (saved) {
      setFontSizeState(saved);
      applyFontSize(saved);
    }
  }, []);

  // Update document attributes/classes for language and font compatibility
  useEffect(() => {
    if (language === 'hi') {
      document.documentElement.classList.add('lang-hi');
      document.documentElement.lang = 'hi';
    } else {
      document.documentElement.classList.remove('lang-hi');
      document.documentElement.lang = 'en';
    }
  }, [language]);

  const applyFontSize = (size: 'small' | 'normal' | 'large') => {
    let percentage = '100%';
    if (size === 'small') percentage = '90%';
    if (size === 'large') percentage = '110%';
    document.documentElement.style.fontSize = percentage;
  };

  const changeFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSizeState(size);
    applyFontSize(size);
    localStorage.setItem('davv-cms-font-size', size);
  };

  return (
    <div className="bg-[#002147] text-white text-[10px] xs:text-xs py-1.5 xs:py-2 px-4 sm:px-8 md:px-12 border-b border-white/10 select-none z-50 relative">
      <div className="w-full flex justify-between items-center gap-1">
        {/* Left Side: NAAC Grade Indicator */}
        <div className="flex items-center gap-1 xs:gap-2 shrink-0">
          <span className="text-[8px] xs:text-[10px] text-white/70 uppercase tracking-widest font-semibold hidden sm:inline">
            {t('Official University Portal — NAAC, A+ Grade')}
          </span>
        </div>

        {/* Right Side: Logins and Controls */}
        <div className="flex items-center gap-2 xs:gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
          <ul className="flex items-center gap-1 xs:gap-3 sm:gap-5">
            {TOPBAR_LINKS.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="group inline-flex items-center gap-1 hover:text-amber-400 transition-colors text-[9px] xs:text-[11px] sm:text-xs text-white/90 hover:underline py-0.5 xs:py-1 whitespace-nowrap"
                >
                  {t(link.label)}
                  <ExternalLink className="w-2.5 h-2.5 xs:w-3 xs:h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="h-3 xs:h-4 w-px bg-white/20 shrink-0" />

          {/* Lang Selector & Mode Toggle */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 shrink-0">
            {/* Font Size Controls */}
            <div className="flex items-center gap-1.5 xs:gap-2 border-r border-white/20 pr-2 xs:pr-3 mr-0.5 xs:mr-1 shrink-0">
              <button
                onClick={() => changeFontSize('small')}
                className={`hover:text-amber-400 font-semibold transition-colors text-[9px] xs:text-[11px] sm:text-xs px-0.5 ${fontSize === 'small' ? 'text-amber-400 font-bold' : 'text-white/90'}`}
                title="Decrease Font Size"
              >
                A<sup>-</sup>
              </button>
              <button
                onClick={() => changeFontSize('normal')}
                className={`hover:text-amber-400 font-semibold transition-colors text-[9px] xs:text-[11px] sm:text-xs px-0.5 ${fontSize === 'normal' ? 'text-amber-400 font-bold' : 'text-white/90'}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => changeFontSize('large')}
                className={`hover:text-amber-400 font-semibold transition-colors text-[9px] xs:text-[11px] sm:text-xs px-0.5 ${fontSize === 'large' ? 'text-amber-400 font-bold' : 'text-white/90'}`}
                title="Increase Font Size"
              >
                A<sup>+</sup>
              </button>
            </div>

            {/* Language Toggle Button (Switches global i18n context) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors text-[9px] xs:text-[11px] sm:text-xs whitespace-nowrap cursor-pointer font-bold border border-white/10 rounded-lg px-2 py-0.5 bg-white/5 hover:bg-white/10"
              title={isHindi ? 'Switch to English' : 'हिन्दी में बदलें'}
            >
              <Globe className="w-2.5 h-2.5 xs:w-3.5 xs:h-3.5 text-amber-400" />
              <span>{isHindi ? 'हिन्दी' : 'English'}</span>
            </button>

            <button className="hover:text-amber-400 transition-colors py-0.5">
              <Moon className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
