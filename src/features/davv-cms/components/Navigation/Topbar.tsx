import { Moon, ChevronDown } from 'lucide-react';
import { TOPBAR_LINKS } from '../../constants/data';

export default function Topbar() {
  return (
    <div className="bg-[#002147] text-white text-xs py-2 px-4 border-b border-white/10 select-none z-50 relative">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Left Side: Empty or tiny indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] text-white/70 uppercase tracking-widest font-semibold hidden sm:inline">
            Official University Portal
          </span>
        </div>

        {/* Right Side: Logins and Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="flex flex-wrap items-center gap-3 sm:gap-5">
            {TOPBAR_LINKS.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-amber-400 transition-colors text-[11px] sm:text-xs text-white/90 hover:underline py-1 block"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="h-4 w-px bg-white/20 hidden xs:block" />

          {/* Lang Selector & Mode Toggle */}
          <div className="flex items-center gap-3 xs:gap-4">
            <button className="flex items-center gap-1 hover:text-amber-400 transition-colors text-[11px] sm:text-xs">
              English
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="hover:text-amber-400 transition-colors py-0.5">
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
