import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, InputBlock } from 'shared/components/forms';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useDisbursements } from '../../../queries';

export default function SchemePerformanceReportPage() {
  const { data: disbursements } = useDisbursements();
  const [academicYear, setAcademicYear] = useState('2025-2026');

  return (
    <FormPage
      title="Scheme Performance & Beneficiary Report"
      description="Monitor scholarship awards, prizes, and total disbursements across schemes by academic year."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Scheme Performance' },
      ]}
    >
      <FormCard
        title="Disbursements across Schemes"
        headerAction={
          <Button label="Export to Excel" icon="download" variant="outlined" />
        }
      >
        <div className="flex gap-4 items-start mb-6 [&_.input-block]:mb-0">
          <div className="w-64">
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
            { header: 'Beneficiary', field: 'beneficiary' },
            { header: 'Scheme Name', field: 'schemeName' },
            {
              header: 'Amount',
              field: 'amount',
              cell: (row: any) => <span>₹{row.amount?.toLocaleString()}</span>,
            },
            { header: 'Date', field: 'date' },
            { header: 'Mode', field: 'mode' },
          ]}
          data={disbursements || []}
        />
      </FormCard>
    </FormPage>
  );
}
