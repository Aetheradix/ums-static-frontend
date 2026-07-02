import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { supervisors } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Supervisor = (typeof supervisors)[0];

export default function SupervisorMaster() {
  const [list, setList] = useState<Supervisor[]>(supervisors);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [maxLimit, setMaxLimit] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const reset = () => {
    setEditId(null);
    setName('');
    setDesignation('');
    setDepartment('');
    setSpecialization('');
    setMaxLimit('');
    setEmail('');
    setPhone('');
  };

  const handleEdit = (s: Supervisor) => {
    setEditId(s.id);
    setName(s.name);
    setDesignation(s.designation);
    setDepartment(s.department);
    setSpecialization(s.specialization);
    setMaxLimit(String(s.maxLimit));
    setEmail(s.email);
    setPhone(s.phone);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(s => s.id !== id));
    ToastService.success('Supervisor record deleted.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' }
          : s
      )
    );
    ToastService.success('Supervisor status updated.');
  };

  const handleSave = () => {
    if (!name || !designation || !department || !maxLimit || !email) {
      ToastService.error(
        'Required fields: Name, Designation, Department, Max Limit, Email.'
      );
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(s =>
          s.id === editId
            ? {
                ...s,
                name,
                designation,
                department,
                specialization,
                maxLimit: Number(maxLimit),
                email,
                phone,
              }
            : s
        )
      );
      ToastService.success('Supervisor master updated.');
    } else {
      const newS: Supervisor = {
        id: `sv-${Date.now()}`,
        name,
        designation,
        department,
        specialization,
        maxLimit: Number(maxLimit),
        currentAllocation: 0,
        email,
        phone,
        status: 'Active',
        availability: 'Available',
      };
      setList(prev => [...prev, newS]);
      ToastService.success('New research supervisor registered in system.');
    }
    reset();
  };

  return (
    <FormPage
      title="Supervisor Master"
      description="Manage Devi Ahilya Vishwavidyalaya research guides/co-guides and intake limits."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Supervisor Master' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Registered Supervisors">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation / Dept</th>
                  <th>Limit</th>
                  <th>Allocated</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {s.designation} ({s.department})
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      {s.maxLimit}
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        fontWeight: 700,
                        color:
                          s.currentAllocation >= s.maxLimit
                            ? '#ef4444'
                            : '#1e40af',
                      }}
                    >
                      {s.currentAllocation}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                      {s.email}
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${s.status === 'Active' ? 'approved' : 'draft'}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(s)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #3b82f6',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(s.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #f59e0b',
                            background: '#fffbeb',
                            color: '#d97706',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
                          }}
                        >
                          {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #ef4444',
                            background: '#fff',
                            color: '#b91c1c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard
          title={editId ? 'Edit Supervisor Details' : 'Register New Supervisor'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Full Name"
              value={name}
              onChange={setName}
              required
            />
            <TextBox
              label="Designation (e.g. Professor)"
              value={designation}
              onChange={setDesignation}
              required
            />
            <TextBox
              label="Department Code"
              value={department}
              onChange={setDepartment}
              required
            />
            <TextBox
              label="Specialization Domain"
              value={specialization}
              onChange={setSpecialization}
            />
            <TextBox
              label="PhD Scholar Limit"
              type="number"
              value={maxLimit}
              onChange={setMaxLimit}
              required
            />
            <TextBox
              label="Email Address"
              value={email}
              onChange={setEmail}
              required
            />
            <TextBox label="Mobile Number" value={phone} onChange={setPhone} />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Supervisor' : 'Save Supervisor'}
                variant="primary"
                onClick={handleSave}
              />
              {editId && (
                <Button label="Cancel" variant="outlined" onClick={reset} />
              )}
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
