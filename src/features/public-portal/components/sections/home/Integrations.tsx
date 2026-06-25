import { INTEGRATIONS } from '../../../constants/data';
import SectionTitle from '../../ui/SectionTitle';
import {
  IdCard,
  BookOpen,
  CreditCard,
  MessageCircle,
  MessageSquare,
  Mail,
  PhoneCall,
  Lock,
  School,
  Cpu,
} from 'lucide-react';

const INTEGRATION_META: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    hoverBorder: string;
    shadow: string;
  }
> = {
  APAAR: {
    icon: IdCard,
    color: 'text-blue-600',
    bg: 'bg-blue-50/50',
    hoverBorder: 'hover:border-blue-200 hover:bg-blue-50/80',
    shadow: 'hover:shadow-blue-500/10',
  },
  ABC: {
    icon: BookOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50/50',
    hoverBorder: 'hover:border-amber-200 hover:bg-amber-50/80',
    shadow: 'hover:shadow-amber-500/10',
  },
  'Payment Gateway': {
    icon: CreditCard,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/50',
    hoverBorder: 'hover:border-emerald-200 hover:bg-emerald-50/80',
    shadow: 'hover:shadow-emerald-500/10',
  },
  WhatsApp: {
    icon: MessageCircle,
    color: 'text-green-600',
    bg: 'bg-green-50/50',
    hoverBorder: 'hover:border-green-200 hover:bg-green-50/80',
    shadow: 'hover:shadow-green-500/10',
  },
  SMS: {
    icon: MessageSquare,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50/50',
    hoverBorder: 'hover:border-indigo-200 hover:bg-indigo-50/80',
    shadow: 'hover:shadow-indigo-500/10',
  },
  Email: {
    icon: Mail,
    color: 'text-rose-600',
    bg: 'bg-rose-50/50',
    hoverBorder: 'hover:border-rose-200 hover:bg-rose-50/80',
    shadow: 'hover:shadow-rose-500/10',
  },
  IVRS: {
    icon: PhoneCall,
    color: 'text-purple-600',
    bg: 'bg-purple-50/50',
    hoverBorder: 'hover:border-purple-200 hover:bg-purple-50/80',
    shadow: 'hover:shadow-purple-500/10',
  },
  DigiLocker: {
    icon: Lock,
    color: 'text-sky-600',
    bg: 'bg-sky-50/50',
    hoverBorder: 'hover:border-sky-200 hover:bg-sky-50/80',
    shadow: 'hover:shadow-sky-500/10',
  },
  UGC: {
    icon: School,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50/50',
    hoverBorder: 'hover:border-yellow-200 hover:bg-yellow-50/80',
    shadow: 'hover:shadow-yellow-500/10',
  },
  AICTE: {
    icon: Cpu,
    color: 'text-orange-600',
    bg: 'bg-orange-50/50',
    hoverBorder: 'hover:border-orange-200 hover:bg-orange-50/80',
    shadow: 'hover:shadow-orange-500/10',
  },
};

export default function Integrations() {
  // Split integrations into two sets of 5
  const set1 = INTEGRATIONS.filter((_, i) => i % 2 === 0);
  const set2 = INTEGRATIONS.filter((_, i) => i % 2 !== 0);

  // Repeat each set multiple times to ensure they fill screens easily without gaps
  const row1 = [...set1, ...set1, ...set1, ...set1];
  const row2 = [...set2, ...set2, ...set2, ...set2];

  const renderCard = (
    item: { name: string; icon: string },
    idx: number,
    keyPrefix = ''
  ) => {
    const meta = INTEGRATION_META[item.name];
    const IconComponent = meta?.icon;
    return (
      <div
        key={`${keyPrefix}-${idx}`}
        className={`px-3.5 py-2.5 sm:px-6 sm:py-4 bg-white border border-slate-100 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-lg ${meta?.shadow || ''} ${meta?.hoverBorder || ''} -translate-y-0 hover:-translate-y-1 transition-all duration-300 cursor-default group`}
      >
        <div
          className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl ${meta?.bg || 'bg-slate-50'} transition-colors duration-300`}
        >
          {IconComponent ? (
            <IconComponent
              className={`w-5 h-5 sm:w-6 sm:h-6 ${meta?.color || 'text-blue'} group-hover:scale-110 transition-transform duration-300`}
            />
          ) : (
            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </span>
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="font-display font-bold text-slate-800 text-[12px] sm:text-[14px] leading-tight">
            {item.name}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
            Integration
          </span>
        </div>
      </div>
    );
  };

  return (
    <section
      id="integrations"
      className="py-5 md:py-14 bg-[#ecf2ff] overflow-hidden reveal relative"
    >
      {/* Decorative background glows */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-indigo/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 text-center">
        <SectionTitle
          title="Works with Everything You Need"
          subtitle="Seamlessly connected with academic portals, payment setups, governance databases, and alert systems."
          center={true}
        />
      </div>

      {/* Row 1 (Left scrolling) */}
      <div className="relative flex overflow-x-hidden w-full md:mb-6 mb-0">
        <div className="flex animate-marquee-left whitespace-nowrap py-3">
          <div className="flex items-center gap-3 sm:gap-6 pr-3 sm:pr-6">
            {row1.map((item, idx) => renderCard(item, idx, 'row1'))}
          </div>
          <div
            className="flex items-center gap-3 sm:gap-6 pr-3 sm:pr-6"
            aria-hidden="true"
          >
            {row1.map((item, idx) => renderCard(item, idx, 'row1-dup'))}
          </div>
        </div>
      </div>

      {/* Row 2 (Right scrolling) */}
      <div className="relative flex overflow-x-hidden w-full">
        <div className="flex animate-marquee-right whitespace-nowrap py-3">
          <div className="flex items-center gap-3 sm:gap-6 pr-3 sm:pr-6">
            {row2.map((item, idx) => renderCard(item, idx, 'row2'))}
          </div>
          <div
            className="flex items-center gap-3 sm:gap-6 pr-3 sm:pr-6"
            aria-hidden="true"
          >
            {row2.map((item, idx) => renderCard(item, idx, 'row2-dup'))}
          </div>
        </div>
      </div>

      <div className="text-center md:mt-8 mt-3 text-slate-400 font-bold text-xs uppercase tracking-wider">
        And many more government & education APIs
      </div>

      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marqueeLeft 65s linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeRight 65s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
