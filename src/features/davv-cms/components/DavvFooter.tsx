import { Link } from 'react-router-dom';
import { DAVV } from '../constants/davvData';
import { davvUrls } from '../constants/davvUrls';

export default function DavvFooter() {
  return (
    <footer className="bg-davv-darkest text-white mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/images/davv-logo.png"
              alt="DAVV emblem"
              className="w-11 h-11 object-contain bg-white rounded-full p-0.5"
            />
            <span className="font-display font-bold text-[15px]">
              {DAVV.name}
            </span>
          </div>
          <p className="text-white/60 text-[13px] leading-relaxed max-w-xs">
            {DAVV.motto} — {DAVV.mottoTranslation}. {DAVV.city}.
          </p>
        </div>
        <div>
          <h4 className="font-display font-bold text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2 text-white/70 text-[13px]">
            <li>
              <Link
                to={davvUrls.landing}
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={davvUrls.selectUniversity}
                className="hover:text-white transition-colors"
              >
                Switch University
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-sm mb-3">Powered by</h4>
          <p className="text-white/60 text-[13px] leading-relaxed">
            Octagon University ERP — a unified platform for governance,
            academics and student services.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-white/50 text-[12px]">
          © 2026 {DAVV.name}, {DAVV.city}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
