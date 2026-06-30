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
import { projects } from '../../mocks';
import { infraUrls } from '../../urls';

const PROJECT_OPTIONS = [
  { name: 'All Projects', value: '' },
  ...projects.map(p => ({ name: p.name, value: p.id })),
];
const STATUS_OPTIONS = [
  { name: 'All Statuses', value: '' },
  'Ongoing',
  'Completed',
  'Delayed',
].map(v => (typeof v === 'string' ? { name: v, value: v } : v));

export default function ProjectProgressReport() {
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const handleGenerate = () => {
    ToastService.success(`"Project Progress Report" generated successfully.`);
  };

  const handleExport = () => {
    ToastService.success(`"Project Progress Report" exported as PDF.`);
  };

  const statusVariant = (s: string) => {
    if (s === 'Completed') return 'approved';
    if (s === 'Delayed') return 'rejected';
    if (s === 'Ongoing') return 'pending';
    return 'neutral';
  };

  return (
    <FormPage
      title="Project Progress Report"
      description="Tracks project-wise progress, milestones achieved, delays, and pending activities."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Reports', to: infraUrls.reports },
        { label: 'Project Progress Report' },
      ]}
    >
      <FormCard
        title="Report Filters"
        subtitle="Apply filters before generating reports"
      >
        <FormGrid columns={4}>
          <DropDownList
            label="Project"
            data={PROJECT_OPTIONS}
            textField="name"
            optionValue="value"
            value={projectId}
            onChange={v => setProjectId(v as string)}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={status}
            onChange={v => setStatus(v as string)}
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
              setProjectId('');
              setStatus('');
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
            data={projects}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              { field: 'code', header: 'Project Code' },
              { field: 'name', header: 'Project Name' },
              { field: 'department', header: 'Department' },
              { field: 'startDate', header: 'Start Date' },
              { field: 'endDate', header: 'End Date' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => (
                  <StatusBadge
                    label={item.status}
                    variant={statusVariant(item.status)}
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
