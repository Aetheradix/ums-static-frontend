import { useState } from 'react';
import { SOLUTIONS } from '../../../constants/data';
import ModuleChip from '../../ui/ModuleChip';
import SectionTitle from '../../ui/SectionTitle';
import { clsx } from 'clsx';

export default function ModuleTabSection() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const isAll = activeTab === 'all';

  const currentSolution =
    SOLUTIONS.find(s => s.id === activeTab) || SOLUTIONS[0];

  const activeSolution = isAll
    ? {
        id: 'all',
        title: 'All Modules',
        tagline: 'The Complete Platform Suite',
        modules: SOLUTIONS.flatMap((s): { name: string; icon: string }[] => [
          ...s.modules,
        ]),
      }
    : currentSolution;

  const displayModules = activeSolution.modules;

  return (
    <section className="py-10 md:py-16 bg-surface">
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionTitle
          title="Explore All Modules"
          subtitle="Browse the complete feature set across all university pillars."
          center={true}
        />

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={clsx(
              'px-4 py-2 md:px-5 md:py-2.5 rounded-md text-xs sm:text-sm font-bold transition-all duration-300',
              activeTab === 'all'
                ? 'bg-navy text-white shadow-sm'
                : 'bg-white text-navy hover:bg-surface hover:text-blue border border-border'
            )}
          >
            All Modules
          </button>

          {SOLUTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={clsx(
                'px-4 py-2 md:px-5 md:py-2.5 rounded-md text-xs sm:text-sm font-bold transition-all duration-300',
                activeTab === s.id
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white text-navy hover:bg-surface hover:text-blue border border-border'
              )}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-4 xs:p-6 md:p-8 shadow-sm border border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h3 className="font-display text-xl xs:text-2xl font-bold text-navy">
                {activeSolution.title}
              </h3>
              <p className="text-muted text-xs xs:text-sm">
                {activeSolution.tagline}
              </p>
            </div>
            <div className="px-3 py-1.5 bg-surface text-navy border border-border rounded-md font-bold text-[10px] xs:text-xs uppercase tracking-wider">
              Total: {displayModules.length} Modules
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 transition-all duration-500">
            {displayModules.map((moduleObj, idx) => (
              <ModuleChip
                key={`${activeTab}-${idx}`}
                module={moduleObj}
                index={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
