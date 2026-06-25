import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useFeeStore, type BankStatementRow } from '../store/useFeeStore';
import { ToastService } from 'services';
import { DropDownList } from 'shared/components/forms';

export default function BankReconciliation() {
  const {
    bankStatements,
    receipts,
    uploadBankStatement,
    reconcileTransaction,
    autoReconcile,
  } = useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'import' | 'manual';
    stmtRow?: BankStatementRow;
  }>({ mode: 'closed' });
  const [selectedReceiptId, setSelectedReceiptId] = useState('');

  const handleSimulateImport = () => {
    // Add some new simulated statement entries to the list
    const simulatedRows: BankStatementRow[] = [
      {
        id: `stmt-${Date.now()}-1`,
        transactionDate: new Date().toISOString().split('T')[0],
        description: 'PG SETTLEMENT ADM FEE - REC-2026-00912',
        refNo: 'TXN8829102910',
        creditAmount: 111000,
        status: 'Unmatched',
      },
      {
        id: `stmt-${Date.now()}-2`,
        transactionDate: new Date().toISOString().split('T')[0],
        description: 'UPI PAY IN / MOCK ADMISSION FEE',
        refNo: 'TXN8820001827',
        creditAmount: 84000,
        status: 'Unmatched',
      },
    ];

    uploadBankStatement(simulatedRows);
    ToastService.success('Simulated bank statement imported. 2 records added.');
  };

  const handleAutoReconcile = () => {
    autoReconcile();
    ToastService.success(
      'Auto reconciliation run completed. Matched records updated.'
    );
  };

  const handleManualOpen = (row: BankStatementRow) => {
    setSelectedReceiptId(receipts[0]?.id || '');
    setPopup({ mode: 'manual', stmtRow: row });
  };

  const handleManualMatchSubmit = () => {
    const row = popup.stmtRow;
    if (!row || !selectedReceiptId) return;

    reconcileTransaction(row.id, selectedReceiptId);
    ToastService.success('Transaction manually matched and reconciled.');
    setPopup({ mode: 'closed' });
  };

  const getStatusVariant = (status: BankStatementRow['status']) => {
    switch (status) {
      case 'Matched':
        return 'approved';
      case 'Unmatched':
        return 'pending';
      case 'Exception':
        return 'rejected';
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="Bank Reconciliation"
      description="Match college bank statement records against generated payment receipts to verify settlements."
    >
      <FormCard>
        <div className="mb-4 bg-gray-50 border p-3 rounded flex justify-between items-center text-sm">
          <div>
            <span className="font-semibold text-indigo-700">
              💡 Auto-Match System:
            </span>{' '}
            You can click **Auto Reconcile** to automatically pair unmatched
            statement rows with matching receipt references.
          </div>
          <div className="flex gap-2">
            <Button
              label="Simulate Import Statement"
              variant="outlined"
              className="text-xs p-1"
              onClick={handleSimulateImport}
            />
            <Button
              label="Auto Reconcile"
              variant="primary"
              className="text-xs p-1"
              onClick={handleAutoReconcile}
            />
          </div>
        </div>

        <GridPanel
          data={bankStatements}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { field: 'transactionDate', header: 'Transaction Date' },
            { field: 'description', header: 'Statement Description' },
            { field: 'refNo', header: 'Reference No' },
            {
              header: 'Credit Amount',
              cell: (item: BankStatementRow) => (
                <span className="font-bold">
                  ₹{item.creditAmount.toLocaleString()}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (item: BankStatementRow) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Reconciliation Match',
              cell: (item: BankStatementRow) => (
                <div>
                  {item.status === 'Unmatched' ? (
                    <Button
                      label="Match Manually"
                      variant="outlined"
                      className="p-1 text-xs"
                      onClick={() => handleManualOpen(item)}
                    />
                  ) : (
                    <span className="text-xs text-green-600 font-semibold italic">
                      Settled
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      {/* Manual Reconciliation Match Popup */}
      <FormPopup
        visible={popup.mode === 'manual'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Manual Statement Match Link"
        subtitle="Force associate a bank statement entry with a payment receipt."
      >
        {popup.stmtRow && (
          <div className="flex flex-col gap-4 py-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800 flex flex-col gap-1">
              <span className="font-bold">
                UNRESOLVED BANK STATEMENT ENTRY:
              </span>
              <div>
                <span className="font-semibold text-gray-600">
                  Description:
                </span>{' '}
                {popup.stmtRow.description}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Amount:</span> ₹
                {popup.stmtRow.creditAmount.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Ref:</span>{' '}
                {popup.stmtRow.refNo}
              </div>
            </div>

            <DropDownList
              label="Link with Unresolved Receipt"
              required
              value={selectedReceiptId}
              onChange={val => setSelectedReceiptId(val as string)}
              data={receipts.map(r => ({
                text: `${r.receiptNumber} - ₹${r.amountPaid.toLocaleString()} (${r.paymentMode})`,
                value: r.id,
              }))}
              optionValue="value"
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Match & Clear"
                variant="primary"
                onClick={handleManualMatchSubmit}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
