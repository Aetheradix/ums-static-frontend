import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface RefundRequest {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processed';
}

const mockRefunds: RefundRequest[] = [
  {
    id: 'REF-2026-01',
    studentId: 'STU2023001',
    studentName: 'John Doe',
    amount: 5000,
    reason: 'Excess fee paid',
    requestDate: '2026-06-25',
    status: 'Pending',
  },
  {
    id: 'REF-2026-02',
    studentId: 'STU2023045',
    studentName: 'Jane Smith',
    amount: 15000,
    reason: 'Hostel cancellation',
    requestDate: '2026-06-28',
    status: 'Approved',
  },
  {
    id: 'REF-2026-03',
    studentId: 'STU2023099',
    studentName: 'Alice Johnson',
    amount: 2000,
    reason: 'Duplicate transaction',
    requestDate: '2026-07-01',
    status: 'Pending',
  },
  {
    id: 'REF-2026-04',
    studentId: 'STU2022014',
    studentName: 'Bob Williams',
    amount: 45000,
    reason: 'Admission withdrawal',
    requestDate: '2026-06-15',
    status: 'Processed',
  },
];

export default function Refunds() {
  const [refunds, setRefunds] = useState<RefundRequest[]>(mockRefunds);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(
    null
  );
  const toast = useRef<Toast>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);

  const statusTemplate = (rowData: RefundRequest) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Processed' || rowData.status === 'Approved'
            ? 'approved'
            : rowData.status === 'Rejected'
              ? 'rejected'
              : 'pending'
        }
      />
    );
  };

  const actionTemplate = (rowData: RefundRequest) => {
    return (
      <Button
        label={rowData.status === 'Pending' ? 'Review' : 'View'}
        icon={rowData.status === 'Pending' ? 'pi pi-search' : 'pi pi-eye'}
        size="small"
        severity={rowData.status === 'Pending' ? 'info' : 'secondary'}
        onClick={() => {
          setSelectedRefund(rowData);
          setShowDialog(true);
        }}
      />
    );
  };

  const handleAction = (action: 'approve' | 'reject') => {
    if (selectedRefund) {
      setRefunds(
        refunds.map(r =>
          r.id === selectedRefund.id
            ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' }
            : r
        )
      );
      setShowDialog(false);
      toast.current?.show({
        severity: action === 'approve' ? 'success' : 'warn',
        summary: 'Refund Updated',
        detail: `Refund ${selectedRefund.id} has been ${action}d.`,
        life: 3000,
      });
    }
  };

  const handleProcess = () => {
    if (selectedRefund) {
      setRefunds(
        refunds.map(r =>
          r.id === selectedRefund.id ? { ...r, status: 'Processed' } : r
        )
      );
      setShowDialog(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Refund Processed',
        detail: `Amount remitted to student's bank account.`,
        life: 3000,
      });
    }
  };

  return (
    <FormPage
      title="Refund Management"
      description="Review, approve, and process student fee refund requests"
    >
      <Toast ref={toast} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Requests
          </span>
          <span className="text-3xl font-black text-gray-800">
            {refunds.length}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Pending Review
          </span>
          <span className="text-3xl font-black text-orange-500">
            {refunds.filter(r => r.status === 'Pending').length}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Approved (Unprocessed)
          </span>
          <span className="text-3xl font-black text-blue-600">
            {refunds.filter(r => r.status === 'Approved').length}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Processed
          </span>
          <span className="text-3xl font-black text-green-600">
            {formatCurrency(
              refunds
                .filter(r => r.status === 'Processed')
                .reduce((acc, curr) => acc + curr.amount, 0)
            )}
          </span>
        </div>
      </div>

      <FormCard className="p-0 overflow-hidden">
        <DataTable
          value={refunds}
          emptyMessage="No refund requests found."
          responsiveLayout="scroll"
        >
          <Column
            field="id"
            header="Refund ID"
            style={{ width: '15%' }}
          ></Column>
          <Column
            field="studentName"
            header="Student Name"
            style={{ width: '20%' }}
          ></Column>
          <Column
            field="amount"
            header="Amount"
            body={r => (
              <span className="font-bold">{formatCurrency(r.amount)}</span>
            )}
            style={{ width: '15%' }}
          ></Column>
          <Column
            field="reason"
            header="Reason"
            style={{ width: '20%' }}
          ></Column>
          <Column
            field="requestDate"
            header="Requested On"
            style={{ width: '10%' }}
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

      <Dialog
        visible={showDialog}
        style={{ width: '500px' }}
        header="Refund Details"
        modal
        onHide={() => setShowDialog(false)}
      >
        {selectedRefund && (
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-200 rounded">
              <div>
                <h5 className="m-0 font-bold text-gray-800">
                  {selectedRefund.studentName}
                </h5>
                <span className="text-sm text-gray-500">
                  {selectedRefund.studentId}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase font-bold">
                  Refund Amount
                </div>
                <div className="text-xl font-black text-blue-700">
                  {formatCurrency(selectedRefund.amount)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-gray-500 font-bold uppercase mb-1">
                  Request Date
                </span>
                <span className="text-gray-800">
                  {selectedRefund.requestDate}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-bold uppercase mb-1">
                  Current Status
                </span>
                {statusTemplate(selectedRefund)}
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-gray-500 font-bold uppercase mb-1">
                  Reason for Refund
                </span>
                <span className="text-gray-800">{selectedRefund.reason}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
              {selectedRefund.status === 'Pending' && (
                <>
                  <Button
                    label="Reject"
                    icon="pi pi-times"
                    severity="danger"
                    outlined
                    onClick={() => handleAction('reject')}
                  />
                  <Button
                    label="Approve Request"
                    icon="pi pi-check"
                    severity="success"
                    onClick={() => handleAction('approve')}
                  />
                </>
              )}
              {selectedRefund.status === 'Approved' && (
                <>
                  <Button
                    label="Cancel"
                    severity="secondary"
                    outlined
                    onClick={() => setShowDialog(false)}
                  />
                  <Button
                    label="Process Payment (NEFT)"
                    icon="pi pi-send"
                    severity="info"
                    onClick={handleProcess}
                  />
                </>
              )}
              {(selectedRefund.status === 'Processed' ||
                selectedRefund.status === 'Rejected') && (
                <Button
                  label="Close"
                  severity="secondary"
                  outlined
                  onClick={() => setShowDialog(false)}
                />
              )}
            </div>
          </div>
        )}
      </Dialog>
    </FormPage>
  );
}
