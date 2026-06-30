import { useState } from 'react';
import { ToastService } from 'services';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface ProposalApprovalItem {
  id: string;
  scholar: string;
  title: string;
  supervisor: string;
  submittedOn: string;
  similarity: number;
  status: 'Pending HOD Approval' | 'HOD Approved' | 'Returned';
}

const initialList: ProposalApprovalItem[] = [
  {
    id: 'pa-1',
    scholar: 'Amit Khandelwal',
    title:
      'Deep Supervision Network for Multi-Modal Medical Image Segmentation',
    supervisor: 'Dr. Preeti Saxena',
    submittedOn: '28 Jun 2026',
    similarity: 12.1,
    status: 'Pending HOD Approval',
  },
  {
    id: 'pa-2',
    scholar: 'Rajesh Kumar Sahu',
    title: 'Optimizing Low-Resource Translation for Central Indian Dialects',
    supervisor: 'Dr. Sanjay Tanwani',
    submittedOn: '12 Mar 2025',
    similarity: 8.5,
    status: 'HOD Approved',
  },
  {
    id: 'pa-3',
    scholar: 'Priya Verma',
    title: 'Homomorphic Encryption for Privacy-Preserving Cloud Audit Logs',
    supervisor: 'Dr. Sanjay Tanwani',
    submittedOn: '10 Jun 2025',
    similarity: 6.2,
    status: 'HOD Approved',
  },
  {
    id: 'pa-4',
    scholar: 'Sunita Chouhan',
    title: 'Smart Healthcare IoT Architecture with Adaptive Edge Intelligence',
    supervisor: 'Dr. Sanjay Tanwani',
    submittedOn: '15 Jul 2024',
    similarity: 4.8,
    status: 'HOD Approved',
  },
];

export default function ProposalApprovals() {
  const [list, setList] = useState<ProposalApprovalItem[]>(initialList);
  const [selected, setSelected] = useState<ProposalApprovalItem | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleAction = (action: 'HOD Approved' | 'Returned') => {
    if (!selected || !remarks) {
      ToastService.error('Remarks required.');
      return;
    }
    setList(prev =>
      prev.map(p => (p.id === selected.id ? { ...p, status: action } : p))
    );
    ToastService.success(
      `Proposal ${action === 'HOD Approved' ? 'approved' : 'returned'} by HOD.`
    );
    setSelected(null);
    setRemarks('');
  };

  const statusColor: Record<string, string> = {
    'HOD Approved': 'approved',
    'Pending HOD Approval': 'submitted',
    Returned: 'rejected',
  };

  return (
    <FormPage
      title="Proposal Approvals"
      description="Review proposals endorsed by supervisors and provide departmental HOD approval."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'HOD Portal', to: thesisUrls.hod.portal },
        { label: 'Proposal Approvals' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Proposal Approval Queue">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Supervisor</th>
                  <th>Similarity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>
                      {p.scholar.split(' ')[0]}
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>{p.supervisor}</td>
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
                      {p.status === 'Pending HOD Approval' && (
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
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title={selected ? 'HOD Approval Form' : 'Select a Proposal'}>
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
                Click "Review" on pending proposals
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
                  }}
                >
                  {selected.scholar}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: 4,
                    fontStyle: 'italic',
                  }}
                >
                  {selected.title}
                </p>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    marginTop: 4,
                  }}
                >
                  Guide: {selected.supervisor} · Similarity:{' '}
                  {selected.similarity}%
                </p>
              </div>
              <TextArea
                label="HOD Remarks *"
                value={remarks}
                onChange={setRemarks}
              />
              <button
                type="button"
                onClick={() => handleAction('HOD Approved')}
                style={{
                  padding: '0.5rem',
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ✓ HOD Approve — Forward to URC Cell
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
                }}
              >
                ✗ Return to Supervisor
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
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
