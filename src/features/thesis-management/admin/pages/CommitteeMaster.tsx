import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { committees } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Committee = (typeof committees)[0];

export default function CommitteeMaster() {
  const [list, setList] = useState<Committee[]>(committees);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [chairperson, setChairperson] = useState('');

  const reset = () => {
    setEditId(null);
    setName('');
    setChairperson('');
  };

  const handleEdit = (c: Committee) => {
    setEditId(c.id);
    setName(c.name);
    setChairperson(c.chairperson);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(c => c.id !== id));
    ToastService.success('Committee removed.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' }
          : c
      )
    );
    ToastService.success('Committee status updated.');
  };

  const handleSave = () => {
    if (!name || !chairperson) {
      ToastService.error('Committee Name and Chairperson are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(c => (c.id === editId ? { ...c, name, chairperson } : c))
      );
      ToastService.success('Committee configuration updated.');
    } else {
      const newC: Committee = {
        id: `cm-${Date.now()}`,
        name,
        chairperson,
        members: [
          { name: 'Dr. Sanjay Tanwani', role: 'Department Rep' },
          { name: 'Dr. Preeti Saxena', role: 'Faculty Rep' },
        ],
        status: 'Active',
      };
      setList(prev => [...prev, newC]);
      ToastService.success('New committee structure created.');
    }
    reset();
  };

  return (
    <FormPage
      title="Committee Master"
      description="Configure and manage Research Advisory Committees (RAC) and Doctoral Committees (DC)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Committee Master' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Research Committees">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Committee Name</th>
                  <th>Chairperson</th>
                  <th>Members Count</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td style={{ fontSize: '0.813rem' }}>{c.chairperson}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      {c.members.length} Members
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${c.status === 'Active' ? 'approved' : 'draft'}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(c)}
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
                          onClick={() => handleToggle(c.id)}
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
                          {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
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

        <FormCard title={editId ? 'Edit Committee' : 'Add New Committee'}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Committee Name"
              value={name}
              onChange={setName}
              required
            />
            <TextBox
              label="Chairperson"
              value={chairperson}
              onChange={setChairperson}
              required
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Committee' : 'Save Committee'}
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
