import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { statusVariant } from '../../../mocks';
import {
  useApplications,
  useCreateDisbursement,
  useDisbursements,
  useUpdateDisbursementStatus,
} from '../../../queries';

export default function DisbursementPage() {
  const { data: disbursements } = useDisbursements();
  const { data: applications } = useApplications();
  const createDisbursement = useCreateDisbursement();
  const updateDisbursementStatus = useUpdateDisbursementStatus();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mode, setMode] = useState('NEFT');
  const [utr, setUtr] = useState('');

  const selectedBeneficiaries =
    applications?.filter(app => app.status === 'Selected') || [];
  const beneficiaryOptions = selectedBeneficiaries.map(app => ({
    label: `${app.studentName} - ${app.schemeName}`,
    value: app.id,
  }));

  const handleSave = () => {
    const app = selectedBeneficiaries.find(a => String(a.id) === selectedApp);
    if (!app) {
      ToastService.error('Please select a beneficiary');
      return;
    }
    if (!amount) {
      ToastService.error('Please enter amount');
      return;
    }
    createDisbursement.mutate(
      {
        beneficiary: app.studentName,
        schemeName: app.schemeName,
        amount: Number(amount),
        date: date
          ? date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
        mode,
        utr,
      },
      {
        onSuccess: () => {
          ToastService.success('Disbursement recorded successfully!');
          setIsPopupOpen(false);
          setSelectedApp('');
          setAmount('');
          setMode('NEFT');
          setUtr('');
        },
      }
    );
  };

  const columns: Controls.ColumnProps<any>[] = [
    { header: 'Beneficiary', field: 'beneficiary' },
    { header: 'Scheme', field: 'schemeName' },
    {
      header: 'Amount Disbursed',
      field: 'amount',
      cell: (row: any) => <span>₹{row.amount?.toLocaleString()}</span>,
    },
    { header: 'Date', field: 'date' },
    { header: 'Mode', field: 'mode' },
    {
      header: 'Status',
      field: 'status',
      cell: (row: any) => (
        <StatusBadge label={row.status} variant={statusVariant(row.status)} />
      ),
    },
    {
      header: 'Actions',
      field: 'actions',
      cell: (row: any) => (
        <div className="flex gap-2">
          {row.status === 'Pending' && (
            <Button
              label="Process"
              size="small"
              variant="outlined"
              onClick={() => {
                const app = applications?.find(
                  a =>
                    a.studentName === row.beneficiary &&
                    a.schemeName === row.schemeName
                );
                if (app) {
                  setSelectedApp(String(app.id));
                }
                setIsPopupOpen(true);
              }}
            />
          )}
          {row.status === 'Processed' && (
            <Button
              label="Mark Paid"
              size="small"
              variant="primary"
              onClick={() => {
                updateDisbursementStatus.mutate(
                  { id: row.id, status: 'Paid' },
                  {
                    onSuccess: () => {
                      ToastService.success(
                        'Disbursement marked as Paid successfully!'
                      );
                    },
                  }
                );
              }}
            />
          )}
          {row.status === 'Paid' && (
            <Button
              label="Receipt"
              size="small"
              variant="outlined"
              icon="receipt"
              onClick={() => {
                ToastService.success('Downloading disbursement receipt...');
              }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Disbursement"
      description="Record payouts to selected beneficiaries."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Disbursement' },
      ]}
    >
      <FormCard
        title="Disbursement Records"
        headerAction={
          <Button
            label="Record Disbursement"
            icon="payments"
            variant="primary"
            onClick={() => setIsPopupOpen(true)}
          />
        }
      >
        <GridPanel columns={columns} data={disbursements || []} />
      </FormCard>

      {isPopupOpen && (
        <FormPopup
          visible={isPopupOpen}
          title="Record Disbursement"
          onHide={() => setIsPopupOpen(false)}
          size="default"
          footer={
            <div className="flex gap-2 justify-end w-full">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setIsPopupOpen(false)}
              />
              <Button label="Process" variant="primary" onClick={handleSave} />
            </div>
          }
        >
          <div className="space-y-4 p-4">
            <DropDownList
              label="Select Beneficiary"
              data={beneficiaryOptions}
              value={selectedApp}
              textField="label"
              valueField="value"
              placeholder="Select Beneficiary"
              defaultOptionText="Select Beneficiary"
              onChange={value => setSelectedApp(String(value))}
              required
            />
            {selectedApp && (
              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 border border-blue-200">
                <strong>Budget Check:</strong> The selected scheme has
                sufficient balance.
              </div>
            )}
            <TextBox
              label="Amount (₹)"
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={val => setAmount(String(val))}
              required
            />
            <DatePicker
              label="Disbursement Date"
              value={date}
              onChange={val => setDate((val as Date) || undefined)}
              required
            />
            <DropDownList
              label="Payment Mode"
              data={['NEFT', 'RTGS', 'Cheque', 'DD', 'Portal Wallet'].map(
                v => ({ text: v, value: v })
              )}
              textField="text"
              valueField="value"
              placeholder="Select Mode"
              defaultOptionText="Select Mode"
              value={mode}
              onChange={val => setMode((val as string) || 'NEFT')}
              required
            />
            <TextBox
              label="UTR / Reference Number"
              placeholder="Enter UTR / Reference Number"
              value={utr}
              onChange={val => setUtr(String(val))}
            />
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="genCert"
                className="w-4 h-4 text-blue-600"
                defaultChecked
              />
              <label htmlFor="genCert" className="text-sm font-medium">
                Generate Award Certificate
              </label>
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
