import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

interface LedgerEntry {
  id: string;
  txDate: string;
  referenceNo: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
}

const LEDGER: LedgerEntry[] = [
  {
    id: 'l1',
    txDate: '29 Jun 2025',
    referenceNo: 'REF-TXN-9021',
    particulars: 'Received SC Post Matric central allocation',
    debit: 0,
    credit: 1245000,
    balance: 3545000,
  },
  {
    id: 'l2',
    txDate: '28 Jun 2025',
    referenceNo: 'UTR987654321',
    particulars: 'DBT Disbursed to Suresh Kumar (ST Post Matric)',
    debit: 25000,
    credit: 0,
    balance: 2300000,
  },
  {
    id: 'l3',
    txDate: '26 Jun 2025',
    referenceNo: 'REF-TXN-8802',
    particulars: 'Received MP State MMVY allocation',
    debit: 0,
    credit: 1850000,
    balance: 2325000,
  },
  {
    id: 'l4',
    txDate: '25 Jun 2025',
    referenceNo: 'ADJ-FEE-8891',
    particulars: 'Tuition Fee offset applied - Amit Patel',
    debit: 45000,
    credit: 0,
    balance: 475000,
  },
  {
    id: 'l5',
    txDate: '24 Jun 2025',
    referenceNo: 'REF-TXN-8711',
    particulars: 'Received NSP ST Scheme allocation',
    debit: 0,
    credit: 820000,
    balance: 520000,
  },
];

export default function FinanceLedger() {
  return (
    <FormPage
      title="Scholarship Fund Ledger"
      description="View detailed debit/credit postings in the University's Scholarship Ledger account."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Finance Office', to: dbtUrls.finance.portal },
        { label: 'Ledger' },
      ]}
    >
      <FormCard title="Ledger Statement">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference No.</th>
                <th>Particulars</th>
                <th style={{ textAlign: 'right' }}>Debit (Dr.)</th>
                <th style={{ textAlign: 'right' }}>Credit (Cr.)</th>
                <th style={{ textAlign: 'right' }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {LEDGER.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.txDate}</td>
                  <td style={{ fontFamily: 'monospace' }}>
                    {entry.referenceNo}
                  </td>
                  <td>{entry.particulars}</td>
                  <td
                    style={{
                      textAlign: 'right',
                      color: '#b91c1c',
                      fontWeight: 600,
                    }}
                  >
                    {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '—'}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      color: '#16a34a',
                      fontWeight: 600,
                    }}
                  >
                    {entry.credit > 0
                      ? `₹${entry.credit.toLocaleString()}`
                      : '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    ₹{entry.balance.toLocaleString()}
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
