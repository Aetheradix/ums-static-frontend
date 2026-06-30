import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { govtPortals } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminGovtIntegration() {
  const [portals, setPortals] = useState(govtPortals);
  const [selected, setSelected] = useState(govtPortals[0]);
  const [endpoint, setEndpoint] = useState(selected.endpoint);
  const [apiKey, setApiKey] = useState(selected.apiKey);

  const handleUpdate = () => {
    setPortals(prev =>
      prev.map(p => (p.id === selected.id ? { ...p, endpoint, apiKey } : p))
    );
    ToastService.success(`API parameters updated for ${selected.acronym}.`);
  };

  const handleTest = () => {
    ToastService.success(
      `Ping check to ${selected.acronym} API endpoint: 200 OK Connection Stable.`
    );
  };

  return (
    <FormPage
      title="Government Integration Config"
      description="Configure Central and State Government Scholarship API endpoints and authentication keys."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Government Integration' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Integrated Govt Services">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            {portals.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  setSelected(p);
                  setEndpoint(p.endpoint);
                  setApiKey(p.apiKey);
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                  border: `1px solid ${selected.id === p.id ? '#3b82f6' : '#e5e7eb'}`,
                  background: selected.id === p.id ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.813rem', fontWeight: 700 }}>
                    {p.name} ({p.acronym})
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                    Endpoint: {p.endpoint}
                  </p>
                </div>
                <span className={`dbt-status-pill ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title={`Endpoint configuration — ${selected.acronym}`}>
          <TextBox
            label="API Gateway Endpoint URL"
            value={endpoint}
            onChange={setEndpoint}
            required
          />
          <div style={{ marginTop: '0.75rem' }}>
            <TextBox
              label="Authentication API Secret Key"
              value={apiKey}
              onChange={setApiKey}
              required
            />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.625rem' }}>
            <Button
              label="Save Changes"
              variant="primary"
              onClick={handleUpdate}
            />
            <Button
              label="Ping Gateway Check"
              variant="outlined"
              onClick={handleTest}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
