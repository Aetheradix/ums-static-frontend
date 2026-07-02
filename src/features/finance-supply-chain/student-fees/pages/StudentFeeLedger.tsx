import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface FeeTransaction {
  id: string;
  date: string;
  particulars: string;
  type: 'Demand' | 'Receipt' | 'Refund' | 'Adjustment';
  amount: number;
  balance: number;
}

interface StudentLedger {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  totalDemand: number;
  totalPaid: number;
  currentBalance: number;
  status: 'Clear' | 'Due' | 'Defaulter';
  transactions: FeeTransaction[];
}

const mockLedgers: StudentLedger[] = [
  {
    id: 'L-001',
    studentId: 'STU2023001',
    studentName: 'John Doe',
    program: 'BTECH-CSE',
    totalDemand: 150000,
    totalPaid: 100000,
    currentBalance: 50000,
    status: 'Due',
    transactions: [
      {
        id: 'TX-1',
        date: '2026-07-01',
        particulars: 'Tuition Fee (Sem 1)',
        type: 'Demand',
        amount: 75000,
        balance: 75000,
      },
      {
        id: 'TX-2',
        date: '2026-07-15',
        particulars: 'Online Payment Receipt',
        type: 'Receipt',
        amount: 75000,
        balance: 0,
      },
      {
        id: 'TX-3',
        date: '2026-12-01',
        particulars: 'Tuition Fee (Sem 2)',
        type: 'Demand',
        amount: 75000,
        balance: 75000,
      },
      {
        id: 'TX-4',
        date: '2026-12-10',
        particulars: 'Partial Payment',
        type: 'Receipt',
        amount: 25000,
        balance: 50000,
      },
    ],
  },
  {
    id: 'L-002',
    studentId: 'STU2023002',
    studentName: 'Jane Smith',
    program: 'BTECH-CSE',
    totalDemand: 150000,
    totalPaid: 150000,
    currentBalance: 0,
    status: 'Clear',
    transactions: [
      {
        id: 'TX-5',
        date: '2026-07-01',
        particulars: 'Tuition Fee (Sem 1)',
        type: 'Demand',
        amount: 75000,
        balance: 75000,
      },
      {
        id: 'TX-6',
        date: '2026-07-10',
        particulars: 'Online Payment Receipt',
        type: 'Receipt',
        amount: 75000,
        balance: 0,
      },
      {
        id: 'TX-7',
        date: '2026-12-01',
        particulars: 'Tuition Fee (Sem 2)',
        type: 'Demand',
        amount: 75000,
        balance: 75000,
      },
      {
        id: 'TX-8',
        date: '2026-12-05',
        particulars: 'Online Payment Receipt',
        type: 'Receipt',
        amount: 75000,
        balance: 0,
      },
    ],
  },
];

export default function StudentFeeLedger() {
  const [ledgers] = useState<StudentLedger[]>(mockLedgers);
  const [globalFilter, setGlobalFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<StudentLedger[]>([]);

  const statusTemplate = (rowData: StudentLedger) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Clear'
            ? 'approved'
            : rowData.status === 'Defaulter'
              ? 'rejected'
              : 'pending'
        }
      />
    );
  };

  const currencyTemplate = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const typeTemplate = (rowData: FeeTransaction) => {
    const color =
      rowData.type === 'Demand'
        ? 'text-red-600'
        : rowData.type === 'Receipt'
          ? 'text-green-600'
          : 'text-blue-600';
    return <span className={`font-medium ${color}`}>{rowData.type}</span>;
  };

  const rowExpansionTemplate = (data: StudentLedger) => {
    return (
      <div className="p-4 bg-gray-50 border-l-4 border-blue-500">
        <h5 className="text-gray-700 font-semibold mb-3">
          Transaction History for {data.studentName}
        </h5>
        <DataTable
          value={data.transactions}
          size="small"
          showGridlines
          stripedRows
        >
          <Column field="date" header="Date"></Column>
          <Column field="particulars" header="Particulars"></Column>
          <Column
            field="type"
            header="Voucher Type"
            body={typeTemplate}
          ></Column>
          <Column
            field="amount"
            header="Amount"
            body={r => currencyTemplate(r.amount)}
            style={{ textAlign: 'right' }}
          ></Column>
          <Column
            field="balance"
            header="Running Balance"
            body={r => currencyTemplate(r.balance)}
            style={{ textAlign: 'right', fontWeight: 'bold' }}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search by Student ID or Name..."
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-80"
        />
      </span>
      <Button
        label="Export Ledger"
        icon="pi pi-download"
        severity="secondary"
        outlined
      />
    </div>
  );

  return (
    <FormPage
      title="Student Fee Ledger"
      description="Comprehensive view of student demands, receipts, and current outstanding balances"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Outstanding Dues
          </span>
          <span className="text-3xl font-black text-red-600">₹50,000</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Students with Clear Dues
          </span>
          <span className="text-3xl font-black text-green-600">
            1 <span className="text-xl text-gray-400 font-medium">/ 2</span>
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Collection (YTD)
          </span>
          <span className="text-3xl font-black text-blue-600">₹2,50,000</span>
        </div>
      </div>

      <FormCard className="p-0 overflow-hidden">
        <DataTable
          value={ledgers}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No ledger records found."
          responsiveLayout="scroll"
          expandedRows={expandedRows}
          onRowToggle={e => setExpandedRows(e.data as StudentLedger[])}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
        >
          <Column expander style={{ width: '3rem' }} />
          <Column field="studentId" header="Student ID" sortable></Column>
          <Column field="studentName" header="Student Name" sortable></Column>
          <Column
            field="totalDemand"
            header="Total Demand"
            body={r => currencyTemplate(r.totalDemand)}
            sortable
            style={{ textAlign: 'right' }}
          ></Column>
          <Column
            field="totalPaid"
            header="Total Paid"
            body={r => currencyTemplate(r.totalPaid)}
            sortable
            style={{ textAlign: 'right' }}
          ></Column>
          <Column
            field="currentBalance"
            header="Balance Due"
            body={r => (
              <span
                className={r.currentBalance > 0 ? 'text-red-600 font-bold' : ''}
              >
                {currencyTemplate(r.currentBalance)}
              </span>
            )}
            sortable
            style={{ textAlign: 'right' }}
          ></Column>
          <Column
            field="status"
            header="Account Status"
            body={statusTemplate}
            sortable
            style={{ textAlign: 'center' }}
          ></Column>
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
