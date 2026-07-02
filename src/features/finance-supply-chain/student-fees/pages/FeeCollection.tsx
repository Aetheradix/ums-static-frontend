import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface StudentDues {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  dueAmount: number;
  status: 'Unpaid' | 'Partial' | 'Paid';
}

const mockDues: StudentDues[] = [
  {
    id: 'D-001',
    studentId: 'STU2023001',
    studentName: 'John Doe',
    program: 'BTECH-CSE',
    dueAmount: 50000,
    status: 'Partial',
  },
  {
    id: 'D-003',
    studentId: 'STU2023005',
    studentName: 'Alice Johnson',
    program: 'MBA-FIN',
    dueAmount: 85000,
    status: 'Unpaid',
  },
];

export default function FeeCollection() {
  const [dues, setDues] = useState<StudentDues[]>(mockDues);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDues | null>(
    null
  );

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<string>('Cash');
  const [referenceNo, setReferenceNo] = useState<string>('');

  const toast = useRef<Toast>(null);

  const statusTemplate = (rowData: StudentDues) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Paid'
            ? 'approved'
            : rowData.status === 'Unpaid'
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

  const actionTemplate = (rowData: StudentDues) => (
    <Button
      label="Collect Payment"
      icon="pi pi-money-bill"
      size="small"
      onClick={() => {
        setSelectedStudent(rowData);
        setPaymentAmount(rowData.dueAmount);
        setPaymentMode('Cash');
        setReferenceNo('');
        setShowDialog(true);
      }}
    />
  );

  const handlePaymentSubmit = () => {
    if (selectedStudent && paymentAmount) {
      const newDue = selectedStudent.dueAmount - paymentAmount;
      const newStatus = (
        newDue <= 0
          ? 'Paid'
          : newDue < selectedStudent.dueAmount
            ? 'Partial'
            : 'Unpaid'
      ) as 'Paid' | 'Unpaid' | 'Partial';

      setDues(
        dues
          .map(d =>
            d.id === selectedStudent.id
              ? { ...d, dueAmount: newDue > 0 ? newDue : 0, status: newStatus }
              : d
          )
          .filter(d => d.dueAmount > 0)
      );

      setShowDialog(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Payment Collected',
        detail: `Received ${currencyTemplate(paymentAmount)} from ${selectedStudent.studentName}`,
        life: 3000,
      });
    }
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search pending dues..."
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-80"
        />
      </span>
      <Button
        label="Generate Demand Letters"
        icon="pi pi-file-pdf"
        severity="danger"
        outlined
      />
    </div>
  );

  return (
    <FormPage
      title="Fee Collection Desk"
      description="Record manual fee receipts and clear student dues"
    >
      <Toast ref={toast} />

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-yellow-900 font-semibold m-0 mb-1">
            Attention Cashier
          </h4>
          <p className="m-0 text-yellow-800 text-sm">
            Always verify DD/Cheque details before issuing a final receipt. Cash
            payments require immediate vault deposit.
          </p>
        </div>
        <i className="pi pi-wallet text-3xl text-yellow-600 opacity-50"></i>
      </div>

      <FormCard className="p-0 overflow-hidden">
        <DataTable
          value={dues}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No pending dues found."
          responsiveLayout="scroll"
        >
          <Column field="studentId" header="Student ID" sortable></Column>
          <Column field="studentName" header="Student Name" sortable></Column>
          <Column field="program" header="Program" sortable></Column>
          <Column
            field="dueAmount"
            header="Amount Due"
            body={r => (
              <span className="text-red-600 font-bold">
                {currencyTemplate(r.dueAmount)}
              </span>
            )}
            sortable
            style={{ textAlign: 'right' }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
            style={{ textAlign: 'center' }}
          ></Column>
          <Column
            body={actionTemplate}
            header="Action"
            style={{ width: '12rem', textAlign: 'center' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '500px' }}
        header="Record Fee Receipt"
        modal
        onHide={() => setShowDialog(false)}
      >
        {selectedStudent && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="p-3 bg-gray-100 rounded text-center">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                Current Outstanding Due
              </div>
              <div className="text-3xl font-black text-red-600">
                {currencyTemplate(selectedStudent.dueAmount)}
              </div>
              <div className="text-sm text-gray-700 mt-2 font-medium">
                {selectedStudent.studentName} ({selectedStudent.studentId})
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Payment Mode
                </label>
                <Dropdown
                  value={paymentMode}
                  options={[
                    'Cash',
                    'Demand Draft',
                    'Cheque',
                    'NEFT/RTGS',
                    'UPI',
                  ]}
                  onChange={e => setPaymentMode(e.value)}
                />
              </div>

              {paymentMode !== 'Cash' && (
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">
                    Reference / Instrument No.
                  </label>
                  <InputText
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                    placeholder="e.g. Cheque No. or UTR"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Amount Received (₹)
                </label>
                <InputNumber
                  value={paymentAmount}
                  onValueChange={e => setPaymentAmount(e.value ?? null)}
                  mode="currency"
                  currency="INR"
                  currencyDisplay="symbol"
                  locale="en-IN"
                  max={selectedStudent.dueAmount}
                  inputClassName="font-bold text-lg text-green-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
              <Button
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                outlined
                onClick={() => setShowDialog(false)}
              />
              <Button
                label="Generate Receipt"
                icon="pi pi-print"
                severity="success"
                onClick={handlePaymentSubmit}
                disabled={
                  !paymentAmount ||
                  paymentAmount <= 0 ||
                  (paymentMode !== 'Cash' && !referenceNo)
                }
              />
            </div>
          </div>
        )}
      </Dialog>
    </FormPage>
  );
}
