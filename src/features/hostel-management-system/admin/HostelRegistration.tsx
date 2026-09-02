import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { KeyValueTile, SectionNote } from '../components/ui';
import { hostelOccupancy, useHms, useHmsRole } from '../context/HmsContext';
import type { Hostel } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

/**
 * The hostel register — every hostel on the system at a glance. Registering a
 * new one, or editing an existing one, opens the registration form on its own
 * page rather than burying it above the grid.
 */
export default function HostelRegistration() {
  const { data } = useHms();
  const { activePortal } = useHmsRole();
  const navigate = useNavigate();

  const [credentialsFor, setCredentialsFor] = useState<Hostel | null>(null);

  const districtName = (id: string) =>
    data.districts.find(d => d.id === id)?.name ?? '—';
  const blockName = (id: string) =>
    data.blocks.find(b => b.id === id)?.name ?? '—';
  const designationName = (id: string) =>
    data.designations.find(d => d.id === id)?.name ?? '—';

  const totals = useMemo(() => {
    const beds = data.hostels.reduce(
      (sum, h) =>
        sum + hostelOccupancy(h, data.rooms, data.allocations).configuredBeds,
      0
    );
    return {
      hostels: data.hostels.length,
      capacity: data.hostels.reduce((s, h) => s + h.capacity, 0),
      beds,
    };
  }, [data.hostels, data.rooms, data.allocations]);

  return (
    <FormPage
      title="Hostel Registration"
      description="Every hostel registered with the university, with the credentials issued to its warden."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Hostel Registration')}
      headerAction={
        <Button
          label="Register Hostel"
          icon="plus"
          variant="primary"
          onClick={() => navigate(hmsUrls.admin.hostelRegistrationNew)}
        />
      }
    >
      <FormGrid columns={3}>
        <StatCard
          title="Registered Hostels"
          value={totals.hostels}
          icon="apartment"
          colorScheme="blue"
        />
        <StatCard
          title="Sanctioned Capacity"
          value={totals.capacity.toLocaleString()}
          icon="groups"
          colorScheme="teal"
          subtitle="Seats declared at registration"
        />
        <StatCard
          title="Beds Configured"
          value={totals.beds.toLocaleString()}
          icon="bed"
          colorScheme="purple"
          subtitle="From rooms set up by wardens"
        />
      </FormGrid>

      <FormCard
        title="Registered Hostels"
        subtitle="Use Register Hostel to add one, or edit a row to change its details."
        icon="list"
      >
        <GridPanel<Hostel>
          data={data.hostels}
          cellMemo={false}
          searchBox
          searchPlaceholder="Search by hostel name, code or warden..."
          searchFields={['nameEn', 'code', 'wardenName']}
          pagination
          emptyMessage="No hostels registered yet — use Register Hostel to add the first one."
          columns={[
            { field: 'code', header: 'Code', width: 90 },
            {
              field: 'nameEn',
              header: 'Hostel Name',
              width: 230,
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold">{item.nameEn}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.nameHi || '—'}
                  </span>
                </div>
              ),
            },
            {
              field: 'type',
              header: 'Type',
              width: 100,
              cell: item => (
                <StatusBadge
                  label={item.type}
                  variant={item.type === 'Girls' ? 'info' : 'neutral'}
                />
              ),
            },
            {
              field: 'districtId',
              header: 'District / Block',
              width: 170,
              cell: item => (
                <div className="flex flex-col">
                  <span>{districtName(item.districtId)}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {blockName(item.blockId)}
                  </span>
                </div>
              ),
            },
            {
              field: 'address',
              header: 'Address',
              width: 220,
              cell: item => <>{item.address || '—'}</>,
            },
            { field: 'capacity', header: 'Capacity', width: 100 },
            { field: 'occupancy', header: 'Occupancy', width: 105 },
            {
              field: 'wardenName',
              header: 'Warden',
              width: 190,
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {item.wardenName || '—'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {designationName(item.wardenDesignationId)} ·{' '}
                    {item.wardenMobile || '—'}
                  </span>
                </div>
              ),
            },
            {
              field: 'loginId',
              header: 'Warden Login',
              width: 150,
              cell: item => (
                <span className="font-mono text-xs">{item.loginId}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              width: 110,
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'success' : 'muted'}
                />
              ),
            },
            {
              header: 'Credentials',
              sortable: false,
              width: 110,
              cell: item => (
                <Button
                  label="View"
                  icon="key"
                  variant="outlined"
                  size="small"
                  onClick={() => setCredentialsFor(item)}
                />
              ),
            },
          ]}
          onEdit={hostel =>
            navigate(hmsUrls.admin.hostelRegistrationEdit(hostel.id))
          }
        />
      </FormCard>

      <FormPopup
        visible={Boolean(credentialsFor)}
        onHide={() => setCredentialsFor(null)}
        title="Warden Login Credentials"
        subtitle="Hand these to the hostel office — the warden signs in to the Hostel Warden portal with them."
        footer={
          <div className="flex justify-end">
            <Button
              label="Done"
              variant="primary"
              onClick={() => setCredentialsFor(null)}
            />
          </div>
        }
      >
        {credentialsFor && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                <span className="material-symbols-outlined text-[22px] text-blue-600 dark:text-blue-300">
                  apartment
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                  {credentialsFor.nameEn}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {credentialsFor.wardenName || 'Warden not named'} ·{' '}
                  {credentialsFor.address || 'Address not set'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <KeyValueTile
                label="Login ID"
                value={credentialsFor.loginId}
                mono
              />
              <KeyValueTile
                label="Password"
                value={credentialsFor.password}
                mono
              />
            </div>
            <SectionNote tone="warning">
              The warden must change this password on first sign-in.
            </SectionNote>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
