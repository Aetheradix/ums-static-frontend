import { NavLink, Outlet } from 'react-router-dom';
import { vfUrls } from '../urls';

/** DAVV-branded chrome for the public registration forum — no sign-in. */
export default function PublicShell() {
  const tab = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/15 text-white'
        : 'text-blue-100 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b-4 border-amber-400 bg-gradient-to-r from-[#0d3b6e] to-[#1a5fa8] text-white">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-amber-300">
              DEVI AHILYA VISHWAVIDYALAYA, INDORE
            </p>
            <h1 className="text-xl font-bold sm:text-2xl">
              Visiting Faculty Portal
            </h1>
            <p className="flex items-center gap-1 text-sm text-blue-100">
              <i className="pi pi-file text-xs" /> University Teaching
              Departments — Registration &amp; Remuneration
            </p>
          </div>
          <nav className="flex gap-2">
            <NavLink to={vfUrls.public.register} end className={tab}>
              Registration
            </NavLink>
            <NavLink to={vfUrls.public.track} className={tab}>
              Track Application
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        © Devi Ahilya Vishwavidyalaya, Indore · Integrated University Management
        System
      </footer>
    </div>
  );
}
