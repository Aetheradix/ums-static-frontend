import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { FormPage, FormCard } from 'shared/new-components';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

export default function FeePayment() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    navigate('/finance-supply-chain/student-fees/fee-details');
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);

  return (
    <FormPage
      title="Online Fee Payment"
      description="Pay your pending dues securely via our payment gateway"
    >
      <Toast ref={toast} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Summary */}
        <div className="md:col-span-1">
          <FormCard title="Payment Summary">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Semester 2 Balance</span>
                <span className="font-bold text-gray-800">
                  {formatCurrency(25000)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Late Fee Penalty</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(0)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Gateway Charges</span>
                <span className="font-bold text-gray-800">
                  {formatCurrency(0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2">
                <span className="text-lg font-bold text-gray-800">
                  Total Payable
                </span>
                <span className="text-2xl font-black text-blue-700">
                  {formatCurrency(25000)}
                </span>
              </div>
            </div>
          </FormCard>
        </div>

        {/* Payment Methods */}
        <div className="md:col-span-2">
          <FormCard title="Select Payment Method">
            <div className="flex flex-col gap-4">
              <div
                className={`border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="flex items-center gap-3">
                  <RadioButton
                    inputId="upi"
                    name="payment"
                    value="upi"
                    onChange={e => setPaymentMethod(e.value)}
                    checked={paymentMethod === 'upi'}
                  />
                  <i className="pi pi-qrcode text-xl text-blue-600"></i>
                  <label
                    htmlFor="upi"
                    className="font-bold text-gray-800 cursor-pointer"
                  >
                    UPI / QR Code (Zero Fee)
                  </label>
                </div>
                {paymentMethod === 'upi' && (
                  <div className="mt-4 pl-10">
                    <p className="text-sm text-gray-600 mb-2">
                      Scan the QR code with any UPI app to pay instantly.
                    </p>
                    <div className="w-32 h-32 bg-white border border-gray-300 rounded flex items-center justify-center p-2">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=ums@bank"
                        alt="QR Code"
                        className="w-full h-full opacity-50"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <RadioButton
                    inputId="card"
                    name="payment"
                    value="card"
                    onChange={e => setPaymentMethod(e.value)}
                    checked={paymentMethod === 'card'}
                  />
                  <i className="pi pi-credit-card text-xl text-green-600"></i>
                  <label
                    htmlFor="card"
                    className="font-bold text-gray-800 cursor-pointer"
                  >
                    Credit / Debit Card
                  </label>
                </div>
                {paymentMethod === 'card' && (
                  <div className="mt-4 pl-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 block mb-1">
                        Card Number
                      </label>
                      <InputText
                        placeholder="0000 0000 0000 0000"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <InputText placeholder="MM/YY" className="w-full" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">
                        CVV
                      </label>
                      <InputText
                        placeholder="123"
                        className="w-full"
                        type="password"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <div className="flex items-center gap-3">
                  <RadioButton
                    inputId="netbanking"
                    name="payment"
                    value="netbanking"
                    onChange={e => setPaymentMethod(e.value)}
                    checked={paymentMethod === 'netbanking'}
                  />
                  <i className="pi pi-building text-xl text-orange-600"></i>
                  <label
                    htmlFor="netbanking"
                    className="font-bold text-gray-800 cursor-pointer"
                  >
                    Net Banking
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <Button
                label="Back to Fee Details"
                icon="pi pi-arrow-left"
                severity="secondary"
                outlined
                onClick={() =>
                  navigate('/finance-supply-chain/student-fees/fee-details')
                }
              />
              <Button
                label={`Pay ${formatCurrency(25000)}`}
                icon={isProcessing ? 'pi pi-spin pi-spinner' : 'pi pi-lock'}
                size="large"
                onClick={handlePayment}
                disabled={isProcessing}
              />
            </div>
          </FormCard>
        </div>
      </div>

      <Dialog
        visible={showSuccess}
        onHide={closeSuccess}
        modal
        closable={false}
        showHeader={false}
        className="w-[400px]"
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <i className="pi pi-check text-3xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-black text-gray-800 m-0 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment of {formatCurrency(25000)} has been processed
            successfully. Transaction ID: TXN102938475.
          </p>
          <Button
            label="View Receipt"
            icon="pi pi-download"
            className="w-full mb-3"
            severity="success"
            onClick={closeSuccess}
          />
          <Button
            label="Return to Dashboard"
            className="w-full"
            outlined
            severity="secondary"
            onClick={closeSuccess}
          />
        </div>
      </Dialog>
    </FormPage>
  );
}
