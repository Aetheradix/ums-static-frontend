import { useEffect } from 'react';
import type { ReactNode } from 'react';
import DavvHeader from '../components/DavvHeader';
import DavvFooter from '../components/DavvFooter';

// Shell for the DAVV CMS content pages (landing, directory). Wrapped in `octagon-theme`
// so it inherits Octagon's design tokens/typography/utility classes exactly.
export default function DavvLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="octagon-theme min-h-screen bg-slate-50 text-navy flex flex-col">
      <DavvHeader />
      <main className="flex-1">{children}</main>
      <DavvFooter />
    </div>
  );
}
