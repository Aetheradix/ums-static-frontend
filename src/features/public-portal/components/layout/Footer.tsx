import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white md:pt-20 md:pb-10 py-5 relative overflow-hidden border-t border-slate-900">
      {/* Premium ambient glows in background */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-5 md:mb-16">
          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
            <Link to="/cms" className="inline-block">
              <img
                src="/Octagon_Logo.png"
                alt="OCTAGON ERP Logo"
                className="h-8 sm:h-9 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-slate-400 text-[12px] sm:text-[13px] leading-relaxed max-w-xs">
              Empowering academic excellence with STQC-certified governance,
              real-time BI analytics, and integrated university administration.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon="linkedin" />
              <SocialIcon icon="twitter" />
              <SocialIcon icon="github" />
              <SocialIcon icon="instagram" />
              <SocialIcon icon="facebook" />
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div className="col-span-1">
            <h4 className="font-display text-sm sm:text-base font-bold mb-4 sm:mb-6 text-white tracking-wide">
              Solutions
            </h4>
            <ul className="space-y-2.5 sm:space-y-3.5">
              <FooterLink label="Academic Management" href="/cms/solutions" />
              <FooterLink label="Governance & Admin" href="/cms/solutions" />
              <FooterLink label="Finance & Fees" href="/cms/solutions" />
              <FooterLink
                label="HR & Employee Lifecycle"
                href="/cms/solutions"
              />
              <FooterLink
                label="Analytics & BI Dashboards"
                href="/cms/solutions"
              />
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="col-span-1">
            <h4 className="font-display text-sm sm:text-base font-bold mb-4 sm:mb-6 text-white tracking-wide">
              Company
            </h4>
            <ul className="space-y-2.5 sm:space-y-3.5">
              <FooterLink label="About Us" href="/cms/about" />
              <FooterLink label="Contact Sales" href="/cms/contact" />
              <FooterLink label="Careers" href="#" />
              <FooterLink label="Blog & Articles" href="#" />
              <FooterLink label="Privacy Policy" href="#" />
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-display text-sm sm:text-base font-bold mb-4 sm:mb-6 text-white tracking-wide">
              Contact Us
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <p className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                <span className="text-[12px] sm:text-[13px] leading-relaxed">
                  Bhopal, Madhya Pradesh,
                  <br />
                  India - 462001
                </span>
              </p>
              <p className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-blue shrink-0" />
                <a
                  href="mailto:hello@octagonerp.com"
                  className="text-[12px] sm:text-[13px] hover:text-blue transition-colors duration-200"
                >
                  hello@octagonerp.com
                </a>
              </p>
              <p className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-blue shrink-0" />
                <a
                  href="tel:+917551234567"
                  className="text-[12px] sm:text-[13px] hover:text-blue transition-colors duration-200"
                >
                  +91 755 123 4567
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-1 md:gap-4 text-[11px] sm:text-xs text-slate-500 text-center md:text-left">
          <p>© 2026 OCTAGON Software Company. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Design & Developed by : SFA Technologies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link
        to={href}
        className="inline-block text-slate-400 hover:text-blue hover:translate-x-1 transition-all duration-300 text-[12px] sm:text-[13px]"
      >
        {label}
      </Link>
    </li>
  );
}

function SocialIcon({
  icon,
}: {
  icon: 'linkedin' | 'twitter' | 'github' | 'instagram' | 'facebook';
}) {
  const icons = {
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    github: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    facebook: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
  };

  return (
    <a
      href="#"
      className="w-8 h-8 rounded-full bg-white/5 border border-white/4 flex items-center justify-center text-slate-400 hover:bg-blue hover:text-white hover:border-blue transition-all duration-300 shadow-sm"
    >
      {icons[icon]}
    </a>
  );
}
