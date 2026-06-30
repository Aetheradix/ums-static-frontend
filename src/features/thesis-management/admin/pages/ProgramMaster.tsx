import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { programs } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Program = (typeof programs)[0];

export default function ProgramMaster() {
  const [list, setList] = useState<Program[]>(programs);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [minMonths, setMinMonths] = useState('');
  const [maxMonths, setMaxMonths] = useState('');

  const reset = () => {
    setEditId(null);
    setName('');
    setCode('');
    setMinMonths('');
    setMaxMonths('');
  };

  const handleEdit = (p: Program) => {
    setEditId(p.id);
    setName(p.name);
    setCode(p.code);
    setMinMonths(String(p.minMonths));
    setMaxMonths(String(p.maxMonths));
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(p => p.id !== id));
    ToastService.success('Program master deleted.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' }
          : p
      )
    );
    ToastService.success('Program status updated.');
  };

  const handleSave = () => {
    if (!name || !code || !minMonths || !maxMonths) {
      ToastService.error('All fields are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(p =>
          p.id === editId
            ? {
                ...p,
                name,
                code,
                minMonths: Number(minMonths),
                maxMonths: Number(maxMonths),
              }
            : p
        )
      );
      ToastService.success('Program master updated.');
    } else {
      const newP: Program = {
        id: `pg-${Date.now()}`,
        name,
        code,
        minMonths: Number(minMonths),
        maxMonths: Number(maxMonths),
        status: 'Active',
      };
      setList(prev => [...prev, newP]);
      ToastService.success('New program configuration created.');
    }
    reset();
  };

  return (
    <FormPage
      title="Program Master"
      description="Configure Devi Ahilya Vishwavidyalaya research degree programs and duration rules."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Program Master' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Research Programs">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Degree Program</th>
                  <th>Code</th>
                  <th>Min Duration</th>
                  <th>Max Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                    <td style={{ fontWeight: 600, color: '#1e40af' }}>
                      {p.code}
                    </td>
                    <td>{p.minMonths} Months</td>
                    <td>{p.maxMonths} Months</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${p.status === 'Active' ? 'approved' : 'draft'}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
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
                          onClick={() => handleToggle(p.id)}
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
                          {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
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
          title={editId ? 'Edit Program Settings' : 'Add New Degree Program'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Program Name (e.g. Doctor of Philosophy)"
              value={name}
              onChange={setName}
              required
            />
            <TextBox
              label="Program Code (e.g. PHD)"
              value={code}
              onChange={setCode}
              required
            />
            <TextBox
              label="Minimum Duration (Months)"
              type="number"
              value={minMonths}
              onChange={setMinMonths}
              required
            />
            <TextBox
              label="Maximum Duration (Months)"
              type="number"
              value={maxMonths}
              onChange={setMaxMonths}
              required
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Program' : 'Save Program'}
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
