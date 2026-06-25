import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import FormPopup from './FormPopup';

interface PaymentDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
  amount: number;
  title?: string;
  description?: string;
}

export default function PaymentDialog({
  visible,
  onClose,
  onSuccess,
  amount,
  title = 'College Fee Payment',
  description = 'Pay your fee to confirm registration.',
}: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate a network delay
    setTimeout(() => {
      setIsProcessing(false);
      // Generate fake transaction ID
      const fakeTxnId =
        'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      onSuccess(fakeTxnId);
    }, 2500);
  };

  const footer = (
    <div className="flex justify-end w-full">
      <Button
        type="button"
        label="Cancel"
        variant="outlined"
        onClick={onClose}
        disabled={isProcessing}
      />
    </div>
  );

  return (
    <FormPopup
      visible={visible}
      onHide={onClose}
      title={title}
      subtitle={description}
      footer={footer}
      size="default"
    >
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center p-8 border border-gray-200 rounded-lg w-full bg-white dark:bg-gray-800 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Total Amount Payable
            </p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              ₹{amount.toLocaleString()}
            </h2>
          </div>
          <Button
            label={isProcessing ? 'Processing...' : 'Pay Fee Now'}
            icon={isProcessing ? 'pi pi-spin pi-spinner' : 'pi pi-credit-card'}
            className="w-full sm:w-auto p-button-lg shadow-md"
            onClick={handlePayment}
            disabled={isProcessing}
            variant="primary"
          />
        </div>
      </div>
    </FormPopup>
  );
}
