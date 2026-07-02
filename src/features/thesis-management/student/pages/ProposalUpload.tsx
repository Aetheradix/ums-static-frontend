import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface ProposalVersion {
  id: string;
  version: string;
  fileName: string;
  uploadedOn: string;
  similarity: number;
  status: 'Active' | 'Returned' | 'Superseded';
}

const initialVersions: ProposalVersion[] = [
  {
    id: 'v1',
    version: 'V1.2',
    fileName: 'Proposal_IndicTransformers_V1.2.pdf',
    uploadedOn: '12 Mar 2025',
    similarity: 8.5,
    status: 'Active',
  },
  {
    id: 'v2',
    version: 'V1.1',
    fileName: 'Proposal_IndicTransformers_V1.1.pdf',
    uploadedOn: '28 Feb 2025',
    similarity: 18.2,
    status: 'Returned',
  },
  {
    id: 'v3',
    version: 'V1.0',
    fileName: 'Proposal_IndicTransformers_V1.0.pdf',
    uploadedOn: '15 Jan 2025',
    similarity: 24.1,
    status: 'Superseded',
  },
];

export default function ProposalUpload() {
  const [versions, setVersions] = useState<ProposalVersion[]>(initialVersions);

  const handleDelete = (id: string) => {
    setVersions(prev => prev.filter(v => v.id !== id));
    ToastService.success('Proposal version removed.');
  };

  const handleUploadSimulate = () => {
    const newVer: ProposalVersion = {
      id: `v-${Date.now()}`,
      version: `V1.${versions.length + 1}`,
      fileName: `Proposal_IndicTransformers_V1.${versions.length + 1}.pdf`,
      uploadedOn: '30 Jun 2026',
      similarity: Math.round((Math.random() * 12 + 4) * 10) / 10,
      status: 'Active',
    };
    setVersions(prev =>
      prev.map(v =>
        v.status === 'Active' ? { ...v, status: 'Superseded' } : v
      )
    );
    setVersions(prev => [newVer, ...prev]);
    ToastService.success(
      `Proposal ${newVer.version} uploaded and submitted for review.`
    );
  };

  const statusColor: Record<string, string> = {
    Active: 'approved',
    Returned: 'rejected',
    Superseded: 'draft',
  };
  const similarityColor = (s: number) =>
    s <= 10 ? '#16a34a' : s <= 20 ? '#d97706' : '#dc2626';

  return (
    <FormPage
      title="Proposal Upload"
      description="Upload your research proposal PDF. Each submission triggers a Turnitin plagiarism check."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Proposal Upload' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Uploaded Proposal Versions">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>File Name</th>
                  <th>Uploaded On</th>
                  <th>Similarity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {versions.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 700 }}>{v.version}</td>
                    <td style={{ fontSize: '0.75rem' }}>{v.fileName}</td>
                    <td>{v.uploadedOn}</td>
                    <td
                      style={{
                        color: similarityColor(v.similarity),
                        fontWeight: 700,
                      }}
                    >
                      {v.similarity}%
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${statusColor[v.status]}`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() =>
                            ToastService.success(`Downloading ${v.fileName}...`)
                          }
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
                          Download
                        </button>
                        {v.status !== 'Active' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(v.id)}
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
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Upload New Proposal Version">
          <div
            style={{
              padding: '1.5rem',
              border: '2px dashed #cbd5e1',
              borderRadius: 10,
              textAlign: 'center',
              background: '#f8fafc',
              marginBottom: '1rem',
            }}
          >
            <i
              className="pi pi-cloud-upload"
              style={{ fontSize: '2.5rem', color: '#3b82f6' }}
            />
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginTop: '0.5rem',
              }}
            >
              Drag & drop or browse proposal PDF
            </p>
            <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginTop: 2 }}>
              PDF only · Max 15 MB · Triggers Turnitin check
            </p>
          </div>
          <Button
            label="Browse & Upload Proposal"
            variant="primary"
            onClick={handleUploadSimulate}
          />
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#eff6ff',
              borderRadius: 6,
              border: '1px solid #bfdbfe',
            }}
          >
            <p
              style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}
            >
              Submission Rules:
            </p>
            <ul
              style={{
                fontSize: '0.688rem',
                color: '#1e3a8a',
                paddingLeft: '1rem',
                marginTop: 4,
              }}
            >
              <li>Similarity index must be ≤ 10% for approval.</li>
              <li>New upload supersedes the previous active version.</li>
              <li>Contact Cell Officer if report shows &gt; 10%.</li>
            </ul>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
