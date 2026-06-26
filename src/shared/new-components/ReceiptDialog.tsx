import { Button } from 'shared/components/buttons';
import FormPopup from './FormPopup';

interface ReceiptDialogProps {
  visible: boolean;
  onClose: () => void;
  transactionId: string;
  amount: number;
  date: string;
  title?: string;
}

export default function ReceiptDialog({
  visible,
  onClose,
  transactionId,
  amount,
  date,
  title = 'Payment Successful',
}: ReceiptDialogProps) {
  const footer = (
    <div className="flex justify-center w-full">
      <Button
        type="button"
        label="Done"
        variant="primary"
        onClick={onClose}
        className="w-full sm:w-auto p-button-lg shadow-md"
      />
    </div>
  );

  return (
    <FormPopup
      visible={visible}
      onHide={onClose}
      title={title}
      footer={footer}
      size="default"
    >
      <div className="p-6">
        <div className="p-8 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
            <i className="pi pi-check text-3xl text-green-600 dark:text-green-400"></i>
          </div>
          <h3 className="font-bold text-xl mb-2">Payment Confirmed!</h3>
          <p className="text-sm mb-6">
            Your fee of ₹{amount.toLocaleString()} has been successfully paid.
          </p>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-100 dark:border-green-800/50 w-full max-w-sm text-left shadow-sm">
            <p className="text-sm mb-2 flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Transaction ID
              </span>
              <strong className="font-mono text-gray-900 dark:text-gray-100">
                {transactionId}
              </strong>
            </p>
            <p className="text-sm flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Date</span>
              <strong className="text-gray-900 dark:text-gray-100">
                {date}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </FormPopup>
  );
}
