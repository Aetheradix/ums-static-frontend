import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, InputBlock } from 'shared/components/forms';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useFunds } from '../../../queries';

export default function FundUtilizationReportPage() {
  const { data: funds } = useFunds();
  const [selectedFund, setSelectedFund] = useState('All');
  const [academicYear, setAcademicYear] = useState('2025-2026');

  const fundOptions = [
    { text: 'All Funds', value: 'All' },
    ...(funds?.map(f => ({ text: f.name, value: f.name })) || []),
  ];

  const filteredData =
    funds
      ?.map(f => ({ ...f, balance: f.yield - f.disbursed }))
      .filter(f => selectedFund === 'All' || f.name === selectedFund) || [];

  return (
    <FormPage
      title="Fund-wise Utilization Report"
      description="Track opening corpus, yield accrued, disbursements, and current balances by fund."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Fund-wise Utilization' },
      ]}
    >
      <FormCard
        title="Fund Utilization Overview"
        headerAction={
          <Button label="Export to Excel" icon="download" variant="outlined" />
        }
      >
        <div className="flex gap-4 items-start mb-6 [&_.input-block]:mb-0">
          <div className="w-72">
            <DropDownList
              label="Select Fund"
              data={fundOptions}
              value={selectedFund}
              textField="text"
              valueField="value"
              placeholder="Select Fund"
              defaultOptionText="Select Fund"
              onChange={val => setSelectedFund((val as string) || 'All')}
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
              value={academicYear}
              textField="text"
              valueField="value"
              placeholder="Select Academic Year"
              defaultOptionText="Select Academic Year"
              onChange={val => setAcademicYear((val as string) || '2025-2026')}
            />
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
              cell: (row: any) => <span>₹{row.yield?.toLocaleString()}</span>,
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
              cell: (row: any) => <span>₹{row.balance?.toLocaleString()}</span>,
            },
          ]}
          data={filteredData}
        />
      </FormCard>
    </FormPage>
  );
}
