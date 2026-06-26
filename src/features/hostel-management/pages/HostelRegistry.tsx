import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { Checkbox, DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useHostel } from '../context';
import { COLLEGE_OPTIONS, FACILITY_OPTIONS } from '../data';

type HostelForm = {
  name: string;
  type: 'Boys' | 'Girls' | 'Co-Ed';
  college: string;
  category: string;
  state: string;
  district: string;
  city: string;
  address: string;
  pincode: string;
  floors: string;
  rooms: string;
  beds: string;
  wardenName: string;
  wardenMobile: string;
  wardenEmail: string;
  assistantWarden: string;
  assistantWardenMobile: string;
  facilities: string[];
  securityDeposit: string;
  hostelFee: string;
  messFee: string;
  electricityCharges: string;
};

const BLANK_FORM: HostelForm = {
  name: '',
  type: 'Boys',
  college: COLLEGE_OPTIONS[0],
  category: 'General',
  state: 'Madhya Pradesh',
  district: 'Bhopal',
  city: 'Bhopal',
  address: '',
  pincode: '',
  floors: '',
  rooms: '',
  beds: '',
  wardenName: '',
  wardenMobile: '',
  wardenEmail: '',
  assistantWarden: '',
  assistantWardenMobile: '',
  facilities: [],
  securityDeposit: '',
  hostelFee: '',
  messFee: '',
  electricityCharges: '',
};

const HOSTEL_TYPE_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Boys', text: 'Boys' },
  { id: 'Girls', text: 'Girls' },
  { id: 'Co-Ed', text: 'Co-Ed' },
];

const CATEGORY_OPTIONS: Data.DataItem<string>[] = [
  { id: 'General', text: 'General' },
  { id: 'SC/ST', text: 'SC/ST' },
  { id: 'OBC', text: 'OBC' },
  { id: 'EWS', text: 'EWS' },
];

const COLLEGE_DROPDOWN: Data.DataItem<string>[] = COLLEGE_OPTIONS.map(c => ({
  id: c,
  text: c,
}));


