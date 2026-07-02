import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import {
  useDisbursements,
  useDonations,
  useDonors,
  useFunds,
} from '../../../queries';

export default function UtilizationReportsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const { data: funds } = useFunds();
  const { data: donors } = useDonors();
  const { data: donations } = useDonations();
  const { data: disbursements } = useDisbursements();

  const fundOptions = [
    { text: 'All Funds', value: 'All Funds' },
    ...(funds?.map(f => ({ text: f.name, value: f.name })) || []),
  ];
  const donorOptions = [
    { text: 'All Donors', value: 'All Donors' },
    ...(donors?.map(d => ({ text: d.name, value: d.name })) || []),
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0: // Fund-wise Utilization
        return (
          <FormCard
            title="Fund Utilization Overview"
            headerAction={
              <Button
                label="Export to Excel"
                icon="download"
                variant="outlined"
              />
            }
          >
            <div className="flex gap-4 items-end mb-6 [&_.input-block]:mb-0">
              <div className="w-72">
                <DropDownList
                  label="Select Fund"
                  data={fundOptions}
                  textField="text"
                  valueField="value"
                  placeholder="Select Fund"
                  defaultOptionText="Select Fund"
                />
              </div>
              <div className="w-48">
                <DropDownList
                  label="Academic Year"
                  data={[
                    { text: '2025-2026', value: '2025-2026' },
                    { text: '2024-2025', value: '2024-2025' },
                    { text: '2023-2024', value: '2023-2024' },
                  ]}
                  textField="text"
                  valueField="value"
                  placeholder="Select Academic Year"
                  defaultOptionText="Select Academic Year"
                />
              </div>
              <Button label="Generate Report" variant="primary" />
            </div>

            <GridPanel
              columns={[
                { header: 'Fund Name', field: 'name' },
                {
                  header: 'Opening Corpus',
                  field: 'currentCorpus',
                  cell: (row: any) => (
                    <span>₹{row.currentCorpus?.toLocaleString()}</span>
                  ),
                },
                {
                  header: 'Yield Accrued',
                  field: 'yield',
                  cell: (row: any) => (
                    <span>₹{row.yield?.toLocaleString()}</span>
                  ),
                },
                {
                  header: 'Disbursed',
                  field: 'disbursed',
                  cell: (row: any) => (
                    <span>₹{row.disbursed?.toLocaleString()}</span>
                  ),
                },
                {
                  header: 'Available Balance',
                  field: 'balance',
                  cell: (row: any) => (
                    <span>₹{row.balance?.toLocaleString()}</span>
                  ),
                },
              ]}
              data={
                funds?.map(f => ({ ...f, balance: f.yield - f.disbursed })) ||
                []
              }
            />
          </FormCard>
        );
      case 1: // Donor Acknowledgement
        return (
          <FormCard
            title="Donor Contributions & 80G"
            headerAction={
              <Button
                label="Export to Excel"
                icon="download"
                variant="outlined"
              />
            }
          >
            <div className="flex gap-4 items-end mb-6 [&_.input-block]:mb-0">
              <div className="w-72">
                <DropDownList
                  label="Select Donor"
                  data={donorOptions}
                  textField="text"
                  valueField="value"
                  placeholder="Select Donor"
                  defaultOptionText="Select Donor"
                />
              </div>
              <DatePicker label="From Date" />
              <DatePicker label="To Date" />
              <Button label="Generate Report" variant="primary" />
            </div>

            <GridPanel
              columns={[
                { header: 'Donor Name', field: 'donorName' },
                { header: 'Date', field: 'date' },
                {
                  header: 'Amount',
                  field: 'amount',
                  cell: (row: any) => (
                    <span>₹{row.amount?.toLocaleString()}</span>
                  ),
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
              data={donations || []}
            />
          </FormCard>
        );
      case 2: // Scheme Performance
        return (
          <FormCard
            title="Disbursements across Schemes"
            headerAction={
              <Button
                label="Export to Excel"
                icon="download"
                variant="outlined"
              />
            }
          >
            <div className="flex gap-4 items-end mb-6 [&_.input-block]:mb-0">
              <div className="w-64">
                <DropDownList
                  label="Academic Year"
                  data={[
                    { text: '2025-2026', value: '2025-2026' },
                    { text: '2024-2025', value: '2024-2025' },
                    { text: '2023-2024', value: '2023-2024' },
                  ]}
                  textField="text"
                  valueField="value"
                  placeholder="Select Academic Year"
                  defaultOptionText="Select Academic Year"
                />
              </div>
              <Button label="Generate Report" variant="primary" />
            </div>

            <GridPanel
              columns={[
                { header: 'Beneficiary', field: 'beneficiary' },
                { header: 'Scheme Name', field: 'schemeName' },
                {
                  header: 'Amount',
                  field: 'amount',
                  cell: (row: any) => (
                    <span>₹{row.amount?.toLocaleString()}</span>
                  ),
                },
                { header: 'Date', field: 'date' },
                { header: 'Mode', field: 'mode' },
              ]}
              data={disbursements || []}
            />
          </FormCard>
        );
      default:
        return null;
    }
  };

  return (
    <FormPage
      title="Utilization & Reports"
      description="Track fund utilization and generate donor reports."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Utilization Reports' },
      ]}
    >
      <div className="mb-6">
        <Tabs
          tabs={[
            { title: 'Fund-wise Utilization', content: null },
            { title: 'Donor Acknowledgement & 80G', content: null },
            { title: 'Scheme Performance & Beneficiaries', content: null },
          ]}
          activeIndex={activeTab}
          onTabChange={e => setActiveTab(e.index)}
        />
      </div>

      {renderContent()}
    </FormPage>
  );
}
