import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { budgetAllocations } from '../../mocks';
import { infraUrls } from '../../urls';

const PROJECT_OPTIONS = [
  { name: 'All Projects', value: '' },
  ...Array.from(new Set(budgetAllocations.map(p => p.projectName))).map(
    name => ({ name, value: name })
  ),
];

export default function BudgetUtilizationReport() {
  const [project, setProject] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const handleGenerate = () => {
    ToastService.success(`"Budget Utilization Report" generated successfully.`);
  };

  const handleExport = () => {
    ToastService.success(`"Budget Utilization Report" exported as PDF.`);
  };

  return (
    <FormPage
      title="Budget Utilization Report"
      description="Compares allocated budget, expenditure, and remaining balance for each project."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Reports', to: infraUrls.reports },
        { label: 'Budget Utilization Report' },
      ]}
    >
      <FormCard
        title="Report Filters"
        subtitle="Apply filters before generating reports"
      >
        <FormGrid columns={3}>
          <DropDownList
            label="Project"
            data={PROJECT_OPTIONS}
            textField="name"
            optionValue="value"
            value={project}
            onChange={v => setProject(v as string)}
          />
          <DatePicker
            label="From Date"
            value={fromDate ? new Date(fromDate) : undefined}
            onChange={v => setFromDate(v ? v.toISOString().split('T')[0] : '')}
          />
          <DatePicker
            label="To Date"
            value={toDate ? new Date(toDate) : undefined}
            onChange={v => setToDate(v ? v.toISOString().split('T')[0] : '')}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Reset"
            variant="outlined"
            icon="refresh"
            onClick={() => {
              setProject('');
              setFromDate('');
              setToDate('');
            }}
          />
          <Button
            label="Generate"
            variant="primary"
            icon="file-export"
            onClick={handleGenerate}
          />
          <Button
            label="Export PDF"
            variant="primary"
            icon="download"
            onClick={handleExport}
          />
        </div>
      </FormCard>

      <div className="mt-4">
        <FormCard title="Report Data">
          <GridPanel
            data={budgetAllocations}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              { field: 'projectName', header: 'Project' },
              { field: 'budgetHead', header: 'Budget Head' },
              { field: 'financialYear', header: 'Financial Year' },
              {
                field: 'allocatedAmount',
                header: 'Allocated Amount',
                cell: (item: any) => (
                  <span>₹{item.allocatedAmount.toLocaleString('en-IN')}</span>
                ),
              },
              {
                field: 'usedAmount',
                header: 'Used Amount',
                cell: (item: any) => (
                  <span>₹{item.usedAmount.toLocaleString('en-IN')}</span>
                ),
              },
              {
                field: 'id',
                header: 'Remaining Balance',
                cell: (item: any) => {
                  const remaining = item.allocatedAmount - item.usedAmount;
                  return (
                    <span
                      style={{
                        color: remaining < 0 ? '#dc2626' : '#16a34a',
                        fontWeight: 600,
                      }}
                    >
                      ₹{remaining.toLocaleString('en-IN')}
                    </span>
                  );
                },
              },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => (
                  <StatusBadge
                    label={item.status}
                    variant={
                      item.status === 'Active'
                        ? 'approved'
                        : item.status === 'Exhausted'
                          ? 'rejected'
                          : 'pending'
                    }
                  />
                ),
              },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
