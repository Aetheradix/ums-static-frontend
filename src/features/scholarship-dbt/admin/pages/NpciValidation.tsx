import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminNpciValidation() {
  const [list, setList] = useState(studentApplications);

  const handleValidate = (id: string) => {
    setList(prev =>
      prev.map(a => (a.id === id ? { ...a, npciSeeded: true } : a))
    );
    ToastService.success('NPCI Aadhaar-Bank mapping verified successfully.');
  };

  return (
    <FormPage
      title="NPCI Seeding Validation"
      description="Verify Aadhaar Payment Bridge System (APBS) mapping status at NPCI server."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'NPCI Validation' },
      ]}
    >
      <FormCard title="Student NPCI Status Checklist">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Aadhaar Number</th>
                <th>Bank Account</th>
                <th>NPCI Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(a => (
                <tr key={a.id}>
                  <td>
                    <p style={{ fontWeight: 700 }}>{a.studentName}</p>
                    <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                      {a.enrollmentNo}
                    </p>
                  </td>
                  <td>{a.aadhaarNo}</td>
                  <td>
                    {a.bankName} ({a.bankAccount.slice(-4)})
                  </td>
                  <td>
                    <span
                      className={`dbt-status-pill ${a.npciSeeded ? 'success' : 'failed'}`}
                    >
                      {a.npciSeeded ? '✓ Mapped & Active' : '✗ Inactive'}
                    </span>
                  </td>
                  <td>
                    {!a.npciSeeded ? (
                      <Button
                        label="Verify NPCI Mapper"
                        variant="primary"
                        size="small"
                        onClick={() => handleValidate(a.id)}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#16a34a',
                          fontWeight: 600,
                        }}
                      >
                        Verified
                      </span>
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
