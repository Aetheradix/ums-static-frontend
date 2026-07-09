import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Home, LayoutGrid, Info, PhoneCall, FileText } from 'lucide-react';
import { NAV_LINKS } from '../../constants/data';
import Button from '../ui/Button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(() => {
    return typeof window !== 'undefined' && window.scrollY > 20;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Determine if the current page has a dark hero background and we are at the top
  const isDarkHero = false;
  const useLightText = isDarkHero && !isScrolled;

  // Pages other than Home — navbar should always be white
  const isLightPage = pathname !== '/cms';

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 w-full z-100 transition-all duration-500 navbar',
        isScrolled || isLightPage
          ? 'bg-white/80 backdrop-blur-xl h-16 md:h-20 shadow-lg border-b border-border/50'
          : 'bg-transparent h-20 md:h-28'
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/cms" className="flex items-center group">
          <img
            src="/Octagon_Logo.png"
            alt="OCTAGON ERP Logo"
            className={clsx(
              'transition-all duration-500 object-contain',
              isScrolled ? 'h-8 md:h-10' : 'h-10 md:h-12',
              useLightText ? 'brightness-0 invert' : ''
            )}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'relative text-[13px] font-black uppercase tracking-[0.2em] transition-colors duration-500 py-2',
                  isActive
                    ? 'text-blue'
                    : useLightText
                      ? 'text-white/80 hover:text-white'
                      : 'text-navy/70 hover:text-blue'
                )}
              >
                {link.label}
                {/* Active Indicator / Underline */}
                <span
                  className={clsx(
                    'absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue transition-all duration-500',
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  )}
                />
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Button
            href="/login"
            size={isScrolled ? 'sm' : 'md'}
            variant={useLightText ? 'white-outline' : 'ghost'}
            className={
              useLightText ? '' : 'border border-border/80 hover:border-blue/30'
            }
          >
            Sign In
          </Button>
          <Button
            href="/contact"
            size={isScrolled ? 'sm' : 'md'}
            className="shadow-glow"
            variant={useLightText ? 'outline' : 'primary'}
          >
            Request Demo
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={clsx(
            'lg:hidden p-2 focus:outline-none transition-colors duration-300',
            useLightText ? 'text-white' : 'text-navy'
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-6 h-5 relative flex flex-col justify-between overflow-hidden">
            <span
              className={clsx(
                'w-full h-0.5 bg-current transition-transform duration-300 origin-left',
                isMobileMenuOpen && 'rotate-45'
              )}
            />
            <span
              className={clsx(
                'w-full h-0.5 bg-current transition-opacity duration-300',
                isMobileMenuOpen && 'opacity-0'
              )}
            />
            <span
              className={clsx(
                'w-full h-0.5 bg-current transition-transform duration-300 origin-left',
                isMobileMenuOpen && '-rotate-45'
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          'lg:hidden absolute top-full left-0 w-full bg-white border-b border-border transition-all duration-500 ease-in-out overflow-hidden shadow-2xl',
          isMobileMenuOpen
            ? 'max-h-screen opacity-100 py-3'
            : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col gap-1 px-4 pb-4">
          {NAV_LINKS.map(link => {
            const getIcon = (href: string) => {
              switch (href) {
                case '/cms':
                  return <Home className="w-4 h-4" />;
                case '/cms/solutions':
                  return <LayoutGrid className="w-4 h-4" />;
                case '/cms/about':
                  return <Info className="w-4 h-4" />;
                case '/cms/contact':
                  return <PhoneCall className="w-4 h-4" />;
                case '/cms/public-grievance':
                  return <FileText className="w-4 h-4" />;
                default:
                  return null;
              }
            };

            return (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'flex items-center gap-3 text-sm font-semibold py-2 px-3 rounded-lg transition-colors',
                  pathname === link.href
                    ? 'bg-blue/5 text-blue'
                    : 'text-navy hover:bg-slate-50'
                )}
              >
                <span
                  className={clsx(
                    'p-1.5 rounded-md',
                    pathname === link.href
                      ? 'bg-blue/10 text-blue'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {getIcon(link.href)}
                </span>
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            <Button
              href="/login"
              className="w-full border border-border/80 hover:border-blue/30"
              size="sm"
              variant="ghost"
            >
              Sign In
            </Button>
            <Button href="/contact" className="w-full" size="sm">
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
