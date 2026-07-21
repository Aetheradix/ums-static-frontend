import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import OptionDropDown from '../../OptionDropDown';
export default function MessMenuMaster() {
  const { messMenus, setMessMenus, hostels, triggerNotification } = useHostel();
  const [showList, setShowList] = useState(false);

  const [hostelId, setHostelId] = useState('');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [weekStarting, setWeekStarting] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const reset = () => {
    setHostelId('');
    setAcademicYear('2025-26');
    setWeekStarting('');
  };

  const handleSave = () => {
    if (!hostelId || !academicYear || !weekStarting) {
      triggerNotification('Please fill mandatory fields', 'error');
      return;
    }

    const newMenu: HostelManagement.MessMenu = {
      id: `MM-${Date.now()}`,
      hostelId,
      academicYear,
      weekStarting,
      dayOfWeek: 'MONDAY',
      mealType: 'BREAKFAST',
      items: [],
      meals: [], // In a real app, we'd have a detailed grid to fill this
    };
    setMessMenus([...messMenus, newMenu]);
    triggerNotification('Mess Menu saved successfully');
    reset();
    setShowList(true);
  };

  if (showList) {
    return (
      <FormPage
        title="Mess Menu Master"
        description="Manage weekly food menus for hostels"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Masters',
            to: '/hostel-management/masters/new-hostel-registration',
          },
          { label: 'Mess Menu' },
        ]}
      >
        <FormCard title="Weekly Menus" icon="restaurant">
          <Button
            label="New Menu"
            icon="plus"
            variant="primary"
            onClick={() => setShowList(false)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Hostel</th>
                  <th className="p-2">Academic Year</th>
                  <th className="p-2">Week Starting</th>
                </tr>
              </thead>
              <tbody>
                {messMenus.map(mm => {
                  const hName =
                    hostels.find(h => h.id === mm.hostelId)?.hostelName ||
                    mm.hostelId;
                  return (
                    <tr
                      key={mm.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2">{hName}</td>
                      <td className="p-2">{mm.academicYear}</td>
                      <td className="p-2">{mm.weekStarting}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Mess Menu Master"
      description="Create a new weekly mess menu"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Masters',
          to: '/hostel-management/masters/new-hostel-registration',
        },
        { label: 'Mess Menu' },
      ]}
    >
      <Button
        label="View List"
        icon="list"
        variant="outlined"
        onClick={() => setShowList(true)}
      />

      <FormCard title="Menu Settings" icon="restaurant">
        <FormGrid columns={3}>
          <OptionDropDown
            label="Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Academic Year *"
            data={[
              { id: '2024-2025', text: '2024-2025' },
              { id: '2025-2026', text: '2025-2026' },
            ]}
            value={academicYear}
            onChange={(v: any) => setAcademicYear(v)}
            textField="text"
            valueField="id"
          />
          <TextBox
            label="Week Starting (Monday) *"
            type="date"
            value={weekStarting}
            onChange={setWeekStarting}
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Daily Meals Configuration" icon="fastfood">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
          <p>
            The detailed grid for daily Breakfast, Lunch, Snacks, and Dinner
            will be loaded here based on the selected week.
          </p>
        </div>
      </FormCard>

      <div className="flex gap-3 mt-4">
        <Button label="Save Menu" variant="primary" onClick={handleSave} />
        <Button label="Clear" variant="outlined" onClick={reset} />
      </div>
    </FormPage>
  );
}
