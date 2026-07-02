import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { useNavigate } from 'react-router-dom';

interface FeeRecord {
  id: string;
  semester: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
}

const mockFees: FeeRecord[] = [
  {
    id: 'FEE-2023-01',
    semester: 'Semester 1',
    totalAmount: 45000,
    paidAmount: 45000,
    dueDate: '2025-08-15',
    status: 'Paid',
  },
  {
    id: 'FEE-2023-02',
    semester: 'Semester 2',
    totalAmount: 45000,
    paidAmount: 20000,
    dueDate: '2026-01-15',
    status: 'Partial',
  },
  {
    id: 'FEE-2024-01',
    semester: 'Semester 3',
    totalAmount: 48000,
    paidAmount: 0,
    dueDate: '2026-08-15',
    status: 'Unpaid',
  },
];

export default function FeeDetails() {
  const navigate = useNavigate();
  const [fees] = useState<FeeRecord[]>(mockFees);

  const statusTemplate = (rowData: FeeRecord) => {
    let severity: 'success' | 'warning' | 'danger' | 'info' = 'info';
    if (rowData.status === 'Paid') severity = 'success';
    if (rowData.status === 'Partial') severity = 'warning';
    if (rowData.status === 'Unpaid' || rowData.status === 'Overdue')
      severity = 'danger';

    return <Tag value={rowData.status} severity={severity} />;
  };

  const actionTemplate = (rowData: FeeRecord) => {
    if (rowData.status === 'Paid') {
      return (
        <Button
          label="Receipt"
          icon="pi pi-download"
          size="small"
          outlined
          severity="secondary"
        />
      );
    }
    return (
      <Button
        label="Pay Now"
        icon="pi pi-credit-card"
        size="small"
        severity="success"
        onClick={() =>
          navigate('/finance-supply-chain/student-fees/fee-payment')
        }
      />
    );
  };

  const amountTemplate = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <FormPage
      title="Fee Details & Dues"
      description="View your fee breakdown, payment history, and pending dues"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Paid
          </span>
          <span className="text-4xl font-black text-green-700">
            {amountTemplate(65000)}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Pending
          </span>
          <span className="text-4xl font-black text-red-700">
            {amountTemplate(73000)}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Next Due Date
          </span>
          <span className="text-3xl font-black text-orange-700">
            15 Aug 2026
          </span>
          <span className="text-xs text-gray-500 mt-1">Semester 3 Fee</span>
        </div>
      </div>

      <FormCard className="p-0 overflow-hidden">
        <DataTable
          value={fees}
          emptyMessage="No fee records found."
          responsiveLayout="scroll"
        >
          <Column
            field="semester"
            header="Semester"
            style={{ width: '15%', fontWeight: 'bold' }}
          ></Column>
          <Column
            field="totalAmount"
            header="Total Fee"
            body={r => amountTemplate(r.totalAmount)}
            style={{ width: '15%' }}
          ></Column>
          <Column
            field="paidAmount"
            header="Paid Amount"
            body={r => amountTemplate(r.paidAmount)}
            style={{ width: '15%' }}
          ></Column>
          <Column
            header="Balance"
            body={r => amountTemplate(r.totalAmount - r.paidAmount)}
            style={{ width: '15%', fontWeight: 'bold', color: '#b91c1c' }}
          ></Column>
          <Column
            field="dueDate"
            header="Due Date"
            style={{ width: '15%' }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            style={{ textAlign: 'center', width: '10%' }}
          ></Column>
          <Column
            body={actionTemplate}
            header="Action"
            style={{ textAlign: 'center' }}
          ></Column>
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
