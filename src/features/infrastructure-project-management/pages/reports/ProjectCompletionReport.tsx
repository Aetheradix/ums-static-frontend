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
import { completions } from '../../mocks';
import { infraUrls } from '../../urls';

const DEPARTMENT_OPTIONS = [
  { name: 'All Departments', value: '' },
  ...Array.from(new Set(completions.map(c => c.handoverDepartment))).map(
    dept => ({ name: dept, value: dept })
  ),
];

export default function ProjectCompletionReport() {
  const [department, setDepartment] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const handleGenerate = () => {
    ToastService.success(`"Project Completion Report" generated successfully.`);
  };

  const handleExport = () => {
    ToastService.success(`"Project Completion Report" exported as PDF.`);
  };

  return (
    <FormPage
      title="Project Completion & Handover Report"
      description="Lists completed projects with completion date, handover details, and final project cost."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Reports', to: infraUrls.reports },
        { label: 'Project Completion Report' },
      ]}
    >
      <FormCard
        title="Report Filters"
        subtitle="Apply filters before generating reports"
      >
        <FormGrid columns={3}>
          <DropDownList
            label="Handover Department"
            data={DEPARTMENT_OPTIONS}
            textField="name"
            optionValue="value"
            value={department}
            onChange={v => setDepartment(v as string)}
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
              setDepartment('');
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
            data={completions}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              { field: 'projectName', header: 'Project Name' },
              { field: 'completionDate', header: 'Completion Date' },
              { field: 'completionCertificate', header: 'Certificate No' },
              { field: 'handoverDepartment', header: 'Department' },
              { field: 'handoverTo', header: 'Handover To' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => (
                  <StatusBadge
                    label={item.status}
                    variant={
                      item.status === 'Completed' ? 'approved' : 'pending'
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
