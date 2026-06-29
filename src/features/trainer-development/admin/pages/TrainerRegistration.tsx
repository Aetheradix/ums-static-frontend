import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type Trainer, trainers as initialData, departments } from '../../mocks';
import { tdmUrls } from '../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: Trainer } | { mode: 'view'; item: Trainer };

const EMPTY: Partial<Trainer> = {
  trainerId: '', employeeId: '', name: '', department: departments[0],
  designation: '', qualification: '', experience: 0, industryExperience: 0,
  trainerType: 'Internal', employmentType: 'Regular', email: '', mobile: '',
  specialization: [], skills: [], languages: [], status: 'Active', rating: 0, totalSessions: 0, certifications: []
};

const TRAINER_TYPES = [{ name: 'Internal', value: 'Internal' }, { name: 'External', value: 'External' }, { name: 'Guest', value: 'Guest' }];
const EMPLOYMENT_TYPES = [{ name: 'Regular', value: 'Regular' }, { name: 'Contract', value: 'Contract' }, { name: 'Visiting', value: 'Visiting' }, { name: 'Adjunct', value: 'Adjunct' }];
const STATUS_OPTIONS = [{ name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }, { name: 'On Deputation', value: 'On Deputation' }];

export default function TrainerRegistration() {
  const [data, setData] = useState<Trainer[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Trainer>>(EMPTY);

  const close = useCallback(() => { setPopup({ mode: 'closed' }); setForm(EMPTY); }, []);

  const handleSave = () => {
    if (!form.name || !form.email) { ToastService.error('Name and Email are required.'); return; }
    if (popup.mode === 'create') {
      setData(prev => [{ ...form, id: String(Date.now()), trainerId: `TDM-TR-${Math.floor(Math.random() * 1000)}`, rating: 0, totalSessions: 0, specialization: [], skills: [], languages: [], certifications: [] } as Trainer, ...prev]);
      ToastService.success('Trainer registered successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev => prev.map(d => d.id === (popup as any).item.id ? { ...d, ...form } as Trainer : d));
      ToastService.success('Trainer updated successfully.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Trainer Registration"
      description="Register and manage internal, external, and guest trainers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Trainers' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { field: 'trainerId', header: 'Trainer ID' },
            {
              field: 'name', header: 'Trainer Details',
              cell: (item: Trainer) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.email}</span>
                </div>
              ),
            },
            { field: 'department', header: 'Department' },
            { field: 'trainerType', header: 'Type' },
            {
              field: 'rating', header: 'Rating',
              cell: (item: Trainer) => (
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>★ {item.rating.toFixed(1)}</span>
              )
            },
            {
              field: 'status', header: 'Status',
              cell: (item: Trainer) => (
                <StatusBadge label={item.status} variant={item.status === 'Active' ? 'approved' : item.status === 'Inactive' ? 'rejected' : 'pending'} />
              ),
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: Trainer) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'view', item }); }} />
                  <Button size="small" label="" icon="pencil" variant="primary" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                </div>
              ),
            },
          ]}
          toolbar={<Button label="Register Trainer" icon="user-plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'create' ? 'Register New Trainer' : popup.mode === 'edit' ? 'Edit Trainer' : 'Trainer Profile'}
        size="lg"
      >
        <div style={{ padding: '0.5rem 0', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>Personal & Professional Details</div>
        <FormGrid columns={3}>
          <TextBox label="Full Name" value={form.name ?? ''} onChange={v => setForm(f => ({ ...f, name: v }))} required readOnly={isReadOnly} />
          <TextBox label="Email Address" type="email" value={form.email ?? ''} onChange={v => setForm(f => ({ ...f, email: v }))} required readOnly={isReadOnly} />
          <TextBox label="Mobile Number" value={form.mobile ?? ''} onChange={v => setForm(f => ({ ...f, mobile: v }))} required readOnly={isReadOnly} />
          <DropDownList label="Trainer Type" data={TRAINER_TYPES} textField="name" optionValue="value" value={form.trainerType} onChange={v => setForm(f => ({ ...f, trainerType: v as any }))} disabled={isReadOnly} />
          <DropDownList label="Employment Type" data={EMPLOYMENT_TYPES} textField="name" optionValue="value" value={form.employmentType} onChange={v => setForm(f => ({ ...f, employmentType: v as any }))} disabled={isReadOnly} />
          <DropDownList label="Department / Domain" data={departments.map(d => ({ name: d, value: d }))} textField="name" optionValue="value" value={form.department} onChange={v => setForm(f => ({ ...f, department: v as any }))} disabled={isReadOnly} />
          <TextBox label="Designation" value={form.designation ?? ''} onChange={v => setForm(f => ({ ...f, designation: v }))} readOnly={isReadOnly} />
          <TextBox label="Highest Qualification" value={form.qualification ?? ''} onChange={v => setForm(f => ({ ...f, qualification: v }))} readOnly={isReadOnly} />
          <TextBox label="Employee ID" value={form.employeeId ?? ''} onChange={v => setForm(f => ({ ...f, employeeId: v }))} readOnly={isReadOnly} />
          <TextBox label="Academic Experience (Years)" type="number" value={form.experience?.toString() ?? ''} onChange={v => setForm(f => ({ ...f, experience: Number(v) }))} readOnly={isReadOnly} />
          <TextBox label="Industry Experience (Years)" type="number" value={form.industryExperience?.toString() ?? ''} onChange={v => setForm(f => ({ ...f, industryExperience: Number(v) }))} readOnly={isReadOnly} />
          <DropDownList label="Status" data={STATUS_OPTIONS} textField="name" optionValue="value" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as any }))} disabled={isReadOnly} />
        </FormGrid>

        <div style={{ padding: '0.5rem 0', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb', marginTop: '1rem', marginBottom: '1rem' }}>Documents Upload</div>
        <FormGrid columns={3}>
          <div>
            <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Profile Photo</label>
            <Button label="Choose File..." variant="outlined" icon="upload" size="small" disabled={isReadOnly} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Detailed Resume</label>
            <Button label="Choose File..." variant="outlined" icon="upload" size="small" disabled={isReadOnly} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Certificates (Zip)</label>
            <Button label="Choose File..." variant="outlined" icon="upload" size="small" disabled={isReadOnly} />
          </div>
        </FormGrid>

        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-6">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label={popup.mode === 'create' ? 'Register Trainer' : 'Save Changes'} variant="primary" icon="check" onClick={handleSave} />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
