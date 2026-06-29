import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';
import { studentApplications, type StudentApplication } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const READY = studentApplications.filter(a => a.status === 'Teacher Verified');

export default function CellFinalApproval() {
  const [selected, setSelected] = useState<StudentApplication | null>(null);
  const [remarks, setRemarks] = useState('');
  const [acting, setActing] = useState(false);

  const act = (type: 'approve' | 'reject' | 'hold') => {
    if (!remarks.trim()) {
      ToastService.error('Provide remarks before action.');
      return;
    }
    setActing(true);
    setTimeout(() => {
      setActing(false);
      setRemarks('');
      if (type === 'approve')
        ToastService.success(
          'Application approved and forwarded to Finance Office.'
        );
      else if (type === 'reject') ToastService.error('Application rejected.');
      else ToastService.success('Application put On Hold.');
      setSelected(null);
    }, 800);
  };

  return (
    <FormPage
      title="Final Approval"
      description="Approve, reject or hold scholarship applications for Finance Office processing."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Final Approval' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1fr 1.3fr' }}
      >
        <FormCard title={`Ready for Approval (${READY.length})`}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {READY.map(app => (
              <div
                key={app.id}
                onClick={() => {
                  setSelected(app);
                  setRemarks('');
                }}
                style={{
                  padding: '0.875rem',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: `1px solid ${selected?.id === app.id ? '#3b82f6' : '#e5e7eb'}`,
                  background: selected?.id === app.id ? '#eff6ff' : '#fff',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <p style={{ fontWeight: 700, fontSize: '0.813rem' }}>
                    {app.studentName}
                  </p>
                  <StatusBadge label={app.status} variant="pending" />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {app.appNo} · {app.category}
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#16a34a',
                  }}
                >
                  ₹{app.amount.toLocaleString()}
                </p>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                  {app.schemeName.slice(0, 40)}…
                </p>
              </div>
            ))}
            {READY.length === 0 && (
              <div className="dbt-empty">
                <i className="pi pi-check" />
                <p>No applications pending final approval.</p>
              </div>
            )}
          </div>
        </FormCard>

        {selected ? (
          <FormCard title={`Approval Action — ${selected.appNo}`}>
            <FormGrid columns={2}>
              {[
                ['Student', selected.studentName],
                ['Course', `${selected.course} ${selected.branch}`],
                ['Category', selected.category],
                ['Scheme', selected.schemeName.slice(0, 35) + '…'],
                ['Amount', `₹${selected.amount.toLocaleString()}`],
                ['Attendance', `${selected.attendancePct}%`],
                ['CGPA', String(selected.cgpa)],
                ['NPCI', selected.npciSeeded ? 'Active ✓' : 'Pending ✗'],
              ].map(([l, v]) => (
                <div key={l} className="dbt-info-field">
                  <p className="dbt-info-label">{l}</p>
                  <p className="dbt-info-value">{v}</p>
                </div>
              ))}
            </FormGrid>

            <div
              style={{
                margin: '0.75rem 0',
                padding: '0.75rem',
                background: '#f0fdf4',
                borderRadius: 8,
                border: '1px solid #bbf7d0',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#15803d',
                }}
              >
                ✓ Teacher Verified · ✓ Documents OK · ✓ Eligibility Engine
                Passed
              </p>
            </div>

            <TextArea
              label="Remarks (required)"
              value={remarks}
              onChange={setRemarks}
              rows={3}
              placeholder="Add approval/rejection remarks..."
              required
            />

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '0.875rem',
                flexWrap: 'wrap',
              }}
            >
              <Button
                label="Approve & Forward to Finance"
                variant="primary"
                icon="check"
                isLoading={acting}
                onClick={() => act('approve')}
              />
              <Button
                label="Put On Hold"
                variant="outlined"
                icon="pause"
                isLoading={acting}
                onClick={() => act('hold')}
              />
              <Button
                label="Reject"
                variant="danger"
                icon="times"
                isLoading={acting}
                onClick={() => act('reject')}
              />
            </div>
          </FormCard>
        ) : (
          <FormCard>
            <div className="dbt-empty">
              <i className="pi pi-gavel" />
              <p>Select an application from the list to take action.</p>
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
