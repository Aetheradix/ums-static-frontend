import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { scholarshipSchemes } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminSchemeMaster() {
  const [list, setList] = useState(scholarshipSchemes);
  const [name, setName] = useState('');
  const [portal, setPortal] = useState('NSP');
  const [eligibility, setEligibility] = useState('');

  const handleCreate = () => {
    if (!name || !eligibility) {
      ToastService.error('Please fill name and eligibility description.');
      return;
    }
    const newScheme = {
      id: `sch-${list.length + 1}`,
      name,
      type: 'Central' as const,
      category: ['SC', 'ST', 'OBC', 'EWS'],
      lastDate: '30 Nov 2025',
      amount: 45000,
      eligibility,
      portal,
      status: 'Open' as const,
      color: '#0ea5e9',
    };
    setList([...list, newScheme]);
    setName('');
    setEligibility('');
    ToastService.success(
      'New scheme created and linked with Government Portal API.'
    );
  };

  return (
    <FormPage
      title="Scheme Master Configuration"
      description="Configure Central, State, and University level scholarship schemes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Scheme Master' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Active Schemes & Portal Mapping">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Scheme Name</th>
                  <th>Portal</th>
                  <th>Eligibility Criteria</th>
                  <th>Disbursement</th>
                </tr>
              </thead>
              <tbody>
                {list.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td>
                      <span className="dbt-status-pill success">
                        {s.portal}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {s.eligibility}
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{s.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Map New Government Portal Scheme">
          <TextBox
            label="Government Scheme Name"
            value={name}
            onChange={setName}
            required
          />
          <div style={{ marginTop: '0.75rem' }}>
            <label
              style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}
            >
              Associated Govt Portal
            </label>
            <select
              className="dbt-filter-select"
              style={{ width: '100%', marginTop: 4, height: 38 }}
              value={portal}
              onChange={e => setPortal(e.target.value)}
            >
              <option value="NSP">National Scholarship Portal (NSP)</option>
              <option value="MP Portal">MP State Scholarship Portal</option>
              <option value="MAHA DBT">MAHA DBT Portal</option>
            </select>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <TextBox
              label="Eligibility / Rules Description"
              value={eligibility}
              onChange={setEligibility}
              required
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Button
              label="Map Scheme API"
              variant="primary"
              onClick={handleCreate}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
