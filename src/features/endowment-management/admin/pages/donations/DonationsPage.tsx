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
import {
  useCreateDonation,
  useDonations,
  useDonors,
  useFunds,
} from '../../../queries';

export default function DonationsPage() {
  const { data: donations } = useDonations();
  const { data: donors } = useDonors();
  const { data: funds } = useFunds();
  const createDonation = useCreateDonation();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Online');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [purpose, setPurpose] = useState('');

  const handleSave = () => {
    if (!selectedDonor || !amount || !purpose) {
      ToastService.error('Please fill in all required fields');
      return;
    }
    createDonation.mutate(
      {
        donorName: selectedDonor,
        amount: Number(amount),
        mode,
        reference,
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
        purpose,
      },
      {
        onSuccess: () => {
          ToastService.success('Donation recorded successfully!');
          setIsPopupOpen(false);
          setSelectedDonor('');
          setAmount('');
          setMode('Online');
          setReference('');
          setPurpose('');
        },
      }
    );
  };

  const donorOptions =
    donors?.map(d => ({ text: d.name, value: d.name })) || [];
  const fundOptions = funds?.map(f => ({ text: f.name, value: f.name })) || [];

  const columns: Controls.ColumnProps<any>[] = [
    { header: 'Donor Name', field: 'donorName' },
    {
      header: 'Amount',
      field: 'amount',
      cell: (row: any) => <span>₹{row.amount?.toLocaleString()}</span>,
    },
    { header: 'Mode', field: 'mode' },
    { header: 'Date', field: 'date' },
    { header: 'Intended Fund', field: 'purpose' },
    {
      header: '80G Eligible',
      field: 'eligible80G',
      cell: (row: any) => (
        <StatusBadge
          label={row.eligible80G ? 'Yes' : 'No'}
          variant={row.eligible80G ? 'approved' : 'neutral'}
        />
      ),
    },
    {
      header: 'Actions',
      field: 'actions',
      cell: (row: any) => (
        <div className="flex gap-2">
          <Button
            label="Receipt"
            variant="outlined"
            size="small"
            icon="receipt"
            onClick={() =>
              ToastService.success('Downloading donation receipt...')
            }
          />
          {row.eligible80G && (
            <Button
              label="80G Cert"
              variant="outlined"
              size="small"
              icon="verified"
              onClick={() =>
                ToastService.success('Downloading 80G Certificate...')
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Donation Records"
      description="Log contributions and generate receipts/80G certificates."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Donations' },
      ]}
    >
      <FormCard
        title="All Donations"
        headerAction={
          <Button
            label="Record Donation"
            icon="plus"
            variant="primary"
            onClick={() => setIsPopupOpen(true)}
          />
        }
      >
        <GridPanel columns={columns} data={donations || []} />
      </FormCard>

      {isPopupOpen && (
        <FormPopup
          visible={isPopupOpen}
          title="Record New Donation"
          onHide={() => setIsPopupOpen(false)}
          size="lg"
          footer={
            <div className="flex gap-2 justify-end w-full">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setIsPopupOpen(false)}
              />
              <Button
                label="Record Donation"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          }
        >
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <DropDownList
                label="Select Donor"
                data={donorOptions}
                textField="text"
                valueField="value"
                placeholder="Select Donor"
                defaultOptionText="Select Donor"
                value={selectedDonor}
                onChange={val => setSelectedDonor((val as string) || '')}
                required
              />
              <TextBox
                label="Amount (₹)"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={val => setAmount(String(val))}
                required
              />
              <DropDownList
                label="Payment Mode"
                data={['NEFT', 'RTGS', 'Cheque', 'DD', 'Online'].map(v => ({
                  text: v,
                  value: v,
                }))}
                textField="text"
                valueField="value"
                placeholder="Select Mode"
                defaultOptionText="Select Mode"
                value={mode}
                onChange={val => setMode((val as string) || 'Online')}
                required
              />
              <TextBox
                label="Payment Reference / UTR"
                placeholder="Enter Reference / UTR Number"
                value={reference}
                onChange={val => setReference(String(val))}
                required
              />
              <DatePicker
                label="Date of Receipt"
                value={date}
                onChange={val => setDate((val as Date) || undefined)}
                required
              />
              <DropDownList
                label="Intended Fund / Purpose"
                data={[{ text: 'New Fund', value: 'New Fund' }, ...fundOptions]}
                textField="text"
                valueField="value"
                placeholder="Select Fund"
                defaultOptionText="Select Fund"
                value={purpose}
                onChange={val => setPurpose((val as string) || '')}
                required
              />
            </div>
            <p className="text-xs text-gray-500 italic mt-2">
              Note: 80G Certificate will be auto-generated if the donor has a
              PAN recorded and the amount is ₹50,000 or above.
            </p>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
