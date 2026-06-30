import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { trainingSessions } from '../../mocks';
import { tdmUrls } from '../../urls';

export default function MaterialsPage() {
  const [fileName, setFileName] = useState<string>('');

  return (
    <FormPage
      title="Training Materials"
      description="Upload presentations, handouts and resources for your sessions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'External Portal', to: tdmUrls.external.portal },
        { label: 'Materials' },
      ]}
    >
      <FormCard title="Upload New Material">
        <FormGrid columns={2}>
          <DropDownList
            label="Select Session"
            data={trainingSessions.map(s => ({
              name: `${s.trainingTitle} - ${s.topic}`,
              value: s.sessionId,
            }))}
            textField="name"
            optionValue="value"
          />
          <TextBox
            label="Material Title"
            placeholder="e.g. Session 1 Presentation"
          />
        </FormGrid>
        <div style={{ marginTop: '1rem' }}>
          <TextArea
            label="Description"
            rows={3}
            placeholder="Brief description of the material..."
          />
        </div>
        <label
          style={{
            display: 'block',
            marginTop: '1.5rem',
            border: '2px dashed #d1d5db',
            borderRadius: 8,
            padding: '2rem',
            textAlign: 'center',
            background: '#f9fafb',
            cursor: 'pointer',
          }}
        >
          <input
            type="file"
            style={{ display: 'none' }}
            onChange={e => setFileName(e.target.files?.[0]?.name || '')}
          />
          <i
            className="pi pi-cloud-upload"
            style={{
              fontSize: '2rem',
              color: '#9ca3af',
              marginBottom: '0.5rem',
            }}
          />
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: '0 0 1rem 0',
            }}
          >
            {fileName
              ? `Selected file: ${fileName}`
              : 'Drag and drop files here or click to browse'}
          </p>
          <div style={{ pointerEvents: 'none', display: 'inline-block' }}>
            <Button
              label={fileName ? 'Change File' : 'Select Files'}
              variant="outlined"
            />
          </div>
        </label>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1.5rem',
          }}
        >
          <Button label="Upload Material" icon="upload" variant="primary" />
        </div>
      </FormCard>

      <div style={{ marginTop: '1.5rem' }}>
        <FormCard title="Uploaded Materials">
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            No materials uploaded yet.
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
