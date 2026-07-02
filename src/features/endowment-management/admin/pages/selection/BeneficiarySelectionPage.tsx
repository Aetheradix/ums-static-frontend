import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { statusVariant } from '../../../mocks';
import {
  useApplications,
  useSchemes,
  useUpdateApplicationStatus,
} from '../../../queries';

export default function BeneficiarySelectionPage() {
  const { data: applications } = useApplications();
  const { data: schemes } = useSchemes();
  const updateStatus = useUpdateApplicationStatus();

  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState('All');

  const schemeOptions = [
    { text: 'All Schemes', value: 'All' },
    ...(schemes?.map(s => ({ text: s.name, value: s.name })) || []),
  ];

  const filteredApps =
    applications?.filter(
      app =>
        selectedSchemeFilter === 'All' ||
        app.schemeName === selectedSchemeFilter
    ) || [];

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => ToastService.success(`Marked as ${newStatus}`),
      }
    );
  };

  const columns: Controls.ColumnProps<any>[] = [
    { header: 'Applicant Name', field: 'studentName' },
    { header: 'Scheme', field: 'schemeName' },
    { header: 'CGPA', field: 'cgpa' },
    { header: 'Date Applied', field: 'date' },
    {
      header: 'Status',
      field: 'status',
      cell: (row: any) => (
        <StatusBadge label={row.status} variant={statusVariant(row.status)} />
      ),
    },
    {
      header: 'Actions',
      field: 'actions',
      cell: (row: any) => (
        <div className="flex gap-2">
          {row.status === 'Applied' && (
            <Button
              label="Mark Eligible"
              size="small"
              variant="outlined"
              onClick={() => handleStatusChange(row.id, 'Eligible')}
            />
          )}
          {row.status === 'Eligible' && (
            <Button
              label="Shortlist"
              size="small"
              variant="outlined"
              onClick={() => handleStatusChange(row.id, 'Shortlisted')}
            />
          )}
          {row.status === 'Shortlisted' && (
            <Button
              label="Approve (Committee)"
              size="small"
              variant="primary"
              onClick={() => handleStatusChange(row.id, 'Selected')}
            />
          )}
          {['Applied', 'Eligible', 'Shortlisted'].includes(row.status) && (
            <Button
              label="Reject"
              size="small"
              variant="outlined"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => handleStatusChange(row.id, 'Rejected')}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Beneficiary Selection"
      description="Review, shortlist, and process committee approvals for applicants."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Beneficiary Selection' },
      ]}
    >
      <FormCard
        title="Applicants"
        headerAction={
          <div className="flex items-center gap-3">
            <div className="w-64 [&_.input-block]:!mb-0">
              <DropDownList
                data={schemeOptions}
                value={selectedSchemeFilter}
                textField="text"
                valueField="value"
                placeholder="Filter by Scheme"
                defaultOptionText="Filter by Scheme"
                onChange={val =>
                  setSelectedSchemeFilter((val as string) || 'All')
                }
              />
            </div>
            <Button
              label="Export Shortlist"
              icon="download"
              variant="outlined"
              className="!h-10 !py-0 flex items-center"
            />
          </div>
        }
      >
        <GridPanel columns={columns} data={filteredApps} />
      </FormCard>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
        <strong>Workflow:</strong> Applied → Eligible (System/Manual) →
        Shortlisted (Admin) → Selected (Committee Approval).
      </div>
    </FormPage>
  );
}
