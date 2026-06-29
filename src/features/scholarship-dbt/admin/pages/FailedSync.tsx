import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

interface FailedRecord {
  id: string;
  studentName: string;
  appNo: string;
  portal: string;
  errorReason: string;
  lastAttempt: string;
}

const FAILED_RECORDS: FailedRecord[] = [
  {
    id: 'f1',
    studentName: 'Amit Tiwari',
    appNo: 'DAVV/SCH/2025/009',
    portal: 'PFMS Sync',
    errorReason: 'Invalid IFSC bank code structure',
    lastAttempt: '28 Jun 2025',
  },
  {
    id: 'f2',
    studentName: 'Ravi Mishra',
    appNo: 'DAVV/SCH/2025/008',
    portal: 'NPCI Validator',
    errorReason: 'Aadhaar mapping not active at bank branch',
    lastAttempt: '28 Jun 2025',
  },
  {
    id: 'f3',
    studentName: 'Vikram Singh',
    appNo: 'DAVV/SCH/2025/006',
    portal: 'NSP Portal',
    errorReason: 'Attendance below schema limits',
    lastAttempt: '27 Jun 2025',
  },
];

export default function AdminFailedSync() {
  const [list, setList] = useState(FAILED_RECORDS);

  const handleRetry = (id: string) => {
    setList(prev => prev.filter(r => r.id !== id));
    ToastService.success('Record successfully synchronized on retry.');
  };

  const handleRetryAll = () => {
    setList([]);
    ToastService.success('Bulk retry initiated. 3 records updated & synced.');
  };

  return (
    <FormPage
      title="Failed Sync Records"
      description="Review failed synchronization entries and perform individual or bulk retries."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Failed Sync Records' },
      ]}
    >
      <FormCard title={`Errors List (${list.length})`}>
        {list.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <Button
              label="Retry All Sync Tasks"
              variant="primary"
              onClick={handleRetryAll}
            />
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>App No.</th>
                <th>Portal Target</th>
                <th>Failure Reason</th>
                <th>Last Attempt</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.studentName}</td>
                  <td>{r.appNo}</td>
                  <td>
                    <span className="dbt-status-pill failed">{r.portal}</span>
                  </td>
                  <td
                    style={{
                      color: '#b91c1c',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {r.errorReason}
                  </td>
                  <td>{r.lastAttempt}</td>
                  <td>
                    <Button
                      label="Retry Sync"
                      variant="outlined"
                      size="small"
                      onClick={() => handleRetry(r.id)}
                    />
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#16a34a',
                      fontWeight: 700,
                    }}
                  >
                    ✓ All portal sync tasks settled successfully. No errors.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
