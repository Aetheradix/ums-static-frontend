import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  useFeeStore,
  type FailedTransaction as FailedType,
} from '../store/useFeeStore';
import { ToastService } from 'services';

export default function FailedTransactions() {
  const { failedTransactions, students, reconcileFailedTransaction } =
    useFeeStore();
  const [popup, setPopup] = useState<{ visible: boolean; data?: FailedType }>({
    visible: false,
  });

  const getStudentName = (id: string) =>
    students.find(s => s.id === id)?.name || 'N/A';
  const getStudentEnroll = (id: string) =>
    students.find(s => s.id === id)?.enrollmentNumber || 'N/A';

  const handleManualResolve = (txnId: string) => {
    reconcileFailedTransaction(txnId);
    ToastService.success(
      'Transaction manually reconciled and receipt generated successfully.'
    );
    setPopup({ visible: false });
  };

  const getStatusVariant = (status: FailedType['status']) => {
    switch (status) {
      case 'Failed':
        return 'rejected';
      case 'Pending':
        return 'pending';
      case 'Resolved':
        return 'approved';
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Failed Transaction Management"
      description="Track failed online checkouts, review transaction failures, and execute manual ledger reconciliations."
    >
      <FormCard>
        <div className="mb-4 bg-red-50 border border-red-200 p-3.5 rounded text-sm text-red-800">
          <span className="font-semibold">⚠️ Action Queue:</span> Reconciling a
          resolved bank reference creates the payment receipt and updates the
          student demand ledger automatically.
        </div>

        <GridPanel
          data={failedTransactions}
          onEdit={(item: FailedType) => setPopup({ visible: true, data: item })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { field: 'refNo', header: 'Reference No' },
            {
              header: 'Student Name',
              cell: (item: FailedType) => (
                <span>{getStudentName(item.studentId)}</span>
              ),
            },
            {
              header: 'Amount',
              cell: (item: FailedType) => (
                <span className="font-bold">
                  ₹{item.amount.toLocaleString()}
                </span>
              ),
            },
            { field: 'paymentMode', header: 'Mode' },
            { field: 'gatewayFailureDetails', header: 'Failure Reason' },
            {
              header: 'Status',
              cell: (item: FailedType) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Actions',
              cell: (item: FailedType) => (
                <div className="flex gap-1">
                  {item.status !== 'Resolved' ? (
                    <Button
                      label="Reconcile"
                      variant="primary"
                      className="p-1 text-xs"
                      onClick={() => handleManualResolve(item.id)}
                    />
                  ) : (
                    <span className="text-xs text-green-600 font-semibold px-2">
                      Cleared
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      {/* Detail & Resolve Popup */}
      <FormPopup
        visible={popup.visible}
        onHide={() => setPopup({ visible: false })}
        title="Transaction Troubleshooting Log"
        subtitle="Gateway metadata details and action options."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="bg-gray-50 border rounded-md p-3 text-sm flex flex-col gap-2">
              <div>
                <span className="font-semibold text-gray-600">Student:</span>{' '}
                {getStudentName(popup.data.studentId)} (
                {getStudentEnroll(popup.data.studentId)})
              </div>
              <div>
                <span className="font-semibold text-gray-600">Amount:</span> ₹
                {popup.data.amount.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Method:</span>{' '}
                {popup.data.paymentMode}
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Gateway Reference:
                </span>{' '}
                {popup.data.refNo}
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Transaction Date:
                </span>{' '}
                {popup.data.transactionDate}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">Status:</span>
                <StatusBadge
                  label={popup.data.status}
                  variant={getStatusVariant(popup.data.status)}
                />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-900 flex flex-col gap-1">
              <span className="font-bold">GATEWAY DIAGNOSTICS:</span>
              <span>{popup.data.gatewayFailureDetails}</span>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Close Log"
                variant="outlined"
                onClick={() => setPopup({ visible: false })}
              />
              {popup.data.status !== 'Resolved' && (
                <Button
                  label="Force Reconcile"
                  variant="primary"
                  onClick={() => handleManualResolve(popup.data!.id)}
                />
              )}
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
