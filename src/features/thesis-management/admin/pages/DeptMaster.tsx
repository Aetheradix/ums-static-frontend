import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  intakeSeats: number;
  coordinator: string;
  status: 'Active' | 'Inactive';
}

const initialDepts: DepartmentRecord[] = [
  {
    id: 'dp-1',
    name: 'School of Computer Science & IT',
    code: 'SCSIT',
    intakeSeats: 15,
    coordinator: 'Dr. Sanjay Tanwani',
    status: 'Active',
  },
  {
    id: 'dp-2',
    name: 'School of Electronics',
    code: 'SOE',
    intakeSeats: 10,
    coordinator: 'Dr. Abhay Kumar',
    status: 'Active',
  },
  {
    id: 'dp-3',
    name: 'School of Physics',
    code: 'SOP',
    intakeSeats: 8,
    coordinator: 'Dr. Ashutosh Mishra',
    status: 'Inactive',
  },
];

export default function DeptMaster() {
  const [list, setList] = useState<DepartmentRecord[]>(initialDepts);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [intakeSeats, setIntakeSeats] = useState('');
  const [coordinator, setCoordinator] = useState('');

  const reset = () => {
    setEditId(null);
    setName('');
    setCode('');
    setIntakeSeats('');
    setCoordinator('');
  };

  const handleEdit = (d: DepartmentRecord) => {
    setEditId(d.id);
    setName(d.name);
    setCode(d.code);
    setIntakeSeats(String(d.intakeSeats));
    setCoordinator(d.coordinator);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(d => d.id !== id));
    ToastService.success('Department record deleted.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' }
          : d
      )
    );
    ToastService.success('Department status updated.');
  };

  const handleSave = () => {
    if (!name || !code || !intakeSeats || !coordinator) {
      ToastService.error('All fields are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(d =>
          d.id === editId
            ? {
                ...d,
                name,
                code,
                intakeSeats: Number(intakeSeats),
                coordinator,
              }
            : d
        )
      );
      ToastService.success('Department master updated.');
    } else {
      const newD: DepartmentRecord = {
        id: `dp-${Date.now()}`,
        name,
        code,
        intakeSeats: Number(intakeSeats),
        coordinator,
        status: 'Active',
      };
      setList(prev => [...prev, newD]);
      ToastService.success('New department added to research list.');
    }
    reset();
  };

  return (
    <FormPage
      title="Department Master"
      description="Configure departments research seat limits, coordinator mappings and active states."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Department Master' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Research Departments">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Code</th>
                  <th>Intake Seats</th>
                  <th>Coordinator</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700 }}>{d.name}</td>
                    <td style={{ fontWeight: 600, color: '#1e40af' }}>
                      {d.code}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>
                      {d.intakeSeats} Seats
                    </td>
                    <td style={{ fontSize: '0.813rem' }}>{d.coordinator}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${d.status === 'Active' ? 'approved' : 'draft'}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(d)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #3b82f6',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(d.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #f59e0b',
                            background: '#fffbeb',
                            color: '#d97706',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                          }}
                        >
                          {d.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(d.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #ef4444',
                            background: '#fff',
                            color: '#b91c1c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
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
          title={editId ? 'Edit Department Details' : 'Add Research Department'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Department Name"
              value={name}
              onChange={setName}
              required
            />
            <TextBox
              label="Department Code"
              value={code}
              onChange={setCode}
              required
            />
            <TextBox
              label="PhD Intake Capacity (Seats)"
              type="number"
              value={intakeSeats}
              onChange={setIntakeSeats}
              required
            />
            <TextBox
              label="Research Coordinator"
              value={coordinator}
              onChange={setCoordinator}
              required
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Department' : 'Save Department'}
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
