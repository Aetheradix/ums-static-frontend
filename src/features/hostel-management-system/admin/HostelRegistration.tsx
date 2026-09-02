import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { KeyValueTile, SectionNote } from '../components/ui';
import {
  buildHostelCredentials,
  hostelOccupancy,
  today,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Hostel } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

interface FormState {
  nameEn: string;
  nameHi: string;
  type: 'Boys' | 'Girls';
  districtId: string;
  blockId: string;
  address: string;
  capacity: number;
  occupancy: number;
  code: string;
  wardenName: string;
  wardenMobile: string;
  wardenEmail: string;
  wardenDesignationId: string;
  wardenJoiningDate: string;
}

const blank = (): FormState => ({
  nameEn: '',
  nameHi: '',
  type: 'Boys',
  districtId: '',
  blockId: '',
  address: '',
  capacity: 0,
  occupancy: 0,
  code: '',
  wardenName: '',
  wardenMobile: '',
  wardenEmail: '',
  wardenDesignationId: '',
  wardenJoiningDate: '',
});

const toForm = (h: Hostel): FormState => ({
  nameEn: h.nameEn,
  nameHi: h.nameHi,
  type: h.type,
  districtId: h.districtId,
  blockId: h.blockId,
  address: h.address,
  capacity: h.capacity,
  occupancy: h.occupancy,
  code: h.code,
  wardenName: h.wardenName,
  wardenMobile: h.wardenMobile,
  wardenEmail: h.wardenEmail,
  wardenDesignationId: h.wardenDesignationId,
  wardenJoiningDate: h.wardenJoiningDate,
});

/** Derive a hostel code from the name when the admin leaves it blank. */
const deriveCode = (name: string) =>
  (name || 'HOSTEL')
    .split(/\s+/)
    .map(w => w.replace(/[^A-Za-z]/g, '').charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 4) || 'HST';

function HostelFields({
  values,
  onChange,
}: {
  values: FormState;
  onChange: (v: FormState) => void;
}) {
  const { data } = useHms();
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    onChange({ ...values, [key]: value });

  const blockOptions = useMemo(
    () =>
      data.blocks
        .filter(b => !values.districtId || b.districtId === values.districtId)
        .map(b => ({ id: b.id, text: b.name })),
    [data.blocks, values.districtId]
  );

  return (
    <>
      <FormCard
        title="Hostel Details"
        subtitle="Identity, type and where the hostel is located."
        icon="building"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Hostel Name (English)"
            placeholder="e.g. Boys Hostel - Block A"
            value={values.nameEn}
            onChange={v => set('nameEn', v)}
          />
          <TextBox
            label="Hostel Name (Hindi)"
            placeholder="जैसे बालक छात्रावास - ब्लॉक ए"
            value={values.nameHi}
            onChange={v => set('nameHi', v)}
          />
          <DropDownList
            label="Hostel Type"
            data={[
              { id: 'Boys', text: 'Boys' },
              { id: 'Girls', text: 'Girls' },
            ]}
            textField="text"
            valueField="id"
            value={values.type}
            onChange={v => set('type', (v as 'Boys' | 'Girls') ?? 'Boys')}
          />

          <DropDownList
            label="District"
            data={data.districts.map(d => ({ id: d.id, text: d.name }))}
            textField="text"
            valueField="id"
            value={values.districtId}
            onChange={v =>
              onChange({
                ...values,
                districtId: (v as string) ?? '',
                blockId: '',
              })
            }
          />
          <DropDownList
            label="Block"
            data={blockOptions}
            textField="text"
            valueField="id"
            value={values.blockId}
            onChange={v => set('blockId', (v as string) ?? '')}
          />
          <TextBox
            label="Hostel Code"
            placeholder="Auto-generated if left blank"
            value={values.code}
            onChange={v => set('code', v.toUpperCase())}
          />

          <div className="md:col-span-3">
            <TextArea
              label="Address"
              rows={2}
              placeholder="e.g. Takshashila Campus, Khandwa Road, Indore - 452001"
              value={values.address}
              onChange={v => set('address', v)}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Capacity"
        subtitle="Sanctioned seats and the occupancy already recorded for this hostel."
        icon="th-large"
      >
        <FormGrid columns={3}>
          <NumberBox
            label="Hostel Capacity (seats)"
            min={0}
            value={values.capacity}
            onChange={v => set('capacity', v ?? 0)}
          />
          <NumberBox
            label="Current Occupancy"
            min={0}
            value={values.occupancy}
            onChange={v => set('occupancy', v ?? 0)}
          />
          <div className="flex items-end pb-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {Math.max(values.capacity - values.occupancy, 0)} seats free at
              registration
            </p>
          </div>
        </FormGrid>
        <SectionNote tone="neutral">
          The warden configures the actual rooms after signing in — bed counts
          on the monitoring screens come from those rooms, not from this figure.
        </SectionNote>
      </FormCard>

      <FormCard
        title="Warden Details"
        subtitle="The warden who will sign in to this hostel's portal."
        icon="user"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Warden Name"
            placeholder="e.g. Rajesh Kumar"
            value={values.wardenName}
            onChange={v => set('wardenName', v)}
          />
          <TextBox
            label="Warden Mobile Number"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={values.wardenMobile}
            onChange={v => set('wardenMobile', v.replace(/\D/g, ''))}
          />
          <TextBox
            label="Warden Email ID"
            placeholder="warden@davv.ac.in"
            value={values.wardenEmail}
            onChange={v => set('wardenEmail', v)}
          />

          <DropDownList
            label="Warden Designation"
            data={data.designations.map(d => ({ id: d.id, text: d.name }))}
            textField="text"
            valueField="id"
            value={values.wardenDesignationId}
            onChange={v => set('wardenDesignationId', (v as string) ?? '')}
          />
          <DatePicker
            label="Joining Date"
            value={
              values.wardenJoiningDate
                ? new Date(values.wardenJoiningDate)
                : undefined
            }
            onChange={v =>
              set('wardenJoiningDate', v ? v.toISOString().split('T')[0] : '')
            }
          />
        </FormGrid>
      </FormCard>
    </>
  );
}

