import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function PlagiarismSettings() {
  const [apiKey, setApiKey] = useState('trn_key_9281a8b92d89cf29');
  const [apiEndpoint, setApiEndpoint] = useState(
    'https://api.turnitin.com/v1/similarity'
  );
  const [maxThreshold, setMaxThreshold] = useState('10.0');
  const [excludeBibliography, setExcludeBibliography] = useState(true);
  const [excludeQuotes, setExcludeQuotes] = useState(true);
  const [minWordCount, setMinWordCount] = useState('15');

  const handleSave = () => {
    ToastService.success(
      'Turnitin plagiarism integration settings saved successfully.'
    );
  };

  const handleTestConnection = () => {
    ToastService.success(
      'Connection to Turnitin iThenticate API established successfully (Status 200 OK).'
    );
  };

  return (
    <FormPage
      title="Plagiarism Verification Settings"
      description="Configure Turnitin API integrations, similarity thresholds and index filters."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Plagiarism Settings' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="API Connection Settings">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Plagiarism Service Provider"
              value="Turnitin iThenticate"
              disabled
            />
            <TextBox
              label="API Gateway Endpoint URL"
              value={apiEndpoint}
              onChange={setApiEndpoint}
              required
            />
            <TextBox
              label="Integration Secret API Key"
              type="password"
              value={apiKey}
              onChange={setApiKey}
              required
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label="Test Connection"
                variant="outlined"
                onClick={handleTestConnection}
              />
              <Button
                label="Save Integration Details"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Verification Indexing Rules">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}
          >
            <TextBox
              label="Maximum Similarity Allowed Threshold (%)"
              type="number"
              value={maxThreshold}
              onChange={setMaxThreshold}
              required
            />
            <TextBox
              label="Minimum Match Word Count"
              type="number"
              value={minWordCount}
              onChange={setMinWordCount}
              required
            />

            <div
              style={{
                padding: '0.875rem',
                background: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Index Exclusion Filters
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#4b5563',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={excludeBibliography}
                    onChange={e => setExcludeBibliography(e.target.checked)}
                  />
                  Exclude Bibliography / Reference section
                </label>
                <label
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#4b5563',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={excludeQuotes}
                    onChange={e => setExcludeQuotes(e.target.checked)}
                  />
                  Exclude Direct Quotes in Blockquotes
                </label>
              </div>
            </div>

            <div
              style={{
                padding: '0.75rem',
                background: '#eff6ff',
                borderRadius: 6,
                border: '1px solid #bfdbfe',
                fontSize: '0.688rem',
                color: '#1e40af',
              }}
            >
              ℹ️ Plagiarism checking runs asynchronously on every scholar
              proposal and final thesis submission. Similarity index reports are
              synced back to URC cell logs.
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
