import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { EmptyState, SectionNote } from '../components/ui';
import {
  DAYS,
  MEALS,
  MOCK_WARDEN_HOSTEL_ID,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { MessMenuEntry } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const MEAL_ICON: Record<string, string> = {
  Breakfast: 'free_breakfast',
  Lunch: 'lunch_dining',
  Snacks: 'bakery_dining',
  Dinner: 'dinner_dining',
};

export default function MessMenu() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();

  const [form, setForm] = useState({
    day: DAYS[0],
    meal: MEALS[0] as MessMenuEntry['meal'],
    items: '',
  });

  const menu = useMemo(
    () => data.messMenu.filter(m => m.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.messMenu]
  );

  const lookup = (day: string, meal: string) =>
    menu.find(m => m.day === day && m.meal === meal);

  const save = () => {
    const existing = lookup(form.day, form.meal);
    if (existing) {
      update('messMenu', existing.id, { ...existing, items: form.items });
      ToastService.success(`${form.day} ${form.meal} menu updated.`);
    } else {
      add('messMenu', {
        id: uid('MM'),
        hostelId: MOCK_WARDEN_HOSTEL_ID,
        day: form.day,
        meal: form.meal,
        items: form.items,
      });
      ToastService.success(`${form.day} ${form.meal} menu published.`);
    }
    setForm({ ...form, items: '' });
  };

  return (
    <FormPage
      title="Mess Menu"
      description={
        isStudent
          ? 'The weekly menu published by your warden, meal by meal.'
          : 'Publish the weekly mess menu. Students see every change on their portal immediately.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Mess Menu')}
    >
      {!isStudent && (
        <FormCard
          title="Publish a Meal"
          subtitle="Pick a day and meal, then list the items. Saving over an existing meal replaces it."
          icon="restaurant"
        >
          <FormGrid columns={3}>
            <DropDownList
              label="Day"
              data={DAYS.map(d => ({ id: d, text: d }))}
              textField="text"
              valueField="id"
              value={form.day}
              onChange={v => {
                const day = (v as string) ?? DAYS[0];
                setForm(f => ({
                  ...f,
                  day,
                  items: lookup(day, f.meal)?.items ?? '',
                }));
              }}
            />
            <DropDownList
              label="Meal"
              data={MEALS.map(m => ({ id: m, text: m }))}
              textField="text"
              valueField="id"
              value={form.meal}
              onChange={v => {
                const meal = ((v as string) ??
                  MEALS[0]) as MessMenuEntry['meal'];
                setForm(f => ({
                  ...f,
                  meal,
                  items: lookup(f.day, meal)?.items ?? '',
                }));
              }}
            />
            <div />
            <div className="md:col-span-3">
              <TextArea
                label="Items"
                rows={2}
                placeholder="e.g. Poha, Jalebi, Tea, Banana"
                value={form.items}
                onChange={v => setForm({ ...form, items: v })}
              />
            </div>
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Publish Menu"
              variant="primary"
              icon="send"
              onClick={save}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm({ ...form, items: '' })}
            />
          </div>
        </FormCard>
      )}

      <FormCard title="Weekly Menu Board" icon="restaurant_menu">
        {menu.length === 0 ? (
          <EmptyState
            icon="restaurant_menu"
            title="No menu published yet"
            hint="The warden publishes the week's meals here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 rounded-tl-xl border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Day
                  </th>
                  {MEALS.map(meal => (
                    <th
                      key={meal}
                      className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">
                          {MEAL_ICON[meal]}
                        </span>
                        {meal}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day}>
                    <td className="sticky left-0 z-10 border-b border-slate-100 bg-white px-4 py-3 font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                      {day}
                    </td>
                    {MEALS.map(meal => (
                      <td
                        key={meal}
                        className="border-b border-slate-100 px-4 py-3 align-top text-slate-600 dark:border-slate-800 dark:text-slate-300"
                      >
                        {lookup(day, meal)?.items || (
                          <span className="text-slate-300 dark:text-slate-600">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormCard>

      {isStudent && (
        <SectionNote tone="info">
          Something off with a meal? Raise it under Mess Feedback and the warden
          records the action taken.
        </SectionNote>
      )}
    </FormPage>
  );
}
