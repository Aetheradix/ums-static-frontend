import { useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { useHostel } from '../../context';
import { Button } from 'shared/components/buttons';

export default function StudentMessMenu() {
  const { messMenus, triggerNotification } = useHostel();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Handle Feedback Submission
  const handleFeedback = (mealType: string) => {
    triggerNotification(`Feedback for ${mealType} submitted successfully.`);
  };

  return (
    <FormPage
      title="Mess Menu & Feedback"
      description="View the weekly mess menu and provide your feedback."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/student' },
        { label: 'Mess Menu' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Day Selector */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 px-2">
            Select Day
          </h3>
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Menu Display */}
        <div className="md:col-span-3 space-y-4">
          <FormCard title={`${selectedDay}'s Menu`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'].map(mealType => {
                const meal = messMenus.find(
                  m =>
                    m.dayOfWeek.toUpperCase() === selectedDay.toUpperCase() &&
                    m.mealType === mealType
                );

                return (
                  <div
                    key={mealType}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-800/50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                        {mealType}
                      </h4>
                      <Button
                        label="Rate"
                        variant="text"
                        size="small"
                        icon="star_rate"
                        onClick={() => handleFeedback(mealType)}
                      />
                    </div>
                    {meal && meal.items.length > 0 ? (
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {meal.items.join(', ')}
                      </p>
                    ) : (
                      <p className="text-slate-400 italic text-sm">
                        Menu not set
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
