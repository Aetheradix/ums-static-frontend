import { Button } from 'primereact/button';
import { useState } from 'react';
import { ToastService } from 'services';
import { DatePicker, DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string>('registered_students');
  const [programme, setProgramme] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const reportOptions = [
    {
      label: 'Complete Registered Students List',
      value: 'registered_students',
    },
    { label: 'Pending Verification Report', value: 'pending_verification' },
    { label: 'Fee Collection Report', value: 'fee_collection' },
    { label: 'Offline Payment Pending', value: 'offline_pending' },
    { label: 'In-Absentia Students', value: 'in_absentia' },
    { label: 'Degree Dispatch Tracker', value: 'dispatch_tracker' },
    { label: 'Medal / Distinction Holders List', value: 'medals' },
    { label: 'Convocation Pass Register', value: 'pass_register' },
    { label: 'Document / Photo Export (ZIP)', value: 'document_export' },
    { label: 'Full Form Data Export', value: 'full_export' },
  ];

  const handleExport = () => {
    ToastService.success(
      'Export started successfully. The file will download shortly.'
    );
  };

  return (
    <FormPage
      title="Exports & Reports"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Admin Portal', to: CONVOCATION_URLS.ADMIN.ROOT },
        { label: 'Reports' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard
          title="Generate Report"
          subtitle="Select a report type and apply filters to export data."
        >
          <FormGrid columns={2}>
            <div className="flex flex-col gap-2">
              <DropDownList
                label="Report Type"
                data={reportOptions}
                value={reportType}
                onChange={(val: any) => setReportType(val)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <DropDownList
                label="Programme Filter"
                data={[
                  { label: 'All Programmes', value: 'all' },
                  { label: 'B.Tech CSE', value: 'btech_cse' },
                  { label: 'MBA', value: 'mba' },
                ]}
                value={programme}
                onChange={(val: any) => setProgramme(val)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(val: any) => setStartDate(val)}
                placeholder="From Date"
              />
            </div>
            <div className="flex flex-col gap-2">
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(val: any) => setEndDate(val)}
                placeholder="To Date"
              />
            </div>
          </FormGrid>

          <div className="mt-6 flex justify-end">
            <Button
              label={
                reportType === 'document_export'
                  ? 'Download ZIP Package'
                  : 'Export to Excel'
              }
              icon={
                reportType === 'document_export'
                  ? 'pi pi-folder'
                  : 'pi pi-file-excel'
              }
              severity={reportType === 'document_export' ? 'info' : 'success'}
              onClick={handleExport}
            />
          </div>
        </FormCard>

        {reportType === 'registered_students' && (
          <FormCard title="Preview: Registered Students">
            <div className="p-4 border rounded bg-gray-50 text-center text-gray-500 py-10">
              <i className="pi pi-table text-4xl mb-2 text-gray-300"></i>
              <p>
                Preview data will appear here when filters are applied. Export
                to see full details.
              </p>
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
