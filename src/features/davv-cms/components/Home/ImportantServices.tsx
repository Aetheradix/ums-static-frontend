import { SERVICES_CARDS } from '../../constants/data';
import { useLanguage } from '../../../../shared/context/useLanguage';

const SERVICE_STYLES: Record<
  string,
  { cardBg: string; iconBg: string; textColor: string }
> = {
  'ABC ID': {
    cardBg:
      'bg-gradient-to-br from-blue-50/90 to-blue-100/90 border-blue-200 hover:from-blue-100 hover:to-blue-200/60 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700/40 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30',
    iconBg:
      'bg-white text-blue-600 border-blue-200/80 dark:bg-slate-700 dark:text-blue-400 dark:border-blue-600/50',
    textColor: 'text-blue-900 dark:text-blue-300',
  },
  APAAR: {
    cardBg:
      'bg-gradient-to-br from-emerald-50/90 to-emerald-100/90 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200/60 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:border-emerald-700/40 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/30',
    iconBg:
      'bg-white text-emerald-600 border-emerald-200/80 dark:bg-slate-700 dark:text-emerald-400 dark:border-emerald-600/50',
    textColor: 'text-emerald-900 dark:text-emerald-300',
  },
  DigiLocker: {
    cardBg:
      'bg-gradient-to-br from-purple-50/90 to-purple-100/90 border-purple-200 hover:from-purple-100 hover:to-purple-200/60 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700/40 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30',
    iconBg:
      'bg-white text-purple-600 border-purple-200/80 dark:bg-slate-700 dark:text-purple-400 dark:border-purple-600/50',
    textColor: 'text-purple-900 dark:text-purple-300',
  },
  'e-Samadhan': {
    cardBg:
      'bg-gradient-to-br from-cyan-50/90 to-cyan-100/90 border-cyan-200 hover:from-cyan-100 hover:to-cyan-200/60 dark:from-cyan-900/20 dark:to-cyan-800/20 dark:border-cyan-700/40 dark:hover:from-cyan-800/30 dark:hover:to-cyan-700/30',
    iconBg:
      'bg-white text-cyan-600 border-cyan-200/80 dark:bg-slate-700 dark:text-cyan-400 dark:border-cyan-600/50',
    textColor: 'text-cyan-900 dark:text-cyan-300',
  },
  Library: {
    cardBg:
      'bg-gradient-to-br from-amber-50/90 to-amber-100/90 border-amber-200 hover:from-amber-100 hover:to-amber-200/60 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-700/40 dark:hover:from-amber-800/30 dark:hover:to-amber-700/30',
    iconBg:
      'bg-white text-amber-600 border-amber-200/80 dark:bg-slate-700 dark:text-amber-400 dark:border-amber-600/50',
    textColor: 'text-amber-900 dark:text-amber-300',
  },
  'Online Fee Payment': {
    cardBg:
      'bg-gradient-to-br from-pink-50/90 to-pink-100/90 border-pink-200 hover:from-pink-100 hover:to-pink-200/60 dark:from-pink-900/20 dark:to-pink-800/20 dark:border-pink-700/40 dark:hover:from-pink-800/30 dark:hover:to-pink-700/30',
    iconBg:
      'bg-white text-pink-600 border-pink-200/80 dark:bg-slate-700 dark:text-pink-400 dark:border-pink-600/50',
    textColor: 'text-pink-900 dark:text-pink-300',
  },
};

export default function ImportantServices() {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xs dark:shadow-slate-900/50 h-full flex flex-col justify-between select-none">
      <div>
        <div className="text-left mb-10 border-b border-slate-100 dark:border-slate-700 pb-5">
          <h3 className="font-display font-black text-[#002147] dark:text-white text-lg md:text-xl leading-none">
            {t('Important Services')}
          </h3>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICES_CARDS.map((service, idx) => {
            const Icon = service.icon;
            const styles = SERVICE_STYLES[service.label] || {
              cardBg:
                'bg-slate-50/70 border-slate-200 hover:bg-slate-100 dark:bg-slate-700/50 dark:border-slate-600 dark:hover:bg-slate-700',
              iconBg:
                'bg-white text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600',
              textColor: 'text-slate-850 dark:text-slate-200',
            };
            return (
              <a
                key={idx}
                href="#"
                className={`group border rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${styles.cardBg}`}
              >
                {/* Colored Circular Icon Container */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-3xs group-hover:scale-110 transition-transform duration-300 ${styles.iconBg}`}
                >
                  <Icon className="w-4.5 h-4.5 stroke-[1.5]" />
                </div>

                {/* Title */}
                <span
                  className={`text-xs font-black mt-3 transition-colors tracking-tight leading-snug ${styles.textColor} group-hover:text-blue-600 dark:group-hover:text-blue-400`}
                >
                  {t(service.label)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
