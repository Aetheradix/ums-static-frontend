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
import { contractors, workOrders } from '../../mocks';
import { infraUrls } from '../../urls';

const CONTRACTOR_OPTIONS = [
  { name: 'All Contractors', value: '' },
  ...contractors.map(c => ({ name: c.companyName, value: c.id })),
];
const STATUS_OPTIONS = [
  { name: 'All Statuses', value: '' },
  'Active',
  'Inactive',
  'Blacklisted',
].map(v => (typeof v === 'string' ? { name: v, value: v } : v));

export default function ContractorPerformanceReport() {
  const [contractorId, setContractorId] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const handleGenerate = () => {
    ToastService.success(
      `"Contractor Performance Report" generated successfully.`
    );
  };

  const handleExport = () => {
    ToastService.success(`"Contractor Performance Report" exported as PDF.`);
  };

  // Merge contractor info with their work orders for the report
  const reportData = contractors.map(c => {
    const orders = workOrders.filter(w => w.contractorId === c.id);
    const totalOrders = orders.length;
    const completedOrders = orders.filter(w => w.status === 'Completed').length;
    const totalValue = orders.reduce((sum, w) => sum + w.amount, 0);
    return { ...c, totalOrders, completedOrders, totalValue };
  });

  return (
    <FormPage
      title="Contractor Performance Report"
      description="Evaluates contractor-wise projects, work completion status, delays, and payments."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Reports', to: infraUrls.reports },
        { label: 'Contractor Performance Report' },
      ]}
    >
      <FormCard
        title="Report Filters"
        subtitle="Apply filters before generating reports"
      >
        <FormGrid columns={4}>
          <DropDownList
            label="Contractor"
            data={CONTRACTOR_OPTIONS}
            textField="name"
            optionValue="value"
            value={contractorId}
            onChange={v => setContractorId(v as string)}
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
              setContractorId('');
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
            data={reportData}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              { field: 'companyName', header: 'Contractor Company' },
              { field: 'contractorName', header: 'Contact Person' },
              {
                field: 'totalOrders',
                header: 'Total Work Orders',
                cell: (item: any) => <span>{item.totalOrders}</span>,
              },
              {
                field: 'completedOrders',
                header: 'Completed',
                cell: (item: any) => <span>{item.completedOrders}</span>,
              },
              {
                field: 'totalValue',
                header: 'Total Value',
                cell: (item: any) => (
                  <span>₹{item.totalValue.toLocaleString('en-IN')}</span>
                ),
              },
              {
                field: 'rating',
                header: 'Rating',
                cell: (item: any) => (
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                    {'★'.repeat(Math.floor(item.rating))}{' '}
                    {item.rating.toFixed(1)}
                  </span>
                ),
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
                        : item.status === 'Blacklisted'
                          ? 'rejected'
                          : 'neutral'
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
