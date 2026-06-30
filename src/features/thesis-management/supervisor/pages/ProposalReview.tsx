import { useState } from 'react';
import { ToastService } from 'services';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface ProposalItem {
  scholarId: string;
  scholarName: string;
  title: string;
  version: string;
  similarity: number;
  submittedOn: string;
  status: 'Pending Review' | 'Approved' | 'Returned' | 'Revision Requested';
}

const initialProposals: ProposalItem[] = [
  {
    scholarId: 'sch-1',
    scholarName: 'Rajesh Kumar Sahu',
    title:
      'Optimizing Low-Resource Translation for Central Indian Dialects using Hybrid Transformer Ensembles',
    version: 'V1.2',
    similarity: 8.5,
    submittedOn: '12 Mar 2025',
    status: 'Approved',
  },
  {
    scholarId: 'sch-2',
    scholarName: 'Priya Verma',
    title:
      'Homomorphic Encryption Schemes for Privacy-Preserving Cloud Audit Logs',
    version: 'V2.0',
    similarity: 6.2,
    submittedOn: '10 Jun 2025',
    status: 'Approved',
  },
  {
    scholarId: 'sch-3',
    scholarName: 'Amit Khandelwal',
    title:
      'Deep Supervision Network for Multi-Modal Medical Image Segmentation',
    version: 'V1.0',
    similarity: 12.1,
    submittedOn: '28 Jun 2026',
    status: 'Pending Review',
  },
  {
    scholarId: 'sch-4',
    scholarName: 'Sunita Chouhan',
    title: 'Smart Healthcare IoT Architecture with Adaptive Edge Intelligence',
    version: 'V3.1',
    similarity: 4.8,
    submittedOn: '15 Jul 2024',
    status: 'Approved',
  },
];

export default function ProposalReview() {
  const [proposals, setProposals] = useState<ProposalItem[]>(initialProposals);
  const [selected, setSelected] = useState<ProposalItem | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleAction = (
    action: 'Approved' | 'Returned' | 'Revision Requested'
  ) => {
    if (!selected) return;
    if (!remarks) {
      ToastService.error('Please enter remarks before taking action.');
      return;
    }
    setProposals(prev =>
      prev.map(p =>
        p.scholarId === selected.scholarId ? { ...p, status: action } : p
      )
    );
    ToastService.success(`Proposal ${action} with remarks saved.`);
    setSelected(null);
    setRemarks('');
  };

  const statusColor: Record<string, string> = {
    Approved: 'approved',
    'Pending Review': 'submitted',
    Returned: 'rejected',
    'Revision Requested': 'draft',
  };

  return (
    <FormPage
      title="Proposal Review"
      description="Review, approve, return or request revisions on scholar research proposals."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Proposal Review' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Scholar Proposals Queue">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Proposal Title</th>
                  <th>Ver</th>
                  <th>Similarity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map(p => (
                  <tr key={p.scholarId}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {p.scholarName.split(' ')[0]}
                    </td>
                    <td style={{ maxWidth: 220, fontSize: '0.75rem' }}>
                      {p.title}
                    </td>
                    <td>{p.version}</td>
                    <td
                      style={{
                        color: p.similarity <= 10 ? '#16a34a' : '#dc2626',
                        fontWeight: 700,
                      }}
                    >
                      {p.similarity}%
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${statusColor[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(p);
                          setRemarks('');
                        }}
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #6366f1',
                          background: '#f5f3ff',
                          color: '#4f46e5',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.688rem',
                          fontWeight: 600,
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard
          title={
            selected
              ? `Review: ${selected.scholarName}`
              : 'Select a Proposal to Review'
          }
        >
          {!selected ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                color: '#9ca3af',
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>📋</span>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                Click "Review" on any proposal to start
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  padding: '0.875rem',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                }}
              >
                <p
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 700,
                    color: '#374151',
                    marginBottom: 4,
                  }}
                >
                  Research Title:
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {selected.title}
                </p>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    marginTop: 4,
                  }}
                >
                  Submitted: {selected.submittedOn} · {selected.version}
                </p>
              </div>
              <TextArea
                label="Supervisor Remarks *"
                value={remarks}
                onChange={setRemarks}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleAction('Approved')}
                  style={{
                    padding: '0.5rem',
                    background: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.813rem',
                  }}
                >
                  ✓ Approve Proposal
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('Revision Requested')}
                  style={{
                    padding: '0.5rem',
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.813rem',
                  }}
                >
                  ↩ Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('Returned')}
                  style={{
                    padding: '0.5rem',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.813rem',
                  }}
                >
                  ✗ Return Proposal
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  style={{
                    padding: '0.5rem',
                    background: '#fff',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.813rem',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
