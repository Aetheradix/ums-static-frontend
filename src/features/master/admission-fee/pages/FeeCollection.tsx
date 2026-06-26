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
  type StudentDemand as DemandType,
} from '../store/useFeeStore';
import { ToastService } from 'services';
import { TextBox, DropDownList, PasswordBox } from 'shared/components/forms';

export default function FeeCollection() {
  const { demands, students, recordCollection, recordFailedTransaction } =
    useFeeStore();
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'manual' | 'online' | 'gateway';
    data?: DemandType;
  }>({ mode: 'closed' });

  // Manual payment state
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [refNo, setRefNo] = useState('');

  // Online gateway simulator state
  const [onlineGatewayMode, setOnlineGatewayMode] = useState('UPI');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [upiId, setUpiId] = useState('');

  const getStudentName = (id: string) =>
    students.find(s => s.id === id)?.name || 'N/A';
  const getStudentEnroll = (id: string) =>
    students.find(s => s.id === id)?.enrollmentNumber || 'N/A';

  const unpaidDemands = demands.filter(d => d.status === 'Unpaid');

  const handleManualOpen = (demand: DemandType) => {
    setPaymentMode('Cash');
    setRefNo(`REF-${Date.now().toString().slice(-5)}`);
    setPopup({ mode: 'manual', data: demand });
  };

  const handleOnlineOpen = (demand: DemandType) => {
    setOnlineGatewayMode('UPI');
    setCardNumber('');
    setCardHolder('');
    setUpiId('');
    setPopup({ mode: 'online', data: demand });
  };

  const handleManualSubmit = () => {
    const demand = popup.data;
    if (!demand) return;

    recordCollection({
      demandId: demand.id,
      paymentMode,
      transactionReference: refNo,
      amountPaid: demand.payableAmount,
    });

    ToastService.success('Manual fee payment logged successfully.');
    setPopup({ mode: 'closed' });
  };

  const handleOnlineCheckout = () => {
    const demand = popup.data;
    if (!demand) return;

    // Transition to simulated gateway loader screen
    setPopup({ mode: 'gateway', data: demand });

    // Simulate payment transaction
    setTimeout(() => {
      // 80% Success, 20% Failure
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        const txnId = `TXN${Date.now().toString().slice(-8)}`;
        recordCollection({
          demandId: demand.id,
          paymentMode: `Online - ${onlineGatewayMode}`,
          transactionReference: txnId,
          amountPaid: demand.payableAmount,
        });
        ToastService.success('Online Payment completed successfully!');
      } else {
        const failTxnId = `FAIL${Date.now().toString().slice(-8)}`;
        recordFailedTransaction({
          studentId: demand.studentId,
          amount: demand.payableAmount,
          paymentMode: onlineGatewayMode,
          gatewayFailureDetails:
            'CARD_DECLINED_OR_UPI_TIMEOUT (Insufficient balance or connection timeout)',
          refNo: failTxnId,
        });
        ToastService.error('Payment failed. Added to Failed Transactions.');
      }
      setPopup({ mode: 'closed' });
    }, 2000);
  };

  return (
    <FormPage
      title="Fee Collection & Checkout"
      description="Record manual payment receipts for cash/DD or trigger a simulated online payment gateway experience."
    >
      <FormCard>
        <div className="mb-4 bg-gray-50 border p-3.5 rounded text-sm text-gray-700">
          <span className="font-semibold text-green-700">
            📌 Admin Instructions:
          </span>{' '}
          You can collect outstanding fees manually or simulate online checkouts
          for testing gateway callbacks and failure reconciliations.
        </div>

        <GridPanel
          data={unpaidDemands}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Enrollment No',
              cell: (item: DemandType) => (
                <span>{getStudentEnroll(item.studentId)}</span>
              ),
            },
            {
              header: 'Student Name',
              cell: (item: DemandType) => (
                <span>{getStudentName(item.studentId)}</span>
              ),
            },
            {
              header: 'Outstandings',
              cell: (item: DemandType) => (
                <span className="font-bold text-red-600">
                  ₹{item.payableAmount.toLocaleString()}
                </span>
              ),
            },
            { field: 'dueDate', header: 'Due Date' },
            {
              header: 'Collect Actions',
              cell: (item: DemandType) => (
                <div className="flex gap-2">
                  <Button
                    label="Manual Collection"
                    variant="primary"
                    className="p-1 text-xs"
                    onClick={() => handleManualOpen(item)}
                  />
                  <Button
                    label="Simulate Online"
                    variant="outlined"
                    className="p-1 text-xs bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                    onClick={() => handleOnlineOpen(item)}
                  />
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      {/* Manual Collection Entry */}
      <FormPopup
        visible={popup.mode === 'manual'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Record Manual Collection"
        subtitle="Log offline collection methods such as Cash or Cheques."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="bg-gray-100 border p-3 rounded-md text-sm">
              <div>
                <span className="font-semibold text-gray-600">Student:</span>{' '}
                {getStudentName(popup.data.studentId)}
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Amount Outstanding:
                </span>{' '}
                ₹{popup.data.payableAmount.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DropDownList
                label="Payment Mode"
                required
                value={paymentMode}
                onChange={val => setPaymentMode(val as string)}
                data={[
                  { text: 'Cash', value: 'Cash' },
                  { text: 'Cheque', value: 'Cheque' },
                  { text: 'Demand Draft (DD)', value: 'Demand Draft (DD)' },
                  {
                    text: 'NEFT / RTGS Transfer',
                    value: 'NEFT / RTGS Transfer',
                  },
                ]}
                optionValue="value"
              />

              <TextBox
                label="Transaction Reference No"
                required
                value={refNo}
                onChange={setRefNo}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Log Payment"
                variant="primary"
                onClick={handleManualSubmit}
              />
            </div>
          </div>
        )}
      </FormPopup>

      {/* Online Gateway Options Form */}
      <FormPopup
        visible={popup.mode === 'online'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Simulated Payment Gateway Options"
        subtitle="Configure the payment gateway method to run."
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="bg-indigo-50 border border-indigo-150 p-3 rounded-md text-sm">
              <div>
                <span className="font-semibold text-indigo-800">Student:</span>{' '}
                {getStudentName(popup.data.studentId)}
              </div>
              <div>
                <span className="font-semibold text-indigo-800">
                  Amount to Checkout:
                </span>{' '}
                ₹{popup.data.payableAmount.toLocaleString()}
              </div>
            </div>

            <div className="flex gap-4 border-b pb-2">
              {['UPI', 'Card', 'Net Banking'].map(mode => (
                <button
                  key={mode}
                  type="button"
                  className={`px-3 py-1 text-sm font-semibold rounded ${onlineGatewayMode === mode ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setOnlineGatewayMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>

            {onlineGatewayMode === 'UPI' && (
              <TextBox
                label="Enter UPI ID"
                required
                placeholder="e.g. name@upi"
                value={upiId}
                onChange={setUpiId}
              />
            )}

            {onlineGatewayMode === 'Card' && (
              <div className="flex flex-col gap-2">
                <TextBox
                  label="Card Holder Name"
                  required
                  placeholder="John Doe"
                  value={cardHolder}
                  onChange={setCardHolder}
                />
                <div className="grid grid-cols-2 gap-2">
                  <TextBox
                    label="Card Number"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={setCardNumber}
                  />
                  <PasswordBox
                    label="CVV"
                    required
                    placeholder="***"
                    showsWeakness={false}
                  />
                </div>
              </div>
            )}

            {onlineGatewayMode === 'Net Banking' && (
              <DropDownList
                label="Choose Bank"
                required
                data={[
                  { text: 'State Bank of India', value: 'State Bank of India' },
                  { text: 'HDFC Bank', value: 'HDFC Bank' },
                  { text: 'ICICI Bank', value: 'ICICI Bank' },
                  { text: 'Axis Bank', value: 'Axis Bank' },
                ]}
                optionValue="value"
              />
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label={`Proceed & Pay ₹${popup.data.payableAmount.toLocaleString()}`}
                variant="primary"
                onClick={handleOnlineCheckout}
              />
            </div>
          </div>
        )}
      </FormPopup>

      {/* Gateway Transition Simulator Screen */}
      <FormPopup
        visible={popup.mode === 'gateway'}
        onHide={() => {}} // Block hide
        title="Securing Gateway Connection"
        subtitle="Simulated Payment Process active..."
      >
        <div className="flex flex-col items-center justify-center p-6 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600 font-semibold animate-pulse">
            Processing payment transaction authorization...
          </span>
          <span className="text-xs text-gray-400">
            Communicating with bank 3D-secure network servers. Please wait...
          </span>
        </div>
      </FormPopup>
    </FormPage>
  );
}