export default function HostelRegistration() {
  const { data, add, update } = useHms();
  const { activePortal } = useHmsRole();

  const [form, setForm] = useState<FormState>(blank);
  const [editing, setEditing] = useState<Hostel | null>(null);
  const [editForm, setEditForm] = useState<FormState>(blank);
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

  const handleRegister = () => {
    const code = form.code || deriveCode(form.nameEn);
    const credentials = buildHostelCredentials(code, data.hostels.length + 1);
    const hostel: Hostel = {
      ...form,
      code,
      nameEn: form.nameEn || 'Untitled Hostel',
      id: `H${Date.now()}`,
      facilityIds: [],
      registeredOn: today(),
      status: 'Active',
      ...credentials,
    };
    add('hostels', hostel);
    setForm(blank());
    setCredentialsFor(hostel);
    ToastService.success(`${hostel.nameEn} registered successfully.`);
  };

  const handleUpdate = () => {
    if (!editing) return;
    update('hostels', editing.id, {
      ...editing,
      ...editForm,
      code: editForm.code || editing.code,
    });
    setEditing(null);
    ToastService.success('Hostel details updated.');
  };

  return (
    <FormPage
      title="Hostel Registration"
      description="Register a hostel with its name, type, location, capacity and warden. Login credentials for the Warden Portal are issued the moment it is saved."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Hostel Registration')}
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

      <HostelFields values={form} onChange={setForm} />

      <FormCard>
        <FormActions
          saveLabel="Register Hostel"
          onSave={handleRegister}
          onReset={() => setForm(blank())}
        />
      </FormCard>

      <FormCard
        title="Registered Hostels"
        subtitle="Every hostel on the system, with the credentials issued to its warden."
        icon="list"
      >
        <GridPanel<Hostel>
          data={data.hostels}
          searchBox
          searchPlaceholder="Search by hostel name, code or warden..."
          searchFields={['nameEn', 'code', 'wardenName']}
          pagination
          emptyMessage="No hostels registered yet."
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
          onEdit={hostel => {
            setEditing(hostel);
            setEditForm(toForm(hostel));
          }}
        />
      </FormCard>

      <FormPopup
        visible={Boolean(editing)}
        onHide={() => setEditing(null)}
        title="Edit Hostel"
        subtitle={editing?.nameEn}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setEditing(null)}
            />
            <Button label="Update" variant="primary" onClick={handleUpdate} />
          </div>
        }
      >
        <HostelFields values={editForm} onChange={setEditForm} />
      </FormPopup>

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
