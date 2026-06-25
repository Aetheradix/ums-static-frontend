import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useFeeStore, type Refund as RefundType } from '../store/useFeeStore';
import { ToastService } from 'services';
import { DropDownList, NumberBox } from 'shared/components/forms';

export default function RefundManagement() {
  const { refunds, students, receipts, addRefundRequest, updateRefundStatus } =
    useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'request' | 'view';
    data?: RefundType;
  }>({ mode: 'closed' });

  // Request State
  const [studentId, setStudentId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState<
    | 'Admission Cancellation'
    | 'Duplicate Payment'
    | 'Excess Payment'
    | 'Course Withdrawal'
  >('Excess Payment');

  const getStudentName = (id: string) =>
    students.find(s => s.id === id)?.name || 'N/A';
  const getStudentEnroll = (id: string) =>
    students.find(s => s.id === id)?.enrollmentNumber || 'N/A';
  const getReceiptNumber = (id: string) =>
    receipts.find(r => r.id === id)?.receiptNumber || 'N/A';

  const handleRequestOpen = () => {
    setStudentId(students[0]?.id || '');
    setPaymentId(receipts[0]?.id || '');
    setAmount('');
    setReason('Excess Payment');
    setPopup({ mode: 'request' });
  };

  const handleRequestSubmit = () => {
    if (!studentId || !paymentId || !amount) {
      ToastService.error('All fields are required');
      return;
    }

    addRefundRequest({
      studentId,
      paymentId,
      amount: Number(amount),
      reason,
      documents: ['refund_request_letter.pdf', 'bank_passbook_copy.pdf'],
    });

    ToastService.success('Refund request filed successfully.');
    setPopup({ mode: 'closed' });
  };

  const handleStatusWorkflow = (
    id: string,
    nextStatus: RefundType['status']
  ) => {
    updateRefundStatus(id, nextStatus);
    ToastService.success(`Refund status updated to ${nextStatus}.`);
  };

  const getStatusVariant = (status: RefundType['status']) => {
    switch (status) {
      case 'Requested':
        return 'pending';
      case 'Verified':
        return 'pending';
      case 'Approved':
        return 'approved';
      case 'Processed':
        return 'pending';
      case 'Completed':
        return 'approved';
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Refund Management"
      description="File fee refund requests for course withdrawals, admission cancellations, or duplicate payments, and process through clearance workflow stages."
    >
      <FormCard>
        <GridPanel
          data={refunds}
          onEdit={(item: RefundType) => setPopup({ mode: 'view', data: item })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Student Name',
              cell: (item: RefundType) => (
                <span>{getStudentName(item.studentId)}</span>
              ),
            },
            { field: 'reason', header: 'Refund Reason' },
            {
              header: 'Amount',
              cell: (item: RefundType) => (
                <span className="font-bold text-red-600">
                  ₹{item.amount.toLocaleString()}
                </span>
              ),
            },
            { field: 'requestDate', header: 'Request Date' },
            {
              header: 'Status',
              cell: (item: RefundType) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Workflow Stage Actions',
              cell: (item: RefundType) => (
                <div className="flex gap-1">
                  {item.status === 'Requested' && (
                    <Button
                      label="Verify Docs"
                      variant="outlined"
                      className="p-1 text-xs"
                      onClick={() => handleStatusWorkflow(item.id, 'Verified')}
                    />
                  )}
                  {item.status === 'Verified' && (
                    <Button
                      label="Approve"
                      variant="primary"
                      className="p-1 text-xs"
                      onClick={() => handleStatusWorkflow(item.id, 'Approved')}
                    />
                  )}
                  {item.status === 'Approved' && (
                    <Button
                      label="Process Pay"
                      variant="primary"
                      className="p-1 text-xs text-white bg-indigo-600 border-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleStatusWorkflow(item.id, 'Processed')}
                    />
                  )}
                  {item.status === 'Processed' && (
                    <Button
                      label="Complete Transfer"
                      variant="primary"
                      className="p-1 text-xs text-white bg-green-600 border-green-600 hover:bg-green-700"
                      onClick={() => handleStatusWorkflow(item.id, 'Completed')}
                    />
                  )}
                  {item.status === 'Completed' && (
                    <span className="text-xs text-green-700 font-semibold px-2">
                      Settled
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Request Refund"
              icon="plus"
              variant="primary"
              onClick={handleRequestOpen}
            />
          }
          searchBox
        />
      </FormCard>

      {/* File Request Popup */}
      <FormPopup
        visible={popup.mode === 'request'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="File Fee Refund Request"
        subtitle="Fill in details to request refund processing."
      >
        <div className="flex flex-col gap-4 py-2">
          <DropDownList
            label="Select Student"
            required
            value={studentId}
            onChange={val => setStudentId(val as string)}
            data={students.map(s => ({
              text: `${s.name} (${s.enrollmentNumber})`,
              value: s.id,
            }))}
            optionValue="value"
          />

          <DropDownList
            label="Select Payment Receipt"
            required
            value={paymentId}
            onChange={val => setPaymentId(val as string)}
            data={receipts.map(r => ({
              text: `${r.receiptNumber} - ₹${r.amountPaid.toLocaleString()}`,
              value: r.id,
            }))}
            optionValue="value"
          />

          <div className="grid grid-cols-2 gap-3">
            <DropDownList
              label="Refund Scenario / Reason"
              required
              value={reason}
              onChange={val => setReason(val as any)}
              data={[
                {
                  text: 'Admission Cancellation',
                  value: 'Admission Cancellation',
                },
                { text: 'Duplicate Payment', value: 'Duplicate Payment' },
                { text: 'Excess Payment', value: 'Excess Payment' },
                { text: 'Course Withdrawal', value: 'Course Withdrawal' },
              ]}
              optionValue="value"
            />
            <NumberBox
              label="Claim Refund Amount (₹)"
              required
              placeholder="5000"
              value={amount === '' ? undefined : Number(amount)}
              onChange={val =>
                setAmount(val !== null && val !== undefined ? String(val) : '')
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Attachments
            </label>
            <div className="text-xs text-gray-500 flex gap-2">
              <span className="bg-gray-100 border p-1 rounded">
                📄 refund_request_letter.pdf
              </span>
              <span className="bg-gray-100 border p-1 rounded">
                📄 bank_passbook_copy.pdf
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="File Claim"
              variant="primary"
              onClick={handleRequestSubmit}
            />
          </div>
        </div>
      </FormPopup>

      {/* View Detail Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Refund Clearance Audit View"
        subtitle="Verification ledger details of the requested refund."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="border rounded-md p-3 bg-gray-50 text-sm flex flex-col gap-2">
              <div>
                <span className="font-semibold text-gray-600">Student:</span>{' '}
                {getStudentName(popup.data.studentId)} (
                {getStudentEnroll(popup.data.studentId)})
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Receipt Mapped:
                </span>{' '}
                {getReceiptNumber(popup.data.paymentId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Claim Amount:
                </span>{' '}
                ₹{popup.data.amount.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Reason Category:
                </span>{' '}
                {popup.data.reason}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Date Filed:</span>{' '}
                {popup.data.requestDate}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">
                  Current Stage:
                </span>
                <StatusBadge
                  label={popup.data.status}
                  variant={getStatusVariant(popup.data.status)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-700">
                Clearing Board Sign-offs Checklist
              </span>
              <div className="border rounded text-xs text-gray-700 bg-white p-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      popup.data.status !== 'Requested'
                        ? 'text-green-600 font-bold'
                        : 'text-gray-400 font-bold'
                    }
                  >
                    ✓
                  </span>
                  <span>Accounts verification clearance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      ['Approved', 'Processed', 'Completed'].includes(
                        popup.data.status
                      )
                        ? 'text-green-600 font-bold'
                        : 'text-gray-400 font-bold'
                    }
                  >
                    ✓
                  </span>
                  <span>
                    Registrar Office administrative authorization approval
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      ['Processed', 'Completed'].includes(popup.data.status)
                        ? 'text-green-600 font-bold'
                        : 'text-gray-400 font-bold'
                    }
                  >
                    ✓
                  </span>
                  <span>
                    Finance department disbursement processing bank order
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      popup.data.status === 'Completed'
                        ? 'text-green-600 font-bold'
                        : 'text-gray-400 font-bold'
                    }
                  >
                    ✓
                  </span>
                  <span>NEFT/IMPS payout transfer complete validation</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Close View"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
