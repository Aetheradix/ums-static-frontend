import { Mail, Phone, MapPin } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    label: 'hello@octagonerp.in',
    color: { bg: 'bg-blue-100', text: 'text-blue-600' },
  },
  {
    icon: Phone,
    label: '+91 755 123 4567',
    color: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  },
  {
    icon: MapPin,
    label: 'India',
    color: { bg: 'bg-purple-100', text: 'text-purple-600' },
  },
];

export default function ContactHero() {
  return (
    <section className="relative bg-blue-50 pt-24 md:pt-40 pb-8 md:pb-16 overflow-hidden border-b border-border">
      {/* Geometric Pattern SVG */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none text-navy">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="octagons-contact"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#octagons-contact)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 relative z-10 text-center">
        {/* Breadcrumb */}
        <nav className="mb-3 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted">
          <span>Home</span>
          <span className="mx-2 md:mx-3 opacity-50">/</span>
          <span className="text-navy">Contact</span>
        </nav>

        <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-black text-navy mb-3">
          Let's Build <br /> Together
        </h1>

        <p className="text-muted text-xs md:text-base max-w-2xl mx-auto mb-6 md:mb-8">
          Request a free demo and see how OCTAGON transforms university
          operations across India.
        </p>

        {/* Contact Info Pills */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {contactInfo.map(({ icon: Icon, label, color }, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-surface text-navy font-medium text-xs md:text-[13px]"
            >
              <span
                className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded ${color.bg} ${color.text}`}
              >
                <Icon className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={2.5} />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
