import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function FinanceDbtReconciliation() {
  const [reconciled, setReconciled] = useState<Record<string, boolean>>({});

  const handleReconcile = (id: string) => {
    setReconciled(prev => ({ ...prev, [id]: true }));
    ToastService.success(
      'Aadhaar-bank payment details verified and reconciled with PFMS.'
    );
  };

  return (
    <FormPage
      title="DBT Reconciliation"
      description="Verify government PFMS records against University disbursement ledgers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Finance Office', to: dbtUrls.finance.portal },
        { label: 'DBT Reconciliation' },
      ]}
    >
      <FormCard title="PFMS vs University Reconciliation Checklist">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>App No.</th>
                <th>Bank / Account</th>
                <th>Sanction Amount</th>
                <th>PFMS Status</th>
                <th>Aadhaar Match</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {studentApplications.slice(0, 5).map(app => (
                <tr key={app.id}>
                  <td>
                    <p style={{ fontWeight: 700 }}>{app.studentName}</p>
                    <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                      {app.enrollmentNo}
                    </p>
                  </td>
                  <td>{app.appNo}</td>
                  <td>
                    {app.bankName} ({app.bankAccount.slice(-4)})
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    ₹{app.amount.toLocaleString()}
                  </td>
                  <td>
                    <span className="dbt-status-pill success">
                      PFMS Settled
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        color: app.npciSeeded ? '#16a34a' : '#b91c1c',
                        fontWeight: 600,
                      }}
                    >
                      {app.npciSeeded ? '✓ Mapped' : '✗ Unmapped'}
                    </span>
                  </td>
                  <td>
                    {reconciled[app.id] ? (
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>
                        ✓ Reconciled
                      </span>
                    ) : (
                      <Button
                        label="Reconcile"
                        variant="outlined"
                        size="small"
                        onClick={() => handleReconcile(app.id)}
                      />
                    )}
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
