import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { dbtTransactions } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminDbtMonitoring() {
  const handleInitiateBatch = () => {
    ToastService.success(
      'Aadhaar Payment Bridge System (APBS) batch file generated. Forwarded to PFMS bank gateway.'
    );
  };

  return (
    <FormPage
      title="DBT Monitoring"
      description="Monitor Aadhaar Payment Bridge (APBS) and PFMS transaction statuses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'DBT Monitoring' },
      ]}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard
          title="Total DBT Transferred"
          value="₹1.03L"
          icon="payments"
          colorScheme="green"
          subtitle="Credited successfully"
        />
        <StatCard
          title="Pending Transfers"
          value="1"
          icon="hourglass_empty"
          colorScheme="amber"
          subtitle="Awaiting bank settlement"
        />
        <StatCard
          title="Failed Transfers"
          value="2"
          icon="error"
          colorScheme="red"
          subtitle="Require correction"
        />
        <StatCard
          title="Total Success Rate"
          value="95.2%"
          icon="trending_up"
          colorScheme="blue"
          subtitle="Disbursement rate"
        />
      </div>

      <FormCard title="Active DBT Payment Queue">
        <div style={{ marginBottom: '1rem' }}>
          <Button
            label="Process New Disbursement Batch"
            variant="primary"
            onClick={handleInitiateBatch}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>App No.</th>
                <th>Student</th>
                <th>Bank Account</th>
                <th>Disbursement Amount</th>
                <th>Transaction Reference ID</th>
                <th>Disbursement Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dbtTransactions.map(txn => (
                <tr key={txn.id}>
                  <td style={{ fontWeight: 700 }}>{txn.appNo}</td>
                  <td style={{ fontWeight: 600 }}>{txn.studentName}</td>
                  <td>{txn.bankAccount}</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {txn.txnId || '—'}
                  </td>
                  <td>{txn.mode}</td>
                  <td>
                    <span
                      className={`dbt-status-pill ${txn.status.toLowerCase()}`}
                    >
                      {txn.status}
                    </span>
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
