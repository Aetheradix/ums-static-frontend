import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { DAVV } from '../data';
import { davvUrls } from '../urls';

const NAV = [
  { label: 'Home', to: davvUrls.landing },
  { label: 'Campuses', to: davvUrls.directory },
];

export default function DavvHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-davv/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        <Link to={davvUrls.landing} className="flex items-center gap-3 min-w-0">
          <img
            src="/images/davv-logo.png"
            alt="DAVV emblem"
            className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
          />
          <span className="leading-tight min-w-0">
            <span className="block font-display font-bold text-navy text-[13px] md:text-base truncate">
              {DAVV.name}
            </span>
            <span className="block text-[10.5px] md:text-xs text-muted truncate">
              {DAVV.city} · Est. {DAVV.established}
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(item => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={clsx(
                  'text-sm font-semibold transition-colors',
                  active ? 'text-davv' : 'text-navy/70 hover:text-davv'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={davvUrls.selectUniversity}
            className="hidden sm:inline text-xs font-semibold text-muted hover:text-davv transition-colors"
          >
            Switch University
          </Link>
          <button
            onClick={() => navigate(davvUrls.directory)}
            className="inline-flex items-center bg-davv hover:bg-davv-dark text-white font-bold text-sm rounded-xl px-4 md:px-5 py-2.5 transition-colors shadow-sm"
          >
            Access Portal
          </button>
        </div>
      </div>
    </header>
  );
}
