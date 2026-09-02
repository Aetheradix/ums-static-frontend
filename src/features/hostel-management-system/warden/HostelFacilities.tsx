import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  StatCard,
} from 'shared/new-components';
import { FacilityChip, SectionNote } from '../components/ui';
import {
  MOCK_WARDEN_HOSTEL_ID,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

export default function HostelFacilities() {
  const { data, add, update } = useHms();
  const { activePortal } = useHmsRole();

  const hostel = data.hostels.find(h => h.id === MOCK_WARDEN_HOSTEL_ID);
  const [selected, setSelected] = useState<string[]>(hostel?.facilityIds ?? []);
  const [newFacility, setNewFacility] = useState('');

  const toggle = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );

  const handleSave = () => {
    if (!hostel) return;
    update('hostels', hostel.id, { ...hostel, facilityIds: selected });
    ToastService.success(
      `${selected.length} facilities saved for ${hostel.nameEn}.`
    );
  };

  const handleAddFacility = () => {
    const name = newFacility.trim();
    if (!name) return;
    const id = `F${Date.now()}`;
    add('facilityOptions', { id, name, icon: 'star' });
    setSelected(prev => [...prev, id]);
    setNewFacility('');
    ToastService.success(`"${name}" added and selected.`);
  };

  const chosen = data.facilityOptions.filter(f => selected.includes(f.id));

  return (
    <FormPage
      title="Hostel Facilities"
      description={`Pick every facility ${hostel?.nameEn ?? 'this hostel'} provides. Residents see these on their portal, and applicants see them when choosing a hostel.`}
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Hostel Facilities')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Facilities Selected"
          value={selected.length}
          icon="checklist"
          colorScheme="green"
        />
        <StatCard
          title="Available to Choose"
          value={data.facilityOptions.length}
          icon="apps"
          colorScheme="blue"
        />
        <StatCard
          title="Hostel"
          value={hostel?.code ?? '—'}
          icon="apartment"
          colorScheme="indigo"
          subtitle={hostel?.nameEn}
        />
      </FormGrid>

      <FormCard
        title="Select Facilities"
        subtitle="Tap a facility to switch it on or off for this hostel."
        icon="check-square"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.facilityOptions.map(facility => {
            const on = selected.includes(facility.id);
            return (
              <button
                key={facility.id}
                type="button"
                onClick={() => toggle(facility.id)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                  on
                    ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    on
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {facility.icon}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                    {facility.name}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {on ? 'Provided' : 'Not provided'}
                  </span>
                </span>
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    on
                      ? 'text-blue-600 dark:text-blue-300'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {on ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
          <FormGrid columns={3}>
            <TextBox
              label="Add Another Facility"
              placeholder="e.g. Common Room TV"
              value={newFacility}
              onChange={setNewFacility}
            />
            <div className="flex items-end pb-4">
              <Button
                label="Add to List"
                icon="plus"
                variant="outlined"
                onClick={handleAddFacility}
              />
            </div>
          </FormGrid>
        </div>

        <FormActions
          saveLabel="Save Facilities"
          onSave={handleSave}
          onReset={() => setSelected(hostel?.facilityIds ?? [])}
        />
      </FormCard>

      <FormCard
        title="How Residents See It"
        subtitle="This is the facility strip shown on the student portal and to applicants."
        icon="eye"
      >
        {chosen.length === 0 ? (
          <SectionNote tone="warning">
            No facilities selected yet — the hostel will show an empty facility
            strip to applicants.
          </SectionNote>
        ) : (
          <div className="flex flex-wrap gap-2">
            {chosen.map(f => (
              <FacilityChip key={f.id} icon={f.icon} name={f.name} />
            ))}
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
