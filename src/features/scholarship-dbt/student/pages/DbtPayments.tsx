import { ToastService } from 'services';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { dbtTransactions } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function StudentDbtPayments() {
  const total = dbtTransactions.reduce(
    (s, t) => (t.status === 'Success' ? s + t.amount : s),
    0
  );

  return (
    <FormPage
      title="DBT Payment History"
      description="Direct Benefit Transfer transactions via Aadhaar Payment Bridge System (APBS)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'DBT Payment History' },
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
          title="Total Received"
          value={`₹${total.toLocaleString()}`}
          icon="account_balance_wallet"
          colorScheme="green"
          subtitle="All time"
        />
        <StatCard
          title="Successful"
          value={dbtTransactions.filter(t => t.status === 'Success').length}
          icon="check_circle"
          colorScheme="teal"
          subtitle="Transactions"
        />
        <StatCard
          title="Pending"
          value={dbtTransactions.filter(t => t.status === 'Pending').length}
          icon="pending_actions"
          colorScheme="amber"
          subtitle="In queue"
        />
        <StatCard
          title="Failed / Bounced"
          value={
            dbtTransactions.filter(
              t => t.status === 'Failed' || t.status === 'Bounced'
            ).length
          }
          icon="error"
          colorScheme="red"
          subtitle="Need attention"
        />
      </div>

      <FormCard title="All DBT Transactions">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>#</th>
                <th>App No.</th>
                <th>Transaction ID</th>
                <th>UTR Number</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {dbtTransactions.map((txn, idx) => (
                <tr key={txn.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{txn.appNo}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {txn.txnId || '—'}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {txn.utrNo || '—'}
                  </td>
                  <td
                    style={{
                      fontWeight: 700,
                      color: txn.status === 'Success' ? '#16a34a' : '#374151',
                    }}
                  >
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td>{txn.date}</td>
                  <td>{txn.mode}</td>
                  <td>
                    <span
                      className={`dbt-status-pill ${txn.status.toLowerCase()}`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td>
                    {txn.status === 'Success' ? (
                      <button
                        type="button"
                        onClick={() =>
                          ToastService.success('Receipt downloaded.')
                        }
                        style={{
                          padding: '0.25rem 0.625rem',
                          border: '1px solid #3b82f6',
                          borderRadius: 4,
                          background: '#eff6ff',
                          color: '#2563eb',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        Receipt
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {txn_remarks()}
      </FormCard>
    </FormPage>
  );
}

function txn_remarks() {
  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#fef3c7',
        borderRadius: 8,
        border: '1px solid #fde68a',
      }}
    >
      <p style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>
        ⚠ Bounced or failed transactions require bank account re-verification.
        Contact the Finance Office or Scholarship Cell for assistance.
      </p>
    </div>
  );
}