export default function HostelRegistry() {
  const { hostels, setHostels, triggerNotification } = useHostel();
  const [form, setForm] = useState<HostelForm>({ ...BLANK_FORM });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  const set = <K extends keyof HostelForm>(key: K, value: HostelForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.pincode) {
      triggerNotification('Please fill in all mandatory fields.', 'error');
      return;
    }
    const code = `HST-${String(hostels.length + 1).padStart(3, '0')}`;
    setHostels(prev => [
      ...prev,
      {
        ...form,
        code,
        floors: parseInt(form.floors) || 0,
        rooms: parseInt(form.rooms) || 0,
        beds: parseInt(form.beds) || 0,
        occupancy: 0,
        available: parseInt(form.beds) || 0,
        securityDeposit: parseFloat(form.securityDeposit) || 0,
        hostelFee: parseFloat(form.hostelFee) || 0,
        messFee: parseFloat(form.messFee) || 0,
        electricityCharges: parseFloat(form.electricityCharges) || 0,
        status: 'Active' as const,
      },
    ]);
    triggerNotification(`Hostel registered successfully! Code: ${code}`);
    setForm({ ...BLANK_FORM });
  };

  const handleDelete = (code: string) => {
    const h = hostels.find(x => x.code === code);
    if (h && h.occupancy > 0) {
      triggerNotification(
        'Cannot delete a hostel that has active occupants.',
        'error'
      );
      return;
    }
    setHostels(prev => prev.filter(x => x.code !== code));
    triggerNotification('Hostel record deleted.');
  };

  const filtered = hostels.filter(h => {
    const matchType = !filterType || h.type === filterType;
    const matchSearch =
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.code.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <FormPage
      title="Hostel Registry"
      description="Register and manage hostel buildings for the university campus"
      breadcrumbs={[
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Hostel Registry' },
      ]}
    >
      {/* ── Registration Form ── */}
      <FormCard title="Register New Hostel" icon="building">
        <form onSubmit={handleSubmit}>
          <FormGrid columns={3}>
            <TextBox
              label="Hostel Name *"
              placeholder="e.g. Swami Vivekananda Boys Hostel"
              value={form.name}
              onChange={v => set('name', v)}
            />
            <DropDownList
              label="Hostel Type *"
              data={HOSTEL_TYPE_OPTIONS}
              textField="text"
              valueField="id"
              value={form.type}
              onChange={v => set('type', v as HostelForm['type'])}
            />
            <DropDownList
              label="College *"
              data={COLLEGE_DROPDOWN}
              textField="text"
              valueField="id"
              value={form.college}
              onChange={v => set('college', v as string)}
            />
            <TextBox
              label="State"
              value={form.state}
              onChange={v => set('state', v)}
            />
            <TextBox
              label="District"
              value={form.district}
              onChange={v => set('district', v)}
            />
            <TextBox
              label="City"
              value={form.city}
              onChange={v => set('city', v)}
            />
            <TextBox
              label="Address *"
              placeholder="Campus address"
              value={form.address}
              onChange={v => set('address', v)}
            />
            <TextBox
              label="Pincode *"
              placeholder="6-digit pincode"
              value={form.pincode}
              onChange={v => set('pincode', v)}
            />
            <DropDownList
              label="Category"
              data={CATEGORY_OPTIONS}
              textField="text"
              valueField="id"
              value={form.category}
              onChange={v => set('category', v as string)}
            />
          </FormGrid>

          <div className="mt-4">
            <p className="form-sub-section-label">Capacity Details</p>
            <FormGrid columns={3}>
              <TextBox
                label="No. of Floors"
                placeholder="4"
                value={form.floors}
                onChange={v => set('floors', v)}
              />
              <TextBox
                label="No. of Rooms"
                placeholder="120"
                value={form.rooms}
                onChange={v => set('rooms', v)}
              />
              <TextBox
                label="Total Beds"
                placeholder="240"
                value={form.beds}
                onChange={v => set('beds', v)}
              />
            </FormGrid>
          </div>

          <div className="mt-4">
            <p className="form-sub-section-label">Warden Details</p>
            <FormGrid columns={3}>
              <TextBox
                label="Warden Name"
                value={form.wardenName}
                onChange={v => set('wardenName', v)}
              />
              <TextBox
                label="Warden Mobile"
                value={form.wardenMobile}
                onChange={v => set('wardenMobile', v)}
              />
              <TextBox
                label="Warden Email"
                value={form.wardenEmail}
                onChange={v => set('wardenEmail', v)}
              />
              <TextBox
                label="Assistant Warden"
                value={form.assistantWarden}
                onChange={v => set('assistantWarden', v)}
              />
              <TextBox
                label="Asst. Mobile"
                value={form.assistantWardenMobile}
                onChange={v => set('assistantWardenMobile', v)}
              />
            </FormGrid>
          </div>

          <div className="mt-4">
            <p className="form-sub-section-label">Facilities Available</p>
            <FormGrid columns={4}>
              {FACILITY_OPTIONS.map(f => (
                <Checkbox
                  key={f}
                  label={f}
                  checked={form.facilities.includes(f)}
                  onChange={checked => {
                    if (checked) {
                      set('facilities', [...form.facilities, f]);
                    } else {
                      set(
                        'facilities',
                        form.facilities.filter(x => x !== f)
                      );
                    }
                  }}
                />
              ))}
            </FormGrid>
          </div>

          <div className="mt-4">
            <p className="form-sub-section-label">
              Fee Structure (₹ per semester)
            </p>
            <FormGrid columns={4}>
              <TextBox
                label="Security Deposit"
                placeholder="5000"
                value={form.securityDeposit}
                onChange={v => set('securityDeposit', v)}
              />
              <TextBox
                label="Hostel Fee"
                placeholder="12000"
                value={form.hostelFee}
                onChange={v => set('hostelFee', v)}
              />
              <TextBox
                label="Mess Fee"
                placeholder="15000"
                value={form.messFee}
                onChange={v => set('messFee', v)}
              />
              <TextBox
                label="Electricity Charges"
                placeholder="2000"
                value={form.electricityCharges}
                onChange={v => set('electricityCharges', v)}
              />
            </FormGrid>
          </div>

          <div className="form-actions-row mt-4">
            <Button
              label="Register Hostel"
              icon="plus"
              variant="primary"
              type="submit"
            />
            <Button
              label="Reset"
              variant="outlined"
              onClick={() => setForm({ ...BLANK_FORM })}
            />
          </div>
        </form>
      </FormCard>

      {/* ── Hostel List ── */}
      <FormCard title="Registered Hostels" icon="list">
        <div className="flex gap-3 mb-4 flex-wrap">
          <TextBox
            label=""
            placeholder="Search by name or code..."
            value={search}
            onChange={v => setSearch(v)}
          />
          <DropDownList
            label=""
            data={
              [
                { id: null, text: 'All Types' },
                ...HOSTEL_TYPE_OPTIONS,
              ] as Data.DataItem<string | null>[]
            }
            textField="text"
            valueField="id"
            value={filterType}
            onChange={v => setFilterType(v as string | null)}
          />
        </div>
        <GridPanel
          data={filtered}
          columns={[
            {
              cell: (_, o) => <span>{(o.rowIndex ?? 0) + 1}</span>,
              width: '40px',
            },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Hostel Name' },
            {
              field: 'type',
              header: 'Type',
              cell: (item: HostelManagement.Hostel) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${item.type === 'Boys' ? 'bg-blue-100 text-blue-700' : item.type === 'Girls' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}`}
                >
                  {item.type}
                </span>
              ),
            },
            { field: 'beds', header: 'Beds' },
            { field: 'available', header: 'Available' },
            { field: 'occupancy', header: 'Occupied' },
            { field: 'wardenName', header: 'Warden' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: HostelManagement.Hostel) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: (item: HostelManagement.Hostel) => (
                <Button
                  label="Delete"
                  icon="trash"
                  variant="danger"
                  onClick={() => handleDelete(item.code)}
                />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
