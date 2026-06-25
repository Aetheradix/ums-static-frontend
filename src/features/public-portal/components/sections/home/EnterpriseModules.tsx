import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Landmark,
  Settings,
  Users,
  IndianRupee,
} from 'lucide-react';
import Button from '../../ui/Button';

interface ModuleCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeBg: string;
  badgeText: string;
  hoverBorder: string;
  iconBg: string;
  bulletColor: string;
  arrowColor: string;
  modules: string[];
}

const CATEGORIES: ModuleCategory[] = [
  {
    id: 'academics',
    title: 'Academics',
    icon: GraduationCap,
    badgeBg: 'bg-blue/10',
    badgeText: 'text-blue',
    hoverBorder: 'hover:border-blue',
    iconBg: 'bg-blue-light',
    bulletColor: 'bg-blue',
    arrowColor: 'text-blue',
    modules: [
      'Academic Management',
      'Admission Management',
      'Alumni Management',
      'Convocation Module',
      'Evaluation & Grading',
      'Evaluation & Grading (for evaluator)',
      'Fee Configuration',
      'Programme Management',
      'Student Feedback Management',
      'Thesis Management',
      'Training & Placement Management',
      'Student Portal',
    ],
  },
  {
    id: 'finance',
    title: 'Accounts & Finance',
    icon: IndianRupee,
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-500',
    iconBg: 'bg-emerald-500/10',
    bulletColor: 'bg-emerald-500',
    arrowColor: 'text-emerald-600',
    modules: [
      'Bill Management & Tracking',
      'Finance & Procurement Management',
      'Inventory Management',
      'Research & Grants Management',
    ],
  },
  {
    id: 'base',
    title: 'Base Modules',
    icon: Settings,
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-600',
    hoverBorder: 'hover:border-amber-500',
    iconBg: 'bg-amber-500/10',
    bulletColor: 'bg-amber-500',
    arrowColor: 'text-amber-600',
    modules: ['Core Modules', 'User Management'],
  },
  {
    id: 'employee',
    title: 'Employee Services',
    icon: Users,
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-600',
    hoverBorder: 'hover:border-rose-500',
    iconBg: 'bg-rose-500/10',
    bulletColor: 'bg-rose-500',
    arrowColor: 'text-rose-600',
    modules: [
      'Career Advancement',
      'Employee Management',
      'Leave Management',
      'Payroll Management',
      'Pension & Gratuity Management',
      'Recruitment Management',
      'ToT Management',
    ],
  },
  {
    id: 'governance',
    title: 'Governance',
    icon: Landmark,
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-600',
    hoverBorder: 'hover:border-indigo-500',
    iconBg: 'bg-indigo-500/10',
    bulletColor: 'bg-indigo-500',
    arrowColor: 'text-indigo-600',
    modules: [
      'Affiliation Management',
      'Content Management & Federation',
      'Networking & Communication Management',
      'Endowment Management',
      'Essential Services Management',
      'Estate Management',
      'File Management & Tracking',
      'Fleet Management',
      'Grievance Management',
      'Health Services Management',
      'Hostel Management',
      'Legal Case Management',
      'Minutes Resolutions Archive Retrieval System',
      'Residence Allocation (E-housing)',
      'RTI Management',
      'Security Management',
      'Service Desk',
      'Sports Management',
    ],
  },
];

export default function EnterpriseModules() {
  const navigate = useNavigate();

  return (
    <section
      id="enterprise-modules"
      className="py-5 md:py-14 bg-erp-section border-y border-white/5 overflow-hidden reveal relative"
    >
      {/* Background soft ambient glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-cyan-400/15 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-400/15 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-10">
          <div className="max-w-2xl text-left">
            <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/10 text-blue-100 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-md mb-3 sm:mb-4 border border-white/10">
              Complete ERP Suite
            </span>
            <h2 className="font-display text-[22px] sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-1.5 sm:mb-2">
              43+ Enterprise Modules
            </h2>
            <h3 className="font-display text-[22px] sm:text-3xl md:text-4xl font-bold leading-tight mb-3 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
                One Platform. Every Module.
              </span>
            </h3>
            <p className="text-blue-50/90 text-[13.5px] sm:text-base leading-relaxed">
              From academics to governance, finance to employee services —
              everything you need to run a modern, transparent, and efficient
              university ecosystem.
            </p>
          </div>
          <div className="shrink-0 text-left md:text-right">
            <Button
              variant="white-outline"
              size="sm"
              onClick={() => navigate('/solutions')}
              className="group !py-2 !px-4 sm:!py-2.5 sm:!px-6 !text-[10px] sm:!text-sm"
            >
              Explore All Modules
              <span className="ml-2 inline-block transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300 font-sans">
                →
              </span>
            </Button>
          </div>
        </div>

        {/* Modules Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6">
          {CATEGORIES.map(category => (
            <div
              key={category.id}
              onClick={() => navigate('/solutions')}
              className={`group bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-border/70 shadow-sm hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-[260px] sm:h-[380px] cursor-pointer last:col-span-2 lg:last:col-span-1 ${category.hoverBorder}`}
            >
              {/* Category Head */}
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div
                  className={`w-7 h-7 sm:w-11 sm:h-11 ${category.iconBg} rounded-md sm:rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner`}
                >
                  <category.icon
                    className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${category.badgeText}`}
                  />
                </div>
                <span
                  className={`px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wider ${category.badgeBg} ${category.badgeText} border border-black/5`}
                >
                  {category.modules.length}{' '}
                  <span className="hidden xs:inline">Modules</span>
                  <span className="xs:hidden">M</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xs sm:text-base font-bold text-navy leading-snug mb-1.5 sm:mb-3">
                {category.title}
              </h3>

              {/* Divider */}
              <div className="h-[1px] bg-border/40 w-full mb-2 sm:mb-4" />

              {/* Modules List Container */}
              <div className="relative flex-1 min-h-0">
                <div className="h-full overflow-y-auto pr-1 select-none no-scrollbar">
                  <ul className="space-y-1.5 sm:space-y-2.5 pb-6">
                    {category.modules.map((moduleName, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-1.5 sm:gap-2 text-navy text-[10px] sm:text-[12px] leading-relaxed group/item hover:${category.badgeText} transition-colors duration-200`}
                      >
                        <span
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-1 sm:mt-1.5 shrink-0 ${category.bulletColor} opacity-75 group-hover/item:scale-125 transition-transform duration-200`}
                        />
                        <span className="group-hover/item:translate-x-0.5 transition-transform duration-200">
                          {moduleName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Subtle fade effect at the bottom of the scrollable area */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              {/* Card Footer Link */}
              <div
                className={`mt-auto flex items-center ${category.arrowColor} font-black text-[7.5px] sm:text-[9px] uppercase tracking-widest pt-2 sm:pt-4 border-t border-border/40`}
              >
                View Modules
                <span className="ml-1 sm:ml-2 group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
