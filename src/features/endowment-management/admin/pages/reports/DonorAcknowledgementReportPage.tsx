import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, InputBlock } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { useDonations, useDonors } from '../../../queries';

export default function DonorAcknowledgementReportPage() {
  const { data: donors } = useDonors();
  const { data: donations } = useDonations();
  const [selectedDonor, setSelectedDonor] = useState('All');

  const donorOptions = [
    { text: 'All Donors', value: 'All' },
    ...(donors?.map(d => ({ text: d.name, value: d.name })) || []),
  ];

  const filteredData =
    donations?.filter(
      d => selectedDonor === 'All' || d.donorName === selectedDonor
    ) || [];

  return (
    <FormPage
      title="Donor Acknowledgement & 80G Report"
      description="Track donor contributions, date of receipt, and 80G certificate issuance status."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Donor Acknowledgement' },
      ]}
    >
      <FormCard
        title="Donor Contributions & 80G"
        headerAction={
          <Button label="Export to Excel" icon="download" variant="outlined" />
        }
      >
        <div className="flex gap-4 items-start mb-6 [&_.input-block]:mb-0">
          <div className="w-72">
            <DropDownList
              label="Select Donor"
              data={donorOptions}
              value={selectedDonor}
              textField="text"
              valueField="value"
              placeholder="Select Donor"
              defaultOptionText="Select Donor"
              onChange={val => setSelectedDonor((val as string) || 'All')}
            />
          </div>
          <div className="w-48">
            <DatePicker label="From Date" />
          </div>
          <div className="w-48">
            <DatePicker label="To Date" />
          </div>
          <InputBlock
            label="&nbsp;"
            className="[&_label]:opacity-0 [&_label]:pointer-events-none [&_label]:select-none"
          >
            <Button
              label="Generate Report"
              variant="primary"
              className="whitespace-nowrap flex-shrink-0"
            />
          </InputBlock>
        </div>

        <GridPanel
          columns={[
            { header: 'Donor Name', field: 'donorName' },
            { header: 'Date', field: 'date' },
            {
              header: 'Amount',
              field: 'amount',
              cell: (row: any) => <span>₹{row.amount?.toLocaleString()}</span>,
            },
            { header: 'Fund Purpose', field: 'purpose' },
            {
              header: '80G Issued',
              field: 'eligible80G',
              cell: (row: any) => (
                <StatusBadge
                  label={row.eligible80G ? 'Yes' : 'No'}
                  variant={row.eligible80G ? 'approved' : 'neutral'}
                />
              ),
            },
          ]}
          data={filteredData}
        />
      </FormCard>
    </FormPage>
  );
}
