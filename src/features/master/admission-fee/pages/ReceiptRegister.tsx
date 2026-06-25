import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  useFeeStore,
  type PaymentReceipt as ReceiptType,
} from '../store/useFeeStore';
import { ToastService } from 'services';

export default function ReceiptRegister() {
  const { receipts, students, courses, semesters } = useFeeStore();
  const [popup, setPopup] = useState<{ visible: boolean; data?: ReceiptType }>({
    visible: false,
  });

  const getStudentName = (id: string) =>
    students.find(s => s.id === id)?.name || 'N/A';
  const getStudentEnroll = (id: string) =>
    students.find(s => s.id === id)?.enrollmentNumber || 'N/A';
  const getCourseName = (id: string) =>
    courses.find(c => c.id === id)?.name || 'N/A';
  const getSemesterName = (id: string) =>
    semesters.find(s => s.id === id)?.name || 'N/A';

  const handlePrint = () => {
    ToastService.success('Sending receipt payload to client spool printer...');
    window.print();
  };

  return (
    <FormPage
      title="Receipt Register"
      description="View generated student payment receipts, ledger records, and print fee clearance vouchers."
    >
      <FormCard>
        <GridPanel
          data={receipts}
          onEdit={(item: ReceiptType) =>
            setPopup({ visible: true, data: item })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { field: 'receiptNumber', header: 'Receipt Number' },
            {
              header: 'Enrollment No',
              cell: (item: ReceiptType) => (
                <span>{getStudentEnroll(item.studentId)}</span>
              ),
            },
            {
              header: 'Student Name',
              cell: (item: ReceiptType) => (
                <span>{getStudentName(item.studentId)}</span>
              ),
            },
            {
              header: 'Amount Paid',
              cell: (item: ReceiptType) => (
                <span className="font-bold text-green-700">
                  ₹{item.amountPaid.toLocaleString()}
                </span>
              ),
            },
            { field: 'paymentDate', header: 'Payment Date' },
            { field: 'paymentMode', header: 'Payment Mode' },
            {
              header: 'Actions',
              cell: (item: ReceiptType) => (
                <Button
                  label="View Receipt"
                  variant="outlined"
                  className="p-1 text-xs"
                  onClick={() => setPopup({ visible: true, data: item })}
                />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      {/* Dynamic Receipt Modal Mockup */}
      <FormPopup
        visible={popup.visible}
        onHide={() => setPopup({ visible: false })}
        title="Fee Clearance Voucher"
        subtitle="Verification certificate of fees cleared."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2 text-gray-800">
            {/* College header mockup */}
            <div className="border border-dashed border-gray-300 rounded p-4 flex flex-col items-center justify-center bg-gray-50">
              <span className="text-sm font-bold tracking-widest text-indigo-900 uppercase">
                UMS UNIVERSITY BOARD
              </span>
              <span className="text-xs text-gray-500">
                OFFICIAL FEE PAYMENT CLEARANCE RECEIPT
              </span>
              <span className="text-lg font-black tracking-widest text-gray-800 mt-2">
                {popup.data.receiptNumber}
              </span>
            </div>

            <div className="border rounded-md overflow-hidden bg-white text-sm">
              <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 border-b">
                <div>
                  <span className="text-gray-500 text-xs">
                    Enrollment Number
                  </span>
                  <div className="font-semibold">
                    {getStudentEnroll(popup.data.studentId)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Student Name</span>
                  <div className="font-semibold">
                    {getStudentName(popup.data.studentId)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 border-b">
                <div>
                  <span className="text-gray-500 text-xs">Course Name</span>
                  <div className="font-semibold">
                    {getCourseName(popup.data.courseId)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Semester</span>
                  <div className="font-semibold">
                    {getSemesterName(popup.data.semesterId)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                <div>
                  <span className="text-gray-500 text-xs">Transaction Ref</span>
                  <div className="font-semibold text-xs font-mono">
                    {popup.data.transactionReference}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Payment Method</span>
                  <div className="font-semibold">{popup.data.paymentMode}</div>
                </div>
              </div>
            </div>

            <div className="border rounded-md bg-green-50 p-4 border-green-200 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-green-700 font-semibold uppercase tracking-wider">
                  Amount Cleared
                </span>
                <span className="text-2xl font-black text-green-800">
                  ₹{popup.data.amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-green-700 font-semibold uppercase tracking-wider">
                  Clearance Date
                </span>
                <span className="text-sm font-bold text-green-800">
                  {popup.data.paymentDate}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ visible: false })}
              />
              <Button
                label="Print / Download PDF"
                variant="primary"
                onClick={handlePrint}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
