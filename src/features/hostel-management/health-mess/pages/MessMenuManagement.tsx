import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

const DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;
const MEALS = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'] as const;

export default function MessMenuManagement() {
  const { hostels, messMenus, setMessMenus, triggerNotification } = useHostel();

  const [selectedHostel, setSelectedHostel] = useState(hostels[0]?.id || '');
  const [selectedDay, setSelectedDay] =
    useState<(typeof DAYS)[number]>('MONDAY');
  const [editingMeal, setEditingMeal] = useState<{
    id?: string;
    type: (typeof MEALS)[number];
    items: string;
  } | null>(null);

  // Get menu for selected hostel and day
  const dailyMenu = useMemo(() => {
    const menuForDay = messMenus.filter(
      m => m.hostelId === selectedHostel && m.dayOfWeek === selectedDay
    );

    // Ensure all 4 meals exist in the view, even if not defined in state yet
    return MEALS.map(mealType => {
      const existing = menuForDay.find(m => m.mealType === mealType);
      return (
        existing || {
          id: '',
          hostelId: selectedHostel,
          dayOfWeek: selectedDay,
          mealType,
          items: [],
        }
      );
    });
  }, [messMenus, selectedHostel, selectedDay]);

  const handleSaveMenu = () => {
    if (!editingMeal) return;

    const itemsList = editingMeal.items
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    if (itemsList.length === 0) {
      triggerNotification('Please enter at least one food item.', 'error');
      return;
    }

    if (editingMeal.id) {
      // Update existing
      setMessMenus(prev =>
        prev.map(m =>
          m.id === editingMeal.id ? { ...m, items: itemsList } : m
        )
      );
    } else {
      // Create new
      const newMenu: HostelManagement.MessMenu = {
        id: `MM-${Date.now()}`,
        hostelId: selectedHostel,
        academicYear: '2024-2025',
        weekStarting: new Date().toISOString().split('T')[0],
        dayOfWeek: selectedDay,
        mealType: editingMeal.type,
        items: itemsList,
        meals: [],
      };
      setMessMenus([...messMenus, newMenu]);
    }

    triggerNotification('Mess menu updated successfully.', 'success');
    setEditingMeal(null);
  };

  return (
    <FormPage
      title="Mess Menu Management"
      description="Define and update the weekly food menu for hostel residents."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Health & Mess',
          to: '/hostel-management/health/emergency-log',
        },
        { label: 'Mess Menu' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 flex flex-col gap-4">
          <FormCard title="Filters" icon="filter_list">
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Hostel
              </label>
              <select
                value={selectedHostel}
                onChange={e => setSelectedHostel(e.target.value)}
                className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                {hostels.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.hostelName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Day
              </label>
              <div className="flex flex-col gap-1">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedDay === day
                        ? 'bg-primary-100 text-primary-800 font-bold border border-primary-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </FormCard>
        </div>

        <div className="w-full lg:w-3/4">
          <FormCard
            title={`${selectedDay.charAt(0) + selectedDay.slice(1).toLowerCase()} Menu`}
            icon="restaurant_menu"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyMenu.map(meal => (
                <div
                  key={meal.mealType}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      {meal.mealType}
                    </h3>
                    <button
                      onClick={() =>
                        setEditingMeal({
                          id: meal.id,
                          type: meal.mealType,
                          items: meal.items.join(', '),
                        })
                      }
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700 uppercase"
                    >
                      {meal.id ? 'Edit' : 'Add'}
                    </button>
                  </div>

                  {editingMeal?.type === meal.mealType ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        className="w-full border p-2 rounded text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                        rows={3}
                        value={editingMeal.items}
                        onChange={e =>
                          setEditingMeal({
                            ...editingMeal,
                            items: e.target.value,
                          })
                        }
                        placeholder="Enter items separated by comma..."
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          label="Cancel"
                          variant="outlined"
                          onClick={() => setEditingMeal(null)}
                        />
                        <Button
                          label="Save"
                          variant="primary"
                          onClick={handleSaveMenu}
                        />
                      </div>
                    </div>
                  ) : (
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 min-h-[60px]">
                      {meal.items.length > 0 ? (
                        meal.items.map((item, idx) => (
                          <li key={idx} className="mb-1">
                            {item}
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400 italic list-none -ml-5">
                          Menu not set
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
