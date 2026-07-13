import { MapPin, Phone, Mail, Link2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const ACADEMIC_LINKS = [
    { label: 'Admissions 2024-25', href: '#' },
    { label: 'Courses & Schemes', href: '#' },
    { label: 'Affiliated Colleges', href: '#' },
    { label: 'Academic Calendar', href: '#' },
    { label: 'University Ordinances', href: '#' },
  ];

  const RESOURCES_LINKS = [
    { label: 'Exam Results', href: '#' },
    { label: 'Time Table', href: '#' },
    { label: 'DigiLocker Portal', href: '#' },
    { label: 'Academic Bank of Credits (ABC)', href: '#' },
    { label: 'Central Library', href: '#' },
  ];

  const SOCIAL_LINKS = [
    {
      label: 'Facebook',
      href: '#',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: '#',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: '#',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: '#',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#001833] text-white/80 border-t border-white/10 select-none pt-12 pb-6">
      {/* Main Footer Links Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 pb-8 border-b border-white/5">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/DAVV_Logo.png"
                alt="DAVV logo"
                className="w-10 h-10 object-contain bg-white/10 p-1 rounded-lg"
              />
              <div>
                <h4 className="font-display font-black text-white text-sm sm:text-base uppercase tracking-wider leading-tight">
                  Devi Ahilya
                </h4>
                <h4 className="font-display font-black text-white/70 text-xs uppercase tracking-widest leading-none mt-0.5">
                  Vishwavidyalaya
                </h4>
              </div>
            </div>

            <p className="text-white/60 text-xs sm:text-[13px] leading-relaxed">
              Devi Ahilya Vishwavidyalaya (Indore), formerly Indore University,
              is a premier state university of Madhya Pradesh, India. Accredited
              with <strong className="text-[#F2A900]">NAAC A+ Grade</strong>.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2 pb-1">
              {SOCIAL_LINKS.map((social, idx) => {
                return (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-blue hover:border-blue transition-all"
                  >
                    {social.svg}
                  </a>
                );
              })}
            </div>

            {/* Last Updated */}
            <div className="pt-2 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/40 font-semibold tracking-wide uppercase">
              <span>Last Updated:</span>
              <span className="text-yellow-400/80 font-black">
                13 July 2026
              </span>
            </div>
          </div>

          {/* Column 2: Academics */}
          <div>
            <h4 className="font-display font-black text-white text-[13px] sm:text-sm uppercase tracking-wider mb-4 pb-2 border-b border-white/10 inline-block">
              Academics
            </h4>
            <ul className="space-y-2.5">
              {ACADEMIC_LINKS.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-yellow-400 text-xs sm:text-[13px] transition-colors flex items-center gap-2 group"
                  >
                    <Link2 className="w-3.5 h-3.5 text-yellow-400/60 group-hover:text-yellow-400 transition-colors" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-display font-black text-white text-[13px] sm:text-sm uppercase tracking-wider mb-4 pb-2 border-b border-white/10 inline-block">
              Student Resources
            </h4>
            <ul className="space-y-2.5">
              {RESOURCES_LINKS.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-yellow-400 text-xs sm:text-[13px] transition-colors flex items-center gap-2 group"
                  >
                    <Link2 className="w-3.5 h-3.5 text-yellow-400/60 group-hover:text-yellow-400 transition-colors" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h4 className="font-display font-black text-white text-[13px] sm:text-sm uppercase tracking-wider pb-2 border-b border-white/10 inline-block">
              Contact Details
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] mb-4">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span className="text-white/60 leading-relaxed">
                  Nalanda Campus, R.N.T. Marg, Indore, Madhya Pradesh, India -
                  452001
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-white/60 hover:text-white transition-colors">
                  +91-731-2527001, 2580135
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                <a
                  href="mailto:registrar.davv@mp.gov.in"
                  className="text-white/60 hover:text-yellow-400 transition-colors"
                >
                  registrar.davv@mp.gov.in
                </a>
              </li>
            </ul>

            {/* Visitor Counter */}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Visitor Count
              </span>
              <div className="flex items-center gap-1">
                {'0842795'.split('').map((char, index) => (
                  <span
                    key={index}
                    className="w-5.5 h-7.5 bg-white/5 border border-white/10 rounded flex items-center justify-center font-mono font-black text-yellow-400 text-xs shadow-3xs"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal links bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-white/50 text-center md:text-left">
            Devi Ahilya Vishwavidyalaya, Indore © {currentYear}. All Rights
            Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-white/50">
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Terms & Conditions
            </a>
            <span>•</span>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Help Desk
            </a>
            <span>•</span>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Site Map
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
