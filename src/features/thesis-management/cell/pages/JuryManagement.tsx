import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { juryMembers } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Jury = (typeof juryMembers)[0];

export default function JuryManagement() {
  const [list, setList] = useState<Jury[]>(juryMembers);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'External' | 'Internal'>('External');

  const reset = () => {
    setEditId(null);
    setName('');
    setInstitution('');
    setSpecialization('');
    setEmail('');
    setType('External');
  };

  const handleEdit = (j: Jury) => {
    setEditId(j.id);
    setName(j.name);
    setInstitution(j.institution);
    setSpecialization(j.specialization);
    setEmail(j.email);
    setType(j.type);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(j => j.id !== id));
    ToastService.success('Jury member removed.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(j =>
        j.id === id
          ? { ...j, status: j.status === 'Active' ? 'Inactive' : 'Active' }
          : j
      )
    );
    ToastService.success('Jury member status updated.');
  };

  const handleSave = () => {
    if (!name || !institution || !email) {
      ToastService.error('Name, Institution and Email required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(j =>
          j.id === editId
            ? { ...j, name, institution, specialization, email, type }
            : j
        )
      );
      ToastService.success('Jury member updated.');
    } else {
      const newJ: Jury = {
        id: `jm-${Date.now()}`,
        name,
        institution,
        type,
        specialization,
        email,
        status: 'Active',
      };
      setList(prev => [...prev, newJ]);
      ToastService.success('New jury member added to database.');
    }
    reset();
  };

  return (
    <FormPage
      title="Jury Management"
      description="Manage the jury panel database of internal and external examiners for viva defense."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Jury Management' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.5fr 1fr' }}
      >
        <FormCard title="Jury Panel Database">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Institution</th>
                  <th>Type</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(j => (
                  <tr key={j.id}>
                    <td style={{ fontWeight: 700 }}>{j.name}</td>
                    <td style={{ fontSize: '0.75rem' }}>{j.institution}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${j.type === 'External' ? 'rejected' : 'submitted'}`}
                      >
                        {j.type}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>{j.specialization}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${j.status === 'Active' ? 'approved' : 'draft'}`}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(j)}
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
                          onClick={() => handleToggle(j.id)}
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
                          {j.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(j.id)}
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

        <FormCard title={editId ? 'Edit Jury Member' : 'Add Jury Member'}>
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
              label="Institution / University"
              value={institution}
              onChange={setInstitution}
              required
            />
            <TextBox
              label="Specialization"
              value={specialization}
              onChange={setSpecialization}
            />
            <TextBox
              label="Email Address"
              value={email}
              onChange={setEmail}
              required
            />
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Examiner Type
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={type}
                onChange={e => setType(e.target.value as any)}
              >
                <option value="External">External</option>
                <option value="Internal">Internal</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                label={editId ? 'Update Member' : 'Add Member'}
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
