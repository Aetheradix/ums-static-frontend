import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { researchAreas } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Area = (typeof researchAreas)[0];

export default function AreaMaster() {
  const [list, setList] = useState<Area[]>(researchAreas);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [parentDomain, setParentDomain] = useState('');
  const [keywords, setKeywords] = useState('');

  const reset = () => {
    setEditId(null);
    setName('');
    setParentDomain('');
    setKeywords('');
  };

  const handleEdit = (a: Area) => {
    setEditId(a.id);
    setName(a.name);
    setParentDomain(a.parentDomain);
    setKeywords(a.keywords);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(a => a.id !== id));
    ToastService.success('Research area record deleted.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' }
          : a
      )
    );
    ToastService.success('Research area status updated.');
  };

  const handleSave = () => {
    if (!name || !parentDomain) {
      ToastService.error('Name and Parent Domain are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(a =>
          a.id === editId ? { ...a, name, parentDomain, keywords } : a
        )
      );
      ToastService.success('Research area updated.');
    } else {
      const newA: Area = {
        id: `ra-${Date.now()}`,
        name,
        parentDomain,
        keywords,
        status: 'Active',
      };
      setList(prev => [...prev, newA]);
      ToastService.success('New research area added to catalog.');
    }
    reset();
  };

  return (
    <FormPage
      title="Research Area Master"
      description="Configure research domains, specialization categories, and indexing keywords."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Area Master' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Research Area Database">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Research Area</th>
                  <th>Parent Domain</th>
                  <th>Keywords</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 700 }}>{a.name}</td>
                    <td style={{ fontWeight: 600 }}>{a.parentDomain}</td>
                    <td
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        maxWidth: 180,
                      }}
                    >
                      {a.keywords}
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${a.status === 'Active' ? 'approved' : 'draft'}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(a)}
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
                          onClick={() => handleToggle(a.id)}
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
                          {a.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(a.id)}
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

        <FormCard title={editId ? 'Edit Research Area' : 'Add Research Area'}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Area Name (e.g. Natural Language Processing)"
              value={name}
              onChange={setName}
              required
            />
            <TextBox
              label="Parent Domain (e.g. Artificial Intelligence)"
              value={parentDomain}
              onChange={setParentDomain}
              required
            />
            <TextBox
              label="Keywords (Comma separated)"
              value={keywords}
              onChange={setKeywords}
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Area' : 'Save Area'}
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
