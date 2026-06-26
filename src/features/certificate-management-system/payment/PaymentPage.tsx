import { useState } from 'react';

import { Button } from 'shared/components/buttons';
import {
  FormPage,
  FormCard,
  FormGrid,
  StatusBadge,
} from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';

const gateways = [
  { name: 'BillDesk', value: 'billdesk' },
  { name: 'PayU', value: 'payu' },
  { name: 'SBI ePay', value: 'sbiepay' },
];

export default function PaymentPage() {
  const [form, setForm] = useState({
    gateway: '',
    transactionNo: '',
  });

  const [status, setStatus] = useState('Pending');

  const handlePayment = () => {
    if (!form.gateway) {
      alert('Please select a payment gateway');
      return;
    }
    // Mock processing
    setTimeout(() => {
      setForm({
        ...form,
        transactionNo: 'TXN' + Math.floor(Math.random() * 100000000),
      });
      setStatus('Success');
    }, 1000);
  };

  return (
    <FormPage
      title="Fee Payment"
      description="Securely pay your certificate application fees."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Finance Portal', to: '/home/sub-menu/finance-portal' },
        { label: 'Pay Fee' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FormCard title="Application Details">
            <FormGrid columns={2}>
              <TextBox
                label="Application No"
                value="RGPV/BON/2026/0099"
                disabled
              />
              <TextBox
                label="Certificate Name"
                value="Bonafide Certificate"
                disabled
              />
            </FormGrid>
          </FormCard>

          <FormCard title="Payment Processing">
            <FormGrid columns={2}>
              <DropDownList
                label="Select Payment Gateway"
                data={gateways}
                textField="name"
                optionValue="value"
                value={form.gateway}
                onChange={v => setForm({ ...form, gateway: String(v) })}
                disabled={status === 'Success'}
                required
              />
              <TextBox
                label="Transaction No (Generated after payment)"
                value={form.transactionNo}
                disabled
              />
            </FormGrid>

            {status === 'Pending' && (
              <div className="mt-6">
                <Button
                  label="Proceed to Pay"
                  variant="primary"
                  icon="payment"
                  onClick={handlePayment}
                />
              </div>
            )}
          </FormCard>
        </div>

        <div className="lg:col-span-1">
          <FormCard title="Payment Summary">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Application Fee</span>
              <span className="font-semibold">₹ 500.00</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-semibold">₹ 50.00</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4 mb-6 border-gray-200">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-lg font-bold text-blue-700">₹ 550.00</span>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Status</span>
              <StatusBadge
                label={status}
                variant={status === 'Success' ? 'approved' : 'pending'}
              />
            </div>

            {status === 'Success' && (
              <Button
                label="Download Receipt"
                variant="outlined"
                icon="receipt"
                className="w-full"
                onClick={() => alert('Downloading Receipt...')}
              />
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
