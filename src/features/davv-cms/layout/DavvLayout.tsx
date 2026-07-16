import { useEffect } from 'react';
import type { ReactNode } from 'react';
import DavvHeader from '../components/DavvHeader';
import DavvFooter from '../components/DavvFooter';

// Shell for the DAVV CMS content pages (landing, directory). Wrapped in `octagon-theme`
// so it inherits Octagon's design tokens/typography/utility classes exactly.
export default function DavvLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, []);

  // Force removal of dark mode class to run strictly in light mode
  useEffect(() => {
    document.body.classList.remove('dark');
  }, []);

  return (
    <div className="davv-cms-root octagon-theme min-h-screen bg-slate-50 dark:bg-slate-950 text-navy dark:text-slate-100 flex flex-col transition-colors duration-300">
      <DavvHeader />
      <main className="flex-1">{children}</main>
      <DavvFooter />
    </div>
  );
}
