import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { documentsMaster } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminDocumentMaster() {
  const [list, setList] = useState(documentsMaster);
  const [label, setLabel] = useState('');
  const [mandatory, setMandatory] = useState(false);

  const handleAdd = () => {
    if (!label) {
      ToastService.error('Document title is required.');
      return;
    }
    const newDoc = {
      id: `doc-${list.length + 1}`,
      label,
      mandatory,
      uploaded: false,
    };
    setList([...list, newDoc]);
    setLabel('');
    setMandatory(false);
    ToastService.success('New document type added to mandatory checklists.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(d => (d.id === id ? { ...d, mandatory: !d.mandatory } : d))
    );
    ToastService.success('Required flag toggled.');
  };

  return (
    <FormPage
      title="Document Checklist Master"
      description="Define mandatory and optional documents required from student applicants."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Document Master' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Document List Configuration">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Mandatory</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700 }}>{d.label}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${d.mandatory ? 'rejected' : 'draft'}`}
                      >
                        {d.mandatory ? 'Required' : 'Optional'}
                      </span>
                    </td>
                    <td>
                      <Button
                        label="Toggle Status"
                        variant="outlined"
                        size="small"
                        onClick={() => handleToggle(d.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Register New Required Document Type">
          <TextBox
            label="Document Name / Title"
            value={label}
            onChange={setLabel}
            required
          />
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <input
              type="checkbox"
              id="isMandatory"
              checked={mandatory}
              onChange={e => setMandatory(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#2563eb' }}
            />
            <label
              htmlFor="isMandatory"
              style={{
                fontSize: '0.813rem',
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              Mark as Mandatory for all applications
            </label>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <Button
              label="Add Document Type"
              variant="primary"
              onClick={handleAdd}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
