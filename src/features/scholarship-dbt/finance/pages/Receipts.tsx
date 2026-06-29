import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

interface Receipt {
  id: string;
  sanctionNo: string;
  schemeName: string;
  source: string;
  amount: number;
  dateReceived: string;
  status: 'Pending Verification' | 'Verified & Deposited' | 'Returned';
}

const RECEIPTS: Receipt[] = [
  {
    id: 'r1',
    sanctionNo: 'SAN-2025-SC-009',
    schemeName: 'Post Matric Scholarship for SC Students',
    source: 'NSP Central',
    amount: 1245000,
    dateReceived: '28 Jun 2025',
    status: 'Verified & Deposited',
  },
  {
    id: 'r2',
    sanctionNo: 'SAN-2025-MMVY-08',
    schemeName: 'Mukhya Mantri Medhavi Vidyarthi Yojana (MMVY)',
    source: 'MP State Portal',
    amount: 1850000,
    dateReceived: '26 Jun 2025',
    status: 'Verified & Deposited',
  },
  {
    id: 'r3',
    sanctionNo: 'SAN-2025-ST-041',
    schemeName: 'Post Matric Scholarship for ST Students',
    source: 'NSP Central',
    amount: 820000,
    dateReceived: '24 Jun 2025',
    status: 'Verified & Deposited',
  },
  {
    id: 'r4',
    sanctionNo: 'SAN-2025-MAHA-03',
    schemeName: 'MAHA DBT OBC Scholarship',
    source: 'MAHA DBT Portal',
    amount: 450000,
    dateReceived: '22 Jun 2025',
    status: 'Pending Verification',
  },
  {
    id: 'r5',
    sanctionNo: 'SAN-2025-MIN-12',
    schemeName: 'Minority Scholarship Scheme',
    source: 'NSP Central',
    amount: 310000,
    dateReceived: '20 Jun 2025',
    status: 'Verified & Deposited',
  },
];

export default function FinanceReceipts() {
  const [list, setList] = useState<Receipt[]>(RECEIPTS);

  const handleVerify = (id: string) => {
    setList(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'Verified & Deposited' as const } : r
      )
    );
    ToastService.success(
      'Receipt verified and deposited to University scholarship ledger.'
    );
  };

  return (
    <FormPage
      title="Scholarship Receipts"
      description="View and verify scholarship fund receipts received from Central and State Govt Portals."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Finance Office', to: dbtUrls.finance.portal },
        { label: 'Scholarship Receipts' },
      ]}
    >
      <FormCard title="Received Funds List">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Sanction No.</th>
                <th>Scheme Name</th>
                <th>Source Portal</th>
                <th>Amount</th>
                <th>Date Received</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.sanctionNo}</td>
                  <td>{r.schemeName}</td>
                  <td>{r.source}</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{r.amount.toLocaleString()}
                  </td>
                  <td>{r.dateReceived}</td>
                  <td>
                    <span
                      className={`dbt-status-pill ${r.status === 'Verified & Deposited' ? 'success' : 'pending'}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === 'Pending Verification' ? (
                      <Button
                        label="Verify & Deposit"
                        variant="primary"
                        size="small"
                        onClick={() => handleVerify(r.id)}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#16a34a',
                          fontWeight: 600,
                        }}
                      >
                        ✓ Completed
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
