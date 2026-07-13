import React from 'react';
import Topbar from '../components/Navigation/Topbar';
import Navbar from '../components/Navigation/Navbar';

interface CMSLayoutProps {
  children: React.ReactNode;
}

export default function CMSLayout({ children }: CMSLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-navy">
      {/* Navigation Headers */}
      <Topbar />
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-20">{children}</main>

      {/* Premium Footer */}
      <footer className="bg-[#001833] text-white/80 py-8 border-t border-white/10 text-center text-xs select-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/DAVV_Logo.png"
              alt="DAVV logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-white tracking-wide uppercase">
              Devi Ahilya Vishwavidyalaya, Indore © {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-white/60">
            Powered by Unified Campus Management System (CMS)
          </p>
        </div>
      </footer>
    </div>
  );
}
