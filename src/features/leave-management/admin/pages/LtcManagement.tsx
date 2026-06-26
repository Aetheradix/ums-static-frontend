import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { type LtcRecord, departments, ltcRecords as initialData } from '../../mocks';
import { lmsUrls } from '../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'view'; item: LtcRecord };

const JOURNEY_TYPES = [
  { name: 'Domestic', value: 'Domestic' },
  { name: 'International', value: 'International' },
];

const EMPTY = {
  employee: '', department: '', journeyType: 'Domestic', travelDate: undefined as Date | undefined,
  destination: '', purpose: '', familyMembers: 0, claimAmount: 0,
};

export default function LtcManagement() {
  const [data, setData] = useState<LtcRecord[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY);

  const pending = data.filter(d => d.status === 'Pending').length;
  const approved = data.filter(d => d.status === 'Approved').length;
  const totalClaim = data.filter(d => d.status === 'Approved').reduce((s, d) => s + d.claimAmount, 0);

  const deptOptions = departments.map(d => ({ name: d, value: d }));

  const handleSubmit = () => {
    if (!form.employee || !form.destination) {
      ToastService.error('Employee and Destination are required.');
      return;
    }
    const newRecord: LtcRecord = {
      id: String(Date.now()),
      ...form,
      travelDate: form.travelDate?.toDateString() ?? '',
      claimAmount: Number(form.claimAmount),
      familyMembers: Number(form.familyMembers),
      status: 'Pending',
      approver: 'Dean',
    };
    setData(prev => [...prev, newRecord]);
    ToastService.success('LTC claim submitted successfully.');
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  };

  const handleApprove = (item: LtcRecord) => {
    setData(prev => prev.map(d => d.id === item.id ? { ...d, status: 'Approved' } : d));
    ToastService.success('LTC claim approved.');
  };

  const handleReject = (item: LtcRecord) => {
    setData(prev => prev.map(d => d.id === item.id ? { ...d, status: 'Rejected' } : d));
    ToastService.error('LTC claim rejected.');
  };

  return (
    <FormPage
      title="LTC Management"
      description="Manage Leave Travel Concession claims and approvals."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'LTC Management' },
      ]}
    >
      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="Total Claims" value={data.length} icon="travel_explore" colorScheme="blue" subtitle="All time" />
        <StatCard title="Pending Claims" value={pending} icon="pending_actions" colorScheme="orange" subtitle="Awaiting review" />
        <StatCard title="Approved Claims" value={approved} icon="check_circle" colorScheme="green" subtitle="Processed" />
        <StatCard title="Total Approved Amount" value={`₹${totalClaim.toLocaleString()}`} icon="payments" colorScheme="teal" subtitle="Disbursed" />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'employee', header: 'Employee' },
            { field: 'department', header: 'Department' },
            { field: 'journeyType', header: 'Journey' },
            { field: 'travelDate', header: 'Travel Date' },
            { field: 'destination', header: 'Destination' },
            {
              field: 'claimAmount', header: 'Amount',
              cell: (item: LtcRecord) => <span>₹{item.claimAmount.toLocaleString()}</span>,
            },
            {
              field: 'status', header: 'Status',
              cell: (item: LtcRecord) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Approved' ? 'approved' : item.status === 'Rejected' ? 'rejected' : 'pending'}
                />
              ),
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: LtcRecord) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined"
                    onClick={() => setPopup({ mode: 'view', item })} />
                  {item.status === 'Pending' && (
                    <>
                      <Button size="small" label="" icon="check" variant="primary" onClick={() => handleApprove(item)} />
                      <Button size="small" label="" icon="times" variant="danger" onClick={() => handleReject(item)} />
                    </>
                  )}
                </div>
              ),
            },
          ]}
          toolbar={<Button label="New LTC Claim" icon="plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox
          searchPlaceholder="Search LTC records..."
        />
      </FormCard>

      {/* Create Popup */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Submit LTC Claim"
        subtitle="Fill in journey details and submit for approval."
        size="xl"
      >
        <FormGrid columns={2}>
          <TextBox label="Employee Name" placeholder="e.g. Dr. Rajesh Kumar" value={form.employee} onChange={v => setForm(f => ({ ...f, employee: v }))} required />
          <DropDownList label="Department" data={deptOptions} textField="name" optionValue="value" placeholder="Select Department" value={form.department} onChange={v => setForm(f => ({ ...f, department: String(v) }))} />
          <DropDownList label="Journey Type" data={JOURNEY_TYPES} textField="name" optionValue="value" value={form.journeyType} onChange={v => setForm(f => ({ ...f, journeyType: String(v) }))} />
          <DatePicker label="Travel Date" value={form.travelDate} onChange={v => setForm(f => ({ ...f, travelDate: v as Date }))} />
          <TextBox label="Destination" placeholder="e.g. Mumbai → Delhi" value={form.destination} onChange={v => setForm(f => ({ ...f, destination: v }))} required />
          <TextBox label="Family Members" placeholder="0" value={String(form.familyMembers)} onChange={v => setForm(f => ({ ...f, familyMembers: Number(v) }))} />
          <TextBox label="Claim Amount (₹)" placeholder="e.g. 25000" value={String(form.claimAmount)} onChange={v => setForm(f => ({ ...f, claimAmount: Number(v) }))} />
        </FormGrid>
        <TextArea label="Purpose" placeholder="Purpose of travel" value={form.purpose} onChange={v => setForm(f => ({ ...f, purpose: v }))} rows={2} />
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
          <Button label="Submit Claim" variant="primary" icon="send" onClick={handleSubmit} />
        </div>
      </FormPopup>

      {/* View Popup */}
      {popup.mode === 'view' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title="LTC Claim Details"
          subtitle={`${popup.item.employee} — ${popup.item.department}`}
        >
          <FormGrid columns={2}>
            {[
              { label: 'Journey Type', value: popup.item.journeyType },
              { label: 'Travel Date', value: popup.item.travelDate },
              { label: 'Destination', value: popup.item.destination },
              { label: 'Purpose', value: popup.item.purpose },
              { label: 'Family Members', value: String(popup.item.familyMembers) },
              { label: 'Claim Amount', value: `₹${popup.item.claimAmount.toLocaleString()}` },
              { label: 'Status', value: popup.item.status },
              { label: 'Approver', value: popup.item.approver },
            ].map(field => (
              <div key={field.label}>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{field.label}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{field.value}</p>
              </div>
            ))}
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Close" variant="outlined" onClick={() => setPopup({ mode: 'closed' })} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
