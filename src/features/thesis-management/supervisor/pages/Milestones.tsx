import { useState } from 'react';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { milestones } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type MS = (typeof milestones)[0];

export default function SupervisorMilestones() {
  const [list, setList] = useState<MS[]>(milestones);

  const handleSignoff = (id: string) => {
    setList(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, status: 'Completed', completionDate: '30 Jun 2026' }
          : m
      )
    );
    ToastService.success('Milestone signed off and marked completed!');
  };

  const handleFlag = (id: string) => {
    setList(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              status: 'Overdue',
              remarks: 'Flagged by supervisor — overdue',
            }
          : m
      )
    );
    ToastService.success('Milestone flagged as overdue. Scholar notified.');
  };

  const statusColor: Record<string, string> = {
    Completed: 'approved',
    'In Progress': 'submitted',
    Pending: 'draft',
    Overdue: 'rejected',
  };

  return (
    <FormPage
      title="Milestones Sign-off"
      description="Sign off completed milestones and flag overdue ones across all assigned scholars."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Milestones' },
      ]}
    >
      <FormCard title="Scholar Milestones">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Scholar</th>
                <th>Milestone</th>
                <th>Due Date</th>
                <th>Completion</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>Rajesh Sahu</td>
                  <td>{m.name}</td>
                  <td>{m.dueDate}</td>
                  <td style={{ color: '#16a34a', fontSize: '0.75rem' }}>
                    {m.completionDate || '—'}
                  </td>
                  <td>
                    <span
                      className={`dbt-status-pill ${statusColor[m.status]}`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {m.status === 'In Progress' && (
                        <button
                          type="button"
                          onClick={() => handleSignoff(m.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #22c55e',
                            background: '#f0fdf4',
                            color: '#16a34a',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                            fontWeight: 600,
                          }}
                        >
                          Sign Off
                        </button>
                      )}
                      {(m.status === 'In Progress' ||
                        m.status === 'Pending') && (
                        <button
                          type="button"
                          onClick={() => handleFlag(m.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #ef4444',
                            background: '#fef2f2',
                            color: '#b91c1c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                            fontWeight: 600,
                          }}
                        >
                          Flag Overdue
                        </button>
                      )}
                      {(m.status === 'Completed' || m.status === 'Overdue') && (
                        <span
                          style={{ fontSize: '0.688rem', color: '#9ca3af' }}
                        >
                          No action
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
